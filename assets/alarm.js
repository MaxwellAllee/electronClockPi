const alarmSound = new Audio(`file://${__dirname}/sound/zen.mp3`);
const cancelClick = (loop) => {
  clearInterval(loop);
  console.log('cancled');
};

module.exports = {
  async getAlarms(db) {
    // eslint-disable-next-line no-undef
    const today = moment().format('ddd');
    const tommorow = moment().add(1, 'days').format('ddd');
    // eslint-disable-next-line no-undef
    const currTime = moment().format('Hm');
    // eslint-disable-next-line max-len
    const nextAlarmCollection = await db.alarms.filter((alarm) => {
      if (alarm.time > currTime && alarm.once) return true;
      if (alarm.time > currTime && alarm[today]) return true;
      return false;
    });
    const nextAlarm = await nextAlarmCollection.sortBy('time');
    if (nextAlarm[0]) {
      console.log(today);
      console.log(nextAlarm[0]);
      return nextAlarm[0];
    }
    const tomorrowAlarmCollection = await db.alarms.filter((alarm) => {
      console.log(alarm);
      if (alarm.once || alarm[tommorow]) return true;
      return false;
    });
    const tomorrowAlarm = await tomorrowAlarmCollection.sortBy('time');
    if (tomorrowAlarm[0]) return tomorrowAlarm[0];
    console.log('no alarm');
    return null;
  },
  soundTheAlarm() {
    console.log('ring ring');
    const alarmLoop = setInterval(() => alarmSound.play(), 3000);
    document.addEventListener('click', () => cancelClick(alarmLoop));
  },
};
