const mongo = require('mongodb').MongoClient;

const mongoUrl = process.env.MONGO_URI;

const connectionUrl = mongoUrl || 'mongodb://localhost:27017/';

const dbName = 'newsdb';

let db;
let storiesCollection;

const init = () => mongo.connect(connectionUrl,
  { useNewUrlParser: true, useUnifiedTopology: true }).then((client) => {
  db = client.db(dbName);
  storiesCollection = db.collection('stories');
  console.log('Connected to DB');
}).catch((err) => {
  console.log(err, 'Error in DB Connection');
});

// create new story if doesnt exist
const insertStory = (story) => storiesCollection.replaceOne(
  { id: story.id }, story, { upsert: true },
);

const getStories = (options = {}) => storiesCollection.find(options).toArray();

module.exports = { init, insertStory, getStories };
