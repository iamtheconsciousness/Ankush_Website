# Cloudflare Deployment - Changes Summary

This document summarizes all changes made to migrate the project to Cloudflare Pages/Functions.

## ✅ Completed Changes

### 1. Configuration Files

- **`wrangler.toml`**: Added Cloudflare configuration with D1 and R2 bindings
- **`.dev.vars.example`**: Template for local development environment variables
- **`.gitignore`**: Added `.dev.vars` to prevent committing secrets

### 2. Database Migration

- **`migrations/0001_init.sql`**: D1-compatible schema migration
  - Creates all tables (media, text_content, background_images, quotations)
  - Inserts default text content
  - Compatible with Cloudflare D1 (SQLite)

### 3. API Refactoring

- **`functions/[[path]].ts`**: Complete API rewrite using Hono framework
  - All Express routes converted to Cloudflare Pages Functions
  - Uses D1 database instead of SQLite file
  - Uses R2 for file storage instead of local uploads
  - JWT authentication maintained
  - All endpoints preserved:
    - `/api/auth/*` - Authentication
    - `/api/media/*` - Media management
    - `/api/text-content/*` - Text content management
    - `/api/backgrounds/*` - Background image management
    - `/api/quotations/*` - Quotation management
    - `/api/health` - Health check

### 4. Frontend Updates

- **`src/lib/apiService.ts`**: Updated to use `/api` as default (same-origin)
- **`env.example`**: Updated with Cloudflare-specific variables

### 5. Dependencies

- Added `hono` - Web framework for Cloudflare Workers
- Added `mime-types` - MIME type detection
- Added `wrangler` - Cloudflare CLI tool
- Added `@cloudflare/workers-types` - TypeScript types

### 6. Documentation

- **`CLOUDFLARE_DEPLOYMENT.md`**: Complete deployment guide
- **`README.md`**: Updated with Cloudflare deployment info
- **`package.json`**: Added helper scripts for development

## 📋 Next Steps (User Action Required)

### 1. Cloudflare Account Setup

```bash
# Authenticate with Cloudflare
npx wrangler login
```

### 2. Create Resources

```bash
# Create D1 database
npx wrangler d1 create photo-db

# Note the database_id from output and update wrangler.toml
```

Then create R2 bucket via Cloudflare Dashboard:
- Go to R2 → Create bucket
- Name: `photo-media`

### 3. Apply Migrations

```bash
# Local development
npm run d1:migrate:local

# Production (after deployment)
npm run d1:migrate:prod
```

### 4. Set Environment Variables

**Local Development:**
- Copy `.dev.vars.example` to `.dev.vars`
- Fill in your values

**Cloudflare Pages:**
- Go to Pages → Your Project → Settings → Environment Variables
- Add: `ADMIN_PASSWORD`, `JWT_SECRET`, `R2_PUBLIC_URL` (optional)

### 5. Configure R2 CORS

In Cloudflare Dashboard → R2 → photo-media → Settings:
- Add CORS configuration for your domain

### 6. Deploy

1. Push code to GitHub
2. Connect to Cloudflare Pages
3. Configure build settings:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Functions directory: `functions`
4. Deploy!

## 🔄 Key Differences from Original

### Backend Changes

| Before | After |
|--------|-------|
| Express server | Cloudflare Pages Functions |
| SQLite file | Cloudflare D1 |
| Local file storage | Cloudflare R2 |
| Separate server | Serverless functions |
| Port 3001 | Same origin as frontend |

### File Storage

- **Before**: Files stored in `backend/uploads/`
- **After**: Files stored in R2 bucket, URLs generated automatically

### Database

- **Before**: SQLite file (`database.sqlite`)
- **After**: Cloudflare D1 (managed SQLite)

### API Endpoints

- **Before**: `http://localhost:3001/api/*`
- **After**: `https://your-domain.com/api/*` (same origin)

## 🧪 Testing Locally

### Start Functions (Backend)

```bash
npm run dev:functions
```

Runs on `http://localhost:8788`

### Start Frontend

```bash
VITE_API_URL=http://localhost:8788/api npm run dev
```

Runs on `http://localhost:5173`

## 📝 Notes

- All file uploads now go to R2 (media and backgrounds)
- Database is managed by Cloudflare D1
- No separate backend server needed
- Everything runs on Cloudflare's edge network
- Free tier available for development/testing

## 🐛 Troubleshooting

If you encounter issues:

1. **Database errors**: Ensure migrations are applied
2. **Upload errors**: Check R2 CORS configuration
3. **Auth errors**: Verify environment variables are set
4. **Build errors**: Check that all dependencies are installed

See `CLOUDFLARE_DEPLOYMENT.md` for detailed troubleshooting.

