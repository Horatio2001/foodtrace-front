import request from '@/utils/request'

export function fetchBlock() {
  return request({
    url: '/Blockchain/GetAllBlockInfo',
    method: 'get'
  })
}

export function fetchBlockByPage(data, idx) {
  return request({
    url: '/Blockchain/GetBlockInfoByPage/' + data + '/' + idx,
    method: 'get',
  })
}

