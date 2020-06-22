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

下面是 REPL 环境的常用命令：

![nodejs](../.vuepress/public/assets/image/nodejs/nodejs3.png 'nodejs')