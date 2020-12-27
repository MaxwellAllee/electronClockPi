/* eslint-disable quote-props */
/* eslint-disable import/no-unresolved */
const clock = document.getElementById('clock');
const Dexie = require('dexie');
const weather = require('./assets/weather.js');
// const invert = 0;
// const getHourlyWeather = (url) => {
//   apiRequest(url, (res) => {
//     console.log(res);
//   });
// };
// Force debug mode to get async stacks from exceptions.
Dexie.debug = true; // In production, set to false to increase performance a little.

//
// Declare Database
//
const db = new Dexie('userSettings');
db.version(1).stores({ 'settings': 'zipCode' });

//
// Have Fun
//
db.transaction('rw', db.userSettings, function* () {
  // Make sure we have something in DB:
  if ((yield db.friends.where('zipCode').equals('').count()) === 0) {
    const id = yield db.friends.add({ 'zipCode': 37801 });
    alert(`Added zip ${id}`);
  }

  // Query:
  const youngFriends = yield db.friends.where('zipCode').toArray();

  // Show result:
  alert(`My young friends: ${JSON.stringify(youngFriends)}`);
}).catch((e) => {
  console.error(e.stack);
});
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
const lowerContent = () => {
  const additionalInfo = document.querySelector('.additionalInfo');
  const newAdditionalInfo = additionalInfo.cloneNode(true);
  for (let i = 0; i < newAdditionalInfo.childElementCount; i += 1) {
    newAdditionalInfo.children[i].innerHTML = '';
  }
  additionalInfo.parentNode.replaceChild(newAdditionalInfo, additionalInfo);
  weather.currentWeather(37801, lowerContent);
};
const init = async () => {
  printTime();
  setInterval(() => printTime(), 1000);
  lowerContent();
};
init();
