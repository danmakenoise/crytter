const bcrypt = require('bcrypt')
const User = require('../models').User

const validatePassword = password => {
  const errors = []

  if (!password) {
    errors.push('password is required')
  }

  if (password && password.length < 8) {
    errors.push('password must contain more than 8 charaters')
  }

  if (password && password.length > 72) {
    errors.push('password must container fewer than 72 charaters')
  }

  return { errors }
}

module.exports = {
  create (req, res) {
    const passwordValidation = validatePassword(req.body.password)

    if (passwordValidation.errors.length) {
      return res.status(400).send({ errors: passwordValidation.errors })
    }

    const passwordSalt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(req.body.password, passwordSalt)

    return User.create({
      username: req.body.username,
      passwordHash,
      passwordSalt
    })
      .then(user => res.status(201).send({
        id: user.id,
        username: user.username
      }))
      .catch(error => {
        if (error.name.match(/Sequelize/)) {
          return res.status(400).send({
            errors: error.errors.map(({ message }) => message)
          })
        } else {
          return res.status(500).send()
        }
      })
  }
}