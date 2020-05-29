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

**5. ES9 新特性**

**5-1. 异步迭代器和异步生成器**

在了解异步迭代器和异步生成器之前，先来了解下什么是迭代器和生成器。

- **迭代器 Iterator**

Iterator 是一个特殊对象，它包含一个 `next` 方法，next 方法返回一个对象，这个对象包含两个属性，一个是 value；一个是 done，done是一个布尔值，表示是否遍历完成。

```js
next() => { value: '', done: true }
```

下面的例子演示如何创建并使用一个迭代器。

```js
const createIterator = items => {
  const keys = Object.keys(items)
  const len = keys.length
  let pointer = 0
  return {
    next() {
      const done = pointer >= len
      const value = !done ? items[keys[pointer++]] : undefined
      return {
        value,
        done
      }
    }
  }
}

const it1 = createIterator([1, 2, 3])
console.log(it1.next()) // {value: 1, done: false}
console.log(it1.next()) // {value: 2, done: false}
console.log(it1.next()) // {value: 3, done: false}
console.log(it1.next()) // {value: undefined, done: true}
```

拥有 iterator 的数据结构，也就是具有 `Symbol.iterator` 方法的数据结构，是可以被 for...of 遍历的。

数组原生就具有 iterator 接口。

```js
const arr = [1, 2, 3]

console.log(typeof arr[Symbol.iterator]) // function，证明数据具有这个方法

for (const val of arr) {
  console.log(val) // 1 2 3
}
```

对象默认是没有 iterator 接口的。

```js
const obj = {a: 'a', b: 'b', c: 'c'}
console.log(typeof obj[Symbol.iterator]) // 'undefined'，证明没有这个方法

for (const val of obj) {
    console.log(val) // Uncaught TypeError: obj is not iterable
}
```

但是可以手动给对象部署 iterator 接口。

```js
const obj = {a: 'a', b: 'b', c: 'c'}

obj[Symbol.iterator] = function() { // 给对象部署 iterator 接口
  const self = this
  const keys = Object.keys(self)
  const len = keys.length
  let pointer = 0
  return {
    next() {
      const done = pointer >= len
      const value = !done ? self[keys[pointer++]] : undefined
      return {
        value,
        done
      }
    }
  }
}

console.log(typeof obj[Symbol.iterator]) // function

for (const val of obj) {
    console.log(val) // a b c
}
```

- **生成器 Generator**

Generator 是一个特殊函数，函数体内部使用 `yeild` 表达式，定义不同的内部状态，**当执行Generator函数时，不会直接执行函数体，而是会返回一个遍历器对象（iterator）**。

function 关键字和函数名之间有一个 `*` 。

```js
function* fn() {
  console.log('正常函数中我会执行')
  yield 1
  yield 2
  yield 3
  console.log('执行完了')
}

const iteratorFn = fn() // 这时函数体并没有被执行，没有任何输出，而是创建了一个iterator
console.log(iteratorFn.next()) // 当调用 next 方法之后函数体才会开始执行
console.log(iteratorFn.next())
console.log(iteratorFn.next())
console.log(iteratorFn.next())
```

执行结果如下。

![ES9](../.vuepress/public/assets/image/javascript/es1.png 'ES9')

- **异步迭代器 Async Iterator**

异步迭代器和同步迭代器相同，都是一个特殊对象，并且含有一个 next 方法，区别在于同步迭代器的 next 方法返回一个含有 value 和 done 属性的对象，而异步迭代器的 next 方法返回一个 Promise 对象，并且 Promise 对象的值为含有 value 和 done 属性的对象。

```js
next() => { value: '', done: true }
next() => Promise { value: '', done: true }
```

下面演示了如何模拟创建并使用一个异步迭代器，并不是一个真正的异步迭代器。

```js
const createAsyncIterator = items => {
  const keys = Object.keys(items)
  const len = keys.length
  let pointer = 0
  return {
    next() {
      const done = pointer >= len
      const value = !done ? items[keys[pointer++]] : undefined
      return Promise.resolve({
        value,
        done
      })
    }
  }
}

const asyncIterator = createAsyncIterator([1, 2, 3])
aynscIterator.next().then(res => {
    console.log(res) // {value: 1, done: false}
})
aynscIterator.next().then(res => {
    console.log(res) // {value: 2, done: false}
})
aynscIterator.next().then(res => {
    console.log(res) // {value: 3, done: false}
})
aynscIterator.next().then(res => {
    console.log(res) // {value: undefined, done: true}
})
```

