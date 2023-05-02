import request from '@/utils/request'

export function fetchEnterListByPage(data, pageIdx) {
  return request({
    url: '/Info/QueryEnterInfosByPage/'+data+'/'+pageIdx,
    method: 'get',
  })
}

export function fetchEnterTotal() {
  return request({
    url: '/Info/enterCount',
    method: 'get',
  })
}

export function fetchEnter(data) {
  return request({
    url: '/Info/QueryEnterInfoByID/'+data,
    method: 'get',
  })
}

export function updateEnter(data) {
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
    url: '/Info/ModifyEnterInfoInSql',
    method: 'post',
    params
  })
}


export function deleteEnter(data) {
  return request({
    url: '/Info/DeleteFruitInfo',
    method: 'post',
    params: {
      fruitInfoID : data
    }
  })
}

export function contradictEnter(data) {
  return request({
    url: '/Info/RefuseEnterInfoInSql',
    method: 'post',
    params: {
      fruitInfoID : data
    }
  })
}

export function createShare(data) {
  const params = {}
  for (const key in data) {
    if (key === 'name' || key === 'type') {
      continue
    }
    if (data.hasOwnProperty(key) && data[key] !== '') {
      params[key.charAt(0).toUpperCase() + key.slice(1)] = data[key];
    }
  }
  return request({
    url: '/Info/AddShareInfoInSql',
    method: 'post',
    params
  })
}
