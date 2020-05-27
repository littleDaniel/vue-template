import store from '@/store'
/**
 * 使用  v-permission="'resCode'"
 *    resCode 需要隐藏的路由path
 *    按钮权限控制指令
 */
const permission = {
  inserted (el, vDir) {
    // vDir.value 有指令的参数
    let btnPremissions = store.getters.buttons
    // console.log(33, vDir.value)
    // console.log('buttons', btnPremissions)
    if (vDir.value) {
      if (!btnPremissions.includes(vDir.value)) {
        el.parentNode.removeChild(el)
      }
    }
  }
}
export default permission
