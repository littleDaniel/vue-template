import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import router from '../router'
import { getToken } from '.commom'
import { Message, MessageBox } from 'element-ui'
import { showFullScreenLoading, tryHideFullScreenLoading } from './loading'

const BASE_URL = '/invoice'
// const TIMEOUT_MILLISECONDS = 60000 // 超时链接

const instance = axios.create({
  withCredentials: false,
  baseURL: BASE_URL, // 基本url
  // timeout: TIMEOUT_MILLISECONDS,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
/**
 *  解決重复请求
 *
 */
// 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
// let pending = []
// let CancelToken = axios.CancelToken
// let removeRepeatUrl = (config) => {
//   for (let p in pending) {
//     // 当当前请求在数组中存在时执行函数体
//     if (pending[p].requestOnly === config.url + '&' + config.method) {
//       // 执行取消操作
//       pending[p].cancelRequest()
//       // 把这条记录从数组中移除
//       pending.splice(p, 1)
//     }
//   }
// }

// axios请求拦截器
instance.interceptors.request.use((config) => {
  // 在一个请求发送前执行一下取消操作
  // removeRepeatUrl(config)
  // config.cancelToken = new CancelToken((c) => {
  //   // requestOnly自定义唯一标识
  //   pending.push({ requestOnly: config.url + '&' + config.method, cancelRequest: c })
  // })
  if (config.method === 'get') {
    if (!config.params.hideLoading) {
      showFullScreenLoading()
    }
  } else {
    if (!config.data.hideLoading) {
      showFullScreenLoading()
    }
  }
  // 每个接口新增时间戳
  let timestamp = new Date().getTime()
  if (config.url && config.url.includes('?')) {
    config.url = `${config.url}&t=${timestamp}`
  } else {
    config.url = `${config.url}?t=${timestamp}`
  }
  // stringify POST方式提交的数据 上传接口的数据不能进行qs.stringfly
  if (config.method === 'post' && config.headers['Content-Type'] !== 'application/json') {
    config.data = config.data instanceof FormData ? config.data : qs.stringify(config.data)
  }
  if (config.method === 'get') {
    config.paramsSerializer = function (parmas) {
      return qs.stringify(parmas, { arrayFormat: 'repeat' })
    }
  }

  // 在发送请求之前
  if (getToken()) {
    // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
    config.headers['Authorization'] = getToken()
  }
  return config
},
(error) => Promise.reject(error))
// token失效设置变量防止多次弹窗
let count = 0
// axios响应拦截器
instance.interceptors.response.use((response) => {
  // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
  // removeRepeatUrl(response.config)
  // console.log('axios响应拦截器', response.config)
  if (response.config.method === 'get') {
    if (!response.config.params.showLoading) {
      tryHideFullScreenLoading()
    }
  } else {
    if (!response.config.data.showLoading) {
      tryHideFullScreenLoading()
    }
  }
  const type = response.request.responseType || ''
  // 下载类型特殊处理文件名
  if (type.includes('blob')) {
    let disposition = response.headers['content-disposition']
    let filename = '默认文件名'
    if (disposition && disposition.indexOf('filename=') !== -1) {
      filename = decodeURI(disposition.substring(disposition.indexOf('filename=') + 9, disposition.length))
    }
    response.data.filename = filename
  }
  return response.data
}, (error) => {
  // pending = []
  tryHideFullScreenLoading()
  // console.log(555, error.config)
  // console.log(666, error.response.data.msg)
  switch (error.response && error.response.status) {
    case 400:
      error.message = '请求错误(400)'
      Message.error({
        message: error.response.data.msg || error.message
      })
      break
    case 401:
      error.message = '登录信息已过期，请重新登录'// (401)
      if (count === 0) {
        MessageBox.confirm(error.response.data.msg || error.message, {
          title: '提示',
          confirmButtonText: '确定',
          showCancelButton: false,
          showClose: false,
          type: 'warning'
        }).then(() => {
          if (store.getters.terminalType !== 'mgt') {
            store.dispatch('user/resetToken').then(() => {
              window.location.href = `${process.env.VUE_APP_JUMP_URL}?redirectTo=null&isFrame=false&redirectEntId=${store.getters.redirectEntId}&userId=${store.getters.entUserId}`
            })
          } else {
            store.dispatch('user/resetToken').then(() => {
              router.push('/login')
            })
          }
        })
      }
      break
    case 403:
      error.message = '拒绝访问(403)'
      break
    case 404:
      error.message = '请求出错(404)'
      break
    case 408:
      error.message = '请求超时(408)'
      Message.error({
        message: error.response.data.msg || error.message
        // center: true
      })
      break
    case 500:
      error.message = '服务器错误(500)'
      Message.error({
        message: error.response.data.msg || error.message
        // center: true
      })
      break
    case 501:
      error.message = '服务未实现(501)'
      break
    case 502:
      error.message = '网络错误(502)'
      break
    case 503:
      error.message = '服务不可用(503)'
      break
    case 504:
      error.message = '网络超时(504)'
      break
    case 505:
      error.message = 'HTTP版本不受支持(505)'
      break
  }
  if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    Message.error({
      message: '网络异常'
      // center: true
    })
  }
  count++
  // return Promise.reject(error)
  return error.response
})
export default instance
