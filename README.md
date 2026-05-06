# Task Manager

A clean full-stack task manager for teams with role-based access, project tracking, and task assignment.

## Live Apps
- Frontend: https://taskmanagebyarjun.netlify.app
- Backend API: https://taskmanagementapp-rzhi.onrender.com

## What It Does
- Admins can create projects, add members, and assign tasks
- Members can view tasks and update status
- JWT auth, protected routes, and MongoDB persistence

## Tech Stack
- Frontend: React, Vite, Axios
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Auth: JWT

## Quick Start
### Backend
```bash
cd task-manager-backend
npm install
npm run dev
```

### Frontend
```bash
cd task-manager-frontend
npm install
npm run dev
```

## Environment Variables
### Backend
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `NODE_ENV`

### Frontend
- `VITE_API_URL`

## Deployment Notes
- Backend is deployed on Render
- Frontend is deployed on Netlify
- Make sure the frontend API URL points to the Render backend
- Allow the Netlify origin in backend CORS settings

## API
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/tasks`
- `POST /api/tasks`

## Status
Production-ready and deployed.
