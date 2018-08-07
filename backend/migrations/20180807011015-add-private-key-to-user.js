'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Users',
      'encryptedPrivateKey',
      {
        allowNull: false,
        type: Sequelize.TEXT
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Users',
      'encryptedPrivateKey'
    )
  }
}
