/**
 * 获取路由权限Mixin
 */
import router, { resetRouter } from '@/router'
export default {
  methods: {
    async getMenuTree () {
      // 获取权限
      const roles = await this.$store.dispatch('user/getMenuTree')
      if (roles.length) {
        // 根据角色生成可访问路由映射
        const accessRoutes = await this.$store.dispatch('permission/generateRoutes', roles)
        // 清空静态路由
        resetRouter()
        // 动态添加可访问路由
        router.addRoutes(accessRoutes)
        // 刷新页面
        // this.$router.go(0)
      } else {
        this.$store.commit('permission/SET_ROUTES', [])
        // this.$router.go(0)
      }
    }
  }
}
