import request from '@/utils/request'

export function fetchTxByID(TxHash) {
  return request({
    url: '/Blockchain/GetTxInfo/' + TxHash,
    method: 'get',
  })
}

export function fetchBlockByHash(TxHash) {
  return request({
    url: '/Blockchain/GetBlockInfoByHash/' + TxHash,
    method: 'get',
  })
}

export function fetchCertificateByHash(TxHash) {
  return request({
    url: '/Info/queryCertificateByHash/' + TxHash,
    method: 'get',
  })
}

export function getCertifiedInfoById(data) {
  return request({
    url: '/ReadFruitInfo' ,
    method: 'get',
    params:{
      fruitInfoID : data
    }
  })
}

export function getHistory(data) {
  return request({
    url: '/ReadFruitInfoHistory' ,
    method: 'get',
    params:{
      fruitInfoID : data
    }
  })
}
