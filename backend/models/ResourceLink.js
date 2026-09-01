const mongoose = require('mongoose');

const resourceLinkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  category: { type: String, required: true, trim: true },
  tags: [{ type: String, trim: true }],
  url: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('ResourceLink', resourceLinkSchema);
