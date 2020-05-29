const mutations = {
  // 按钮权限
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  }
}
// 递归获取按钮list
let btns = []
export function findSonListCheck (list) {
  list.forEach(val => {
    if (val.type === '1') {
      if (val.children && val.children.length > 0) {
        findSonListCheck(val.children)
      }
    } else {
      btns.push(val.resCode)
    }
  })
  return btns
}

export default {
  namespaced: true,
  state,
  mutations
}
