# Railway Deployment - Quick Start

## What I've set up for you:

✅ **Backend:**
- `wsgi.py` - Entry point for gunicorn
- `Procfile` - Instructions for Railway to run the backend
- `.env.example` - Template for environment variables
- `app_new.py` - Updated to use PORT environment variable

✅ **Frontend:**
- `.env.production` - Configuration for production API URL
- `api.js` - Updated to use VITE_API_URL environment variable
- `package.json` - Added `start` script for production

## Deployment Steps:

### 1. Push to GitHub
Make sure all changes are pushed:
```bash
git add .
git commit -m "Setup for Railway deployment"
git push origin main
```

### 2. Go to Railway.app
1. Sign up at https://railway.app (free account)
2. Click "New Project"
3. Select "Deploy from GitHub"

### 3. Deploy Backend
1. Click "Add Service" → "GitHub Repo"
2. Select `AIspire_Final` repository
3. In the service settings:
   - Set **Root Directory** to: `backend`
   - Build command will auto-detect (should use `pip install -r requirements.txt`)
   - Start command will auto-detect the `Procfile`
4. Click "Deploy"
5. Once deployed, copy the backend URL (e.g., `https://aispire-backend-production.up.railway.app`)

### 4. Deploy Frontend
1. Click "Add Service" → "GitHub Repo"
2. Select `AIspire_Final` repository again
3. In the service settings:
   - Set **Root Directory** to: `frontend-react`
   - Build: `npm install && npm run build`
   - Start: `npm start`
4. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: (paste the backend URL from step 3)
5. Click "Deploy"

### 5. Set Backend Environment Variables
1. Go to your Backend service in Railway
2. Click "Variables"
3. Add these variables:
   ```
   FLASK_ENV = production
   FLASK_DEBUG = 0
   GEMINI_API_KEY = (your API key here)
   JWT_SECRET = (generate a random secret key)
   ```
4. Click "Save" - Railway will auto-redeploy

### 6. Test Your App
- Frontend URL: Found in Frontend service dashboard
- Backend API: Found in Backend service dashboard
- Try accessing the frontend - it should connect to your backend

## Troubleshooting Commands

### View Backend Logs:
Railway Dashboard → Backend Service → "Logs" tab

### View Frontend Logs:
Railway Dashboard → Frontend Service → "Logs" tab

### If something fails:
1. Check logs first
2. Verify environment variables are set
3. Make sure backend URL in frontend `.env.production` is correct
4. Ensure CORS is enabled in Flask (`flask-cors` should be in requirements.txt)

## Local Testing Before Deployment
```bash
# Test backend locally
cd backend
python app_new.py

# In another terminal, test frontend
cd frontend-react
npm run dev
```

Visit `http://localhost:5173` in your browser (frontend default port)

---

Good luck! Your app is now ready for Railway deployment! 🚀
