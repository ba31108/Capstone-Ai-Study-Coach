const Resource = require('../models/Resource');

// GET /api/resources — published only
const getResources = async (req, res) => {
  const { category } = req.query;
  const filter = { status: 'published' };
  if (category && category !== 'All') filter.category = category;

  const resources = await Resource.find(filter)
    .select('-content -createdBy')
    .sort({ createdAt: -1 });
  res.json(resources);
};

// GET /api/resources/:id — published only
const getResourceById = async (req, res) => {
  const resource = await Resource.findOne({ _id: req.params.id, status: 'published' });
  if (!resource) return res.status(404).json({ message: 'Resource not found.' });
  res.json(resource);
};

module.exports = { getResources, getResourceById };
