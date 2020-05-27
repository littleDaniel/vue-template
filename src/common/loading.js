import { Loading } from 'element-ui'
// 全局loading
let loading
function startLoading (msg) {
  loading = Loading.service({
    lock: true,
    text: msg || '努力加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading () {
  loading.close()
}
let needLoadingRequestCount = 0

export function showFullScreenLoading (msg) {
  if (needLoadingRequestCount === 0) {
    startLoading(msg)
  }
  needLoadingRequestCount++
}
export function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
