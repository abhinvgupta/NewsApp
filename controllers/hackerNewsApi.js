const axios = require('axios');

class HackerNewsApi {
  getTopStories() {
    return axios.get('https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty').then((res) => {
      // console.log(res);
      if (res.status !== 200 || !res.data) {
        throw new Error('Error in Hacker News Api-topstories ');
      }
      const stories = res.data;
      return stories;
    });
  }

  getNewsItem(id) {
    return axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`).then((res) => {
      // console.log(res.data);
      if (res.status !== 200 || !res.data) {
        throw new Error('Error in Hacker News Api-getItem');
      }
      const newsItem = res.data;
      return newsItem;
    });
  }
}

module.exports = HackerNewsApi;
