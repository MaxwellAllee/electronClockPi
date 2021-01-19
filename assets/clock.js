/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable quote-props */
/* eslint-disable import/no-unresolved */
const clock = document.getElementById('clock');
const Dexie = require('dexie');
const weather = require('./assets/weather.js');
const alarm = require('./assets/alarm.js');

const primaryUser = {
  id: '', new: true, asked: false,
};

// Force debug mode to get async stacks from exceptions.
Dexie.debug = true; // In production, set to false to increase performance a little.

//
// Declare Database
//
const db = new Dexie('userSettings');
db.version(5).stores({
  settings: 'zipCode,another,asked',
  alarms: 'time,Mon,Tue,Wed,Thu,Fri,Sat,Sun,once',
});
// db.alarms.put({
//   time: '1230', Mon: true, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false, once: false,
// });
const button = document.getElementById('button');
const closeButton = document.getElementById('closeButton');

const alarmSound = async () => {
  const silenced = alarm.soundTheAlarm();
  if (silenced) {
    console.log('alarm silenced');
  }
};
const printTime = async () => {
  clock.textContent = moment().format('HH:mm');
  if (primaryUser.alarm && primaryUser.alarm === moment().format('Hm') && !primaryUser.ringing) {
    primaryUser.ringing = true;
    alarmSound();
  }
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
  // eslint-disable-next-line no-undef
  setInit();
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
const getAlarm = async () => {
  const nextAlarm = await alarm.getAlarms(db);
  console.log(nextAlarm);
  if (nextAlarm) primaryUser.alarm = nextAlarm;
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
    primaryUser.zipCode = userList[0].zipCode;
    primaryUser.asked = userList[0].asked;
    getAlarm();
  }
  init();
};
dbSetup();
closeButton.addEventListener('click', close);
button.addEventListener('click', open);
