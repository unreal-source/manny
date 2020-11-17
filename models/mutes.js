import Database from '../structures/Database'
import { DataTypes } from 'sequelize'

const Mute = Database.sequelize.define('Mutes', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiration: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, { timestamps: false })

export default Mute
