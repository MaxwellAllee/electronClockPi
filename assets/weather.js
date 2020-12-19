const apiRequest = require('./apiCall');

const weatherId = document.getElementById('weather');
const weatherGrid = document.querySelector('.additionalInfo');
const getLatLong = async (zipCode) => apiRequest(
  `https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${zipCode}`,
);
const getGlobalWeather = async (zipCode) => {
  const latLong = await getLatLong(zipCode);
  const [long, lat] = latLong.records[0].geometry.coordinates;
  return apiRequest(`https://api.weather.gov/points/${lat},${long}`);
};
const weatherIcon = (term, day) => {
  console.log(day);
  if (term.includes('clear') || term.includes('fair')) {
    return day ? 'sunny' : 'night';
  }
  if (term.includes('cloudy') || term.includes('clouds')) {
    return day ? 'partly' : 'partlyNight';
  }
  if (term.includes('overcast')) {
    return 'overcast';
  }
  if (term.includes('snow')) {
    return 'snowy';
  }
  if (term.includes('thunderstorm')) {
    return 'thunderStorm';
  }
  if (term.includes('rain')) {
    return 'rain';
  }
  return 'sunny';
};

const divCreator = (temp, forecastText, day) => {
  const svg = document.createElement('div');
  const iconName = weatherIcon(forecastText.toLowerCase(), day);
  svg.classList.add(iconName);
  svg.classList.add('svg');
  const tempText = document.createElement('div');
  tempText.textContent = `${temp}°F`;
  tempText.classList.add('temp');
  const weatherHolder = document.createElement('span');
  weatherHolder.appendChild(svg);
  weatherHolder.appendChild(tempText);
  return weatherHolder;
};
let dayCount;
let position;
const fiveDayLoop = (weatherArr) => {
  const currentGridBox = weatherGrid.children[dayCount];
  currentGridBox.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = weatherArr[position].name;
  currentGridBox.appendChild(title);
  const dayHolder = document.createElement('div');
  dayHolder.classList.add('dayHolder');
  if (weatherArr[position].isDaytime) {
    const {
      shortForecast, temperature, name, isDaytime,
    } = weatherArr[position];
    const newWeatherDiv = divCreator(temperature, shortForecast, name, isDaytime);
    newWeatherDiv.classList.add('fiveDay');
    dayHolder.appendChild(newWeatherDiv);
    position += 1;
  }
  const {
    shortForecast, temperature, isDaytime,
  } = weatherArr[position];
  const newWeatherDiv = divCreator(temperature, shortForecast, isDaytime);
  newWeatherDiv.classList.add('fiveDay');
  dayHolder.appendChild(newWeatherDiv);
  currentGridBox.appendChild(dayHolder);
  position += 1;
  dayCount += 1;
  if (dayCount < 5) {
    fiveDayLoop(weatherArr);
  }
};
module.exports = {
  async fiveDayWeather(globalWeather) {
    weatherGrid.addEventListener('click', this.reset);
    const forecast = await apiRequest(globalWeather.properties.forecast);
    const forecastArr = forecast.properties.periods;
    dayCount = 0;
    position = 0;
    console.log(forecastArr);
    fiveDayLoop(forecastArr);
  },
  async currentWeather(zipCode) {
    const globalWeather = await getGlobalWeather(zipCode);
    const hourly = await apiRequest(globalWeather.properties.forecastHourly);
    const currHour = hourly.properties.periods[0];
    const date = new Date(); // grab date to format to current time.
    const day = date.getHours() <= 18 && date.getHours() > 6;
    const currForecast = currHour.shortForecast;
    const hourlyTemp = currHour.temperature;
    const weatherDiv = divCreator(hourlyTemp, currForecast, day);
    weatherDiv.classList.add('weatherHolder');
    weatherDiv.addEventListener('click', () => {
      this.fiveDayWeather(globalWeather);
    });
    weatherId.appendChild(weatherDiv);
    // if(hourly.)
  },
  reset() {
    weatherGrid.removeEventListener('click', this.reset);
    for (let i = 0; i < weatherGrid.childElementCount; i += 1) {
      weatherGrid.children[i].innerHTML = '';
    }
    this.currentWeather(37801);
  },
};
