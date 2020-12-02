// eslint-disable-next-line import/no-extraneous-dependencies
const electron = require('electron');
// Importing the net Module from electron remote
const { net } = electron.remote;
// eslint-disable-next-line import/prefer-default-export
const apiRequest = (url, cb) => {
  const request = net.request(url);
  return request.on('response', (response) => {
    const status = response.statusCode;
    if (status === 200) {
      response.on('data', (chunk) => {
        cb(JSON.parse(chunk));
      });
    } else {
      cb({ error: 'bad request' });
    }
  }).end();
};
module.exports = apiRequest;
