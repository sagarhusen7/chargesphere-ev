# ChargeSphere Backend API

Backend server for ChargeSphere EV charging platform built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Add your MongoDB connection string
- Update JWT secret

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📋 Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update profile (Protected)
- `PUT /api/users/password` - Change password (Protected)
- `GET /api/users/favorites` - Get favorites (Protected)
- `POST /api/users/favorites` - Add to favorites (Protected)
- `DELETE /api/users/favorites/:id` - Remove from favorites (Protected)

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings` - Get user bookings (Protected)
- `GET /api/bookings/:id` - Get booking by ID (Protected)
- `PUT /api/bookings/:id` - Update booking (Protected)
- `DELETE /api/bookings/:id` - Cancel booking (Protected)
- `GET /api/bookings/stats/summary` - Get booking stats (Protected)

### Reviews
- `POST /api/reviews` - Create review (Protected)
- `GET /api/reviews/station/:stationId` - Get station reviews (Public)
- `GET /api/reviews/user` - Get user reviews (Protected)
- `PUT /api/reviews/:id` - Update review (Protected)
- `DELETE /api/reviews/:id` - Delete review (Protected)
- `POST /api/reviews/:id/helpful` - Mark review helpful (Protected)

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js            # JWT authentication
├── models/
│   ├── User.js            # User model
│   ├── Booking.js         # Booking model
│   └── Review.js          # Review model
├── routes/
│   ├── auth.js            # Auth routes
│   ├── users.js           # User routes
│   ├── bookings.js        # Booking routes
│   └── reviews.js         # Review routes
├── .env                   # Environment variables
├── .gitignore            # Git ignore
├── package.json          # Dependencies
├── server.js             # Entry point
└── README.md             # Documentation
```

## 🔒 Authentication

API uses JWT (JSON Web Tokens) for authentication.

Include token in request headers:
```
Authorization: Bearer <your_jwt_token>
```

## 💾 Database Models

### User
- Name, email, password
- Role (customer/admin)
- Favorites array
- Timestamps

### Booking
- User reference
- Station details
- Vehicle info
- Date, time, duration
- Status tracking
- Timestamps

### Review
- User reference
- Station details
- Rating (1-5)
- Review text
- Issues array
- Photos
- Helpful count
- Timestamps

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **Security**: CORS enabled

## 📝 Notes

- All protected routes require valid JWT token
- Passwords are hashed using bcrypt
- MongoDB connection string must be added to `.env`
- Default port is 5000 (configurable)
- CORS enabled for frontend at port 5173
