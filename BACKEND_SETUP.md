# Photography Portfolio Backend Setup

This document provides complete setup and deployment instructions for the photography portfolio backend.

## 🏗️ Architecture Overview

- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (file-based)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Authentication**: JWT-based with simple password
- **API**: RESTful endpoints

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── db/             # Database schema and connection
│   ├── middleware/     # Authentication middleware
│   ├── routes/         # API routes
│   ├── services/       # External services (R2)
│   ├── types/          # TypeScript type definitions
│   └── index.ts        # Main server file
├── package.json
├── tsconfig.json
├── Dockerfile
└── railway.json
```

## 🚀 Local Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Cloudflare R2 account

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DATABASE_PATH=./database.sqlite

# Authentication
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_key_here

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your_domain.com

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 3. Cloudflare R2 Setup

1. **Create R2 Bucket**:
   - Go to Cloudflare Dashboard → R2 Object Storage
   - Create a new bucket
   - Note the bucket name

2. **Create API Token**:
   - Go to R2 → Manage R2 API tokens
   - Create a new token with R2 permissions
   - Note the Account ID, Access Key ID, and Secret Access Key

3. **Configure CORS** (if needed):
   - In your R2 bucket settings, add CORS rules for your frontend domain

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify token

### Media Management
- `GET /api/media` - Get all media
- `GET /api/media/category/:category` - Get media by category
- `GET /api/media/:id` - Get specific media
- `POST /api/media/upload` - Upload new media (protected)
- `PUT /api/media/:id` - Update media (protected)
- `DELETE /api/media/:id` - Delete media (protected)

### Text Content
- `GET /api/text-content` - Get all text content
- `GET /api/text-content/:key` - Get specific text content
- `PUT /api/text-content` - Update text content (protected)
- `PUT /api/text-content/multiple` - Update multiple text content (protected)

### Health Check
- `GET /health` - Server health status

## 🐳 Docker Deployment

### Build Docker Image

```bash
cd backend
docker build -t photography-backend .
```

### Run Container

```bash
docker run -p 3001:3001 \
  -e ADMIN_PASSWORD=your_password \
  -e JWT_SECRET=your_jwt_secret \
  -e R2_ACCOUNT_ID=your_account_id \
  -e R2_ACCESS_KEY_ID=your_access_key_id \
  -e R2_SECRET_ACCESS_KEY=your_secret_access_key \
  -e R2_BUCKET_NAME=your_bucket_name \
  -e R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com \
  -e R2_PUBLIC_URL=https://your_domain.com \
  photography-backend
```

## 🚂 Railway Deployment

1. **Connect Repository**:
   - Go to Railway.app
   - Connect your GitHub repository
   - Select the backend folder

2. **Set Environment Variables**:
   - In Railway dashboard, go to Variables tab
   - Add all environment variables from `.env`

3. **Deploy**:
   - Railway will automatically build and deploy
   - Your API will be available at the provided Railway URL

## 🌐 Render Deployment

1. **Create New Web Service**:
   - Go to Render.com
   - Connect your GitHub repository
   - Select "Web Service"

2. **Configure Build**:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Root Directory: `backend`

3. **Set Environment Variables**:
   - Add all environment variables from `.env`

4. **Deploy**:
   - Render will build and deploy your service

## 🔒 Security Considerations

1. **Environment Variables**:
   - Never commit `.env` files
   - Use strong passwords and JWT secrets
   - Rotate secrets regularly

2. **CORS Configuration**:
   - Only allow your frontend domain
   - Update CORS settings for production

3. **File Upload Security**:
   - File type validation
   - File size limits (50MB)
   - Virus scanning (recommended for production)

4. **Database Security**:
   - SQLite file permissions
   - Regular backups
   - Consider PostgreSQL for production

## 📊 Monitoring & Logging

### Health Check
The server provides a health check endpoint at `/health` that returns:
- Server status
- Timestamp
- Environment information

### Logging
- Morgan for HTTP request logging
- Console logging for errors
- Consider adding structured logging for production

## 🔄 Database Management

### Schema Migration
The database schema is automatically created on first run. To reset:

```bash
rm database.sqlite
npm run dev
```

### Backup
```bash
cp database.sqlite database_backup_$(date +%Y%m%d_%H%M%S).sqlite
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check `FRONTEND_URL` environment variable
   - Verify frontend is running on correct port

2. **R2 Upload Failures**:
   - Verify R2 credentials
   - Check bucket permissions
   - Ensure CORS is configured

3. **Database Errors**:
   - Check file permissions
   - Verify database path
   - Ensure directory exists

4. **Authentication Issues**:
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear browser storage

### Debug Mode
Set `NODE_ENV=development` for detailed error messages.

## 📈 Performance Optimization

1. **Database**:
   - Add indexes for frequently queried fields
   - Consider connection pooling for high traffic

2. **File Storage**:
   - Use CDN for static assets
   - Implement image optimization
   - Consider multiple storage regions

3. **Caching**:
   - Implement Redis for session storage
   - Add response caching
   - Use CDN caching

## 🔄 Updates & Maintenance

### Updating Dependencies
```bash
npm update
npm audit fix
```

### Database Migrations
For schema changes, create migration scripts in `src/db/migrations/`.

### Monitoring
- Set up uptime monitoring
- Monitor error rates
- Track API usage

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Verify environment configuration
4. Test API endpoints individually

## 🎯 Next Steps

1. Set up monitoring and alerting
2. Implement automated backups
3. Add rate limiting
4. Set up CI/CD pipeline
5. Add comprehensive testing
6. Implement admin analytics dashboard
