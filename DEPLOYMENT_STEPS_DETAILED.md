# 🎯 Detailed Deployment Steps - Exact Locations

## Step 1: Set Environment Variables

**Location:** Cloudflare Dashboard → Pages → Your Project → Settings → Variables and secrets

**Detailed Steps:**
1. Go to: https://dash.cloudflare.com
2. Click **"Workers & Pages"** in the left sidebar (under "Compute & AI")
3. Click **"Pages"** 
4. Click on your project: **"ankush-website"**
5. Click **"Settings"** tab (top navigation)
6. Scroll down to **"Variables and secrets"** section
7. Click **"Add variable"** button

**Add these 2 variables:**

**Variable 1:**
- **Variable name:** `ADMIN_PASSWORD`
- **Value:** (Type your secure password here - remember this, you'll use it to login)
- **Environment:** Select "Production" (or "All environments")
- Click **"Save"**

**Variable 2:**
- Click **"Add variable"** again
- **Variable name:** `JWT_SECRET`
- **Value:** `DfdufFKcGq1By7LRhZ3Q7hHi2xQ1C2w2MNfcFAYtA50=`
- **Environment:** Select "Production" (or "All environments")
- Click **"Save"**

---

## Step 2: Configure D1 Database Binding

**Location:** Cloudflare Dashboard → Pages → Your Project → Settings → Functions → D1 Database bindings

**Detailed Steps:**
1. Still in **Settings** tab of your project
2. Scroll down to **"Functions"** section
3. Find **"D1 Database bindings"** subsection
4. Click **"Add binding"** button
5. In the modal that opens:
   - **Variable name:** Type `DB` (exactly, case-sensitive)
   - **Database:** Click dropdown, select `photo-db`
   - Click **"Save"**

---

## Step 3: Configure R2 Bucket Binding

**Location:** Cloudflare Dashboard → Pages → Your Project → Settings → Functions → R2 Bucket bindings

**Detailed Steps:**
1. Still in **Settings** tab → **Functions** section
2. Find **"R2 Bucket bindings"** subsection (below D1)
3. Click **"Add binding"** button
4. In the modal that opens:
   - **Variable name:** Type `R2` (exactly, case-sensitive)
   - **Bucket:** Click dropdown, select `photo-media`
   - Click **"Save"**

---

## Step 4: Trigger Deployment

**Location:** Cloudflare Dashboard → Pages → Your Project → Deployments tab

**Option A: Retry Failed Deployment**
1. Click **"Deployments"** tab (top navigation)
2. Find the failed deployment (should be at the top)
3. Click the **three dots (⋯)** menu next to it
4. Click **"Retry deployment"**

**Option B: Push New Commit (Auto-deploys)**
1. Make a small change (or just push current code)
2. Push to GitHub:
   ```bash
   git push origin main
   ```
3. Cloudflare will automatically detect and deploy

---

## Step 5: Get Your Website URL

**Location:** Cloudflare Dashboard → Pages → Your Project → Overview

**After deployment succeeds:**
1. Go to **"Overview"** tab
2. You'll see your URL at the top: `https://ankush-website-xyz.pages.dev`
3. **Copy this URL** - you'll need it for Step 6

---

## Step 6: Update R2 CORS (After Getting URL)

**Location:** Cloudflare Dashboard → R2 → Your Bucket → Settings → CORS Policy

**Detailed Steps:**
1. Go to: https://dash.cloudflare.com
2. Click **"R2"** in the left sidebar (under "Object Storage")
3. Click on bucket: **"photo-media"**
4. Click **"Settings"** tab
5. Scroll to **"CORS Policy"** section
6. Click **"Edit"** button
7. Paste this JSON (replace `your-url.pages.dev` with your actual URL from Step 5):

```json
[
  {
    "AllowedOrigins": [
      "https://ankush-website-xyz.pages.dev",
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

8. Replace `ankush-website-xyz.pages.dev` with your actual URL
9. Click **"Save"**

---

## Step 7: Test Your Website

**Test 1: Health Check**
- Visit: `https://your-url.pages.dev/api/health`
- Should see: `{"success":true,"message":"Server is running"}`

**Test 2: Homepage**
- Visit: `https://your-url.pages.dev/`
- Should see your portfolio homepage

**Test 3: Admin Login**
- Visit: `https://your-url.pages.dev/admin`
- Email: `admin@photography.com`
- Password: (The password you set in Step 1)
- Should successfully log in!

---

## 📋 Quick Checklist

- [ ] Environment variables set (ADMIN_PASSWORD, JWT_SECRET)
- [ ] D1 Database binding configured (DB → photo-db)
- [ ] R2 Bucket binding configured (R2 → photo-media)
- [ ] Deployment triggered and succeeded
- [ ] Got website URL
- [ ] Updated R2 CORS with website URL
- [ ] Tested health endpoint
- [ ] Tested admin login

---

## 🆘 If Something Fails

**Build fails?**
- Check "Deployments" tab → Click on failed deployment → View logs
- Common issues: Missing dependencies, build errors

**Functions not working?**
- Verify bindings are correct (DB and R2)
- Check environment variables are set
- Review function logs in "Observability" tab

**Can't login?**
- Verify ADMIN_PASSWORD is set correctly
- Email must be exactly: `admin@photography.com`
- Clear browser cache/localStorage

**Upload fails?**
- Verify R2 CORS includes your Pages domain
- Check R2 bucket name matches: `photo-media`
- Verify bindings are correct

---

**That's it! Follow these steps in order and you'll be live! 🚀**

