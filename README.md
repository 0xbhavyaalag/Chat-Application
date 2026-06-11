# Real-Time Chat Application

A production-oriented full-stack chat application built with React, Express, Socket.io, MongoDB, and JWT authentication.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Real-time: Socket.io
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt
- Styling: Tailwind CSS

## Project Structure

```text
backend/
frontend/
```

## Features

- User registration and login
- JWT-based authentication
- Private chats and group rooms
- Presence tracking with online/offline and last seen
- Typing indicators
- Message delivery / seen status
- Responsive chat UI with dark/light mode
- MongoDB persistence for users, rooms, and messages

## Getting Started

1. Install dependencies in both workspaces.
2. Configure environment variables from the example files.
3. Start MongoDB locally or use a hosted cluster.
4. Run the backend and frontend dev servers.

## Environment Variables

### Backend

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `NODE_ENV`

### Frontend

- `VITE_API_URL`
- `VITE_SOCKET_URL`

## Commands

```bash
npm install
npm run dev
```

Backend runs on `http://localhost:5000` and frontend on `http://localhost:5173` by default.

## Notes

The codebase separates REST controllers, services, and socket handlers so the HTTP and Socket.io layers stay independently testable and scalable.
