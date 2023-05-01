import request from '@/utils/request'

export function fetchChaincodes(data, idx) {
  return request({
    url: '/Blockchain/GetChaincodesInfoByPage/' + data + '/' + idx,
    method: 'get',
  })
}

