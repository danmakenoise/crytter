const bcrypt = require('bcrypt')
const User = require('../models').User

module.exports = {
  login (req, res) {
    if (!req.body.username || !req.body.password) {
      return res.status(401).send()
    }

    User.findOne({
      username: req.body.username
    })
      .then(user => {
        const isPassword = bcrypt.compareSync(req.body.password, user.passwordHash)

        if (!isPassword) {
          return res.status(401).send()
        }

        req.session.username = user.username

        return res.send(200).send({
          username: user.username
        })
      })
  }
}
