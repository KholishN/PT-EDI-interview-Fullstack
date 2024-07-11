const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./src/routes/index.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000', // Sesuaikan dengan URL frontend Anda
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'Location'],
  exposedHeaders: ['Location'],
  credentials: true // Memungkinkan pengiriman cookies dari frontend
};

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
