## 基础测试 A

1. 请写出弹出值，并解释为什么。

```js
alert(a)
a()
var a = 3
function a () {
  alert(10)
}
alert(10)
a = 6
a()
```

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

2. 请写出如下输出值，并解释为什么。

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
 yideng2 ()
})()
yideng ()
```

2-1. 拓展题（请写出以下代码执行结果）

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

3. 请写出如下点击 li 的输出值，并用三种方法正确输出 li 里的数字。

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
</script>
```

4. 请写出输出值，并解释为什么。

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
alert(m.v)
```

5. 请写出代码执行结果，并解释为什么。

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

6. 请用一句话算出0-100之间学生的学生等级，如90-100输出为1等生、80-90为2等生以此类推。不允许使用if switch等。

7. 请用一句话遍历变量 a。（禁止用 for，已知 var a = 'abc'）。

8. 请在下面写出 JavaScript 面向对象编程的混合式继承。并写出 ES6 版本的继承。
   要求：汽车是父类，Cruze 是子类。父类有颜色、价格属性，有售卖的方法。Cruze 子类实现父类颜色是红色，价格是 140000，售卖方法实现输出如下语句：将红色的 Cruze 卖给了小王，价格是14万。

9. 请写出如何利用 EcmaScript6/7（小Demo）优化多步异步嵌套的代码。

10. 考考基础。

```js
var regex = /yideng/g; 
console.log(regex.test('yideng')) 
console.log(regex.test('yideng')) 
console.log(regex.test('yideng')) 
console.log(regex.test('yideng'))
```

11. 继续考考基础。

```js
var yideng = function yideng (){ 
 yideng = 1
 console.log(typeof yideng)
} 
yideng()
yideng = 1
console.log(typeof yideng)
```

12. 【仔细思考】写出如下代码的执行结果，并解释为什么。

```js
var length = 10
function fn () { 
 console.log(this.length)
} 
var yideng = { 
 length: 5, 
 method: function (fn) { 
 fn()
 arguments[0]()
 } 
}; 
yideng.method(fn, 1)
```

## 基础测试 B

**1. 手写一个 new 操作符。**

**2. 手写一个 JSON.stringfy 和 JSON.parse。**

**3. 手写一个 call 或 apply。**

**4. 手写一个 Function.bind。**

**5. 手写防抖（Debouncing）和节流（Throttling）。**

**6. 手写一个 JS 深拷贝（由浅入深多种写法）。**

**7. 手写一个 instanceOf 原理。**

**8. 手写一个 map 和 reduce。**

**9. 手写实现拖拽。**

**10. 使用 setTimeout 模拟 setInterval。**

**11. 手写实现 Object.create 的基本原理。**