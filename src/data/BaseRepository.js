import { format as SqlStringFormat } from 'sqlstring'

class BaseRepository {
  static instance = undefined

  /**
   * Get a singleton instance of BaseRepository
   *
   * @param Object connection
   * @returns BaseRepository
   */
  static getInstance = connection => {
    if (BaseRepository.instance === undefined) {
      BaseRepository.instance = new BaseRepository()
    }

    return BaseRepository.instance
  }

  setConnection = connection => {
    this.connection = connection

    return this
  }

  getConnection = () => {
    if (!this.connection) {
      throw new Error('Connection to database is undefined')
    }

    return this.connection
  }

  /**
   * Format fields : ['name', 'lastname', ... ]
   * Format values : ['carlos', 'guzman', ... ]
   *
   * @param string table
   * @param array fields
   * @param array values
   */
  create = async (table, fields, values) => {
    const queryFields = fields.join(', ')
    const queryValues = values.map(() => '?').join(', ')
    const query = SqlStringFormat(
      `INSERT INTO ${table} (${queryFields}) VALUES (${queryValues})`,
      values
    )
    try {
      11
      const conn = this.getConnection()
      const [result] = await conn.query(query)

      return result.insertId
    } catch (error) {
      throw error
    }
  }

  findByField = async (table, field, value) => {
    const query = `SELECT * FROM ${table} WHERE ${field} = ?`

    try {
      const conn = this.getConnection()
      const [rows, columns] = await conn.query(query, [value])

      return rows
    } catch (error) {
      throw error
    }
  }

  findByFields = async (table, fields, values) => {    
    const query = `SELECT * FROM ${table} WHERE ${fields.join(' = ? AND ')} = ?`

    try {
      const conn = this.getConnection()
      const [rows, columns] = await conn.query(query, values)

      return rows
    } catch (error) {
      throw error
    }
  }

  find = async (table, id) => {
    const query = `SELECT * FROM ${table} WHERE id = ?`

    try {
      const conn = this.getConnection()
      const [rows, columns] = await conn.query(query, [id])

      if (rows.length === 0) {
        throw new Error('Resource not found')
      }

      return rows[0]
    } catch (error) {
      throw error
    }
  }
}

export default BaseRepository
