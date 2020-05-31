这篇文章主要展示如何手写一个 Promise，这也是面试中常见的面试题。如果做到了将会大大提高面试成功的机率。

在开始之前，可以先看下原生 Promise 对象做了什么事，以及什么是 Promise/A+ 规范。因为下面的实现都是严格按照这个规范来写的。

- [Promise 对象](https://es6.ruanyifeng.com/#docs/promise)

- [Promise/A+(中文版)](https://www.ituring.com.cn/article/66566)

- [Promise/A+(英文版)](https://promisesaplus.com/)

Promise 的执行流程图如下：

![promise](../.vuepress/public/assets/image/javascript/promise.png 'promise')

## 实现思路

实现过程是按照下面这些步骤一步一步做的。

```md
一、Promise 自身的状态

1. state 存放当前的状态。

2. value 存放当前状态的值。

3. then 方法，返回值也是一个 Promise。

4. catch 方法。

5. finally 方法。

6. 静态方法，如 Promise.all、Promise.resolve

二、Promise 的实现步骤

1. 实现一个 promise ，在 setTimeout 中 resolve。

2. 实现一个 promise，直接同步 resolve。

3. 实现一个 promise，防止 resolve 多次。

4. 实现一个 promise，可以让 then 方法链式调用。

5. 实现一个 promise，支持空 then 函数。

6. 实现一个 promise，支持 then 传递 thenable 对象。

7. 实现一个 promise，支持 then 传递 promise 对象。

8. 实现一个 promise，支持 resolve 传递 promise 对象。

9. 实现一个 promise，处理 then 中的循环 promise。

10. 实现一个 promise，支持静态方法 Promise.all。

11. 实现一个 promise，支持 reject 和 catch。

12. 实现一个 promise，支持处理完成态或失败态的then。
```
## 实现步骤

注意：这里的 Promise 是根据 ES6 的 class 来写的。

**1. 实现一个 promise ，在 setTimeout 中 resolve**

```js
class MyPromise {
  constructor (fn) {
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    const resolve = (val) => {
      // 触发 resolve 时，执行所有的 then 方法
      this.resolvedCallbacks.map(fn => fn(val))
    }
    const reject = () => {}
    fn (resolve, reject)
  }
  then (onFulfilled) {
    this.resolvedCallbacks.push(onFulfilled) // 挂载传给 then 的方法
  }
}
```

测试方法

```js
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    // 自定义传的数据或者是 ajax 获取的数据
    resolve('step1')
  }, 1000)
}).then(data => {
  console.log('获取到的数据：', data)
})
console.log(promise)
```

写到这里，就实现了最最基本的 Promise 功能了。但其实在上面的实现思路中，可以看到 Promise 拥有一些自身的状态，下面就根据这些自身的状态和 Promise/A+ 规范来改进上面的代码，给它加上 state 和 value。

- 完善状态管理 state

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

class MyPromise {
  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态 
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    const resolve = (val) => {
      this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
      // 触发 resolve 时，执行所有的 then 方法
      this.resolvedCallbacks.map(fn => fn(val))
    }
    const reject = () => {
      this.state  = REJECTED // reject 触发之后变成 rejected 状态
    }
    fn (resolve, reject)
  }
  then (onFulfilled) {
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      this.resolvedCallbacks.push(onFulfilled) // 挂载传给 then 的方法
    }
  }
}
```

- 完善 value

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

class MyPromise {
  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态
    this.value = undefined // 这个 value 其实就是触发 resolve 或 reject 方法时传递的值
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    const resolve = (val) => {
      this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
      this.value = val // 将传递过来的值赋给 value
      // 触发 resolve 时，执行所有的 then 方法
      this.resolvedCallbacks.map(fn => fn(val))
    }
    const reject = (val) => {
      this.state  = REJECTED // reject 触发之后变成 rejected 状态
      this.value = val // 将传递过来的值赋给 value
    }
    fn (resolve, reject)
  }
  then (onFulfilled) {
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      this.resolvedCallbacks.push(onFulfilled) // 挂载传给 then 的方法
    }
  }
}
```

**2. 实现一个 promise，直接同步 resolve**

用 setTimeout 模拟异步执行，就可以同步 resolve 了。

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

class MyPromise {
  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态
    this.value = undefined // 这个 value 其实就是触发 resolve 或 reject 方法时传递的值
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    const resolve = (val) => {
      // 用 setTimeout 模拟异步执行，就可以同步 resolve 了
      setTimeout(() => {
        this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
        this.value = val // 将传递过来的值赋给 value
        // 触发 resolve 时，执行所有的 then 方法
        this.resolvedCallbacks.map(fn => fn(val))
      })
    }
    const reject = (val) => {
      this.state  = REJECTED // reject 触发之后变成 rejected 状态
      this.value = val // 将传递过来的值赋给 value
    }
    fn (resolve, reject)
  }
  then (onFulfilled) {
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      this.resolvedCallbacks.push(onFulfilled) // 挂载传给 then 的方法
    }
  }
}
```

测试方法

```js
// 在resolve中加了setTimeout模拟异步执行
const promise = new MyPromise((resolve, reject) => {
  resolve('step2')
}).then(data => {
  console.log('获取到的数据：', data)
})
```

**3. 实现一个 promise，防止 resolve 多次**

只需要在 resolve 里面加一个判断就可以了。

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

class MyPromise {
  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态
    this.value = undefined // 这个 value 其实就是触发 resolve 或 reject 方法时传递的值
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    const resolve = (val) => {
      // 用 setTimeout 模拟异步执行，就可以同步 resolve 了
      setTimeout(() => {
        // 防止多次调用 resolve ，一个 promise 只能调用一次 resolve
        if (this.state === PENDING) {
          this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
          this.value = val // 将传递过来的值赋给 value
          // 触发 resolve 时，执行所有的 then 方法
          this.resolvedCallbacks.map(fn => fn(val))
        }
      })
    }
    const reject = (val) => {
      this.state  = REJECTED // reject 触发之后变成 rejected 状态
      this.value = val // 将传递过来的值赋给 value
    }
    fn (resolve, reject)
  }
  then (onFulfilled) {
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      this.resolvedCallbacks.push(onFulfilled) // 挂载传给 then 的方法
    }
  }
}
```

