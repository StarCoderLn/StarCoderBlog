[Node.js 教程](https://www.runoob.com/nodejs/nodejs-tutorial.html)

## :pen: 创建一个 http 服务

```js
var http = require('http');

http.createServer(function(req, res) {
    // 定义 HTTP 头
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // 发送响应的数据
    res.end('Hello World!\n');
}).listen(8000);

// 服务运行后输出一行信息，证明服务已启动
console.log('server is running...')
```

启动服务之后，在浏览器中访问 localhost:8000 就可以看到页面上显示 Hello World!。

## :pen: REPL 环境

Node.js 的 REPL 环境就是指当我们在终端输入 node 命令回车之后进入的环境。

![nodejs](../.vuepress/public/assets/image/nodejs/nodejs2.png 'nodejs')

在这个环境中可以正常编写代码。退出这个环境有三种方式：按两次 ctrl + c 或者执行 .exit 命令或者按 ctrl + d。

![nodejs](../.vuepress/public/assets/image/nodejs/nodejs3.png 'nodejs')

## :pen: Node.js 回调机制

**1. 什么是回调**

- 函数调用方式分为三类：同步调用、回调和异步调用。

- 回调是一种双向调用模式。

- 可以通过回调函数来实现回调。

**2. 阻塞和非阻塞**

- 阻塞和非阻塞关注的是程序在等待调用结果（消息，返回值）时的状态。

- 阻塞就是做不完不准回来。

- 非阻塞就是你先做，我先看看有其他事没有，做完了告诉我一声。

阻塞代码

```js
var fs = require('fs');

// 读取文件阻塞时使用 readFileSync 方法，非阻塞使用 readFile() 方法
var data = fs.readFileSync('test.html');

// 加上 toString 才能够正确输出文件里的内容而不是16进制码
console.log(data.toString());
```

非阻塞代码

```js
var fs = require('fs');

var data = fs.readFile('test.html', function(err, data) {
    // 容错处理
    if (err) {
        return console.error(err);
    }
    console.log(data.toString());
});

console.log('程序执行完毕！');
```

输出结果是先输出“程序执行完毕！”，再输出文件内容，这就体现了非阻塞代码的特点。

## :pen: Node.js 事件驱动机制

[Node.js 事件循环](https://www.runoob.com/nodejs/nodejs-event-loop.html)

[Node.js EventEmitter](https://www.runoob.com/nodejs/nodejs-event.html)

**1. 事件驱动模型**

要理解下图的事件驱动模型，首先要先明白 Node.js 的运行机制。

- Node.js 本身是单线程、单进程的，需要通过事件或者回调来实现并发效果。因此，Node.js 因为不像多线程那样需要做很多额外的工作，所以性能比较高。

- Node.js 中每一个 api 都是异步执行的，并且是各自作为一个独立的线程在运行，使用异步函数调用我们就可以使用这种机制来进行并发处理。Node.js 中几乎所有的事件机制都是依据观察者模式来是实现的。

![nodejs](../.vuepress/public/assets/image/nodejs/nodejs4.png 'nodejs')

这个模型也叫做非阻塞时 IO 或 事件驱动的 IO 模型。

**2. 事件处理代码流程**

（1）引入 `events` 对象，创建 `eventEmitter` 对象。

（2）绑定事件处理程序。

（3）触发事件。

```js
// 引入 events 模块并创建 eventEmitter 对象
var events = require('events');
var eventEmitter = new events.EventEmitter();

// 绑定事件处理函数
var connectHandler = function connected() {
    console.log('connected 被调用！');
}
eventEmitter.on('connection', connectHandler); // 完成事件绑定

// 触发事件
eventEmitter.emit('connection');

console.log('程序执行完毕！');
```

## :pen: Node.js 模块化

[Node.js模块系统](https://www.runoob.com/nodejs/nodejs-module-system.html)

**1. 模块化的概念和意义**

- 为了让 Node.js 的文件可以相互调用，Node.js 提供了一个简单的模块系统。

- 模块是 Node.js 应用程序的基本组成部分。

- **文件和模块是一一对应的。一个 Node.js 文件就是一个模块**。

- 这个文件可能是 JavaScript 代码、JSON 或者编译过的 C/C++ 扩展。

- Node.js 存在4类模块（**原生模块和3种文件模块**）。

**2. Node.js 模块加载流程**

![nodejs](../.vuepress/public/assets/image/nodejs/nodejs5.png 'nodejs')

**3. Node.js 的模块加载方式**

- 从文件模块缓存区中加载。

- 从文件中加载。

- 从原生模块缓存区中加载。

- 从原生模块中加载。


**4. require 方法加载模块**

require 方法接受以下几种参数的传递：

- http、fs、path 等原生模块。

- ./mod 或 ../mod，相对路径的文件模块。

- /pathtomodule/mod，绝对路径的文件模块。

- mod，非原生模块的文件模块。

```js
// test.js
function Hello() {
    var name;
    this.setName = function(argName) {
        name = argName;
    }
    this.sayHello = function() {
        console.log('Hello ' + name);
    }
}
module.exports = Hello;
```

```js
// main.js
var Hello = require('./test');

hello = new Hello();
hello.setName('Shen Zhen');
hello.sayHello();
```

## :pen: Node.js 函数

**1. 函数概念**

- 在 JavaScript 中，一个函数可以作为另一个函数的参数。

- 我们可以先定义一个函数，然后传递，也可以在传递参数的地方直接定义函数。

- Node.js 中函数的使用与 JavaScript 类似。

```js
function say(word) {
    console.log(word);
}
function execute(someFunction, value) {
    someFunction(value);
}
execute(say, 'Hello');
```

```js
function execute(someFunction, value) {
    someFunction(value);
}
execute(
    function say(word) { 
        console.log(word); 
    }, 
    'Hello'
);
```

## :pen: Node.js 路由

[Node.js 路由](https://www.runoob.com/nodejs/nodejs-router.html)

下面的例子展示了如何根据访问不同的路由来做不同的事情。

```js
// http.js
var http = require("http");
var url = require("url");
 
function start(route) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    route(pathname, response);
  }
 
  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}
 
exports.start = start;
```

```js
// router.js
function route(pathname, response) {
    if (pathname == '/') {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Hello World");
        response.end();
    } else if (pathname == '/index/home') {
        response.end('/index/home');
    } else {
        response.end('404');
    }
}
   
exports.route = route;
```

```js
// app.js
var server = require("./http");
var router = require("./router");
 
server.start(router.route);
```

路由有 get/post 请求，并且这两种请求返回的结果是不一样的。[Node.js GET/POST请求](https://www.runoob.com/nodejs/node-js-get-post.html)

## :pen: Node.js 全局方法和工具

[Node.js 全局对象](https://www.runoob.com/nodejs/nodejs-global-object.html)

[Node.js 常用工具](https://www.runoob.com/nodejs/nodejs-util.html)

推荐一个很全的 JavaScript 工具库：[Underscore.js](https://underscorejs.bootcss.com/)，它提供了100多个函数。

## :pen: Node.js 文件系统

[Node.js 文件系统](https://www.runoob.com/nodejs/nodejs-fs.html)

[Node.js Stream(流)](https://www.runoob.com/nodejs/nodejs-stream.html)

[Node.js Buffer(缓冲区)](https://www.runoob.com/nodejs/nodejs-buffer.html)

应用场景：比如要做一个文件上传系统的时候就需要用到 fs。