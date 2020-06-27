## :books: 浏览器中的 event loop

### :blue_book: event loop 示意图

![eventloop](../.vuepress/public/assets/image/javascript/eventloop1.png 'eventloop')

上面这张图展示的就是浏览器中的 event loop，它包含两部分：

1. 左边部分是**堆空间和栈空间**。js 代码运行时，**基础变量会存在栈空间里面，而复杂的变量，比如对象、函数等会存在堆空间里**。同时，**栈空间里也会保存一些对堆空间里的变量的引用**。除此之外，**栈里还会存函数的执行逻辑**，比如 A 函数调用 B 函数，那么栈空间里就会既有 A 又有 B，并且是先执行 A 再执行 B，执行完成后，先释放 B，再释放 A。

2. 下面部分是**异步队列**。如果在执行过程中有一些比较耗时的异步事件，比如点击事件、ajax 请求、定时器等，就先会把它们放到这个异步队列中。当栈里面的主线程的同步任务执行完之后，就会来异步队列中取异步任务执行。由于队列是先进先出的结构，所以**先进来的异步任务会先执行**。如果此时异步队列中没有异步任务，那么浏览器也会处于 event loop 状态，实时监听异步队列中有没有异步任务，有的话就取出来执行。

### :blue_book: 异步队列分类

![eventloop](../.vuepress/public/assets/image/javascript/eventloop2.png 'eventloop')

任务执行顺序是这样的：首先是先执行宏任务的，因为整个 script 标签就是一个宏任务，当在执行宏任务的时候，有可能会触发一些微任务，比如 promise，这个时候就会先去把微任务队列中的微任务执行完成后，才会去执行下一个宏任务，以此类推，直到执行完所有的任务。

### :blue_book: 浏览器中的任务队列

![eventloop](../.vuepress/public/assets/image/javascript/eventloop3.png 'eventloop')

### :blue_book: event loop 练习题

:lock: **1. 宏任务和微任务的执行顺序**

```js
setTimeout(() => {
    console.log('timeout')
}, 0)
const promise = new Promise(resolve => {
    console.log('promise init')
    resolve(1)
    console.log('promise end')
})
promise.then(res => {
    console.log('promise result:', res)
})
// 执行结果：promise init、promise end、promise result:1、timeout
```

这段代码要注意的是 promise 的 resolve 函数中的代码是同步的，所以里面的两个 console.log 会先执行。然后 then 方法触发微任务，最后再执行宏任务。

同步任务：promise init、promise end，微任务：promise result:1、宏任务：timeouot。

:lock: **2. 宏任务微任务交错执行**

```js
setTimeout(() => {
    console.log('timeout1')
    Promise.resolve().then(() => {
        console.log('promise1')
    })
}, 0)
Promise.resolve().then(() => {
    console.log('promise2')
    setTimeout(() => {
        console.log('timeout2')
    }, 0)
})
// 执行结果：promise2、timeout1、promise1、timeout2
```

首先，第一个宏任务 setTimeout 会先被放到宏任务队列中，但是暂时不会执行。接着先执行微任务 promise，打印 promise2，执行的同时把里面的 setTimeout 也放到了宏任务队列中，暂时也不会执行，此时这个 promise 就执行完成了。然后就会去宏任务队列中取出第一个 setTimeout 出来执行，打印 timeout1，此时又插入了一个微任务 promise，所以就会先执行这个微任务，打印 promise1，最后才去宏任务队列中取出第二个 setTimeout 执行，打印 timeout2。

:lock: **3. async/await 拆解**

:bell: 如果 await 后是一个简单类型，则进行 Promise 包裹。

:bell: 如果 await 后是一个 thenable 对象，则不用进行 Promise 包裹（chorme 的优化）。

```js
async function fn() {
    return await 1234
}
fn().then(res => console.log(res))
// 执行结果：1234
```

上面的代码打印出1234，说明 async 返回的是一个 promise 对象，上面的代码等价于下面这样：

```js
async function fn() {
    return Promise.resolve(1234)
}
fn().then(res => console.log(res))
// 执行结果：1234
```

await thenable

```js
async function fn() {
    return await({
        then(resolve) {
            resolve(1234)
        }
    })
}
fn().then(res => console.log(res))
// 执行结果：1234
```

await 不加也是可以的，执行结果是一样的。

```js
async function fn() {
    return ({
        then(resolve) {
            resolve(1234)
        }
    })
}
fn().then(res => console.log(res))
// 执行结果：1234
```

如果返回的是一个包含 then 方法的对象（即 thenable 对象），那么根据 promise A+ 规范会将它当成一个 promise 对象去处理，调用里面的 then 方法输出 resolve 的内容。

如果 resolve 返回值还是一个包含 then 方法的对象，那么会继续递归调用 promise.then，直到 resolve 返回值是一个基础类型。

```js
async function fn() {
    return ({
        then(resolve) {
            resolve({
                then(r) {
                    r(1)
                }
            })
        }
    })
}
fn().then(res => console.log(res))
// 执行结果：1
```

:lock: **4. 使用 async await 顺序判断（学会将 async/await 转换成 Promise 来解决）** 

