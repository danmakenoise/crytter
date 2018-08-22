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
          where: {
            username: req.body.recipientUsername
          }
        })

        if (!recipient) {
          res.status(401).send()
        }

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
          recipientId: recipient.id,
          encryptedKey
        }, { transaction })

        res.status(200).send()
      } catch (err) {
        console.warn(err)
        res.status(400).send()
      }
    })
  },

  async get (req, res) {
    if (!req.session.userId || !req.session.username) {
      console.warn(`Session cookie missing or incomplete`)
      return res.status(401).send({ error: 'Unauthorized' })
    }

    if (!req.session.privateKey) {
      console.warn(`Private key missing`)
      return res.status(401).send({ error: 'Unauthorized' })
    }

    const encryptedMessages = await Share.findAll({
      include: [
        { model: Message, as: 'message' },
        { model: User, as: 'sender' }
      ],
      where: {
        recipientId: req.session.userId
      }
    })

    const decryptedMessages = encryptedMessages.map(message => {
      const encryptedKey = message.encryptedKey

      const key = ursa.createPrivateKey(req.session.privateKey)
        .decrypt(encryptedKey, 'base64', 'utf8')

      const decipher = crypto.createDecipher('aes-256-ctr', key) // eslint-disable-line
      const decrypted = decipher.update(message.message.encryptedBody, 'hex', 'utf8')
      const messageBody = `${decrypted}${decipher.final('utf8')}`

      return {
        senderId: message.senderId,
        senderUsername: message.sender.username,
        recipientId: message.recipientId,
        message: messageBody
      }
    })

    res.status(200).send(decryptedMessages)
  }
}
