const mongo = require('mongodb').MongoClient;

const connectionUrl = 'mongodb://localhost:27017';

const dbName = 'newsdb';

let db;
let storiesCollection;

const init = () => mongo.connect(connectionUrl,
  { useNewUrlParser: true, useUnifiedTopology: true }).then((client) => {
  db = client.db(dbName);
  storiesCollection = db.collection('stories');
  console.log('Connected to DB');
});

// create new story if doesnt exist
const insertStory = (story) => storiesCollection.replaceOne(
  { id: story.id }, story, { upsert: true },
).catch((err) => {
  console.log(err);
  throw err;
});

const getStories = (options = {}) => storiesCollection.find(options).toArray();

module.exports = { init, insertStory, getStories };
