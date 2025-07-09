// // API Keys (Replace with your actual API keys)
// const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
// const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY';

// // DOM Elements
// const locationSearch = document.getElementById('location-search');
// const searchSuggestions = document.getElementById('search-suggestions');
// const startDate = document.getElementById('start-date');
// const endDate = document.getElementById('end-date');
// const weatherInfo = document.getElementById('weather-info');
// const placesList = document.getElementById('places-list');

// // Debounce function to limit API calls
// function debounce(func, wait) {
//     let timeout;
//     return function executedFunction(...args) {
//         const later = () => {
//             clearTimeout(timeout);
//             func(...args);
//         };
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//     };
// }

// // Location Search with Google Places API
// const searchLocation = debounce(async (query) => {
//     if (query.length < 3) {
//         searchSuggestions.style.display = 'none';
//         return;
//     }

//     try {
//         const response = await fetch(
//             `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
//         );
//         const data = await response.json();

//         if (data.predictions) {
//             searchSuggestions.innerHTML = '';
//             data.predictions.forEach(prediction => {
//                 const div = document.createElement('div');
//                 div.className = 'suggestion-item';
//                 div.textContent = prediction.description;
//                 div.addEventListener('click', () => {
//                     locationSearch.value = prediction.description;
//                     searchSuggestions.style.display = 'none';
//                     getWeatherAndPlaces(prediction.place_id);
//                 });
//                 searchSuggestions.appendChild(div);
//             });
//             searchSuggestions.style.display = 'block';
//         }
//     } catch (error) {
//         console.error('Error fetching location suggestions:', error);
//     }
// }, 300);

// // Get Weather Information
// async function getWeather(lat, lon, start, end) {
//     try {
//         const response = await fetch(
//             `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
//         );
//         const data = await response.json();
        
//         weatherInfo.innerHTML = '';
//         const startDate = new Date(start);
//         const endDate = new Date(end);
        
//         data.list.forEach(forecast => {
//             const forecastDate = new Date(forecast.dt * 1000);
//             if (forecastDate >= startDate && forecastDate <= endDate) {
//                 const weatherCard = document.createElement('div');
//                 weatherCard.className = 'weather-card';
//                 weatherCard.innerHTML = `
//                     <h3>${forecastDate.toLocaleDateString()}</h3>
//                     <p>Temperature: ${Math.round(forecast.main.temp)}°C</p>
//                     <p>Weather: ${forecast.weather[0].description}</p>
//                     <p>Humidity: ${forecast.main.humidity}%</p>
//                 `;
//                 weatherInfo.appendChild(weatherCard);
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching weather data:', error);
//     }
// }

// // Get Nearby Places
// async function getNearbyPlaces(lat, lon) {
//     try {
//         const response = await fetch(
//             `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&type=tourist_attraction&key=${GOOGLE_MAPS_API_KEY}`
//         );
//         const data = await response.json();

//         placesList.innerHTML = '';
//         data.results.forEach(place => {
//             const placeCard = document.createElement('div');
//             placeCard.className = 'place-card';
//             placeCard.innerHTML = `
//                 <img src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}" 
//                      alt="${place.name}" class="place-image">
//                 <div class="place-info">
//                     <h3 class="place-name">${place.name}</h3>
//                     <p class="place-description">${place.vicinity}</p>
//                     <p>Rating: ${place.rating}/5</p>
//                 </div>
//             `;
//             placesList.appendChild(placeCard);
//         });
//     } catch (error) {
//         console.error('Error fetching nearby places:', error);
//     }
// }

// // Get place details and coordinates
// async function getWeatherAndPlaces(placeId) {
//     try {
//         const response = await fetch(
//             `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${GOOGLE_MAPS_API_KEY}`
//         );
//         const data = await response.json();

//         if (data.result && data.result.geometry) {
//             const { lat, lng } = data.result.geometry.location;
//             getWeather(lat, lng, startDate.value, endDate.value);
//             getNearbyPlaces(lat, lng);
//         }
//     } catch (error) {
//         console.error('Error fetching place details:', error);
//     }
// }

// // Event Listeners
// locationSearch.addEventListener('input', (e) => {
//     searchLocation(e.target.value);
// });

// // Close suggestions when clicking outside
// document.addEventListener('click', (e) => {
//     if (!locationSearch.contains(e.target) && !searchSuggestions.contains(e.target)) {
//         searchSuggestions.style.display = 'none';
//     }
// });

// // Set minimum date for date inputs to today
// const today = new Date().toISOString().split('T')[0];
// startDate.min = today;
// endDate.min = today;

// // Update end date minimum when start date changes
// startDate.addEventListener('change', () => {
//     endDate.min = startDate.value;
//     if (endDate.value < startDate.value) {
//         endDate.value = startDate.value;
//     }
// }); 

const API_KEY = '55c2a30e2d91446b984b499148a69b3d';
        const resultsContainer = document.getElementById('results');
        const loadingElement = document.getElementById('loading');
        const errorElement = document.getElementById('error');

        async function searchPlaces() {
            const searchInput = document.getElementById('searchInput').value;
            if (!searchInput.trim()) {
                showError('Please enter a place name');
                return;
            }

            loadingElement.style.display = 'block';
            errorElement.style.display = 'none';
            resultsContainer.innerHTML = '';

            try {
                const response = await fetch(`https://api.geoapify.com/v2/places?text=${encodeURIComponent(searchInput)}&apiKey=${API_KEY}`);
                const data = await response.json();

                if (data.features && data.features.length > 0) {
                    displayResults(data.features);
                } else {
                    showError('No places found for your search');
                }
            } catch (error) {
                showError('Error fetching places. Please try again.');
                console.error('Error:', error);
            } finally {
                loadingElement.style.display = 'none';
            }
        }

        function displayResults(places) {
            resultsContainer.innerHTML = places.map(place => `
                <div class="place-card">
                    <h3>${place.properties.name || 'Unnamed Place'}</h3>
                    <p><strong>Type:</strong> ${place.properties.type || 'N/A'}</p>
                    <p><strong>Address:</strong> ${place.properties.formatted || 'N/A'}</p>
                    ${place.properties.phone ? `<p><strong>Phone:</strong> ${place.properties.phone}</p>` : ''}
                    ${place.properties.website ? `<p><strong>Website:</strong> <a href="${place.properties.website}" target="_blank">Visit Website</a></p>` : ''}
                </div>
            `).join('');
        }

        function showError(message) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        // Add event listener for Enter key
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchPlaces();
            }
        });