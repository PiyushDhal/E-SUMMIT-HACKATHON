# Expense X - Quick Start Guide 🚀

## The Fastest Way to Get Started

### Option 1: Using Docker (Recommended) 🐳

```bash
# 1. Make sure Docker is installed
docker --version

# 2. Start all services with one command
docker-compose up -d

# 3. Wait for services to start (about 30 seconds)

# 4. Open your browser
http://localhost:8080
```

That's it! Everything is running:
- Frontend: http://localhost:8080
- FastAPI: http://localhost:8000
- Node.js: http://localhost:3000
- MongoDB: localhost:27017

### Option 2: Manual Setup 🛠️

#### Step 1: Start MongoDB
```bash
# Install MongoDB (if not already installed)
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb
# Windows: Download from mongodb.com

# Start MongoDB
mongod

# Initialize database (new terminal)
mongosh < database/init-db.js
```

#### Step 2: Start FastAPI Backend
```bash
cd backend/fastapi

# Create virtual environment
python -m venv venv

# Activate it
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

#### Step 3: Start Node.js Backend
```bash
cd backend/nodejs

# Install dependencies
npm install

# Start server
npm start
```

#### Step 4: Open Frontend
```bash
cd frontend

# Option A: Python HTTP server
python -m http.server 8080

# Option B: Node http-server
npx http-server -p 8080

# Option C: Just open index.html in browser
```

## Testing the Application 🧪

### 1. Check if backends are running
```bash
# FastAPI health check
curl http://localhost:8000/health

# Node.js health check
curl http://localhost:3000/health
```

### 2. Test the API
```bash
# Get all expenses
curl http://localhost:3000/api/expenses

# Get user info
curl http://localhost:8000/api/user/1
```

### 3. Use the Web Interface
1. Open http://localhost:8080
2. You'll see demo data already loaded
3. Try adding a new expense
4. Set your monthly budget
5. Explore the smart alerts

## Default Credentials

- **Demo User**: Student User
- **Default Budget**: ₹10,000
- **Savings Goal**: ₹2,000
- **Sample Expenses**: 5 pre-loaded expenses

## Common Issues & Solutions 🔧

### Port Already in Use
```bash
# Check what's using the port
# Windows: netstat -ano | findstr :8080
# macOS/Linux: lsof -i :8080

# Kill the process or use different port
```

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod --version

# Check if it's running
# Windows: tasklist | findstr mongod
# macOS/Linux: ps aux | grep mongod
```

### CORS Errors
- Make sure both backends are running
- Check browser console for specific error
- Verify API URLs in frontend/script.js

## Next Steps 🎯

1. **Customize the budget**: Click "Set Monthly Budget"
2. **Add your expenses**: Use the "Add New Expense" form
3. **Explore categories**: See how spending breaks down
4. **Check smart alerts**: Get personalized recommendations
5. **Filter expenses**: Use the search and filter options

## Development Mode 🔨

For development with auto-reload:

```bash
# FastAPI with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Node.js with nodemon
npm run dev
```

## Stop Services

### Docker
```bash
docker-compose down
```

### Manual
```bash
# Stop each terminal with Ctrl+C
# Or use:
# Windows: taskkill /F /IM python.exe
# macOS/Linux: killall python node mongod
```

## Need Help? 🆘

- Check the full README.md for detailed documentation
- API documentation: 
  - FastAPI: http://localhost:8000/docs
  - Node.js: See README.md for endpoints
- Report issues on GitHub

---

**Happy Expense Tracking! 💰**
