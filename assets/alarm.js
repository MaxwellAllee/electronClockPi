const cancelClick = () => {
  console.log('cancled');
};

module.exports = {
  async getAlarms(db) {
    // eslint-disable-next-line no-undef
    const currTime = moment().format('Hm');
    const nextAlarm = await db.alarms.where('time').above(currTime).first();
    if (nextAlarm) return nextAlarm.time;
    return null;
  },
  soundTheAlarm() {
    console.log('ring ring');
    document.addEventListener('click', cancelClick);
  },
};
