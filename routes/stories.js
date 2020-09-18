const express = require('express');

const router = express.Router();

const StoryService = require('../services/stories');

/* GET users listing. */
router.get('/top-stories', async (req, res, next) => {
  const storyServiceInstance = new StoryService();

  return storyServiceInstance.getTopStories().then(
    (stories) => res.json({ stories }),
  ).catch(next);
});

router.get('/past-stories', async (req, res, next) => {
  const storyServiceInstance = new StoryService();

  return storyServiceInstance.getPastStories().then(
    (stories) => res.json({ stories }),
  ).catch(next);
});

router.get('/comments', async (req, res, next) => {
  const params = req.query;
  const { storyId } = params;
  if (!storyId) {
    return next(new Error('storyId required in params'));
  }
  const storyServiceInstance = new StoryService();

  return storyServiceInstance.getComments(storyId).then(
    (comments) => res.json({ comments }),
  ).catch(next);
});

module.exports = router;
