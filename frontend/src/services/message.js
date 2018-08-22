const config = {
  development: {
    api: 'http://localhost:3001'
  },
  production: {
    api: 'https://crytter-backend.herokuapp.com'
  }
}[process.env.NODE_ENV]

export const getMessages = () => window.fetch(
  `${config.api}/messages`,
  {
    credentials: 'include',
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }
).then(res => res.json())

export const getSentMessages = () => window.fetch(
  `${config.api}/messages/sent`,
  {
    credentials: 'include',
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }
).then(res => res.json())

export const sendMessage = (params) => window.fetch(
  `${config.api}/messages`,
  {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: params.message,
      recipientUsername: params.recipientUsername
    })
  }
)
