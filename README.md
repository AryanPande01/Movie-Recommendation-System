🎬 MovieVerse — Full-Stack Movie Recommendation System

MovieVerse is a full-stack movie & web-series recommendation platform that provides personalized content suggestions based on user preferences such as type, language, genre, and streaming provider.
It features secure authentication, recommendation history tracking, and a modern premium UI.

🚀 Live Demo

Frontend (Vercel): https://movie-nine-nine-nine-pi.vercel.app

Backend (Render): https://movie-recommendation-system-68se.onrender.com

✨ Features
🔐 Authentication

User Sign Up & Login

Secure password hashing using bcrypt

JWT-based authentication

Persistent login with token storage

🎥 Recommendations

Personalized recommendations based on:

Movies / Web Series / Documentaries

Language (English, Hindi, Marathi, Spanish, German)

Genre (Action, Sci-Fi, Romantic, Thriller, etc.)

Shows:

Poster

Short description

Cast

Runtime

Streaming providers (Netflix, Prime Video, etc.)

Reason for recommendation (explainability)

📜 History & Taste Learning

Stores past recommendation sessions

Allows re-running previous recommendations

Learns user taste over time (genres, languages, providers)

📺 Browse by Platform

Browse popular titles by:

Netflix

Amazon Prime Video

Disney+

Hotstar

Hulu

HBO Max

Categorized by genre

🎨 UI / UX

Premium dark theme

Responsive layout

Clean card-based design

Modal movie detail view

🛠 Tech Stack
Frontend

React (Vite)

Tailwind CSS

Axios

React Router

Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

JWT Authentication

Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas (Cloud)


⚙️ Environment Variables
Backend (Render)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/movieverse?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key
PORT=5001


⚠️ Important:
The database name (movieverse) must match exactly with the database you view in MongoDB Atlas. MongoDB silently creates new databases if the name is missing or incorrect.

Frontend (Vercel)
VITE_API_URL=https://movie-recommendation-system-68se.onrender.com/api

🧪 Local Development
1️⃣ Backend
cd backend
npm install
npm run dev


Backend runs on:

http://localhost:5001

2️⃣ Frontend
cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173

🔍 Common Issues & Debugging
❗ Signup succeeds but user not visible in MongoDB

✔ Ensure your database name in MONGO_URI matches Atlas exactly
✔ Check the correct database (not test)

❗ CORS Errors

✔ Backend must allow frontend origin:

cors({
  origin: ["http://localhost:5173", "https://movie-nine-nine-nine-pi.vercel.app"],
  credentials: true
})

❗ MongoDB Network Errors on Render

✔ Add 0.0.0.0/0 to MongoDB Atlas Network Access
✔ Or whitelist Render outbound IPs

🧠 Future Enhancements

AI-based recommendation ranking

User profile page

Watchlist / Favorites

Advanced filters

Admin dashboard

Dark/Light mode toggle

📸 Screenshots

👨‍💻 Author

Aryan
Built with perseverance, debugging discipline, and real-world deployment experience.

⭐️ Support

If you like this project:

⭐ Star the repo

🛠 Fork and extend

🐛 Open issues for improvements

✅ This project demonstrates:

Real authentication

Cloud deployment

Secure backend

Full-stack integration

Production debugging skills
