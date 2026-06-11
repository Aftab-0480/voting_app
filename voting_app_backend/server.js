const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
const {jwtAuthMiddleware} = require('./jwt');
const cors = require('cors');


// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use(
  cors({
    origin: [
      "https://voting-app-nine-mocha.vercel.app/",
      "https://voting-app-v80e.onrender.com"
    ],
    credentials: true
  })
);
// Use the router files
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


app.listen(PORT, ()=> {
    console.log(`listening at port: ${PORT}`);
})