## 基础测试 A

:lock: 1.1 请写出弹出值，并解释为什么。

```js
alert(a)
a()
var a = 3
function a () {
  alert(10)
}
alert(a)
a = 6
a()
```

> 答案解析：

- `undefined` 和 `not defined` 不是一个东西。undefined 说明这个变量没赋值，但是是存在的；not defined 报错，说明这个变量压根就不存在。

- js 在预编译的时候会把所有带 var 的变量**提升到函数顶端**。下面就是 **js 中的私有变量，在函数外部是访问不到的**。

```js
function init () {
  // 私有变量
  var a = 20
}
init()
console.log(a) // a is not defined
```

- **函数和变量都会提升，但是函数提升的优先级高于变量提升**。

下面这样写，函数能够正常执行并输出123。

```js
test() // 123
function test () {
  console.log(123)
}
```

但是变量按照这样写的话就不行了。

```js
console.log(a)
var a = 20 // undefined
```

如果改成下面这样就可以了。这是因为变量还有**词法作用域**。

```js
var a
console.log(a) // 直接复制到chrome开发工具中是输出 20，但是在文件中打开输出的是 undefined
a = 20
```

- **匿名函数**

```js
(function () {
  console.log(123)
  debugger
})()
```

上面这段代码中，有一个匿名函数，执行代码后在浏览器中可以看到堆栈调用的显示。

![jstest](../.vuepress/public/assets/image/javascript/jstest1.png 'jstest')

但是奇怪的是，明明我们只写了一个匿名函数，在堆栈中却看到有两个匿名函数。这是因为 js 在执行代码时，会像 C 和 Java 那样**把所有的代码放到一个统一的主入口中去执行**，在 C 和 Java 中这个入口就是 main 函数。但是在 js 中没有 main 函数，而是一个匿名函数。

因此，上面的代码其实在 js 中是包裹到这样一个匿名函数中执行的，我们才会看到有两个匿名函数。

```js
(function () {
  (function () {
    console.log(123)
    debugger
  })()
})()
```

- 块级作用域

ES6 的 let 和 const 都具有块级作用域。

```js
{
  a = 30
}
console.log(a) // 30

{
  const a = 30
}
console.log(a) // a is not defined
```

块级作用域会造成暂时性死区。

a 在 const 声明之前使用，会报错。 

```js
var a = 30
{
  a = 40
  const a
}
console.log(a) // Uncaught SyntaxError: Missing initializer in const declaration
```

函数没有块级作用域。

```js
{
  function test () {}
}
console.log(test) // ƒ test () {}
```

下面这样写就会有问题。

```js
{
  const test = function test () {}
}
console.log(test) // Uncaught ReferenceError: test is not defined

{
  var test = function test () {}
}
console.log(test) // ƒ test () {}
```
下面这几点也是需要注意的！

```js
// 由于词法作用域的存在，下面的变量 shenzhen 会把函数 shenzhen 覆盖掉，输出1
function shenzhen () {}
var shenzhen  = 1
console.log(shenzhen) // 1

// 不同浏览器表现不一样，以Chrome为主
// 变量 shenzhen 没有赋值，为 undefined，浏览器会把它忽略掉，所以输出 shenzhen 这个函数
function shenzhen () {}
var shenzhen
console.log(shenzhen) // ƒ shenzhen () {}

// 但是如果我们显示给它赋值，输出的就是 undefined 了
function shenzhen () {}
var shenzhen = undefined
console.log(shenzhen) // undefined
```

因此，对于这一题，我们可以对它“翻译”如下，就很容易得到它的运行结果：

```js
var a
function a () {
  alert(10)
}
alert(a) // function a() { alert(10) }
a() // 10
a = 3
alert(a) // 3
a = 6
a() // Uncaught TypeError: a is not a function
```

函数提升还有一有些需要注意的地方，比如下面这些例子。

```js
function fn () {
  console.log(1)
}
// 相当于在这里有一句声明：var fn
// 但是因为在这外面还定义了另一个 fn，所以覆盖掉了
if (false) {
  // 此处函数会发生提升
  function fn () {
    console.log(2)
  }
}
console.log(fn)
/*
  ƒ fn () {
    console.log(1)
  }
*/

function fn () {
  console.log(1)
}
function init () {
  // 相当于这里其实有一句声明：var fn
  if (false) {
    // 此处函数会提升到外层函数顶端，但是提升的只是函数名，不是函数体
    function fn () {
      console.log(2)
    }
  }
  console.log(fn)
}
init() // undefined

function fn () {
  console.log(1)
}
function init () {
  console.log(fn)
  if (false) {
    function fn () {
      console.log(2)
    }
  }
}
init() // undefined
```

:lock: 1.2 下面这道题在上一题的基础上加强一下。

```js
var x = 1, y = 0, z = 0
function add (x) {
  return (x = x + 1)
}
y = add(x)
console.log(y)
function add (x) {
  return (x = x + 3)
}
z = add(x)
console.log(z)
```

> 答案解析：

对于这道题，首先来看上半部分：

```js
var x = 1, y = 0, z = 0
function add (x) {
  return (x = x + 1)
}
y = add(x)
console.log(y) // 2
```

可以看到输出 y 的值为2。

这时候如果把下半部分还回来：

```js
var x = 1, y = 0, z = 0
function add (x) {
  return (x = x + 1)
}
y = add(x)
console.log(y) // 4
function add (x) {
  return (x = x + 3)
}
z = add(x)
console.log(z) // 4
```

可以看到输出 y 和 z 值都是4。这是因为两个函数都发生了提升，并且下面的 add 函数把上面的 add 函数重写覆盖了，所以最后起作用的函数就是下面那个。需要注意的是，这里 (x = x + 1) 其实就是一句赋值语句而已，跟 x = x + 1 没什么区别，加个括号只是想干扰而已。

:lock: 2.1 请写出如下输出值，并解释为什么。

