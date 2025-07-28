require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

const app = express();
const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