测试方法

```js
const promise = new MyPromise((resolve, reject) => {
  resolve('step3')
  resolve('step3.1')
}).then(data => {
  console.log('获取到的数据：', data) // 获取到的数据： step3
})
```

**4. 实现一个 promise，可以让 then 方法链式调用**

每个 promise 的 then 方法都是返回一个新的 promise。

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

class MyPromise {
  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态
    this.value = undefined // 这个 value 其实就是触发 resolve 或 reject 方法时传递的值
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    const resolve = (val) => {
      // 用 setTimeout 模拟异步执行，就可以同步 resolve 了
      setTimeout(() => {
        // 防止多次调用 resolve ，一个 promise 只能调用一次 resolve
        if (this.state === PENDING) {
          this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
          this.value = val // 将传递过来的值赋给 value
          // 触发 resolve 时，执行所有的 then 方法
          this.resolvedCallbacks.map(fn => fn(val))
        }
      })
    }
    const reject = (val) => {
      this.state  = REJECTED // reject 触发之后变成 rejected 状态
      this.value = val // 将传递过来的值赋给 value
    }
    fn (resolve, reject)
  }
  then (onFulfilled) {
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      // 返回一个新的 promise，支持链式调用
      return new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          const x = onFulfilled(this.value)
          resolve(x)
        }) // 挂载传给 then 的方法
      })
    }
  }
}
```

测试方法

```js
const promise = new MyPromise((resolve, reject) => {
  resolve('step4')
}).then(data => {
  console.log('获取到的数据：', data)
  return 'step4.1'
}).then(data => {
  console.log('获取到的数据：', data)
})
```

**5. 实现一个 promise，支持空的 then 函数**

实现方法是给 then 方法的参数设定一个默认函数，给什么值就返回什么值。

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

class MyPromise {
  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态
    this.value = undefined // 这个 value 其实就是触发 resolve 或 reject 方法时传递的值
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    const resolve = (val) => {
      // 用 setTimeout 模拟异步执行，就可以同步 resolve 了
      setTimeout(() => {
        // 防止多次调用 resolve ，一个 promise 只能调用一次 resolve
        if (this.state === PENDING) {
          this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
          this.value = val // 将传递过来的值赋给 value
          // 触发 resolve 时，执行所有的 then 方法
          this.resolvedCallbacks.map(fn => fn(val))
        }
      })
    }
    const reject = (val) => {
      this.state  = REJECTED // reject 触发之后变成 rejected 状态
      this.value = val // 将传递过来的值赋给 value
    }
    fn (resolve, reject)
  }
  then (
    onFulfilled = val => val  // 支持调用空的 then 方法
  ) {
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      // 返回一个新的 promise，支持链式调用
      return new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          const x = onFulfilled(this.value)
          resolve(x)
        }) // 挂载传给 then 的方法
      })
    }
  }
}
```

测试方法

```js
const promise = new MyPromise((resolve, reject) => {
  resolve('step5')
}).then(data => {
  console.log('获取到的数据：', data)
  return 'step5.1'
})
.then()
.then(data => {
  console.log('获取到的数据：', data)
})
```

**6. 实现一个 promise，支持 then 传递 thenable 对象**

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

