const assert = require('assert');
const http = require('http');
const app = require('../app');

const server = app.listen(0, '127.0.0.1', () => {
  const address = server.address();

  http.get(
    {
      hostname: '127.0.0.1',
      port: address.port,
      path: '/'
    },
    (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          assert.strictEqual(res.statusCode, 200);
          assert.strictEqual(body, 'Hello World!');
          console.log('PASS: GET / returned HTTP 200 and Hello World!');
          server.close(() => process.exit(0));
        } catch (error) {
          console.error(error);
          server.close(() => process.exit(1));
        }
      });
    }
  ).on('error', (error) => {
    console.error(error);
    server.close(() => process.exit(1));
  });
});
