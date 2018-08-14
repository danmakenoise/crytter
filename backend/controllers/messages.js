const crypto = require('crypto')
const ursa = require('ursa')
const db = require('../models')
const Message = require('../models').Message
const Share = require('../models').Share
const User = require('../models').User

module.exports = {
  async create (req, res) {
    if (!req.session.userId || !req.session.username) {
      console.warn(`Session cookie missing or incomplete`)
      return res.status(401).send({ error: 'Unauthorized' })
    }

    db.sequelize.transaction(async (transaction) => {
      try {
        const fileKey = crypto.randomBytes(64).toString('hex')

        const recipient = await User.findOne({
          id: req.body.recipientId
        })

        const encryptedKey = ursa.createPublicKey(recipient.publicKey, 'utf8')
          .encrypt(fileKey, 'utf8', 'base64')

        const cipher = crypto.createCipher('aes-256-ctr', fileKey) // eslint-disable-line
        const crypted = cipher.update(req.body.message, 'utf8', 'hex')
        const encryptedBody = `${crypted}${cipher.final('hex')}`

        const message = await Message.create({
          encryptedBody
        }, { transaction })

        await Share.create({
          messageId: message.id,
          senderId: req.session.userId,
          recipientId: req.body.recipientId,
          encryptedKey
        }, { transaction })

        res.status(200).send()
      } catch (err) {
        console.warn(err)
        res.status(400).send()
      }
    })
  }
}
