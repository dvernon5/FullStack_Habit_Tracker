
# Habit Tracker  
**A full-stack habit tracking app with MongoDB, Express, Node.js, and vanilla HTML + Tailwind CSS**

*Live Demo: [https://habit-tracker.onrender.com](https://habit-tracker.onrender.com)* *(replace with your actual URL after deploy)*

## Features
- **Add**, **edit**, and **delete** habits  
- **Streak tracking** (Daily, Weekly, Monthly)  
- Warm, cozy UI with **glassmorphism cards**  
- Fully responsive  
- Secure: `.env` never committed  
- Deployed with **Render.com** (free tier)

## Tech Stack

| Layer       | Technology                          |
|------------|-------------------------------------|
| **Backend** | Node.js, Express, MongoDB (Atlas)   |
| **Frontend**| HTML, Tailwind CSS, Vanilla JS      |
| **Deployment** | Render.com (free)                |
| **Database**| MongoDB Atlas                       |


## Project Structure
```
habit-tracker/
├── server/          # Backend
│   ├── config/db.js # MongoDB connection
│   ├── models/User.js # Mongoose schema
│   ├── routes/api.js  # All API routes
│   └── server.js      # Express server
├── client/
│   └── public/
│       ├── index.html # UI + form
│       └── index.js   # API calls + DOM
├── .gitignore
├── .env             # Local only (never committed)
└── README.md
```

## Setup & Installation

### 1. Clone the Repo
```bash

git  clone  https://github.com/yourname/habit-tracker.git

cd  habit-tracker

```
### 2. Set Up MongoDB Atlas
1.  Go to [mongodb.com](https://mongodb.com)
2.  Create a **free cluster**
3.  Create a **database user**
4.  Get **connection string** → replace <password> and <dbname> 

### 3. Create .env (in server/)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/habitdb?retryWrites=true&w=majority
PORT=8080
```
### 4. Install & Run Locally
```bash 
	# Backend 
	cd server 
	npm install 
	node server.js
``` 
Open: http://localhost:8080

## API Endpoints
| Method | Endpoint                              | Description                              |
|--------|---------------------------------------|------------------------------------------|
| GET    | `/api/users`                          | Get all users & habits                   |
| POST   | `/api/habits`                         | Add new habit                            |
| PUT    | `/api/habits/:userId/:habitId/edit`   | Toggle completion + update streak        |
| DELETE | `/api/habits/:userId/:habitId`        | Delete habit                             |

## Frontend (index.html + index.js)
-   **Form** → POST /api/habits
-   **List** → GET /api/users → renders habits
-   **Edit/Delete** → PUT / DELETE → refresh list
-   **Tailwind CSS via CDN** → no build step

## Deployment (Render.com)
1.  Push to GitHub
2.  Go to [render.com](https://render.com) → **New Web Service**
3.  Connect repo → **Root Directory: server**
4.  Set:
    -   **Build Command**: npm install
    -   **Start Command**: node server.js
    -   Add MONGODB_URI in **Environment Variables**

Deployed in ~2 minutes

## Security
-   .env excluded via .gitignore
-   MongoDB Atlas IP whitelist (optional)
-   No passwords in frontend

## Future Improvements
-   Full edit modal (rename habit)
-   User authentication
-   React + Vite frontend
-   Dark mode toggle
-   Streak calendar view