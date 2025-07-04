# 📦 Backend - B2B Tender Management Platform

This is the backend service for the B2B Tender Management Platform built using Node.js, Express, and PostgreSQL.

---

## ⚙️ Tech Stack

- Node.js  
- Express.js  
- PostgreSQL  
- Knex.js (for migrations)  
- JWT (Authentication)  
- bcrypt (Password hashing)  
- Supabase Storage (Company logos)

---

## 🛠️ Folder Structure

backend/
├── src/
│   ├── config/         → DB configuration  
│   ├── controllers/    → Route logic  
│   ├── middleware/     → Auth middleware  
│   ├── routes/         → All route definitions  
│   └── server.js       → Entry point  
├── Dockerfile  
├── .env  
└── package.json

---

## 📋 Available APIs

### Authentication
POST   /api/signup       → Register new user  
POST   /api/login        → Login and get token  

### Company Profile
GET    /api/profile      → Get company profile  
PUT    /api/profile      → Update company profile  

### Tenders
POST   /api/tender       → Create a new tender  
GET    /api/tender       → Get all tenders (paginated)  
GET    /api/tender/:id   → Get single tender  

### Applications
POST   /api/tender/:id/apply   → Apply to a tender  
GET    /api/applications       → Get all applications for a company  

---

## 🔐 Environment Variables

PORT=3001  
DATABASE_URL=postgres://...  
JWT_SECRET=your_secret  
SUPABASE_URL=...  
SUPABASE_KEY=...

---

## 📦 Docker Commands

# Build backend image
docker build -t b2b-backend .

# Run locally
docker run -p 3001:3001 b2b-backend

---

## 🧪 Testing

Use Postman or Thunder Client to test all routes.

---

Made with ❤️ by Utkarsh Singh  
https://github.com/utkarshh1506
