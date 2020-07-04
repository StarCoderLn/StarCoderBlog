BFF 全称是 Backends For Frontends (服务于前端的后端)。

## 构建项目结构

**1. 参考 yii 项目**

首先拷贝一份之前已经完成的作业一，进入项目目录，执行 npm init -y 初始化一个 package.json 文件。之所以要把 yii 项目的内容拷贝过来，是为了借鉴它的项目目录结构。

**2. 删除没用的文件并重命名一些文件夹**

（1）删掉 assets 文件夹下的内容。

（2）删掉 commands 文件夹下的内容，并重命名为 bin。

（3）删掉 mail、runtime、vagrant、vendor 和 web 文件夹及其下面的内容。

（4）删掉 codeception.yml、composer.json、composer.lock、docker-compose.yml、LICENSE.md、yii、yii.bat、Vagrantfile 文件。

（5）新增一个启动文件 app.js。

（6）完成以上操作之后，一个比较成熟的项目目录结构就出来了。

![nodejs](../.vuepress/public/assets/image/nodejs/nodejsyii1.png 'nodejs')

## 实现 MVC 结构

**3. 编写路由 controllers**

参照 yii，在 controllers 文件夹下新建 IndexController.js、ApiController.js、Controller.js 和 index.js 文件，并删掉其他的文件。分别编写内容如下：

```js
// Controller.js
class Controller {
    constructor() {}
}
module.exports = Controller;
```

```js
// IndexController.js
class IndexController extends Controller {
    constructor() {}
    actionIndex() {}
}
```

```js
// ApiController.js
class ApiController extends Controller {
    constructor() {}
    actionIndex() {}
    actionCreate() {}
}
module.exports = ApiController;
```

> 这里推荐一个插件 **TabNine**，这是一个基于机器学习的插件，能够“学习”我们平时的代码习惯，然后在我们编码时给一些友好的提示，方便我们编写代码。

这样，一个基本的路由结构就编写完成了。

**4. 编写配置文件 config**

删掉 config 文件夹下的所有文件，然后新建 index.js 文件。

```js
const config = {};

module.exports = config;
```

**5. 编写数据 models**

删掉 models 文件夹下的所有文件，然后新建 Books.js 文件。这部分专门用来处理数据。

```js
class Books {}
```

**6. 测试文件夹 tests**

删掉 tests 文件夹下的所有内容。

**7. 模版文件夹 views**

删掉 views 文件夹下的所有内容。

**8. 组件文件夹 widgets**

删掉 widgets 文件夹下的所有内容。

## 使用 Koa2 启动项目

**9. 编写启动文件 app.js**

- 需要安装 koa、nodemon。

- 上线的时候需要用到的包就用 --save 或 -S，上线之后不需要用到的包就用 --save-dev 或 -D。

