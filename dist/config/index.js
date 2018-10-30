"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getDatabaseConfig", {
  enumerable: true,
  get: function () {
    return _database.default;
  }
});
Object.defineProperty(exports, "getServerConfig", {
  enumerable: true,
  get: function () {
    return _server.default;
  }
});

var _database = _interopRequireDefault(require("./database"));

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }