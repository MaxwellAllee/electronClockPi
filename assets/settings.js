/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
const clickCount = document.getElementsByClassName('numChange');
const submit = document.getElementById('sub');
const zipNum = document.getElementsByClassName('zipNum');
const changeAmount = (e) => {
  const divToChange = e.target.getAttribute('data-number');
  const numDiv = document.getElementById(divToChange);
  const currVal = parseInt(numDiv.textContent, 10);
  let newVal = currVal + parseInt(e.target.value, 10);
  if (newVal < 0) {
    newVal = 9;
  } else if (newVal > 9) {
    newVal = 0;
  }
  numDiv.textContent = newVal;
};
Array.from(clickCount).forEach((button) => button.addEventListener('click', changeAmount));
const sumZip = async () => {
  const newZip = Array.from(zipNum).reduce((total, zipDigit) => total + zipDigit.textContent, '');
  // eslint-disable-next-line no-undef
  // console.log(newZip, await db.settings.get());
  console.log(primaryUser.id);
  db.settings.update(primaryUser.id, { zipCode: newZip, asked: true }).then((updated) => {
    if (updated) {
      console.log('updated');
      primaryUser.id = newZip;
      close();
    } else console.log('update failed');
  });
};
submit.addEventListener('click', sumZip);