class MyPromise {
  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态
    this.value = undefined // 这个 value 其实就是触发 resolve 或 reject 方法时传递的值
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    const resolve = (val) => {
      // 用 setTimeout 模拟异步执行，就可以同步 resolve 了
      setTimeout(() => {
        // 防止多次调用 resolve ，一个 promise 只能调用一次 resolve
        if (this.state === PENDING) {
          this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
          this.value = val // 将传递过来的值赋给 value
          // 触发 resolve 时，执行所有的 then 方法
          this.resolvedCallbacks.map(fn => fn(val))
        }
      })
    }
    const reject = (val) => {
      this.state  = REJECTED // reject 触发之后变成 rejected 状态
      this.value = val // 将传递过来的值赋给 value
    }
    fn (resolve, reject)
  }
  then (
    onFulfilled = val => val  // 支持调用空的 then 方法
  ) {
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      // 返回一个新的 promise，支持链式调用
      const promise2 = new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          const x = onFulfilled(this.value)
          // 判断为一个 thenable 对象，需要排除掉 x === null 这个特例
          // 因为 typeof null === 'object'
          if ((typeof x === 'object' || typeof x === 'function') && x !== null) {
            if (typeof x.then === 'function') { // 还需要判断 x 的 then 是不是一个方法
              x.then(y => {
                resolve(y)
              })
            } else {
              resolve(x)
            }
          } else {
            resolve(x)
          }
        }) // 挂载传给 then 的方法
      })
      return promise2
    }
  }
}
```

这样就实现功能了，但是这里其实还有问题。那就是没有考虑到 y 也可能是一个 thenable 对象的情况。如果 y 也是一个 thenable 对象，那么就需要递归处理。因此，需要把 then 方法里面的判断逻辑抽成一个单独的处理方法 promiseResolutionProcedure。

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

function promiseResolutionProcedure (promise2, x, resolve, reject) {
  // 判断为一个 thenable 对象，需要排除掉 x === null 这个特例
  // 因为 typeof null === 'object'
  if ((typeof x === 'object' || typeof x === 'function') && x !== null) {
    if (typeof x.then === 'function') { // 还需要判断 x 的 then 是不是一个方法
      x.then(y => {
        // y 可能也是一个 thenable 对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {
  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态
    this.value = undefined // 这个 value 其实就是触发 resolve 或 reject 方法时传递的值
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    const resolve = (val) => {
      // 用 setTimeout 模拟异步执行，就可以同步 resolve 了
      setTimeout(() => {
        // 防止多次调用 resolve ，一个 promise 只能调用一次 resolve
        if (this.state === PENDING) {
          this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
          this.value = val // 将传递过来的值赋给 value
          // 触发 resolve 时，执行所有的 then 方法
          this.resolvedCallbacks.map(fn => fn(val))
        }
      })
    }
    const reject = (val) => {
      this.state  = REJECTED // reject 触发之后变成 rejected 状态
      this.value = val // 将传递过来的值赋给 value
    }
    fn (resolve, reject)
  }
  then (
    onFulfilled = val => val  // 支持调用空的 then 方法
  ) {
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      // 返回一个新的 promise，支持链式调用
      const promise2 = new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          const x = onFulfilled(this.value)
          promiseResolutionProcedure(promise2, x, resolve, reject)
        }) // 挂载传给 then 的方法
      })
      return promise2
    }
  }
}
```

测试方法

```js
const promise = new MyPromise((resolve, reject) => {
  resolve('step6')
}).then(data => {
  console.log('获取到的数据：', data)
  // 这里返回的对象就是常说的 thenable 对象，含有一个 then 方法，
  // promise 在解析的时候，会将它当成一个 promise 对象去解析
  return {
    then (r, j) {
      r('step6.1') // 相当于执行resolve
    }
  }
}).then(data => {
  console.log('获取到的数据：', data)
})
```

**7. 实现一个 promise，支持 then 传递 promise 对象**

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

