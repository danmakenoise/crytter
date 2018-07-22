'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint(
      'Users',
      ['username'],
      {
        name: 'users_username_alphanumeric_check',
        type: 'check',
        where: {
          username: {
            [Sequelize.Op.regexp]: '^[a-zA-Z0-9]*$'
          }
        }
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      'Users',
      'users_username_alphanumeric_check'
    )
  }
}
