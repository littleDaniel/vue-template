import router, { resetRouter } from './router'
import store from './store'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // progress bar style
import { getCookie } from '@/commoncommom'
// 进度条设置
NProgress.configure({ showSpinner: false })
// 重定向白名单
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  // if (to.matched && to.matched.length > 2 && !store.getters.isTabClick) {
  //   const index = store.getters.cachedViews.indexOf('blank')
  //   if (index > -1) store.dispatch('tagsView/removeCachedViewBlankName', 'blank')
  // }
  // 进度条开始
  NProgress.start()
  // 确定用户是否已登录,jdh-XXX为token存储键名
  const hasToken = getCookie('jdh-XXX')
  // 判断是否有token
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 确定用户是否已获得了他的权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        // 角色必须是对象数组
        // const roles = await store.dispatch('user/getMenuTree')
        if (roles && roles.length) {
          // 根据角色生成可访问路由映射
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // 清空静态路由
          resetRouter()
          // 动态添加可访问路由
          router.addRoutes(accessRoutes)
          // hack 方法，以确保addRoutes是完整的
          // 设置replace: true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
        } else {
          store.commit('permission/SET_ROUTES', [])
          next()
        }
      }
    }
  } else {
    // 在免登录白名单，直接进入
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to, form) => {
  NProgress.done()
})
