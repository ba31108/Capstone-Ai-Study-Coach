const StudyPlan = require('../models/StudyPlan');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const { generateStudyPlan } = require('../services/aiService');

// POST /api/study-plans/generate
const generateStudyPlanHandler = async (req, res) => {
  try {
    const { topicId, learningGoal, availableTime } = req.body;

    if (!topicId) {
      return res.status(400).json({ message: 'topicId is required' });
    }

    const topic = await Topic.findOne({ _id: topicId, userId: req.user._id });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found or not authorized' });
    }

    const subject = await Subject.findById(topic.subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const goal = learningGoal || 'Understand the topic thoroughly';
    const time = availableTime || '45 minutes';

    const { plan, recommendations } = generateStudyPlan(topic, subject, goal, time);

    const studyPlan = await StudyPlan.create({
      title: `Study Plan: ${topic.title}`,
      plan,
      learningGoal: goal,
      availableTime: time,
      recommendations,
      topicId: topic._id,
      subjectId: subject._id,
      userId: req.user._id,
    });

    // Mark topic as in_progress if it was not_started
    if (topic.status === 'not_started') {
      topic.status = 'in_progress';
      await topic.save();
    }

    res.status(201).json(studyPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/study-plans
const getStudyPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ userId: req.user._id })
      .populate('topicId', 'title difficulty status')
      .populate('subjectId', 'name')
      .sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/study-plans/:id
const getStudyPlanById = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('topicId', 'title difficulty status description')
      .populate('subjectId', 'name');

    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/study-plans/:id
const deleteStudyPlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, userId: req.user._id });

    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    await plan.deleteOne();
    res.json({ message: 'Study plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateStudyPlanHandler, getStudyPlans, getStudyPlanById, deleteStudyPlan };
