# Deployment Checklist - Final Steps

## ✅ Completed
- [x] Cloudflare authentication
- [x] D1 database created (`photo-db`)
- [x] Production migrations applied
- [x] R2 bucket created (`photo-media`)
- [x] Code refactored for Cloudflare

## 🔧 Configuration Steps

### 1. Configure R2 CORS (Required)

**Go to**: [Cloudflare Dashboard](https://dash.cloudflare.com) → **R2** → **photo-media** bucket → **Settings** → **CORS Policy**

**Add this CORS configuration**:

```json
[
  {
    "AllowedOrigins": [
      "https://photography-portfolio.pages.dev",
      "http://localhost:5173",
      "http://localhost:8788"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length"],
    "MaxAgeSeconds": 3600
  }
]
```

**Important**: After you deploy and get your actual Pages domain, update `AllowedOrigins` to include:
- Your Pages domain (e.g., `https://photography-portfolio-xyz.pages.dev`)
- Your custom domain (if you add one)

### 2. Get R2 Public URL (Optional but Recommended)

1. Go to **R2** → **photo-media** bucket → **Settings**
2. Look for **Public Access** or **Custom Domain**
3. Note the public URL (format: `https://your-account-id.r2.cloudflarestorage.com/photo-media`)
4. Or set up a custom domain for better performance

### 3. Prepare Environment Variables

You'll need these values for Cloudflare Pages:

| Variable | Value | Notes |
|----------|-------|-------|
| `ADMIN_PASSWORD` | `your_secure_password` | Choose a strong password |
| `JWT_SECRET` | `DfdufFKcGq1By7LRhZ3Q7hHi2xQ1C2w2MNfcFAYtA50=` | Generated secure secret |
| `R2_PUBLIC_URL` | `https://your-account-id.r2.cloudflarestorage.com/photo-media` | Optional: Get from R2 bucket settings |

**Admin Login Credentials**:
- **Email**: `admin@photography.com` (hardcoded)
- **Password**: Whatever you set for `ADMIN_PASSWORD`

### 4. Deploy to Cloudflare Pages

#### Step 4a: Push Code to GitHub (if not already)

```bash
git add .
git commit -m "Refactor for Cloudflare Pages deployment"
git push origin main
```

#### Step 4b: Create Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages**
2. Click **Create a project** → **Connect to Git**
3. Select your GitHub repository
4. Click **Begin setup**

#### Step 4c: Configure Build Settings

- **Project name**: `photography-portfolio` (or your choice)
- **Production branch**: `main` (or `master`)
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty or `/`)
- **Functions directory**: `functions`

#### Step 4d: Configure Environment Variables

Click **Environment variables** and add:

```
ADMIN_PASSWORD = your_secure_password_here
JWT_SECRET = DfdufFKcGq1By7LRhZ3Q7hHi2xQ1C2w2MNfcFAYtA50=
R2_PUBLIC_URL = https://your-account-id.r2.cloudflarestorage.com/photo-media
```

**Note**: Replace `your_secure_password_here` with your actual password and `your-account-id` with your actual R2 account ID.

#### Step 4e: Configure Bindings

Click **Functions** tab and configure:

**D1 Database bindings**:
- Click **Add binding** → **D1 Database**
- **Variable name**: `DB`
- **Database**: Select `photo-db`
- Click **Save**

**R2 Bucket bindings**:
- Click **Add binding** → **R2 Bucket**
- **Variable name**: `R2`
- **Bucket**: Select `photo-media`
- Click **Save**

#### Step 4f: Deploy

1. Review all settings
2. Click **Save and Deploy**
3. Wait for build to complete (usually 2-5 minutes)

### 5. Update R2 CORS with Actual Domain

After deployment, you'll get a Pages URL like:
`https://photography-portfolio-xyz.pages.dev`

1. Go back to R2 → **photo-media** → **Settings** → **CORS Policy**
2. Update `AllowedOrigins` to include your actual Pages domain:
   ```json
   [
     {
       "AllowedOrigins": [
         "https://photography-portfolio-xyz.pages.dev",
         "http://localhost:5173",
         "http://localhost:8788"
       ],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["ETag", "Content-Length"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

### 6. Verify Deployment

#### Health Check
```bash
curl https://your-pages-domain.pages.dev/api/health
```

Should return:
```json
{"success":true,"message":"Server is running","timestamp":"..."}
```

#### Test Admin Login
1. Visit: `https://your-pages-domain.pages.dev/admin`
2. Email: `admin@photography.com`
3. Password: Your `ADMIN_PASSWORD`
4. Should successfully log in

#### Test File Upload
1. After logging in, click **Upload**
2. Select an image file
3. Fill in title, category, caption
4. Click **Upload**
5. Verify image appears in gallery

#### Test Background Upload
1. In admin panel, click **Manage Backgrounds**
2. Upload a background image for any section
3. Verify it appears on the website

## 🧪 Local Testing (Before Deployment)

Test everything locally first:

### Terminal 1: Start Functions
```bash
npm run dev:functions
```

### Terminal 2: Start Frontend
```bash
VITE_API_URL=http://localhost:8788/api npm run dev
```

### Test Locally
1. Visit `http://localhost:5173`
2. Go to `/admin`
3. Login with your `ADMIN_PASSWORD`
4. Test uploads and functionality

## 📝 Quick Reference

- **Database**: `photo-db` (ID: `80f85c7f-ca7c-4f66-82d6-480f9e8d0c22`)
- **R2 Bucket**: `photo-media`
- **Admin Email**: `admin@photography.com`
- **JWT Secret**: `DfdufFKcGq1By7LRhZ3Q7hHi2xQ1C2w2MNfcFAYtA50=`
- **Admin Password**: Set in environment variables

## 🐛 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify `functions/[[path]].ts` exists
- Check build logs in Pages dashboard

### Functions Not Working
- Verify bindings are configured (D1 and R2)
- Check environment variables are set
- Review function logs in Pages dashboard

### Upload Fails
- Verify R2 CORS includes your domain
- Check R2 bucket name matches binding
- Verify `R2_PUBLIC_URL` is correct (if using)

### Database Errors
- Verify D1 binding is configured
- Check migrations were applied: `npx wrangler d1 migrations list photo-db`
- Verify database ID in binding matches: `80f85c7f-ca7c-4f66-82d6-480f9e8d0c22`

### Authentication Fails
- Verify `ADMIN_PASSWORD` and `JWT_SECRET` are set
- Check admin email is exactly: `admin@photography.com`
- Clear browser localStorage and try again

## 🎉 Next Steps After Deployment

1. **Custom Domain** (Optional):
   - Add custom domain in Pages settings
   - Update DNS as instructed
   - Update R2 CORS to include custom domain

2. **Monitor Usage**:
   - Check Cloudflare dashboard for usage
   - Monitor D1 database size
   - Monitor R2 storage usage

3. **Backup** (Recommended):
   - Export D1 database periodically: `npx wrangler d1 export photo-db --output=backup.sql`
   - Keep backups of important data

## 📚 Additional Resources

- Full deployment guide: `CLOUDFLARE_DEPLOYMENT.md`
- Deployment status: `DEPLOYMENT_STATUS.md`
- Changes summary: `DEPLOYMENT_SUMMARY.md`

