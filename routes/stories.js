const express = require('express');

const router = express.Router();

const StoryService = require('../services/stories');

/* GET users listing. */
router.get('/top-stories', async (req, res, next) => {
  const storyServiceInstance = new StoryService();

  return storyServiceInstance.getTopStories().then((stories) => res.json({ stories })).catch(next);
});

router.get('/past-stories', async (req, res, next) => {
  const storyServiceInstance = new StoryService();

  return storyServiceInstance.getPastStories().then((stories) => res.json({ stories })).catch(next);
});

router.get('/comments', async (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
