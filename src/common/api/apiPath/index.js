import fetch from '../../fetch'
import urlConst from './urlConst' // url路径定义文件

const urlConfig = {
  ...urlConst
}

/**
 * 通用请求方法
 * @param {methodType} 请求方式
 * @param {urlName} 接口名称
 * @param {dataParams} 正常传参
 * @param {urlParam} url参数
 */
/* 通用请求方法 */
export function ajaxRequest (methodType, urlName, dataParams, urlParam) {
  methodType = methodType.toUpperCase()
  dataParams = dataParams || ''
  urlParam = urlParam || ''
  let requestConfig = {
    method: methodType
  }
  let url = urlConfig[urlName]
  requestConfig.url = urlParam ? (url + '/' + urlParam) : url
  switch (methodType) {
    case 'POST':
    case 'PUT':
    case 'DELETE':
      requestConfig.headers = { 'Content-Type': 'application/json' }
      requestConfig.data = dataParams
      break
    case 'GET':
      requestConfig.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
      requestConfig.params = dataParams
      break
    case 'UPLOAD':
      requestConfig.headers = { 'Content-Type': 'application/form-data' }
      requestConfig.method = 'POST'
      requestConfig.data = dataParams
      break
    // 下载excel zip
    case 'DOWNLOAD':
      // requestConfig.headers = { 'Content-Type': 'application/json' }
      // requestConfig.method = 'POST'
      // requestConfig.data = dataParams
      requestConfig.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
      requestConfig.method = 'GET'
      requestConfig.params = dataParams
      requestConfig.responseType = 'blob'
      break
    // 下载回显图片
    case 'GETIMAGE':
      requestConfig.headers = { 'Content-Type': 'application/json' }
      requestConfig.method = 'GET'
      requestConfig.params = dataParams
      requestConfig.responseType = 'blob'
      break
    default:
      requestConfig.headers = { 'Content-Type': 'application/json' }
      requestConfig.method = 'POST'
      requestConfig.data = dataParams
      break
  }
  return fetch(requestConfig)
}
