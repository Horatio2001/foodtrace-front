import request from '@/utils/request'

export function fetchSaveListByPage(data, pageIdx) {
  return request({
    url: '/Info/QuerySaveInfosByPage/'+data+'/'+pageIdx,
    method: 'get',
  })
}


export function fetchBlurSaveListByPage(BlurID) {
  return request({
    url: '/BlurInfo/querySaveInfoByBlurID',
    method: 'get',
    params:{
      BlurID: BlurID
    }
  })
}

export function fetchSaveTotal() {
  return request({
    url: '/Info/saveCount',
    method: 'get',
  })
}

export function fetchSave(data) {
  return request({
    url: '/Info/QuerySaveInfoByID/'+data,
    method: 'get',
  })
}

export function updateSave(data) {
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
    url: '/Info/ModifySaveInfoInSql',
    method: 'post',
    params
  })
}


export function deleteSave(data) {
  return request({
    url: '/Info/DeleteFruitInfo',
    method: 'post',
    params: {
      fruitInfoID : data
    }
  })
}

export function contradictSave(data) {
  return request({
    url: '/Info/RefuseSaveInfoInSql',
    method: 'post',
    params: {
      fruitInfoID : data
    }
  })
}

export function createEnter(data) {
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
    url: '/Info/AddEnterInfoInSql',
    method: 'post',
    params
  })
}
