/* eslint-disable quote-props */
/* eslint-disable import/no-unresolved */
const clock = document.getElementById('clock');
const Dexie = require('dexie');
const weather = require('./assets/weather.js');

const primaryUser = { id: '', new: true, asked: false };
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
db.version(3).stores({ settings: 'zipCode,another,asked' });

const button = document.getElementById('button');
const getTime = () => {
  const date = new Date(); // grab date to format to current time.
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return { hour, minutes };
};
console.log(window);
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
  weather.currentWeather(primaryUser.id, lowerContent);
};

const open = () => {
  const modal = document.getElementById('modal');
  modal.classList.remove('closed');
  modal.classList.add('open');
  modal.addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
      close();
    }
  });
};
const init = async () => {
  printTime();
  setInterval(() => printTime(), 1000);
  console.log(primaryUser.asked);
  if (!primaryUser.asked) {
    open();
  }
  if (primaryUser.zipCode !== '00000') {
    lowerContent();
  }
};
const close = () => {
  const modal = document.getElementById('modal');
  modal.classList.remove('open');
  modal.classList.add('closed');
  primaryUser.asked = true;
  init();
};
const dbSetup = async () => {
  console.log(await db.settings.count());
  if (await db.settings.count() === 0) {
    db.settings.put({ zipCode: '00000', another: 'test', asked: false }).then((newUser) => {
      primaryUser.id = newUser;
      primaryUser.new = true;
    });
  } else {
    const userList = await db.settings.toArray();
    console.log(userList);
    primaryUser.id = userList[0].zipCode;
    primaryUser.asked = userList[0].asked;
  }
  init();
};
dbSetup();
button.addEventListener('click', open);
