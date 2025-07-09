// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const country = document.getElementById('country');
const temp = document.getElementById('temp');
const weatherIcon = document.getElementById('weather-icon');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

// API Key
const API_KEY = '2d91f67f344cb4b455658c359e53e86e';

// Fetch weather data
async function getWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        if (!response.ok) {
            // Show the actual API error message if available
            const apiMsg = data && data.message ? data.message : 'City not found';
            throw new Error(apiMsg);
        }
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

// Update weather display
function updateWeatherDisplay(data) {
    cityName.textContent = data.name;
    country.textContent = data.sys.country;
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    description.textContent = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} km/h`;
}

// Handle search
async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        // Show loading state
        searchBtn.disabled = true;
        searchBtn.textContent = 'Searching...';
        const data = await getWeatherData(city);
        updateWeatherDisplay(data);
    } catch (error) {
        alert((error.message || 'Failed to fetch weather data. Please check the city name and try again.') + '\nTip: Try a more specific city name, e.g., "Ahmedabad,IN" or "Paris,FR".');
    } finally {
        // Reset button state
        searchBtn.disabled = false;
        searchBtn.textContent = 'Search';
    }
}

// Event Listeners
searchBtn.addEventListener('click', handleSearch);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Initialize with a default city
cityInput.value = 'Ahmedabad';
handleSearch(); 