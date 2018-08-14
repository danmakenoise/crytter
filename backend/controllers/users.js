const bcrypt = require('bcrypt')
const crypto = require('crypto')
const ursa = require('ursa')
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

    const key = ursa.generatePrivateKey()
    const publicKey = key.toPublicPem('utf8')
    const privateKey = key.toPrivatePem('utf8')

    const cipher = crypto.createCipher('aes-256-ctr', req.body.password) // eslint-disable-line
    const crypted = cipher.update(privateKey, 'utf8', 'hex')
    const encryptedPrivateKey = `${crypted}${cipher.final('hex')}`

    return User.create({
      username: req.body.username,
      passwordHash,
      passwordSalt,
      publicKey,
      encryptedPrivateKey
    })
      .then(user => res.status(201).send({
        id: user.id,
        username: user.username
      }))
      .catch(error => {
        if (error.name.match(/Sequelize/) && error.errors) {
          return res.status(400).send({
            errors: error.errors.map(({ message }) => message)
          })
        } else {
          console.warn(error)
          return res.status(500).send()
        }
      })
  },
  me (req, res) {
    if (!req.session.userId || !req.session.username) {
      console.warn(`Session cookie missing or incomplete`)
      return res.status(401).send({ error: 'Unauthorized' })
    }

    User.findOne({
      where: {
        id: req.session.userId,
        username: req.session.username
      }
    })
      .then(user => {
        return res.status(200).send({
          username: user.username
        })
      })
      .catch(error => {
        console.warn(error)
        req.session.destroy()
        return res.status(401).send({ error: 'Unauthorized' })
      })
  }
}