function promiseResolutionProcedure (promise2, x, resolve, reject) {
  // 单独处理promise对象
  if (x instanceof MyPromise) {
    if (x.state === PENDING) {
      x.then(y => {
        // y 可能也是一个 promise 对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      x.state = FULFILLED && resolve(x.value)
      x.state = REJECTED && reject(x.value)
    }
  }

  // 判断为一个 thenable 对象，需要排除掉 x === null 这个特例
  // 因为 typeof null === 'object'
  // 虽然这里的判断也能识别 promise 对象，把它当成 thenable 对象处理，
  // 但是这其实是不规范的，所以还是需要单独处理 promise 对象
  if ((typeof x === 'object' || typeof x === 'function') && x !== null) {
    if (typeof x.then === 'function') { // 还需要判断 x 的 then 是不是一个方法
      x.then(y => {
        // y 可能也是一个 thenable 对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {
  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态
    this.value = undefined // 这个 value 其实就是触发 resolve 或 reject 方法时传递的值
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    const resolve = (val) => {
      // 用 setTimeout 模拟异步执行，就可以同步 resolve 了
      setTimeout(() => {
        // 防止多次调用 resolve ，一个 promise 只能调用一次 resolve
        if (this.state === PENDING) {
          this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
          this.value = val // 将传递过来的值赋给 value
          // 触发 resolve 时，执行所有的 then 方法
          this.resolvedCallbacks.map(fn => fn(val))
        }
      })
    }
    const reject = (val) => {
      this.state  = REJECTED // reject 触发之后变成 rejected 状态
      this.value = val // 将传递过来的值赋给 value
    }
    fn (resolve, reject)
  }
  then (
    onFulfilled = val => val  // 支持调用空的 then 方法
  ) {
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      // 返回一个新的 promise，支持链式调用
      const promise2 = new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          const x = onFulfilled(this.value)
          promiseResolutionProcedure(promise2, x, resolve, reject)
        }) // 挂载传给 then 的方法
      })
      return promise2
    }
  }
}
```

测试方法

```js
const promise = new MyPromise((resolve, reject) => {
  resolve('step7')
}).then(data => {
  console.log('获取到的数据：', data)
  return new MyPromise((resolve, reject) => {
    resolve('step7.1')
  })
}).then(data => {
  console.log('获取到的数据：', data)
})
```

**8. 实现一个 promise，支持 resolve 传递 promise 对象**

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

function promiseResolutionProcedure (promise2, x, resolve, reject) {
  // 单独处理promise对象
  if (x instanceof MyPromise) {
    if (x.state === PENDING) {
      x.then(y => {
        // y 可能也是一个 promise 对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      x.state = FULFILLED && resolve(x.value)
      x.state = REJECTED && reject(x.value)
    }
  }

  // 判断为一个 thenable 对象，需要排除掉 x === null 这个特例
  // 因为 typeof null === 'object'
  // 虽然这里的判断也能识别 promise 对象，把它当成 thenable 对象处理，
  // 但是这其实是不规范的，所以还是需要单独处理 promise 对象
  if ((typeof x === 'object' || typeof x === 'function') && x !== null) {
    if (typeof x.then === 'function') { // 还需要判断 x 的 then 是不是一个方法
      x.then(y => {
        // y 可能也是一个 thenable 对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {
  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态
    this.value = undefined // 这个 value 其实就是触发 resolve 或 reject 方法时传递的值
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    const resolve = (val) => {
      // 如果 resolve 传进来的是一个 promise 对象，那么也需要调用处理方法进行处理
      if (typeof val === 'object' || typeof val === 'function') {
        promiseResolutionProcedure(this, val, resolve, reject)
        return
      }
      // 用 setTimeout 模拟异步执行，就可以同步 resolve 了
      setTimeout(() => {
        // 防止多次调用 resolve ，一个 promise 只能调用一次 resolve
        if (this.state === PENDING) {
          this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
          this.value = val // 将传递过来的值赋给 value
          // 触发 resolve 时，执行所有的 then 方法
          this.resolvedCallbacks.map(fn => fn(val))
        }
      })
    }
    const reject = (val) => {
      this.state  = REJECTED // reject 触发之后变成 rejected 状态
      this.value = val // 将传递过来的值赋给 value
    }
    fn (resolve, reject)
  }
  then (
    onFulfilled = val => val  // 支持调用空的 then 方法
  ) {
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      // 返回一个新的 promise，支持链式调用
      const promise2 = new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          const x = onFulfilled(this.value)
          promiseResolutionProcedure(promise2, x, resolve, reject)
        }) // 挂载传给 then 的方法
      })
      return promise2
    }
  }
}
```

测试方法

```js
const promise = new MyPromise((resolve, reject) => {
  resolve(new Promise((resolve) => {
    resolve('step8')
  }))
}).then(data => {
  console.log('获取到的数据：', data)
})
```

**9. 实现一个 promise，处理 then 中的循环 promise**

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

