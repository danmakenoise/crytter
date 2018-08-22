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

        const sender = await User.findOne({
          where: {
            username: req.session.username
          }
        })

        const recipient = await User.findOne({
          where: {
            username: req.body.recipientUsername
          }
        })

        if (!recipient || !sender) {
          res.status(401).send()
        }

        const cipher = crypto.createCipher('aes-256-ctr', fileKey) // eslint-disable-line
        const crypted = cipher.update(req.body.message, 'utf8', 'hex')
        const encryptedBody = `${crypted}${cipher.final('hex')}`

        const message = await Message.create({
          encryptedBody
        }, { transaction })

        const encryptedKey = ursa.createPublicKey(sender.publicKey, 'utf8')
          .encrypt(fileKey, 'utf8', 'base64')

        await Share.create({
          messageId: message.id,
          ownerId: sender.id,
          senderId: req.session.userId,
          recipientId: recipient.id,
          encryptedKey
        }, { transaction })

        if (recipient.id !== sender.id) {
          const recipientEncryptedKey = ursa.createPublicKey(recipient.publicKey, 'utf8')
            .encrypt(fileKey, 'utf8', 'base64')

          await Share.create({
            messageId: message.id,
            ownerId: recipient.id,
            senderId: req.session.userId,
            recipientId: recipient.id,
            encryptedKey: recipientEncryptedKey
          }, { transaction })
        }

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
        recipientId: req.session.userId,
        ownerId: req.session.userId
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
  },

  async getSent (req, res) {
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
        { model: User, as: 'recipient' }
      ],
      where: {
        senderId: req.session.userId,
        ownerId: req.session.userId
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
        recipientId: message.recipientId,
        recipientUsername: message.recipient.username,
        message: messageBody
      }
    })

    res.status(200).send(decryptedMessages)
  }
}
