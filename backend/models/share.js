'use strict'

module.exports = (sequelize, DataTypes) => {
  var Share = sequelize.define('Share', {
    encryptedKey: DataTypes.TEXT
  }, {})

  Share.associate = function (models) {
    Share.belongsTo(
      models.Message,
      {
        as: 'message',
        foreignKey: 'messageId'
      }
    )

    Share.belongsTo(
      models.User,
      {
        as: 'sender',
        foreignKey: 'senderId'
      }
    )

    Share.belongsTo(
      models.User,
      {
        as: 'owner',
        foreignKey: 'ownerId'
      }
    )

    Share.belongsTo(
      models.User,
      {
        as: 'recipient',
        foreignKey: 'recipientId'
      }
    )
  }

  return Share
}
