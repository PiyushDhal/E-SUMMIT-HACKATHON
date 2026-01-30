# E-SUMMIT-HACKATHON
# Expense X - Smart Expense Guardian for Students 💰

A comprehensive full-stack expense tracking application designed specifically for students to manage their finances intelligently.

## 🌟 Features

- **Smart Budget Management**: Set monthly budgets and savings goals
- **Expense Tracking**: Track all your expenses with categories
- **Visual Analytics**: See spending patterns with category breakdowns
- **Smart Alerts**: Get intelligent warnings about overspending
- **Multiple Categories**: Food, Transport, Education, Entertainment, Shopping, Health, Utilities, and more
- **Real-time Updates**: Instant dashboard updates
- **Responsive Design**: Works on all devices
- **Advanced Filtering**: Filter by category and search expenses

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Structure and content
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Interactive functionality and API integration

### Backend
- **Python (FastAPI)**: User management, analytics, and recommendations
- **Node.js + Express**: Expense CRUD operations and statistics
- **MongoDB**: Database for storing users and expenses

## 📁 Project Structure

```
expense-x/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Styling
│   └── script.js           # Frontend logic
├── backend/
│   ├── fastapi/
│   │   ├── main.py         # FastAPI application
│   │   └── requirements.txt
│   └── nodejs/
│       ├── server.js       # Express server
│       ├── package.json
│       └── .env.example
└── database/
    └── init-db.js          # MongoDB initialization
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB 4.4+

### 1. Clone the Repository
```bash
git clone <repository-url>
cd expense-x
```

### 2. Setup MongoDB
```bash
# Start MongoDB service
mongod

# Initialize database (in a new terminal)
mongosh < database/init-db.js
```

### 3. Setup FastAPI Backend
```bash
cd backend/fastapi

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
python main.py
```
FastAPI will run on `http://localhost:8000`

### 4. Setup Node.js Backend
```bash
cd backend/nodejs

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run Node.js server
npm start

# Or for development with auto-reload:
npm run dev
```
Node.js server will run on `http://localhost:3000`

### 5. Run Frontend
```bash
cd frontend

# Option 1: Using Python's HTTP server
python -m http.server 8080

# Option 2: Using Node's http-server
npx http-server -p 8080

# Option 3: Open index.html directly in browser
```
Open `http://localhost:8080` in your browser

## 📚 API Documentation

### FastAPI Endpoints (Port 8000)

#### User Management
- `POST /api/user` - Create new user
- `GET /api/user/{user_id}` - Get user details
- `PUT /api/user/{user_id}/budget` - Update budget and savings goal
- `DELETE /api/user/{user_id}` - Delete user

#### Analytics & Recommendations
- `GET /api/user/{user_id}/analytics` - Get spending analytics
- `GET /api/user/{user_id}/recommendations` - Get smart recommendations

#### Health Check
- `GET /health` - Check API health status

### Node.js Endpoints (Port 3000)

#### Expense Operations
- `GET /api/expenses` - Get all expenses (with optional filters)
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

#### Filtered Queries
- `GET /api/expenses/user/:userId` - Get expenses by user
- `GET /api/expenses/category/:category` - Get expenses by category
- `GET /api/expenses/recent/:limit` - Get recent expenses
- `GET /api/expenses/range/:startDate/:endDate` - Get expenses in date range

#### Statistics
- `GET /api/expenses/stats/summary` - Get comprehensive statistics

#### Bulk Operations
- `POST /api/expenses/bulk-delete` - Delete multiple expenses

#### Health Check
- `GET /health` - Check API health status

## 📊 Database Schema

### Users Collection
```javascript
{
  id: Number,           // Unique user ID
  name: String,         // User's name
  email: String,        // User's email (unique)
  budget: Number,       // Monthly budget
  savingsGoal: Number,  // Savings target
  createdAt: Date       // Account creation date
}
```

### Expenses Collection
```javascript
{
  id: Number,           // Unique expense ID
  name: String,         // Expense name/description
  amount: Number,       // Expense amount
  category: String,     // Category (food, transport, etc.)
  date: Date,           // Expense date
  notes: String,        // Additional notes
  userId: Number,       // Reference to user
  createdAt: Date,      // Record creation time
  updatedAt: Date       // Last update time
}
```

## 🎨 Features in Detail

### Smart Alerts
- **Budget Exceeded**: When spending exceeds budget
- **Budget Warning**: When 90%+ of budget is used
- **Category Alerts**: When specific categories consume too much
- **Projection Alerts**: Based on current spending rate
- **Savings Achievement**: When savings goals are met

### Category Breakdown
Visual representation of spending across:
- 🍔 Food & Dining
- 🚌 Transportation
- 📚 Education
- 🎬 Entertainment
- 🛍️ Shopping
- 💊 Health
- 💡 Utilities
- 📦 Other

### Analytics Dashboard
- Monthly budget overview
- Total spent tracking
- Remaining budget calculation
- Savings progress
- Visual progress bars
- Category-wise spending charts

## 🔒 Security Considerations

For production deployment:
- Enable CORS properly with specific origins
- Add authentication (JWT, OAuth)
- Implement rate limiting
- Add input validation and sanitization
- Use HTTPS
- Secure MongoDB with authentication
- Add environment variable management
- Implement logging and monitoring

## 🚀 Deployment

### Frontend
- Deploy on: Netlify, Vercel, GitHub Pages
- Simply upload the `frontend` folder

### Backend (FastAPI)
- Deploy on: Heroku, AWS, Google Cloud, Railway
- Use Docker for containerization

### Backend (Node.js)
- Deploy on: Heroku, AWS, Google Cloud, Railway
- Use PM2 for process management

### Database
- Use: MongoDB Atlas (cloud)
- Or self-host on VPS

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] User authentication and authorization
- [ ] Multiple user support with login
- [ ] Export data to CSV/PDF
- [ ] Budget templates
- [ ] Recurring expenses
- [ ] Bill reminders
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Multi-currency support
- [ ] Data visualization with charts
- [ ] Email notifications
- [ ] Social sharing

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Expense X Development Team

## 🙏 Acknowledgments

- Designed for students by understanding their financial needs
- Built with modern web technologies
- Inspired by the need for simple yet powerful expense tracking

## 📞 Support

For support, email support@expensex.com or open an issue in the repository.

---

**Made with ❤️ for Students**
