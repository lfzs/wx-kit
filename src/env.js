const env = {
  development: {
    host: 'http://127.0.0.1:3000',
  },
  staging: {
    host: 'https://',
  },
  production: {
    host: 'https://',
  },
}

export const { host } = env[process.env.TARGET_ENV]
export const baseURL = `${host}/app/api/v1`
