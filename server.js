require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const app = express();

const userRoutes = require('./routes/userRoutes');
const simplehello = require('./middlewares/simple');

connectDB();

app.use(express.json())
app.use(simplehello)

const PORT = process.env.PORT || 4000;

app.use('/user/', userRoutes)

app.get('/', (req, res) => {
      console.log(req.body);
  res.send('Hello, World!');

  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