```js
this.a = 20
function go () {
  console.log(this.a)
  this.a = 30
}
go.prototype.a = 40
var test = {
  a: 50,
  init: function (fn) {
    fn()
    console.log(this.a)
    return fn
  }
}
console.log((new go()).a)
test.init(go)
var p = test.init(go)
p()
```

> 答案解析：

- **globalThis**

现在有一个全局属性 [globalThis](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis) 包含全局的 this 值，类似于全局对象。

JavaScript 语言存在一个顶层对象，它提供全局环境（即全局作用域），所有代码都是在这个环境中运行。但是，顶层对象在各种实现里面是不统一的。

浏览器里面，顶层对象是 window，但 Node 和 Web Worker 没有 window。
浏览器和 Web Worker 里面，self 也指向顶层对象，但是 Node 没有 self。
Node 里面，顶层对象是 global，但其他环境都不支持。

为了能够在任何情况下，都能够取到顶层对象，ES6 引入了 globalThis 作为顶层对象。在任何环境下，globalThis 都是存在的，都可以从它拿到顶层对象，只想全局环境下的 this。

- **self 属性**

[self](https://www.w3school.com.cn/jsref/prop_win_self.asp) 属性返回对窗口自身的只读引用。等价于 [window](https://www.w3school.com.cn/jsref/dom_obj_window.asp) 属性。

**我们平时在保存 this 时不要写成 var self = this，因为这样会把 self 属性重写了**，可以用 var that = this 这种方式。

```js
self.self === self // true
```

现在我们把这道题拆开来看：

```js
this.a = 20
var test = {
  a: 50,
  init: function (fn) {
    console.log(this.a)
  }
}
test.init() // 50
```

**谁调用它，this 就指向谁**。在这里，test 调用了的 init 函数，因此这里的 this 指向了 test，所以输出的值为 50。

但如果这时候使用的是箭头函数，就不一样了。

```js
this.a = 20
var test = {
  a: 50,
  init: () => {
    console.log(this.a)
  }
}
test.init() // 20
```

**箭头函数会让 this 指向 window**。

在此基础上，再对它复杂化一些：

```js
this.a = 20
var test = {
  a: 50,
  init: function (fn) {
    function go () {
      console.log(this.a)
    }
    go()
  }
}
test.init() // 20
```

这段代码中，go 函数执行的时候没有人去调用它，因此它里面的 this 指向的是 window 对象，所以输出的值为 20。

但是在严格模式下，不让 this 指向 window 对象，会报错。

```js
'use strict'
this.a = 20
var test = {
  a: 50,
  init: function (fn) {
    function go () {
      console.log(this.a)
    }
    go()
  }
}
test.init() // Uncaught TypeError: Cannot read property 'a' of undefined
```

改成箭头函数：

```js
this.a = 20
var test = {
  a: 50,
  init: () => {
    function go () {
      console.log(this.a)
    }
    go()
  }
}
test.init() // 20
```

输出还是一样

但是在严格模式下也会报错：

```js
'use strict'
this.a = 20
var test = {
  a: 50,
  init: () => {
    function go () {
      console.log(this.a)
    }
    go()
  }
}
test.init() // Uncaught TypeError: Cannot read property 'a' of undefined
```

接下来，让我们把代码再改一下：

```js
this.a = 20
var test = {
  a: 50,
  init: function (fn) {
    function go () {
      console.log(this.a)
    }
    return go
  }
}
var go = test.init()
go() // 20
```

这种情况下，相当于是把 init 函数里的 go 挪到外面来执行了，这时候的 this 指向的还是 window 对象，所以还是输出 20。

继续改代码：

```js
this.a = 20
function go () {
  console.log(this.a)
  this.a = 30
}
go.prototype.a = 40
var test = {
  a: 50,
  init: function (fn) {
  }
}
console.log((new go()).a) // 40 30
```

如果 go 函数被 new 了的话，那么 go 函数里面的 a 的优先级比 go 函数的原型链上的 a 优先级高。但是如果不 new go 函数，那么它里面的 a 一点用没有。

原型链解决的是一个属性共享、内存复用（内存中对 a 的复用）的问题，即使 new 了无数个 go，指向的都是它，只不过可能 a 的值不一样而已。

上面这段代码的输出结果是40和30。其中，go 函数里面输出的值是40，而外边go的实例输出的值为30。前者是因为在找的时候，并没有 go 函数里面找到 a 的值，因为 this.a = 30 在 console.log(this.a) 后面，所以就去 go 的原型链上面找，找到了40。而外边因为 go 被 new 了，所以 this.a = 30 的优先级高于原型链上的 a 的值，所以实例上 a 的值为30。

再改改代码：

```js
this.a = 20
function go () {
  console.log(this.a)
  this.a = 30
}
go.prototype.a = 40
var test = {
  a: 50,
  init: function (fn) {
    fn()
    return fn
  }
}
test.init(go) // 20
```

可以看到这段代码输出的值为20。

我们用一个 x 来接收 test.init(go) 的值，并输出看看：

```js
var x = test.init(go)
console.log(x)
/*
ƒ go () {
  console.log(this.a)
  this.a = 30
}
 */
```

可以看到输出出来的值为 go 函数。

让我们执行下 x ：

```js
x() // 20 30
```

此时输出的是20和30。

综合起来，这道题的输出结果就如下：

```js
this.a = 20
function go () {
  console.log(this.a)
  this.a = 30
}
go.prototype.a = 40
var test = {
  a: 50,
  init: function (fn) {
    fn()
    console.log(this.a)
    return fn
  }
}
console.log((new go()).a) // 40 30
test.init(go) // 20 50
var p = test.init(go)
p() // 30 50 30
```

最后一句输出30是因为倒数第二句 test.init(go) 已经执行过一遍 go 函数了，此时 a 的值已经有30了，所以最后 p 执行的时候才会输出30。

:lock: 2.2

```js
var num = 1

function yideng () {
 "use strict"
 console.log(this.num++)
}
function yideng2 () {
 console.log(++this.num)
}
(function () {
 "use strict"
 yideng2 () // 2
})()
yideng () // Uncaught TypeError: Cannot read property 'num' of undefined
```

> 答案解析：

**严格模式只对当前的函数生效**。因此 yideng2 () 里的 this 能够指向 window 对象，输出2；但是 yideng() 里的 this 因为受到严格模式的限制，没法指向 window 对象，所以 this.num 的值为 undefined，执行运算时就报错了。

:lock: 2.3 拓展题（请写出以下代码执行结果）

```js
function C1 (name) { 
 if (name) this.name = name
} 
function C2 (name) { 
 this.name = name
} 
function C3 (name) { 
 this.name = name || 'fe' 
} 
C1.prototype.name = "yideng"
C2.prototype.name = "lao"
C3.prototype.name = "yuan"
console.log((new C1().name) + (new C2().name) + (new C3().name))
```

> 答案解析：

yideng、undefined、fe

- 对于 C1，里面有一个判断，当没传 name 的时候，压根不会执行里面的语句，所以会去原型链上找，输出 yideng；

- 对于 C2，也没传 name，所以 name 的值为 undefined，但是注意，**undefined 也是有意义的，只有为 not undefined 的时候才会去原型链上找**，所以输出结果是 undefined，而不会去原型链上找；

- 对于 C3，虽然也没传 name，但是它里面有一个短路求值，当没传 name 的时候，默认就会赋值为 fe，压根不会去原型链上找，所以输出 fe。

:lock: 3. 请写出如下点击 li 的输出值，并用三种方法正确输出 li 里的数字。

```html
<ul> 
 <li>1</li> 
 <li>2</li> 
 <li>3</li> 
 <li>4</li> 
 <li>5</li> 
 <li>6</li> 
</ul> 
```
```js
var list_li = document.getElementsByTagName("li")
for (var i = 0; i < list_li.length; i++) { 
  list_li[i].onclick = function() { 
    console.log(i); 
  }
}
```

> 答案解析：

现在不管你点击哪一个数字，输出的值都是 6，这显然是不对的。

为什么 js 是单线程，这是因为一开始 js 是用来操作 DOM 的，为了保证操作的简单性，因此一开始设计成了单线程。

这道题有以下几种解决方法：

- 使用 `let`，但是要注意输出 i + 1，因为 i 是从0开始的。

```js
var list_li = document.getElementsByTagName("li")
for (let i = 0; i < list_li.length; i++) { 
  list_li[i].onclick = function() { 
    console.log(i + 1); 
  }
}
```

- 使用闭包，可以保存 i。

```js
var list_li = document.getElementsByTagName("li")
for (var i = 0; i < list_li.length; i++) {
  (function (i) {
    list_li[i].onclick = function() { 
      console.log(i + 1); 
    }
  })(i)
}
```

- 最简单直接的方式，使用 this。

```js
var list_li = document.getElementsByTagName("li")
for (var i = 0; i < list_li.length; i++) { 
  list_li[i].onclick = function() { 
    console.log(this.innerHTML); 
  }
}
```

:lock: 4. 请写出输出值，并解释为什么。

```js
function test(m) { 
  m = {
    v:5
  } 
} 
var m = {
  k: 30
}
test(m)
alert(m.v) // undefined
```

> 答案解析：

这道题主要考察的就是**按值传递**和**按引用传递（按址传递）**。

- 按值传递：

```js
var a = 1
var b = a
b = 2
console.log(a) // 1
```

- 按引用传递（按址传递）：

```js
var a = { x: 1 }
var b = a
b.x = 3
console.log(a.x) // 3
```

正常情况下，a、b 指向的是同一个地址，但是**如果 b 重写了，那么这两个对象或数组就没有任何关系了**。比如：

```js
var a = { x: 1 }
var b = { k: 2 }
b.x = 3
console.log(a.x) // 1
```

因此，在这道题中，因为函数外边把 m 重写了再传给 test，所以此时 m 上已经找不到 v 这个属性了，输出为 undefined。注意，这里外边的 m 只是一个符号而已，改成别的也不影响：

```js
function test(m) { 
  m = {
    v:5
  } 
} 
var n = {
  k: 30
}
test(n)
alert(n.v) // undefined
```

如果改成下面这样，就能正确访问了。

```js
function test(m) {
  m.v = 5
} 
var m = {
  k: 30
}
test(m)
alert(m.v) // 5
```

:lock: 5. 请写出代码执行结果，并解释为什么。

```js
function yideng () { 
  console.log(1) 
} 
(function () { 
  if (false) { 
    function yideng () { 
      console.log(2)
    } 
  } 
  yideng()
})()
```

> 答案解析：

会报错，Uncaught TypeError: yideng is not a function。

:lock: 6. 请用一句话算出0-100之间学生的学生等级，如90-100输出为1等生、80-90为2等生以此类推。不允许使用if switch等。

> 答案解析：

使用 switch 要注意避免下面这个坑：

```js
var speed = 300
switch (speed) {
  case (400 - speed > 0):
    console.log(123)
    break
  default:
    console.log(456)
}
```

运行程序会发现，并没有像我们预想的那样输出123，而是输出了456，说明程序并没有进那个分支。这是因为 switch 实际上是拿你传进来的值跟 case 后面的值做对比的，而不会执行表达式。正常应该写成下面这样：

```js
var speed = 300
switch (speed) {
  case 300:
    console.log(123)
    break
  default:
    console.log(456)
}
```

输出123。

回到这道题，这道题其实得用数学思维来思考，而不是通过写十个 if 或 switch。方法其实很简单：

```js
var level = 10 - Math.floor(98 / 10)
console.log(level)
```

比如得了98分，上面代码最后算出来的结果就是1等生，一句代码搞定。以后在写代码的过程中一定要少些 if 或 switch。

:lock: 7. 请用一句话遍历变量 a。（禁止用 for，已知 var a = 'abc'）。

> 答案解析：

```js
var a = 'abc'
var b = Array.from(a)
console.log(b) // ["a", "b", "c"]

var a = 'abc'
var b = [...a]
console.log(b) // ["a", "b", "c"]
```

这道题其实有很多种解法，但最主要的是想考察能否想到下面这种方法，练习call、apply、bind：

```js
var slice = Array.prototype.slice
var b = slice.apply('abc')
console.log(b) // ["a", "b", "c"]
```

这种方法借用的写法很重要，在很多前端库中都会出现。

:lock: 8. 请在下面写出 JavaScript 面向对象编程的混合式继承。并写出 ES6 版本的继承。
   要求：汽车是父类，Cruze 是子类。父类有颜色、价格属性，有售卖的方法。Cruze 子类实现父类颜色是红色，价格是 140000，售卖方法实现输出如下语句：将红色的 Cruze 卖给了小王，价格是14万。

> 答案解析：

:bell: **ES6 中静态属性可以被继承**。其他语言是不行的。

```js
class Car {
  static color = 1
}
class Cruze extends Car {}
console.log(Cruze.color) // 1
```

这道题用 ES6 的写法很简单：

```js
class Car {
  static color = 1
  constructor (price) {
    this.price = price
  }
  test () {
    console.log(this.price)
  }
}
class Cruze extends Car {
  constructor (price) {
    super(price)
  }
}
const cruze = new Cruze(3000)
```

但是用 ES5 的写法就没那么简单了：

```js
'use strict'
function Car (price) {
  this.price = price
}
    
Car.color = 'red' // 静态属性
Car.prototype.test = function () {
  console.log(this.price)
}

function Cruze (price) {
  Car.call(this, price)
}

var staticKeys = Object.entries(Car)
for (var i = 0; i < staticKeys.length; i++) {
  var key = staticKeys[i][0]
  var value = staticKeys[i][1]
  Cruze[key] = value
}
// 这种写法不可取，子类会把父类给污染了
// Cruze.prototype = Car.prototype
    
// 这种写法也不可取，因为构造函数会被执行两次
// Cruze.prototype = new Car()

// 这样写会把 Cruze 的原型链指向 Car，显然也不行，需要手动去修正
// Cruze.prototype = Object.create(Car.prototype)
// 这是对上面写法的修正，写法是对的，但是太常见了
// var _proto = Object.create(Car.prototype)
// _proto.constructor = Cruze
// Cruze.prototype = _proto

// 一步到位的写法，不用手动去修正原型链
Cruze.prototype = Object.create(Car.prototype, {
  constructor: {
    value: Cruze,
    writable: false
  }
})
console.log(Cruze['color']) // red
var cruze = new Cruze(3000)
cruze.test() // 3000
console.log(cruze)
```

:lock: 9. 请写出如何利用 EcmaScript6/7（小Demo）优化多步异步嵌套的代码。

> 答案解析：

这道题主要就是先了解下 async...await。

:lock: 10. 考考基础。

```js
var regex = /yideng/g; 
console.log(regex.test('yideng')) 
console.log(regex.test('yideng')) 
console.log(regex.test('yideng')) 
console.log(regex.test('yideng'))
```

> 答案解析：

这道题考察的就是正则表达式 [RegExp.prototype.test()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) 的用法。用法里重要的一点就是:

如果正则表达式设置了全局标志，test() 的执行会改变正则表达式 lastIndex 属性。连续的执行test()方法，后续的执行将会从 lastIndex 处开始匹配字符串，(exec() 同样改变正则本身的 lastIndex 属性值)。

因此这道题的输出应该是：true、false、true、false。

:lock: 11. 继续考考基础。

```js
var yideng = function yideng (){ 
  yideng = 1
  console.log(typeof yideng)
} 
yideng() // function
yideng = 1
console.log(typeof yideng) // number
```

> 答案解析：

函数里边重名的 yideng 不会覆盖掉函数，但是外边的 yideng 就覆盖掉了函数。

加了严格模式就能看到函数里边不能修改重名函数了。会报错：Uncaught TypeError: Assignment to constant variable.

```js
[,,].length // 2
```

:lock: 12. 【仔细思考】写出如下代码的执行结果，并解释为什么。

```js
var length = 10
function fn () { 
  console.log(this.length)
}
var yideng = { 
  length: 5, 
  method: function (fn) { 
    fn() // 10
    arguments[0]() // 2
  } 
}; 
yideng.method(fn, 1) // 10 2
```

> 答案解析：

:bell: **window 的 length 取决于页面中 iframe 的数量**，[window.length](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/length)。

因此，如果把 var length = 10 这句注释掉，那么输出的结果就应该是0 2了，而不是undefined 2。

之所以会输出2是因为 `arguments[0]()` 这句执行后，fn 里面的 this 指向的是 arguments，所以 this.length 此时就是实参的数量，为2。

## 基础测试 B

:lock: **1. 手写一个 new 操作符。**

> 答案解析

- new 操作符做了以下这些事：

（1）它创建了一个全新的对象。

（2）它会被执行 [[Prototype]]（也就是 `__proto__`）链接。

（3）它会使 this 指向新创建的对象。

（4）通过 new 创建的每个对象最终都会被 [[Prototype]] 链接到这个函数的 prototype 对象上。

（5）如果函数没有返回对象类型 Object（包含 Function，Array，Date，RegExg，Error），那么 new 表达式中的函数调用将返回该对象引用。

```js
// 版本一
function myNew(func) {
  return function() {
    // 创建一个新对象并将其隐式原型指向构造函数原型
    let obj = {
      __proto__: func.prototype
    }
    // 执行构造函数
    func.call(obj, ...arguments)
    // 返回该对象
    return obj
  }
}

function person(name, age) {
  this.name = name
  this.age = age
}
let obj = myNew(person)('lin', 18)
console.log(obj) // person {name: "lin", age: 18}
```

```js
// 版本2
function myNew(func) {
  let res = {}
  if (func.prototype !== null) {
    res.__proto__ = func.prototype
  }
  let ret = func.apply(res, Array.prototype.slice.call(arguments, 1))
  if ((typeof ret === 'object' || typeof ret === 'function') && ret !== null) {
    return ret
  }
  return res
}

function person(name, age) {
  this.name = name
  this.age = age
}
let obj = myNew(person, 'lin', 18)
console.log(obj) // person {name: "lin", age: 18}
```

:lock: **2. 手写一个 JSON.stringfy 和 JSON.parse。**

> 答案解析

[JSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON) 对象包含两个方法: 用于解析 JavaScript Object Notation  (JSON) 的 parse() 方法，以及将对象/值转换为 JSON字符串的 stringify() 方法。

- 实现 JSON.stringfy 需要遵循以下原则：

（1）转换值如果含有 [toJSON()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON) 方法，直接调用该方法转换，否则调用 toString()。

（2）非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中。

（3）布尔值（Boolean）、数字（Number）、字符串（String）的包装对象在序列化过程中会自动转换成对应的原始值。

（4）`undefined`、任意的函数以及 `symbol` 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时），或者被转换成 null（出现在数组中时）。

（5）函数、undefined 被单独转换时，会返回 undefined，如 JSON.stringify(function() {}) 和 JSON.stringify(undefined) 都会返回 undefined。

（6）不可枚举的属性会被忽略。

（7）如果一个对象的属性值通过某种间接的方式指回该对象本身，即循环引用，属性也会被忽略。

```js
function jsonStringify(jsonObj) {
    let result = '', curVal;
    if (jsonObj === null) {
        return String(jsonObj);
    }
    switch (typeof jsonObj) {
        case 'number':
        case 'boolean':
            return String(jsonObj);
        case 'string':
            return '"' + jsonObj + '"';
        case 'undefined':
        case 'function':
            return undefined;
    }

    switch (Object.prototype.toString.call(jsonObj)) {
        case '[object Array]':
            result += '[';
            for (let i = 0, len = jsonObj.length; i < len; i++) {
                curVal = JSON.stringify(jsonObj[i]);
                result += (curVal === undefined ? null : curVal) + ",";
            }
            if (result !== '[') {
                result = result.slice(0, -1);
            }
            result += ']';
            return result;
        case '[object Date]':
            return '"' + (jsonObj.toJSON ? jsonObj.toJSON() : jsonObj.toString()) + '"';
        case '[object RegExp]':
            return "{}";
        case '[object Object]':
            result += '{';
            for (let i in jsonObj) {
                if (jsonObj.hasOwnProperty(i)) {
                    curVal = JSON.stringify(jsonObj[i]);
                    if (curVal !== undefined) {
                        result += '"' + i + '":' + curVal + ',';
                    }
                }
            }
            if (result !== '{') {
                result = result.slice(0, -1);
            }
            result += '}';
            return result;

        case '[object String]':
            return '"' + jsonObj.toString() + '"';
        case '[object Number]':
        case '[object Boolean]':
            return jsonObj.toString();
    }
}
```

```js
function jsonParse(jsonObj) {
  return eval('(' + jsonObj + ')');
}
```

:lock: **3. 手写一个 call 或 apply。**

:lock: **4. 手写一个 Function.bind。**

:lock: **5. 手写防抖（Debouncing）和节流（Throttling）。**

:lock: **6. 手写一个 JS 深拷贝（由浅入深多种写法）。**

:lock: **7. 手写一个 instanceOf 原理。**

:lock: **8. 手写一个 map 和 reduce。**

:lock: **9. 手写实现拖拽。**

:lock: **10. 使用 setTimeout 模拟 setInterval。**

:lock: **11. 手写实现 Object.create 的基本原理。**

## 基础测试 E

:lock: 1. 请写出如下代码输出值，并解释为什么。

```js
console.log({} + '');     // "[object Object]"
console.log({} + []);     // "[object Object]"
{} + [];                  // 0
[] + {};                  // "[object Object]"
{} + {};                  // NaN
console.log([] == false); // true
console.log({} == false); // false
{} == false;              // Uncaught SyntaxError: Unexpected token '=='
```

```js
if ([]) {
  console.log([] == false);                    // true
}
('b' + 'a' + + 'a' + 'a').toLocaleLowerCase(); // "banana"
0 == '0';                                      // true，'0' 会先被转成 number，Number('0')
'0' == 0;                                      // true
Boolean('0') == Boolean(0);                    // false
NaN == 0;                                      // false
NaN <= 0;                                      // false
NaN >= 0;                                      // false
NaN == NaN;                                    // false
null == 0;                                     // false
null >= 0;                                     // true
null <= 0;                                     // true
null == null;                                  // false
null == undefined;                             // true
{} == {};                                      // false
[] == [];                                      // false
[] == ![];                                     // true，! 的优先级比 == 高，所以右边的先转成了 false
[] == 0;                                       // true
[] == false;                                   // true    
```

> 答案解析：

- valueOf 方法用来获取原始值。

- toString 方法用来返回字符串。

- 自定义对象的 valueOf 和 toString 方法，来演示对象相加时是怎么加的。

```js
let obj = {
  valueOf: function() {
    console.log('valueOf');
    return 1;
  },
  toString: function() {
    console.log('toString');
    return {};
  }
};

console.log(obj + []);
// valueOf
// 1
```

可以看到，对象相加的时候进入了 valueOf。如果把 valueOf 的返回值注释掉，也还是进入 valueOf。

```js
// valueOf
// undefined
```

- `console.log({} + []);` 之所以会输出那样的结果是**因为括号的原因，形成了代码块，{} 的原始值是 [object Object]，[] 的原始值是空**，所以加起来的结果就是 [object Object]。如果把 console.log 去掉，只是 ({} + [])，结果也是 [object Object]。如果把 [] 换成 ''，（{} + ''）的结果也是 [object Object]。**object 代表对象类型，Object 代表真正的对象**。

- `('b' + 'a' + + 'a' + 'a').toLocaleLowerCase();` 这一段的核心其实在于 **( + 'a') 的值是 NaN**。这是因为**任何对象或字符串跟一个空的值加，结果都会强制转换成 number 类型**。比如 **( + {}) 的值也是 NaN**。但是 **( + []) 的值是 0**。

- **`{} + {};` 的值是 NaN，但是 `{} + {}` 的值居然是 "[object Object][object Object]"**，只是少了一个分号，值就变了。

- 记住一点，**如果 {} 的前面没有东西，那么它就可以忽略掉**。比如 `{} + [];` 和 `( + [])` 的值是一样的，都是0。**如果 {} 的前面有括号或者是有另一个 {} 相加，那么就形成了代码块**，比如 `({} + []);`、`{} + {}`、`({} + {});` 和 `[] + {};` 的值都是 "[object Object]"。

- `{ const a = 20; } + {}`的值是 NaN，如果前一个对象有值，就会强制转换成 number 类型。

- `Boolean('0') == Boolean(0);` 的结果是 false，是因为 Boolean('0') 的值为 true，而 Boolean(0) 的值为 false。

- NaN 是数字，所以 **typeof NaN 的值是 "number"**。

- **null 不是对象，但是 typeof null 的值是 "object"**，这是 JavaScript 的一个bug，历史遗留问题。null 只等于 undefined，null 使用关系运算符（+，>，< 而不是 ==）的时候会转为0。

- 对象的比较和运算会使用 ToPrimitive 运算转换左与右运算元为原始数据类型值(primitive)。

- ToPrimitive 运算：**valueOf 能得到原始数据类型的值，则返回这个值。-> toString 能得到原始数据类型的值，则返回这个值。-> 报错 TypeError**。

- [] == 0 的比较流程是：**[].valueOf().toStrng() == 0 转成了 '' == 0**。

:lock: 2. 请写出如下输出值，并完成附加题的作答。

```js
function fn() {
  console.log(this.length);
}
var yideng = {
  length: 5,
  method: function() {
    'use strict';
    fn();
    arguments[0]();
  }
}
const result = yideng.method.bind(null);
result(fn, 1); // 0 2
```

> 答案解析

这道题跟基础测试 A 中的最后一道题是类似的。看那道题的解析就可以了。

:lock: 附加题

```js
function bar() {
  console.log(myName);
}
function foo() {
  var myName = '林楠';
  bar();
}
var myName = '深圳大学';
foo(); // 深圳大学
```

> 答案解析

- 这道题考察的就是变量提升和词法作用域。`var myName = '深圳大学';` 这句代码会提升，bar 函数在定义的时候它的词法作用域就是确定的了，所以它是不会去找 foo 函数里定义的 myName。记住，**作用域链是在定义的时候确定的，不是在执行的时候确定的**。

- 如果我们把 `var myName = '深圳大学';` 这句代码注释掉，那么会报错：Uncaught ReferenceError: myName is not defined。

- 如果 bar 函数里边改成 `console.log(this.myName);`，那这道题就需要从另一个角度来思考了。虽然输出结果还是“深圳大学“，但是此时是因为 bar 函数的 this 默认绑定到了全局对象上，所以会找到外边定义的 myName。如果把 `var myName = '深圳大学';` 注释掉，就会输出 undefined。

:lock: 3. 请问变量 a 会被 GC 回收么，为什么？

```js
function test() {
  var a = 'yideng';
  return function() {
    eval('');
  }
}
test()();
```

> 答案解析

- 在外部用 var 声明的变量会被添加到全局对象 **Global** 中，比如 var b = 30；那么它就永远不会被回收。

![jstest](../.vuepress/public/assets/image/javascript/jstest2.png 'jstest')

- 如果是用 let 或 const 声明的变量，就不会挂载到全局对象上，而是放在 **Script** 对象里面。

![jstest](../.vuepress/public/assets/image/javascript/jstest3.png 'jstest')

- 在 `var a = 'yideng';` 下面再加一句 debugger，可以看到变量 a 被放到了 **Local** 对象里面。

![jstest](../.vuepress/public/assets/image/javascript/jstest4.png 'jstest')

此时点击下一步，发现变量 a 没了。说明变量 a 并没有被引用，所以被内存回收了。

![jstest](../.vuepress/public/assets/image/javascript/jstest5.png 'jstest')

- 如果在内层函数中加 `return a;`，一开始 a 还是在 **Local** 对象里面，但是当我点击下一步的时候，会发现它被放到了 **Closure(test)** 对象里面，这个就是闭包。

![jstest](../.vuepress/public/assets/image/javascript/jstest6.png 'jstest')

一旦变量被闭包所引用，内存就无法回收它了。所以这也说明了一点，并不是看到闭包就说变量一定不会被回收，而是还要看看这个变量是否有被闭包引用，如果没被引用，还是照样会被回收。

- 如何看一个变量是否还在内存中。

打开 Memory 面板。

![jstest](../.vuepress/public/assets/image/javascript/jstest7.png 'jstest')

然后点击左上角的圆形按钮进行录制，就可以看到当前页面的所有变量，可以在上方搜索框中搜索类名。如果有发生内存泄漏，相应的部分会变黄色。Memory 一般是配合 Performance 一起使用的。

![jstest](../.vuepress/public/assets/image/javascript/jstest8.png 'jstest')

- 下面这段代码在内存中可以看到 Yideng 有两个引用。

```js
function Yideng(name) {
  this.name = name;
}
let student1 = new Yideng();
let student2 = new Yideng();
```

![jstest](../.vuepress/public/assets/image/javascript/jstest9.png 'jstest')

当我们把 student1 置为 null 时，重新生成快照，就会发现对 Yideng 的引用就只剩下一个了，说明 student1 已经被回收了。快照是可以保存的。不过有时当我们把一个变量置为 null 时，v8 的 GC 不是马上就会把变量回收的，而是会有一定的延迟。

![jstest](../.vuepress/public/assets/image/javascript/jstest10.png 'jstest')

- 下面这段代码中，尽管 p1 置为 null，但是这只是把 YidengFactory 生成的实例回收了。因为闭包，内部的 student 还是存在着对外部 Yideng 的引用。除非我们手动在内部加上 `student = null;` 才会被回收，这是最关键的。

```js
function Yideng(name) {
  this.name = name;
}
// 闭包会存在堆区，方便复用
let YidengFactory = function (name) {
  let student = new Yideng(name);
    return function () {
      console.log(student);
    };
};
let p1 = YidengFactory('shenzhen');
p1();
p1 = null;
```

![jstest](../.vuepress/public/assets/image/javascript/jstest11.png 'jstest')

注意到此时 Yideng 虽然还在，但是它的 Distance 已经变成了 “—”。相当于它被单独分离开了。

- eval 会把变量 a 塞到全局的词法作用域中，这里还会产生闭包，因为引擎不知道 eval 里面会执行什么。所以这道题里的变量 a 不会被 GC 回收。

![jstest](../.vuepress/public/assets/image/javascript/jstest12.png 'jstest')

![jstest](../.vuepress/public/assets/image/javascript/jstest13.png 'jstest')

这个问题的解决方法就是把 eval 改成：

```js
window.eval('');
```

![jstest](../.vuepress/public/assets/image/javascript/jstest14.png 'jstest')

- webpack 里面用的就全是 eval。webpack 之所以这么做，是为了生成代码速度快。

- with 也有坑。比如下面这段代码直接在全局创建了一个变量 b。但是 with 现在还是有人在用的，比如 vue 的源码中就用到了。

```js
var obj = { a: 30 };
with (obj) {
  b = 30;
}
console.log(b);
```

:lock: 4. 请写出以下代码的输出值，并解释原因。

```js
Object.prototype.a = 'a';
Function.prototype.a = 'a1';
function Person() {};
var yideng = new Person();
console.log(Person.a);  // a1
console.log(yideng.a);  // a
console.log(1..a);      // a
console.log(1.a);       // 报错
console.log(yideng.__proto__.__proto__.constructor.constructor.constructor); // ƒ Function() { [native code] }

console.log((1).a);     // a
const x = new Number(1);
console.log(x.a);       // a
```

Object.prototype 和 Function.prototype 打印的内容差距很大的原因是什么？

> 答案解析

- 关于原型链有下面这张典型的图。

![jstest](../.vuepress/public/assets/image/javascript/jstest15.jpeg 'jstest')

- 对于第一个结果，寻值的过程是这样的：**function Foo() -> `__proto__` -> Function.prototype**，因为 Function.prototype 上有个 a 的值是 a1，所以最后的结果就是 a1。

- 对于第二个结果，寻值的过程是这样的：**new Foo() -> `__proto__` -> Foo.prototype -> `__proto__` -> Object.prototype**，因为 Object.prototype 上有个 a 的值是 a，所以最后的结果就是 a。

- 对于第三个结果，是因为 `1.` 是一个对象，跟 `(1)` 是一样的，所以最终找到了 Object.prototype 上的 a。但是 `typeof 1.` 的值是 number。

- 对于第四个结果，因为 1 不是对象，所以报错了。

- 经常在很多库里可能会看到类似下面的代码，这是库为了缩小代码体积而使用的一种简便写法。而且括号里面的东西，在加载时会提前执行。

```js
// 总是会返回后一个值
(20, 30)   // 30
(20, null) // null
(30, 20)   // 20
```

假如有个 obj.a 的值是 30，为了让它拿到值之后可以做下面的事，那么可能就会这么写：

```js
(obj.a).x
// 相当于
(30).x
// 但是不能是下面这样的，因为 30 不是一个对象
30.x 
```

- 下面这段代码的输出结果也值得注意下。

```js
Object.prototype.name = 'shenzhen';
function test() {}
test.name; // test
1..name;   // shezhen
```

输出结果是 test，这是因为函数的 name 属性是不能改的。

- 对于第五个结果，可以对照那张原型链的图，一层一层打印下。

```js
console.log(yideng.__proto__);
/*
  {constructor: ƒ}
  constructor: ƒ Person()
  __proto__: Object
*/

console.log(yideng.__proto__.__proto__);
// {a: "a", constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, …}

console.log(yideng.__proto__.__proto__.constructor);
// ƒ Object() { [native code] }

console.log(yideng.__proto__.__proto__.constructor.constructor);
// ƒ Function() { [native code] }

console.log(yideng.__proto__.__proto__.constructor.constructor.constructor);
// ƒ Function() { [native code] }
```

:lock: 5. 请写出如下代码执行结果。

```js
var a = {}, b = { key: 'b' }, c = { key: 'c' };
a[b] = 123;
a[c] = 456;
console.log(a[b]);                           // 456
console.log(Symbol(b) == Symbol(b));         // false
console.log(Symbol.for(b) == Symbol.for(b)); // true

console.log(a);
/*
  {[object Object]: 456}
  [object Object]: 456
  __proto__: Object
*/
```

> 答案解析

- 之所以输出 456，是因为键值是对象时，现代浏览器是把它转成了 [object Object]，所以 a[b] 和 a[c] 其实都是 a[[object Object]]，因此最后输出的就是 456。

- Symbol 是唯一值，但是 Symbol.for 不是。

:lock: 6. 请写出你了解的 ES6 的元编程。

> 答案解析

- 从 ECMAScript 2015 开始，JavaSCript 获得了 Proxy 和 Reflect 对象的支持，**允许你拦截并定义基本语言操作的自定义行为**（例如，属性查找，赋值，枚举，函数调用等）。借助这两个对象，可以在 JavaScript 元级别进行编程。

- ES6 的元编程有：[Proxy](https://es6.ruanyifeng.com/#docs/proxy) 和 [Reflect](https://es6.ruanyifeng.com/#docs/reflect)。

- [Symbol.toPrimitive](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive) 是元编程的一种方式。

```js
var shenzhen = {
  [Symbol.toPrimitive]: ((i) => () => ++i)(0); 
}
if (shenzhen == 1 && shenzhen == 2 && shenzhen == 3) {
  console.log('深圳'); // 深圳
}
```

- 浏览器留了一些底层属性可以给你用，这也属于一种元编程，比如：

```js
// 开启尾递归调用优化
function test(i) {
  return test(i--, i);
  TCO_ENABLED = true;
}
test(5);
```

:lock: 7. 请按照下方要求作答，并解释原理。请解释下 babel 编译后的 async 原理。

```js
let a = 0;
let yideng = async() => {
  a = a + await 10;
  console.log(a);
}
yideng(); // 10
console.log(++a); // 1
// 先输出 1，再输出 10
```

> 答案解析

- async 本身不是异步的，await 才是，await 后面的代码会等待 promise.then 执行后才执行。

- 先写一个简单的 generator。

```js
function* genDemo() {
  console.log('第一段执行逻辑');
  yield 'Generator2 ';
  console.log('第二段执行逻辑');
  yield 'Generator2 ';
  console.log('第三段执行逻辑');
  yield 'Generator2 ';
  console.log('执行完毕');
  return 'Generator2';
}
console.log('main 0');
let gen = genDemo();
console.log(gen.next().value);
console.log('main 1');

console.log('--------------');

console.log(gen.next().value);
console.log('main 2');
console.log(gen.next().value);
console.log('main 3');
console.log(gen.next().value);
console.log('main 4');
```

通过这段代码的结果，我们得明白以下几点：

（1）代码不是一次性执行完的，而是和全局代码交替执行。可以暂停，也可以恢复。

（2）协程比线程更轻量，它跑在线程上，并且一个线程可以有多个协程。

（3）线程上同时只执行一个协程。如果协程 A 在运行，此时想启动协程 B，那么就需要把控制权从 A 移交给 B，A 先暂停。如果协程 A 打开 协程 B，那么 A 就是 B 的父协程。

（4）之所以用协程进行管理，是因为协程不受操作系统管理，是由程序控制的。当我们调用 gen.next() 时，引擎会保存父协程的调用栈信息。这也叫做“锁变量”。

以上这几点也是 async ... await 的执行原理。

- 下面是跟协程相关的几张图。

（1）父协程

![jstest](../.vuepress/public/assets/image/javascript/jstest16.png 'jstest')

（2）协程执行流程图

![jstest](../.vuepress/public/assets/image/javascript/jstest17.png 'jstest')

（3）async / await 执行过程

![jstest](../.vuepress/public/assets/image/javascript/jstest18.png 'jstest')

- [async 函数的实现原理](https://es6.ruanyifeng.com/#docs/async#async-%E5%87%BD%E6%95%B0%E7%9A%84%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86)，面试中也经常会让手写 async/await，核心就是实现 spawn 函数。

- 这道题中，`a = a + await 10;` **这里的 a 其实是被保存起来了（锁变量）**，所以相当于是 `a = 0 + 10`，结果是输出10。如果把这道题稍微改一下由不一样了。

```js
let a = 0;
let yideng = async() => {
  a = await 10 + a;
  console.log(a);
}
yideng(); // 11
console.log(++a); // 1
// 先输出 1，再输出 11
```

这是因为 **await 之前的变量才会被锁定**。

- 可以把代码贴到 [babel 中文网](https://www.babeljs.cn/) 上看看编译成什么样的。

加强一下

```js
async function async1() {
  console.log(1);
  await async2();
  console.log(3);
}
async function async2() {
  console.log(2);
}
async1();
console.log(4);
// 这题简单，依次输出：1 2 4 3
```

:lock: 8. 请问点击 `<button id="test"></button>` 会有反应么？为什么？能解决么？

```js
$('#test').click(function(argument) {
  console.log(1);
})
setTimeout(function() {
  console.log(2);
}, 0)
while (true) {
  console.log(Math.random());
}
```

> 答案解析

- 爆栈是指内存空间不够了，用完了；死循环是指占着主线程不放，内存空间还是有的。

- 这题的解决方法就是用多线程。在 web worker 没出现之前，很多人都是用 [Concurrent.Thread.js](https://www.cnblogs.com/woodk/articles/5199536.html) 来模拟多线程的。

:lock: 9. 请先书写如下代码执行结果，并用 ES5 实现 ES6 PromiseA+ 规范的代码，同时你能解释下如何使用 Promise 完成事务的操作么。

```js
const pro = new Promise((resolve, reject) => {
  const innerpro = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    })
    console.log(2);
    resolve(3);
  })
  innerpro.then(res => console.log(res));
  resolve(4);
  console.log('yideng');
})
pro.then(res => console.log(res));
console.log('end');
// 依次输出：2 yideng end 3 4
```

> 答案解析

- 创建 promise 的时候是同步的，promise.then 才是异步的。

- promise 的状态一旦改变，就结束了。所以 setTimeout 里面的 resolve 是没用的。

:lock: 10. 请写出如下代码的输出值，并解释为什么。

```js
var s = [];
var arr = s;
for (var i = 0; i < 3; i++) {
  var pusher = {
    value: 'item' + i
  }, tmp;
  if (i !== 2) {
    tmp = [];
    pusher.children = tmp;
  }
  arr.push(pusher);
  arr = tmp;
}
console.log(s[0]);
```

> 答案解析

- 这道题其实是用 js 模拟指针移动，最后的输出结果是一棵树。

:lock: 请描述你理解的函数式编程，并书写如下代码的结果。那么你能使用 Zone + RX 写出一段 FRP 的代码么。

```js
var Container = function(x) {
  this._value = x;
}
Container.of = x => new Container(x);
Container.prototype.map = function(f) {
  return Container.of(f(this._value));
}
Container.of(3).map(x => x + 1).map(x => 'Result is ' + x);
```

- FRP 就是响应式函数式编程。

- [Zone.js](https://github.com/angular/angular/tree/master/packages/zone.js)

- [Rx.js](https://cn.rx.js.org/)