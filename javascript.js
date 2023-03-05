const form = document.getElementById("location-form");
const cityInput = document.getElementById("city-input");
const weatherInfo = document.getElementById("weather-info");
const searchHistory = document.getElementById("search-history");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value;

  // Use the city name to call the OpenWeatherMap API
  const apiKey = "12a56ef9909ab9cdfb6518c33cbf6a7e";
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Unable to get weather data for that city.");
      }
    })
    .then((data) => {
      // Clear any previous weather info and error messages
      weatherInfo.innerHTML = "";
      weatherInfo.classList.remove("error-message");

      // Create weather cards for the current and future conditions
      const currentWeather = data.list[0];
      const futureWeather = data.list.slice(1, 6);

      const currentCard = createWeatherCard(currentWeather);
      const futureCards = futureWeather.map((weather) => createWeatherCard(weather));

      // Add the weather cards to the page
      weatherInfo.appendChild(currentCard);
      futureCards.forEach((card) => weatherInfo.appendChild(card));

      // Add the city to the search history
      const historyItem = document.createElement("li");
      historyItem.textContent = city;
      searchHistory.appendChild(historyItem);

      // Clear the city input
      cityInput.value = "";
    })
    .catch((error) => {
      // Display an error message if the API call fails
      weatherInfo.innerHTML = error.message;
      weatherInfo.classList.add("error-message");
    });
});

function createWeatherCard(weatherData) {
  const date = new Date(weatherData.dt * 1000);
  const dateString = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const iconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
  const tempF = Math.round((weatherData.main.temp - 273.15) * 1.8 + 32);
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;

  const card = document.createElement("div");
  card.classList.add("weather-card");

  const dateElement = document.createElement("h2");
  dateElement.textContent = dateString;

  const iconElement = document.createElement("img");
  iconElement.src = iconUrl;
  iconElement.alt = weatherData.weather[0].description;

  const tempElement = document.createElement("p");
  tempElement.innerHTML = `Temperature: ${tempF}&deg;F`;

  const humidityElement = document.createElement("p");
  humidityElement.textContent = `Humidity: ${humidity}%`;

  const windElement = document.createElement("p");
  windElement.textContent = `Wind Speed: ${windSpeed} mph`;

  card.appendChild(dateElement);
  card.appendChild(iconElement);
  card.appendChild(tempElement);
  card.appendChild(humidityElement);
  card.appendChild(windElement);

  return card;
}

