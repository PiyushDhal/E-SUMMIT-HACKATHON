// MongoDB Initialization Script for Expense X
// Run this script using: mongosh < init-db.js

// Switch to expense_x database
use expense_x;

// Create collections
db.createCollection("users");
db.createCollection("expenses");

// Create indexes for better performance
db.users.createIndex({ "id": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });

db.expenses.createIndex({ "id": 1 }, { unique: true });
db.expenses.createIndex({ "userId": 1 });
db.expenses.createIndex({ "category": 1 });
db.expenses.createIndex({ "date": -1 });
db.expenses.createIndex({ "createdAt": -1 });

// Insert sample user
db.users.insertOne({
    id: 1,
    name: "Demo Student",
    email: "student@example.com",
    budget: 10000,
    savingsGoal: 2000,
    createdAt: new Date()
});

// Insert sample expenses
db.expenses.insertMany([
    {
        id: 1,
        name: "Lunch at Canteen",
        amount: 150,
        category: "food",
        date: new Date("2024-01-28"),
        notes: "Special thali",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        name: "Bus Pass",
        amount: 500,
        category: "transport",
        date: new Date("2024-01-25"),
        notes: "Monthly pass",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        name: "Programming Books",
        amount: 800,
        category: "education",
        date: new Date("2024-01-20"),
        notes: "Python and JavaScript books",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 4,
        name: "Movie Ticket",
        amount: 250,
        category: "entertainment",
        date: new Date("2024-01-15"),
        notes: "Weekend movie",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 5,
        name: "Wireless Headphones",
        amount: 1200,
        category: "shopping",
        date: new Date("2024-01-10"),
        notes: "Bluetooth earbuds",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

print("Database initialized successfully!");
print("Collections created: users, expenses");
print("Sample data inserted");
