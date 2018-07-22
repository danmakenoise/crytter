const User = require('../models').User

module.exports = {
  create (req, res) {
    return User.create({
      username: req.body.username,
      passwordHash: 'passwordHash',
      passwordSalt: 'passwordSalt'
    })
      .then(user => res.status(201).send({
        id: user.id,
        username: user.username
      }))
      .catch(error => {
        if (error.name === 'SequelizeValidationError') {
          res.status(400).send({
            errors: error.errors.map(({ message }) => message)
          })
        } else {
          res.status(400).send({
            errors: [
              'something went wrong'
            ]
          })
        }
      })
  }
}
