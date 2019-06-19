const ecc = require('../../index');

ecc.noLog(true);

ecc.strict();

ecc.register([{
  name: 'MONGO_URL',
  default: {
    development: 'DEFAULT',
  },
}]);
