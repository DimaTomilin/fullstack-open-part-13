const router = require('express').Router();

const { User, Blog } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  });
  res.json(users);
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.put('/:username', async (req, res) => {
  const user = await User.update(
    { username: req.body.username },
    {
      where: { username: req.params.username },
    }
  );
  if (user[0]) {
    res.send('Updated');
  } else {
    return res.status(400).send('User don`t found');
  }
});

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
