var fahrenheit = new Boolean(true);

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
  let cCurrentTemp = response.data.main.temp;
  let cFeelTemp = response.data.main.feels_like;
  let cMaxTemp = response.data.main.temp_max;
  let cMinTemp = response.data.main.temp_min;
  let rh = response.data.main.humidity;
  setTime();
  if (fahrenheit == false) {
    styleUnitSelector();
    document.querySelector("#current-temp").innerHTML =
      Math.round(cCurrentTemp);
    document.querySelector("#high-temp").innerHTML = Math.round(cMaxTemp);
    document.querySelector("#low-temp").innerHTML = Math.round(cMinTemp);
    document.querySelector("#feels-like").innerHTML = Math.round(cFeelTemp);
    document.querySelector("#rh").innerHTML = rh;
  } else {
    styleUnitSelector();
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
  }
}

function callWeatherApi(event) {
  event.preventDefault();
  //set header, based on user input
  let cityOutput = document.querySelector(".city");
  let cityInput = document.querySelector("#city-input");
  cityOutput.innerHTML = cityInput.value;
  //get temp from API
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${config.apiKey}&units=metric`;
  axios.get(apiUrl).then(handleApiData);
}

//This runs when user changes unit preference. It calls API again, as if they had entered a city into the form
function reevaluateTemp() {
  let cityInput = document.querySelector("#city-input");
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${config.apiKey}&units=metric`;
  axios.get(apiUrl).then(handleApiData);
}

let citySelection = document.querySelector("#city-search");
citySelection.addEventListener("submit", callWeatherApi);

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
