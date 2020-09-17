const NodeCache = require('node-cache');

const HackerNewsApi = require('../controllers/hackerNewsApi');

const { insertStory, getStories } = require('../db');
const { cacheTTL } = require('../constants');

const myCache = new NodeCache({ checkperiod: 60 });

class StoryService {
  constructor() {
    this.HackerNewsApiController = new HackerNewsApi();
  }

  async getTopStories() {
    // check cache
    const existingStories = myCache.keys();
    console.log(existingStories, 'existing');

    // return cached stories if cache exists
    if (existingStories && existingStories.length === 10) {
      let cachedStories = myCache.mget(existingStories);
      cachedStories = Object.keys(cachedStories).map((id) => cachedStories[id]);
      console.log(cachedStories, 'cachedddd');
      return cachedStories;
    }
    if (existingStories.length) {
      // if cache has odd no. of stories , flush cache
      myCache.flushAll();
    }

    // hit hacker news api
    let topStories = await this.HackerNewsApiController.getTopStories();
    // get top 10 stories
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

  }
}

module.exports = StoryService;