- **异步执行语句 for await...of**

for...of 方法能够遍历具有 Symbol.iterator 接口的同步迭代器数据，但是不能遍历异步迭代器。 ES9新增的 for await...of 可以用来遍历具有 Symbol.asyncIterator 方法的数据结构，也就是异步迭代器，且会等待前一个成员的状态改变后才会遍历到下一个成员，相当于 async 函数内部的 await。

定义一个真正的异步迭代器，并使用 for await...of 遍历它。

```js
const asyncItems = {
  a: 1,
  b: 2,
  c: 3,
  [Symbol.asyncIterator]() {
    const self = this
    const keys = Object.keys(self)
    const len = keys.length
    let pointer = 0
    return {
      next() {
        const done = pointer >= len
        const value = !done ? self[keys[pointer++]] : undefined;
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({value, done})
          }, 1000)
        }) 
      }
    }
  }
}


async function fn() {
  for await (const val of asyncItems) {
    console.log(val)
  }
}
fn() // 等待1s后打印出1，再过1s后打印出2，再过1s后打印出3
```

- **异步生成器 Async Generator**

我们可以采取一种更方便的方式创建异步迭代器，就是利用异步生成器。

异步生成器和普通的生成器很像，但是它是 async 函数，内部可以使用 await 表达式，并且它返回一个具有 Symbol.asyncIterator 方法的对象。

```js
async function* fn() {
  yield await Promise.resolve(1)
  yield await Promise.resolve(2)
  yield await Promise.resolve(3)
}

const asyncFn = fn()
async function run() {
  for await (const val of asyncFn) {
    console.log(val) // 1 2 3
  }
}
run();
console.log(typeof asyncFn[Symbol.asyncIterator]) // 'function'
```

**5-2. Promise.finally**

[Promise.prototype.finally()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally) 返回一个 Promise。在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数。这为在 Promise 是否成功完成后都需要执行的代码提供了一种方式，避免了同样的语句需要在 then() 和 catch() 中各写一次的情况。

比如下面的代码只会执行 resolve 里的内容，如果把 resolve 注释掉，才会执行 reject 里的内容。

```js
function fn() {
  return new Promise((resolve, reject) => {
    resolve('success')
    reject('fail')
  })
}
fn()
  .then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
```

无论是成功还是失败，我们都想执行代码，这个时候就需要用到 finally 了。

```js
function fn() {
  return new Promise((resolve, reject) => {
    resolve('success')
    reject('fail')
  })
}
fn()
  .then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  }).finally(() => {
    console.log('不论成功或失败我都会执行')
  })
```

**5-3. Rest/Spread**

这个就是我们通常所说的[剩余参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters)和[扩展运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)，两者的符号都是 `...` ，这在 ES6 中就已经引入了，但是 ES6 中的作用对象**仅限于数组和函数调用**。在 ES9 中，为**对象**提供了像数组一样的剩余参数和扩展运算符。

- 剩余参数的使用

```js
function fn(a, b, ...c) {
  console.log(a, b, c)
}
fn(1, 2, 3, 4, 5) // 1 2 [3, 4, 5] 

const obj = {
  name: "shenzhen",
  age: 4,
  info: {
    phone: 188888
  }
}
function fn({ name, ...infos }) {
  console.log(name, infos) // shenzhen {age: 4, info: {…}}
}
fn(obj)
```

- 在数组中使用扩展运算符

```js
const arr = [1, 2, 3]
console.log([11, 22, ...arr]) // [11, 22, 1, 2, 3]
```

- 在对象中使用扩展运算符，解构

```js
const obj = {
  name: "shenzhen",
  age: 4,
  info: {
    phone: 188888
  }
}
const { name, ...infos } = obj
console.log(name, infos) // shenzhen {age: 4, info: {…}}
```

- 拷贝对象并增加新属性，类似对象合并

```js
const obj = {
  name: "shenzhen",
  age: 4,
  info: {
    phone: 188888
  }
}
const obj2 = { ...obj, address: "beijing" }
console.log(obj2) // {name: "shenzhen", age: 4, info: {…}, address: "beijing"}
```

