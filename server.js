require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const app = express();

const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes')

const simplehello = require('./middlewares/simple');
const cookieParser = require("cookie-parser");
const cors = require("cors");

connectDB();

// 1. CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());
app.use(express.json())
app.use(simplehello)

const PORT = process.env.PORT || 4000;




app.use('/user', userRoutes)
app.use('/todo',todoRoutes )

app.get('/', (req, res) => {
      console.log(req.body);
  res.send('Hello, World!');

  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
