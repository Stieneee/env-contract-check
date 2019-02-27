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
      p.stdout.on('data', data => debug(data.toString()));
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
      p.stdout.on('data', data => debug(data.toString()));
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
      p.stdout.on('data', data => debug(data.toString()));
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
      p.stdout.on('data', data => debug(data.toString()));
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
      p.stdout.on('data', data => debug(data.toString()));
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
      p.stdout.on('data', data => debug(data.toString()));
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
      p.stdout.on('data', data => debug(data.toString()));
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
      p.stdout.on('data', data => debug(data.toString()));
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
