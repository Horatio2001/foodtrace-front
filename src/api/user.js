import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/doLogin',
    method: 'post',
    params: {
      'ID': data.username,
      'PWD': data.password
    }
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
