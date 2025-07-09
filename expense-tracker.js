// DOM Elements
const budgetAmount = document.getElementById('budget-amount');
const setBudgetBtn = document.getElementById('set-budget');
const totalBudgetDisplay = document.getElementById('total-budget');
const remainingBudgetDisplay = document.getElementById('remaining-budget');
const expenseForm = document.getElementById('expense-form');
const expensesContainer = document.getElementById('expenses-container');
const filterCategory = document.getElementById('filter-category');

// State
let budget = 0;
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Initialize
function init() {
    // Load budget from localStorage
    const savedBudget = localStorage.getItem('budget');
    if (savedBudget) {
        budget = parseFloat(savedBudget);
        updateBudgetDisplay();
    }

    // Display existing expenses
    displayExpenses();
}

// Update budget display
function updateBudgetDisplay() {
    totalBudgetDisplay.textContent = `$${budget.toFixed(2)}`;
    const remaining = budget - calculateTotalExpenses();
    remainingBudgetDisplay.textContent = `$${remaining.toFixed(2)}`;
}

// Calculate total expenses
function calculateTotalExpenses() {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

// Add expense
function addExpense(description, amount, category) {
    const expense = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString()
    };

    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updateBudgetDisplay();
}

// Delete expense
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updateBudgetDisplay();
}

// Display expenses
function displayExpenses() {
    const selectedCategory = filterCategory.value;
    const filteredExpenses = selectedCategory === 'all'
        ? expenses
        : expenses.filter(expense => expense.category === selectedCategory);

    expensesContainer.innerHTML = '';

    filteredExpenses.forEach(expense => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'expense-item';
        expenseElement.innerHTML = `
            <div class="expense-info">
                <div class="expense-description">${expense.description}</div>
                <div class="expense-category">${expense.category}</div>
                <div class="expense-date">${new Date(expense.date).toLocaleDateString()}</div>
            </div>
            <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
            <button class="delete-expense" onclick="deleteExpense(${expense.id})">Delete</button>
        `;
        expensesContainer.appendChild(expenseElement);
    });
}

// Event Listeners
setBudgetBtn.addEventListener('click', () => {
    const amount = parseFloat(budgetAmount.value);
    if (amount > 0) {
        budget = amount;
        localStorage.setItem('budget', budget);
        updateBudgetDisplay();
        budgetAmount.value = '';
    } else {
        alert('Please enter a valid budget amount');
    }
});

expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = document.getElementById('expense-description').value;
    const amount = document.getElementById('expense-amount').value;
    const category = document.getElementById('expense-category').value;

    if (budget === 0) {
        alert('Please set a budget first');
        return;
    }

    const totalExpenses = calculateTotalExpenses();
    if (totalExpenses + parseFloat(amount) > budget) {
        alert('This expense exceeds your budget!');
        return;
    }

    addExpense(description, amount, category);
    expenseForm.reset();
});

filterCategory.addEventListener('change', displayExpenses);

// Initialize the app
init(); 