const ecc = require('../../index');

ecc.register({
  name: 'MONGO_URL',
  defaults: {
    development: 'DEFAULT',
  },
});

ecc.summary();
