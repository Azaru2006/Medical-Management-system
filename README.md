Setup & Installation Guide
 Prerequisites
•	Node.js v18 or higher
•	MongoDB (local or MongoDB Atlas cloud)
•	npm or yarn package manager
 Backend Setup
Step 1 — Navigate to the backend folder and install dependencies:
  cd backend && npm install
Step 2 — Create a .env file in /backend with:
  MONGO_URI=mongodb://localhost:27017/medicalmanagementsystem   PORT=5000   JWT_SECRET=your_super_secret_key
Step 3 — Seed the database with default users (run once):
  node seed.js
Step 4 — Start the backend server:
  npm start   or   node server.js
 Frontend Setup
Step 1 — Navigate to the frontend folder and install dependencies:
  cd frontend && npm install
Step 2 — Start the React development server:
  npm start
 Default Login Credentials
Role	Email	Password
Admin	admin@hospital.com	admin123
Doctor	doctor@hospital.com	doctor123
Receptionist	reception@hospital.com	reception123

Note: Change all default passwords after first login for security.
