## 服务端渲染Nuxt

### 服务端渲染 vs 客户端渲染

### 什么是 CSR ?

CSR => client-side-render，即客户端渲染。具体过程如下：

- 用户请求页面，返回页面。此时页面只是模版页面
- 浏览器解析页面代码，读到js代码时，会根据我们所写的接口去请求数据
- 得到返回数据后使用模版（vue/react/ng/art-template）进行渲染
- [网站举例](https://main.m.taobao.com/?sprefer=sypc00)

### 什么是 SSR ?

SSR => server-side-render，即服务器端渲染。具体过程如下：

- 用户请求页面
- 后端取到准备好的数据，渲染到我们自己写的服务器模版（next/nuxt/ejs）中，准备好html结构与相应数据后返回给浏览器

### CSR & SSR 优缺点对比

|      | 优点                       | 缺点                                     |
| :--- | :------------------------- | :--------------------------------------- |
| CSR  | 减轻服务器压力，前后端分离 | 对seo不友好（不利于爬虫爬取）            |
| SSR  | 对seo友好                  | 对服务器性能有一定要求，不利于前后端分离 |

其实在真正开发中通常是 csr 与 ssr 相结合使用，前端使用cdn缓存，后端使用nginx缓存。这样是最优的解决方案。上两张图大家对比理解：



![img](https:////upload-images.jianshu.io/upload_images/2763803-03e5b46f84f14a54.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1000/format/webp)



![img](https:////upload-images.jianshu.io/upload_images/2763803-670c1d0afadc4ce1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1000/format/webp)

### Vue.js 服务器端渲染

#### 安装

```bash
npm init -y
npm install vue vue-server-renderer --save
```

#### 渲染一个 Vue 实例

```js
// 第 1 步：创建一个 Vue 实例
const Vue = require('vue')
const app = new Vue({
  template: `<div>Hello World</div>`
})

// 第 2 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer()

// 第 3 步：将 Vue 实例渲染为 HTML
renderer.renderToString(app, (err, html) => {
  if (err) throw err
  console.log(html)
  // => <div data-server-rendered="true">Hello World</div>
})

// 在 2.5.0+，如果没有传入回调函数，则会返回 Promise：
renderer.renderToString(app).then(html => {
  console.log(html)
}).catch(err => {
  console.error(err)
})
```

#### 与服务器集成

在 Node.js 服务器中使用时相当简单直接，例如 [Express](https://expressjs.com/)：

```bash
npm install express --save
```

------

```js
const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `)
  })
})

server.listen(3000)
```

### Nuxt 框架

[官方文档](https://zh.nuxtjs.org/guide)

简单来说，**Nuxt**就是基于**Vue**的一个应用框架，采用**服务端渲染**，让你的**SPA应用(Vue)**也可以拥有**SEO**

Vue 开发一个单页面应用，相信很多前端工程师都已经学会了，但是单页面应用有一个致命的缺点，就是 SEO 极不友好。除非，vue 能在服务端渲染（ssr）并直接返回已经渲染好的页面，而并非只是一个单纯的 `<div id="app"></div>`。

[Nuxt.js](https://zh.nuxtjs.org/) 就是一个极简的 vue 版的 ssr 框架。基于它，我们可以快速开发一个基于 vue 的 ssr 单页面应用。

#### 安装

Nuxt.js 官方提供了一个模板，可以使用 vue-cli 直接安装。

```
$ vue init nuxt-community/starter-template project-name
```

或者通过

```
npm install npx
npx create-nuxt-app xxx
Project name nuxttest

? Project description My laudable Nuxt.js project
? Author name uncle9
? Choose the package manager Npm
? Choose UI framework None
? Choose custom server framework Express
? Choose Nuxt.js modules Axios
? Choose linting tools (Press <space> to select, <a> to toggle all, <i> to invert selection)
? Choose test framework None
? Choose rendering mode Universal (SSR)
? Choose development tools jsconfig.json (Recommended for VS Code)
```

> 注意： mode 选择 同构 universal

#### 目录结构

```
.
├── README.md
├── assets
├── components
├── layouts
├── middleware
├── node_modules
├── nuxt.config.js
├── package.json
├── pages
├── plugins
├── static
├── store
└── yarn.lock
```

其中：

1. **assets**: 资源文件。放置需要经过 webpack 打包处理的资源文件，如 scss，图片，字体等。

2. **components**: vue组件。这里存放在页面中，可以复用的组件,不支持服务器端的钩子。

3. **layouts**: 布局。页面都需要有一个布局，默认为 default。它规定了一个页面如何布局页面。所有页面都会加载在布局页面中的 `<nuxt />` 标签中。如果需要在普通页面中使用下级路由，则需要在页面中添加 `<nuxt-child />`。该目录名为Nuxt.js保留的，不可更改。在 layout 中我们可以放入一些每个页面都会以用到的组件，比如 header & footer。当然如果你不想使用已生成的 layout 组件，你可以重新创建一个，比如 blank.vue 一般不需要引入 header&footer 的页面可以使用 blank.vue 这个 layout 组件。代码如下：

   ```
   layout: 'blank'
   ```

4. **middleware**: 中间件。存放中间件。可以在页面中调用： `middleware: 'middlewareName'` 。

5. **pages**: 页面。一个 vue 文件即为一个页面。index.vue 为根页面。

   1. 若需要二级页面，则添加文件夹即可。
   2. 如果页面的名称类似于 `_id.vue` （以 `_` 开头），则为动态路由页面，`_` 后为匹配的变量（params）。

   3. 若变量是必须的，则在文件夹下建立空文件 `index.vue`。更多的配置请移步至 [官网](https://zh.nuxtjs.org/guide/routing) 。

6. **plugin**: 插件。用于组织和配置，那些需要在 `根vue.js应用` 实例化之前需要运行的 Javascript 插件，需要配合nuxt.config.js

7. **static**: 静态文件。放置不需要经过 webpack 打包的静态资源。如一些 js, css 库。

8. **store**: Nuxt.js 框架集成了 [Vuex 状态树](http://vuex.vuejs.org/) 的相关功能配置，在 `store` 目录下创建一个 `index.js` 文件可激活这些配置。

9. **nuxt.config.js**: `nuxt.config.js` 文件用于组织Nuxt.js 应用的个性化配置，以便覆盖默认配置。具体配置请移步至 [官网](https://zh.nuxtjs.org/guide/configuration)。



#### 生命周期

**Vue**的生命周期全都跑在**客户端(浏览器)**，而**Nuxt**的生命周期在**服务端(Node)，客户端，甚至两边都在:**





![img](https:////upload-images.jianshu.io/upload_images/5531211-d1a3e5b36ee03f08.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/460/format/webp)

红框内的是Nuxt的生命周期首次运行在服务端，之后运行在vue组件创建之前，黄框内同时运行在服务端&&客户端上，绿框内则运行在客户端

##### nuxtServerInit

请求先到达 nuxtServerInit 方法，图中也表明了适用场景是对 store 操作，函数仅在每个服务器端渲染中运行 且运行一次，只能定义在store的主模板当中

```
// store/index.js

