"use strict";

var _config = require("./config");

var _database = _interopRequireDefault(require("./database"));

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Catch unhandling unexpected exceptions
process.on('uncaughtException', error => {
  console.error(`uncaughtException ${error.message}`);
}); // Catch unhandling rejected promises

process.on('unhandledRejection', reason => {
  console.error(`unhandledRejection ${reason}`);
});
const dbConfig = (0, _config.getDatabaseConfig)();

const db = _database.default.init(dbConfig);

const serverConfig = (0, _config.getServerConfig)();

const appServer = _server.default.init(serverConfig, db);

appServer.listen(serverConfig.port, () => {
  console.log(`Server running at http://localhost:${serverConfig.port}`);
});