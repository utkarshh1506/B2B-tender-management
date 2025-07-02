# 📦 B2B Tender Management Backend

A fully functional backend API for managing a B2B tender management platform. Built with **Node.js**, **Express**, **PostgreSQL**, **Supabase**, and **JWT-based authentication**.

---

## 📑 Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Setup & Installation](#setup--installation)
* [Environment Variables](#environment-variables)
* [API Documentation](#api-documentation)

  * [Authentication](#1-authentication)
  * [Company Profile](#2-company-profile)
  * [Tender Management](#3-tender-management)
  * [Application Workflow](#4-application-workflow)
  * [Search](#5-search-companies)
* [Supabase Configuration](#supabase-configuration)
* [Running the Server](#running-the-server)

---

## ✅ Features

### 1. Authentication & Authorization

* Sign-up / Sign-in with email and password
* JWT token generation and validation for protected routes

### 2. Company Profile

* Companies can manage their profile with metadata
* Upload and serve logos via Supabase Storage

### 3. Tender Management

* Companies can create, view, edit, and delete tenders
* Public and company-specific tender views

### 4. Application Workflow

* Companies can submit proposals to tenders
* View all applications for a tender

### 5. Search

* Search companies by name, industry, or description

---

## 🛠 Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Supabase (as managed Postgres + Storage)
* JWT for auth
* Multer for file uploads

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # PostgreSQL pool setup
├── controllers/
│   ├── authController.js
│   ├── companyController.js
│   ├── tenderController.js
│   └── applicationController.js
├── middlewares/
│   └── verifyToken.js
├── routes/
│   ├── authRoutes.js
│   ├── companyRoutes.js
│   ├── tenderRoutes.js
│   └── applicationRoutes.js
├── utils/
│   └── supabase.js           # Supabase client
├── server.js                 # Express server entry point
└── .env                      # Environment variables
```

---

## ⚙️ Setup & Installation

```bash
# Clone the repository
$ git clone <repo-url>
$ cd backend

# Install dependencies
$ pnpm install

# Create .env file
$ cp .env.example .env

# Start development server
$ pnpm dev
```

---

## 🔐 Environment Variables

`.env`

```
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
JWT_SECRET=your_jwt_secret_key
```

> Use Supabase **service\_role key** for server-side operations like uploads.

---

## 📌 API Documentation

### 🔐 1. Authentication

| Endpoint         | Method | Description       |
| ---------------- | ------ | ----------------- |
| /api/auth/signup | POST   | Register new user |
| /api/auth/login  | POST   | Login & get token |

### 🏢 2. Company Profile

| Endpoint                    | Method | Description                 |
| --------------------------- | ------ | --------------------------- |
| /api/companies              | POST   | Create company profile      |
| /api/companies/me           | GET    | Get current user's company  |
| /api/companies/\:id         | PUT    | Update company              |
| /api/companies/\:id         | DELETE | Delete company              |
| /api/companies/upload-logo  | POST   | Upload company logo         |
| /api/companies/search?q=... | GET    | Search by name/industry/etc |

### 📋 3. Tender Management

| Endpoint                         | Method | Description                  |
| -------------------------------- | ------ | ---------------------------- |
| /api/tenders                     | POST   | Create tender                |
| /api/tenders                     | GET    | Get my tenders               |
| /api/tenders/\:id                | PUT    | Update tender                |
| /api/tenders/\:id                | DELETE | Delete tender                |
| /api/tenders/all?page=1\&limit=5 | GET    | Public paginated tender list |
| /api/tenders/company/\:id        | GET    | Tenders by company           |

### 📨 4. Application Workflow

| Endpoint                            | Method | Description                    |
| ----------------------------------- | ------ | ------------------------------ |
| /api/applications                   | POST   | Submit application to a tender |
| /api/applications/tender/\:tenderId | GET    | View applications for a tender |

### 🔍 5. Search Companies

| Endpoint                     | Method | Description                    |
| ---------------------------- | ------ | ------------------------------ |
| /api/companies/search?q=term | GET    | Search by name, industry, etc. |

---

## 🧾 Supabase Configuration

### ✅ Storage

* Bucket name: `company-logos`
* Public: `true`
* RLS Policy: Allow `service_role` to upload

### ✅ Database Tables Created

```sql
users(id, email, password)
companies(id, user_id, name, description, industry, logo_url)
tenders(id, title, description, deadline, budget, user_id, company_id)
applications(id, company_id, tender_id, proposal, proposed_budget)
```

---

## ▶️ Running the Server

```bash
pnpm dev
```

The server will start on `http://localhost:3000`

---

## ✅ Final Notes

* All protected routes require JWT token via `Authorization: Bearer <token>`
* One company per user is assumed
* One proposal per company per tender is enforced
* All image uploads go to Supabase and return a public URL

---