function promiseResolutionProcedure (promise2, x, resolve, reject) {
  // 处理 promise 的循环引用
  if (promise2 === x) {
    throw new Error('循环引用 promise')
  }

  // 单独处理promise对象
  if (x instanceof MyPromise) {
    if (x.state === PENDING) {
      x.then(y => {
        // y 可能也是一个 promise 对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      x.state = FULFILLED && resolve(x.value)
      x.state = REJECTED && reject(x.value)
    }
  }

  // 判断为一个 thenable 对象，需要排除掉 x === null 这个特例
  // 因为 typeof null === 'object'
  // 虽然这里的判断也能识别 promise 对象，把它当成 thenable 对象处理，
  // 但是这其实是不规范的，所以还是需要单独处理 promise 对象
  if ((typeof x === 'object' || typeof x === 'function') && x !== null) {
    if (typeof x.then === 'function') { // 还需要判断 x 的 then 是不是一个方法
      x.then(y => {
        // y 可能也是一个 thenable 对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {
  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态
    this.value = undefined // 这个 value 其实就是触发 resolve 或 reject 方法时传递的值
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    const resolve = (val) => {
      // 如果 resolve 传进来的是一个 promise 对象，那么也需要调用处理方法进行处理
      if (typeof val === 'object' || typeof val === 'function') {
        promiseResolutionProcedure(this, val, resolve, reject)
        return
      }
      // 用 setTimeout 模拟异步执行，就可以同步 resolve 了
      setTimeout(() => {
        // 防止多次调用 resolve ，一个 promise 只能调用一次 resolve
        if (this.state === PENDING) {
          this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
          this.value = val // 将传递过来的值赋给 value
          // 触发 resolve 时，执行所有的 then 方法
          this.resolvedCallbacks.map(fn => fn(val))
        }
      })
    }
    const reject = (val) => {
      this.state  = REJECTED // reject 触发之后变成 rejected 状态
      this.value = val // 将传递过来的值赋给 value
    }
    fn (resolve, reject)
  }
  then (
    onFulfilled = val => val  // 支持调用空的 then 方法
  ) {
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      // 返回一个新的 promise，支持链式调用
      const promise2 = new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          const x = onFulfilled(this.value)
          promiseResolutionProcedure(promise2, x, resolve, reject)
        }) // 挂载传给 then 的方法
      })
      return promise2
    }
  }
}
```

测试方法

```js
const promise = new MyPromise((resolve, reject) => {
  resolve('step9')
})
// 这里循环引用 promise，原生的是会报错的，所以这里我们也需要处理
const promise1 = promise.then(data => {
  return promise1
})
```

**10. 实现一个 promise，支持静态方法 Promise.all**

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

function promiseResolutionProcedure (promise2, x, resolve, reject) {
  // 处理 promise 的循环引用
  if (promise2 === x) {
    throw new Error('循环引用 promise')
  }

  // 单独处理promise对象
  if (x instanceof MyPromise) {
    if (x.state === PENDING) {
      x.then(y => {
        // y 可能也是一个 promise 对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      x.state = FULFILLED && resolve(x.value)
      x.state = REJECTED && reject(x.value)
    }
  }

  // 判断为一个 thenable 对象，需要排除掉 x === null 这个特例
  // 因为 typeof null === 'object'
  // 虽然这里的判断也能识别 promise 对象，把它当成 thenable 对象处理，
  // 但是这其实是不规范的，所以还是需要单独处理 promise 对象
  if ((typeof x === 'object' || typeof x === 'function') && x !== null) {
    if (typeof x.then === 'function') { // 还需要判断 x 的 then 是不是一个方法
      x.then(y => {
        // y 可能也是一个 thenable 对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {
  static all (promiseArray) { // 接收的参数是一个元素都为 promise 的数组
    // all 方法返回的也是一个 promise
    return new MyPromise((resolve, reject) => {
      const resultArray = [] // 记录 resolve 的结果
      let successTimes = 0 // 记录成功的次数

      function processResult (index, data) {
        resultArray[index] = data
        successTimes++
        if (successTimes === promiseArray.length) {
          // 所有的 promise 都处理成功
          resolve(resultArray)
        }
      }

      for (let i = 0; i < promiseArray.length; i++) {
        promiseArray[i].then(data => {
          processResult(i ,data)
        }, err => {
          // 处理失败
          reject(err)
        })
      }
    })
  }

  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态
    this.value = undefined // 这个 value 其实就是触发 resolve 或 reject 方法时传递的值
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    const resolve = (val) => {
      // 如果 resolve 传进来的是一个 promise 对象，那么也需要调用处理方法进行处理
      if ((typeof val === 'object' || typeof val === 'function') && val.then) { // 这里加 val.then 这个条件的原因是在调用 all 方法时有问题
        promiseResolutionProcedure(this, val, resolve, reject)
        return
      }
      // 用 setTimeout 模拟异步执行，就可以同步 resolve 了
      setTimeout(() => {
        // 防止多次调用 resolve ，一个 promise 只能调用一次 resolve
        if (this.state === PENDING) {
          this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
          this.value = val // 将传递过来的值赋给 value
          // 触发 resolve 时，执行所有的 then 方法
          this.resolvedCallbacks.map(fn => fn(val))
        }
      })
    }
    const reject = (val) => {
      this.state  = REJECTED // reject 触发之后变成 rejected 状态
      this.value = val // 将传递过来的值赋给 value
    }
    fn (resolve, reject)
  }
  then (
    onFulfilled = val => val  // 支持调用空的 then 方法
  ) {
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      // 返回一个新的 promise，支持链式调用
      const promise2 = new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          const x = onFulfilled(this.value)
          promiseResolutionProcedure(promise2, x, resolve, reject)
        }) // 挂载传给 then 的方法
      })
      return promise2
    }
  }
}
```

测试方法

