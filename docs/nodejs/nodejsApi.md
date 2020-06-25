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

[Node.js Buffer(缓冲区)](https://www.runoob.com/nodejs/nodejs-buffer.html)

应用场景：比如要做一个文件上传系统的时候就需要用到 fs。

### :blue_book: 文件基本知识

- **文件权限位 mode**

  [Linux 文件基本属性](https://www.runoob.com/linux/linux-file-attr-permission.html)

  windows 文件默认可读可写不可执行，0o666

- **文件标识位 flag**

  r: 读取

  w: 写入

  s: 同步

  +: 增加相反操作

  x: 排它方式

![nodejs](../.vuepress/public/assets/image/nodejs/nodejs6.png 'nodejs')

- **文件描述符 fd**

  Node.js 中的文件描述符为了抽象不同操作系统间的差异，通过数值的方式来分配，递增的，并且是从3开始的，因为0、1、2分别被 process.stdin、process.stdout、process.stderr 占用了。

  文件描述符是一个文件的唯一标识。

### :blue_book: 文件基本操作

**1. 文件读取**

```js
const fs = require('fs');
const buf = fs.readFileSync('test.html', { encoding: 'utf-8' });
console.log(buf);
```

```js
const fs = require('fs');
fs.readFile('test.html', { encoding: 'utf-8' }, (err, data) => {
    console.log(data);
})
```

readFile / readFileSync 会一次性将所有文件内容读取到缓存中，如果文件过大，缓存不足时，就可能会出现文件内容丢失的情况。因此，对于大文件，一般不推荐使用这个方法，而是使用 read 方法多次读取到 buffer 中。

![nodejs](../.vuepress/public/assets/image/nodejs/nodejs7.png 'nodejs')

```js
const buf = Buffer.alloc(6);

fs.open('data.txt', 'r', (err, fd) => {
    // 一个汉字3个字节
    fs.read(fd, buf, 0, 3, 0, (err, bytesRead, buffer) => {
        console.log(bytesRead); // 实际读取的字节数
        console.log(buffer.toString()); // 实际读取的内容
    })
})
```

**2. 文件写入**

- 普通写入：后面写入的内容会覆盖掉已有的内容。

```js
const fs = require('fs');
fs.writeFileSync('data.txt', '同步写入');
```

```js
const fs = require('fs');
fs.writeFile('data.txt', '写入的内容', { encoding: 'utf-8' }, err => {});
```

- 追加写入：后面写入的内容追加到已有内容之后。

```js
const fs = require('fs');
fs.appendFileSync('data.txt', '追加写入');
```

```js
const fs = require('fs');
fs.appendFile('data.txt', '追加写入', err => {});
```

- 拷贝写入：拷贝一个文件的内容到另一个文件里。

```js
const fs = require('fs');
fs.copyFileSync('data.txt', 'datacopy.txt');
```

```js
const fs = require('fs');
fs.copyFile('data.txt', 'datacopy.txt', err => {});
```

- 用读写操作模拟拷贝文件

```js
function copy(file, target) {
    const data = fs.readFileSync(file);
    fs.writeFileSync(target, data);
}
copy('data.txt', 'data1.txt');
```

- 多次写入 write

![nodejs](../.vuepress/public/assets/image/nodejs/nodejs8.png 'nodejs')

```js
const buf = Buffer.from('深圳大学');

fs.open('data.txt', 'r+', (err, fd) => {
    fs.write(fd, buf, 0, 6, 3, (err, size, buf) => {
        fs.close(fd, err => {
            console.log('写入成功，关闭文件！');
        })
    })
})
```

**3. 打开文件**

```js
// 打印的文件描述符是递增的
fs.open('data.txt', 'r', (err, fd) => {
    console.log(fd);
    fs.open('data1.txt', 'r', (err, fd) => {
        console.log(fd);
    })
})
```

**4. 关闭文件**

```js
fs.open('data.txt', 'r', (err, fd) => {
    fs.close(fd, err => {
        console.log('关闭成功！');
    })
})
```

**5. 删除文件**

```js
fs.unlinkSync('data.txt');
```

```js
fs.unlink('data.txt', err => {});
```

### :blue_book: 文件目录基本操作

**1. 查看目录权限**

```js
try {
    fs.accessSync('./');
    console.log('可读可写');
} catch(e) {
    console.log('不可访问');
}
```

```js
fs.access('./', err => {
    if (err) {
        console.log('不可访问');
    } else {
        console.log('可读可写');
    }
})
```

**2. 获取文件目录的信息**

```js
let file = fs.statSync('dir/dir.txt');
console.log(file);
```

```js
let file = fs.stat('dir/dir.txt', (err, data) => {
    console.log(data);
});
```

**3. 创建目录**

![nodejs](../.vuepress/public/assets/image/nodejs/nodejs9.png 'nodejs')

创建目录时需要注意的一点就是要保证创建的目录的上一级目录是存在的，比如这里的 dir 目录必须存在，否则会报错。

我们也可以添加 recursive: true 参数，不管创建的目录 dir 是否存在。

```js
fs.mkdirSync('dir/a');
```

```js
fs.mkdir('dir/a', { recursive: true }, err => {});
```

**4. 读取目录**

```js
console.log(fs.readdirSync('dir/a')); // []
```

```js
fs.readdir('dir/a', (err, files) => {});
```

**5. 删除目录**

```js
fs.rmdirSync('dir2/a');
```

```js
fs.rmdir('dir2/a', err => {});
```

### :blue_book: 例子

配合 promise 和 async/await 读取目录下的所有文件，并进行操作。

```js
const fs = require('fs');
const path = require('path');

function getFile() {
    return new Promise((resolve, reject) => {
        const filePath = path.resolve(__dirname, './dir');
        fs.readdir(filePath, (err, files) => {
            const fileArr = [];
            files.forEach(fileName => {
                fileArr.push('/dir/' + fileName);
            })
            resolve(fileArr);
        })
    })
}

async function getFilePath() {
    const result = await getFile();
    return result;
}

function insertDB() {
    getFilePath().then(res => {
        // 在这里可以做一些存进数据库的操作
        console.log(res);
    })
}

insertDB();
```

## :pen: Node.js Stream(流)

[Node.js Stream(流)](https://www.runoob.com/nodejs/nodejs-stream.html)

**1. 为什么要使用流？**

流是逐块（chunk）读取数据的，适合读取大数据量的大文件。因此，能够提高内存效率和时间效率。

```js
const fs = require('fs');
// 创建可读流
const rs = fs.createReadStream('demo.mp4');
// 创建可写流
const ws = fs.createWriteStream('copt.mp4');

rs.on('data', chunk => {
    ws.write(chunk);
});

rs.on('end', () => {
    ws.end();
});
```

但是上面这段代码可能会有问题，因为可读流和可写流的速度可能不一致，比如现在已经读取了200M的数据，目前只写入了100M的数据，但是读取还是在进行，就可能会导致数据丢失。正常的操作应该是读取一段写完后，再读取下一段。所以，为了保持读写速度一致，需要用到**管道流 pipe**。

```js
const fs = require('fs');
// 创建可读流
const rs = fs.createReadStream('demo.mp4');
// 创建可写流
const ws = fs.createWriteStream('copt.mp4');

// pipe 只是可读流的方法，所以不能这么用 ws.pipe(rs);
rs.pipe(ws);
```

**2. 流的类型**

- 可读流 Readable

- 可写流 Writable

- 双工流 Duplex

- 转换流 Transform

**所有的 Stream 对象都是 EventEmitter 的实例**。常用的事件如下：

- data - 当有数据可读时触发。

- end - 没有更多的数据可读时触发。

- error - 在接收和写入过程中发生错误时触发。

- finish - 所有数据已被写入到底层系统时触发。

**3. 例子演示**

（1）流的缓冲区默认是**16k(1k（KB） 等于 1024 字节（B）)**，这个大小可以通过 highWaterMark 来改。

```js
const fs = require('fs');
// 创建可读流
const rs = fs.createReadStream('data.txt', {
    encoding: 'utf-8', // 设置编码格式
    highWaterMark: 6 // 设置缓冲区大小，单位是字节 bytes
});

rs.on('data', chunk => {
    console.log(chunk);
});

rs.on('end', () => {
    console.log('读取完毕！');
});
```

执行结果如下：

![nodejs](../.vuepress/public/assets/image/nodejs/nodejs10.png 'nodejs')

可以看到，读取了两次，每次读取两个汉字，共6个字节。

（2）监听常见的事件。

```js
const fs = require('fs');
// 创建可读流
const rs = fs.createReadStream('data.txt', {
    encoding: 'utf-8',
    highWaterMark: 6 // 设置缓冲区大小，单位是字节 bytes
});

rs.on('open', () => {
    console.log('打开文件');
});

rs.on('data', chunk => {
    console.log(chunk);
});

rs.on('end', () => {
    console.log('读取完毕！');
});

rs.on('error', () => {
    console.log('读取出错！');
});

rs.on('close', () => {
    console.log('关闭文件');
});
```

（3）可读流有两种模式：自动流动（flowing 模式）手动流动（paused 模式）。

```js
// 自动流动模式
// 触发自动流动模式的方法有：监听 data 事件、rs.resume()、rs.pipe()
rs.on('data', chunk => {
    console.log(chunk);
});
```

```js
// 手动流动模式
// 触发手动流动模式的方法有：监听 readable 事件，并且每次都需要手动调用 read 方法读取；rs.pause()
let data = '';
rs.on('readable', () => {
    while ((chunk = rs.read()) !== null) {
        data += chunk;
    }
})
```

（4）可读流完成监听 `end` 事件；可写流完成监听 `finish` 事件，并且用 `ws.end()` 来标记文件末尾。

（5）设置编码格式时，除了都可以在创建流的时候设置之外，可读流还可以使用 `rs.setEncoding('utf-8')` 设置，可写流可以在写入的时候 `ws.write(data, 'utf-8')`设置。

（6）**双工流就同时具有可读流和可写流的方法**，常见的比如用来实现聊天系统 socket。

（7）**转换流继承自双工流**。需要注意的是，**转换流需要自己实现一个 transform 方法**。

```js
const stream = require('stream');
const transform = stream.Transform({
    // 需要自己实现一个 transform 方法
    transform(chunk, encoding, cb) {
        // 大小写字母转换，并 push 到缓冲区
        this.push(chunk.toString().toLowerCase());
        // cb();
    }
})
transform.write('D');
console.log('转换成小写字母：' + transform.read().toString());
```

（8）**链式流，一般用于管道操作**。

使用链式流来压缩文件。

```js
const fs = require('fs');
const zlib = require('zlib');

fs.createReadStream('data.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('data.txt.gz'));
  
console.log('压缩完成！');
```

:bell: **逐行读取的最佳方案 readline**。下面这个例子展示了逐行读取日志文件并统计访问某个网站的次数。

```js
const fs = require('fs');
const path = require('path');
const readLine = require('readline');

const filename = path.resolve(__dirname, 'log.txt');

const readStream = fs.createReadStream(filename);

let num = 0;

// 创建 readline 对象

const readL = readLine.createInterface({
    // 输入
    input: readStream
});

readL.on('line', data => {
    if (data.indexOf('https://www.baidu.com') !== -1) {
        num++;
    }
    console.log(data);
})

readL.on('close', () => {
    console.log('读取完成！', num);
})
```

```
// log.txt
访问时间：2020.06.25 17:44:30，访问地址：https://www.baidu.com
访问时间：2020.06.25 17:44:33，访问地址：https://www.baidu.com
访问时间：2020.06.25 17:44:35，访问地址：https://www.baidu123.com
访问时间：2020.06.25 17:44:40，访问地址：https://www.baidu.com
```

执行结果如下：

![nodejs](../.vuepress/public/assets/image/nodejs/nodejs11.png 'nodejs')

（9）为什么流要设计成默认是二进制格式的呢？

主要是为了优化 IO 操作，因为不同文件的数据格式是未知的，有可能是字符串、音频、网络包等，而二进制是**通用**的格式，哪个系统都认识，并且使用二进制进行数据流动和传输也是**效率最高**的，所以直接使用二进制是最明智的选择。

其实不仅仅是流采用二进制的格式，其他地方的文件传输操作用的也是这种方式。

## :pen: Node.js net 模块

[Node.js Net 模块](https://www.runoob.com/nodejs/nodejs-net-module.html)

1. 常用的跟信息交互通信相关的模块是 net 和 http。net 模块是基于 TCP 封装的，这也是 nodejs 的核心模块之一。http 模块本质上还是 TCP 层的，只不过做了比较多的数据封装。

**2. net 模块的组成**

- **net.server**，内部是通过 socket 来实现与客户端的通信的。

- **net.socket**，相当于是本地 socket 的 node 版实现，实现了全双工的 stream 接口。

**3. 服务端和客户端的通信**

首先要在服务端和客户端之间建立一条管道，这条管道是双向的。

server（服务端） pipe client（客户端）

管道如何建立呢？首先服务端要监听一个端口 port，比如：8080，然后客户端访问这个端口，两者就可以进行数据通信了。

**4. 服务端和客户端交互的例子**

服务端代码

```js
/**
 * 服务端创建需要3步
 * 1、创建服务 createServer
 * 2、监听端口 listen，等待客户端接入
 * 3、socket 通信，监听 data、close 等事件完成与客户端交互
 */

const net = require('net');

// 创建 tcp 服务
const server = net.createServer();

// 监听8000端口
server.listen('8000');

server.on('listening', function() {
    console.log('监听成功，监听端口号是8000！');
})

// 监听新建立的连接
server.on('connection', socket => {
    console.log('新的连接建立成功！');
    // 监听客户端传过来的信息
    socket.on('data', data => {
        console.log('服务端收到客户端传过来的信息是：', data.toString());
        // 返回给客户端一些数据
        socket.write('你好，我是服务端!');
        socket.write('客户端请关闭连接');
    })
    // 关闭连接
    server.close();
})

// 监听连接是否正常关闭
server.on('close', () => {
    console.log('服务端已经断开连接！');
})
```

客户端代码

```js
/**
 * 客户端创建也需要3步
 * 1、创建 socket
 * 2、连接指定的 IP 端口
 * 3、监听 data、close 等事件完成与服务端交互
 */

 const net = require('net');

 // 连接到服务端
 // 默认是 localhost，但是也可以设置 IP 地址
 const netSocket = net.connect('8000');

 netSocket.on('error', () => {
    console.log('连接失败！');
 })

 netSocket.on('connect', () => {
    console.log('客户端与服务端的连接已经建立成功！');
    netSocket.write('你好，我是客户端！');

    // 接收服务端数据
    netSocket.on('data', data => {
        console.log('客户端收到服务端的数据是：', data.toString());
        netSocket.end();
    })
 })

 netSocket.on('end', () => {
     console.log('客户端关闭连接成功！');
 })
```

执行结果如下：

![nodejs](../.vuepress/public/assets/image/nodejs/nodejs12.png 'nodejs')

