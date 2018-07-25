const config = {
  development: {
    api: 'http://localhost:3001'
  },
  production: {
    api: 'https://crytter-backend.herokuapp.com'
  }
}[process.env.NODE_ENV]

const validateParams = (params) => {
  const errors = []

  if (!params.username || !params.password || !params.passwordConfirm) {
    errors.push('Username, Password, and Password Confirmation are required.')
    return errors
  }

  if (params.username.length < 3) {
    errors.push('Username must be longer than 3 characters.')
  } else if (params.username.length > 15) {
    errors.push('Username must be shorter than 15 character.')
  }

  if (params.password.length < 8) {
    errors.push('Password must be longer than 3 characters.')
  } else if (params.password.length > 74) {
    errors.push('Username must be shorter than 74 character.')
  }

  if (params.password !== params.passwordConfirm) {
    errors.push('Passwords must match.')
  }

  return errors
}

export const signupUser = (params) => new Promise((resolve, reject) => {
  const errors = validateParams(params)

  if (errors.length) {
    resolve(errors)
    return
  }

  window.fetch(
    `${config.api}/users`,
    {
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
  ).then(() => resolve())
})

export const getMe = () => window.fetch(
  `${config.api}/users/me`,
  {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }
)
