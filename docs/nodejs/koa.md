## Koa1

[Koa1 文档](https://github.com/guo-yu/koa-guide)

1. io.js 是以前 Node.js 的一个兼容平台，已经是很老了，现在已经找不到官方文档了。

2. Koa1 是使用 [Generator 函数](https://www.runoob.com/w3cnote/es6-generator.html) 来处理异步回调函数的。

## Koa2

[Koa 中文网](https://koa.bootcss.com/)

1. Koa 体积小，可扩展性强。当需要用到某些功能的时候再去引入相关的中间件。

2. Koa2 使用 [async await](https://www.runoob.com/w3cnote/es6-async.html) 来处理异步回调函数。

3. [koa-router](https://github.com/koajs/router)。

4. **洋葱模型**，通过 [koa-compose](https://github.com/koajs/compose) 这个中间件来实现的。

- 上下文 ctx context

- 操作先进后出

- 有控制**先进后出**的机制 **next()**

- 有提前结束的机制

5. **中间件类型**

- 应用级中间件，所有路由都会经过，并且是最先经过的

- 路由级中间件

- 错误处理中间件，这个是在应用级中间件中进行的，进行错误捕获

- 第三方中间件：koa-bodyparser（处理 post 请求）、koa-static（处理静态资源，启动了一个静态资源服务器）

6. **模版渲染引擎**

首先需要安装 [koa-views](https://www.npmjs.com/package/koa-views) 或者 [co-views](https://www.npmjs.com/package/co-views) 中间件。

- [ejs](https://ejs.bootcss.com/)

- [koa-swig](https://www.npmjs.com/package/koa-swig)


7. **Koa 和 Express 简单比较**

- Express 是基于 [connect](https://www.npmjs.com/package/connect) 实现的，自身封装了路由、视图等功能。大而全的框架。

- Koa 是基于 [co](https://www.npmjs.com/package/co) 实现的，但是本身不包含任何中间件。小而精的框架。