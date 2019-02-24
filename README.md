# env-contract-check

Define behaviour contracts around environment varaibles.

The goal of this package is to make environment variables easy to check and enforce certain behaviours depending on the current environment (NODE_ENV).
While it is recommened to set NODE_ENV this package supports behaviours around an undefined NODE_ENV varaible.
This package attempts to balance convience for development with predictable desirable behaviour for deployment.

## Define Contract

```javascript
const ecc = require('env-contract-check);

ecc.register({
  name: 'MONGO_URL', // required
  
  default: 'mongo://localhost', // optional default. will fail in if name is not set with no defualt.
  // If default is set. The options below add adiitonal fail options
  failNonDev: true, // Fail if not set in anything other then development
  failProd: true, // Fail if not set in production. You probably don't want to set this.
  
  allowOverwrite: true // Set if setting the contract terms again to prevent failure
  hideValue: true, // if set the value of the env variable will not be printed to the console.
  echo: true // Print the status of varaible when registered
})
```

## Checking Environment

By default contracts are held against the NODE_ENV env varaible.
It is best to set NODE_ENV but if missed this package by default to either development or non development if in a docker container.
Support for other process environments is a future goal.

### Strict NODE_ENV

A strict options forces applys to NODE_ENV forcing a process exit(1) if not set externally.

```javascript
ecc.strict()
```

## Setting the Environemnt

This package dose not provide a metheod of setting the environment with the excpetion of a defualt.
There are many great metheods for setting the process environment.
One recommendation is dotenv which is great for setting the process during development and dose not interfere with production process managers.
It is important to use any env loaders before requiring this package.

```javascript
// example
require('dotenv').config()
// load env before ecc
const ecc = require('env-contract-check);
```

## Output

After registering a number of varaibles a summary can be printed.

```javascript
ecc.summary()
```

## Failling a Contract

A failed contract will throw and error. 
The asumption is it is desired that the application fail when the env contract is not satisfied.

## Contract Output

Minimal default console logging is enabled by default.
Additional information can be enabled.

## Subpackages

Dependancies that require env variable can safely use this package as well.
Again it is important to load the env before loading the any dependancies that will require this package.

## Double Register

To prevent unintentional overwriting if a varaible is registered twice the package will error.
This can be over writted by setting the `allowOverwrite` property to true of any duplicate register calls.

## TODO

[] Basic Contract Behaviour
[] Default property
[] Strict mode
[] Identify execution location to determine unset NODE_ENV
[]   Docker
[]   EC2 
[]   .... Many More
[]
 
## Contributing

Issues, recommendations, and pull requests are welcome.