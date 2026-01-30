from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os

app = FastAPI(title="Expense X - FastAPI Backend", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.expense_x

# Pydantic Models
class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    budget: float = 0.0
    savingsGoal: float = 0.0
    createdAt: Optional[datetime] = None

class UserBudgetUpdate(BaseModel):
    budget: float = Field(..., gt=0, description="Monthly budget must be positive")
    savingsGoal: float = Field(default=0, ge=0, description="Savings goal must be non-negative")

class BudgetAnalytics(BaseModel):
    totalSpent: float
    remaining: float
    percentUsed: float
    categoryBreakdown: dict
    topCategories: List[dict]
    projectedMonthlySpending: float

class SmartRecommendation(BaseModel):
    type: str
    message: str
    severity: str
    category: Optional[str] = None

# Helper Functions
def user_helper(user) -> dict:
    return {
        "id": user.get("id"),
        "name": user.get("name"),
        "email": user.get("email"),
        "budget": user.get("budget", 0.0),
        "savingsGoal": user.get("savingsGoal", 0.0),
        "createdAt": user.get("createdAt")
    }

# Routes
@app.get("/")
async def root():
    return {
        "message": "Welcome to Expense X FastAPI Backend",
        "version": "1.0.0",
        "endpoints": [
            "/api/user/{user_id}",
            "/api/user/{user_id}/budget",
            "/api/user/{user_id}/analytics",
            "/api/user/{user_id}/recommendations"
        ]
    }

@app.post("/api/user", status_code=status.HTTP_201_CREATED)
async def create_user(user: User):
    """Create a new user"""
    user_dict = user.dict()
    user_dict["createdAt"] = datetime.now()
    
    # Generate user ID
    last_user = await db.users.find_one(sort=[("id", -1)])
    user_dict["id"] = (last_user["id"] + 1) if last_user else 1
    
    result = await db.users.insert_one(user_dict)
    
    if result.inserted_id:
        new_user = await db.users.find_one({"_id": result.inserted_id})
        return user_helper(new_user)
    
    raise HTTPException(status_code=500, detail="Failed to create user")

@app.get("/api/user/{user_id}")
async def get_user(user_id: int):
    """Get user by ID"""
    user = await db.users.find_one({"id": user_id})
    
    if user:
        return user_helper(user)
    
    raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")

@app.put("/api/user/{user_id}/budget")
async def update_budget(user_id: int, budget_update: UserBudgetUpdate):
    """Update user's budget and savings goal"""
    user = await db.users.find_one({"id": user_id})
    
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
    
    update_result = await db.users.update_one(
        {"id": user_id},
        {"$set": {
            "budget": budget_update.budget,
            "savingsGoal": budget_update.savingsGoal
        }}
    )
    
    if update_result.modified_count:
        updated_user = await db.users.find_one({"id": user_id})
        return user_helper(updated_user)
    
    return user_helper(user)

@app.get("/api/user/{user_id}/analytics")
async def get_analytics(user_id: int):
    """Get budget analytics for user"""
    user = await db.users.find_one({"id": user_id})
    
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
    
    # Get expenses from Node.js database (simulated)
    # In production, you would call the Node.js API or query the same MongoDB
    expenses = []  # This would be fetched from expenses collection
    
    total_spent = sum(exp.get("amount", 0) for exp in expenses)
    budget = user.get("budget", 0)
    remaining = budget - total_spent
    percent_used = (total_spent / budget * 100) if budget > 0 else 0
    
    # Category breakdown
    category_breakdown = {}
    for exp in expenses:
        category = exp.get("category", "other")
        category_breakdown[category] = category_breakdown.get(category, 0) + exp.get("amount", 0)
    
    # Top categories
    top_categories = [
        {"category": cat, "amount": amount}
        for cat, amount in sorted(category_breakdown.items(), key=lambda x: x[1], reverse=True)[:5]
    ]
    
    # Projected spending
    current_day = datetime.now().day
    avg_daily = total_spent / current_day if current_day > 0 else 0
    projected_monthly = avg_daily * 30
    
    return BudgetAnalytics(
        totalSpent=total_spent,
        remaining=remaining,
        percentUsed=round(percent_used, 2),
        categoryBreakdown=category_breakdown,
        topCategories=top_categories,
        projectedMonthlySpending=round(projected_monthly, 2)
    )

@app.get("/api/user/{user_id}/recommendations")
async def get_recommendations(user_id: int):
    """Get smart recommendations based on spending patterns"""
    user = await db.users.find_one({"id": user_id})
    
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
    
    recommendations = []
    
    # Get analytics
    analytics = await get_analytics(user_id)
    
    # Budget recommendations
    if analytics.percentUsed >= 100:
        recommendations.append(SmartRecommendation(
            type="budget_exceeded",
            message=f"You've exceeded your budget by ₹{abs(analytics.remaining):.2f}. Consider reducing expenses.",
            severity="critical"
        ))
    elif analytics.percentUsed >= 90:
        recommendations.append(SmartRecommendation(
            type="budget_warning",
            message=f"You've used {analytics.percentUsed:.1f}% of your budget. Be cautious with spending!",
            severity="warning"
        ))
    elif analytics.percentUsed >= 75:
        recommendations.append(SmartRecommendation(
            type="budget_alert",
            message=f"You've used {analytics.percentUsed:.1f}% of your budget. Consider limiting non-essential expenses.",
            severity="info"
        ))
    
    # Category recommendations
    for cat_data in analytics.topCategories[:3]:
        category = cat_data["category"]
        amount = cat_data["amount"]
        category_percent = (amount / analytics.totalSpent * 100) if analytics.totalSpent > 0 else 0
        
        if category_percent > 40:
            recommendations.append(SmartRecommendation(
                type="category_alert",
                message=f"{category.title()} accounts for {category_percent:.1f}% of spending. Try to reduce this category.",
                severity="warning",
                category=category
            ))
    
    # Savings recommendations
    if analytics.remaining > 0 and analytics.remaining >= user.get("savingsGoal", 0):
        recommendations.append(SmartRecommendation(
            type="savings_achieved",
            message=f"Great job! You've reached your savings goal of ₹{user.get('savingsGoal', 0):.2f}!",
            severity="success"
        ))
    
    # Projection recommendations
    if analytics.projectedMonthlySpending > user.get("budget", 0):
        overspend = analytics.projectedMonthlySpending - user.get("budget", 0)
        recommendations.append(SmartRecommendation(
            type="projection_warning",
            message=f"At current rate, you'll exceed budget by ₹{overspend:.2f} this month.",
            severity="warning"
        ))
    
    # Success message
    if not recommendations:
        recommendations.append(SmartRecommendation(
            type="all_good",
            message="Excellent! You're managing your expenses well. Keep it up!",
            severity="success"
        ))
    
    return recommendations

@app.delete("/api/user/{user_id}")
async def delete_user(user_id: int):
    """Delete user"""
    result = await db.users.delete_one({"id": user_id})
    
    if result.deleted_count:
        return {"message": f"User {user_id} deleted successfully"}
    
    raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Expense X FastAPI",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
