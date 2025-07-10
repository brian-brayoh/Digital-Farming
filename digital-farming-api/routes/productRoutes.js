const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productPhotoUpload,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Product = require('../models/Product');

const router = express.Router();

// Public routes
router
  .route('/')
  .get(
    advancedResults(Product, {
      path: 'user',
      select: 'name email',
    }),
    getProducts
  );

router.route('/:id').get(getProduct);

// Protected routes (require authentication)
router.use(protect);

// Routes with file upload
router.route('/:id/photo').put(authorize('admin'), productPhotoUpload);

// Admin routes
router.use(authorize('admin'));

router.route('/').post(createProduct);
router.route('/:id').put(updateProduct).delete(deleteProduct);

module.exports = router;
