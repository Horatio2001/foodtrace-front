import request from '@/utils/request'

export function fetchNetwork() {
  return request({
    url: '/Blockchain/GetAllNetInfos',
    method: 'get'
  })
}