```js
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2')
}
async1()
console.log('script')
// 执行结果：async1 start、async2、script、async1 end
```

async1 中的第一个 console 和 async2 中的 console 都是同步任务，因为 async 返回的是一个 Promise 对象，上面说过，promise 的 resolve 中的代码都是同步任务。所以这两者会先执行，接着执行 console.log('script') 这个同步任务，最后才执行 async1 中的第二个 console（微任务）。

可以将 async2 转换成一个 Promise 对象，就容易理解了：

```js
async function async1() {
    console.log('async1 start')
    new Promise(resolve => {
        console.log('async2')
        resolve()
    }).then(res => {
        console.log('async1 end')
    })
}
async1()
console.log('script')
// 执行结果：async1 start、async2、script、async1 end
```

:lock: **5. 如果 promise 没有 resolve 或 reject**

```js
async function async1() {
    console.log('async1 start')
    await new Promise(resolve => {
        console.log('promise1')
    })
    console.log('async1 success')
    return 'async1 end'
}
console.log('script start')
async1().then(res => console.log(res))
console.log('script end')
// 执行结果：script start、async1 start、promise1、script end
```

:bell: 由于 promise 对象没有执行 resolve 或者 reject 方法，导致它的状态没有变更，这个 promise 永远没有完成，所以 await 下边的代码就永远不会执行。也就是说，await 下面的代码等到它返回的 peomise 对象的状态变更了才会执行，否则永远不会执行。

:lock: **6. 某大厂的真实面试题**

通过上面的学习，这道题我自己答对了哈哈哈～ :smile:

```js
async function async1() {
    console.log('async1 start') // 2
    await async2()
    console.log('async1 end') // 6
}

async function async2() {
    console.log('async2') // 3
}

console.log('script start') // 1

setTimeout(function() {
    console.log('setTimeout') // 10
}, 0)

async1()

new Promise(function(resolve) {
    console.log('promise1') // 4
    resolve()
}).then(function() {
    console.log('promise2') // 7
}).then(function() {
    console.log('promise3') // 8
}).then(function() {
    console.log('promise4') // 9
})

console.log('script end') // 5
```

执行结果如下：

![eventloop](../.vuepress/public/assets/image/javascript/eventloop4.png 'eventloop')

:lock: **7. resolve 处理 thenable，也会包裹一层 promise。**

这道题是第6题的变种。

这道题我也答对了哈哈哈～ :smile:

```js
async function async1() {
    console.log('async1 start') // 1
    return new Promise(resolve => {
        resolve(async2())
    }).then(() => {
        console.log('async1 end') // 4
    })
}

function async2() {
    console.log('async2') // 2
}

setTimeout(function() {
    console.log('setTimeout') // 8
}, 0)

async1()

new Promise(function(resolve) {
    console.log('promise1') // 3
    resolve()
}).then(function() {
    console.log('promise2') // 5
}).then(function() {
    console.log('promise3') // 6
}).then(function() {
    console.log('promise4') // 7
})
```

接下来对这段代码改动下：

在 async2 前面加上 async。

```js
async function async1() {
    console.log('async1 start') // 1
    return new Promise(resolve => {
        resolve(async2())
    }).then(() => {
        console.log('async1 end') // 6
    })
}

async function async2() {
    console.log('async2') // 2
}

setTimeout(function() {
    console.log('setTimeout') // 8
}, 0)

async1()

new Promise(function(resolve) {
    console.log('promise1') // 3
    resolve()
}).then(function() {
    console.log('promise2') // 4
}).then(function() {
    console.log('promise3') // 5
}).then(function() {
    console.log('promise4') // 7
})
```

可以看到，此时 ‘async1 end’ 出现的位置变成了在 ‘peomise3’ 和 ‘promise4’ 之间了。

:bell: 这是因为 **async2 前面加了 async 之后，会返回一个 promise，也就是说此时它本身是一个 promise，在 async1 内部 resolve 处理 thenable 时又会再包裹一层 promise**，所以它下面的代码就会比之前慢了两个位置输出。

再改一下：

async2 内部返回一个 thanable 对象

```js
async function async1() {
    console.log('async1 start') // 1
    return new Promise(resolve => {
        resolve(async2())
    }).then(() => {
        console.log('async1 end') // 5
    })
}

function async2() {
    console.log('async2') // 2
    return {
        then(r) {
            r()
        }
    }
}

setTimeout(function() {
    console.log('setTimeout') // 8
}, 0)

async1()

new Promise(function(resolve) {
    console.log('promise1') // 3
    resolve()
}).then(function() {
    console.log('promise2') // 4
}).then(function() {
    console.log('promise3') // 6
}).then(function() {
    console.log('promise4') // 7
})
```

此时 ‘async1 end’ 出现的位置变成在 ‘peomise2’ 和 ‘promise3’ 之间了。

这是因为 **async2 里面返回了一个 thenable 对象，此时虽然它本身不是一个 promise 了，但是在 async1 内部 resolve 处理 thenable 时还是会包裹一层 promise**，所以它下面的代码就会比之前慢了一个位置输出。

