import request from '@/utils/request'

export function getBlockHeight() {
  return request({
    url: '/Blockchain/GetBlockHeight', // 假地址 自行替换
    method: 'get'
    // baseURL: '/'
  })
}

export function getPeerSum() {
  return request({
    url: '/Blockchain/GetAllPeers',
    method: 'get'
  })
}

export function getPeerName() {
  return request({
    url: '/Blockchain/GetAllPeerName',
    method: 'get'
  })
}

export function getNewestBlockInfo() {
  return request({
    url: '/Blockchain/GetNewestBlockInfo',
    method: 'get'
  })
}

export function getBlockInfoByNum(data) {
  return request({
    url: '/Blockchain/GetBlockInfoByNum',
    method: 'get',
    params: {
      'BlockNum': data.BlockNum
    }
  })
}

export function getTxByOrg() {
  return request({
    url: '/Blockchain/GetTxByOrg',
    method: 'get'
  })
}
