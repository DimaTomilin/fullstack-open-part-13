const router = require('express').Router();
require('express-async-errors');
const { tokenExtractor } = require('../util/middleware');
const { Op } = require('sequelize');

const { Blog } = require('../models');
const { User } = require('../models');

router.get('/', async (req, res) => {
  let blogs;
  if (req.query.search) {
    blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name'],
      },
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: '%' + req.query.search + '%' } },
          { author: { [Op.iLike]: '%' + req.query.search + '%' } },
        ],
      },
      order: [['likes', 'DESC']],
    });
  } else {
    blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name'],
      },
      order: [['likes', 'DESC']],
    });
  }
  res.json(blogs);
});

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
    date: new Date(),
  });
  res.json(blog);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedBlog = await Blog.increment('likes', {
    by: 1,
    where: { id: id },
  });
  res.json({ likes: updatedBlog[0][0][0].likes });
});

router.delete('/:id', tokenExtractor, async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByPk(id);

  if (blog.userId === req.decodedToken.id) {
    await Blog.destroy({
      where: { id: id },
    });
    res.json(`Deleted blog with id: ${id}`);
  } else {
    res.json(`You don't have access to delete blog with id: ${id}`);
  }
});

module.exports = router;
