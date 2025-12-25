const API_KEY = "2a7d9df19dd0a0ad1130ab840d73629a"; // OpenWeatherMap API key

// Fetch current weather data for the entered city
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city name");

  try {
     // Fetch current weather data from OpenWeatherMap API
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    const currentData = await currentRes.json();

       // Check if the API returned an error
    if (currentData.cod !== 200) {
      alert(currentData.message);
      return;
    }
    displayCurrentWeather(currentData); // Show current weather on the page
    getForecast(city); // Fetch and display forecast
    document.getElementById("weatherCard").style.display = "block"; // Show weather card

    // Auto day/night based on icon
    const isNight = currentData.weather[0].icon.includes("n");
    document.body.classList.toggle("night", isNight);
  } catch (error) {
    alert("Error fetching weather data");
  }
}

// Display current weather information on the page
function displayCurrentWeather(data) {
  document.getElementById("cityName").textContent = data.name;
  document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById("description").textContent = data.weather[0].description;
  document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
  
  const weatherIcon = document.getElementById("weatherIcon");
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  
  // Remove all animation classes
  weatherIcon.classList.remove(
    "weather-sunny",
    "weather-rain",
    "weather-cloudy",
    "weather-snow",
    "weather-storm",
    "weather-mist"
  );
  
  // Add animation based on weather condition
  const main = data.weather[0].main.toLowerCase();
  const description = data.weather[0].description.toLowerCase();
  
  if (main.includes("rain")) {
    weatherIcon.classList.add("weather-rain");
  } else if (main.includes("cloud")) {
    weatherIcon.classList.add("weather-cloudy");
  } else if (main.includes("clear") || main.includes("sunny")) {
    weatherIcon.classList.add("weather-sunny");
  } else if (main.includes("snow")) {
    weatherIcon.classList.add("weather-snow");
  } else if (main.includes("thunder") || main.includes("storm")) {
    weatherIcon.classList.add("weather-storm");
  } else if (main.includes("mist") || main.includes("fog")) {
    weatherIcon.classList.add("weather-mist");
  }
}

// Fetch 5-day weather forecast for the city
async function getForecast(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );
  const data = await res.json();

  const forecastEl = document.getElementById("forecast");
  forecastEl.innerHTML = "";

  // Pick one forecast per day (12:00 PM)
  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  daily.slice(0, 5).forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short' });
    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `
      <div>${date}</div>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
      <div>${Math.round(day.main.temp)}°C</div>
    `;
    forecastEl.appendChild(div);
  });
}

function toggleTheme() {
  document.body.classList.toggle("night");
}
