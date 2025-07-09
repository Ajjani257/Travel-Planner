// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const convertBtn = document.getElementById('convert-btn');
const swapBtn = document.getElementById('swap-currencies');
const result = document.getElementById('result');
const resultCurrency = document.getElementById('result-currency');
const rate = document.getElementById('rate');
const conversionButtons = document.querySelectorAll('.conversion-btn');

// Fetch exchange rate from API
async function getExchangeRate(from, to) {
    try {
        const response = await fetch(
            `https://api.exchangerate-api.com/v4/latest/${from}`
        );
        const data = await response.json();
        
        if (data.rates && data.rates[to]) {
            return data.rates[to];
        }
        throw new Error('Exchange rate not found');
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        return null;
    }
}

// Convert currency
async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (from === to) {
        result.textContent = amount.toFixed(2);
        resultCurrency.textContent = to;
        rate.textContent = '1.00';
        return;
    }

    const exchangeRate = await getExchangeRate(from, to);
    if (exchangeRate) {
        const convertedAmount = amount * exchangeRate;
        result.textContent = convertedAmount.toFixed(2);
        resultCurrency.textContent = to;
        rate.textContent = exchangeRate.toFixed(4);
    } else {
        alert('Failed to fetch exchange rate. Please try again.');
    }
}

// Swap currencies
function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    // Convert immediately after swapping
    if (amountInput.value) {
        convertCurrency();
    }
}

// Handle popular conversion button clicks
function handleConversionButtonClick(event) {
    const from = event.target.dataset.from;
    const to = event.target.dataset.to;

    fromCurrency.value = from;
    toCurrency.value = to;

    // Convert immediately if amount is entered
    if (amountInput.value) {
        convertCurrency();
    }
}

// Event Listeners
if (convertBtn) {
    convertBtn.addEventListener('click', convertCurrency);
}

if (swapBtn && fromCurrency && toCurrency) {
    swapBtn.addEventListener('click', () => {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
    });
}

// Convert on amount input change
let debounceTimer;
amountInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(convertCurrency, 500);
});
 
// Add event listeners to conversion buttons
conversionButtons.forEach(button => {
    button.addEventListener('click', handleConversionButtonClick);
});

// Initialize with default values
convertCurrency(); 