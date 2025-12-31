# Photography Portfolio - Complete Deployment Guide

This guide covers deploying both the frontend and backend of your photography portfolio website.

## 🏗️ Architecture Overview

- **Frontend**: React + Vite + TypeScript + Tailwind CSS (Vercel)
- **Backend**: Node.js + Express + TypeScript + SQLite (Railway/Render)
- **Storage**: Cloudflare R2
- **Database**: SQLite (file-based)

## 📋 Prerequisites

1. **Cloudflare R2 Account**
   - Sign up at [Cloudflare R2](https://www.cloudflare.com/products/r2/)
   - Create a bucket for media storage
   - Generate API credentials

2. **Vercel Account** (Frontend)
   - Sign up at [Vercel](https://vercel.com)
   - Connect your GitHub repository

3. **Railway Account** (Backend)
   - Sign up at [Railway](https://railway.app)
   - Connect your GitHub repository

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Cloudflare R2

1. **Create R2 Bucket**:
   ```
   - Go to Cloudflare Dashboard → R2 Object Storage
   - Click "Create bucket"
   - Name: `photography-portfolio-media`
   - Choose a region close to your users
   ```

2. **Generate API Token**:
   ```
   - Go to R2 → Manage R2 API tokens
   - Click "Create API token"
   - Name: `photography-portfolio`
   - Permissions: R2:Edit
   - Note down: Account ID, Access Key ID, Secret Access Key
   ```

3. **Configure CORS** (Optional):
   ```
   - In bucket settings → CORS
   - Add rule for your frontend domain
   - Origins: https://your-domain.vercel.app
   - Methods: GET, POST, PUT, DELETE
   - Headers: *
   ```

### Step 2: Deploy Backend to Railway

1. **Connect Repository**:
   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Choose "Deploy from a folder" → Select `backend` folder

2. **Configure Environment Variables**:
   ```
   ADMIN_PASSWORD=your_secure_password_here
   JWT_SECRET=your_jwt_secret_key_here
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key_id
   R2_SECRET_ACCESS_KEY=your_secret_access_key
   R2_BUCKET_NAME=photography-portfolio-media
   R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
   R2_PUBLIC_URL=https://your_domain.com
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   ```

3. **Deploy**:
   - Railway will automatically build and deploy
   - Note the generated URL (e.g., `https://your-app.railway.app`)

### Step 3: Deploy Frontend to Vercel

1. **Connect Repository**:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project" → Import from GitHub
   - Select your repository
   - Choose the root directory (not backend)

2. **Configure Build Settings**:
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   ```

3. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Note the generated URL (e.g., `https://your-app.vercel.app`)

### Step 4: Update CORS Configuration

1. **Update Backend CORS**:
   - Go to Railway dashboard → Your backend service
   - Update `FRONTEND_URL` to your actual Vercel URL
   - Redeploy if necessary

2. **Update R2 CORS** (if needed):
   - Update CORS rules in Cloudflare R2
   - Add your Vercel domain

### Step 5: Test Deployment

1. **Test Backend**:
   ```bash
   curl https://your-backend-url.railway.app/health
   ```

2. **Test Frontend**:
   - Visit your Vercel URL
   - Navigate to `/admin`
   - Try logging in with your admin password

3. **Test File Upload**:
   - Login to admin panel
   - Upload a test image
   - Verify it appears in the gallery

## 🔧 Alternative Backend Deployment (Render)

If you prefer Render over Railway:

1. **Create Web Service**:
   - Go to [Render](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   ```
   Name: photography-portfolio-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Set Environment Variables**:
   - Add all the same variables as Railway
   - Update `FRONTEND_URL` to your Vercel URL

## 🔒 Security Checklist

- [ ] Strong admin password set
- [ ] JWT secret is random and secure
- [ ] R2 credentials are properly configured
- [ ] CORS is configured for production domains
- [ ] Environment variables are not exposed in code
- [ ] HTTPS is enabled (automatic with Vercel/Railway)

## 📊 Monitoring Setup

### Railway Monitoring
- Built-in metrics and logs
- Set up alerts for downtime
- Monitor resource usage

### Vercel Analytics
- Enable Vercel Analytics
- Monitor page views and performance
- Set up error tracking

### Custom Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor API response times
- Track error rates

## 🔄 Updates and Maintenance

### Updating the Application

1. **Code Changes**:
   - Push changes to GitHub
   - Vercel and Railway will auto-deploy

2. **Environment Variables**:
   - Update in respective dashboards
   - Redeploy if necessary

3. **Database Backups**:
   - Railway: Automatic backups
   - Manual: Download database file

### Scaling Considerations

1. **High Traffic**:
   - Upgrade Railway plan
   - Consider PostgreSQL for database
   - Implement Redis for caching

2. **Large Media Files**:
   - Optimize images before upload
   - Consider CDN for delivery
   - Implement image resizing

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check `FRONTEND_URL` in backend
   - Verify R2 CORS configuration

2. **File Upload Failures**:
   - Verify R2 credentials
   - Check file size limits
   - Ensure bucket permissions

3. **Authentication Issues**:
   - Check JWT secret
   - Verify admin password
   - Clear browser storage

4. **Database Errors**:
   - Check Railway logs
   - Verify database file permissions
   - Consider database reset

### Debug Steps

1. **Check Logs**:
   - Railway: Service logs
   - Vercel: Function logs

2. **Test API Endpoints**:
   ```bash
   # Health check
   curl https://your-backend-url.railway.app/health
   
   # Test login
   curl -X POST https://your-backend-url.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@photography.com","password":"your_password"}'
   ```

3. **Verify Environment Variables**:
   - Check all required variables are set
   - Verify values are correct
   - No typos in variable names

## 📈 Performance Optimization

### Frontend
- Enable Vercel Analytics
- Use Vercel's image optimization
- Implement lazy loading
- Optimize bundle size

### Backend
- Monitor Railway metrics
- Optimize database queries
- Implement caching
- Use connection pooling

### Storage
- Optimize images before upload
- Use appropriate file formats
- Implement CDN caching
- Consider multiple regions

## 🔐 Security Best Practices

1. **Regular Updates**:
   - Keep dependencies updated
   - Monitor security advisories
   - Apply security patches

2. **Access Control**:
   - Use strong passwords
   - Rotate secrets regularly
   - Monitor access logs

3. **Data Protection**:
   - Encrypt sensitive data
   - Regular backups
   - Secure file uploads

## 📞 Support and Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Cloudflare R2 Docs**: https://developers.cloudflare.com/r2
- **Project Issues**: Check GitHub issues

## 🎯 Next Steps

1. Set up custom domain
2. Configure SSL certificates
3. Implement monitoring and alerting
4. Set up automated backups
5. Add performance monitoring
6. Implement CI/CD pipeline
7. Add comprehensive testing
8. Set up staging environment

---

**Congratulations!** Your photography portfolio is now live and ready to showcase your work! 🎉
