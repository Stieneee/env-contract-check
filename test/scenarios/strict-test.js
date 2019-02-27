const ecc = require('../../index');

ecc.strict();

ecc.register({
  name: 'MONGO_URL',
  defaults: {
    development: 'DEFAULT',
  },
  echo: true,
});
