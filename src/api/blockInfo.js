import request from '@/utils/request'

export function fetchBlock() {
  return request({
    url: '/Blockchain/GetAllBlockInfo',
    method: 'get'
  })
}

export function fetchBlockByPage(data) {
  return request({
    url: '/Blockchain/GetBlockInfoByPage/' + data,
    method: 'get',
  })
}

