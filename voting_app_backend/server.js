const express = require('express');
const app = express();
const cors = require('cors'); // Moved up
const db = require('./db');
require('dotenv').config();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const { jwtAuthMiddleware } = require('./jwt');

// 1. ALWAYS PLACE CORS FIRST
app.use(
  cors({
    origin: [
      "https://voting-app-nine-mocha.vercel.app",
      "http://localhost:5173" // Removed backend URL as it is redundant
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"] 
  })
);

// 2. OTHER MIDDLEWARES NEXT
app.use(bodyParser.json());

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// 3. ROUTES LAST
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => {
    console.log(`listening at port: ${PORT}`);
});