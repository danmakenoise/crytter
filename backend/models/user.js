'use strict'
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true,
        len: [3, 15]
      }
    },
    passwordHash: {
      allowNull: false,
      type: DataTypes.STRING
    },
    passwordSalt: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {})

  return User
}
