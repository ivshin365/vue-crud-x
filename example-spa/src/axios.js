import axios from 'axios'
import { store } from './store'

// import jwtDecode from 'jwt-decode'

const API_URL = process.env.VUE_APP_API_URL || 'http://127.0.0.1:3000'

export const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

http.interceptors.request.use((config) => {
  // Do something before request is sent
  config.store = store
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
http.interceptors.response.use((response) => {
  // Do something with response data
  /* handle refresh token example
  if (response.headers['refresh-token]) {
    const token = response.headers['refresh-token]
    const payload = jwtDecode(token)
    axios.defaults.headers.common['Authorizerion'] = 'Bearer ' + token
    localStorage.setItem('session-token', token)
  }
  */
  return response
}, (error) => {
  // Do something with response error
  // console.log('intercept', JSON.stringify(error))
  if (error.response && error.response.status === 401) { // auth failed
    const myURL = new URL(error.config.url)
    if (myURL.pathname !== '/api/auth/logout' && myURL.pathname !== '/api/auth/otp') {
      error.config.store.dispatch('logout', { forced: true })
    }
  }
  return Promise.reject(error)
})
