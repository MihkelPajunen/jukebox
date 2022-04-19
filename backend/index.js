/* eslint-disable no-undef */
const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const artists = require('./routes/artists');
app.use('/artists', artists);

app.listen(process.env.PORT, () => {
  console.log(`Express app listening on http://localhost:${process.env.PORT}`);
});
