const alarmSound = new Audio(`file://${__dirname}/sound/zen.mp3`);
const cancelClick = (loop) => {
  clearInterval(loop);
  console.log('cancled');
};

module.exports = {
  async getAlarms(db) {
    // eslint-disable-next-line no-undef
    const currTime = moment().format('Hm');
    const nextAlarm = await db.alarms.where('time').above(currTime).first();
    console.log(nextAlarm);
    if (nextAlarm) return nextAlarm.time;
    return null;
  },
  soundTheAlarm() {
    console.log('ring ring');
    const alarmLoop = setInterval(
      () => alarmSound.play(), 3000,
    );
    document.addEventListener('click', () => cancelClick(alarmLoop));
  },
};
