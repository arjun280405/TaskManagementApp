# Team Task Manager Web App

Full-stack Team Task Manager with role-based access:

- Admin: create projects, add members, create and assign tasks
- Member: view assigned tasks and update task status

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT
- Styling: Custom CSS

## Project Structure

```
EtharaAIProj/
├── task-manager-backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── task-manager-frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── components/
│   │   │   ├── CreateTaskModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectSelector.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Backend Setup

1. Open terminal in task-manager-backend
2. Install dependencies:
   npm install
3. Create environment file:
   - Copy .env.example to .env
4. Update .env values:
   - PORT=5000
   - MONGO_URI=your_mongodb_connection_string
   - JWT_SECRET=your_secure_secret
   - CLIENT_URL=http://localhost:5173
5. Start backend:
   npm run dev

## Frontend Setup

1. Open terminal in task-manager-frontend
2. Install dependencies:
   npm install
3. Create environment file:
   - Copy .env.example to .env
4. Update frontend .env:
   - VITE_API_URL=http://localhost:5000/api
5. Start frontend:
   npm run dev

## API Endpoints

Auth:

- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me
- GET /api/auth/users (admin only)

Projects:

- POST /api/projects (admin only)
- GET /api/projects
- PUT /api/projects/:id/members (admin only)

Tasks:

- POST /api/tasks (admin only)
- GET /api/tasks (tasks assigned to current user)
- PUT /api/tasks/:id (update status)
- DELETE /api/tasks/:id (admin only)

## Roles

- admin
  - Can create projects
  - Can add members to projects
  - Can create and assign tasks
  - Can update any task status
- member
  - Can view assigned tasks
  - Can update own assigned task status

## Deployment

### Backend (Railway)

1. Push repository to GitHub
2. Create new Railway project from GitHub repo
3. Set root directory to task-manager-backend
4. Add environment variables:
   - PORT
   - MONGO_URI
   - JWT_SECRET
   - CLIENT_URL (Vercel frontend URL)
5. Railway build/start:
   - Install: npm install
   - Start: npm start

### Frontend (Vercel)

1. Import GitHub repo to Vercel
2. Set root directory to task-manager-frontend
3. Set build command: npm run build
4. Set output directory: dist
5. Add environment variable:
   - VITE_API_URL=https://your-railway-backend-domain/api
6. Deploy

## Notes

- Passwords are hashed with bcryptjs
- JWT token is stored in localStorage
- CORS is configured for local and production client URLs
- Dashboard includes task filters:
  - All Tasks
  - My Tasks
  - Overdue Tasks
