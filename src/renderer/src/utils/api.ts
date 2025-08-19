import axios from 'axios'

export const api = axios.create({ baseURL: `http://localhost:39722` })

// 요청 전 configuration
api.interceptors.request.use(
  (config) => {
    // Bearer 토큰 등 설정
    return config
  },
  (error) => Promise.reject(error)
)

// 에러 처리
api.interceptors.response.use(
  (res) => {
    if (res.status >= 200 && res.status < 300) {
      return res.data
    } else {
      return Promise.reject({
        code: res.status,
        message: res.statusText || 'Unknown HTTP error'
      })
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)
