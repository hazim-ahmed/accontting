const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./src/config/database');
const whatsappService = require('./src/services/whatsappService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/whatsapp', require('./src/routes/whatsappRoutes'));
app.use('/api/sync', require('./src/routes/syncRoutes'));

app.get('/', (req, res) => {
  res.send('Account & Debt API Backend is Running!');
});

// Start Server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Connect to DB
  await connectDB();
  
  // WhatsApp sessions initialize dynamically on-demand per tenant

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
