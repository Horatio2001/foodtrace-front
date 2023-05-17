import request from '@/utils/request'

export function fetchCollectionListByPage(data, pageIdx) {
  return request({
    url: '/Info/QueryCollectInfosByPage/' + data + '/' + pageIdx,
    method: 'get'
  })
}

export function fetchBlurCollectionListByPage(BlurID) {
  return request({
    url: '/BlurInfo/queryCollectInfoByBlurID',
    method: 'get',
    params:{
      BlurID: BlurID
    }
  })
}

export function fetchCollectionTotal() {
  return request({
    url: '/Info/collectCount',
    method: 'get'
  })
}

export function fetchCollection(data) {
  return request({
    url: '/Info/QueryCollectInfoByID/' + data,
    method: 'get'
  })
}

export function createCollection(data) {
  // collectStatus:'',
  //   isLoaded:'',
  //   isContradicted:'',
  const formData = new FormData();
  if (file !== null) {
    formData.append('Image', file)
  }
  const params = {}
  for (const key in data) {
    if (key === 'collectStatus' || key === 'isLoaded' || key === 'isContradicted') {
      continue
    }
    if (data.hasOwnProperty(key) && data[key] !== '') {
      // formData.append(key.charAt(0).toUpperCase() + key.slice(1), data[key])
      params[key.charAt(0).toUpperCase() + key.slice(1)] = data[key]
    }
  }
  return request({
    url: '/Info/AddCollectInfoInSql',
    method: 'post',
    params,
  })
}

export function updateCollection(data) {
  const params = {}
  for (const key in data) {
    if (key === 'type' || key === 'name') {
      continue
    }
    if (data.hasOwnProperty(key) && data[key] !== '') {
      params[key.charAt(0).toUpperCase() + key.slice(1)] = data[key]
    }
  }
  return request({
    url: '/Info/ModifyCollectInfoInSql',
    method: 'post',
    params
  })
}

export function deleteCollection(data) {
  return request({
    url: '/Info/DeleteFruitInfo',
    method: 'post',
    params: {
      fruitInfoID: data
    }
  })
}

export function contradictCollection(data) {
  return request({
    url: '/Info/RefuseCollectInfoInSql',
    method: 'post',
    params: {
      fruitInfoID: data
    }
  })
}

export function createSave(data) {
  const params = {}
  for (const key in data) {
    if (key === 'name' || key === 'type') {
      continue
    }
    if (data.hasOwnProperty(key) && data[key] !== '') {
      params[key.charAt(0).toUpperCase() + key.slice(1)] = data[key]
    }
  }
  return request({
    url: '/Info/AddSaveInfoInSql',
    method: 'post',
    params
  })
}
