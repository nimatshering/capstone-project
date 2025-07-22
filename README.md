# Capstone Project

## Task Manager

### User Manual

A clean, full-stack **Task Management** application built with **Next.js**, **TypeScript**, **Drizzle ORM**, **MySQL**, and **Tailwind CSS**. Organize tasks, set priorities, and track your productivity effortlessly.

---

## Features

- Add, edit, delete Project and tasks
- Organize tasks by status (At_risk, In-Progress, Done)
- Set task due dates
- User Management
- User Authentication & Route protection (Using JOSE Library)

---

## Tech Stack

| Layer    | Technology           |
| -------- | -------------------- |
| Frontend | Next.js + TypeScript |
| Styling  | Tailwind CSS         |
| ORM      | Drizzle ORM          |
| Database | MySQL                |

---

## Installation

### 1. Clone the repository

```bash
https://github.com/nimatshering/capstone-project.git
cd nextjs-task-manager
```

### 2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Setup Environment Variables:

Create a .env file in the root directory and configure the following:

DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
JWT_SECRET=your_jwt_secret

### 4. Register an Account

- Click the “Register” button on the homepage
- Fill in your name, email, and password
- Click “Submit” to create your account
- After successful registeration you will be redirected to login page

### 5. Login an Account

- Enter your credentials
- After logging in, you will be redirected to your dashboard

### 6. Create a Project

- Go to the Project Tracker Menu
- Click "Add Project"
- Enter project title, description

### 7. Create a Task

- Inside a project, click "Add Task"
- Provide task name, status (At Risk, In Progress, Done), and due date
- Edit or delete tasks using the action icons next to each task
