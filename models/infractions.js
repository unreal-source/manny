import Database from '../structures/Database'
import Sequelize from 'sequelize'

const InfractionHistory = Database.sequelize.define('Infractions', {
  user_id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  mutes: {
    type: Sequelize.ARRAY(Sequelize.JSON)
  },
  strikes: {
    type: Sequelize.ARRAY(Sequelize.JSON)
  },
  bans: {
    type: Sequelize.ARRAY(Sequelize.JSON)
  }
})

export default InfractionHistory
