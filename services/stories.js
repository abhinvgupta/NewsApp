/* eslint-disable implicit-arrow-linebreak */

const NodeCache = require('node-cache');

const HackerNewsApi = require('../controllers/hackerNewsApi');

const { insertStory, getStories } = require('../db');
const { cacheTTL } = require('../constants');
const { compareCommentsSize, getUserAge } = require('./helpers');

const myCache = new NodeCache({ checkperiod: 60 });

class StoryService {
  constructor() {
    this.HackerNewsApiController = new HackerNewsApi();
  }

  async getTopStories() {
    // check cache
    const existingStories = myCache.keys();

    // return cached stories if cache exists
    if (existingStories && existingStories.length === 10) {
      let cachedStories = myCache.mget(existingStories);
      cachedStories = Object.keys(cachedStories).map((id) => cachedStories[id]);
      return cachedStories;
    }
    if (existingStories.length) {
      // if cache has odd no. of stories , flush cache
      myCache.flushAll();
    }

    // hit hacker news api to get top stories ids
    let topStories = await this.HackerNewsApiController.getTopStories();
    // get top 10 story ids
    topStories = topStories.slice(0, 10);

    const promiseArray = topStories.map(
      (storyId) => this.HackerNewsApiController.getNewsItem(storyId).then((story) => {
        const {
          id, url, title, score, by, time,
        } = story;
        return {
          id, url, title, score, by, time,
        };
      }),
    );

    topStories = await Promise.all(promiseArray);

    //  add stories to cache
    // add stories to mongo async
    topStories.forEach((story) => {
      myCache.set(story.id, story, cacheTTL);
      return insertStory(story);
    });

    return topStories;
  }

  getPastStories() {
    // return all studies stored in db
    return getStories();
  }

  async getComments(storyId) {
    const story = await this.HackerNewsApiController.getNewsItem(storyId);
    const commentIds = story.kids.slice(0, 10);
    const commentsPromise = commentIds.map((commentId) =>
    // get all 10 comments
      this.HackerNewsApiController.getNewsItem(commentId).then((comment) =>
        // get comment user
        this.HackerNewsApiController.getUserInfo(comment.by).then((user) => {
          // calculate user age
          const userAge = getUserAge(user.created);

          return { ...comment, userAge };
        })));
    // get user ids for each comment
    let comments = await Promise.all(commentsPromise);
    // sort comments acc. to comment thread size
    comments.sort(compareCommentsSize);

    comments = comments.map((c) => {
      const {
        id, by, userAge, text,
      } = c;
      return {
        id, by, userAge, text,
      };
    });
    return comments;
  }
}

module.exports = StoryService;
