import fs from 'fs'
import log from '../utilities/logger'
import path from 'path'
import Sequelize from 'sequelize'

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false })

class Database {
  static get sequelize () {
    return sequelize
  }

  static async authenticate () {
    try {
      await sequelize.authenticate()
      log.success('Database connection successful')
      await this.loadModels(path.join(__dirname, '..', 'models'))
    } catch (err) {
      log.error('Database connection failed')
      log.error(err)
    }
  }

  static async loadModels (models) {
    const files = await fs.promises.readdir(models)

    for (const file of files) {
      await require(path.join(models, file))
    }

    sequelize.sync()
  }
}

export default Database
