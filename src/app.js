//This JS sets current time, handles form input, API call, and weather data output.

//set default units
var fahrenheit = new Boolean(true);
var city = "Berlin";

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

//Take data from API and use to change innerHTML- also rounds data, checks if C or F chosen by user- F is default.
function handleApiData(response) {
  //store temp data
  let cCurrentTemp = response.data.main.temp;
  let cFeelTemp = response.data.main.feels_like;
  let cMaxTemp = response.data.main.temp_max;
  let cMinTemp = response.data.main.temp_min;
  let rh = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;
  //set city, description, time
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  let cityHeader = document.querySelector(".city");
  cityHeader.innerHTML = city;
  setTime();
  //output data based on unit selection
  if (fahrenheit == false) {
    styleUnitSelector();
    let icon = document.querySelector("#current-icon");
    icon.setAttribute("src", `img/${response.data.weather[0].icon}.svg`);
    icon.setAttribute("alt", response.data.weather[0].description);
    document.querySelector("#current-temp").innerHTML =
      Math.round(cCurrentTemp);
    document.querySelector("#high-temp").innerHTML = Math.round(cMaxTemp);
    document.querySelector("#low-temp").innerHTML = Math.round(cMinTemp);
    document.querySelector("#feels-like").innerHTML = Math.round(cFeelTemp);
    document.querySelector("#rh").innerHTML = rh;
    document.querySelector("#wind-speed").innerHTML = `${Math.round(
      windSpeed * 3.6
    )} km/h`;
  } else {
    styleUnitSelector();
    let icon = document.querySelector("#current-icon");
    icon.setAttribute("src", `img/${response.data.weather[0].icon}.svg`);
    icon.setAttribute("alt", response.data.weather[0].description);
    document.querySelector("#current-temp").innerHTML = Math.round(
      cCurrentTemp * 1.8 + 32
    );
    document.querySelector("#high-temp").innerHTML = Math.round(
      cMaxTemp * 1.8 + 32
    );
    document.querySelector("#low-temp").innerHTML = Math.round(
      cMinTemp * 1.8 + 32
    );
    document.querySelector("#feels-like").innerHTML = Math.round(
      cFeelTemp * 1.8 + 32
    );
    document.querySelector("#rh").innerHTML = rh;
    document.querySelector("#wind-speed").innerHTML = `${Math.round(
      windSpeed * 2.237
    )} mph`;
  }
}

//Runs after user inputs a city, and upon page load
function callWeatherApi() {
  //get temp from API
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.apiKey}&units=metric`;
  axios.get(apiUrl).then(handleApiData);
}

callWeatherApi();

//This runs when user changes unit preference. It calls API again, as if they had entered a city into the form
function reevaluateTemp() {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.apiKey}&units=metric`;
  axios.get(apiUrl).then(handleApiData);
}

//store user input, call API function, and reset inputbox
function setCityVar(event) {
  event.preventDefault();
  let userInput = document.querySelector("#city-input").value;
  city = userInput;
  document.getElementById("city-search").reset();
  callWeatherApi();
}

//Event listener for user input
let citySelection = document.querySelector("#city-search");
citySelection.addEventListener("submit", setCityVar);

//Sets unit
let fButton = document.querySelector("#f");
let cButton = document.querySelector("#c");

function setF() {
  fahrenheit = true;
  reevaluateTemp();
}

function setC() {
  fahrenheit = false;
  reevaluateTemp();
}

fButton.addEventListener("click", setF);
cButton.addEventListener("click", setC);
