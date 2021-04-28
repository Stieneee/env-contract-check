const ecc = require('../../index');

ecc.register({
  name: 'MONGO_URL',
  optional: {
    development: true,
    production: false
  },
});

ecc.summary();