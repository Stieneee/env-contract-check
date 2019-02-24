const ecc = require('../../index');

console.log(process.env.MONOG_URL);

ecc.register({
  name: 'MONGO_URL',
  failNonDev: true,
  echo: true,
});

process.exit(10);
