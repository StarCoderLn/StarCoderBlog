## ES7~ES10 新特性

**1. 提案到入选ECMA规范**

- Stage 0:strawman-最初想法的提交
- Stage 1:proposal(提案)--由TC39至少一名成员倡导的正式提案文件，该文件包括API 实例
- Stage 2:draft(草案)--功能规范的初始版本，该版本包含功能规范的两个实验实现
- Stage 3:candidate(候选)--提案规范通过审查并从厂商那里收集反馈
- Stage 4:finished(完成)—提案准备加入ECMAScript，但是到浏览器或者Nodejs中可 能需要更长的时间

**2. ES7~ES10 新特性速览**

ECMAScript版本 | 新增特性
-|-
ECMAScript2016(ES7) | 在 ES6 基础上新增了两项功能，一个是数组的 `includes` 方法，一个是 `Math.pow` 的简写语法
ECMAScript2017(ES8) | 在异步操作、Object、String 能力上做了进一步增强，让代码编写更加效率
ECMAScript2018(ES9) | 主要解决了遍历中异步、异步的归一操作等问题，也提供了对象的拷贝、筛选功能并且提升了正则的处理能力
ECMAScript2019(ES10) | ES10 虽然没有大幅的改动，JSON 问题修复，数组、字符串、对象、函数等能力进一步增强，同时新增的 `BigInt` 数据类型也格外引人注目

**3. ES7 新特性**

- includes

用来判断一个元素是否存在一个数组中

```js
const arr = [1, 2, 3];

arr.indexOf(4) >= 0; // false，之前的做法
arr.includes(4); // false，现在的做法
```

- 幂运算 **

```js
Math.pow(2, 3); // 8，之前的做法
2 ** 3; // 8，现在的做法
```

**4. ES8 新特性**

**4-1. async/await**

ES8 的异步操作，比如 async/await，它的 next 返回的是一个 promise 对象。在 async/await 之前，我们实现异步操作一般是通过**嵌套回调**、`Promise`、`Generator` 来实现。现在主要是通过 async/await + Promise。

```js
// 使用 async 声明一个异步函数
async function fn() {
  // await 会等待异步函数执行完毕，再继续执行下面的代码
  await Promise.resolve()
  console.log(1)
}
```
async/await 的代码看起来更加语义化，可读性更好。

- async  

返回的是一个 Promise 对象。

```js
async function add(num) {
  const a = 1;
  return num + a;
}

add(2); // 返回的是一个promise对象

add(2).then(res => {
  console.log(res) // 3
})
```

- await

（1）await 会强制它后面的代码进行等待，直到 Promise 执行完毕。  
（2）await 只能在 async 声明的函数内部使用，否则会报错。

```js
function promiseFn() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('result')
    }, 1500)
  })
}
async function fn() {
  let res = await promiseFn() // 拿到异步函数返回的结果
  console.log('异步代码执行完毕', res)
}
fn() // 等待1.5秒后输出'异步代码执行完毕 result'
```

- 错误处理

（1）使用 try...catch... 捕获错误

```js
function promiseFn() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('错误信息')
    }, 1500)
  })
}
async function fn() {
  try {
    await promiseFn()
    console.log('我在错误下边不会执行') // 这句代码不会执行
  } catch (err) {
    console.log(err)
  }
}
fn() // 等待1.5秒后打印出“错误信息”，说明捕获到错误了
```

（2）另外一种捕获错误的方法

```js
function promiseFn() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('错误信息')
    }, 1500)
  })
}
async function fn() {
  await promiseFn()
  console.log('我在错误下边不会执行') // 这句代码不会执行
}
fn().catch(err => {
  console.log(err) // 等待1.5秒后打印出“错误信息”，说明捕获到错误了
})
```

（3）如果不想中断错误后面的代码，想要继续执行的话，可以提前在 await 那里把错误捕获，下面的代码就会继续执行了。

```js
function promiseFn() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('错误信息')
    }, 1500)
  })
}
async function fn() {
  await promiseFn().catch(err => {
    console.log(err)
  })
  console.log('我在错误下边还是会继续执行') // 这句代码会继续执行
}
fn() // 等待1.5秒后打印出“错误信息”和“我在错误下边还是会继续执行”
```

