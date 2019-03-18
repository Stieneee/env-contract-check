# env-contract-check

Define and check contracts around environment variables.

The goal of this package is to make environment variables easy to check, default in development and enforce presence in production.
While it is recommended to set NODE_ENV this package supports behaviors around an undefined NODE_ENV variable.
This package attempts to balance convenience for development with predictable desirable behavior for deployment.

[![install size](https://packagephobia.now.sh/badge?p=env-contract-check)](https://packagephobia.now.sh/result?p=env-contract-check)

## Define Contract

```javascript
const ecc = require('env-contract-check');

// all boolean default false
// register accepts a single object or an array of objects
ecc.register([{
  name: 'MONGO_URL', // required
  optional: true,
  defaults: {
    development: 'mongo://localhost'
    docker: 'mongo://mongo',
    // production: 'mongo://mongo', // not recommend to set production default
  }  
  allowReregister: true // allow this contract to be redefined.
  log: true, // a console.log(name, value);
  hidden: true, // value of the env variable will not be printed to the console.
}]);
```

## Checking Environment

By default contracts first check to see if the environment variable has been set.
If the variable is missing the optional flag, defaults object and NODE_ENV are used to determine if the application should error.
It is best to set NODE_ENV but if missed this package defaults to 'development' or 'docker' if in a docker container.
Support for other process environments is a future goal.

### Strict NODE_ENV

A strict options requires NODE_ENV to be set forcing a process exit(1) if not set before requiring this package.

```javascript
ecc.strict()
```

## Setting the Environment

This package dose not provide a method of setting the environment with the exception of a default.
As hard-coding some environment variables is security issue, an additional environment loader is recommended for efficient loading of the processes environment.
There are many great methods for setting the process environment.
One recommendation is [dotenv](https://www.npmjs.com/package/dotenv) which is great for setting the process environment during development and dose not interfere with production process managers.
It is important to use any in process environment loader before requiring this package.

```javascript
// example using dotenv
require('dotenv').config()
// load env before ecc
const ecc = require('env-contract-check');
```

## Output

By default the only console output of this package is the state of NODE_ENV when being required.
There are two methods to produce console output for other environment variables.
The first is to set `ecc.register({log: true})` which will print the name and value to the console.
The second is a summary that can be invoked printing a table of all current registered variables.

```javascript
ecc.summary()
```

### Hidden

In most situations logging a secret is undesirable, marking a variable as hidden will prevent the value from being printed to the console.

### Stripe-Url-Auth

All output is passed through [stripe-url-auth](https://www.npmjs.com/package/strip-url-auth) to prevent credentials from printing to the console.

## Dependencies

Dependencies that require env variable can safely use this package as well.
Again it is important to load the env before loading the any dependencies that will require this package.

## Re-register

To prevent unintentional overwriting if a variable is registered twice the package will error.
This can be over written by setting the `allowReregister` property to true of any duplicate register calls.

## Contributing

Issues, recommendations, and pull requests are welcome.
