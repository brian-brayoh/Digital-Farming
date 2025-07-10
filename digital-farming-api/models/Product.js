const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpg',
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: {
        values: ['Fertilizers', 'Irrigation', 'Seeds', 'Tools', 'Others'],
        message: '{VALUE} is not supported',
      },
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
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

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

// Cascade delete reviews when a product is deleted
productSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ product: this._id });
  next();
});

module.exports = mongoose.model('Product', productSchema);
