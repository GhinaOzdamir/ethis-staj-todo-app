# ethis-staj-todo-app
Full-stack Todo application built with **Next.js 14** (frontend) and **Laravel 11** (backend).

## 📸 Screenshots
#### Main Page
![image alt](https://github.com/GhinaOzdamir/ethis-staj-todo-app/blob/main/screenshot/Screenshot%202025-10-31%20224327.png?raw=true)
#### Filters
![image alt](https://github.com/GhinaOzdamir/ethis-staj-todo-app/blob/main/screenshot/Screenshot%202025-10-31%20225239.png?raw=true)
#### Create Nwe Todo
![image alt](https://github.com/GhinaOzdamir/ethis-staj-todo-app/blob/main/screenshot/Screenshot%202025-10-30%20172057.png?raw=true)
## ✨ Features

- ✅ Full CRUD operations for todos
- 🔍 Search by title and description
- 🎯 Filter by status (todo, in_progress, done)
- 🎨 Filter by priority (low, medium, high)
- 📅 Sort by creation date or due date
- 📱 Responsive design with TailwindCSS
- ⚡ Real-time updates with Laravel API
- ✔️ Form validation (client & server-side)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **Lucide Icons**

### Backend
- **Laravel 11**
- **PHP 8.2+**
- **SQLite/MySQL**

## 📁 Project Structure
```bash
todo-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── todos/
│   │   │       ├── route.ts              # GET, POST /api/todos
│   │   │       └── [id]/
│   │   │           └── route.ts          # PATCH, DELETE /api/todos/:id
│   │   ├── page.tsx                      # Main todo page
│   │   └── layout.tsx                    # Root layout
│   ├── types/
│   │   └── todo.ts                       # TypeScript interfaces
│   └── lib/
│       └── validations.ts                # Zod schemas
├── .env.local                            # Environment variables
└── .env.example                          # Environment template


todo-api/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           └── TodoController.php    # API endpoints
│   └── Models/
│       └── Todo.php                      # Todo model
├── database/
│   └── migrations/
│       └── xxxx_create_todos_table.php   # Database schema
├── routes/
│   └── api.php                           # API routes
└── config/
    └── cors.php                          # CORS configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PHP 8.2+
- Composer
- Git

### 1️⃣ Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/ethis-staj-todo-app.git
cd ethis-staj-todo-app
```

### 2️⃣ Setup Backend (Laravel)
```bash
cd backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database
touch database/database.sqlite
php artisan migrate

# (Optional) Seed sample data
php artisan db:seed

# Start server
php artisan serve
# Server runs at: http://127.0.0.1:8000
```

### 3️⃣ Setup Frontend (Next.js)
```bash
cd ../frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start development server
npm run dev
# App runs at: http://localhost:3000
```

### 4️⃣ Open Application
Visit **http://localhost:3000** in your browser! 🎉

## 📚 API Documentation

### Base URL
http://127.0.0.1:8000/api

### Endpoints

#### Get All Todos
```http
GET /api/todos?status=todo,in_progress&priority=high&search=auth&sort=dueDate:asc
```

#### Create Todo
```http
POST /api/todos
Content-Type: application/json

{
  "title": "Complete the task",
  "description": "Finish the internship assignment",
  "priority": "high",
  "status": "todo",
  "dueDate": "2025-11-05"
}
```

#### Update Todo
```http
PATCH /api/todos/{id}
Content-Type: application/json

{
  "status": "done"
}
```

#### Delete Todo
```http
DELETE /api/todos/{id}
```

##📝 Short Note: Key Decisions and Challenges

- Encountered fetch request errors between frontend and backend; resolved them with try/catch and better error handling in the UI.

- Faced challenges with state management when integrating filters and sorting; managed them using useState and useEffect 


## 👨‍💻 Author

**Ghina Ozdemir**


## 🙏 Acknowledgments

- Ethis Company for the opportunity
- Next.js and Laravel communities


