import request from '@/utils/request'

export function generateQRCode(data) {
  return request({
    url: '/QRCode/generatingQRCode',
    method: 'post',
    params: {
      ID : data
    }
  })
}
