const KnowledgeBase = require('../models/KnowledgeBase');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all knowledge base items
// @route   GET /api/v1/knowledge-base
// @access  Public
exports.getKnowledgeBaseItems = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  
  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = KnowledgeBase.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await KnowledgeBase.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const knowledgeBaseItems = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: knowledgeBaseItems.length,
    pagination,
    data: knowledgeBaseItems
  });
});

// @desc    Get single knowledge base item
// @route   GET /api/v1/knowledge-base/:id
// @access  Public
exports.getKnowledgeBaseItem = asyncHandler(async (req, res, next) => {
  const knowledgeBaseItem = await KnowledgeBase.findById(req.params.id);

  if (!knowledgeBaseItem) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: knowledgeBaseItem
  });
});

// @desc    Create new knowledge base item
// @route   POST /api/v1/knowledge-base
// @access  Private/Admin
exports.createKnowledgeBaseItem = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const knowledgeBaseItem = await KnowledgeBase.create(req.body);

  res.status(201).json({
    success: true,
    data: knowledgeBaseItem
  });
});

// @desc    Update knowledge base item
// @route   PUT /api/v1/knowledge-base/:id
// @access  Private/Admin
exports.updateKnowledgeBaseItem = asyncHandler(async (req, res, next) => {
  let knowledgeBaseItem = await KnowledgeBase.findById(req.params.id);

  if (!knowledgeBaseItem) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin or the creator
  if (knowledgeBaseItem.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this resource`, 401)
    );
  }

  knowledgeBaseItem = await KnowledgeBase.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: knowledgeBaseItem });
});

// @desc    Delete knowledge base item
// @route   DELETE /api/v1/knowledge-base/:id
// @access  Private/Admin
exports.deleteKnowledgeBaseItem = asyncHandler(async (req, res, next) => {
  const knowledgeBaseItem = await KnowledgeBase.findById(req.params.id);

  if (!knowledgeBaseItem) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin or the creator
  if (knowledgeBaseItem.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete this resource`, 401)
    );
  }

  await knowledgeBaseItem.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Search knowledge base
// @route   GET /api/v1/knowledge-base/search
// @access  Public
exports.searchKnowledgeBase = asyncHandler(async (req, res, next) => {
  if (!req.query.q) {
    return next(new ErrorResponse('Please provide a search term', 400));
  }

  const searchQuery = req.query.q;
  const items = await KnowledgeBase.find(
    { $text: { $search: searchQuery } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});
