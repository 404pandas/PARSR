const router = require('express').Router();
const userRoutes = require('./userRoutes');
const petRoutes = require('./petRoutes');
const markerRoutes = require('./markerRoutes');
const postRoutes = require('./postRoutes');

// ROUTE: /api
router.use('/users', userRoutes);
router.use('/pets', petRoutes);
router.use('/markers', markerRoutes);
router.use('/posts', postRoutes);

module.exports = router;