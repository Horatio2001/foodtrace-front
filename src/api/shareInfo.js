import request from '@/utils/request'

export function fetchShareListByPage(data, pageIdx) {
  return request({
    url: '/Info/QueryShareInfosByPage/'+data+'/'+pageIdx,
    method: 'get',
  })
}

export function fetchShareTotal() {
  return request({
    url: '/Info/shareCount',
    method: 'get',
  })
}

export function fetchShare(data) {
  return request({
    url: '/Info/QueryShareInfoByID/'+data,
    method: 'get',
  })
}

export function updateShare(data) {
  const params = {}
  for (const key in data) {
    if (key === 'type' || key=== 'name') {
      continue
    }
    if (data.hasOwnProperty(key) && data[key] !== '') {
      params[key.charAt(0).toUpperCase() + key.slice(1)] = data[key];
    }
  }
  return request({
    url: '/Info/ModifyShareInfoInSql',
    method: 'post',
    params
  })
}


export function deleteShare(data) {
  return request({
    url: '/Info/DeleteFruitInfo',
    method: 'post',
    params: {
      fruitInfoID : data
    }
  })
}

export function contradictShare(data) {
  return request({
    url: '/Info/RefuseShareInfoInSql',
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
