//This JS sets current time, handles form input, API call, and weather data output.

//set default units
var fahrenheit = new Boolean(true);
var city = "";

//Sets style of unit selector
function styleUnitSelector() {
  if (fahrenheit == false) {
    document.getElementById("f").style.opacity = "0.65";
    document.getElementById("c").style.opacity = "1.0";
  } else {
    document.getElementById("c").style.opacity = "0.65";
    document.getElementById("f").style.opacity = "1.0";
  }
}

styleUnitSelector();

//Convert temp according to user unit selection and round
function convertTemp(temp) {
  if (fahrenheit == false) {
    return Math.round(temp);
  } else {
    return Math.round(temp * 1.8 + 32);
  }
} //returns "human readable" temp

//Convert wind speed    kph - C   |   mph - F
function convertSpeed(speed) {
  if (fahrenheit == false) {
    return Math.round(speed * 3.6) + " km/h";
  } else {
    return Math.round(speed * 2.237) + " mph";
  }
} //returns "human readable" wind speed

//Set time. Runs on start and every time API is called.
function setTime() {
  let t = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let hDay = days[t.getDay()];
  let target = document.querySelector("#tdisplay");
  if (t.getHours() >= 10) {
    if (t.getMinutes() >= 10) {
      target.innerHTML = `${hDay} ${t.getHours()}:${t.getMinutes()}`;
    } else {
      target.innerHTML = `${hDay} ${t.getHours()}:0${t.getMinutes()}`;
    }
  } else {
    if (t.getMinutes() >= 10) {
      target.innerHTML = `${hDay} 0${t.getHours()}:${t.getMinutes()}`;
    } else {
      target.innerHTML = `${hDay} 0${t.getHours()}:0${t.getMinutes()}`;
    }
  }
}

setTime();

//Inject forecast HTML
function injectForecast(response) {
  console.log(response);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let t = new Date();

  function convertUnixTime(tStamp) {
    let date = new Date(tStamp * 1000); //convert to miliseconds
    let dayIndex = date.getDay(date);
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayIndex]; //return human readable day
  }

  forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index == 0) {
    } else if (index < 7) {
      //Ignores day 0 because it is for current weather
      forecastHTML =
        forecastHTML +
        `
        <div class="col-4 future">
          <img src="img/${forecastDay.weather[0].icon}.svg" alt="">
          <span id="future-day-1">${convertUnixTime(forecastDay.dt)}</span><br>
          <span id="future-max-1">${convertTemp(
            forecastDay.temp.max
          )}°</span> | <span class="low" id="future-min-1">${convertTemp(
          forecastDay.temp.min
        )}°</span>
        </div>
      `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

//Injects current weather HTML, then calls API to get forecast weather data
function injectCurrentWeather(response) {
  city = response.data.name;
  let cityHeading = document.querySelector("#city");
  cityHeading.innerHTML = `${response.data.name}</br>`;

  let currentElement = document.querySelector("#current");
  currentElement.innerHTML = `
    <div class="row">
      <div class="col-6">
        <img
          id="current-icon"
          src="img/${response.data.weather[0].icon}.svg"
          alt="${response.data.weather[0].description}"
        />
        </div>
          <div class="col-6 datalist">
            <ul class="align-text-middle ">
              <li>
                High: <span id="high-temp">${convertTemp(
                  response.data.main.temp_max
                )}</span>°
              </li>
              <li>
                Low: <span id="low-temp">${convertTemp(
                  response.data.main.temp_min
                )}</span>°
              </li>
              <li>
                Feels like: <span id="feels-like">${convertTemp(
                  response.data.main.feels_like
                )}</span>°
              </li>
              <li>
                Humidity: <span id="rh">${response.data.main.humidity}</span>%
              </li>
              <li>
                Wind: <span id="wind-speed">${convertSpeed(
                  response.data.wind.speed
                )}</span>
              </li>
            </ul>
          </div>
        </div>
      `;

  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&exclude=current,minutely,hourly,alerts&appid=fda3688b1db05987dd5d07c237aecfba&units=metric`;
  axios.get(apiUrl).then(injectForecast);
}

//Runs after user inputs a city, and upon page load
function callWeatherApi(userInput) {
  //get temp from API
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput.trim()}&appid=fda3688b1db05987dd5d07c237aecfba&units=metric`;
  axios.get(apiUrl).then(injectCurrentWeather);
}

//This runs when user changes unit preference. It calls API again, as if they had entered a city into the form
function reevaluateTemp() {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fda3688b1db05987dd5d07c237aecfba&units=metric`;
  axios.get(apiUrl).then(injectCurrentWeather);
}

//Pass user input to API function and reset inputbox
function handleSearchInput(event) {
  event.preventDefault();
  let userInput = document.querySelector("#city-input").value;
  document.getElementById("city-search").reset();
  callWeatherApi(userInput);
}

//Event listener for weather search
let citySelection = document.querySelector("#city-search");
citySelection.addEventListener("submit", handleSearchInput);

//Sets unit
let fButton = document.querySelector("#f");
let cButton = document.querySelector("#c");

function setF() {
  fahrenheit = true;
  styleUnitSelector(); //style unit selector
  reevaluateTemp(); //re-evaluate temp
}

function setC() {
  fahrenheit = false;
  styleUnitSelector();
  reevaluateTemp();
}

fButton.addEventListener("click", setF);
cButton.addEventListener("click", setC);
