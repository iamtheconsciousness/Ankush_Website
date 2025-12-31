# Cloudflare Deployment Guide

This guide walks you through deploying the photography portfolio website entirely on Cloudflare (Pages, D1, R2).

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://www.cloudflare.com)
2. **Wrangler CLI**: Already installed via npm
3. **Git Repository**: Your code should be in a Git repo (GitHub recommended)

## Step 1: Authenticate with Cloudflare

```bash
npx wrangler login
```

This will open your browser to authenticate with Cloudflare.

## Step 2: Create Cloudflare Resources

### Create D1 Database

```bash
npx wrangler d1 create photo-db
```

This will output something like:
```
✅ Successfully created DB 'photo-db' in region APAC
Created your database using D1's new storage backend. The new storage backend is not yet recommended for production workloads, but backs up your data via snapshots to R2.

[[d1_databases]]
binding = "DB"
database_name = "photo-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Important**: Copy the `database_id` and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "photo-db"
database_id = "your-database-id-here"  # Paste the ID here
```

### Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → R2 → Create bucket
2. Name it: `photo-media`
3. Choose a region close to your users

Alternatively, use the API (requires authentication):
```bash
# This will be done via dashboard for simplicity
```

## Step 3: Apply Database Migrations

### Local Development (for testing)

```bash
npx wrangler d1 migrations apply photo-db --local
```

### Production Database

```bash
npx wrangler d1 migrations apply photo-db
```

This creates all tables and inserts default text content.

## Step 4: Configure Environment Variables

### For Local Development

Create a `.dev.vars` file in the project root:

```env
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_key_here
R2_PUBLIC_URL=https://your-account-id.r2.cloudflarestorage.com/photo-media
```

### For Cloudflare Pages (Production)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to: **Pages** → Your Project → **Settings** → **Environment Variables**
3. Add these variables:
   - `ADMIN_PASSWORD` = your secure password
   - `JWT_SECRET` = your JWT secret (generate a random string)
   - `R2_PUBLIC_URL` = your R2 public URL (optional, if using custom domain)

## Step 5: Configure R2 CORS (Important!)

1. Go to **R2** → **photo-media** bucket → **Settings**
2. Add CORS configuration:

```json
[
  {
    "AllowedOrigins": [
      "https://your-pages-domain.pages.dev",
      "https://yourdomain.com"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## Step 6: Deploy to Cloudflare Pages

### Option A: Via GitHub (Recommended)

1. Push your code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages**
3. Click **Create a project** → **Connect to Git**
4. Select your repository
5. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (root)
   - **Functions directory**: `functions`
6. Add environment variables (from Step 4)
7. Click **Save and Deploy**

### Option B: Via Wrangler CLI

```bash
npx wrangler pages deploy dist --project-name=photography-portfolio
```

## Step 7: Configure Custom Domain (Optional)

1. In Pages project → **Custom domains**
2. Add your domain
3. Update DNS records as instructed by Cloudflare
4. Update R2 CORS to include your custom domain

## Step 8: Verify Deployment

1. **Health Check**: 
   ```bash
   curl https://your-pages-domain.pages.dev/api/health
   ```
   Should return: `{"success":true,"message":"Server is running"}`

2. **Test Admin Login**:
   - Visit: `https://your-pages-domain.pages.dev/admin`
   - Email: `admin@photography.com`
   - Password: Your `ADMIN_PASSWORD`

3. **Test File Upload**:
   - Login to admin panel
   - Upload a test image
   - Verify it appears in the gallery

## Local Development

### Start Backend (Functions)

```bash
npx wrangler pages dev --local --d1=photo-db --r2=photo-media
```

This starts the Functions on `http://localhost:8788`

### Start Frontend

In a new terminal:

```bash
VITE_API_URL=http://localhost:8788/api npm run dev
```

Visit `http://localhost:5173` to see your site.

## Troubleshooting

### Database Issues

- **Migration errors**: Make sure you've applied migrations to both local and production
- **Connection errors**: Verify `database_id` in `wrangler.toml` matches your created database

### R2 Upload Issues

- **CORS errors**: Verify R2 CORS configuration includes your domain
- **Upload fails**: Check file size (max 50MB) and file type
- **URLs not working**: Verify `R2_PUBLIC_URL` is set correctly

### Authentication Issues

- **Login fails**: Check `ADMIN_PASSWORD` and `JWT_SECRET` are set correctly
- **Token expires**: Tokens expire after 24 hours, re-login required

### Build Issues

- **Functions not found**: Ensure `functions/[[path]].ts` exists
- **Type errors**: Run `npm install` to ensure all dependencies are installed

## Project Structure

```
.
├── functions/
│   └── [[path]].ts          # Cloudflare Pages Functions (API routes)
├── migrations/
│   └── 0001_init.sql        # D1 database schema
├── src/                      # Frontend React code
├── dist/                     # Built frontend (generated)
├── wrangler.toml            # Cloudflare configuration
└── package.json
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD` | Yes | Password for admin login |
| `JWT_SECRET` | Yes | Secret key for JWT tokens |
| `R2_PUBLIC_URL` | Optional | Public URL for R2 bucket (for direct access) |

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)

