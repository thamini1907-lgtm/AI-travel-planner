# 🚀 AI Travel Planner

**WanderMind** is an AI-powered travel planning app built with React, Tailwind CSS, Firebase auth/firestore, and an Express/OpenAI backend. It generates real-time, markdown-based itineraries and stores user profiles securely.

## 🌟 Highlights

- AI itinerary generation for any destination
- Firebase authentication with Google Sign-In
- Express backend powering OpenAI / OpenRouter itinerary creation
- Responsive modern UI with motion and glassmorphism design
- Industry-ready project structure and documentation

## 📁 Project Structure

```
/ (root)
  ├── public/                  # Static assets
  ├── src/                     # React frontend source code
  │   ├── App.jsx              # Main application UI and page flow
  │   ├── firebase.js          # Firebase initialization and auth helpers
  │   ├── index.css            # Tailwind theme and global styles
  │   ├── main.jsx             # React entry point
  │   └── assets/              # Image assets used by UI
  ├── server.js                # Express backend for API routes
  ├── firebase-service-account.json  # Firebase Admin credentials (ignored)
  ├── .env                     # Local environment variables (ignored)
  ├── package.json             # NPM scripts and dependencies
  └── README.md                # Project documentation
```

## 🚀 Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root with these variables:

   ```env
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   VITE_FIREBASE_MEASUREMENT_ID=
   OPENROUTER_API_KEY=
   ```

3. Start the backend server:

   ```bash
   npm run server
   ```

4. Start the frontend app:

   ```bash
   npm run dev
   ```

5. Open the app in your browser at `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start Vite development server
- `npm run server` - Start Express backend server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint over source files

## 🧠 Features

- Google sign-in authentication
- AI-generated travel itineraries
- Live itinerary rendering using `react-markdown`
- Interactive hero landing page and planning dashboard
- Profile page with user metadata and travel stats

## 🛠️ Architecture Overview

- `src/App.jsx`: UI, navigation, page state, and frontend API integration
- `src/firebase.js`: Firebase client setup for authentication and Firestore
- `server.js`: Express backend with Firebase Admin token verification and OpenAI itinerary generation
- `public/` and `src/assets/`: Static image assets and UI media

## ✅ Contribution Guide

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-change`
3. Make your changes with clear commits
4. Run lint and test locally
5. Open a pull request with a summary of your change

## 📣 Notes

- `firebase-service-account.json` is excluded from Git and should remain private.
- Backend expects Firebase ID tokens for `/api/profile` requests.
- If you want to deploy, configure production environment variables and secure your OpenAI API key.

---

Thanks for checking out WanderMind! ✈️🗺️✨
