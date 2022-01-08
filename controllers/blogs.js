const router = require('express').Router();

const { Blog } = require('../models');

console.log(
  '11111111111111111111111111111111111111111111111111111111111111111'
);

router.get('/', async (req, res) => {
  console.log('1');
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body);
  res.json(blog);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Blog.destroy({
    where: { id: id },
  });
  res.json(`Deleted blog with id: ${id}`);
});

module.exports = router;
