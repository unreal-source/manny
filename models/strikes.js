import Database from '../structures/Database'
import { DataTypes } from 'sequelize'

const Strike = Database.sequelize.define('Strikes', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  expiration: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, { timestamps: false })

export default Strike
