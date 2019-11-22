const fs = require('fs');
const debug = require('debug')('TEST');
const { spawn } = require('child_process');

describe('Test Scenarios', () => {
  describe('base case', () => {
    it('varaible set - exit cleanly', (done) => {
      const p = spawn('node', ['./test/scenarios/base-case.js'], {
        stdio: 'pipe',
        env: {
          NODE_ENV: 'development',
          MONGO_URL: 'EXTERNAL',
        },
      });
      p.stdout.on('data', (data) => debug(data.toString()));
      p.on('exit', (code) => {
        if (code === 0) {
          done();
        } else {
          throw new Error(`test failed ${code}`);
        }
      });
    });

    it('NODE_ENV not set - exit cleanly', (done) => {
      const p = spawn('node', ['./test/scenarios/base-case.js'], {
        stdio: 'pipe',
        env: {
          // NODE_ENV: 'development',
          MONGO_URL: 'EXTERNAL',
        },
      });
      p.stdout.on('data', (data) => debug(data.toString()));
      p.on('exit', (code) => {
        if (code === 0) {
          done();
        } else {
          throw new Error(`test failed ${code}`);
        }
      });
    });

    it('should error if missing the env varaible', (done) => {
      const p = spawn('node', ['./test/scenarios/base-case.js'], {
        stdio: 'pipe',
        env: {
          NODE_ENV: 'development',
          // MONGO_URL: 'EXTERNAL',
        },
      });
      p.stdout.on('data', (data) => debug(data.toString()));
      p.on('exit', (code) => {
        if (code !== 0) {
          done();
        } else {
          throw new Error(`test failed ${code}`);
        }
      });
    });
  });

  describe('base case with default', () => {
    it('should pass even thought env varaible is not set', (done) => {
      const p = spawn('node', ['./test/scenarios/base-case-default.js'], {
        stdio: 'pipe',
        env: {
          NODE_ENV: 'development',
          // MONGO_URL: 'EXTERNAL',
        },
      });
      p.stdout.on('data', (data) => debug(data.toString()));
      p.on('exit', (code) => {
        if (code === 0) {
          done();
        } else {
          throw new Error(`test failed ${code}`);
        }
      });
    });

    it('should error becasue of missing env in production', (done) => {
      const p = spawn('node', ['./test/scenarios/base-case-default.js'], {
        stdio: 'pipe',
        env: {
          NODE_ENV: 'production',
          // MONGO_URL: 'EXTERNAL',
        },
      });
      p.stdout.on('data', (data) => debug(data.toString()));
      p.on('exit', (code) => {
        if (code !== 0) {
          done();
        } else {
          throw new Error(`test failed ${code}`);
        }
      });
    });
  });

  describe('base case optional true', () => {
    it('should not error if missing the env varaible', (done) => {
      const p = spawn('node', ['./test/scenarios/base-case-optional.js'], {
        stdio: 'pipe',
        env: {
          NODE_ENV: 'development',
          // MONGO_URL: 'EXTERNAL',
        },
      });
      p.stdout.on('data', (data) => debug(data.toString()));
      p.on('exit', (code) => {
        if (code === 0) {
          done();
        } else {
          throw new Error(`test failed ${code}`);
        }
      });
    });
  });

  describe('test strict', () => {
    it('should pass beacuse NODE_ENV is set', (done) => {
      const p = spawn('node', ['./test/scenarios/strict-test.js'], {
        stdio: 'pipe',
        env: {
          NODE_ENV: 'development',
          // MONGO_URL: 'EXTERNAL',
        },
      });
      p.stdout.on('data', (data) => debug(data.toString()));
      p.on('exit', (code) => {
        if (code === 0) {
          done();
        } else {
          throw new Error(`test failed ${code}`);
        }
      });
    });

    it('should fail beacuse NODE_ENV is not set', (done) => {
      const p = spawn('node', ['./test/scenarios/strict-test.js'], {
        stdio: 'pipe',
        env: {
          // NODE_ENV: 'development',
          // MONGO_URL: 'EXTERNAL',
        },
      });
      p.stdout.on('data', (data) => debug(data.toString()));
      p.on('exit', (code) => {
        if (code !== 0) {
          done();
        } else {
          throw new Error(`test failed ${code}`);
        }
      });
    });
  });

  describe('test secret file loading', () => {
    it('should exit status code zero with file present', (done) => {
      try {
        fs.mkdirSync('/run/secrets');
      } catch (err) {
        console.log(err.message);
      }
      fs.writeFileSync('/run/secrets/TEST_SECRET', 'MY_TEST_SECRET');
      const p = spawn('node', ['./test/scenarios/base-case-secret-file.js'], {
        stdio: 'pipe',
        env: {
          NODE_ENV: 'development',
        },
      });
      p.stdout.on('data', (data) => debug(data.toString()));
      p.on('exit', (code) => {
        fs.unlinkSync('/run/secrets/TEST_SECRET');
        if (code === 0) {
          done();
        } else {
          throw new Error(`test failed ${code}`);
        }
      });
    });
    it('should error file missing', (done) => {
      const p = spawn('node', ['./test/scenarios/base-case-secret-file.js'], {
        stdio: 'pipe',
        env: {
          NODE_ENV: 'development',
        },
      });
      p.stdout.on('data', (data) => debug(data.toString()));
      p.on('exit', (code) => {
        if (code !== 0) {
          done();
        } else {
          throw new Error(`test failed ${code}`);
        }
      });
    });
  });

  describe('test secret file loading', () => {
    it('should exit status code zero with file present', (done) => {
      fs.writeFileSync('/tmp/testfile', 'MY_TEST_SECRET');
      const p = spawn('node', ['./test/scenarios/base-case-secret-file.js'], {
        stdio: 'pipe',
        env: {
          NODE_ENV: 'development',
          TEST_SECRET_FILE: '/tmp/testfile',
        },
      });
      p.stdout.on('data', (data) => debug(data.toString()));
      p.on('exit', (code) => {
        fs.unlinkSync('/tmp/testfile');
        if (code === 0) {
          done();
        } else {
          throw new Error(`test failed ${code}`);
        }
      });
    });
    it('should error file missing', (done) => {
      const p = spawn('node', ['./test/scenarios/base-case-secret-file.js'], {
        stdio: 'pipe',
        env: {
          NODE_ENV: 'development',
          TEST_SECRET_FILE: '/tmp/testfile',
        },
      });
      p.stdout.on('data', (data) => debug(data.toString()));
      p.on('exit', (code) => {
        if (code !== 0) {
          done();
        } else {
          throw new Error(`test failed ${code}`);
        }
      });
    });
  });
});
