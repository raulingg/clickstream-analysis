class PagesManager {
  constructor(database) {
    this.database = database
  }

  countByDateAndSiteId = async (siteId, dateInterval = 0)  => {
    const query = `SELECT p.id as page_id, p.url as page_url, count(*) as cant FROM pageviews as pv 
        join 
            pages as p on p.id = pv.page_id
        join 
            sites as s on s.id = p.site_id
        where 
            s.id = ? AND
            pv.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        group by 
            pv.page_id
        ORDER BY cant DESC;`

    let conn = await this.database.getConnection()
    let res = await conn.execute(query, [siteId, dateInterval])
    conn.release()
    return res
  }

}

export default PagesManager