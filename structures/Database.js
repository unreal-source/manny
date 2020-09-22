import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import { Signale } from 'signale'

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false })
const log = new Signale({
  scope: 'Database'
})

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
    try {
      const files = await fs.promises.readdir(models)

      for (const file of files) {
        await require(path.join(models, file))
        log.info(`Model loaded: ${file}`)
      }

      await sequelize.sync()
      log.success('Models synchronized')
    } catch (err) {
      log.error(err)
    }
  }
}

export default Database
