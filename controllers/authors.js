const router = require('express').Router();
require('express-async-errors');
const sequelize = require('sequelize');

const { Blog } = require('../models');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('SUM', sequelize.col('likes')), 'total_likes'],
      [sequelize.fn('COUNT', sequelize.col('author')), 'total_blogs'],
    ],
    group: ['author'],
    order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']],
  });
  res.json(blogs);
});

module.exports = router;
