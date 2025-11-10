const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const routes = require('./routes');
const { sendError } = require('./utils/response');
const { prisma } = require('./utils/prisma');

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://codesingh.in',
    'https://www.codesingh.in',
    'http://codesingh.in',
    'http://www.codesingh.in',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'EdTech Platform API (Prisma)', version: '1.0.0', docs: '/api/health' });
});

app.use('*', (req, res) => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
});

app.use((error, req, res, next) => {
  console.error('Error:', error);
  sendError(res, error.message || 'Internal server error', error.status || 500);
});

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL !== '1') {
  const startServer = async () => {
    try {
      await prisma.$connect();
      console.log('Database connected successfully');
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
      });
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    }
  };
  startServer();
}

module.exports = app;


