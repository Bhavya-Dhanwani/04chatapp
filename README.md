# Real-Time Chat Application

Welcome to the comprehensive repository for the Real-Time Chat Application! This project features a **Next.js + Redux** frontend and a **Node.js + Express + MongoDB** backend to deliver a seamless, fast, and responsive chatting experience.

## Project Overview
This application provides a modern platform for users to register, discover peers, and communicate in real-time. It leverages WebSockets for instant message delivery and relies on a robust REST API for authentication and data management.

## Architecture & Data Flow
1. **Client Layer:** Built with Next.js and Redux Toolkit. It interacts with the backend via REST endpoints for standard operations (auth, fetching chats) and via Socket.io for real-time events.
2. **Server Layer:** Built with Node.js and Express. It uses a Controller-Service-Model architecture to cleanly separate request handling from business logic.
3. **Database Layer:** Uses MongoDB to store persistent data (Users, Chats, Messages).

### Folder Structure
```text
/
├── backend/
│   ├── src/
│   │   ├── config/      # Environment variables and DB/ImageKit setup
│   │   ├── controllers/ # Request/Response handlers
│   │   ├── middlewares/ # Security, Auth, and Error handling
│   │   ├── models/      # Mongoose Schemas
│   │   ├── routes/      # Express routing
│   │   ├── services/    # Core business logic and DB operations
│   │   ├── sockets/     # Socket.io event handling
│   │   └── utils/       # Helpers (wrappers, tokens, email)
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js App Router layout and pages
│   │   ├── features/    # Redux slices and UI components per feature (auth, chat, user)
│   │   └── shared/      # Common UI components and utilities
│   └── package.json
```

### Database Schemas
- **User Schema (`users`):** Stores `name`, `email`, `password` (hashed), `isVerified`, and profile picture metadata (`profilePic`, `profilePicId`).
- **Chat Schema (`chats`):** Links users. Stores `participants` (array of User IDs), `chatType` (direct or group), `name`, and references the `lastMessage`.
- **Message Schema (`messages`):** Stores individual messages linked to a `chatId` and `senderId`. Includes the `content` and delivery `status`.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- MongoDB connection string.
- ImageKit account credentials for image uploads.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_SECRET=your_jwt_access_secret
   REFRESH_SECRET=your_jwt_refresh_secret
   SMTP_SERVICE=gmail
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   TRANSACTIONAL_EMAIL=your_email@gmail.com
   FRONTEND_URL=http://localhost:3000
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

You can now open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application!
