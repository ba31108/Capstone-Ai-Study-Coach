const User = require('../models/User');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const StudyPlan = require('../models/StudyPlan');
const Lecture = require('../models/Lecture');
const Resource = require('../models/Resource');

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────

const getStats = async (req, res) => {
  const [
    totalStudents,
    totalSubjects,
    totalTopics,
    totalLectures,
    totalQuizzes,
    totalQuizResults,
    totalStudyPlans,
    totalResources,
    publishedResources,
    draftResources,
    archivedResources,
    recentStudents,
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    Subject.countDocuments(),
    Topic.countDocuments(),
    Lecture.countDocuments(),
    Quiz.countDocuments(),
    QuizResult.countDocuments(),
    StudyPlan.countDocuments(),
    Resource.countDocuments(),
    Resource.countDocuments({ status: 'published' }),
    Resource.countDocuments({ status: 'draft' }),
    Resource.countDocuments({ status: 'archived' }),
    User.find({ role: 'student' })
      .select('name email gradeLevel createdAt')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  res.json({
    totalStudents,
    totalSubjects,
    totalTopics,
    totalLectures,
    totalQuizzes,
    totalQuizResults,
    totalStudyPlans,
    totalResources,
    publishedResources,
    draftResources,
    archivedResources,
    recentStudents,
  });
};

// ─── GET /api/admin/students ──────────────────────────────────────────────────

const getStudents = async (req, res) => {
  const students = await User.find({ role: 'student' })
    .select('-password')
    .sort({ createdAt: -1 });

  const studentsWithCounts = await Promise.all(
    students.map(async (s) => {
      const [subjects, topics, quizzes, quizResults, studyPlans] = await Promise.all([
        Subject.countDocuments({ userId: s._id }),
        Topic.countDocuments({ userId: s._id }),
        Quiz.countDocuments({ userId: s._id }),
        QuizResult.countDocuments({ userId: s._id }),
        StudyPlan.countDocuments({ userId: s._id }),
      ]);
      return {
        _id: s._id,
        name: s.name,
        email: s.email,
        gradeLevel: s.gradeLevel,
        role: s.role,
        createdAt: s.createdAt,
        subjects,
        topics,
        quizzes,
        quizResults,
        studyPlans,
      };
    })
  );

  res.json(studentsWithCounts);
};

// ─── GET /api/admin/students/:id ─────────────────────────────────────────────

const getStudentById = async (req, res) => {
  const student = await User.findById(req.params.id).select('-password');
  if (!student || student.role !== 'student') {
    return res.status(404).json({ message: 'Student not found.' });
  }

  const [subjects, topics, quizzes, quizResults, studyPlans, lectures] = await Promise.all([
    Subject.countDocuments({ userId: student._id }),
    Topic.countDocuments({ userId: student._id }),
    Quiz.countDocuments({ userId: student._id }),
    QuizResult.find({ userId: student._id }).select('percentage weakAreas createdAt').sort({ createdAt: -1 }).limit(10),
    StudyPlan.countDocuments({ userId: student._id }),
    Lecture.countDocuments({ userId: student._id }),
  ]);

  const avgScore = quizResults.length
    ? Math.round(quizResults.reduce((sum, r) => sum + r.percentage, 0) / quizResults.length)
    : null;

  const weakAreasSet = new Set();
  quizResults.forEach((r) => r.weakAreas.forEach((w) => weakAreasSet.add(w)));
  const weakAreas = [...weakAreasSet].slice(0, 8);

  res.json({
    student: {
      _id: student._id,
      name: student.name,
      email: student.email,
      gradeLevel: student.gradeLevel,
      role: student.role,
      createdAt: student.createdAt,
    },
    stats: {
      subjects,
      topics,
      quizzes,
      quizResultsCount: quizResults.length,
      studyPlans,
      lectures,
      avgScore,
      weakAreas,
    },
    recentQuizResults: quizResults.slice(0, 5),
  });
};

// ─── Admin Resource CRUD ──────────────────────────────────────────────────────

const getAdminResources = async (req, res) => {
  const { category, status, search } = req.query;
  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (status && status !== 'All') filter.status = status;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const resources = await Resource.find(filter)
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json(resources);
};

const createResource = async (req, res) => {
  const {
    title, category, level, description, content,
    keyPoints, recommendedPractice, estimatedReadingTime, status,
  } = req.body;

  if (!title || !category || !level || !description) {
    return res.status(400).json({ message: 'Title, category, level, and description are required.' });
  }

  const resource = await Resource.create({
    title,
    category,
    level,
    description,
    content: content || '',
    keyPoints: Array.isArray(keyPoints) ? keyPoints : [],
    recommendedPractice: Array.isArray(recommendedPractice) ? recommendedPractice : [],
    estimatedReadingTime: estimatedReadingTime || '~20 min',
    status: status || 'draft',
    createdBy: req.user._id,
  });

  res.status(201).json(resource);
};

const updateResource = async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ message: 'Resource not found.' });

  const fields = [
    'title', 'category', 'level', 'description', 'content',
    'keyPoints', 'recommendedPractice', 'estimatedReadingTime', 'status',
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) resource[f] = req.body[f];
  });

  const updated = await resource.save();
  res.json(updated);
};

const deleteResource = async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ message: 'Resource not found.' });
  await Resource.deleteOne({ _id: req.params.id });
  res.json({ message: 'Resource deleted.' });
};

const patchResourceStatus = async (req, res) => {
  const { status } = req.body;
  if (!['published', 'draft', 'archived'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }
  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!resource) return res.status(404).json({ message: 'Resource not found.' });
  res.json(resource);
};

module.exports = {
  getStats,
  getStudents,
  getStudentById,
  getAdminResources,
  createResource,
  updateResource,
  deleteResource,
  patchResourceStatus,
};
