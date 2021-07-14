const { enableFetchMocks } = require('jest-fetch-mock');
enableFetchMocks();

const b = require('bem-react-helper');

global.b = b;
