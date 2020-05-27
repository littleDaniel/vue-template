# jdh-invoice-sell

#### 介绍
发票融资

#### 软件架构
Vue + ElementUI

#### 目录结构
```
├── src // 项目源码文件
| ├── assets // 静态文件目录
| | └── css // 样式目录
│ │ │└──  fonts // 字体
│ │ │└──  iconfont // 字体图标
│ │ │└──  index.scss //基础样式
│ │ │└──  sidebar.scss //左侧菜单样式
│ │ │└──  variables.scss //样式变量
│ │ │└──  element-ui.scss //覆盖elementUI样式
| | └── img // 图片
│ ├── common //公共方法
│ │ └── api // 接口目录
│ │ └── directive // 自定义指令目录
│ │ └── filters.js // 过滤方法
│ │ └── auth.js // token值
│ │ └── constants.js // 状态值
│ │ └── fetch.js // 请求拦截/响应拦截
│ │ └── utils.js // 公共方法
│ ├── components // 组件目录
│ │ └── baseComponents // 基础组件目录
│ │ └── pageComponents // 业务组件目录
│ │ └── index.js // 全局自动注册组件
│ ├── layout //项目架构布局
│ ├── router //路由配置
│ ├── store //状态管理 vuex配置目录
│ ├── views //静态.vue文件
│ │ └── commonPages //公共页面
│ │ └── entPages //企业端
│ │ └── mgtPages //运营端
│ ├── App.vue // APP入口文件
│ ├── main.js // 主配置文件
│ ├── permission.js // 全局路由守卫（实现权限路由）
├── vue.config.js // 配置文件(webpack/proxy代理)
├── .env.build // 开发环境配置
├── .env.dev // 开发环境配置(有console打印)
├── .env.pro // 准生产环境配置
├── .env.prod // 生产环境配置
├── .env.sit // sit环境配置
├── .env.test // sit2环境配置
├── .env.uat // uat环境配置

```
#### 外网安装教程(建议不要用 cnpm 安装 会有各种诡异的 bug 可以通过如下操作解决 npm 下载速度慢的问题 )

npm install --registry=https://registry.npm.taobao.org

#### 内网安装依赖

npm install --registry=http://10.0.16.251:4873

#### 本地开发 启动项目

npm run dev

#### 分环境打包
```
npm run build 开发环境
npm run dev 开发环境(有console打印)
npm run pro // 准生产环境
npm run prod // 生产环境
npm run sit // sit环境
npm run test // sit2环境
npm run uat // uat环境
```

## Git提交规范

> 本规范从[vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md)和[angular](https://github.com/angular/angular/blob/master/CONTRIBUTING.md)规范中修改得来。

一个提交信息包含`header`、`body`和`footer`:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

比如:

```
docs(changelog): update changelog to beta.5
```

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

## header

`header`是必须填写的，其内容包含`type`、`scope`和`subject`三个部分:

### type

用于说明本次提交的类别，必须是以下可选类别中的一个:

- `ci`: ci配置文件和脚本的变动;
- `chore`: 构建系统或辅助工具的变动;
- `polish`: 代码或者功能模块的改进和完善;
- `fix`: 代码BUG修复;
- `feat`: 新功能;
- `perf`: 性能优化和提升;
- `refactor`: 仅仅是代码变动，既不是修复BUG也不是引入新功能;
- `style`: 代码格式调整，可能是空格、分号、缩进等等;
- `docs`: 文档变动;
- `test`: 补充缺失的测试用例或者修正现有的测试用例;
- `revert`: 回滚操作;

### scope

影响范围不是必须填写的，其内容可以是任何一个明确的变动地方，比如说某个特定的代码目录或者npm包名等等。

### subject

本次提交目的的简短描述，请尽量概要描述，控制内容的长度:

1. 以动词开头，使用第一人称现在时，比如change，而不是changed或changes;
2. 第一个字母小写;
3. 结尾不加句号(.);

## body

`body`其实和`header`的`Subject`部分的要求是一样的，不同的是`body`内容必须包括本次变动的动机和将此与以前的行为进行对比，`body`部分也不是必须的。

## footer

这部分的内容应该包含任何与*Breaking Changes*相关的信息，与此同时，这部分的内容也可以是GitHub或者GitLab的关闭issue的提交引用，`footer`部分也不是必须的。

## revert

如果本次提交是一次回滚操作，那么必须以`revert:`开头，接下来的内容是要回滚的*commit*的header的内容，`body`部分的格式是`This reverts commit <hash>.`，具体的示例如下:

```
revert: feat(pencil): add 'graphiteWidth' option

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```
