const ResourceLink = require('../models/ResourceLink');

const isValidUrl = (value) => {
  try {
    const parsedUrl = new URL(value);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

const normaliseTags = (tags) => (Array.isArray(tags) ? tags : String(tags || '').split(','))
  .map((tag) => String(tag).trim())
  .filter(Boolean);

const getResources = async (req, res) => {
  try {
    const resources = await ResourceLink.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addResource = async (req, res) => {
  const { title, description, category, tags, url } = req.body;
  if (!title?.trim() || !category?.trim() || !isValidUrl(url)) {
    return res.status(400).json({ message: 'Title, category, and a valid HTTP(S) URL are required.' });
  }

  try {
    const resource = await ResourceLink.create({
      userId: req.user.id,
      title: title.trim(),
      description: description?.trim() || '',
      category: category.trim(),
      tags: normaliseTags(tags),
      url: url.trim(),
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateResource = async (req, res) => {
  const { title, description, category, tags, url } = req.body;
  if (!title?.trim() || !category?.trim() || !isValidUrl(url)) {
    return res.status(400).json({ message: 'Title, category, and a valid HTTP(S) URL are required.' });
  }

  try {
    const resource = await ResourceLink.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resource) return res.status(404).json({ message: 'Resource not found.' });

    resource.title = title.trim();
    resource.description = description?.trim() || '';
    resource.category = category.trim();
    resource.tags = normaliseTags(tags);
    resource.url = url.trim();
    res.json(await resource.save());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await ResourceLink.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!resource) return res.status(404).json({ message: 'Resource not found.' });
    res.json({ message: 'Resource deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getResources, addResource, updateResource, deleteResource };
