import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5174',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock API routes for testing
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: 'development',
    message: 'Backend is running! Supabase setup required for full functionality.'
  });
});

app.get('/api/media', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Mock data - Supabase setup required for real data'
  });
});

app.post('/api/login', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Supabase setup required for authentication'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Photography Portfolio Backend API',
    version: '1.0.0',
    status: 'Running in test mode',
    note: 'Supabase setup required for full functionality',
    endpoints: {
      health: '/api/health',
      media: '/api/media',
      login: '/api/login (requires Supabase)',
    },
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const startServer = () => {
  app.listen(PORT, () => {
    console.log('🚀 Photography Portfolio Backend Server');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📱 Frontend URL: http://localhost:5174`);
    console.log('⚠️  Running in TEST MODE - Supabase setup required for full functionality');
    console.log('✅ Server started successfully');
  });
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();
