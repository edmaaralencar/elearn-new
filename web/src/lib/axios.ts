import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true
})

// const enableApiDelay = false

// if (enableApiDelay) {
//   api.interceptors.request.use(async config => {
//     await new Promise(resolve =>
//       setTimeout(resolve, Math.round(Math.random() * 4000))
//     )

//     return config
//   })
// }
