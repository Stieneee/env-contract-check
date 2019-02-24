const dot = require('dot-prop');
const isDocker = require('is-docker');

const contract = {};
let NODE_ENV_SET_BY_ECC = false

const env = (function() {
  if (!process.env.NODE_ENV) {
    NODE_ENV_SET_BY_ECC = true;

    let result;

    if (isDocker()) result = 'docker';
    // PM2 other not managers
    // if is EC2 ETC
    // if is appveryor travis etc
    else result = 'development'

    console.warn(`NODE_ENV HAS NOT BEEN SET DEFAULTING TO ${result}`);
    process.env.NODE_ENV = result;
    return result    
  } else {
    console.log('NODE_ENV set externally', process.env.NODE_ENV);
  }
}) ();

module.exports.register = function (terms) {

  function registerHandle(term) {
    if (typeof term !== 'object') throw new Error('not an object');
    if (!term.name) throw new Error('missing variable name of environemnt variable');

    if (contract[term.name] && term.allowOverwrtie ) throw new Error('env varaible already registered')

    console.log(dot.has(process.env, term.name));
    if (!dot.has(process.env, term.name)) {
      if (!dot.has(process.env, term.name) && term.default === undefined) throw new Error(`${term.name} not set and no default. Contract Failed!`)
      if (!dot.has(process.env, term.name) && process.env.NODE_ENV !== 'development' && term.failNonDev) throw new Error(`${term.name} not set and NODE_ENV is not development. Contract Failed!`)
      if (!dot.has(process.env, term.name) && process.env.NODE_ENV === 'production' && term.failProd) throw new Error(`${term.name} not set is production. Contract Failed!`)

      dot.set(process.env, term.name, term.default);
      if (term.echo) console.warn(`${term.name} ENV varaible set to default ${term.hideValue ? '{HIDDEN}' : dot.get(process.env, term.name) } `)
    } else {
      if (term.echo) console.log(`${term.name} ENV varaible set externally ${term.hideValue ? '{HIDDEN}' : dot.get(process.env, term.name) } `)
    }
  };

  if (typeof terms === "object") {
    registerHandle(terms)
  } else if (typeof terms === "array") {
    for (const term of terms) {
      registerHandle(term);
    }
  }
};

module.exports.strict = function() {
  if (NODE_ENV_SET_BY_ECC) {
    console.error('NODE_ENV was not set. Failing due to env-contract-check strict().')
    process.exit(1);
  }
};

module.exports.summary = function() {

}