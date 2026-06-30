const Topic = require('../models/Topic');
const Subject = require('../models/Subject');

// POST /api/topics
const createTopic = async (req, res) => {
  try {
    const { title, description, status, difficulty, subjectId } = req.body;

    if (!title || !subjectId) {
      return res.status(400).json({ message: 'Title and subjectId are required' });
    }

    // Verify the subject belongs to the user
    const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found or not authorized' });
    }

    const topic = await Topic.create({
      title,
      description,
      status: status || 'not_started',
      difficulty: difficulty || 'medium',
      subjectId,
      userId: req.user._id,
    });

    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/topics  (all topics for user)
const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ userId: req.user._id })
      .populate('subjectId', 'name')
      .sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/topics/subject/:subjectId
const getTopicsBySubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.subjectId, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found or not authorized' });
    }

    const topics = await Topic.find({ subjectId: req.params.subjectId, userId: req.user._id })
      .populate('subjectId', 'name')
      .sort({ createdAt: -1 });

    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/topics/:id
const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('subjectId', 'name');

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/topics/:id
const updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.id, userId: req.user._id });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const { title, description, status, difficulty } = req.body;
    if (title) topic.title = title;
    if (description !== undefined) topic.description = description;
    if (status) topic.status = status;
    if (difficulty) topic.difficulty = difficulty;

    const updated = await topic.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/topics/:id
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.id, userId: req.user._id });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    await topic.deleteOne();
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTopic, getTopics, getTopicsBySubject, getTopicById, updateTopic, deleteTopic };
