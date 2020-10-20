import Database from '../structures/Database'
import { DataTypes } from 'sequelize'

const Case = Database.sequelize.define('Cases', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  moderator: {
    type: DataTypes.STRING,
    allowNull: false
  },
  moderatorID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  duration: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: null
  }
}, {
  timestamps: false
})

export default Case
