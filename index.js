const debug = require('debug')('ENV-CONTRACT-CHECK');
const table = require('markdown-table');
const dot = require('dot-prop');
const isDocker = require('is-docker');

const contract = {};
let NODE_ENV_SET_BY_ECC = false;

// Check
const env = (function env() {
  if (!process.env.NODE_ENV) {
    debug('NODE_ENV is not set');
    NODE_ENV_SET_BY_ECC = true;

    if (isDocker()) process.env.NODE_ENV = 'docker';
    else process.env.NODE_ENV = 'development';

    console.log('NODE_ENV HAS NOT BEEN SET DEFAULTING TO', process.env.NODE_ENV);
    return process.env.NODE_ENV;
  }
  console.log('NODE_ENV', process.env.NODE_ENV);
  return process.env.NODE_ENV;
}());

module.exports.register = function register(terms) {
  if (env !== process.env.NODE_ENV) {
    throw new Error('NODE_ENV has been changed by the process. env-contract-check does not allow this after it has been required.');
  }

  function registerHandle(term) {
    if (typeof term !== 'object') throw new Error('not an object');
    if (!term.name) throw new Error('missing variable name of environemnt variable');
    if (!term.defaults) {
      debug('no term defaults object');
      term.defaults = {}; //eslint-disable-line
    }

    if (contract[term.name] && term.allowReregister) throw new Error('env varaible already registered');

    contract[term.name] = term;

    // If not set
    if (!dot.has(process.env, term.name)) {
      debug(`${term.name} not set`);

      // If not optional and no default
      if (!term.optional && term.defaults[env] === undefined) throw new Error(`${term.name} required no default for NODE_ENV ${env}. Contract Failed!`);

      // Set Default
      if (term.defaults[env]) {
        debug(`${term.name} default avaliable`);
        dot.set(process.env, term.name, term.defaults[env]);
        if (term.log) console.log(`${term.name} ENV varaible set to default ${term.hidden ? '{HIDDEN}' : dot.get(process.env, term.name)} `);
        return;
      }

      // Optional
      if (term.log) {
        debug(`${term.name} optional no default`);
        console.log(`${term.name} ENV varaible optional with not default not set`);
      }
    } else if (term.log) {
      debug(`${term.name} set`);
      console.log(`${term.name} ENV varaible set externally ${term.hidden ? '{HIDDEN}' : dot.get(process.env, term.name)} `);
    }
  }

  if (Array.isArray(terms)) {
    debug('register array of environment varaibles');
    terms.forEach(term => registerHandle(term));
  } else {
    debug('register single environment varaible');
    registerHandle(terms);
  }
};

// Called after env is set
module.exports.strict = function strict() {
  if (NODE_ENV_SET_BY_ECC) {
    console.error('NODE_ENV was not set. Failing due to env-contract-check strict().');
    process.exit(1);
  }
};

module.exports.summary = function sumamry() {
  const data = Object.keys(contract).map((key) => {
    const c = contract[key];
    const optional = c.optional ? 'Y' : ' ';
    const value = c.hidden ? '{HIDDEN}' : dot.get(process.env, c.name);
    return [key, optional, value];
  });
  data.unshift(['Varaible', 'Optional', 'Value']);
  // data.unshift(['ENV-CONTRACT-CHECK']);
  console.log(`\nENV-CONTRACT-CHECK\n${table(data)}\n`);
};
