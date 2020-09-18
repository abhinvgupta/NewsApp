const express = require('express');
const router = require('./routes/stories.js');
const { init } = require('./db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

/* eslint-disable no-unused-vars */
// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  let errorMsg;
  if (typeof err === 'string') {
    errorMsg = err;
  } else {
    errorMsg = err.message;
  }
  res.status(err.status || 400);

  res.send({ error: errorMsg });
});

init().then(() => {
  const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
});

module.exports = app;
