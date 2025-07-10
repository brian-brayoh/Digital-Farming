const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide the content'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: {
        values: ['Crop Management', 'Smart Irrigation', 'Mobile Learning', 'Market Access', 'Community'],
        message: '{VALUE} is not a supported category',
      },
    },
    type: {
      type: String,
      required: [true, 'Please provide content type'],
      enum: {
        values: ['guide', 'video', 'article', 'community'],
        message: '{VALUE} is not a supported content type',
      },
    },
    level: {
      type: String,
      required: [true, 'Please provide difficulty level'],
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced', 'All'],
        message: '{VALUE} is not a supported difficulty level',
      },
    },
    duration: {
      type: String,
      required: [true, 'Please provide estimated duration'],
    },
    isOffline: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      default: '/uploads/knowledge-base/default.jpg',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add text index for search functionality
knowledgeBaseSchema.index({ title: 'text', description: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
