# 🚀 Ethara AI — Team Task Management Platform

A full-stack **Team Task Management Web Application** built with **React**, **Spring Boot**, and **MySQL**. Enables teams to create projects, assign tasks, manage members, and track progress with role-based access control.

> Think of it as a simplified **Trello / Asana** for engineering teams.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Architecture](#-architecture)
4. [Database Design](#-database-design)
5. [API Endpoints](#-api-endpoints)
6. [Project Structure](#-project-structure)
7. [Prerequisites](#-prerequisites)
8. [Installation & Setup](#-installation--setup)
9. [Running the Application](#-running-the-application)
10. [User Roles & Permissions](#-user-roles--permissions)
11. [Screenshots](#-screenshots)
12. [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 🔐 1. User Authentication
- **Signup** with Name, Email, Password, and Role selection (Admin / Member)
- **Secure Login** using JWT (JSON Web Token) based authentication
- Token stored in `localStorage`, auto-attached to all API requests via Axios interceptors
- Token expiry validation on app load

### 📁 2. Project Management
- **Create projects** with name and optional description
- Project creator automatically becomes the **Admin** of that project
- **Add/Remove members** to/from projects (Admin only)
- View all projects with member count and task count

### ✅ 3. Task Management
- **Create tasks** with Title, Description, Due Date, and Priority (Low / Medium / High)
- **Assign tasks** to any registered user
- **Update task status**: `To Do` → `In Progress` → `Done`
- **Delete tasks** (Admin only)
- Kanban-style board view for Members

### 📊 4. Dashboard
- **Admin Dashboard**: Overview stats (total projects, active tasks, team size, overdue count), project cards with member management, full task table
- **Member Dashboard**: Personal Kanban board with drag-to-status workflow
- **Public Dashboard**: Landing page with live platform stats (no login required)

### 🛡️ 5. Role-Based Access Control (RBAC)
| Feature | Admin | Member |
|---------|:-----:|:------:|
| Create projects | ✅ | ❌ |
| Add/remove project members | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Delete tasks | ✅ | ❌ |
| View all tasks | ✅ | ❌ |
| View assigned tasks | ✅ | ✅ |
| Update task status | ✅ | ✅ (own tasks only) |
| View dashboard | ✅ | ✅ |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Axios, React Router v7 |
| **Backend** | Java 17, Spring Boot 3.2.5, Spring Security, Spring Data JPA |
| **Database** | MySQL 8.0 |
| **Authentication** | JWT (jjwt 0.11.5) with BCrypt password hashing |
| **Build Tools** | Maven (Backend), npm (Frontend) |

---

## 🏗️ Architecture

```
┌──────────────────┐     HTTP/REST     ┌──────────────────┐     JPA/JDBC     ┌──────────────┐
│                  │  ◄──────────────► │                  │ ◄──────────────► │              │
│  React Frontend  │    Port 5173      │  Spring Boot API │    Port 3306     │    MySQL     │
│  (Vite Dev)      │                   │    Port 8081     │                  │  ethara_ai   │
│                  │                   │                  │                  │              │
└──────────────────┘                   └──────────────────┘                  └──────────────┘
```

**Request Flow:**
1. User interacts with the React UI
2. Axios sends HTTP requests to Spring Boot REST API (port 8081)
3. `AuthTokenFilter` intercepts every request, validates the JWT
4. Controller delegates to Service layer
5. Service layer uses JPA Repositories to interact with MySQL
6. Response flows back through the same chain

---

## 💾 Database Design

### Entity-Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │   project_members │       │   projects   │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │◄──┐   │ project_id (FK)  │───────►│ id (PK)      │
│ name         │   └───│ user_id (FK)     │       │ name         │
│ email (UQ)   │       └──────────────────┘       │ description  │
│ password     │                                   │ admin_id (FK)│
│ role (ENUM)  │◄──────────────────────────────────┘              │
└──────┬───────┘                                   └──────────────┘
       │
       │  assigned_to
       ▼
┌──────────────┐
│    tasks     │
├──────────────┤
│ id (PK)      │
│ title        │
│ description  │
│ due_date     │
│ priority     │  ← ENUM: LOW, MEDIUM, HIGH
│ status       │  ← ENUM: TODO, IN_PROGRESS, DONE
│ project_id   │  ← FK → projects.id
│ assigned_to  │  ← FK → users.id
└──────────────┘
```

### Tables Created Automatically by Hibernate (`ddl-auto=update`)

| Table | Purpose |
|-------|---------|
| `users` | Stores user credentials, name, and role |
| `projects` | Stores project name, description, and admin reference |
| `project_members` | Join table for many-to-many project ↔ user relationship |
| `tasks` | Stores task details with FK to project and assigned user |

---

## 🌐 API Endpoints

### Authentication (`/api/auth`) — Public

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| POST | `/api/auth/signup` | Register new user | `{ name, email, password, role? }` |
| POST | `/api/auth/login` | Login & get JWT | `{ email, password }` |

### Projects (`/api/projects`) — Authenticated

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/projects` | List all projects | All |
| GET | `/api/projects/:id` | Get project details | All |
| POST | `/api/projects` | Create project | Admin |
| POST | `/api/projects/:id/members` | Add member | Admin |
| DELETE | `/api/projects/:id/members/:userId` | Remove member | Admin |

### Tasks (`/api/tasks`) — Authenticated

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | List tasks (filtered by role) | All |
| POST | `/api/tasks` | Create task | Admin |
| PUT | `/api/tasks/:id` | Update task | Admin (full) / Member (status only) |
| DELETE | `/api/tasks/:id` | Delete task | Admin |

### Dashboard (`/api/dashboard`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard` | Get dashboard stats | Authenticated |
| GET | `/api/dashboard/public` | Get public stats | Public |

### Users (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | List all users | Admin |

---

## 📂 Project Structure

```
Ethara-Ai/
├── backend/                          # Spring Boot Application
│   ├── pom.xml                       # Maven dependencies
│   └── src/main/
│       ├── java/com/ethara/taskmanager/
│       │   ├── TaskManagerApplication.java    # Main entry point
│       │   ├── controller/
│       │   │   ├── AuthController.java        # Login/Signup endpoints
│       │   │   ├── ProjectController.java     # Project CRUD + member mgmt
│       │   │   ├── TaskController.java        # Task CRUD with role checks
│       │   │   ├── DashboardController.java   # Stats endpoint
│       │   │   └── UserController.java        # User listing
│       │   ├── dto/
│       │   │   ├── LoginRequest.java          # Login payload
│       │   │   ├── SignupRequest.java         # Registration payload
│       │   │   ├── JwtResponse.java           # Login response with token
│       │   │   ├── TaskRequest.java           # Task create/update payload
│       │   │   ├── ProjectRequest.java        # Project create payload
│       │   │   ├── DashboardStats.java        # Stats response
│       │   │   └── MessageResponse.java       # Generic message
│       │   ├── entity/
│       │   │   ├── User.java                  # User entity (JPA)
│       │   │   ├── Project.java               # Project with members (M2M)
│       │   │   ├── Task.java                  # Task entity (JPA)
│       │   │   ├── Role.java                  # ROLE_USER, ROLE_ADMIN
│       │   │   ├── Priority.java              # LOW, MEDIUM, HIGH
│       │   │   └── Status.java                # TODO, IN_PROGRESS, DONE
│       │   ├── repository/
│       │   │   ├── UserRepository.java        # findByEmail, existsByEmail
│       │   │   ├── ProjectRepository.java     # findByAdminId
│       │   │   └── TaskRepository.java        # findByAssignedToId
│       │   ├── security/
│       │   │   ├── WebSecurityConfig.java     # CORS, CSRF, filter chain
│       │   │   ├── AuthTokenFilter.java       # JWT validation filter
│       │   │   ├── JwtUtils.java              # Token generation/validation
│       │   │   ├── UserDetailsImpl.java       # Spring Security UserDetails
│       │   │   └── UserDetailsServiceImpl.java
│       │   └── service/
│       │       ├── AuthService.java           # Login/Register logic
│       │       ├── ProjectService.java        # Project + member mgmt
│       │       ├── TaskService.java           # Task CRUD + permission checks
│       │       └── DashboardService.java      # Stats aggregation
│       └── resources/
│           └── application.properties         # DB, JWT, server config
│
├── frontend/                         # React + Vite Application
│   ├── package.json
│   ├── vite.config.js                # Vite + Tailwind CSS plugin
│   ├── index.html                    # Entry HTML with Inter font
│   └── src/
│       ├── main.jsx                  # React entry point
│       ├── App.jsx                   # Routes & providers
│       ├── index.css                 # Tailwind v4 + custom utilities
│       ├── api/
│       │   └── api.js                # Axios instance with JWT interceptor
│       ├── context/
│       │   └── AuthContext.jsx       # Auth state management
│       ├── components/
│       │   ├── Navbar.jsx            # Top navigation bar
│       │   ├── DashboardLayout.jsx   # Sidebar layout for dashboards
│       │   └── ProtectedRoute.jsx    # Route guard with role check
│       └── pages/
│           ├── PublicDashboard.jsx   # Landing page (no auth needed)
│           ├── Login.jsx             # Login form
│           ├── Signup.jsx            # Registration with role selector
│           ├── AdminDashboard.jsx    # Admin: stats, tasks, projects
│           └── UserDashboard.jsx     # Member: Kanban board
│
└── README.md                         # This file
```

---

## ⚙️ Prerequisites

Before running the application, ensure you have:

| Requirement | Version | Check Command |
|------------|---------|---------------|
| **Java JDK** | 17+ | `java -version` |
| **Maven** | 3.8+ | `mvn -version` |
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |
| **MySQL** | 8.0+ | `mysql --version` |

---

## 🔧 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Ethara-Ai
```

### Step 2: Create MySQL Database
```sql
CREATE DATABASE IF NOT EXISTS ethara_ai;
```

### Step 3: Configure Backend
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ethara_ai
spring.datasource.username=root
spring.datasource.password=0000
```
> Tables are auto-created by Hibernate on first run (`ddl-auto=update`).

### Step 4: Install Frontend Dependencies
```bash
cd frontend
npm install
```

---

## ▶️ Running Locally

### Start Backend (Terminal 1)
```bash
cd backend
mvn spring-boot:run
```
> Backend starts on **http://localhost:8081**

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
> Frontend starts on **http://localhost:5173**

---

## ☁️ Deployment Guide

### Deploy Backend to Render
1. Create a free account at [Render.com](https://render.com/).
2. Click **New +** → **Web Service**.
3. Select your `Ethara_Ai` GitHub repository.
4. **Important Config**: 
   - **Name**: `ethara-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Java` (Render will detect Maven and `pom.xml`)
5. Under **Environment Variables**, add:
   - `MYSQL_URL` : `jdbc:mysql://<your-db-host>:<port>/<db-name>`
   - `MYSQLUSER` : `<db-user>`
   - `MYSQLPASSWORD` : `<db-password>`
   - `PORT` : `8081`
6. Click **Create Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://ethara-ai-3.onrender.com`).

### Deploy Frontend to Vercel
1. Create a free account at [Vercel.com](https://vercel.com/).
2. Click **Add New Project** and import your GitHub repository.
3. Set the **Root Directory** to `frontend`.
4. Under **Environment Variables**, add:
   - `VITE_API_URL` : `https://ethara-ai-3.onrender.com/api` (Replace with your actual backend URL).
5. Click **Deploy**. Your React frontend will be live in seconds!

### Quick Test Flow
1. Open **http://localhost:5173**
2. Click **"Get Started"** → Register as **Admin** (e.g., `admin@test.com / 123456`)
3. Login with your credentials → You'll see the **Admin Dashboard**
4. Create a **Project** → Then create a **Task** assigned to yourself
5. Open a new browser/incognito → Register as **Member** (e.g., `member@test.com / 123456`)
6. Login as Member → See tasks in the **Kanban board**
7. Move tasks from **To Do** → **In Progress** → **Done**

---

## 🛡️ User Roles & Permissions

### Admin
- Full access to all features
- Can create/delete projects and tasks
- Can add/remove team members
- Sees all tasks across all users
- Dashboard shows full team analytics

### Member
- Can view only tasks assigned to them
- Can update task status (To Do → In Progress → Done)
- Cannot create/delete tasks or projects
- Personal Kanban board view

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|---------|
| `Connection refused on port 8081` | Ensure Spring Boot backend is running |
| `Access Denied for MySQL` | Verify username/password in `application.properties` |
| `CORS errors in browser` | Backend already allows `localhost:5173` — check `WebSecurityConfig.java` |
| `JWT token expired` | Logout and login again (token valid for 24 hours) |
| `npm install fails` | Delete `node_modules` and `package-lock.json`, then re-run `npm install` |
| `Tables not created` | Ensure `ddl-auto=update` is set and MySQL database exists |

---

## 👨‍💻 Author

**Ethara AI** — Built as a Team Task Management demonstration project.

**Tech Highlights:**
- 🔒 JWT Authentication with BCrypt password hashing
- 🏗️ Clean 3-layer architecture (Controller → Service → Repository)
- 📊 Real-time dashboard with computed analytics
- 🎨 Premium UI with Tailwind CSS v4, gradient effects, and micro-animations
- 🛡️ Spring Security with method-level `@PreAuthorize` guards
- 📱 Fully responsive design

---

*Built with ❤️ using React + Spring Boot + MySQL*
