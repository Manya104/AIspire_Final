# Railway Deployment Guide for AIspire

## Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub account with your repo pushed
- Git CLI installed

## Deployment Steps

### Step 1: Connect GitHub to Railway
1. Go to https://railway.app and sign in
2. Click "New Project" → "Deploy from GitHub"
3. Connect your GitHub account and authorize Railway
4. Select the `AIspire_Final` repository

### Step 2: Create Backend Service
1. Click "Add a service" in Railway dashboard
2. Select "GitHub Repo"
3. Choose your AIspire repository
4. Configure the service:
   - **Name:** aispire-backend
   - **Root Directory:** (leave empty, or set to root if needed)
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `gunicorn --bind 0.0.0.0:$PORT --timeout 120 wsgi:app`
5. Click "Deploy"

### Step 3: Add Backend Environment Variables
1. In Railway dashboard, go to Backend service → "Variables"
2. Add the following:
   ```
   FLASK_ENV=production
   FLASK_DEBUG=0
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_jwt_secret_key
   ```
3. Click "Save"

### Step 4: Create Frontend Service
1. In Railway, click "Add a service" → "GitHub Repo"
2. Select the same AIspire repository
3. Configure the service:
   - **Name:** aispire-frontend
   - **Root Directory:** frontend-react
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npx serve -s dist`
4. Click "Deploy"

### Step 5: Add Frontend Environment Variables
1. In the Frontend service → "Variables"
2. Add:
   ```
   VITE_API_URL=https://<backend-url>.up.railway.app
   ```
   (Replace `<backend-url>` with your actual backend URL from Railway)

### Step 6: Get Your URLs
- Backend URL: Found in Backend service → "Deployments" section
- Frontend URL: Found in Frontend service → "Deployments" section

### Step 7: Update Frontend API Calls
Make sure your frontend calls use the `VITE_API_URL` environment variable:

```javascript
// In your frontend code (e.g., src/services/api.js)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

## Troubleshooting

**Backend won't start:**
- Check logs in Railway dashboard → Backend → "Logs"
- Ensure `wsgi.py` exists in the backend root
- Verify all environment variables are set

**Frontend can't reach backend:**
- Make sure `VITE_API_URL` is correctly set to backend URL
- Check CORS settings in `backend/app_new.py`
- Verify backend service is running

**Build fails:**
- Check Python version (should be 3.8+)
- Ensure all requirements are in `requirements.txt`
- For frontend, verify Node version is compatible

## Manual Deployment (Alternative)

If automatic deployment doesn't work:

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Deploy from your local directory:**
   ```bash
   cd path/to/AIspire
   railway up
   ```

## Notes
- Railway automatically detects the framework and creates the deployment
- Both services will get unique URLs
- You can enable auto-deployment on every GitHub push
- Monitor usage in Railway dashboard (free tier has limits)
