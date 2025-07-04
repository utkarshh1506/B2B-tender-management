# 🎨 Frontend - B2B Tender Management Platform

This is the frontend client built using Next.js and React, designed to provide companies with a smooth experience for browsing tenders, applying, and managing their applications.

---

## ⚙️ Tech Stack

- Next.js (App Router)  
- React  
- CSS (Plain CSS)  
- Axios for API communication  
- JWT-based Authentication  
- Vercel for deployment

---

## 📁 Folder Structure

frontend/
├── public/             → Static assets  
├── src/
│   ├── app/            → App router pages  
│   │   ├── login/  
│   │   ├── signup/  
│   │   ├── tenders/  
│   │   └── dashboard/  
│   ├── components/     → Reusable UI components  
│   └── styles/         → CSS files  
└── package.json

---

## 🔐 Environment Variables

NEXT_PUBLIC_API_BASE_URL=https://b2b-tender-management.onrender.com

---

## 🚀 Deployment

Deployed using Vercel  
https://b2-b-tender-management.vercel.app

---

## 🧑‍💼 Features

- Signup/Login with JWT  
- Tender listings in card layout  
- Submit proposals for tenders  
- Dashboard with:
  - Company profile edit  
  - View submitted applications  
  - Statistics (open tenders, pending apps, etc.)

---

## 📦 Docker Commands

# Build frontend image
docker build -t b2b-frontend .

# Run locally
docker run -p 3000:3000 b2b-frontend

---

Made with ❤️ by Utkarsh Singh  
https://github.com/utkarshh1506
