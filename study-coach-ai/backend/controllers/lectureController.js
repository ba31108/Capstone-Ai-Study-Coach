const Lecture = require('../models/Lecture');
const Topic = require('../models/Topic');
const Quiz = require('../models/Quiz');
const StudyPlan = require('../models/StudyPlan');
const { extractTextFromBuffer } = require('../services/pdfService');
const {
  extractSummaryAndConcepts,
  generateQuizFromText,
  generateStudyPlanFromText,
} = require('../services/lectureAiService');

// ─── Shared upload logic ──────────────────────────────────────────────────────

async function processAndSaveLecture(req, res, overrides = {}) {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF file.' });
  }

  let extractedText;
  try {
    extractedText = await extractTextFromBuffer(req.file.buffer);
  } catch {
    return res.status(422).json({
      message: 'Could not read the PDF. Make sure it contains selectable text (not a scanned image).',
    });
  }

  if (!extractedText || extractedText.trim().split(/\s+/).length < 50) {
    return res.status(422).json({
      message:
        'The uploaded PDF does not contain enough readable lecture text to generate a quiz. ' +
        'Please upload a clearer lecture PDF.',
    });
  }

  const { summary, keyConcepts, learningObjectives, whatStudentShouldLearn } =
    extractSummaryAndConcepts(extractedText);

  const lectureTitle =
    (req.body.title && req.body.title.trim()) ||
    req.file.originalname.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ');

  const lecture = await Lecture.create({
    userId: req.user._id,
    subjectId: overrides.subjectId || req.body.subjectId || null,
    topicId: overrides.topicId || req.body.topicId || null,
    title: lectureTitle,
    originalFileName: req.file.originalname,
    extractedText,
    summary,
    keyConcepts,
    learningObjectives,
    whatStudentShouldLearn,
    wordCount: extractedText.split(/\s+/).length,
  });

  await lecture.populate('subjectId', 'name');
  await lecture.populate('topicId', 'title');

  return res.status(201).json({
    _id: lecture._id,
    title: lecture.title,
    originalFileName: lecture.originalFileName,
    summary: lecture.summary,
    keyConcepts: lecture.keyConcepts,
    learningObjectives: lecture.learningObjectives,
    whatStudentShouldLearn: lecture.whatStudentShouldLearn,
    wordCount: lecture.wordCount,
    subjectId: lecture.subjectId,
    topicId: lecture.topicId,
    createdAt: lecture.createdAt,
  });
}

// ─── Standalone upload (existing Smart Learning page) ─────────────────────────

const uploadLecture = (req, res) => processAndSaveLecture(req, res);

// ─── Topic-scoped upload (Topics → Topic Detail → Upload) ────────────────────

const uploadLectureToTopic = async (req, res) => {
  const topic = await Topic.findOne({ _id: req.params.topicId, userId: req.user._id });
  if (!topic) return res.status(404).json({ message: 'Topic not found or not authorized.' });
  return processAndSaveLecture(req, res, {
    topicId: topic._id,
    subjectId: topic.subjectId || null,
  });
};

// ─── List lectures for a topic ────────────────────────────────────────────────

const getLecturesByTopic = async (req, res) => {
  const topic = await Topic.findOne({ _id: req.params.topicId, userId: req.user._id });
  if (!topic) return res.status(404).json({ message: 'Topic not found or not authorized.' });

  const lectures = await Lecture.find({ topicId: req.params.topicId, userId: req.user._id })
    .select('-extractedText')
    .sort({ createdAt: -1 });

  res.json(lectures);
};

// ─── Standard CRUD ────────────────────────────────────────────────────────────

const getLectures = async (req, res) => {
  const lectures = await Lecture.find({ userId: req.user._id })
    .populate('subjectId', 'name')
    .populate('topicId', 'title')
    .select('-extractedText')
    .sort({ createdAt: -1 });
  res.json(lectures);
};

const getLectureById = async (req, res) => {
  const lecture = await Lecture.findById(req.params.id)
    .populate('subjectId', 'name')
    .populate('topicId', 'title')
    .select('-extractedText');
  if (!lecture) return res.status(404).json({ message: 'Lecture not found.' });
  if (lecture.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized.' });
  }
  res.json(lecture);
};

const deleteLecture = async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: 'Lecture not found.' });
  if (lecture.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized.' });
  }
  await Lecture.deleteOne({ _id: req.params.id });
  res.json({ message: 'Lecture deleted.' });
};

// ─── Quiz generation from lecture PDF ────────────────────────────────────────

const generateLectureQuiz = async (req, res) => {
  const lecture = await Lecture.findById(req.params.id)
    .populate('subjectId', 'name')
    .populate('topicId', 'title');
  if (!lecture) return res.status(404).json({ message: 'Lecture not found.' });
  if (lecture.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized.' });
  }

  let questions;
  try {
    questions = generateQuizFromText(lecture.extractedText, lecture.title);
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }

  if (!questions || questions.length < 2) {
    return res.status(422).json({
      message:
        'The uploaded PDF does not contain enough readable lecture text to generate a quiz. ' +
        'Please upload a clearer lecture PDF.',
    });
  }

  const quiz = await Quiz.create({
    title: `Quiz: ${lecture.title}`,
    questions,
    lectureId: lecture._id,
    topicId: lecture.topicId?._id || null,
    subjectId: lecture.subjectId?._id || null,
    userId: req.user._id,
  });

  res.status(201).json(quiz);
};

// ─── Study plan generation from lecture PDF ───────────────────────────────────

const generateLectureStudyPlan = async (req, res) => {
  const lecture = await Lecture.findById(req.params.id)
    .populate('subjectId', 'name')
    .populate('topicId', 'title');
  if (!lecture) return res.status(404).json({ message: 'Lecture not found.' });
  if (lecture.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized.' });
  }

  let result;
  try {
    result = generateStudyPlanFromText(
      lecture.extractedText,
      lecture.title,
      lecture.subjectId?.name || '',
      lecture.topicId?.title || ''
    );
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }

  const { plan, keyConcepts, summary, recommendations } = result;

  const studyPlan = await StudyPlan.create({
    title: `Study Plan: ${lecture.title}`,
    plan,
    learningGoal: `Master the concepts from this lecture: ${lecture.title}`,
    availableTime: '',
    recommendations,
    lectureId: lecture._id,
    topicId: lecture.topicId?._id || null,
    subjectId: lecture.subjectId?._id || null,
    userId: req.user._id,
  });

  res.status(201).json({ ...studyPlan.toObject(), keyConcepts });
};

module.exports = {
  uploadLecture,
  uploadLectureToTopic,
  getLectures,
  getLecturesByTopic,
  getLectureById,
  deleteLecture,
  generateLectureQuiz,
  generateLectureStudyPlan,
};
