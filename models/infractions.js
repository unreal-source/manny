import Database from '../structures/Database'
import Sequelize from 'sequelize'

const InfractionHistory = Database.sequelize.define('Infractions', {
  user_id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  mutes: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  strikes: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  bans: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  }
})

export default InfractionHistory
