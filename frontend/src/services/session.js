const config = {
  development: {
    api: 'http://localhost:3001'
  },
  production: {
    api: 'https://crytter-backend.herokuapp.com'
  }
}[process.env.NODE_ENV]

export const login = params => window.fetch(
  `${config.api}/login`,
  {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: params.username,
      password: params.password
    })
  }
)
