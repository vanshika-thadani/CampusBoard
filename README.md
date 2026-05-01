# CampusConnect

A full-stack web platform built for college students to connect, collaborate, and share resources within their campus community.

---

## Features

- **Discussion** — Public real-time chat room for all campus members
- **Inbox** — Private one-on-one messaging between students
- **Car Pool** — Post or find shared rides within campus
- **Car Rental** — List or rent vehicles from fellow students
- **Lost & Found** — Report lost items or claim found ones
- **Projects** — Post project ideas and find collaborators
- **User Dashboard** — Manage your profile, photo, password, and all your posted resources

---

## Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 19 | UI framework |
| Redux Toolkit + Redux Persist | Global state & session persistence |
| React Router v7 | Client-side routing |
| Axios | HTTP requests |
| Socket.io Client | Real-time messaging |
| Framer Motion | Animations |
| React Toastify | Notifications |
| Google OAuth (`@react-oauth/google`) | Social login |
| Vite | Build tool |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database |
| Socket.io | Real-time WebSocket server |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| Cloudinary + Multer | Image uploads |
| Cookie Parser | HTTP cookie handling |

---

## Project Structure

```
CampusBoard/
├── Backend/
│   ├── config/          # DB and Socket.io setup
│   ├── controller/      # Route handlers
│   ├── middlewares/     # Auth & file upload middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # Cloudinary config, JWT helper
│   ├── app.js           # Express app setup
│   └── server.js        # HTTP + Socket.io server entry
│
└── Frontend/
    └── src/
        ├── Components/  # Sidebar, cards, protected route
        ├── hooks/       # Custom React hooks per feature
        ├── Pages/       # Page components
        ├── ReduxFeatures/  # Auth slice
        ├── reduxStorage/   # Redux store + persistor
        └── socket/      # Socket.io client setup
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Google OAuth Client ID

### 1. Clone the repository

```bash
git clone https://github.com/vanshika-thadani/CampusBoard.git
cd CampusBoard
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_API_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start the frontend:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`

---

## Environment Variables

### Backend (`Backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Port for the backend server (default: 5000) |
| `NODE_ENV` | Environment (`development` or `production`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `FRONTEND_API_URL` | Frontend URL for CORS (e.g. `http://localhost:5173`) |

### Frontend (`Frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:5000`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login with email & password |
| POST | `/api/auth/logout` | Logout current user |
| POST | `/api/auth/google` | Login with Google OAuth |
| GET | `/api/user` | Get current user profile |
| PUT | `/api/user` | Update profile (name, email, photo, password) |
| DELETE | `/api/user` | Delete account |
| GET | `/api/user/resources` | Get all resources posted by current user |
| GET/POST | `/api/carpool` | Get all / post a carpool ride |
| GET/POST | `/api/carrental` | Get all / post a car rental |
| GET/POST | `/api/lostnfound` | Get all / post a lost & found item |
| GET/POST | `/api/projects` | Get all / post a project |
| GET/POST | `/api/messages/public` | Get / send public discussion messages |
| GET/POST | `/api/messages/dm/:userId` | Get / send private messages |
| GET | `/api/messages/conversations` | Get all conversations for current user |

---

## Real-time Events (Socket.io)

| Event | Direction | Description |
|-------|-----------|-------------|
| `join` | Client → Server | Register user as online |
| `onlineUsers` | Server → Client | Broadcast updated online users list |
| `sendMessage` | Client → Server | Send a public message |
| `receiveMessage` | Server → Client | Receive a public message |
| `privateMessage` | Client → Server | Send a private message |
| `receivePrivateMessage` | Server → Client | Receive a private message |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'add: your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.

---

*Built with ❤️ for the campus community*