```js
MyPromise.all([
  new MyPromise(resolve => {
    resolve(1)
  }), new MyPromise(resolve => {
    resolve(2)
  })
]).then(dataList => {
  console.log(dataList) // [1, 2]
})
```

**11. 实现一个 promise，支持 reject 和 catch**

reject 方法和 resolve 方法实现基本上是一样的。

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

function promiseResolutionProcedure (promise2, x, resolve, reject) {
  // 处理 promise 的循环引用
  if (promise2 === x) {
    throw new Error('循环引用 promise')
  }

  // 单独处理promise对象
  if (x instanceof MyPromise) {
    if (x.state === PENDING) {
      x.then(y => {
        // y 可能也是一个 promise 对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      x.state = FULFILLED && resolve(x.value)
      x.state = REJECTED && reject(x.value)
    }
  }

  // 判断为一个 thenable 对象，需要排除掉 x === null 这个特例
  // 因为 typeof null === 'object'
  // 虽然这里的判断也能识别 promise 对象，把它当成 thenable 对象处理，
  // 但是这其实是不规范的，所以还是需要单独处理 promise 对象
  if ((typeof x === 'object' || typeof x === 'function') && x !== null) {
    if (typeof x.then === 'function') { // 还需要判断 x 的 then 是不是一个方法
      x.then(y => {
        // y 可能也是一个 thenable 对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {
  static all (promiseArray) { // 接收的参数是一个元素都为 promise 的数组
    // all 方法返回的也是一个 promise
    return new MyPromise((resolve, reject) => {
      const resultArray = [] // 记录 resolve 的结果
      let successTimes = 0 // 记录成功的次数

      function processResult (index, data) {
        resultArray[index] = data
        successTimes++
        if (successTimes === promiseArray.length) {
          // 所有的 promise 都处理成功
          resolve(resultArray)
        }
      }

      for (let i = 0; i < promiseArray.length; i++) {
        promiseArray[i].then(data => {
          processResult(i ,data)
        }, err => {
          // 处理失败
          reject(err)
        })
      }
    })
  }

  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态
    this.value = undefined // 这个 value 其实就是触发 resolve 或 reject 方法时传递的值
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    this.rejectedCallbacks = []
    const resolve = (val) => {
      // 如果 resolve 传进来的是一个 promise 对象，那么也需要调用处理方法进行处理
      if ((typeof val === 'object' || typeof val === 'function') && val.then) { // 这里加 val.then 这个条件的原因是在调用 all 方法时有问题
        promiseResolutionProcedure(this, val, resolve, reject)
        return
      }
      // 用 setTimeout 模拟异步执行，就可以同步 resolve 了
      setTimeout(() => {
        // 防止多次调用 resolve ，一个 promise 只能调用一次 resolve
        if (this.state === PENDING) {
          this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
          this.value = val // 将传递过来的值赋给 value
          // 触发 resolve 时，执行所有的 then 方法
          this.resolvedCallbacks.map(fn => fn(val))
        }
      })
    }
    const reject = (val) => {
      if ((typeof val === 'object' || typeof val === 'function') && val.then) {
        promiseResolutionProcedure(this, val, resolve, reject)
        return
      }
      setTimeout(() => {
        if (this.state === PENDING) { // 防止多次调用resolve
          this.state  = REJECTED // reject 触发之后变成 rejected 状态
          this.value = val // 将传递过来的值赋给 value
          // 触发 resolve 时，就去执行所有的 then 方法
          this.rejectedCallbacks.map(fn => fn())
        }
      })
    }
    fn (resolve, reject)
  }
  then (
    onFulfilled = val => val,  // 支持调用空的 then 方法
    onRejected = err => {
      throw new Error(err)
    }
  ) {
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      // 返回一个新的 promise，支持链式调用
      const promise2 = new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          const x = onFulfilled(this.value)
          promiseResolutionProcedure(promise2, x, resolve, reject)
        }) // 挂载传给 then 的方法
        this.rejectedCallbacks.push(() => {
          const x = onRejected(this.value)
          promiseResolutionProcedure(promise2, x, resolve, reject)
        })
      })
      return promise2
    }
  }
}
```

测试方法

```js
const promise = new MyPromise((resolve, reject) => {
  reject('step11')
}).then(data => {
  console.log('resolve 的值：', data)
}, err => {
  console.log('reject 的值：', err)
})
```

**12. 实现一个 promise，支持处理完成态或失败态的 then**

```js
// 定义 Promise 的 3 种状态
const PENDING = 'PENDING' // 等待态
const FULFILLED = 'FULFILLED' // 执行态
const REJECTED = 'REJECTED' // 拒绝态

