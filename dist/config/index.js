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
Object.defineProperty(exports, "getEventsConfig", {
  enumerable: true,
  get: function () {
    return _events.default;
  }
});

var _database = _interopRequireDefault(require("./database"));

var _server = _interopRequireDefault(require("./server"));

var _events = _interopRequireDefault(require("./events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }