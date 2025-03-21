const API_KEY = "e611c0be99defa59fa26f82c05ce9bfb";


const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchHistoryDiv = document.getElementById("search-history");
const currentWeatherDiv = document.getElementById("current-weather");
const forecastDiv = document.getElementById("forecast");


document.addEventListener("DOMContentLoaded", () => {
  const storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  storedHistory.forEach((city) => addToSearchHistory(city, false));
});


searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
    addToSearchHistory(city, true); 
    cityInput.value = ""; 
  }
});


async function fetchWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayCurrentWeather(data);
    displayForecast(data);
  } catch (error) {
    alert("Unable to fetch weather data. Please try again.");
    console.error(error);
  }
}


function displayCurrentWeather(data) {
  const currentWeather = data.list[0];
  const { temp, humidity } = currentWeather.main;
  const { speed } = currentWeather.wind;
  const icon = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`;
  currentWeatherDiv.innerHTML = `
    <h2>Current Weather in ${data.city.name}</h2>
    <p>Date: ${new Date(currentWeather.dt * 1000).toLocaleDateString()}</p>
    <img src="${icon}" alt="Weather Icon">
    <p>Temperature: ${temp}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${speed} m/s</p>
  `;
}


function displayForecast(data) {
  forecastDiv.innerHTML = "<h2>5-Day Forecast</h2>";
  const dailyForecasts = data.list.filter((_, index) => index % 8 === 0);
  dailyForecasts.forEach((forecast) => {
    const { temp, humidity } = forecast.main;
    const { speed } = forecast.wind;
    const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
    forecastDiv.innerHTML += `
      <div class="forecast-item">
        <p>Date: ${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
        <img src="${icon}" alt="Weather Icon">
        <p>Temperature: ${temp}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${speed} m/s</p>
      </div>
    `;
  });
}


function addToSearchHistory(city, saveToStorage) {

  if (Array.from(searchHistoryDiv.children).some((child) => child.textContent === city)) return;

  const searchItem = document.createElement("div");
  searchItem.className = "search-item";
  searchItem.textContent = city;
  searchItem.addEventListener("click", () => fetchWeatherData(city));
  searchHistoryDiv.appendChild(searchItem);


  if (saveToStorage) {
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    storedHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(storedHistory));
  }
}