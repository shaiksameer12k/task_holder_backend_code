const http = require("http");
const app = require("./index.js");

const server = http.createServer(app);
const PortNumber = process.env.PORT || 3000;

server.listen(`${PortNumber}`, () => {
  console.log(`User IS RUNNING ON THE PORT http://localhost:${PortNumber}`);
});
