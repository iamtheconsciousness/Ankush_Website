# ⚡ Quick Deploy Guide

## Current Status ✅
- ✅ R2 CORS configured
- ✅ Database ready
- ✅ Code refactored
- ✅ All files ready

## Next: Deploy in 3 Steps

### Step 1: Commit Your Code

Run these commands:

```bash
# Add all new files
git add .

# Commit
git commit -m "Refactor for Cloudflare Pages - D1, R2, Functions"

# If you have a GitHub repo, push:
# git push origin main
```

**Don't have a GitHub repo yet?**
1. Go to https://github.com/new
2. Create a new repository (name it `photography-portfolio` or similar)
3. Don't initialize with README (you already have one)
4. Copy the commands GitHub shows you, then run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy via Cloudflare Dashboard

1. **Go to**: https://dash.cloudflare.com → **Pages** → **Create a project**

2. **Connect Git**:
   - Click **Connect to Git**
   - Authorize Cloudflare → Select your repo → **Begin setup**

3. **Build Settings** (auto-detected, but verify):
   - Framework: **Vite** ✅
   - Build command: `npm run build` ✅
   - Output directory: `dist` ✅
   - Root directory: `/` ✅
   - **Functions directory**: `functions` ⚠️ (IMPORTANT - set this!)

4. **Environment Variables** → Add:
   ```
   ADMIN_PASSWORD = your_secure_password
   JWT_SECRET = DfdufFKcGq1By7LRhZ3Q7hHi2xQ1C2w2MNfcFAYtA50=
   ```

5. **Functions Tab** → **Bindings**:
   - **D1 Database**: `DB` → `photo-db`
   - **R2 Bucket**: `R2` → `photo-media`

6. **Save and Deploy** 🚀

### Step 3: Update R2 CORS with Your Domain

After deployment, you'll get a URL like: `https://photography-portfolio-xyz.pages.dev`

1. Go to: **R2** → **photo-media** → **Settings** → **CORS Policy**
2. Add your Pages domain to `AllowedOrigins`:
   ```json
   [
     {
       "AllowedOrigins": [
         "https://photography-portfolio-xyz.pages.dev",  ← Add this
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

## 🎉 Done!

Visit your site: `https://your-pages-domain.pages.dev`

**Test it:**
- `/api/health` - Should return success
- `/admin` - Login with `admin@photography.com` and your password
- Upload an image - Should work!

---

## 📋 Quick Reference

**Admin Login:**
- Email: `admin@photography.com`
- Password: (Your `ADMIN_PASSWORD`)

**Resources:**
- Database: `photo-db` ✅
- R2 Bucket: `photo-media` ✅
- CORS: Configured ✅

**Need detailed steps?** See `DEPLOY_NOW.md`