function promiseResolutionProcedure (promise2, x, resolve, reject) {
  // 处理 promise 的循环引用
  if (promise2 === x) {
    throw new Error('循环引用 promise')
  }

  // 单独处理promise对象
  if (x instanceof MyPromise) {
    if (x.state === PENDING) {
      x.then(y => {
        // y 可能也是一个 promise 对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      x.state = FULFILLED && resolve(x.value)
      x.state = REJECTED && reject(x.value)
    }
  }

  // 判断为一个 thenable 对象，需要排除掉 x === null 这个特例
  // 因为 typeof null === 'object'
  // 虽然这里的判断也能识别 promise 对象，把它当成 thenable 对象处理，
  // 但是这其实是不规范的，所以还是需要单独处理 promise 对象
  if ((typeof x === 'object' || typeof x === 'function') && x !== null) {
    if (typeof x.then === 'function') { // 还需要判断 x 的 then 是不是一个方法
      x.then(y => {
        // y 可能也是一个 thenable 对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {
  static all (promiseArray) { // 接收的参数是一个元素都为 promise 的数组
    // all 方法返回的也是一个 promise
    return new MyPromise((resolve, reject) => {
      const resultArray = [] // 记录 resolve 的结果
      let successTimes = 0 // 记录成功的次数

      function processResult (index, data) {
        resultArray[index] = data
        successTimes++
        if (successTimes === promiseArray.length) {
          // 所有的 promise 都处理成功
          resolve(resultArray)
        }
      }

      for (let i = 0; i < promiseArray.length; i++) {
        promiseArray[i].then(data => {
          processResult(i ,data)
        }, err => {
          // 处理失败
          reject(err)
        })
      }
    })
  }

  constructor (fn) {
    this.state  = PENDING // 一开始是 pending 状态
    this.value = undefined // 这个 value 其实就是触发 resolve 或 reject 方法时传递的值
    // 由于一个 Promise 可以挂载多个 then 方法，并且 then 之间是串行的，
    // 因此我们需要把这些方法缓存起来，当触发 resolve 时就去执行它们
    this.resolvedCallbacks = []
    this.rejectedCallbacks = []
    const resolve = (val) => {
      // 如果 resolve 传进来的是一个 promise 对象，那么也需要调用处理方法进行处理
      if ((typeof val === 'object' || typeof val === 'function') && val.then) { // 这里加 val.then 这个条件的原因是在调用 all 方法时有问题
        promiseResolutionProcedure(this, val, resolve, reject)
        return
      }
      // 用 setTimeout 模拟异步执行，就可以同步 resolve 了
      setTimeout(() => {
        // 防止多次调用 resolve ，一个 promise 只能调用一次 resolve
        if (this.state === PENDING) {
          this.state  = FULFILLED // resolve 触发之后变成 fulfilled 状态
          this.value = val // 将传递过来的值赋给 value
          // 触发 resolve 时，执行所有的 then 方法
          this.resolvedCallbacks.map(fn => fn(val))
        }
      })
    }
    const reject = (val) => {
      if ((typeof val === 'object' || typeof val === 'function') && val.then) {
        promiseResolutionProcedure(this, val, resolve, reject)
        return
      }
      setTimeout(() => {
        if (this.state === PENDING) { // 防止多次调用resolve
          this.state  = REJECTED // reject 触发之后变成 rejected 状态
          this.value = val // 将传递过来的值赋给 value
          // 触发 resolve 时，就去执行所有的 then 方法
          this.rejectedCallbacks.map(fn => fn())
        }
      })
    }
    fn (resolve, reject)
  }
  then (
    onFulfilled = val => val,  // 支持调用空的 then 方法
    onRejected = err => {
      throw new Error(err)
    }
  ) {
    let promise2 = null
    // 处理完成态的 promise
    if (this.state === FULFILLED) {
      promise2 = new MyPromise((resolve, reject) => {
        const x = onFulfilled(this.value)
        promiseResolutionProcedure(promise2, x, resolve, reject)
      })
    }
    // 处理拒绝态的 promise
    if (this.state === REJECTED) {
      promise2 = new MyPromise((resolve, reject) => {
        const x = onRejected(this.value)
        promiseResolutionProcedure(promise2, x, resolve, reject)
      })
    }
    // 处理等待态的 promise
    // 只有状态为 pending 时，才会需要挂载函数；否则就不需要再去挂载，直接执行就可以了
    if (this.state === PENDING) {
      // 返回一个新的 promise，支持链式调用
      const promise2 = new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          const x = onFulfilled(this.value)
          promiseResolutionProcedure(promise2, x, resolve, reject)
        }) // 挂载传给 then 的方法
        this.rejectedCallbacks.push(() => {
          const x = onRejected(this.value)
          promiseResolutionProcedure(promise2, x, resolve, reject)
        })
      })
    }
    return promise2
  }
}
```

测试方法

```js
const promise = new MyPromise((resolve, reject) => {
  resolve('step12')
})
setTimeout(() => {
  promise.then(data => {
    console.log('step12:', data)
  })
  promise.then(data => {
    console.log('step12:', data)
  })
}, 1000)
```

## 实现结果

- 下面是整个手写的 Promise 代码

```js
// 定义 Promise 的三种状态
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

// 处理过程函数
function promiseResolutionProcedure (promise2, x, resolve, reject) {
  // 处理 promise 的循环引用
  if (promise2 === x) {
    throw new Error('循环引用 promise')
  }

  // 单独处理promise对象
  if (x instanceof MyPromise) {
    if (x.state === PENDING) {
      x.then(y => {
        // y可能也是一个promise对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject)
    } else {
      x.state = FULFILLED && resolve(x.value)
      x.state = REJECTED && reject(x.value)
    }
  }

  // 虽然这里的判断也能识别promise对象，但是这其实是不规范的，所以还是需要单独处理promise对象
  if ((typeof x === 'object' || typeof x === 'function') && x !== null) {
    if (typeof x.then === 'function') {
      // 判断为一个thenable对象，并且它的then是一个方法，那么就调用它的then方法
      x.then(y => {
        // y可能也是一个thenable对象，所以这里需要递归调用
        promiseResolutionProcedure(promise2, y, resolve, reject)
      }, reject) // 如果失败了，就直接调用reject
    } else {
      // 否则直接resolve(x)
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {
  static all (promiseArray) { // 接收的参数是一个元素都为 promise 的数组
    // all 方法返回的也是一个 promise
    return new MyPromise((resolve, reject) => {
      const resultArray = [] // 记录 resolve 的结果
      let successTimes = 0 // 记录成功的次数

      function processResult (index, data) {
        resultArray[index] = data
        successTimes++
        if (successTimes === promiseArray.length) {
          // 所有的 promise 都处理成功
          resolve(resultArray)
        }
      }

      for (let i = 0; i < promiseArray.length; i++) {
        promiseArray[i].then(data => {
          processResult(i ,data)
        }, err => {
          // 处理失败
          reject(err)
        })
      }
    })
  }

  constructor (fn) {
    this.state = PENDING // 每个promise都有自己的状态
    this.value = undefined // 每个promise都有自己的值，这个值就是触发resolve或者reject时传递的值

    this.resolvedCallbacks = []
    this.rejectedCallbacks = []

    const resolve = val => {
      // 如果 resolve 传进来的是一个 promise 对象，那么也需要调用处理方法进行处理
      if ((typeof val === 'object' || typeof val === 'function') && val.then) {
        promiseResolutionProcedure(this, val, resolve, reject)
        return
      }
      setTimeout(() => {
        if (this.state === PENDING) { // 防止多次调用resolve
          this.state = FULFILLED
          this.value = val
              
          // 触发 resolve 时，就去执行所有的 then 方法
          this.resolvedCallbacks.map(fn => fn())
        }
      })
    }
    const reject = val => {
      if ((typeof val === 'object' || typeof val === 'function') && val.then) {
        promiseResolutionProcedure(this, val, resolve, reject)
        return
      }
      setTimeout(() => {
        if (this.state === PENDING) { // 防止多次调用resolve
          this.value = val
          this.state = REJECTED
              
          // 触发 resolve 时，就去执行所有的 then 方法
          this.rejectedCallbacks.map(fn => fn())
          }
      })
    }
    fn(resolve, reject)
  }

  then (
    onFullfilled = val => val,
    onRejected = err => {
      throw new Error(err)
    }
  ) { // 加一个默认函数，传什么就返回什么，用来支持调用空的then
    let promise2 = null

    // 处理完成态的 promise
    if (this.state === FULFILLED) {
      promise2 = new MyPromise((resolve, reject) => {
        const x = onFullfilled(this.value)
        promiseResolutionProcedure(promise2, x, resolve, reject)
      })
    }

    // 处理拒绝态的 promise
    if (this.state === REJECTED) {
      promise2 = new MyPromise((resolve, reject) => {
        const x = onRejected(this.value)
        promiseResolutionProcedure(promise2, x, resolve, reject)
      })
    }

    // 处理尚未完成的 promise
    // 如果 promise 的状态是 PENDING，才需要挂载传给 then 的函数，
    // 否则的话直接执行就可以了
    if (this.state === PENDING) {
      // 返回一个新的promise，支持链式调用
      promise2 = new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          const x = onFullfilled(this.value)
          promiseResolutionProcedure(promise2, x, resolve, reject)
        })
        this.rejectedCallbacks.push(() => {
          const x = onRejected(this.value)
          promiseResolutionProcedure(promise2, x, resolve, reject)
        })
      })
    }
    return promise2
  }
}
```

整个代码虽然只有150行左右，但是如果想要自己独立写出来，并不是一件容易的事。需要多练多写，下面就分解下这段代码。从最简单的功能实现开始，一步一步完成这个 Promise 的实现。