- 实现对象浅拷贝

```js
const obj = {
  name: "shenzhen",
  age: 4,
  info: {
    phone: 188888
  }
}
const objClone = { ...obj }
objClone.name = 'guangzhou'
console.log(objClone.name) // guangzhou 
console.log(obj.name) // shenzhen 原来的数据不受影响，实现浅拷贝
objClone.info.phone = 177777
console.log(objClone.info.phone) // 177777
console.log(obj.info.phone) // 177777
```

**5-4. 对正则表达式增强**

- `?<name>` —— 命名捕获组

关于命名捕获组的说明可以参考这篇文章：[命名捕获组](https://esnext.justjavac.com/proposal/regexp-named-groups.html)

假如有一个需求：将 YYYY-MM-DD 格式的年月日解析到数组中

ES9 之前的实现方法可能如下：

```js
const dateStr = '2020-05-28'
const reg = /([0-9]{4})-([0-9]{2})-([0-9]{2})/
const res = reg.exec(dateStr)
console.log(res[1], res[2], res[3])
```

ES9 提供了 `?<name>` 的形式可以为捕获的分组自定义名称。上面可改成：

```js
const dateStr = '2020-05-28'
const reg = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/
const res = reg.exec(dateStr)
console.log(res.groups.year, res.groups.month, res.groups.day)
```

假如现在有另外一个需求：要将时间改成月日年的格式。可以通过自定义命名捕获分组配合 replace 来实现。

```js
const dateStr = '2020-05-28'
const reg = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/
const newDate = dateStr.replace(reg, `$<month>-$<day>-$<year>`)
console.log(newDate) // 05-28-2020
```

- **反向断言（后行断言）**

假如有这样一个需求：需要捕获货币符号

通过先行断言的方式实现如下：

```js
const str = '$123'
const reg = /\D(?=\d+)/ // 先行断言格式的正则表达式 ?=pattern
const res = reg.exec(str)
console.log(res[0]) // $
```

通过后行断言（反向断言）的方式获取数字的实现如下：

```js
const str = '$123'
const reg = /(?<=\D)\d+/ // 后行断言格式的正则表达式 ?<=pattern
const res = reg.exec(str)
console.log(res[0]) // 123
```

- **增加 s/dotAll 模式**

在 JavaScript 正则表达式中，`.` 可以用来匹配单个字符，但是有两种字符匹配不到：多字节 emoji 字符和行终结符（比如换行\n、回车\r等等）。

在 ES9 中，新增了一个标志 `s` 用来表示 dotAll，以使 `.` 能够匹配任意单个字符。具体说明可参考这篇文章：[s/dotAll 模式](https://esnext.justjavac.com/proposal/regexp-dotall-flag.html)。

```js
const str = 'shen\nzhen'
console.log(/shen.zhen/.test(str))  // false
console.log(/shen.zhen/s.test(str)) // true
```

- **汉字匹配**

```js
const oldReg = /[\u4e00-\u9fa5]/  // ES9 之前的书写方式，既繁琐又不好记
const newReg = /\p{Script=Han}/u  // ES9 的书写方式，更加容易理解
const str = '深圳'
console.log(oldReg.test(str)) // true
console.log(newReg.test(str)) // true
```

- **非转义序列的模板字符串**

具体说明可参考这篇文章：[非转义序列的模板字符串](https://esnext.justjavac.com/proposal/template-literal-revision.html)。

[String.raw()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/raw) 是一个模板字符串的标签函数，用来获取一个模板字符串的原始字符串，这是 ES6 提供的。

```js
'\u{54}' // 'T'
String.raw`\u{54}` // '\u{54}'
```

**6. ES10 新特性**

**6-1. flat() 和 flatMap()**

（1）flat

- [flat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) 方法可以用来扁平化一个嵌套数组，默认只能扁平化 1 层深度，可以传一个参数指定需要扁平化的深度层数。

```js
const arr = [1, 2, 3, [4, 5]]
console.log(arr.flat())  // [1, 2, 3, 4, 5]

const arr1 = [1, 2, 3, [4, 5, [6, 7]]]
console.log(arr1.flat()) // [1, 2, 3, 4, 5, [6, 7]]

// 指定 2 层深度
const arr2 = [1, 2, 3, [4, 5, [6, 7]]]
console.log(arr2.flat(2)) // [1, 2, 3, 4, 5, 6, 7]

// 指定任意深度
const arr3 = [1, 2, 3, [4, 5, [6, 7, [8, 9, [10, 11]]]]]
console.log(arr3.flat(Infinity)) // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
```

- flat() 还可以用来去除数组中的空项。

```js
const arr = [1, 2, , , 3]
console.log(arr.flat()) // [1, 2, 3]
```

（2）flatMap

[flatMap()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap) 方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。它与 map 连着深度值为 1 的 flat 几乎相同，但 flatMap 通常在合并成一种方法的效率稍微高一些。默认也是只能扁平化 1 层深度。

```js
const arr = [1, 2, 3, 4]
console.log(arr.map(x => [x * 2])) // [[2], [4], [6], [8]]
console.log(arr.flatMap(x => [x * 2])) // [2, 4, 6, 8]
console.log(arr.flatMap(x => [[x * 2]])) // [[2], [4], [6], [8]]
```

**6-2. Object.fromEntries()**

[Object.fromEntries()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries) 方法能够将一个键值对列表转换成一个对象。是 `Object.entries()` 的反转。

```js
// Map 转换为 Object
const map = new Map([['first', 'shenzhen'], ['second', 'guangzhou']])
console.log(Object.fromEntries(map)) // {first: "shenzhen", second: "guangzhou"}

// Array 转换为 Object
const arr = [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]
console.log(Object.fromEntries(arr)) // {0: "a", 1: "b", 2: "c"}
```

**6-3. String.prototype.matchAll()**

[String.prototype.matchAll()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll) 方法返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器。

```js
const str = 'guangzhou shenzhen shenzhen'
const reg = /shen*/g

// matchAll 之前的做法
while ((matches = reg.exec(str)) !== null) {
  console.log(`${matches[0]}-start=${matches.index}-end=${reg.lastIndex}`)
}
/*
  shen-start=10-end=14
  shen-start=19-end=23
*/

// 使用 matchAll 的做法
let matches1 = str.matchAll(reg)
console.log(matches1) // 返回一个迭代器：RegExpStringIterator {}
for (const match1 of matches1) {
  console.log(`${match1[0]}-start=${match1.index}-end=${match1.index + match1[0].length}`)
}
/*
  shen-start=10-end=14
  shen-start=19-end=23
*/

// 由于 matchAll 返回的是一个迭代器，所以也可以调用 next 方法
let matches1 = str.matchAll(reg)
console.log(matches1.next()) // {value: Array(1), done: false}
console.log(matches1.next()) // {value: Array(1), done: false}
console.log(matches1.next()) // {value: undefined, done: true}
```

matchAll 还可以用于更好的捕获分组。

```js
// 使用 match 时并没有捕获分组
const reg = /s(h)en(zhen(\d?))/g
const str = "shenzhen66shenzhen66"
console.log(str.match(reg)) // ["shenzhen6", "shenzhen6"]

// 使用 matchAll 就会捕获分组
const arr = [...str.matchAll(reg)]
console.log(arr[0]) // ["shenzhen6", "h", "zhen6", "6", index: 0, input: "shenzhen66shenzhen66", groups: undefined]
console.log(arr[1]) // ["shenzhen6", "h", "zhen6", "6", index: 10, input: "shenzhen66shenzhen66", groups: undefined]
```

**6-4. String.prototype.trimStart() 和 String.prototype.trimEnd()**

这两个方法的作用是去除字符串的首位空格。

**6-5. String.prototype.description**

```js
// 通过工厂函数 Symbol() 创建符号时，可以选择通过参数提供字符串作为描述
const sym = Symbol('description')

// 之前获取描述的唯一方法是将符号转换为字符串
console.log(String(sym)) // Symbol(description)

// 现在可以通过 Symbol.prototype.description 直接获取
console.log(sym.description) // description
```

**6-6. 省略 catch 参数**

在 ES10 之前，我们必须通过语法为 catch 子句绑定异常变量，无论是否有必要。很多时候 catch 块是多余的。 ES10 提案使我们能够简单的把变量省略掉。

```js
// ES10 之前
try {} catch(e) {}

// 现在
try {} catch {}
```

**6-7. 行分隔符（U + 2028）和段分隔符（U + 2029）符号现在允许在字符串文字中，与 JSON 匹配**

JSON 可以包含行分隔符和段分隔符。但是目前只是草案，浏览器还未支持。

```js
const json = '{"name":"shenzhen\nguangzhou"}'
console.log(json) // {"name":"shenzhen
                   // guangzhou"}
JSON.parse(json) // Uncaught SyntaxError: Unexpected token in JSON at position 17
```

**6-8. 更加友好的 JSON.stringify**

如果输入 Unicode 格式但是超出范围的字符，在原先JSON.stringify返回格式错误的Unicode字符串。现在实现了一个改变JSON.stringify的第3阶段提案，因此它为其输出转义序列，使其成为有效Unicode（并以UTF-8表示）。
对字符 U+D800 到 U+DFFF 处理。

```js
JSON.stringify("\UDEAD"); // JSON转义序列，应该输出'"\\UDEAD"'，但是现在浏览器还未支持，输出的是"UDEAD"
```

**6-9. Function.prototype.toString()**

现在能够返回精确字符，包括空格和注释。

```js
function /*注释*/ foo /*注释*/() {}

// 之前
console.log(foo.toString()) // function foo(){}
// 现在
console.log(foo.toString()) // function /*注释*/ foo /*注释*/() {}
```

**6-10. BigInt —— 任意精度整数**

[BigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 是一种内置对象，它提供了一种方法来表示大于 `2^53 - 1` 的整数。这原本是 Javascript中可以用 Number 表示的最大数字。BigInt 可以表示任意大的整数。

现在的基本数据类型就有 7 种：String、Number、Boolean、Null、Undefined、Symbol、BigInt。

之前 js 中能表示的整数的最大值为：

```js
console.log(Number.MAX_SAFE_INTEGER) // 9007199254740991
```

但是现在有了 BigInt 之后，就不受这个限制了。

```js
// 创建 BigInt 类型数据的方式
let num = 1n
console.log('类型为：', typeof num) // 类型为： bigint
console.log(num === 1) // false
console.log(num == 1) // true

// 另一种创建 BigInt 类型数据的方式
const bigInt = BigInt(10)
console.log(bigInt) // 10n

// 只能和同类型的数据进行运算
let num1 = 10n
console.log(num - num1) // -9n
console.log(num - 1) // Uncaught TypeError: Cannot mix BigInt and other types, use explicit conversions

// 使用 Object 包装后， BigInt 被认为是一个普通 "object"
console.log(typeof Object(1n) === 'object') // true
```

**6-11. 标准化 globalThis 对象**

可以在任何平台访问全局属性。

```js
const getGlobal = function() {
  if (typeof self != "unefined") {
    return self
  }
  if (typeof window != "unefined") {
    return window
  }
  if (typeof global != "unefined") {
    return global
  }
  throw new Error()
}

console.log(globalThis) // 谷歌浏览器中打印出来是一个 window 对象，但是在 node 中还未支持这个对象
```

题外话：Array.prototype.sort() 和 TimSort()

Array.prototype.sort 是现有的浏览器排序方式，但是是不稳定的排序，最坏的时间复杂度可为 O(n^2)；新的 v8 引擎实现了一个新的 TimSort() 方法，这是稳定的排序，时间复杂度为 O(nlogn)，可以阅读 V8 源码学习。这点也需要了解下。

```js
// 
const arr = [
  { name: "w", age: 18 },
  { name: "shenzhen", age: 4 },
  { name: "www", age: 4 }
];
arr.sort((a, b) => a.age - b.age)
console.log(arr) // 由于在谷歌浏览器中已经使用了新的排序引擎 TimSort，所以结果是稳定排序

// 非稳定的排序，因为 shenzhen 和 www 的 age 都是 4，但是排序后两者的位置换了
[
  { name: "www", age: 4 },
  { name: "shenzhen", age: 4 },
  { name: "w", age: 18 }
]

// 稳定的排序，shenzhen 和 www 两者的位置没有变化
[
  { name: "shenzhen", age: 4 },
  { name: "www", age: 4 },
  { name: "w", age: 18 }
];
```