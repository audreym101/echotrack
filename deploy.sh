#!/bin/bash

echo "🚀 Deploying EchoTrack NGO Platform..."

# Check if we're in the right directory
if [ ! -f "backend/server.js" ]; then
    echo "❌ Error: backend/server.js not found. Make sure you're in the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd backend && npm install && cd ..

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: .env file not found. Make sure to set environment variables in your hosting platform."
fi

echo "✅ Ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy on your chosen platform:"
echo "   - Railway: https://railway.app"
echo "   - Render: https://render.com"
echo "   - Vercel: https://vercel.com"
echo ""
echo "3. Set environment variables:"
echo "   - MONGO_URI: Your MongoDB connection string"
echo "   - NODE_ENV: production"
echo ""
echo "🌐 Your app will be live at the URL provided by your hosting platform!" 