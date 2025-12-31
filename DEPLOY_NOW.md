# 🚀 Deploy Now - Step by Step Guide

## Option 1: Deploy via GitHub (Recommended) ⭐

### Step 1: Commit and Push to GitHub

If you haven't already, commit your changes:

```bash
# Stage all changes
git add .

# Commit
git commit -m "Refactor for Cloudflare Pages deployment"

# If you don't have a GitHub repo yet, create one at github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy via Cloudflare Dashboard

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Navigate to: **Pages** → **Create a project**

2. **Connect to Git**
   - Click **Connect to Git**
   - Authorize Cloudflare to access your GitHub
   - Select your repository
   - Click **Begin setup**

3. **Configure Build Settings**
   - **Project name**: `photography-portfolio` (or your choice)
   - **Production branch**: `main`
   - **Framework preset**: Select **Vite**
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty)
   - **Functions directory**: `functions`

4. **Add Environment Variables**
   Click **Environment variables** → **Add variable** for each:
   
   | Variable Name | Value |
   |--------------|-------|
   | `ADMIN_PASSWORD` | `your_secure_password_here` (choose a strong password) |
   | `JWT_SECRET` | `DfdufFKcGq1By7LRhZ3Q7hHi2xQ1C2w2MNfcFAYtA50=` |
   | `R2_PUBLIC_URL` | (Optional) Get from R2 bucket settings |

5. **Configure Bindings**
   Click **Functions** tab:
   
   **D1 Database Binding**:
   - Click **Add binding** → **D1 Database**
   - **Variable name**: `DB`
   - **Database**: Select `photo-db`
   - Click **Save**
   
   **R2 Bucket Binding**:
   - Click **Add binding** → **R2 Bucket**
   - **Variable name**: `R2`
   - **Bucket**: Select `photo-media`
   - Click **Save**

6. **Deploy**
   - Review all settings
   - Click **Save and Deploy**
   - Wait 2-5 minutes for build to complete

7. **Get Your URL**
   - After deployment, you'll get a URL like: `https://photography-portfolio-xyz.pages.dev`
   - **Important**: Update R2 CORS to include this URL!

---

## Option 2: Deploy via CLI (Alternative)

If you prefer command line:

### Step 1: Build the Project

```bash
npm run build
```

### Step 2: Create Pages Project (First Time Only)

```bash
npx wrangler pages project create photography-portfolio
```

### Step 3: Deploy

```bash
npx wrangler pages deploy dist --project-name=photography-portfolio
```

### Step 4: Configure in Dashboard

After first deployment, you still need to:
1. Go to Pages dashboard
2. Add environment variables (same as Option 1, Step 4)
3. Configure bindings (same as Option 1, Step 5)

---

## ⚠️ Important: Update R2 CORS After Deployment

Once you have your Pages URL (e.g., `https://photography-portfolio-xyz.pages.dev`):

1. Go to: **R2** → **photo-media** → **Settings** → **CORS Policy**
2. Update `AllowedOrigins` to include your actual domain:

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

---

## ✅ Verify Deployment

### 1. Health Check
```bash
curl https://your-pages-domain.pages.dev/api/health
```

Should return: `{"success":true,"message":"Server is running"}`

### 2. Test Admin Login
- Visit: `https://your-pages-domain.pages.dev/admin`
- Email: `admin@photography.com`
- Password: Your `ADMIN_PASSWORD`
- Should successfully log in

### 3. Test Upload
- After logging in, upload a test image
- Verify it appears in the gallery

---

## 🎯 Quick Checklist

- [ ] Code committed and pushed to GitHub (Option 1) OR built locally (Option 2)
- [ ] Pages project created
- [ ] Build settings configured
- [ ] Environment variables added (`ADMIN_PASSWORD`, `JWT_SECRET`)
- [ ] D1 binding configured (`DB` → `photo-db`)
- [ ] R2 binding configured (`R2` → `photo-media`)
- [ ] Deployed successfully
- [ ] R2 CORS updated with actual Pages domain
- [ ] Health check passes
- [ ] Admin login works
- [ ] File upload works

---

## 🆘 Troubleshooting

### Build Fails
- Check build logs in Pages dashboard
- Verify `functions/[[path]].ts` exists
- Ensure all dependencies are in `package.json`

### Functions Not Working
- Verify bindings are configured correctly
- Check environment variables are set
- Review function logs in Pages dashboard

### Upload Fails
- Verify R2 CORS includes your Pages domain
- Check R2 bucket name matches binding
- Verify `R2_PUBLIC_URL` is correct (if using)

---

**Ready? Start with Option 1 (GitHub) for the easiest deployment!** 🚀

