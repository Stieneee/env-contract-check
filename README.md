# env-contract-check

[![CircleCI](https://circleci.com/gh/Stieneee/env-contract-check.svg?style=svg)](https://circleci.com/gh/Stieneee/env-contract-check)
[![install size](https://packagephobia.now.sh/badge?p=env-contract-check)](https://packagephobia.now.sh/result?p=env-contract-check)

Define and check contracts around environment variables.

The goal of this package is to make environment variables easy to check, default in development and enforce presence in production.
The package was created around to address some pain points around environment variables.
While it is recommended to set NODE_ENV this package supports behaviors around an undefined NODE_ENV variable.
This package attempts to balance convenience for development with predictable desirable behavior for deployment.

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
  noLog: true, // a prevent console.log during contract evaluation
  hidden: true, // value of the env variable will not be printed to the console.
}]);
```

## Checking Environment

By default contracts first check to see if the environment variable has been set.
If the variable is missing the optional flag, defaults object, secret file locations and NODE_ENV are used to determine if the variable can be populated or if the application should error.
It is best to set NODE_ENV but if missed this package defaults to 'development' or 'docker' if in a docker container.
Support for other process environments is a future goal.

### Strict NODE_ENV

A strict options requires NODE_ENV to be set forcing a process exit(1) if not set before requiring this package.

```javascript
ecc.strict()
```

## Setting the Environment

Well this package provides several methods of setting the environment some methods are not secret safe.
As hard-coding some environment variables is a security issue, an additional environment loader is recommended for loading secrets into the processes environment.
There are many great methods for setting the process environment.
One recommendation is [dotenv](https://www.npmjs.com/package/dotenv) which is great for setting the process environment during development and dose not interfere with production process managers.
It is important to use any in process environment loader before requiring this package.

```javascript
// example using dotenv
require('dotenv').config()
// load env before ecc
const ecc = require('env-contract-check');
```

### Setting the Environment - Secret Files

Both Docker and Kubernetes provide a secret object with the ability to present these as a file inside a container.
By default this package will check if the file name of the contract name exsists in the /run/secrets directory and loads the content into that environment variable.
A customized file path can be set by setting the a environment variable of the name of the contract with '_FILE' appeneded.

#### Example 1 - Load from Default Location

```bash
echo -n "MY SECRET MONGO URL" > /var/run/MONGO_URL
node index.js
```

```javascript
// index.js
ecc.register({name: 'MONGO_URL'});
console.log(process.env.MONGO_URL);
// OUTPUT: MY SECRET MONGO URL
```

#### Example 2 - Load from Customer Location

```bash
echo -n "MY SECRET MONGO URL" > /etc/my-mongo-url
MONGO_URL_FILE=/etc/my-mongo-url node index.js
```

```javascript
// index.js
ecc.register({name: 'MONGO_URL'});
console.log(process.env.MONGO_URL);
// OUTPUT: MY SECRET MONGO URL
```

## Order of Operations

As soon as a environment variable is set the package stops attempting to load the variable from any other location and the contract is satisfied.
The order of operations is the following.

- Set before the contract is accessed
- Attempt load from default secret file location /run/secrets/{name}
- If set, Attempt load from custom secret file location
- If NODE_ENV is present in the defaults object of the contract
- If not optional, throw error

## Output

By default this package will print the status of each contract as they are evaluated.
To prevent a contract from printing its status `ecc.register({noLog: true})` or be to stop console by default set `ecc.noLog(true)`.
A summary of the current status of all contracts can be logged by

```javascript
ecc.summary()
```

### Hidden

In most situations logging a secret is undesirable, marking a variable as hidden will prevent the value from being printed to the console.

```javascript
// index.js
ecc.register({
  name: 'MONGO_URL'
  hidden: true
});
// OUTPUT: MONGO_URL varaible set to default {HIDDEN}
```

### Stripe-Url-Auth

All output is passed through [stripe-url-auth](https://www.npmjs.com/package/strip-url-auth) to prevent some credentials from printing to the console.

## Dependencies

Dependencies that require env variable can safely use this package as well.
Again it is important to load the env before loading the any dependencies that will require this package.

## Re-register

To prevent unintentional overwriting if a variable is registered twice the package will error.
This can be over written by setting the `allowReregister` property to true of any duplicate register calls.
Please consider the order of operations when reregsitering.

## Contributing

Issues, recommendations, requests and pull requests are welcome.
