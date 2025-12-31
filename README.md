# 📸 Photography Portfolio Website

A modern, fully-featured photography portfolio website with a complete backend system for content management.

## ✨ Features

### 🎨 Frontend
- **Modern Design**: Beautiful, responsive UI with Tailwind CSS
- **Portfolio Gallery**: Dynamic photo/video gallery with category filtering
- **Admin Dashboard**: Complete content management system
- **Text Content Editor**: Edit photographer info, contact details, and social links
- **Media Upload**: Drag-and-drop file upload with preview
- **Authentication**: Secure admin login system

### 🔧 Backend
- **RESTful API**: Complete API for all frontend needs
- **File Storage**: Cloudflare R2 integration for media storage
- **Database**: SQLite with proper schema and relationships
- **Authentication**: JWT-based admin authentication
- **File Upload**: Secure file upload with validation
- **Text Management**: Dynamic content management system

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation

### Backend
- **Cloudflare Pages Functions** (serverless API)
- **TypeScript** for type safety
- **Cloudflare D1** (SQLite-compatible database)
- **Cloudflare R2** for file storage
- **JWT** for authentication
- **Hono** for routing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Cloudflare R2 account
- Git

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd photography-portfolio
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Frontend Setup
```bash
# In project root
npm install
cp env.example .env
# Edit .env with your API URL
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Admin Panel**: http://localhost:5173/admin

## 📁 Project Structure

```
photography-portfolio/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── data/              # Data management
│   ├── lib/               # API service and utilities
│   └── main.tsx           # Entry point
├── backend/               # Backend source code
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── db/           # Database schema
│   │   ├── middleware/   # Auth middleware
│   │   ├── routes/       # API routes
│   │   ├── services/     # External services
│   │   └── types/        # TypeScript types
│   └── package.json
├── public/                # Static assets
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=3001
NODE_ENV=development
DATABASE_PATH=./database.sqlite
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your_domain.com
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:3001/api
```

## 🌐 Deployment

### Cloudflare Pages (Recommended - Full Stack)

This project is configured for **complete deployment on Cloudflare**:
- **Frontend**: Cloudflare Pages
- **Backend API**: Cloudflare Pages Functions
- **Database**: Cloudflare D1
- **Storage**: Cloudflare R2

See **[CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md)** for complete deployment instructions.

**Quick Start:**
1. Authenticate: `npx wrangler login`
2. Create resources: `npx wrangler d1 create photo-db`
3. Apply migrations: `npx wrangler d1 migrations apply photo-db`
4. Deploy via Cloudflare Dashboard → Pages → Connect Git repository

### Alternative: Separate Hosting

If you prefer separate hosting:

#### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set environment variable: `VITE_API_URL=https://your-backend-url/api`
3. Deploy

#### Backend (Railway/Render)
1. Connect GitHub repository
2. Set all environment variables
3. Deploy

#### Storage (Cloudflare R2)
1. Create R2 bucket
2. Generate API credentials
3. Configure CORS for your domain

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Media Management
- `GET /api/media` - Get all media
- `GET /api/media/category/:category` - Get media by category
- `POST /api/media/upload` - Upload media (protected)
- `PUT /api/media/:id` - Update media (protected)
- `DELETE /api/media/:id` - Delete media (protected)

### Text Content
- `GET /api/text-content` - Get all text content
- `PUT /api/text-content` - Update text content (protected)

## 🎯 Usage

### For Photographers
1. **Access Admin Panel**: Visit `/admin` on your website
2. **Login**: Use your admin credentials
3. **Upload Media**: Add photos, videos, and reels
4. **Edit Content**: Update your bio, contact info, and social links
5. **Manage Gallery**: Organize media by categories

### For Visitors
1. **Browse Portfolio**: View your work in the gallery
2. **Filter by Category**: Explore different types of photography
3. **Contact**: Use the contact information you've set up

## 🔒 Security Features

- JWT-based authentication
- File upload validation
- CORS protection
- Input sanitization
- Secure file storage

## 📈 Performance Features

- Image optimization
- Lazy loading
- Caching strategies
- CDN integration
- Responsive design

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the documentation
2. Review the troubleshooting guide
3. Open an issue on GitHub

## 🎉 Acknowledgments

- Built with modern web technologies
- Designed for photographers by photographers
- Fully customizable and extensible

---

**Ready to showcase your photography? Get started with the setup guide!** 🚀