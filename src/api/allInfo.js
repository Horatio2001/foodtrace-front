import request from '@/utils/request'

export function fetchInfoListByPage(data, pageIdx) {
  return request({
    url: '/Info/QueryInfoByPage/'+data+'/'+pageIdx,
    method: 'get',
  })
}

export function fetchInfoTotal() {
  return request({
    url: '/Info/collectCount',
    method: 'get',
  })
}

export function fetchInfo(data) {
  return request({
    url: '/Info/QueryInfoByID/'+data,
    method: 'get',
  })
}

export function deleteInfo(data) {
  return request({
    url: '/Info/DeleteFruitInfo',
    method: 'post',
    params: {
      fruitInfoID : data
    }
  })
}

export function loadInfo(data) {
  return request({
    url: '/Info/LoadInfoInSql',
    method: 'post',
    params: {
      fruitInfoID : data
    }
  })
}

export function queryCertificate(data) {
  return request({
    url: '/Info/queryCertificate/' + data,
    method: 'get',
  })
}
export function generateCertificate(data) {
  return request({
    url: '/Info/generateCertificate/'+ data,
    method: 'post',
  })
}
