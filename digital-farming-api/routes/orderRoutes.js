const express = require('express');
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStock,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes (none for orders)

// Protected routes (require authentication)
router.use(protect);

router.route('/').post(addOrderItems);
router.route('/myorders').get(getMyOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/pay').put(updateOrderToPaid);

// Admin routes
router.use(authorize('admin'));

router.route('/').get(getOrders);
router.route('/:id/deliver').put(updateOrderToDelivered);
router.route('/:id/updatestock').put(updateOrderStock);
router.route('/:id').delete(deleteOrder);

module.exports = router;
