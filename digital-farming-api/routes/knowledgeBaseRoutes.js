const express = require('express');
const {
  getKnowledgeBaseItems,
  getKnowledgeBaseItem,
  createKnowledgeBaseItem,
  updateKnowledgeBaseItem,
  deleteKnowledgeBaseItem,
  searchKnowledgeBase
} = require('../controllers/knowledgeBaseController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.route('/')
  .get(getKnowledgeBaseItems);

router.route('/search')
  .get(searchKnowledgeBase);

router.route('/:id')
  .get(getKnowledgeBaseItem);

// Protected routes (require authentication and authorization)
router.use(protect);

router.route('/')
  .post(authorize('admin', 'publisher'), createKnowledgeBaseItem);

router.route('/:id')
  .put(authorize('admin', 'publisher'), updateKnowledgeBaseItem)
  .delete(authorize('admin', 'publisher'), deleteKnowledgeBaseItem);

module.exports = router;
