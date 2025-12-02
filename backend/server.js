require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to be loaded from other domains
}));
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' }
});
// Apply rate limiting to all requests
app.use(limiter);

// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'http://localhost:3000'
        : '*', // Allow all in dev, restrict in prod
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/favorites', require('./routes/favoritesRoutes'));

// Base route
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API E-commerce Guinée' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Hide stack trace in production
    const errorResponse = {
        error: 'Une erreur est survenue!',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack, message: err.message })
    };

    res.status(500).json(errorResponse);
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
});