- [pnp](https://www.npmjs.com/package/pnp)

- 热更新工具 [nodemon](https://www.npmjs.com/package/nodemon)，只适用于开发环境。

  注意 nodemon 需要全局安装才能使用，本地安装的话还是一直提示我 nodemon 不是命令。

  ```
  sudo npm install -g nodemon
  ```

- [pm2](https://pm2.keymetrics.io/) 是一个 Node.js 进程管理工具，上线时使用的。

  ```js
  const Koa = require('koa');

  const app = new Koa();

  app.listen(3000, () => {
    console.log('服务启动成功');
  })
  ```

**10. 完善各个文件**

（1）配置文件 config/index.js

需要安装 [lodash](https://www.lodashjs.com/)。

```js
const { extend } = require('lodash');
let config = {};

if (process.env.NODE_ENV === 'development') {
    let localConfig = {
        port: 8081
    };
    config = extend(config, localConfig);
}

if (process.env.NODE_ENV === 'production') {
    let prodConfig = {
        port: 80
    };
    config = extend(config, prodConfig);
}

module.exports = config;
```

（2）启动文件 app.js

```js
const Koa = require('koa');
const { port } = require('./config');
const app = new Koa();

require('./controllers')(app);

app.listen(port, () => {
    console.log('服务启动成功', port);
})
```

（3）package.json

需要安装 [cross-env](https://www.npmjs.com/package/cross-env)。然后添加以下脚本命令：

```
"scripts": {
    "start": "cross-env NODE_ENV=development nodemon app.js"
}
```

**注意，如果脚本命令的名字是 npm 自带的关键字，那么运行的时候就可以直接 “npm 关键字”，比如：npm start；如果不是 npm 自带的关键字，就需要执行 “npm run 自定义的脚本命令名字”**。npm 的关键字有以下这些：

![nodejs](../.vuepress/public/assets/image/nodejs/nodejsyii2.png 'nodejs')

以上脚本配置好之后就可以用 npm start 命令启动项目了。

（4）路由文件

安装 [koa-simple-router](https://www.npmjs.com/package/koa-simple-router)，这个包比 koa-router 更轻量，也够我们使用了。

```js
// controllers/index.js
const router = require('koa-simple-router');

module.exports = (app) => {
    app.use(
        router(_ => {
            _.get('/', (ctx, next) => {
                ctx.body = 'hello';
            })
        })
    );
}
```

做到这里，路由就配置成功了，启动项目并访问 localhost:8081 就可以看到页面输出 hello 了。

继续改造下路由文件的代码。

```js
// controllers/index.js
const router = require('koa-simple-router');
const ApiController = require('./ApiController');
const IndexController = require('./IndexController');
const apiController = new ApiController();
const indexController = new IndexController();

module.exports = (app) => {
    app.use(
        router(_ => {
            _.get('/', indexController.actionIndex);
            _.get('/api/list', apiController.actionIndex);
            _.get('/api/create', apiController.actionCreate);
        })
    );
}
```

```js
// controllers/IndexController.js
const Controller = require('./Controller');
class IndexController extends Controller {
    constructor() {
        super();
    }
    async actionIndex(ctx, next) {
        ctx.body = 'hello';
    }
}

module.exports = IndexController;
```

```js
// controllers/ApiController.js
const Controller = require('./Controller');
class ApiController extends Controller {
    constructor() {
        super();
    }
    async actionIndex(ctx, next) {
        ctx.body = {
            data: 123
        }
    }
    async actionCreate() {}
}
module.exports = ApiController;
```

此时访问 localhost:8081 会看到页面上出现 hello；访问 localhost:8081/api/list 会看到页面上出现 {"data":123}。

## 模版渲染

（5）页面渲染

- 在 views 文件夹下新建 index.html 文件。

- 安装模版中间件 [koa-swig](https://www.npmjs.com/package/koa-swig) ，它的缓存是最好的，渲染很快。

- 修改 app.js、config/index.js、IndexController.js 文件。

```js
// app.js
const Koa = require('koa');
const render = require('koa-swig');
const { port, viewDir, memoryFlag } = require('./config');
const app = new Koa();
const co = require('co');

app.context.render = co.wrap(render({
    root: viewDir,
    autoescape: true,
    cache: memoryFlag,
    ext: 'html',
    writeBody: false
}));

require('./controllers')(app);

app.listen(port, () => {
    console.log('服务启动成功', port);
})
```

```js
// config/index.js
const { extend } = require('lodash');
const { join } = require('path');
let config = {
    viewDir: join(__dirname, '..', 'views'),
};

if (process.env.NODE_ENV === 'development') {
    let localConfig = {
        port: 8081,
        memoryFlag: false,
    };
    config = extend(config, localConfig);
}

if (process.env.NODE_ENV === 'production') {
    let prodConfig = {
        port: 80,
        memoryFlag: 'memory',
    };
    config = extend(config, prodConfig);
}

module.exports = config;
```

```js
// IndexController.js
const Controller = require('./Controller');
class IndexController extends Controller {
    constructor() {
        super();
    }
    async actionIndex(ctx, next) {
        ctx.body = await ctx.render('index');
    }
}

module.exports = IndexController;
```

此时启动项目，访问 http://localhost:8081/，会看到页面显示这个：

![nodejs](../.vuepress/public/assets/image/nodejs/nodejsyii3.png 'nodejs')

如果看到页面上显示 {} 或者 ok，要么就是模版位置不对，要么就是异步引起的，即没有等待数据回来就去渲染了，所以返回空标识。因此解决方法就是 IndexController.js 文件中的方法加上 await。重新访问就可以看到显示正常了。

完成以上这些，整个项目的后端基础就都弄好了。接下来可以开始做真假路由的混用了。

## 真假路由

**11. 真假路由的混用**

（1）全局安装 [vue-cli](https://cli.vuejs.org/)，安装 vue cli 3.x

```
sudo cnpm install -g @vue/cli
```

 并使用它创建一个项目。项目创建的时候只需要 Babel 和 Router 就行了。

（2）将创建好的 vue 项目跟原来的项目放在同个工作区中

![nodejs](../.vuepress/public/assets/image/nodejs/nodejsyii4.png 'nodejs')

然后修改 HelloWorld.vue 的内容，并启动 vue 项目。启动之后访问是正常的。

（3）接下来执行 npm run build 命令，构建下项目。构建完成后，将生成的 dist 文件夹的 index.html 文件复制到 views 文件夹中，覆盖掉原来的文件。再把 dist 中的其他文件都复制放到 assets 文件夹中。这样就可以将 hello-world 项目从工作区移除了，我们的 nodejs-basic 项目已经齐全了。

（4）重新启动 nodejs-basic 项目，却发现页面上找不到静态资源。所以还得进行处理。这就需要用到 [koa-static](https://www.npmjs.com/package/koa-static) 了。

- 首先安装 koa-static。

- 然后修改下 app.js 和 config/index.js。

```js
// app.js

const Koa = require('koa');
const render = require('koa-swig');
const serve = require('koa-static');
const co = require('co');
const { port, viewDir, staticDir, memoryFlag } = require('./config');
const app = new Koa();

app.use(serve(staticDir));

app.context.render = co.wrap(render({
    root: viewDir,
    autoescape: true,
    cache: memoryFlag,
    ext: 'html',
    writeBody: false
}));

require('./controllers')(app);

app.listen(port, () => {
    console.log('服务启动成功', port);
})
```

```js
// config/index.js

const { extend } = require('lodash');
const { join } = require('path');
let config = {
    viewDir: join(__dirname, '..', 'views'),
    staticDir: join(__dirname, '..', 'assets')
};

if (process.env.NODE_ENV === 'development') {
    let localConfig = {
        port: 8081,
        memoryFlag: false,
    };
    config = extend(config, localConfig);
}

if (process.env.NODE_ENV === 'production') {
    let prodConfig = {
        port: 80,
        memoryFlag: 'memory',
    };
    config = extend(config, prodConfig);
}

module.exports = config;
```

- 最后重新启动项目，就可以正常访问了。而且访问我们之前定义好的接口路由也是可以的：localhost:8081/api/list。这样我们就把一个前端项目整合到我们搭建好的后端框架里来了。

![nodejs](../.vuepress/public/assets/image/nodejs/nodejsyii5.png 'nodejs')

但是，现在有个问题，about 路由是假的。如果直接浏览器访问 http://localhost:8081/about 会发现 404，虽然我们切换的时候是没问题的。

- 解决这个问题需要安装 [koa2-connect-history-api-fallback](https://www.npmjs.com/package/koa2-connect-history-api-fallback)。然后修改 app.js 文件。

```js
const Koa = require('koa');
const render = require('koa-swig');
const serve = require('koa-static');
const co = require('co');
const { historyApiFallback } = require('koa2-connect-history-api-fallback');
const { port, viewDir, staticDir, memoryFlag } = require('./config');
const app = new Koa();

app.use(historyApiFallback({ index: '/', whiteList: ['/api'] })); // 一定要放在 router 之前

app.use(serve(staticDir));

app.context.render = co.wrap(render({
    root: viewDir,
    autoescape: true,
    cache: memoryFlag,
    ext: 'html',
    writeBody: false
}));

require('./controllers')(app);

app.listen(port, () => {
    console.log('服务启动成功', port);
})
```

再重新访问就不会有刚刚的问题了。

:bell: **我们也可以把 controllers/Index.js 文件中的根路由改成 '/index.html'，这样就成了伪静态页面。**

```js
const router = require('koa-simple-router');
const ApiController = require('./ApiController');
const IndexController = require('./IndexController');
const apiController = new ApiController();
const indexController = new IndexController();

module.exports = (app) => {
    app.use(
        router(_ => {
            _.get('/index.html', indexController.actionIndex);
            _.get('/api/list', apiController.actionIndex);
            _.get('/api/create', apiController.actionCreate);
        })
    );
}
```

![nodejs](../.vuepress/public/assets/image/nodejs/nodejsyii6.png 'nodejs')

:bell: **如何区分真假路由？**

右键检查框架源代码，如果是像下面这种只有一个 div，里面是空的，就是假路由。如果是有具体的 dom 元素，就是真路由。

![nodejs](../.vuepress/public/assets/image/nodejs/nodejsyii7.png 'nodejs')

到此，就完成了作业二的前两步。

**12. 把项目改成都用真路由**

（1）把刚刚引入的 koa2-connect-history-api-fallback 注释掉。

（2）把已有的 index.html 文件的名字改成别的，比如 index.back.html。然后新建一个 index.html 文件。

（3）到下面这个开源库中找一个 vue 的资源链接。并在 index.html 文件中引用它。

> [Staticfile CDN](http://www.staticfile.org/) 收录了很多优秀的开源库，并免费为之提供 CDN 加速服务，使之有更好的访问速度和稳定的环境。

（4）在 assets 文件夹中新建 back 文件夹，然后把 assets 文件夹下的东西都移到这里面。然后在 assets 文件夹中新建 scripts 文件夹，在 scripts 里面再建一个 index.js。并且在 index.html 中引用它。

（5）从 vue 官网上随便复制一段代码下来，放到 index.html 和 index.js 文件中。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app-6">
        <p>{{ message }}</p>
        <input v-model="message">
    </div>
    <script src="https://cdn.staticfile.org/vue/2.6.11/vue.min.js"></script>
    <script src="/scripts/index.js"></script>
</body>
</html>
```

```js
var app6 = new Vue({
    el: '#app-6',
    data: {
      message: 'Hello Vue!'
    }
})
```

访问页面可见：

![nodejs](../.vuepress/public/assets/image/nodejs/nodejsyii8.png 'nodejs')

（6）自定义我们自己后端发送的数据的渲染形式

这个时候我们就可以自己通过后端去发送数据了。

```js
// IndexController.js

const Controller = require('./Controller');
class IndexController extends Controller {
    constructor() {
        super();
    }
    async actionIndex(ctx, next) {
        ctx.body = await ctx.render('index', {
            data: '后端数据'
        });
    }
}

module.exports = IndexController;
```

但是此时刷新页面发现我们后端发送的数据没有在前端显示，这是因为 swig 的模版渲染方式跟 vue 的模版渲染方式冲突了。解决这个问题的方法是我们需要去自定义后端发送的数据的渲染形式。

首先在 app.js 中配置：

```js
app.context.render = co.wrap(render({
    root: viewDir,
    autoescape: true,
    cache: memoryFlag,
    ext: 'html',
    varControls: ['[[', ']]'],
    writeBody: false
}));
```

然后在 index.html 中写上：

```html
<div id="app-6">
    <p>[[ data ]]</p>
    <p>{{ message }}</p>
    <input v-model="message">
</div>
```

此时，重新刷新页面就可以看到前端数据和后端数据都成功渲染出来了。

![nodejs](../.vuepress/public/assets/image/nodejs/nodejsyii9.png 'nodejs')

查看框架的源代码可以看到，此时已经不是只有一个 div 元素了，具体的 dom 元素都有。现在的路由就是真路由了。

![nodejs](../.vuepress/public/assets/image/nodejs/nodejsyii10.png 'nodejs')

刷新的时候会发现 vue 渲染出来的数据会闪一下，体验不好，但是我们自己用后端渲染出来的数据就不会有这个问题。

其实这就是所谓的 SSR，由服务端来渲染数据。SSR 其实在很早之前就有了，类似以前的 jsp。

## 处理不同浏览器对 ES module 的支持

**13. 使用 Babel 编译 systemjs 加载**

[systemjs](https://github.com/systemjs/systemjs) 是一个模块加载器，现在的微前端框架都是用它完成模块化的。

（1）新建 libs 文件夹。

（2）在 scripts 文件夹下新建 data.js。

```js
const data = 'shenzhen';
export default data;
```

（3）在 index.html 中引用它，注意要加上 `type="module"`，来声明这个脚本是一个模块。

```html
<script type="module" src="/scripts/data.js"></script>
```

刷新页面发现没问题。

:bell: **动态加载模块**

动态加载模块就是仅在需要时动态加载模块，而不必预先加载所有模块。它将 `import()` 作为函数调用，并返回一个 promise。

接着再改下 index.html，让它动态加载模块。

```html
<script type="module">
    import('./scripts/data.js').then((_) => {
        console.log(_);
    })
</script>
```

浏览器中会打印出以下结果，我们导出的数据就在 default 属性中：

![nodejs](../.vuepress/public/assets/image/nodejs/nodejsyii11.png 'nodejs')

因此，如果浏览器支持 module，我们可以直接用以上这种方式导入文件获取数据。

有的浏览器就不支持 module：

```html
<script type="nomodule"></script>
```

因为这里的浏览器是支持 module 的，所以 type="nomodule" 里的代码不执行。为了演示 nomodule 如何处理，这里暂时用 module 代替 nomodule。

```html
<script type="module" src="https://cdn.staticfile.org/systemjs/6.3.3/system.js"></script>
<script type="module">
    import('./scripts/data_bundle.js').then((_) => {
        console.log(_);
    })
</script>
```

（4）在 package.json 中添加以下脚本命令：

```
"build": "babel ./assets/scripts/data.js -o ./assets/scripts/data_bundle.js"
```

（5）安装 @babel/cli 和 @babel/core。

```
npm install @babel/cli @babel/core @babel/preset-env --save-dev
```

（6）新建 .babelrc 文件

```
{
    "presets": ["@babel/preset-env"]
}
```

（7）执行 npm run build 命令，就可以看到在 scripts 文件夹下生成了 data_bundle.js 文件。

```js
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var data = 'shenzhen';
var _default = data;
exports["default"] = _default;
```

我们发现，babel 直接编译成了 exports 的，这样肯定不行，浏览器识别不了。所以需要用 systemjs 来加载。

（8）安装 [@babel/plugin-transform-modules-systemjs](https://www.npmjs.com/package/@babel/plugin-transform-modules-systemjs)

```
npm install @babel/plugin-transform-modules-systemjs --save-dev
```

然后在 .babelrc 文件中添加：

```
{
    "presets": ["@babel/preset-env"],
    "plugins": ["@babel/plugin-transform-modules-systemjs"]
}
```

（9）重新执行命令 npm run build ，可以发现 data_bundle.js 文件的内容变了。

```js
"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var data;
  return {
    setters: [],
    execute: function () {
      data = 'shenzhen';

      _export("default", data);
    }
  };
});
```

启动项目，浏览器中也能正常访问了。

（10）一般项目中都需要编译两份 js，一份给支持 module 的浏览器使用，一份给不支持 module 的浏览器使用。才能很好的支持 ES Module。最终 index.html 中应该是这样的：

```html
<script type="module">
    import('./scripts/data.js').then((_) => {
        console.log(_);
    })
</script>
<script type="nomodule" src="https://cdn.staticfile.org/systemjs/6.3.3/system.js"></script>
<script type="nomodule">
    import('./scripts/data_bundle.js').then((_) => {
        console.log(_);
    })
</script>
```