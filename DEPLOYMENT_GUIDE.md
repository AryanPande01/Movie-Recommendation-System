# MovieVerse - Deployment Guide

## 🔧 Environment Variables Required

### Backend (.env file in backend folder)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
TMDB_API_KEY=your_tmdb_api_key
PORT=5001
NODE_ENV=production
```

### Frontend (.env file in frontend folder)
```
VITE_API_URL=https://your-backend-url.com
```

**IMPORTANT:** 
- If your backend and frontend are on the same domain, you can use relative URLs
- If they're on different domains, use the full backend URL (e.g., `https://your-backend.herokuapp.com` or `https://your-backend.render.com`)

## 🚀 Quick Fix for Login/Signup Issues

If login/signup is not working, check:

1. **Backend is running** - Make sure your backend server is deployed and accessible
2. **CORS is configured** - Backend allows all origins (already configured)
3. **API URL is correct** - Set `VITE_API_URL` in frontend `.env` file
4. **Database is connected** - Check `MONGO_URI` is set correctly
5. **JWT_SECRET is set** - Required for token generation

## 📝 Testing Locally

1. **Backend:**
   ```bash
   cd backend
   npm install
   # Create .env file with variables above
   npm start
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   # Create .env file with VITE_API_URL=http://localhost:5001
   npm run dev
   ```

## ✅ All Fixed Issues

- ✅ Login/Signup pages with proper error handling
- ✅ API URL auto-detection for production
- ✅ Better error messages for network issues
- ✅ JWT_SECRET fallback for development
- ✅ Database connection error handling
- ✅ CORS properly configured
- ✅ All routes working correctly

## 🎯 Production Checklist

- [ ] Set all environment variables
- [ ] Backend deployed and accessible
- [ ] Frontend deployed with correct API URL
- [ ] Database connected
- [ ] Test login/signup functionality
- [ ] Test all routes

