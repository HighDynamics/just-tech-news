const router = require('express').Router();
const sequelize = require('sequelize');
const { Post, User, Vote } = require('../../models');

// GET all posts
router.get('/', (req, res) => {
  console.log('==='.repeat(5));
  Post.findAll({
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [
        sequelize.literal(
          '(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'
        ),
        'vote_count',
      ],
    ],
    order: [['created_at', 'DESC']],
    include: [
      {
        model: User,
        attributes: ['username'],
      },
    ],
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
    });
});

// GET post by id
router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [
        sequelize.literal(
          '(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'
        ),
        'vote_count',
      ],
    ],
    include: [
      {
        model: User,
        attributes: ['username'],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// CREATE post
router.post('/', (req, res) => {
  // expects {title, post_url, user_id}
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.body.user_id,
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// UPDATE post with upvote
router.put('/upvote', (req, res) => {
  // custom static method created in models/Post.js
  Post.upvote(req.body, { Vote })
    .then((updatedPostData) => res.json(updatedPostData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// UPDATE post
router.put('/:id', (req, res) => {
  Post.update(
    {
      title: req.body.title,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE post
router.delete('/:id', (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
