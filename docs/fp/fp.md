[函数式编程术语](https://github.com/shfshanyue/fp-jargon-zh#product-type)

常用的库：[Ramda](https://ramda.cn/)、[Lodash](https://www.lodashjs.com/)

## :books: 函数式编程思维

函数式编程是数学的概念，写函数式编程的时候脑子里想的是数学里的函数，而不是 JavaScript 里的函数。因此，函数式编程实际上就是把数学的思维带到了开发中。

### :blue_book: 范畴论(Category Theory)

1. 函数式编程是范畴论的数学分支，是一门很复杂的数学，认为世界上所有概念体系都可以抽象成一个个范畴。

2. 彼此之间存在某种关系的概念、事物、对象等等，都构成范畴。任何事物只要找出他们之间的关系，就能定义范畴。

3. 箭头表示范畴成员之间的关系，正式的名称叫作“**态射**”。

4. 范畴论认为，同一个范畴的所有成员，就是不同状态的“变形”。通过“态射”，一个成员可以变形成另一个成员。

5. 范畴的内容包含两点：

（1）所有成员是一个集合。

（2）变形关系是函数。

### :blue_book: 函数式编程基础理论

1. 数学中的函数书写形式如右：f(x)=y。一个函数 f，以 x 作为参数，并返回输出 y。虽然这个概念很简单，但是其中包含几个关键点：

- **函数必须总是接受一个参数。**

- **函数必须返回一个值。**

- **函数应该依据接收到的参数而不是外部环境运行。**

- **对于给定的 x 只会输出唯一的 y。**

2. 函数式编程不是用函数来编程，也不是传统的面向过程编程。它的主旨在于将复杂的函数复合成简单的函数（计算理论、递归论或者拉达姆演算）。**运算过程尽量写成一系列的函数嵌套。**

3. 通俗的写法是 function xx() {}。要区分开函数和方法，**方法要与指定的对象绑定，函数可以直接调用。**

4. 函数式编程（Functional Programming）其实相对于计算机的历史而言是一个非常古老的概念，甚至早于第一台计算机的诞生。函数式编程的基础模型来源于 **λ（Lambda） 演算（即拉达姆演算）**，而 λ 演算并非设计于在计算机上执行，它是在20世纪三十年代引入的一套用于研究函数定义、函数应用和递归的形式系统。

5. JavaScript 是披着 C 外衣的 [Lisp](https://www.yiibai.com/lisp/lisp_overview.html)。Lisp 是一种纯函数式编程的语言。

6. 函数式编程真正的火热是随着 React 的高阶函数而逐步升温的。

7. **函数是一等公民**。所谓“第一等公民”（first class），指的是函数与其他数据类型一样，处于平等地位，可以赋值给其它变量，也可以作为参数，传入另一个函数，或者作为别的函数的返回值。

8. **不可改变量**

我们通常理解的变量在函数式编程中也被函数替代了，在函数式编程中变量仅仅代表某个表达式。这里所说的变量是不能被修改的，所有的变量只能被赋一次初值。**函数式编程里的值全部是靠传递的，不能改它**。函数式编程最讲究的就是纯！

9. `map` 和 `reduce` 是函数式编程最常用的方法。

::: tip 牢记以下几点
1. 函数是“第一等公民”

2. 只用“表达式”，不用“语句”

3. 没有“副作用”

4. 不修改状态

5. 引用透明（函数运行只靠参数且相同的输入总是获得相同的输出），比如 identity = (i) { return i }，这里调用 identity(1) 的效果可以直接替换为 1，该过程被称为替换模型。
:::

## :books: 函数式编程核心概念

- 纯函数

- 偏应用函数、函数的柯里化

- 函数组合

- Point Free

- 声明式与命令式代码

- 惰性求值

### :blue_book: 纯函数

- 对于相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用，也不依赖外部环境的状态。比如 slice 是纯函数，但是 splice 不是纯函数。

- 实际开发过程中没法保证所有的函数都很纯，但是要明白我们的目标就是让函数尽量的纯。

- 优点

（1）纯函数不仅可以有效降低系统的复杂度，还有很多很棒的特性，比如可缓存性。

```js
import _ from 'lodash';

var sin = _memorize(x => Math.sin(x));

// 第一次计算的时候会稍慢一点
var a = sin(1);

// 第二次有了缓存，速度极快
var b = sin(1);
```

（2）下面的代码在不纯的版本中，checkage 不仅取决于 age，还依赖于外部变量 min。纯的 checkage 把关键数字18硬编码在函数内部，扩展性比较差，可以用柯里化优雅地改写纯函数来解决。

```js
// 不纯的
var min = 18;
var checkage = age => age > min;

// 纯的
var checkage = age => age > 18;
```

### :blue_book: 纯度和幂等性

- 幂等性是指**执行无数次后还具有相同的效果**，同一的参数运行一次函数应该与连续运行两次的结果一致。

- 幂等性在函数式编程中与纯度相关，但又不一致。

```js
Math.abs(Math.abs(-42));
```

### :blue_book: 偏应用函数

```js
// 偏应用函数的参数是一个函数和该函数的部分参数
const partial = (f, ...args) => 
    (...moreArgs) =>
        f(...args, moreArgs)
```

比如：

```js
const add3 = (a, b, c) => a + b + c

// 偏应用2、3到 add3
const fivePlus = partial(add3, 2, 3);
fivePlus(4);

// bind 实现，就是偏应用函数的一种实现
const add1More = add3.bind(null, 2, 3); // add1More(c) => 2 + 3 + c
```

### :blue_book: 函数的柯里化

- 柯里化（Curry）通过偏应用函数实现。它是把一个多参数的函数转换为一个嵌套一元函数的过程。

- 传递给函数一部分参数来调用它，让它去处理剩下的参数。

```js
var checkage = min => (age => age > min);
var checkage18 = checkage(18);
checkage18(20);
```

- 柯里化的优点

柯里化不仅能够解决纯函数的硬编码问题，事实上柯里化还是一种“预加载”函数的方法，通过传递较少的参数，得到一个已经记住了这些参数的新函数，某种意义上来讲，这是一种对参数的“缓存”，是一种非常高效的编写函数的方法。

```js
import { curry } from 'lodash';

var match = curry((reg, str) => str.match(reg));
var filter = curry((f, arr) => arr.filter(f));
var haveSpace = match(/\s+g/);

haveSpace('fffffff');
haveSpace('a  b');

filter(haveSpace, ['abcdefg', 'Hello World']);
filter(haveSpace)(['abcdefg', 'Hello World']);
```

```js
function foo(p1, p2) {
    this.val = p1 + p2;
}
var bar = foo.bind(null, 'p1');
var baz = new bar('p2');
console.log(baz.val);
```

### :blue_book: 函数的反柯里化

- 函数的柯里化，是固定部分参数，返回一个接受剩余参数的函数，也称为部分计算函数，**目的是为了缩小适用范围，创建一个针对性更强的函数**。

```js
// 柯里化之前
function add(x, y) {
    return x + y;
}
add(1, 2); // 3

// 柯里化之后
function addX(y) {
    return function(x) {
        return x + y;
    }
}
addX(2)(1); // 3
```

```js
// 手写一个柯里化函数
const curry = (fn, arr = []) => 
    (...args) => 
        (arg => (arg.length === fn.length ? fn(...arg) : curry(fn, arg)))([...arr, ...args])

let curryTest = curry((a, b, c, d) => a + b + c + d);
curryTest(1, 2, 3)(4); // 10
curryTest(1, 2)(3)(4); // 10
curryTest(1, 2)(3, 4); // 10
```

- 反柯里化函数，从字面上看，意义和用法跟函数柯里化正好相反，**目的是扩大适用范围，创建一个应用范围更广的函数**。使得原本只有特定对象才适用的方法，扩展到更多的对象。

```js
// 手写一个反柯里化函数
Function.prototype.unCurring = function() {
    var that = this;
    return function() {
        var obj = Array.prototype.shift.call(arguments);
        return that.apply(obj, arguments);
    }
}
var push = Array.prototype.push.unCurring(), obj = {};
push(obj, 'first', 'two');
console.log(obj);
```

### :blue_book: 柯里化和偏应用的区别

- 柯里化的参数列表是**从左向右**的。如果使用 setTimeout 这种就得额外的封装。

```js
const setTimeoutWrapper = (timeout, fn) => {
    setTimeout(fn, timeout);
}
const delayTenMs = _.curry(setTimeoutWrapper)(10);
delayTenMs(() => console.log('Do x Task'));
delayTenMs(() => console.log('Do y Task'));
```

在这段代码中，setTimeoutWrapper 显得多余，这时候我们就可以用偏应用函数。使用 Curry 和 Partial 都是为了让函数参数或函数设置变得更加简单和强大。

- Curry 和 Partial 的实现可以参考 [lodash](https://www.lodashjs.com/)。

### :blue_book: 函数组合

- 纯函数以及如何把它柯里化会写出洋葱🧅代码 h(g(f(x)))，为了解决函数嵌套的问题，我们需要用到函数组合。

```js
const compose = (f, g) => (x => f(g(x)));
const first = arr => arr[0];
const reverse = arr => arr.reverse();
const getLast = compose(first, reverse);
getLast([1, 2, 3, 4, 5]); // 5
```

- 函数组合让函数之间的调用更加灵活。

```js
compose(f, compose(g, h));
compose(compose(f, g), h);
compose(f, g, h);
```

### :blue_book: 函数组合子

- compose 函数只能组合接收一个参数的函数，类似 map、filter 这些接收两个参数的函数（也叫投影函数：总是在应用里做转换操作，通过传入高阶参数后返回数组），不能被直接组合。**可以借助偏函数包裹后继续组合**。

- 函数组合的数据流是**从右至左**的，因为最右边的函数首先被执行，然后将数据传递给下一个，以此类推。但是有人喜欢让最左边的先执行，我们可以实现 pipe（可称为管道、序列）来实现。它和 compose 函数所做的事情一样，只不过交换了数据方向。

- 因此我们需要**组合子**管理程序的控制流。

- 组合子可以组合其他函数（或其他组合子），并作为控制逻辑单元的高阶函数，组合子通常不声明任何变量，也不包含任何业务逻辑，它们旨在管理函数程序执行流程，并在链式调用中对中间结果进行操作。

- 常见的组合子

**（1）辅助组合子**

无为（nothing）、照旧（identity）、默许（defaultTo）、恒定（always）

**（2）函数组合子**

收缩（gather）、展开（spread）、颠倒（reverse）、左偏（partial）、右偏（partialRight）、柯里化（curry）、弃离（tap）、交替（alt）、补救（tryCatch）、同时（seq）、聚集（converge）、映射（map）、分捡（useWith）、规约（reduce）、组合（compose）

**（3）谓语组合子**

过滤（filter）、分组（group）、排序（sort）

**（4）其它**

组合子变换 juxt

以上组合子分属于 **SKI 组合子**。

lodash 里的所有方法实际上用的就是组合子的概念，它们都是为了帮你控制程序的执行流程。

### :blue_book: Point Free

- **把一些对象自带的方法转化成纯函数，不要命名转瞬即逝的中间变量**。比如：

```js
const f = str => str.toUpperCase().split('');
```

这个函数中，我们使用了 str 作为我们的中间变量，但是这个中间变量除了让代码变得长一点之外毫无意义。

采用 Point Free 风格改造下：

```js
var toUpperCase = word => word.toUpperCase();
var split = x => (str => str.split(x));

var f = compose(split(''), toUpperCase);

f('abcd efgh');
```

这种风格能够帮我们减少不必要的命名，让代码保持简洁和通用。

### :blue_book: 声明式与命令式代码

- 命令式代码就是，我们通过编写一条又一条指令让计算机执行一些动作，这其中一般都会涉及到很多繁杂的细节。

- 声明式代码就要优雅很多了，我们通过编写表达式的方式来声明我们想干什么，而不是通过一步一步的指示。

```js
// 命令式
let CEOs = [];
for (let i = 0; i < companies.length; i++) {
    CEOs.push(companies[i].CEO);
}

// 声明式
let CEOs = companies.map(c => c.CEO);
```

- 优缺点

（1）函数式编程的一个明显的好处就是这种声明式的代码，对于无副作用的纯函数，我们完全可以不考虑函数内部是如何实现的，专注于编写业务代码。优化代码时，目光只需要集中在这些稳固的函数内部即可。

（2）相反，不纯的函数代码会产生副作用或者依赖外部系统环境，使用它们的时候总是要考虑这些不干净的副作用。在复杂的系统中，这对程序员的心智来说是极大的负担。

### :blue_book: 类 SQL 数据：函数即数据

```sql
select p.firstname from persons p where ... group by ...
```

```js
_mixin({
    'select': _.pluck,
    'from': _.chain,
    'where': _.filter,
    'groupby': _.sortByOrder
})

const persons = {};

_.from(persons).where().select().value();
```

以函数形式对数据建模，也就是函数即数据。声明式的描述了数据输出是什么，而不是数据是如何得到的。

### :blue_book: 惰性链、惰性求值、惰性函数

```js
_.chain(data).map().reverse().value()
```

- 惰性链可以添加一个输入对象的状态，从而能够将这些输入转换为所需的输出操作链接在一起。与简单的数组操作不一样，尽管它是一个复杂的程序，但仍然可以避免创建任何变量，并且有效消除所有循环。而且**在最后调用 value 之前并不会真正的执行任何操作**。这就是所谓的**惰性链**。

```js
// _.chain 可以推断可优化点，如合并执行或存储优化
// 合并函数执行并压缩计算过程中使用的临时数据结构，降低内存占用
const trace = msg => console.log(msg);
let square = x => Math.pow(x, 2);
let isEven = x => x % 2 === 0;

// 使用组合子跟踪
square = R.compose(R.tap(() => trace('map 数组')), square);
isEven = R.compose(R.tap(() => trace('filter 数组')), isEven);

const numbers = _.range(200);
const result = _.chain(numbers)
                .map(square)
                .filter(isEven)
                .take(3)
                .value();
console.log(result);
```

- 当输入很大但只有一个小的子集有效时，避免不必要的函数调用就是所谓的**惰性求值**。惰性求值方法有很多，如组合子（alt，类似于 ||，先计算 fun1，如果返回值是 false、null、undefined，就不再执行func2），但是目的都是一样的，即尽可能的推迟求值，直到依赖的表达式被调用。

```js
const alt = _.curry((func1, fun2, val) => fun1(val) || fun2(val));
const showStudent = _.compose(函数体1, alt(xx1, xx2));
showStudent({});
```

```js
var object = {a: 'xx', b: 2};
var values = _.memoize(_.values);
values(object);
object.a = 'hello';
console.log(values.cache.get(object)); // ["xx", 2]
```

- **惰性函数**很好理解，假如同一个函数被大量范围调用，并且这个函数内部又有许多判断来检测函数，这样对于一个调用会浪费时间和浏览器资源，所以当第一次调用完成后，直接把这个函数改写，不再需要判断。

```js
// 判断浏览器的 Ajax 对象
function createXHR() {
    var xhr = null;
    if (typeof XMLHttpRequest !== 'undefined') {
        xhr = new XMLHttpRequest();
        createXHR = function() {
            return XMLHttpRequest(); // 直接返回一个懒函数，这样没必要再往下走
        }
    } else {
        try { 
            xhr = new ActiveXObject('Msxml2.XMLHTTP');
            createXHR = function() {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }
        } catch(e) {
            try {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
                createXHR = function() {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }
            } catch(e) {
                createXHR = function() {
                    return null;
                }
            }
        }
    }
}
```

## :books: 函数式编程更深入的概念

- 高阶函数

- 尾调用优化 PTC

- 闭包

- 容器、Functor

- 错误处理、Either、AP

- IO

- Monad

### :blue_book: 高阶函数

函数当参数，把传入的函数做一个封装，然后返回这个封装的函数，达到更高程度的抽象。

- 它是一等公民

- 它以一个函数作为参数

- 它以一个函数作为返回结果

```js
// 命令式
var add = function(a, b) {
    return a + b;
}
function math(func, array) {
    return func(array[0], array[1]);
}
math(add, [1, 2]); // 3
```

### :blue_book: 尾调用优化

- 指**函数内部的最后一个动作是函数调用**。该调用的返回值，直接返回给函数。

- 函数调用自身，称为**递归**。如果尾调用自身，称为**尾递归**。

- 递归需要保存大量的调用记录，很容易发生栈溢出错误。如果使用尾递归优化，将递归变为循环，那么只需要保存一个调用记录，这样就不会发生栈溢出错误了。

```js
// 不是尾递归，无法优化斐波那契数列
function factorial(n) {
    if (n === 1) return 1;
    return n * factorial(n - 1);
}
```

```js
// 尾递归
function factorial(n ,total) {
    if (n === 1) return total;
    return factorial(n - 1, n * total);
}
```

::: warning 注意
并不是说尾递归一定不会爆栈，只是不容易爆栈。
:::

- 浏览器之所以不支持尾递归，是因为会丢失堆栈信息。如果浏览器开启了，那么就只会显示最后一步调用，之前的都会隐藏掉，因此就无法追踪到堆栈信息。

- 强制开启尾递归的方式有3种：

```js
return continue
!return
#function()
```

- 尾递归的判断标准是函数运行的最后一步是否调用自身，而不是是否在函数的最后一行调用自身。最后一行调用其它函数并返回叫作**尾调用**。

- 尾递归调用栈永远都是更新当前的栈帧而已，这样就避免了爆栈的危险。但是如今的浏览器并未完全支持，原因有二：

  I. 在引擎层面消除递归是一个隐式的行为，程序员意识不到。

  II. 堆栈信息丢失了，开发者难以调试。

- 既然浏览器不支持，我们可以把这些递归写成 while。