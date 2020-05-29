import Database from '../structures/Database'
import Sequelize from 'sequelize'

const InfractionHistory = Database.sequelize.define('Infractions', {
  user_id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  mutes: {
    type: Sequelize.ARRAY(Sequelize.JSONB)
  },
  strikes: {
    type: Sequelize.ARRAY(Sequelize.JSONB)
  },
  bans: {
    type: Sequelize.ARRAY(Sequelize.JSONB)
  }
})

export default InfractionHistory
