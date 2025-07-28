# 🚀 EchoTrack Deployment Guide

This guide will help you deploy your NGO platform to various hosting services.

## 📋 Prerequisites

1. **MongoDB Atlas Account** (for database)
2. **GitHub Account** (for code repository)
3. **Hosting Platform Account** (choose one below)

## 🗄️ Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Add it to your environment variables

## 🌐 Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository: `audreym101/echotrack`
5. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
6. Deploy!

**Pros:** Free tier, automatic deployments, easy setup
**Cons:** Limited free tier usage

### Option 2: Render (Free Backend)

**Steps:**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** `echotrack-backend`
   - **Environment:** `Node`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
6. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
7. Deploy!

**Pros:** Free tier, reliable
**Cons:** Separate frontend hosting needed

### Option 3: Vercel (Frontend) + Render (Backend)

**Frontend (Vercel):**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Deploy!

**Backend (Render):**
Follow Option 2 above, then update frontend API URLs.

### Option 4: Heroku (Classic)

**Steps:**
1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Add MongoDB addon: `heroku addons:create mongolab`
5. Deploy: `git push heroku main`
6. Open: `heroku open`

**Pros:** Well-established, good documentation
**Cons:** No free tier anymore

## 🔧 Environment Variables

Set these in your hosting platform:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/echotrack
PORT=10000
```

## 📱 Frontend Configuration

After deploying your backend, update the API URLs in your frontend files:

**In `dashboard.js`, `login.js`, `signup.js`, and `index.html`:**
```javascript
// Replace this:
const API_BASE_URL = 'http://localhost:5000/api';

// With your deployed backend URL:
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## 🚀 Quick Deploy Commands

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Render
```bash
# Just push to GitHub and connect in Render dashboard
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 🔍 Testing Your Deployment

1. **Check Backend Health:** Visit `https://your-backend-url.com/api/health`
2. **Test Frontend:** Visit your frontend URL
3. **Test API Endpoints:** Use Postman or browser to test `/api/users`, `/api/donations`, etc.

## 🛠️ Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**
   - Check your `MONGO_URI` environment variable
   - Ensure IP whitelist includes `0.0.0.0/0`

2. **CORS Errors**
   - Backend already has CORS configured
   - Check if frontend URL is correct

3. **Port Issues**
   - Most platforms use `process.env.PORT`
   - Backend is already configured for this

4. **Build Failures**
   - Check `package.json` has correct scripts
   - Ensure all dependencies are in `dependencies` (not `devDependencies`)

## 📊 Monitoring

After deployment, monitor:
- **Uptime:** Use platform's built-in monitoring
- **Logs:** Check application logs for errors
- **Performance:** Monitor response times
- **Database:** Check MongoDB Atlas dashboard

## 🔄 Continuous Deployment

Most platforms automatically deploy when you push to GitHub:
1. Make changes locally
2. Commit and push to GitHub
3. Platform automatically redeploys

## 💰 Cost Estimation

**Free Tiers:**
- Railway: $5/month after free tier
- Render: Free tier available
- Vercel: Free tier available
- Heroku: No free tier

**Recommended for Start:**
- Railway or Render (both have good free tiers)

## 🎯 Next Steps

1. **Choose a platform** from the options above
2. **Set up MongoDB Atlas** database
3. **Deploy backend** first
4. **Update frontend** API URLs
5. **Deploy frontend** (if separate)
6. **Test everything** thoroughly
7. **Share your live URL!**

## 📞 Support

If you encounter issues:
1. Check platform documentation
2. Review error logs
3. Test locally first
4. Contact platform support

---

**Your NGO platform will be live and accessible worldwide! 🌍** 