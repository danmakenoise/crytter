'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint(
      'Users',
      ['username'],
      {
        name: 'users_username_length_check',
        type: 'check',
        where: Sequelize.where(
          Sequelize.fn(
            'char_length',
            Sequelize.col('username')
          ),
          {
            [Sequelize.Op.lt]: 15,
            [Sequelize.Op.gt]: 3
          }
        )
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      'Users',
      'users_username_length_check'
    )
  }
}
