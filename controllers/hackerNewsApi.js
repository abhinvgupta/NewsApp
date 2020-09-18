const axios = require('axios');

class HackerNewsApi {
  getTopStories() {
    return axios.get('https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty').then((res) => {
      if (res.status !== 200 || !res.data) {
        throw new Error('Error in Hacker News Api-topstories ');
      }
      const stories = res.data;
      return stories;
    });
  }

  getNewsItem(id) {
    return axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`).then((res) => {
      if (res.status !== 200 || !res.data) {
        throw new Error('News Item not found');
      }
      const newsItem = res.data;
      return newsItem;
    });
  }

  getUserInfo(username) {
    return axios.get(`https://hacker-news.firebaseio.com/v0/user/${username}.json?print=pretty`).then((res) => {
      if (res.status !== 200 || !res.data) {
        throw new Error('User not found');
      }
      const user = res.data;
      return user;
    });
  }
}

module.exports = HackerNewsApi;
