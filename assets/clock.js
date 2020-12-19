/* eslint-disable import/no-unresolved */
const clock = document.getElementById('clock');
const weather = require('./assets/weather.js');

// const invert = 0;
// const getHourlyWeather = (url) => {
//   apiRequest(url, (res) => {
//     console.log(res);
//   });
// };

const getTime = () => {
  const date = new Date(); // grab date to format to current time.
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return { hour, minutes };
};

const printTime = () => {
  // invert = invert ? 0 : 1;
  // back = invert ? 'white' : 'black';
  // document.getElementsByTagName('BODY')[0].style.filter = `invert(${invert})`;
  // document.getElementsByTagName('BODY')[0].style.background = back;
  const { hour, minutes } = getTime();
  const fixedHour = hour < 10 ? `0${hour}` : hour;
  const fixedMin = minutes < 10 ? `0${minutes}` : minutes;
  clock.textContent = `${fixedHour}:${fixedMin}`;
};
const init = async () => {
  printTime();
  setInterval(() => printTime(), 1000);
  weather.currentWeather(37801);
};
init();
