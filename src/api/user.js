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

export function getInfo(ID) {
  return request({
    url: '/user/getUserInfo',
    method: 'get',
    params: { ID }
  })
}

export function getInfoByToken(token) {
  return request({
    url: '/user/getUserInfoByToken',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
