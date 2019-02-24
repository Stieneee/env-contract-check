const ecc = require('../../index');

console.log(process.env.MONOG_URL);

ecc.register({
  name: 'MONGO_URL',
  default: 'something',
  failNonDev: true,
  echo: true,
});

process.exit(10);
