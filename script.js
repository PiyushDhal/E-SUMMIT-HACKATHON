// API Configuration
const FASTAPI_URL = 'http://localhost:8000';
const NODEJS_URL = 'http://localhost:3000';

// State Management
let currentUser = {
    id: null,
    name: 'Guest',
    budget: 0,
    savingsGoal: 0
};

let expenses = [];
let categoryTotals = {};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    setDefaultDate();
});

// Initialize Application
async function initializeApp() {
    try {
        // Load user data
        await loadUserData();
        
        // Load expenses
        await loadExpenses();
        
        // Update UI
        updateDashboard();
        renderExpenses();
        renderCategoryChart();
        generateSmartAlerts();
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Error loading data. Using demo mode.', 'error');
        useDemoMode();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Expense Form
    document.getElementById('expenseForm').addEventListener('submit', handleAddExpense);
    
    // Budget Form
    document.getElementById('budgetForm').addEventListener('submit', handleSetBudget);
    
    // Filter and Search
    document.getElementById('filterCategory').addEventListener('change', filterExpenses);
    document.getElementById('searchExpense').addEventListener('input', filterExpenses);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// Set Default Date
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expenseDate').value = today;
}

// Load User Data
async function loadUserData() {
    try {
        const response = await fetch(`${FASTAPI_URL}/api/user/1`);
        if (response.ok) {
            const data = await response.json();
            currentUser = data;
            document.getElementById('userName').textContent = currentUser.name;
        } else {
            // Use default user
            currentUser = {
                id: 1,
                name: 'Student User',
                budget: 10000,
                savingsGoal: 2000
            };
        }
    } catch (error) {
        console.error('Error loading user:', error);
        // Use demo data
        currentUser = {
            id: 1,
            name: 'Demo Student',
            budget: 10000,
            savingsGoal: 2000
        };
    }
}

// Load Expenses
async function loadExpenses() {
    try {
        const response = await fetch(`${NODEJS_URL}/api/expenses`);
        if (response.ok) {
            expenses = await response.json();
        } else {
            expenses = getDemoExpenses();
        }
    } catch (error) {
        console.error('Error loading expenses:', error);
        expenses = getDemoExpenses();
    }
}

// Handle Add Expense
async function handleAddExpense(e) {
    e.preventDefault();
    
    const expense = {
        name: document.getElementById('expenseName').value,
        amount: parseFloat(document.getElementById('expenseAmount').value),
        category: document.getElementById('expenseCategory').value,
        date: document.getElementById('expenseDate').value,
        notes: document.getElementById('expenseNotes').value,
        userId: currentUser.id
    };
    
    try {
        const response = await fetch(`${NODEJS_URL}/api/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        });
        
        if (response.ok) {
            const newExpense = await response.json();
            expenses.unshift(newExpense);
            
            // Reset form
            document.getElementById('expenseForm').reset();
            setDefaultDate();
            
            // Update UI
            updateDashboard();
            renderExpenses();
            renderCategoryChart();
            generateSmartAlerts();
            
            showToast('Expense added successfully!', 'success');
        } else {
            showToast('Failed to add expense', 'error');
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        // Add locally for demo
        expense.id = Date.now();
        expenses.unshift(expense);
        
        updateDashboard();
        renderExpenses();
        renderCategoryChart();
        generateSmartAlerts();
        
        showToast('Expense added (demo mode)', 'success');
        document.getElementById('expenseForm').reset();
        setDefaultDate();
    }
}

// Handle Set Budget
async function handleSetBudget(e) {
    e.preventDefault();
    
    const budget = parseFloat(document.getElementById('budgetAmount').value);
    const savingsGoal = parseFloat(document.getElementById('savingsGoal').value) || 0;
    
    try {
        const response = await fetch(`${FASTAPI_URL}/api/user/${currentUser.id}/budget`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ budget, savingsGoal })
        });
        
        if (response.ok) {
            currentUser.budget = budget;
            currentUser.savingsGoal = savingsGoal;
            
            updateDashboard();
            generateSmartAlerts();
            
            showToast('Budget updated successfully!', 'success');
        } else {
            showToast('Failed to update budget', 'error');
        }
    } catch (error) {
        console.error('Error updating budget:', error);
        // Update locally for demo
        currentUser.budget = budget;
        currentUser.savingsGoal = savingsGoal;
        
        updateDashboard();
        generateSmartAlerts();
        
        showToast('Budget updated (demo mode)', 'success');
    }
}

// Delete Expense
async function deleteExpense(expenseId) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }
    
    try {
        const response = await fetch(`${NODEJS_URL}/api/expenses/${expenseId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            expenses = expenses.filter(exp => exp.id !== expenseId);
            
            updateDashboard();
            renderExpenses();
            renderCategoryChart();
            generateSmartAlerts();
            
            showToast('Expense deleted successfully!', 'success');
        } else {
            showToast('Failed to delete expense', 'error');
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        // Delete locally for demo
        expenses = expenses.filter(exp => exp.id !== expenseId);
        
        updateDashboard();
        renderExpenses();
        renderCategoryChart();
        generateSmartAlerts();
        
        showToast('Expense deleted (demo mode)', 'success');
    }
}

// Update Dashboard
function updateDashboard() {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = currentUser.budget - totalSpent;
    const savings = remaining > 0 ? Math.min(remaining, currentUser.savingsGoal) : 0;
    const percentUsed = currentUser.budget > 0 ? (totalSpent / currentUser.budget) * 100 : 0;
    
    // Update budget cards
    document.getElementById('monthlyBudget').textContent = `₹${currentUser.budget.toFixed(2)}`;
    document.getElementById('totalSpent').textContent = `₹${totalSpent.toFixed(2)}`;
    document.getElementById('remaining').textContent = `₹${remaining.toFixed(2)}`;
    document.getElementById('savings').textContent = `₹${savings.toFixed(2)}`;
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = `${Math.min(percentUsed, 100)}%`;
    
    // Change color based on usage
    if (percentUsed >= 90) {
        progressFill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
    } else if (percentUsed >= 75) {
        progressFill.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #10b981, #6366f1)';
    }
    
    document.getElementById('progressText').textContent = `${percentUsed.toFixed(1)}% used`;
}

// Render Expenses
function renderExpenses() {
    const expensesList = document.getElementById('expensesList');
    
    if (expenses.length === 0) {
        expensesList.innerHTML = `
            <div class="empty-state">
                <h3>No expenses yet</h3>
                <p>Start tracking your expenses by adding one above!</p>
            </div>
        `;
        return;
    }
    
    expensesList.innerHTML = expenses.map(expense => `
        <div class="expense-item">
            <div class="expense-details">
                <div class="expense-header">
                    <span class="expense-name">${expense.name}</span>
                    <span class="expense-category">${getCategoryIcon(expense.category)} ${getCategoryName(expense.category)}</span>
                </div>
                <div class="expense-meta">
                    ${formatDate(expense.date)}
                </div>
                ${expense.notes ? `<div class="expense-notes">${expense.notes}</div>` : ''}
            </div>
            <div class="expense-amount-section">
                <span class="expense-amount">₹${expense.amount.toFixed(2)}</span>
                <button class="btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Render Category Chart
function renderCategoryChart() {
    categoryTotals = {};
    
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    const chartContainer = document.getElementById('categoryChart');
    
    if (Object.keys(categoryTotals).length === 0) {
        chartContainer.innerHTML = `
            <div class="empty-state">
                <p>No category data available</p>
            </div>
        `;
        return;
    }
    
    const maxAmount = Math.max(...Object.values(categoryTotals));
    
    chartContainer.innerHTML = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => {
            const percentage = (amount / maxAmount) * 100;
            return `
                <div class="category-item">
                    <span class="category-name">${getCategoryIcon(category)} ${getCategoryName(category)}</span>
                    <div class="category-bar-container">
                        <div class="category-bar" style="width: ${percentage}%"></div>
                    </div>
                    <span class="category-amount">₹${amount.toFixed(2)}</span>
                </div>
            `;
        }).join('');
}

// Generate Smart Alerts
function generateSmartAlerts() {
    const alertsContainer = document.getElementById('alertsContainer');
    const alerts = [];
    
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const percentUsed = currentUser.budget > 0 ? (totalSpent / currentUser.budget) * 100 : 0;
    const remaining = currentUser.budget - totalSpent;
    
    // Budget alerts
    if (percentUsed >= 100) {
        alerts.push({
            type: 'danger',
            message: '🚨 Budget Exceeded! You have overspent by ₹' + Math.abs(remaining).toFixed(2)
        });
    } else if (percentUsed >= 90) {
        alerts.push({
            type: 'danger',
            message: '⚠️ Critical: You have used ' + percentUsed.toFixed(1) + '% of your budget!'
        });
    } else if (percentUsed >= 75) {
        alerts.push({
            type: 'warning',
            message: '⚡ Warning: You have used ' + percentUsed.toFixed(1) + '% of your budget. Spend wisely!'
        });
    }
    
    // Category spending alerts
    Object.entries(categoryTotals).forEach(([category, amount]) => {
        const categoryPercent = (amount / totalSpent) * 100;
        if (categoryPercent > 40) {
            alerts.push({
                type: 'warning',
                message: `💡 ${getCategoryName(category)} accounts for ${categoryPercent.toFixed(1)}% of your spending. Consider reducing expenses in this category.`
            });
        }
    });
    
    // Savings alert
    if (remaining > 0 && remaining >= currentUser.savingsGoal) {
        alerts.push({
            type: 'success',
            message: `🎉 Congratulations! You've reached your savings goal of ₹${currentUser.savingsGoal.toFixed(2)}!`
        });
    }
    
    // Daily spending average
    if (expenses.length > 0) {
        const daysInMonth = 30;
        const avgDailySpending = totalSpent / new Date().getDate();
        const projectedMonthly = avgDailySpending * daysInMonth;
        
        if (projectedMonthly > currentUser.budget) {
            alerts.push({
                type: 'warning',
                message: `📊 At your current spending rate (₹${avgDailySpending.toFixed(2)}/day), you'll exceed your budget by ₹${(projectedMonthly - currentUser.budget).toFixed(2)}`
            });
        }
    }
    
    // Success message
    if (alerts.length === 0 && expenses.length > 0) {
        alerts.push({
            type: 'success',
            message: '✅ Great job! You\'re managing your expenses well. Keep it up!'
        });
    }
    
    if (alerts.length === 0 && expenses.length === 0) {
        alerts.push({
            type: 'info',
            message: '💰 Start tracking your expenses to get personalized insights and alerts!'
        });
    }
    
    alertsContainer.innerHTML = alerts.map(alert => `
        <div class="alert alert-${alert.type}">
            ${alert.message}
        </div>
    `).join('');
}

// Filter Expenses
function filterExpenses() {
    const category = document.getElementById('filterCategory').value;
    const searchTerm = document.getElementById('searchExpense').value.toLowerCase();
    
    const filtered = expenses.filter(expense => {
        const matchesCategory = category === 'all' || expense.category === category;
        const matchesSearch = expense.name.toLowerCase().includes(searchTerm) ||
                            (expense.notes && expense.notes.toLowerCase().includes(searchTerm));
        return matchesCategory && matchesSearch;
    });
    
    const expensesList = document.getElementById('expensesList');
    
    if (filtered.length === 0) {
        expensesList.innerHTML = `
            <div class="empty-state">
                <h3>No expenses found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }
    
    expensesList.innerHTML = filtered.map(expense => `
        <div class="expense-item">
            <div class="expense-details">
                <div class="expense-header">
                    <span class="expense-name">${expense.name}</span>
                    <span class="expense-category">${getCategoryIcon(expense.category)} ${getCategoryName(expense.category)}</span>
                </div>
                <div class="expense-meta">
                    ${formatDate(expense.date)}
                </div>
                ${expense.notes ? `<div class="expense-notes">${expense.notes}</div>` : ''}
            </div>
            <div class="expense-amount-section">
                <span class="expense-amount">₹${expense.amount.toFixed(2)}</span>
                <button class="btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Utility Functions
function getCategoryIcon(category) {
    const icons = {
        food: '🍔',
        transport: '🚌',
        education: '📚',
        entertainment: '🎬',
        shopping: '🛍️',
        health: '💊',
        utilities: '💡',
        other: '📦'
    };
    return icons[category] || '📦';
}

function getCategoryName(category) {
    const names = {
        food: 'Food & Dining',
        transport: 'Transportation',
        education: 'Education',
        entertainment: 'Entertainment',
        shopping: 'Shopping',
        health: 'Health',
        utilities: 'Utilities',
        other: 'Other'
    };
    return names[category] || 'Other';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        showToast('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Demo Mode
function useDemoMode() {
    currentUser = {
        id: 1,
        name: 'Demo Student',
        budget: 10000,
        savingsGoal: 2000
    };
    
    expenses = getDemoExpenses();
    
    updateDashboard();
    renderExpenses();
    renderCategoryChart();
    generateSmartAlerts();
}

function getDemoExpenses() {
    return [
        {
            id: 1,
            name: 'Lunch at Canteen',
            amount: 150,
            category: 'food',
            date: '2024-01-28',
            notes: 'Special thali',
            userId: 1
        },
        {
            id: 2,
            name: 'Bus Pass',
            amount: 500,
            category: 'transport',
            date: '2024-01-25',
            notes: 'Monthly pass',
            userId: 1
        },
        {
            id: 3,
            name: 'Programming Books',
            amount: 800,
            category: 'education',
            date: '2024-01-20',
            notes: 'Python and JavaScript books',
            userId: 1
        },
        {
            id: 4,
            name: 'Movie Ticket',
            amount: 250,
            category: 'entertainment',
            date: '2024-01-15',
            notes: 'Weekend movie',
            userId: 1
        },
        {
            id: 5,
            name: 'Headphones',
            amount: 1200,
            category: 'shopping',
            date: '2024-01-10',
            notes: 'Wireless earbuds',
            userId: 1
        }
    ];
}
