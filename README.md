# Horizon - Bank Management System

A full-stack digital banking application built with the MERN stack that enables users to manage bank accounts, perform secure transactions, apply for loans, and monitor finances through an intuitive dashboard.

## Live Demo
🔗 [Live App](#) — coming soon
📁 [GitHub Repository](https://github.com/niraj-sonawane/bank-management-mern)

## Features
- Secure user authentication with JWT and bcrypt password hashing
- Connect and manage multiple bank accounts
- Real-time dashboard with animated balance counter and financial summary
- Fund deposits and peer-to-peer transfers via UPI-style account system
- Transaction history with filters and paginated transaction table
- Loan application workflow with admin approval system
- Role-based protected routes for secure data access
- Notifications system for account activity
- Fully responsive UI across mobile, tablet, and desktop

## Tech Stack
**Frontend:** React.js, Next.js, TypeScript, Tailwind CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB, Mongoose
**Auth:** JWT, bcrypt
**Tools:** Git, GitHub, Postman, VS Code

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Installation

```bash
# Clone the repository
git clone https://github.com/niraj-sonawane/bank-management-mern

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `/backend` folder:
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000

### Run Locally

```bash
# Run backend
cd backend
node server.js

# Run frontend
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and receive JWT |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/logout | Logout user |
| GET | /api/transactions | Get user transactions |
| POST | /api/transfer | Transfer funds |
| POST | /api/loans | Apply for loan |
| POST | /api/bank/deposit | Deposit funds |

## Known Improvements
- Transfer operations currently use two separate database saves — plan to implement MongoDB sessions for atomic transactions
- Add unit tests with Jest
- Implement refresh token rotation

## Author
**Niraj Sonawane**
[LinkedIn](https://linkedin.com/in/nirajsonawane) | [GitHub](https://github.com/niraj-sonawane)