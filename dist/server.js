"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _http = require("http");

var _socket = _interopRequireDefault(require("socket.io"));

var _BaseRepository = _interopRequireDefault(require("./data/BaseRepository"));

var _eventsResolver = _interopRequireDefault(require("./eventsResolver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  init: (configs, database) => {
    const httpServer = (0, _http.createServer)();
    const socketServer = (0, _socket.default)(httpServer); // authorization middleware

    socketServer.use(async (socket, next) => {
      console.log('Run authorization middleware');
      const {
        _query: {
          token: clientId
        },
        headers: {
          host
        }
      } = socket.request;
      const domain = host.split(':').shift();

      if (!clientId) {
        console.log('Client Id not supplied');
        next(new Error('Client Id not supplied'));
      }

      let site;

      try {
        const conn = await database.getConnection();

        const repository = _BaseRepository.default.getInstance().setConnection(conn);

        const results = await repository.findByField('sites', 'client_id', clientId);
        const release = await conn.release();
        site = results[0];
      } catch (error) {
        console.log(error);
        next(new Error(`Site with client id: ${clientId} not exists`));
      }

      if (site.domain !== domain) {
        next(new Error('Forbidden'));
      }

      next();
    });
    socketServer.on('connection', socket => {
      socket.on('message', async message => {
        console.log('Socket received message with:', message);
        const {
          token: clientId
        } = socket.request._query;

        try {
          await (0, _eventsResolver.default)(database, { ...message,
            clientId
          });
        } catch (error) {
          console.log(error);
          throw error;
        }
      });
      socket.on('disconnect', socket => {
        console.log('socket  disconnected');
        socketServer.emit('pageview', {});
      });
    });
    return httpServer;
  }
};
exports.default = _default;