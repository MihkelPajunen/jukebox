/* eslint-disable no-undef */
const express = require('express');
const app = express();
const port = 4000;

const dotenv = require('dotenv');
dotenv.config();

app.use((_request, response, next) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const artists = require('./routes/artists');
app.use('/artists', artists);

const tracks = require('./routes/tracks');
app.use('/tracks', tracks);

const upload = require('./routes/upload');
app.use('/upload', upload);

app.listen(process.env.PORT || port, () => {
  console.log(`Express app listening on http://localhost:${process.env.PORT || port}`);
});
