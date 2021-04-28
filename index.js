const fs = require('fs');
const debug = require('debug')('ENV-CONTRACT-CHECK');
const table = require('markdown-table')
const dot = require('dot-prop');
const isDocker = require('is-docker');
const stripUrlAuth = require('strip-url-auth');

const contract = {};
let NODE_ENV_SET_BY_ECC = false;
let noLog = false;

// Get the env variable and strip auth keys
function envStrip(name) {
  return stripUrlAuth(dot.get(process.env, name) || '');
}

// Check
function envCheck() {
  if (!process.env.NODE_ENV) {
    debug('NODE_ENV is not set');
    NODE_ENV_SET_BY_ECC = true;

    if (isDocker()) process.env.NODE_ENV = 'docker';
    else process.env.NODE_ENV = 'development';

    console.log('NODE_ENV HAS NOT BEEN SET DEFAULTING TO', process.env.NODE_ENV);
    return process.env.NODE_ENV;
  }
  console.log('NODE_ENV env-contract-check', process.env.NODE_ENV);
  return process.env.NODE_ENV;
}

const env = envCheck();

module.exports.register = function register(terms) {
  if (env !== process.env.NODE_ENV) {
    throw new Error('NODE_ENV has been changed by the process. env-contract-check does not allow this after it has been required.');
  }

  function registerHandle(term) {
    if (typeof term !== 'object') throw new Error('not an object');
    if (!term.name) throw new Error('missing variable name of environment variable');
    if (term.default) {
      console.warn('env-contract-check assuming default is defaults');
      term.defaults = term.default; // eslint-disable-line
    }
    if (!term.defaults) {
      debug('no term defaults object');
      term.defaults = {}; //eslint-disable-line
    }

    if (contract[term.name] && term.allowReregister) throw new Error('env variable already registered');

    contract[term.name] = term;

    // if not set. Attempt to set.
    if (!dot.has(process.env, term.name)) {
      debug(`${term.name} not set`);

      // Check and load from /run/secrets/${name} - default docker secrets location
      if (fs.existsSync(`/run/secrets/${term.name}`)) {
        dot.set(process.env, term.name, fs.readFileSync(`/run/secrets/${term.name}`).toString());
        if (!term.noLog && !noLog) console.log(`${term.name} variable set to by file /run/secrets/${term.name} ${term.hidden ? '{HIDDEN}' : envStrip(term.name)} `);
        return;
      }

      // if process.env.${name}_FILE then check and load from process.env.${name}_FILE - customizable and kube friendly :)
      if (process.env[`${term.name}_FILE`] && fs.existsSync(process.env[`${term.name}_FILE`])) {
        dot.set(process.env, term.name, fs.readFileSync(process.env[`${term.name}_FILE`]).toString());
        if (!term.noLog && !noLog) console.log(`${term.name} variable set to by file ${process.env[`${term.name}_FILE`]} ${term.hidden ? '{HIDDEN}' : envStrip(term.name)} `);
        return;
      }

      // Set Default
      if (term.defaults[env]) {
        debug(`${term.name} default available`);
        dot.set(process.env, term.name, term.defaults[env]);
        if (!term.noLog && !noLog) console.log(`${term.name} variable set to default ${term.hidden ? '{HIDDEN}' : envStrip(term.name)} `);
        return;
      }

      // If not optional and no default
      if (term.optional !== true && term.optional[env] !== true) throw new Error(`${term.name} required! No default for NODE_ENV ${env}. Contract Failed!`);

      debug(`${term.name} optional no default`);

      if (!term.noLog && !noLog) console.log(`${term.name} variable optional, no default, not set`);
    } else if (!term.noLog && !noLog) {
      console.log(`${term.name} variable set externally ${term.hidden ? '{HIDDEN}' : envStrip(term.name)} `);
    }
  }

  if (Array.isArray(terms)) {
    debug('register array of environment variables');
    terms.forEach((term) => registerHandle(term));
  } else {
    debug('register single environment variable');
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

module.exports.summary = function summary() {
  const data = Object.keys(contract).map((key) => {
    const c = contract[key];
    let optional = ''

    if (c.optional === true) optional = 'Y';
    else if (typeof c.optional === 'object') {
      for (const i in c.optional) {
        if (Object.hasOwnProperty.call(c.optional, i)) {
          if (c.optional[i] === true) optional = `${optional}${i} `
        }
      }
    } 
    const value = c.hidden ? '{HIDDEN}' : envStrip(c.name);
    return [key, optional, value];
  });
  data.unshift(['Variable', 'Optional', 'Value']);
  // data.unshift(['ENV-CONTRACT-CHECK']);
  console.log(`\nENV-CONTRACT-CHECK\n${table(data)}\n`);
};

module.exports.noLog = function setNoLog(x) {
  noLog = x;
};