- 多个异步命令

如果多个异步命令之间是独立的，我们可以让它们同时执行，而不必等其中某一个执行完毕后再执行下一个，可以减少等待时间。

`console.time()` 和 `console.timeEnd()` 可以用来测试它们中间的代码的执行时间。

```js
function promiseFn() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("result");
    }, 1000);
  });
}
function promiseFn1() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("result");
    }, 2000);
  });
}

async function fn1() {
  console.time("fn1");
  let res1 = await promiseFn();
  let res2 = await promiseFn1();
  console.timeEnd("fn1");
}

fn1() // 打印出来的时间差不多是3秒，是两个异步函数等待时间的累加
```

可以通过 promise.all() 方法让多个异步命令同时执行。

```js
function promiseFn() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("result");
    }, 1000);
  });
}
function promiseFn1() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("result");
    }, 2000);
  });
}

async function fn2() {
  console.time("fn2");
  let [res1, res2] = await Promise.all([promiseFn(), promiseFn1()]);
  console.timeEnd("fn2");
}
fn2() // 打印出来的时间差不多是2秒，说明是同步执行的，取等待时间最长的异步函数
```

**4-2. Object.values()**

返回的是对象自身的属性值，不包括继承过来的值。

```js
const obj = { name: "深圳", age: 30 }

// 之前获取对象属性值的方式
Object.keys(obj).map(key => obj[key]) // ["深圳", 30]

// ES8 获取对象属性值的方式
Object.values(obj) // ["深圳", 30]
```

**4-3. Object.entries()**

作用跟 for...in 类似，两者的区别是 for...in 会枚举原型链中的属性。

```js
const obj = { name: "深圳", age: 30 }

Object.entries(obj) // [["name", "深圳"], ["age", 30]]

// 如果是作用于非对象上，会强制转换成键值对形式。
Object.entries('深圳') // [["0", "深"], ["1", "圳"]]
```

遍历对象的键值

```js
const obj = { name: "深圳", age: 30 }

for (const [key, value] of Object.entries(obj)) {
  console.log(`${key}-${value}`)
}
// 或
Object.entries(obj).forEach(([key, value]) => {
  console.log(`${key}-${value}`)
});
```

**4-4. String Padding**

- [String.prototype.padStart(targetLength [, padString])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)，从字符串开头开始填充
- [String.prototype.padEnd(targetLength [, padString])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd)，从字符串末尾开始填充

targetLength 是当前字符串需要填充到的长度。如果这个数值小于当前字符串的长度，则返回当前字符串本身。

padString 是要填充的字符串。如果字符串太长，使填充后的字符串长度超过了目标长度，则**只保留最左侧的部分**，其他部分会被截断。缺省值为""。

**4-4. 结尾允许逗号**

这种格式会比较友好

```js
function fn(
  para1,
  para,
){
  console.log(para1,para);
}
fn(1,2);

let obj = {
  m:'',
  n:'',
    
}
```

**4-5. Object.getOwnPropertyDescriptors()**

[Object.getOwnPropertyDescriptors()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors) 方法用来获取一个对象的所有自身属性的描述符。

```js
const obj = {
  name: "深圳",
  get fn() {
    return "fn";
  }
};
Object.getOwnPropertyDescriptors(obj);
/*
  {name: {…}, fn: {…}}
    name:
      value: "深圳"
      writable: true
      enumerable: true
      configurable: true
      __proto__: Object
    fn:
      get: ƒ fn()
      set: undefined
      enumerable: true
      configurable: true
      __proto__: Object
      __proto__: Object
*/
```

**4-6. SharedArrayBuffer 与 Atomics**

[SharedArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 可以理解成共享内存，[Atomics](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Atomics) 则提供了一组静态方法来对 SharedArrayBuffer 进行原子操作。这给 js 带来了多线程的功能，是 js 中的高级特性，也是 js 引擎的核心改进。但既然有多线程，那么就会有竞争问题，所以就需要原子操作来解决这个问题，原子操作可以理解成给线程加锁。

```js
const buffer = new SharedArrayBuffer(8) // 缓冲区大小，以字节byte为单位
console.log(buffer.byteLength) // 8
```

下面这个例子展示了 SharedArrayBuffer 共享内存用于线程间通信的使用方法。使用流程如下：

新建共享内存 -> 新建视图 -> 将共享内存地址发送给其他线程 -> 其他线程就可以对这块共享内存中的数据进行读写 -> 读写完毕后，在主线程中都可以拿到修改后的数据

```js
// main.js
const worker = new Worker('./worker.js') // 创建一个 worker 线程
const sharedBuffer = new SharedArrayBuffer(1024) // 新建1kb内存，SharedArrayBuffer 和 ArrayBuffer 本身是没法进行读写的
const intArrBuffer = new Int32Array(sharedBuffer) // 建视图，长度为256
for (let i = 0; i < intArrBuffer.length; i++) {
  intArrBuffer[i] = i // 写入数据。写入数据前必须先建立视图，数据才能被写入
}
worker.postMessage(sharedBuffer) // 发送共享内存地址

worker.onmessage = function(e) {
  console.log('更改后的数据为：' + intArrBuffer[20]) // 主线程可以直接获取到更改后的数据
}

// worker.js
onmessage = function(e) {
  let arrBuffer = e.data
  console.log(arrBuffer) // 打印出来的东西就是跟主线程共享的那块内存地址。如果此时主线程往内存地址中写入了数据，那么在worker线程直接就可共享，直接读取就可以了

  arrBuffer[20] = 88 // worker 线程更改共享内存的数据，不用重新发送共享内存地址
}
```

在上面的例子中，我们直接读取和修改了共享内存的数据，其实这是错误的操作方式，如果有多个线程同时这么做，那么就会有冲突。我们应该使用 Atomics 提供的方法来操作数据。

```js
Atomics.load(arrBuffer, 20) // 读数据方法
Atomics.store(arrBuffer, 20, 88) // 88 写数据方法，并返回写入的值
Atomics.exchange(arrBuffer, 20, 88) // 88 写数据方法，并返回被替换的值

Atomics.wait(arrBuffer, 11, 11) // 当满足共享内存地址第11位的数据是11的时候进入休眠状态
Atomics.wait(arrBuffer, 11, 11, 2000) // 可以通过第四个参数唤醒休眠，比如这里2秒后自动唤醒
Atomics.notify(intArrBuffer, 11, 1) // 该方法仅在共享的 Int32Array 下可用。三个参数：共享内存的视图、视图数据的位置、唤醒的线程数
```

[Web Worker](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)也可以为JavaScript创造多线程环境，它是通过 postMessage 进行通信。这个也需要了解学习下。

下面这个例子展示了主线程和 Worker 线程之间如何进行通信。通信之间的数据可以是任意格式的。

```js
// main.js
const worker = new Worker('./worker.js') // 创建一个 worker 线程
worker.postMessage('Hello, I am main') // 使用 postMessage 向 worker 线程发送消息
worker.onmessage = function(e) {
  console.log(e.data) // 接收到 worker 线程发送的消息，打印 Hello, I am worker
}

// worker.js
onmessage = function(e) {
  console.log(e.data) // 接收到主线程发送的消息，打印 Hello, I am main
  postMessage('Hello, I am worker') // 使用 postMessage 向主线程发送消息
}
```

验证这个例子时需要启动一个服务才行。我们可以使用 [http-server](https://juejin.im/post/5d8474baf265da03e4679a44) 来启动一个本地服务。启动服务之后，访问页面就不能按照平时那种方式直接默认浏览器打开了，而是应该通过 http-server 的启动服务界面打开。

![http-server](../.vuepress/public/assets/image/javascript/http-server1.png 'http-server')  

找到对应的文件夹，一步一步找到相应的页面，然后打开就可以看到线程间的通信了。

![http-server](../.vuepress/public/assets/image/javascript/http-server2.png 'http-server') 