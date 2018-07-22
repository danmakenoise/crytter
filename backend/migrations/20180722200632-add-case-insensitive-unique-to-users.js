'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex(
      'Users',
      {
        name: 'users_username_case_insensitive_unique',
        fields: [Sequelize.fn('lower', Sequelize.col('username'))],
        unique: true
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex(
      'Users',
      'users_username_case_insensitive_unique'
    )
  }
}
