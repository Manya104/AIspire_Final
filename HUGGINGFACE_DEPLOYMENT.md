# Hugging Face Spaces Deployment Guide for AIspire

## What is Hugging Face Spaces?
- **Free** cloud hosting for AI/ML projects
- Perfect for Python + React apps
- Supports Docker (backend) and Node.js (frontend)
- No credit card required
- Great for portfolio projects

---

## Deployment Steps

### Prerequisites
1. Create a **free** account on https://huggingface.co
2. Verify email
3. Create a **Personal Access Token** (Settings → Access Tokens)
4. Your GitHub repo pushed (✅ already done)

---

## Step 1: Deploy Backend on Hugging Face Spaces

### 1A. Create Backend Space
1. Go to https://huggingface.co/spaces
2. Click **"Create new Space"**
3. Fill in details:
   - **Space name:** `aispire-backend`
   - **License:** OpenRAIL-M (recommended)
   - **SDK:** Docker
   - **Visibility:** Public
4. Click **"Create Space"**

### 1B. Connect GitHub
1. In the new space, go to **"Files"** tab
2. Click **"Clone repository"** → **"Git"**
3. Paste: `https://github.com/Manya104/AIspire_Final`
4. Click **"Clone"**
5. Wait for files to appear

### 1C. Setup Backend Files
1. Go to **"Files"** tab
2. **Create new file** → name it: `app_dockerfile`
3. Copy content from: [backend/Dockerfile](backend/Dockerfile)
4. Rename `app_dockerfile` to `Dockerfile`
5. The space should auto-detect and start building

### 1D: Save Backend URL
Once deployed (shows green "Running"):
- Copy the space URL (e.g., `https://huggingface.co/spaces/YourUsername/aispire-backend`)
- The actual API URL will be: `https://YourUsername-aispire-backend.hf.space`

---

## Step 2: Deploy Frontend on Hugging Face Spaces

### 2A. Create Frontend Space
1. Go to https://huggingface.co/spaces
2. Click **"Create new Space"**
3. Fill in details:
   - **Space name:** `aispire-frontend`
   - **License:** OpenRAIL-M
   - **SDK:** Docker (for Node.js)
   - **Visibility:** Public
4. Click **"Create Space"**

### 2B. Connect GitHub
1. Go to **"Files"** → **"Clone repository"** → **"Git"**
2. Paste: `https://github.com/Manya104/AIspire_Final`
3. Click **"Clone"**

### 2C. Setup Frontend Dockerfile
1. Go to **"Files"** tab
2. Create new file called `Dockerfile`
3. Paste this content:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY frontend-react/package*.json ./

RUN npm install

COPY frontend-react/ .

ENV VITE_API_URL=https://YourUsername-aispire-backend.hf.space

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

4. **Replace `YourUsername`** with your actual Hugging Face username
5. Save - space will auto-build

### 2D. Save Frontend URL
Once running:
- Frontend URL: `https://YourUsername-aispire-frontend.hf.space`

---

## Step 3: Set Backend Environment Variables

1. Go to Backend Space
2. Click **"Settings"** (gear icon)
3. Scroll to **"Repository secrets"**
4. Add these:

```
GEMINI_API_KEY = (your key or leave empty)
JWT_SECRET = aispire_secret_key
FLASK_ENV = production
FLASK_DEBUG = 0
```

5. Click **"Add"** → space will redeploy

---

## Step 4: Test Your Deployment

1. Open Frontend URL in browser
2. Should load your React app
3. Try searching or using features
4. Check console for any API errors

---

## Troubleshooting

### Backend won't start?
1. Go to Backend Space
2. Click **"Logs"** tab
3. Look for error messages
4. Common issues:
   - Missing Dockerfile
   - Insufficient requirements
   - API key issues

### Frontend can't reach backend?
1. Check **VITE_API_URL** is correct
2. Make sure backend is running
3. Check browser console for CORS errors
4. Backend needs CORS enabled (should be in your code)

### Build takes too long?
- Hugging Face free tier has limited resources
- First build can take 5-10 minutes
- Subsequent deployments are faster

---

## Important Notes

✅ **Advantages:**
- Completely FREE
- Perfect for ML projects
- Easy GitHub integration
- Good uptime

⚠️ **Limitations:**
- Space goes to sleep if inactive for 48 hours
- Limited CPU/RAM
- Cold start can be slow
- Not ideal for high-traffic production apps

💡 **Keep it Running:**
- If you want space to stay active:
  - Ping it regularly (write a simple script)
  - Or upgrade to Hugging Face PRO ($9/month)

---

## Next Steps

1. Go to https://huggingface.co/spaces
2. Create spaces following Steps 1-2 above
3. Deploy and test
4. Come back if you hit issues!

Good luck! 🚀
