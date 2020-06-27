[Node.js Express 框架](https://www.runoob.com/nodejs/nodejs-express-framework.html)

## 安装 express

```
sudo npm install express --save-dev
```

## 热部署工具——supervisor

当修改代码时自动重启服务，不用每次都手动重启。需要全局安装 supervisor。

```
sudo npm install -g supervisor
```

安装完成后需要使用以下命令来执行文件，假设文件名为 app.js。

```
supervisor app.js
```

## express 框架基本使用

**1. req 获取参数的两种方式**

```js
app.get('/', function (req, res) {
    res.send('Hello ' + req.query.username);
})

// 浏览器访问格式
http://localhost:8081/?username=admin
```

```js
app.get('/index/:id', function (req, res) {
    res.send('Hello ' + req.params.id);
})

// 浏览器访问格式
http://localhost:8081/index/123
```

**2. res 最常用的方法**

- res.json()

- res.send()

- res.redirect()

- res.render()

**3. 定义路由的方式**

- get

- post

**4. RESTful 风格**

[Node.js RESTful API](https://www.runoob.com/nodejs/nodejs-restful-api.html)

最简单的理解就是同一个请求既能设置成 get，又能设置成 post，能做不同的事情。

Express 框架就有实现到了这一点。

```js
//  主页输出 "Hello World"
app.get('/', function (req, res) {
   console.log("主页 GET 请求");
   res.send('Hello GET');
})

//  POST 请求
app.post('/', function (req, res) {
   console.log("主页 POST 请求");
   res.send('Hello POST');
})
```

**5. 使用 express.static 中间件设置静态文件**

[利用 Express 托管静态文件](https://www.expressjs.com.cn/starter/static-files.html)

```js
var express = require('express');
var app = express();

app.use('/public', express.static('public'));

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
})
```

新建 public 文件夹，把一些 css 和 js 文件等静态资源放到这个文件夹下，浏览器中可以这样访问这些静态资源文件：

```
http://localhost:8081/public/scripts/index.js

http://localhost:8081/public/stylesheets/index.css
```

也可以不加 public 这一层：

```js
app.use(express.static('public'));
```

访问的时候：

```
http://localhost:8081/scripts/index.js

http://localhost:8081/stylesheets/index.css
```

效果都是一样的。

执行效果如下：

![express](../.vuepress/public/assets/image/nodejs/express1.png 'express')

![express](../.vuepress/public/assets/image/nodejs/express2.png 'express')


**6. 访问页面**

新建一个 views 文件夹，这是放置模版文件的目录，并在其下新建一个 index.html。

（1）下面这段代码能够让我们在浏览器中访问页面并看到 css 和 js 文件的执行效果。

```js
var express = require('express');
var app = express();

app.use('/public', express.static('public'));

app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/views/" + "index.html" );
})

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
})
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="public/stylesheets/index.css">
    <title>测试首页</title>
</head>
<body>
    Hello
    <script type="text/javascript" src="public/scripts/index.js"></script>
</body>
</html>
```

浏览器中访问 http://localhost:8081/index.html，就可以看到 index.html 的内容了。

![express](../.vuepress/public/assets/image/nodejs/express3.png 'express')

（2）用 Node.js 实现前台提交表单信息然后直接跳转到百度去查询。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="public/stylesheets/index.css">
    <title>测试首页</title>
</head>
<body>
    Hello
    <form action="/index" method="post">
        <input type="text" name="data">
        <input type="submit" value="提交">
    </form>
    <script type="text/javascript" src="public/scripts/index.js"></script>
</body>
</html>
```

```js
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use('/public', express.static('public'));

app.get('/index', function (req, res) {
    res.sendFile( __dirname + "/views/" + "index.html" );
})
app.post('/index', urlencodedParser, function(req, res) {
    res.redirect('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=' + req.body.data + '&fenlei=256&rsv_pq=bba9db9c0003e114&rsv_t=bde2GgxPHHcXgoy%2FqR3TTpIVnCZChcamgibtQ%2BbOWk6H8gXMIgJjpX2iCxk&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_sug3=2&rsv_sug1=2&rsv_sug7=101&rsv_sug2=0&rsv_btype=i&inputT=249&rsv_sug4=1043');
})
 
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
})
```

在浏览器中访问 localhost:8081/index 就可以看到页面，输入信息点提交之后就会跳转百度进行查询。注意，html 中表单输入框的 name 要跟 req.body 的参数名一致，比如 req.body.data，那么 name 就应该为 data。

## express 中间件

[Using middleware](https://www.expressjs.com.cn/guide/using-middleware.html)

1. Express 是一个自身功能极简，完全是由**路由**和**中间件**构成的 web 开发框架：从本质上来说，**一个 Express 应用就是在调用各种中间件**。

2. 中间件是一个函数，它可以访问请求对象（req），响应对象（res），和 web 应用中处于请求-响应循环流程中的中间件，一般被命名为 `next` 的变量。

3. 中间件的功能包括：

- 执行任何代码。

- 修改请求和响应对象。

- 终结请求-响应循环。

- 调用堆栈中的下一个中间件。

如果当前中间件没有终结请求-响应循环，则必须**调用 next() 方法**将控制权交给下一个中间件，否则请求就会挂起。

4. Express 应用可使用如下几种中间件：

- 应用级中间件

- 路由级中间件

- 错误处理中间件

- 内置中间件

- 第三方中间件

**（1）应用级中间件**

应用级中间件使用 `app.use()` 和 `app.METHOD()` 绑定到 app 对象，其中 METHOD 是需要处理 HTTP 请求的方法，例如 get、post、put 等等，全部小写。

**（2）路由级中间件**

它和应用级中间件一样，只是它绑定的对象为 express.Router()。它没应用级中间件那么复杂，只有跟路由相关的 api，也叫做 mini app 中间件。

**（3）错误处理中间件**

和其他中间件定义类似，只是要使用4个参数，而不是3个，(err, req, res, next)。

**（4）内置中间件**

从 4.x 版本开始，Express 已经不再依赖 Connect 了。Express 以前内置的中间件现在已经全部单独作为模块安装使用了。

Express 内置的中间件有：

- [express.static](https://www.expressjs.com.cn/en/4x/api.html#express.static)

- [express.json](https://www.expressjs.com.cn/en/4x/api.html#express.json)

- [express.urlencoded](https://www.expressjs.com.cn/en/4x/api.html#express.urlencoded)

**（5）第三方中间件**

通过使用第三方中间件从而为 Express 应用增加更多的功能。

安装所需功能的 node 模块，并在应用中加载，可以在应用级加载，也可以在路由级加载。

## express 路由

[Routing](https://www.expressjs.com.cn/guide/routing.html)

路由其实就是 controller。一个 controller 对应多个 action。

必经路由，访问任何路由的时候都会经过它。

```js
app.get('*', function(req, res, next) {
    console.log('必经路由')
    next()
})
```

## express 错误处理

[Error Handling](https://www.expressjs.com.cn/guide/error-handling.html)

一般在代码最后才会定义错误处理，不然后面的错误就捕捉不到了。

实际开发中需要借助一些处理日志记录的库，比如错误日志处理中间件：[log4j.js](https://www.npmjs.com/package/log4j.js)

## express 模版引擎

[Using template engines with Express](https://www.expressjs.com.cn/guide/using-template-engines.html)

推荐使用 [swig](http://www.iqianduan.net/blog/how_to_use_swig)