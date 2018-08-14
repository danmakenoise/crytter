const bcrypt = require('bcrypt')
const crypto = require('crypto')
const User = require('../models').User

module.exports = {
  login (req, res) {
    if (!req.body.username || !req.body.password) {
      return res.status(401).send()
    }

    User.findOne({
      where: {
        username: req.body.username
      }
    })
      .then(user => {
        if (!user) {
          console.warn(`Error finding username: ${req.body.username}`)
          return res.status(401).send()
        }
        const isPassword = bcrypt.compareSync(req.body.password, user.passwordHash)

        if (!isPassword) {
          console.warn(`Incorrect password for: ${req.body.username}`)
          return res.status(401).send()
        }

        const decipher = crypto.createDecipher('aes-256-ctr', req.body.password) // eslint-disable-line
        const decrypted = decipher.update(user.encryptedPrivateKey, 'hex', 'utf8')
        const privateKey = `${decrypted}${decipher.final('utf8')}`

        req.session.username = user.username
        req.session.userId = user.id
        req.session.privateKey = privateKey

        req.session.save(() => {
          res.status(200).send({
            username: user.username
          })
        })
      })
  },
  logout (req, res) {
    if (!req.session.username || !req.session.userId) {
      return res.status(401).send()
    }

    req.session.destroy(() => {
      res.status(200).send()
    })
  }
}
