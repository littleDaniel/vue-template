const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  isTabClick: state => state.tagsView.isTabClick,
  permissionRoutes: state => state.permission.addRoutes
}
export default getters
