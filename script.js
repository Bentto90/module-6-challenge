const apiKey = '6282ba3f6a12a4129fe915403dbf644a';
const apiUrl = 'https://api.openweathermap.org/data/2.5';
let searchHistory = [];


const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchInfo = document.getElementById('search-info');
const cityInfo = document.getElementById('city-info');
const forecastInfo = document.getElementById('forecast-info');
const searchHistoryList = document.getElementById('search-history-list');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const cityName = cityInput.value.trim();
    if (cityName) {
        cityInput.value = '';
    
        getWeatherData(cityName);
        }
    }
);

function displayError(message) {
    alert(message);
}

function saveSearchHistory(city) {
    if (searchHistory.indexOf(city) === -1) {
        searchHistory.push(city);
        renderSearchHistory();
    }
}

function renderSearchHistory() {
    searchHistoryList.innerHTML = '';
    searchHistory.forEach((city) => {
        const li = document.createElement('li');
        li.textContent = city;
        searchHistoryList.appendChild(li);
    });
}

function getWeatherData(cityName) {
    const apiUrlCurrent = `${apiUrl}/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

    fetch(apiUrlCurrent)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod === '404') {
                displayError(data.message);
                return;
            }

        const city = data.name;
        const icon = data.weather[0].icon;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        cityInfo.innerHTML = `
        <div class="card">
        <h3 class="text-center">${city}</h3>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon" class="img-thumbnail weather-icon">
        <p>Temperature: ${temperature} °F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} MPH</p>
        </div>
        `;

        saveSearchHistory(city);
        });

        const apiUrlForecast = `${apiUrl}/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;

        fetch(apiUrlForecast)
            .then((response) => response.json())    
            .then((data) => {
                if (data.cod === '404') {
                    displayError(data.message);
                    return;
                }

                const forecastItems = data.list.slice(0, 5);
                let forecastHtml = '';

                forecastItems.forEach((item) => {
                    const forecastDate = new Date(item.dt * 1000).toLocaleDateString();
                    const forecastIcon = item.weather[0].icon;
                    const forecastTemp = item.main.temp;
                    const forecastHumidity = item.main.humidity;
                    const forecastWindSpeed = item.wind.speed;

                    forecastHtml += `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${forecastDate}</h5>
                            <img src="http://openweathermap.org/img/wn/${forecastIcon}.png" alt="Weather Icon" class="img-thumbnail weather-icon">
                            <p class="card-text">Temperature: ${forecastTemp} °F</p>
                            <p class="card-text">Humidity: ${forecastHumidity}%</p>
                            <p class="card-text">Wind Speed: ${forecastWindSpeed} MPH</p>
                        </div>
                    </div>
                    `;
                });

                forecastInfo.innerHTML = forecastHtml;
            })

            .catch((error) => {
                displayError('Please try again later.', error);
            });

            }

        renderSearchHistory();


