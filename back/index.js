const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const expressWs = require('express-ws');

const users = require('./app/users');
const event = require('./app/event');
const config = require('./config');

const app = express();
const port = 8000;

expressWs(app);

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const run = async () => {
  await mongoose.connect(config.database, config.databaseOptions);

  app.use('/users', users);
  app.ws('/event', event);

  app.listen(port, () => {
    console.log(`HTTP Server started on ${port} port!`);
  });
};

run().catch(e => {
  console.error(e);
});