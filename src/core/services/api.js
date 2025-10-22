// Axios
import axios from 'axios'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

const { origin, href } = window.location

const envSandBoxURL = import.meta.env.VITE_APP_SANDBOX_URL
const envBaseURL = import.meta.env.VITE_APP_BASE_URL

let sandbox = ''
if (href.includes('#/pay')) {
  // we are in pay pages
  if (href.includes('#/pay-sandbox')) {
    // we are in pay sandbox
    sandbox = true
  } else {
    sandbox = false
  }
} else {
  // we are in panel pages
  sandbox = JSON.parse(localStorage.getItem('sandbox') || 'false')
}

let baseURL = ''
if (sandbox) {
  baseURL = envSandBoxURL.includes('http') ? envSandBoxURL : `${origin}/${envSandBoxURL}`
} else {
  baseURL = envBaseURL.includes('http') ? envBaseURL : `${origin}/${envBaseURL}`
}

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
api.interceptors.response.use(
  (response) => {
    return Promise.resolve(response)
  },
  (error) => {

    // General
    const status = error.response.status
    const errors = error.response.data.errors
    const message = error.response.data.message

    // Check Error Code For Show Error
    if (status != 401) {
      if (errors) {
        for (const [key, value] of Object.entries(errors)) {
          appendAlert(value[0], {
            color: 'danger',
            type: 'alert'
          })
        }
      } else {
        appendAlert(message, {
          color: 'danger',
          type: 'alert'
        })
      }
    }

    return Promise.reject(error)
  }
)

export default api
