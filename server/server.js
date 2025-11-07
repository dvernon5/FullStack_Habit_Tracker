const express = require('express');
const path = require('path');
const connectDB = require('./config/db'); 
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../client/public')));

// Connect to MongoDB
connectDB().catch(err => console.error('Failed to connect to MongoDB:', err));

// Mount API routes
app.use('/api', apiRoutes);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});