const baseUrlFun = new Map()
  .set('dev', '/invoice') // 开发环境
  .set('build', 'http://10.0.17.211:8090/invoice') // 开发环境打包
  .set('sit', 'http://10.0.17.124:8090/invoice') // sit环境
  .set('sit2', 'http://10.0.17.233:8090/invoice') // sit2环境
  .set('uat', 'http://10.0.17.134:8090/invoice') // uat环境
  .set('pro', 'http://invoiceqa.jiandanhui.com/invoice') // 准生产环境
  .set('prod', 'https://invoice.jdh.com.cn/invoice') // 生产环境
const baseUrl = baseUrlFun.get(process.env.VUE_APP_TITLE)
export default baseUrl
