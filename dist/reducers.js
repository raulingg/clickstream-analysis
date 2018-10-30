"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _db = _interopRequireDefault(require("./db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pathFile = __dirname + '/data/events.json';

const pageVisitedResolver = async ({
  siteId,
  eventName,
  data = {}
}) => {
  const [rows, fields] = await _db.default.execute('SELECT * FROM events INNER JOIN sites on sites.id = events.site_id where sites.client_id = ? and events.name = ?', [siteId, eventName]);
  console.log(rows, fields);

  if (rows.length === 0) {
    await _db.default.execute('INSERT INTO events (name, count, site_id, data) VALUES (?, ?, ?, ?)', [eventName, 1, siteId, JSON.stringify(data)]);
  } else {
    await _db.default.execute('UPDATE events SET count = (count+1) WHERE name = ? AND site_id = ?', [eventName, siteId]);
  }
};