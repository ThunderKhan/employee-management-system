# Employee Management System

A full-stack MERN app: React frontend, Node/Express backend, MongoDB database, JWT-protected dashboard with employee CRUD, search, filter, and stats.

## Project Structure
```
ems/
├── backend/     Express + MongoDB API
└── frontend/    React app
```

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB connection string (local or Atlas)
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the seeded login user

Seed the admin user (creates the only login account, since there's no signup flow):
```bash
node seed.js
```

Start the server:
```bash
npm run dev
```
Runs on `http://localhost:5000`.

## 2. Frontend Setup

```bash
cd frontend
npm install
```

Optionally create `frontend/.env` if your backend isn't on localhost:5000:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the app:
```bash
npm start
```
Runs on `http://localhost:3000`.

## 3. Login
Use the email/password you set in `backend/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) after running `node seed.js`.

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/login | No | Login, returns JWT |
| GET | /api/employees | Yes | List employees (supports `?search=` and `?department=`), includes stats |
| POST | /api/employees | Yes | Add employee |
| PUT | /api/employees/:id | Yes | Update employee |
| DELETE | /api/employees/:id | Yes | Delete employee |

Protected routes require header: `Authorization: Bearer <token>`

## Features Implemented
- JWT authentication with protected dashboard
- Employee CRUD (name, email, mobile, department, designation, salary, status)
- Search by name, filter by department
- Dashboard stats: total / active / inactive
- Client + server-side validation
- Toast notifications for success/error
- Responsive UI