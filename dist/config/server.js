"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const getServerConfig = () => ({
  port: process.env.PORT || 5000
});

var _default = getServerConfig;
exports.default = _default;