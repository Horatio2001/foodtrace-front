import request from '@/utils/request'

export function fetchTxByPage(data, idx) {
  return request({
    url: '/Blockchain/GetTxInfoByPage/' + data + '/' + idx,
    method: 'get',
  })
}
