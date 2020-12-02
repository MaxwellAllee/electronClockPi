// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-unresolved
const apiRequest = require('./assets/apiCall');

// const getHourlyWeather = (url) => {
//   apiRequest(url, (res) => {
//     console.log(res);
//   });
// };
const getGlobalWeather = (lat, long) => {
  apiRequest(`https://api.weather.gov/points/${lat},${long}`, (res) => {
    console.log(res);
    // getCurrentWeather(res.properties.forecastHourly);
  });
};
const getLatLong = () => {
  const zipCode = 37801;
  const url = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${zipCode}`;
  apiRequest(url, (res) => {
    const latLongObj = res.records[0].fields;
    getGlobalWeather(latLongObj.latitude, latLongObj.longitude);
  });
};
getLatLong();
const clock = document.getElementById('clock');
const getTime = () => {
  const date = new Date(); // grab date to format to current time.
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return { hour, minutes };
};

const printTime = () => {
  const { hour, minutes } = getTime();
  const fixedHour = hour < 10 ? `0${hour}` : hour;
  const fixedMin = minutes < 10 ? `0${minutes}` : minutes;
  clock.textContent = `${fixedHour}:${fixedMin}`;
};
const init = () => {
  printTime();
  setInterval(() => printTime(), 1000);
};
init();
