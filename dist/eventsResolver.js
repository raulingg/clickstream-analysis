"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BaseRepository = _interopRequireDefault(require("./data/BaseRepository"));

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async (database, eventMessage) => {
  const {
    EVENT_TYPES
  } = _config.getEventsConfig;

  switch (eventMessage.event) {
    case EVENT_TYPES.PAGE_VISITED:
      try {
        const dataBeforeResolver = await processEventBeforeResolver(database, eventMessage);
        await pageVisitedResolver({ ...eventMessage,
          ...dataBeforeResolver
        });
        return;
      } catch (error) {
        throw error;
      }

    case EVENT_TYPES.LINK_CLICKED:
      try {
        const dataBeforeResolver = await processEventBeforeResolver(database, eventMessage);
        await linkClickedResolver({ ...eventMessage,
          ...dataBeforeResolver
        });
        return;
      } catch (error) {
        throw error;
      }

  }
};

exports.default = _default;

const processEventBeforeResolver = async (database, {
  visitorIdentity = null,
  clientId = null,
  data
}) => {
  if (!visitorIdentity) {
    throw new Error('Visitor identity not supplied.');
  }

  if (!clientId) {
    throw new Error('Site client id not supplied.');
  }

  const conn = await database.getConnection();

  const repository = _BaseRepository.default.getInstance().setConnection(conn);

  try {
    await conn.query('START TRANSACTION');
    const sites = await repository.findByField('sites', 'client_id', clientId);
    const site = sites[0];
    const visitorPromise = repository.findByField('visitors', 'identity', visitorIdentity);
    const pagePromise = repository.findByFields('pages', ['url', 'site_id'], [data.pathname, site.id]);
    const visitors = await visitorPromise;
    const pages = await pagePromise;
    let visitorId = visitors[0] ? visitors[0].id : null;
    let pageId = pages[0] ? pages[0].id : null;

    if (!pageId) {
      pageId = await repository.create('pages', ['url', 'site_id'], [data.pathname, site.id]);
    }

    if (!visitorId) {
      visitorId = await repository.create('visitors', ['identity', 'site_id'], [visitorIdentity, site.id]);
    }

    const [visits, columns] = await conn.query(`SELECT id, created_at FROM visits WHERE visitor_id = ? and ended_at is ?`, [visitorId, null]);
    let visitId = visits[0] ? visits[0].id : null;

    if (!visitId) {
      visitId = await repository.create('visits', ['visitor_id', 'site'], [visitorId, site.name]);
    } else if (exceedsDurationTime(visits[0].created_at)) {
      const visitCreatePromise = repository.create('visits', ['visitor_id', 'site'], [visitorId, site.name]);
      const visitUpdatePromise = repository.update('visits', visits[0].id, ['ended_at'], [new Date()]);
      visitId = await visitCreatePromise;
      await visitUpdatePromise;
    }

    await conn.query('COMMIT');
    await conn.release();
    return {
      visitorId,
      pageId,
      visitId,
      siteName: site.name
    };
  } catch (error) {
    if (conn != null) {
      await conn.query('ROLLBACK');
    }

    throw error;
  }
};

const pageVisitedResolver = async ({
  visitId,
  pageId,
  siteName,
  data
}) => {
  try {
    const repository = _BaseRepository.default.getInstance();

    await repository.create('pageviews', ['visit_id', 'page_id', 'page_url', 'site'], [visitId, pageId, data.pathname, siteName]);
    await repository.getConnection().release();
  } catch (error) {
    if (conn != null) {
      await conn.query('ROLLBACK');
    }

    throw error;
  }
};

const linkClickedResolver = async ({
  visitorId,
  pageId,
  siteName,
  data
}) => {
  try {
    const repository = _BaseRepository.default.getInstance();

    await repository.create('clicks', ['referer', 'visitor_id', 'page_id', 'page_url', 'site'], [data.referer, visitorId, pageId, data.pathname, siteName]);
    await repository.getConnection().release();
  } catch (error) {
    if (conn != null) {
      await conn.query('ROLLBACK');
    }

    throw error;
  }
};

const exceedsDurationTime = createdAt => {
  const currentDate = new Date();
  const timeDiff = (currentDate - createdAt) / 1000; // is new visit if exceeds 1800 (30min)

  return timeDiff > 1800;
};