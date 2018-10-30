"use strict";

var _database = _interopRequireDefault(require("../database"));

var _config = require("../config");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _faker = require("faker");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dbConfig = (0, _config.getDatabaseConfig)();

const database = _database.default.init(dbConfig);

const createUser = async (data = {}) => {
  const conn = await database.getConnection();
  const query = `INSERT INTO users (name, lastname, email, password, secret) VALUES (?, ?, ?, ?, ?)`;
  const values = await getUserData(data);
  const [result] = await conn.query(query, values);
  return result.insertId;
};

const getUserData = async ({
  name,
  lastname,
  email,
  password = '123456'
}) => {
  const passwordHash = await _bcrypt.default.hash(password, 10);
  return [name || _faker.name.firstName(), lastname || _faker.name.lastName(), email || _faker.internet.email(), passwordHash, _faker.random.uuid()];
};

const createSite = async (data = {}) => {
  const conn = await database.getConnection();
  const query = `INSERT INTO sites (name, domain, client_id, owner_id) VALUES (?, ?, ?, ?)`;
  const values = await getSiteData(data);
  const [result] = await conn.query(query, values);
  return result.insertId;
};

const getSiteData = async ({
  name,
  domain,
  clientId,
  ownerId
}) => [name || _faker.internet.domainWord(), domain || _faker.internet.domainName(), clientId || _faker.random.alphaNumeric(16), ownerId];

(async () => {
  const userId = await createUser({
    email: 'raul@myemail.com',
    password: '123456'
  });
  await createSite({
    ownerId: userId,
    name: 'My clickstream site',
    domain: 'localhost',
    clientId: '123456789'
  });
  process.exit();
})();