如果 async2 里面返回的是一个基本类型，比如 return 1，那么输出结果就会跟第一次的一样。

## :books: Node.js 中的 event loop

### :blue_book: 整体流程图

![eventloop](../.vuepress/public/assets/image/javascript/eventloop5.png 'eventloop')

### :blue_book: 异步执行队列阶段

我们主要关心红框框出来的三部分。

![eventloop](../.vuepress/public/assets/image/javascript/eventloop6.png 'eventloop')

### :blue_book: Node.js 中的任务队列

![eventloop](../.vuepress/public/assets/image/javascript/eventloop7.png 'eventloop')

### :blue_book: Node.js 中的任务比较

![eventloop](../.vuepress/public/assets/image/javascript/eventloop8.png 'eventloop')

### :blue_book: 练习题

:lock: **1. 比较 setImmediate 和 setTimeout 的执行顺序**

```js
setTimeout(_ => console.log('setTimeout'))
setImmediate(_ => console.log('setImmediate'))
```

执行结果如下：

![eventloop](../.vuepress/public/assets/image/javascript/eventloop9.png 'eventloop')

可以看到，一开始执行的时候都是先输出 setTimeout，但是后面突然就先输出 setImmediate了。所以说明这两个的执行顺序是不固定的，跟机器的性能有关。

:bell: setTimeout 是在 timers 阶段执行的，setImmediate 是在 check 阶段执行的。

如果 setTimeout 先加入到 timers 中，那么在执行完 poll 阶段后，就会先执行 timers ，再执行 check。否则的话就会先执行 check 再执行 timers。

:lock: **2. 如果两者都在 poll 阶段注册，那么顺序就能确定**

```js
const fs = require('fs')
fs.readFile('./test.html', () => {
    setTimeout(_ => console.log('setTimeout'))
    setImmediate(_ => console.log('setImmediate'))
})
```

执行结果如下：

![eventloop](../.vuepress/public/assets/image/javascript/eventloop10.png 'eventloop')

可以看到，不管执行几次，输出顺序就是固定的了，总是先输出 setImmediate，再输出 setTimeout。

这是因为两者都是在 poll 阶段注册的，那么 timers 阶段肯定来不及加入 setTimeout，所以 poll 阶段执行完毕后，就执行 check 阶段。

:lock: **3. 理解 process.nextTick**

每一个阶段执行完成之后，在当前阶段尾部触发 nextTick。

案例：常见的 node.js 回调函数第一个参数，都是抛出的错误。

```js
function apiCall(arg, callback) {
    if (typeof arg !== 'string') {
        return process.nextTick(
            callback,
            new TypeError('argument should be string')
        )
    }
}
```

:bell: node.js 所有 api 的回调函数的第一个参数都是错误对象 err。

:lock: **4. 比较 process.nextTick 和 setImmediate**

:bell: process.nextTick() 在同一个阶段尾部立即执行，也就是每个阶段的开始之前都会执行。比如从 poll 阶段到 check 阶段，肯定会先执行 process.nextTick()。

:bell: setImmediate() 在事件循环的 check 阶段触发。

```js
setImmediate(() => {
    console.log('setImmediate')
})
process.nextTick(() => {
    console.log('nextTick')
})
```

执行结果如下：

![eventloop](../.vuepress/public/assets/image/javascript/eventloop11.png 'eventloop')

可以看到，nextTick 每次都比 setImmediate 先输出。

### :blue_book: 不同 Node 版本的 event loop

![eventloop](../.vuepress/public/assets/image/javascript/eventloop12.png 'eventloop')

### :blue_book: 关于不同版本变化的几个 demo

:lock: **timers 阶段的执行时机变化**

```js
setTimeout(() => {
    console.log('timer1')
    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 0)

setTimeout(() => {
    console.log('timer2')
    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 0)
```

执行结果：

node11 之前：timer1、timer2、promise1、promise2；

node11 之后：timer1、promise1、timer2、promise2。

:lock: **check 阶段的执行时机变化**

```js
setImmediate(() => console.log('immediate1'))
setImmediate(() => {
    console.log('immediate2')
    Promise.resolve().then(() => console.log('promise resolve'))
})
setImmediate(() => console.log('immediate3'))
setImmediate(() => console.log('immediate4'))
```

执行结果：

node11 之前：immediate1、immediate2、immediate3、immediate4、promise resolve；

node11 之后：immediate1、immediate2、promise resolve、immediate3、immediate4。

:lock: **nextTick 队列的执行时机变化**

```js
setImmediate(() => console.log('immediate1'))
setImmediate(() => {
    console.log('immediate2')
    process.nextTick(() => console.log('nextTick'))
})
setImmediate(() => console.log('immediate3'))
setImmediate(() => console.log('immediate4'))
```

执行结果：

node11 之前：immediate1、immediate2、immediate3、immediate4、nextTick；

node11 之后：immediate1、immediate2、nextTick、immediate3、immediate4。

:bell: **从这里也可以看出，随着 node 版本的升高，它的 event loop 的表现跟浏览器的保持一致**。