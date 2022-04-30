/* eslint-disable no-undef */
const express = require('express');
const app = express();
const port = 4000;

const dotenv = require('dotenv');
dotenv.config();

const artists = require('./routes/artists');
app.use('/artists', artists);

const tracks = require('./routes/tracks');
app.use('/tracks', tracks);

app.listen(process.env.PORT || port, () => {
  console.log(`Express app listening on http://localhost:${process.env.PORT || port}`);
});
