const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path'); // Missing this for file paths

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Import error handlers
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, // allows cookies to be sent
    exposedHeaders: ['set-cookie']
}));

// Serve static files (for uploaded room images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Test route
app.get('/', (req, res) => {
    res.send('Hotel Booking API');
});

// Routes
app.use('/api/auth', authRoutes); // Changed to /api/auth for consistency
app.use('/api/rooms', roomRoutes); // Changed to /api/rooms
app.use('/api/bookings', bookingRoutes); // Changed to /api/bookings

// Error Handling - Must come after all other middleware and routes
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));