"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();

const pathFile = _path.default.join(__dirname, '../public');

app.use(_express.default.static(pathFile));
app.set('port', 3000);
app.get('/', (req, res) => res.sendFile(pathFile + '/index.html'));
app.get('/about', (req, res) => res.sendFile(pathFile + '/about.html'));
app.get('/charge', (req, res) => res.sendFile(pathFile + '/charge.html'));
app.get('/contact', (req, res) => res.sendFile(pathFile + '/contact.html'));
app.listen(app.get('port'), () => console.log('Express server listening on http://localhost:' + app.get('port')));