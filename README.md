# 🎓 EduConnect — Location-Based Tutor Finder

EduConnect is a full-stack **MERN** web application that connects students with nearby tutors. Students can search for tutors by location and subject, book sessions, and chat with them — all in one place.

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based register/login for students and tutors
- 📍 **Location-Based Search** — Find tutors near you using MongoDB geospatial queries (`2dsphere` index)
- 🗺️ **Interactive Map** — Tutors displayed on a Leaflet map
- 📅 **Bookings** — Students can book sessions; tutors can manage requests
- 💬 **Messaging** — Direct chat between students and tutors
- 🔔 **Notifications** — Stay updated on booking and message activity
- 🌗 **Dark / Light Mode** — Smooth theme toggle
- ⚡ **Smooth UI** — Animated, responsive interface built with Tailwind CSS and Framer Motion

---

## 🛠️ Tech Stack

| Layer      | Technologies                                         |
| ---------- | ---------------------------------------------------- |
| Frontend   | React (Vite), Tailwind CSS, Framer Motion, Leaflet   |
| Backend    | Node.js, Express.js                                  |
| Database   | MongoDB (Mongoose) with geospatial indexing          |
| Auth       | JSON Web Tokens (JWT)                                |

---

## 📁 Project Structure

```
EduConnect/
├── educonnect/            # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
├── educonnect-backend/    # Backend (Node + Express)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── package.json
└── README.md
```

> Folder names inside `src/`, `models/`, etc. may vary slightly — adjust to match your repo.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or above)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/shivani-009/EduConnect.git
cd EduConnect
```

### 2. Setup the backend

```bash
cd educonnect-backend
npm install
```

Create a `.env` file in `educonnect-backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
npm start
```

### 3. Setup the frontend

```bash
cd ../educonnect
npm install
```

Create a `.env` file in `educonnect/`:

```env
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🧠 How Location Search Works

Each tutor's location is stored as a GeoJSON `Point` in MongoDB with a `2dsphere` index. When a student searches, the backend uses `$near` / `$geoWithin` queries to return tutors within a given radius, sorted by distance.

```js
tutorSchema.index({ location: "2dsphere" });
```

---

## 🔮 Future Improvements

- Real-time chat using Socket.io
- Payment integration for session bookings
- Tutor ratings and reviews
- Email / push notifications
- Availability calendar for tutors

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 👩‍💻 Author

**Shivani Vishwakarma**

- GitHub: [@shivani-009](https://github.com/shivani-009)
- LinkedIn: [shivani-vishwakarma](https://linkedin.com/in/shivani-vishwakarma-3272b6289)

---

⭐ If you found this project useful, please consider giving it a star!
