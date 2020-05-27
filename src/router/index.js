import Vue from 'vue'
import Router from 'vue-router'
// import Layout from '@/layout'

Vue.use(Router)
/**
 *
 * isShow: false                  是否显示菜单（默认为false,若不显示则设为true）——单个菜单
 * redirect:                      重定向
 * meta : {
    roles: ['admin','editor']    角色
    title: 'title'               菜单名渲染————若不想显示菜单则无需设置title
    icon: 'icon-name'            字体图标
    affix: true                  如果设置为true，则标记将附加在标记视图中
    noCache: true                如果设置为true，页面将不会被缓存(默认为false)
  }
 */
export const constantRoutes = []
export const asyncRouterMap = []
const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

// 解决动态加载路由报Duplicate named routes definition警告
const router = createRouter()
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
// 解决NavigationDuplicated（Unhandled promise rejection） 报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
export default router
