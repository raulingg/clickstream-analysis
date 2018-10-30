"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sqlstring = require("sqlstring");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BaseRepository {
  constructor() {
    _defineProperty(this, "setConnection", connection => {
      this.connection = connection;
      return this;
    });

    _defineProperty(this, "getConnection", () => {
      if (!this.connection) {
        throw new Error('Connection to database is undefined');
      }

      return this.connection;
    });

    _defineProperty(this, "create", async (table, fields, values) => {
      const queryFields = fields.join(', ');
      const queryValues = values.map(() => '?').join(', ');
      const query = (0, _sqlstring.format)(`INSERT INTO ${table} (${queryFields}) VALUES (${queryValues})`, values);

      try {
        11;
        const conn = this.getConnection();
        const [result] = await conn.query(query);
        return result.insertId;
      } catch (error) {
        throw error;
      }
    });

    _defineProperty(this, "update", async (table, whereValue, fields, values) => {
      const queryFields = fields.join('= ?, ');
      const query = (0, _sqlstring.format)(`UPDATE ${table} SET ${queryFields} = ? where id = ?`, [...values, whereValue]);

      try {
        11;
        const conn = this.getConnection();
        const [result] = await conn.query(query);
        return result.insertId;
      } catch (error) {
        throw error;
      }
    });

    _defineProperty(this, "findByField", async (table, field, value) => {
      const query = `SELECT * FROM ${table} WHERE ${field} = ?`;

      try {
        const conn = this.getConnection();
        const [rows, columns] = await conn.query(query, [value]);
        return rows;
      } catch (error) {
        throw error;
      }
    });

    _defineProperty(this, "findByFields", async (table, fields, values) => {
      const query = `SELECT * FROM ${table} WHERE ${fields.join(' = ? AND ')} = ?`;

      try {
        const conn = this.getConnection();
        const [rows, columns] = await conn.query(query, values);
        return rows;
      } catch (error) {
        throw error;
      }
    });

    _defineProperty(this, "find", async (table, id) => {
      const query = `SELECT * FROM ${table} WHERE id = ?`;

      try {
        const conn = this.getConnection();
        const [rows, columns] = await conn.query(query, [id]);

        if (rows.length === 0) {
          throw new Error('Resource not found');
        }

        return rows[0];
      } catch (error) {
        throw error;
      }
    });
  }

}

_defineProperty(BaseRepository, "instance", undefined);

_defineProperty(BaseRepository, "getInstance", connection => {
  if (BaseRepository.instance === undefined) {
    BaseRepository.instance = new BaseRepository();
  }

  return BaseRepository.instance;
});

var _default = BaseRepository;
exports.default = _default;