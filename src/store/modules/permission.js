
import { asyncRouterMap, constantRoutes } from '@/router'
import { cloneDeep } from 'lodash'
/**
 *
 * @param  {Array} userRouter 后台返回的用户权限json
 * @param  {Array} allRouter  前端配置好的所有动态路由的集合
 * @return {Array} realRoutes 过滤后的路由
 */
export function recursionRouter (userRouter = [], allRouter = []) {
  let realRoutes = []
  allRouter.forEach(val => {
    userRouter.forEach(item => {
      if (val.path.includes('/')) {
        if (item.resCode === val.path.split('/')[1]) {
          val.children = recursionRouter(item.children, val.children)
          realRoutes.push(val)
        }
      } else {
        if (item.resCode === val.path) {
          if (item.children && item.children.length > 0) {
            val.children = recursionRouter(item.children, val.children)
          }
          realRoutes.push(val)
        }
      }
    })
  })
  realRoutes.push({ path: '*', redirect: '/404', isShow: true })
  return realRoutes
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
    state.addRoutes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes ({ commit }, roles) {
    return new Promise(resolve => {
      const cloneDeepRoutes = cloneDeep(asyncRouterMap)
      let accessedRoutes = recursionRouter(roles, cloneDeepRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
