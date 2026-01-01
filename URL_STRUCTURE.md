# 🌐 URL Structure - Frontend & Backend

## 📍 Simple Answer

**Everything is on ONE domain!** Both frontend and backend share the same URL.

---

## 🎯 Example URLs (After Deployment)

Let's say your Cloudflare Pages URL is: `https://photography-portfolio-xyz.pages.dev`

### Frontend URLs (Your Website Pages):
```
https://photography-portfolio-xyz.pages.dev/          → Home page
https://photography-portfolio-xyz.pages.dev/admin     → Admin login/dashboard
https://photography-portfolio-xyz.pages.dev/portfolio → Portfolio gallery
```

### Backend API URLs (Your Server Endpoints):
```
https://photography-portfolio-xyz.pages.dev/api/health              → Health check
https://photography-portfolio-xyz.pages.dev/api/auth/login          → Login
https://photography-portfolio-xyz.pages.dev/api/auth/logout         → Logout
https://photography-portfolio-xyz.pages.dev/api/media               → Get all photos
https://photography-portfolio-xyz.pages.dev/api/media/upload         → Upload photo
https://photography-portfolio-xyz.pages.dev/api/text-content         → Get text content
https://photography-portfolio-xyz.pages.dev/api/backgrounds          → Get backgrounds
https://photography-portfolio-xyz.pages.dev/api/quotations          → Submit quotation
https://photography-portfolio-xyz.pages.dev/api/admin/quotations    → Admin: View quotations
```

---

## 🔗 How They're Related

### ✅ **Same Domain, Different Paths**

```
Your Domain: https://photography-portfolio-xyz.pages.dev
│
├── / (root)                    → Frontend: Home page
├── /admin                      → Frontend: Admin page
├── /portfolio                  → Frontend: Portfolio page
│
└── /api/*                      → Backend: All API endpoints
    ├── /api/auth/login
    ├── /api/media
    ├── /api/text-content
    └── ... (all other API routes)
```

### 📝 **Key Points:**

1. **Frontend routes** (like `/admin`) are handled by your React app
2. **Backend routes** (like `/api/*`) are handled by Cloudflare Functions
3. **Same domain** = No CORS issues, simpler setup
4. **Automatic routing** = Cloudflare knows which is which

---

## 🔄 How It Works

### When someone visits `/admin`:
1. Cloudflare Pages serves your React app
2. React app checks the URL
3. React shows the AdminPage component
4. AdminPage makes API calls to `/api/*` endpoints

### When someone calls `/api/media`:
1. Cloudflare Pages sees `/api/*` path
2. Routes it to your Functions code (`functions/[[path]].ts`)
3. Functions code handles the request
4. Returns JSON response

---

## 🆚 Comparison: Traditional vs Cloudflare

### Traditional Setup (Separate Domains):
```
Frontend: https://example.com
Backend:  https://api.example.com
         OR
Backend:  https://example.com:3001
```
**Problems:**
- ❌ CORS issues (need to configure)
- ❌ Two deployments
- ❌ More complex setup

### Cloudflare Setup (Unified):
```
Everything: https://photography-portfolio-xyz.pages.dev
  ├── Frontend: /, /admin, /portfolio
  └── Backend:  /api/*
```
**Advantages:**
- ✅ No CORS issues (same domain)
- ✅ One deployment
- ✅ Simpler setup
- ✅ Better performance

---

## 📋 Complete URL Map

### Public Pages (Anyone can visit):
| URL | What It Shows |
|-----|---------------|
| `/` | Home page with hero, about, services, contact |
| `/portfolio` | Portfolio gallery with all photos |

### Admin Pages (Login required):
| URL | What It Shows |
|-----|---------------|
| `/admin` | Admin login page → Dashboard after login |

### API Endpoints (Used by frontend):

#### Authentication:
| URL | Method | Purpose |
|-----|--------|---------|
| `/api/auth/login` | POST | Admin login |
| `/api/auth/logout` | POST | Admin logout |
| `/api/auth/verify` | GET | Check if logged in |

#### Media:
| URL | Method | Purpose |
|-----|--------|---------|
| `/api/media` | GET | Get all photos/videos |
| `/api/media/category/:category` | GET | Get photos by category |
| `/api/media/:id` | GET | Get specific photo |
| `/api/media/upload` | POST | Upload photo (admin only) |
| `/api/media/:id` | PUT | Update photo (admin only) |
| `/api/media/:id` | DELETE | Delete photo (admin only) |

#### Content:
| URL | Method | Purpose |
|-----|--------|---------|
| `/api/text-content` | GET | Get all text content |
| `/api/text-content/:key` | GET | Get specific text |
| `/api/text-content` | PUT | Update text (admin only) |
| `/api/backgrounds` | GET | Get background images |
| `/api/backgrounds/:sectionType` | GET | Get backgrounds by section |

#### Quotations:
| URL | Method | Purpose |
|-----|--------|---------|
| `/api/quotations` | POST | Submit quotation (public) |
| `/api/admin/quotations` | GET | Get all quotations (admin only) |
| `/api/admin/quotations/:id` | GET | Get specific quotation (admin only) |
| `/api/admin/quotations/:id/status` | PUT | Update status (admin only) |

---

## 🔐 Security Note

**Important:** The `/admin` route is a **frontend route** (just shows the admin page). The actual security is in the **backend API** (`/api/*`). 

- Anyone can visit `/admin` (they'll see the login page)
- But they can't access `/api/*` endpoints without a valid token
- The backend checks authentication on every API call

---

## 🎨 Visual Diagram

```
User visits: https://photography-portfolio-xyz.pages.dev/admin
│
├─→ Cloudflare Pages serves React app
│   └─→ Shows AdminPage component (login form)
│
└─→ User enters credentials
    │
    └─→ Frontend calls: /api/auth/login
        │
        └─→ Cloudflare Functions handles request
            └─→ Returns JWT token
                │
                └─→ Frontend stores token
                    └─→ Now can access other /api/* endpoints
```

---

## ✅ Summary

**Your Question:** "Will frontend be `hosturl` and backend be `hosturl/admin`?"

**Answer:** 
- **Frontend:** `hosturl/` (home), `hosturl/admin` (admin page), `hosturl/portfolio` (portfolio)
- **Backend:** `hosturl/api/*` (all API endpoints)

**They're on the same domain, just different paths!**

- `/admin` = Frontend page (shows admin dashboard)
- `/api/*` = Backend API (handles data, uploads, etc.)

This is actually **better** than separate domains because:
1. ✅ No CORS configuration needed
2. ✅ Simpler deployment
3. ✅ Better performance
4. ✅ Free SSL certificate for everything

---

## 🚀 After Deployment

Once deployed, you'll get a URL like:
- `https://photography-portfolio-xyz.pages.dev`

And everything will work on that single domain:
- Visit `/` → See your portfolio
- Visit `/admin` → Admin login
- Frontend calls `/api/*` → Backend responds

**That's it! Simple and clean!** 🎉

