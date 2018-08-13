'use strict'

module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    encryptedBody: DataTypes.TEXT
  }, {})

  return Message
}
