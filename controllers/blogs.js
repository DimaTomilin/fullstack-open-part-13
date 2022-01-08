const router = require('express').Router();
require('express-async-errors');
const { tokenExtractor } = require('../middleware/login');

const { Blog } = require('../models');
const { User } = require('../models');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
  });
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

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Blog.destroy({
    where: { id: id },
  });
  res.json(`Deleted blog with id: ${id}`);
});

module.exports = router;