export const actions = {
  nuxtServerInit(store, {app:{$cookies},route,$axios,req,res,redirect}) {

    let user = $cookies.get('user') ? $cookies.get('user') : {err:2,msg:'未登录',token:''};
    // store.dispatch('user/A_UPDATE_USER',user)  user== store/user.js
    store.commit('user/M_UPDATE_USER',user)
  }
}

```

##### middleware

下来请求到达 middleware ，允许您定义一个自定义函数运行在一个页面或一组页面渲染之前。可以运行在全局，或者某个页面组件之前，不会在components组件内部运行

```js
//middleware/auth.js
export default ({app:{$cookies},store,redirect,route,$axios,params,query,req,res})=>{
  
}

//nuxt.conig.js
router: {
  middleware: 'auth' //全局守卫 运行一组页面渲染之前
}

//layouts/a.vue  运行在一个布局之前
middleware(){..}, //定义在内部
middleware:'auth', //定义在外部
  
//pages/a.vue  运行在一个页面之前
middleware(){..}, //定义在内部
middleware:'auth', //定义在外部
  
//中间件执行流程顺序：
//nuxt.config.js->匹配布局->匹配页面
```



##### validate

下来请求到达 validate 方法，在这里可以对 page 组件 component 组件 进行动态路参数的有效性。返回 `true` 说明路由有效，则进入路由页面。返回不是 `true` 则显示 404 页面。

只能在页面组件使用(pages/xx.vue)

```js
validate({ params, query }) {//参数校验，校验失败，则自动跳转到错误页面
  // return /^d+$/.test(params.id) // must be number
  return true;//true、false跳转方向
}
```



##### asyncData & fetch

接下来达到 asyncData & fetch 方法，asyncData() 适用于在渲染组件前获取异步数据,返回数据后合并到data选项内部，fetch() 适用于在渲染页面前填充 vuex 中维护的数据。会在组件每次加载前被调用（在服务端或切换至目标路由之前）,由于是在组件 **初始化** 前被调用的，所以在方法内是没有办法通过 `this` 来引用组件的实例对象。

只能在页面组件使用

```js
//pages/a.vue
async asyncData(context){//页面组件数据预载 需要return 之后会和页面data合并
  let res = await context.$axios({url:'/api/goods/home'})
  return {msg2:'oo',data:res.data}//组件数据 异步的，初始的都在这里生成
}

asyncData ({ params }) {
  return axios.get(`https://my-api/posts/${params.id}`)
    .then((res) => {
      return { title: res.data.title }
    })
}

async fetch(context){
  let res = await context.$axios({url:'/api/goods/home'})
  context.store.commit('XXX',res.data);//状态操作
}
```

##### render

最后进行渲染。将渲染后的页面返回给浏览器，用户在页面进行操作，如果再次请求新的页面，此时只会回到生命周期中的 middlerware 中，而非 nuxtServerInit ，所以如果不同页面间需要操作相同的数据请用 vuex 来维护，render钩子只能定义渲染时的配置，render内部不可以有业务逻辑，也不执行

##### beforeCreate & created

运行在服务端 & 客户端，可以获取到组件this，

##### mounted & updated

运行在客户端，没有keep-alive 那自然activated、deactivated这两个生命周期也没了

##### **没有keep-alive**

由于是服务端渲染，所以不支持组件的**keep-alive**，那自然**activated、deactivated**这两个生命周期**也没了**

##### **不存在Window**

```
<script>
export default {
  asyncData() {
    console.log(window) // 服务端报错
  },
  fetch() {
    console.log(window) // 服务端报错
  },
  created () {
    console.log(window) // undefined
  },
  mounted () {
    console.log(window) // Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
  }
}
</script>
```

#### 后续待补充