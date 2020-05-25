## 引入函数式编程

从一个简单的例子开始说起。下面是一个海鸥程序，鸟群合并`conjoin`则变成了一个更大的鸟群，繁殖`breed`则增加了鸟群的数量，增加的数量就是它们繁殖出来的海鸥的数量。

```js
var Flock = function(n) {
  this.seagulls = n;
};
Flock.prototype.conjoin = function(other) {
  this.seagulls += other.seagulls;
  return this;
};
Flock.prototype.breed = function(other) {
  this.seagulls = this.seagulls * other.seagulls;
  return this;
};
var flock_a = new Flock(4);
var flock_b = new Flock(2);
var flock_c = new Flock(0);
var result = flock_a.conjoin(flock_c).breed(flock_b)
              .conjoin(flock_a.breed(flock_b)).seagulls; //=> 32
```

这段代码其实并不好，它使得代码的内部可变状态变得非常难以追踪，而且最终的计算结果是错的，正确的答案应该是16。这是因为flock_a在计算过程中被永久的改变了。

下面试试一种更函数式的写法

```js
var conjoin = function(flock_x, flock_y) {
  return flock_x + flock_y
};
var breed = function(flock_x, flock_y) {
  return flock_x * flock_ y
};
var flock_a = 4;
var flock_b = 2;
var flock_c = 0;
var result = conjoin(breed(flock_b, conjoin(flock_a, flock_c)),
                      breed(flock_a, flock_b)); //=>16
```

这段代码明显比上面的少写了很多，而且答案也是正确的。不过函数的嵌套不太好理解，仔细深究的话，我们会发现它其实是在进行简单的加`conjoin`和乘`breed`运算而已。把代码中的两个函数名换一下

```js
var add = function(x, y) {
  return x + y
};
var multiply = function(x, y) {
  return x * y
};
var flock_a = 4;
var flock_b = 2;
var flock_c = 0;
var result = add(multiply(flock_b, add(flock_a, flock_c)),
                  multiply(flock_a, flock_b)); //=>16
```

这样一来看着就比较熟悉了。下面是我们很早就学过的一些经典数学定律

```js
// 结合律（assosiative）
add(add(x, y), z) == add(x, add(y, z));

// 交换律（commutative）
add(x, y) == add(y, x);

// 同一律（identity）
add(x, 0) == x;

// 分配律（distributive）
multiply(x, add(y,z)) == add(multiply(x, y), multiply(x, z));
```

我们可以用这些定律继续简化上面的代码

```js
// 原有代码
add(multiply(flock_b, add(flock_a, flock_c)), multiply(flock_a, flock_b));

// 应用同一律，去掉多余的加法操作（add(flock_a, flock_c) == flock_a）
add(multiply(flock_b, flock_a), multiply(flock_a, flock_b));

// 再应用分配律
multiply(flock_b, add(flock_a, flock_a));
```

到这里，代码就变得很简洁明了了。只需要调用函数即可，没有多余的代码。

```js
var add = function(x, y) {
  return x + y
};
var multiply = function(x, y) {
  return x * y
};
var flock_a = 4;
var flock_b = 2;
var flock_c = 0;
var result = multiply(flock_b, add(flock_a, flock_a));
```

## 一等公民的函数

**1. 几个简单的例子**

当我们说函数是“一等公民”的时候，其实是说它们跟其他对象都一样，没什么特殊的，我们可以像对待任何其他数据类型一样对待它们——把它们存进数组、当作参数传递、赋值给变量等等。

这是JavaScript的基础概念，但是很多人其实会无视它。比如下面的代码

```js
const hi = name => `Hi ${name}`;
const greeting = name => hi(name);
```

这里 greeting 指向的那个把 hi 包了一层的包裹函数完全是多余的。因为 JavaScript 的函数是可调用的，当 hi 后面紧跟()的时候就会运行并返回一个值；如果没有(), hi 就简单地返回存到这个变量里的函数。

```js
hi; // name => `Hi ${name}`
hi("jonas"); // "Hi jonas"
```

因此上面的代码应该写成下面这样

```js
const greeting = hi;
greeting("times"); // "Hi times"
```

用一个函数把另一个函数包起来，目的仅仅是延迟执行，是一种非常糟糕的编程习惯。充分理解这个问题很重要，下面是几个类似例子

```js
// 太傻了
const getServerStuff = callback => ajaxCall(json => callback(json));
```

上面这句代码可以一步一步转换成下面这样

```js
// 这行
ajaxCall(json => callback(json));

// 等价于这行
ajaxCall(callback);

// 那么，重构下
getServerStuff const getServerStuff = callback => ajaxCall(callback);

// ...就等于
const getServerStuff = ajaxCall // <-- 看，没有括号哦
```

还有下面这个例子

```js
const BlogController = {
  index(posts) { return Views.index(posts); }, 
  show(post) { return Views.show(post); },
  create(attrs) { return Db.create(attrs); },
  update(post, attrs) { return Db.update(post, attrs); },
  destroy(post) { return Db.destroy(post); },
};
```

可以重写成

```js
const BlogController = {
  index: Views.index,
  show: Views.show,
  create: Db.create,
  update: Db.update,
  destroy: Db.destroy,
};
```

以上才是写函数的正确方式。

**2. 为什么要将函数当成一等公民看待**

通过前面的例子可以看到，虽说添加一些没有实际用处的间接层实现起来很容易，但这样做除了徒增代码量，提高维护和检索代码的成本外，没有任何用处。

另外，如果一个函数被不必要地包裹起来了，而且发生了改动，那么包裹它的那个函数也要做相应的变更。

```js
httpGet('/post/2', json => renderPost(json));
```

如果 httpGet 要改成可以抛出一个可能出现的 err 异常，那我们还要回过头去把“胶水”函数也改了。

```js
// 把整个应用里的所有 httpGet 调用都改成这样，可以传递 err 参数。
httpGet('/post/2', (json, err) => renderPost(json, err));
```

如果一开始就写成一等公民函数的形式，需要改动的地方将会少得多

```js
httpGet('/post/2', renderPost); // renderPost 将会在 httpGet 中调用，想要多少参数都行
```

除了删除不必要的函数，正确地为参数命名也必不可少。项目中常见的一种造成混淆的原因是，针对同一个概念使用不同的命名。还有通用代码的问题。比如，下面这两个函数做的事情一模一样，但后一个就显得更加通用，可重用性也更高：

```js
// 只针对当前的博客
const validArticles = articles => articles.filter(article => article !== null && article !== undefined),

// 对未来的项目更友好
const compact = xs => xs.filter(x => x !== null && x !== undefined);
```

在命名的时候，我们特别容易把自己限定在特定的数据上（本例中是 articles ）。这种现象很常见，也是重复造轮子的一大原因。

还有一点需要特别注意的是this的使用，如果一个底层函数使用了 this ，而且是以一等公民的方式被调用的，可能会有问题。

```js
var fs = require('fs');

// 太可怕了
fs.readFile('freaky_friday.txt', Db.save);

// 好一点点
fs.readFile('freaky_friday.txt', Db.save.bind(Db));
```

把 Db 绑定（bind）到它自己身上以后，就可以随心所欲地调用它的原型链式垃圾代码了。 在函数式编程中，应该尽可能避免使用this，因为根本用不到它。

## 纯函数的好处

**1. 什么是纯函数**

纯函数是这样一种函数，即**相同的输入，永远会得到相同的输出**，而且**没有任何可观察的副作用**。

比如`slice`和`splice`，这两个函数的作用差不多。但是，`slice`符合纯函数的定义，因为对相同的输入它保证能返回相同的输出；而`splice`却会永久的改变原来的数组，这就会产生可观察的副作用。

```js
var xs = [1,2,3,4,5];

// 纯的
xs.slice(0,3); //=> [1,2,3]
xs.slice(0,3); //=> [1,2,3]
xs.slice(0,3); //=> [1,2,3]

// 不纯的
xs.splice(0,3); //=> [1,2,3]
xs.splice(0,3); //=> [4,5]
xs.splice(0,3); //=> []
```

在函数式编程中，不喜欢这种会改变原数据的函数，而是需要那种可靠的，每次都能返回同样结果的函数。

再看另外一个例子

```js
// 不纯的
var minimum = 21;
var checkAge = function(age) {
  return age >= minimum;
};

// 纯的
var checkAge = function(age) {
  var minimum = 21;
  return age >= minimum;
};
```

第一个不纯是因为checkAge的结果取决于minimum这个可变变量的值。

使用纯函数的形式，函数就能做到自给自足。可以让minimum成为一个不可变（immutable）对象，这样就能保证纯粹性，因为状态不会有变化。要实现这个效果，必须得创建一个对象，然后调用`Object.freeze`方法：

```js
var immutableState = Object.freeze({
  minimum: 21
});
```

**2. 副作用包括什么**

副作用是在计算结果的过程中，系统状态的一种变化，或者与外部世界进行的可观察的交互。

副作用可能包含，但不限于：
- 更改文件系统
- 往数据库插入记录
- 发送一个 http 请求
- 可变数据
- 打印/log
- 获取用户输入
- DOM 查询
- 访问系统状态

简单来说，只要是跟函数外部环境发生的交互就都是副作用——这一点可能会让你怀疑无副作用编程的可行性。函数式编程的哲学就是假定副作用是造成不正当行为的主要原因。

但并不是说要禁止使用一切副作用，而是说，要让它们在可控的范围内发生。

副作用让一个函数变得不纯是有道理的：从定义上来说，纯函数必须要能够根据相同的输入返回相同的输出；如果函数需要跟外部事物打交道，那么就无法保证这一点了。

**3. 为何需要坚持相同输入得到相同输出的原则呢？**

回顾下在数学中学到的函数的概念。

函数是不同数值之间的特殊关系：每一个输入值返回且只返回一个输出值。

换句话说，**函数只是两种数值之间的关系：输入和输出**。尽管每个输入都只会有一个输出，但不同的输入却可以有相同的输出。下图展示了一个合法的从 x 到 y 的函数关系；

![Functional Programming](../.vuepress/public/assets/image/fp/fp1.png 'Functional Programming')  

相反，下面这张图表展示的就不是一种函数关系，因为输入值 5 指向了多个输出：

![Functional Programming](../.vuepress/public/assets/image/fp/fp2.png 'Functional Programming')  

如果输入直接指明了输出，那么就没有必要再实现具体的细节了。因为函数仅仅只是输入到输出的映射而已，所以简单地写一个对象就能“运行”它，使用 [] 代替 () 即可。

```js
var toLowerCase = {"A":"a", "B": "b", "C": "c", "D": "d", "E": " e", "D": "d"};
toLowerCase["C"]; //=> "c"

var isPrime = {1:false, 2: true, 3: true, 4: false, 5: true, 6:false};
isPrime[3]; //=> true
```

这个例子也表明了另外一种思考函数的方式。

纯函数就是数学上的函数，而且是函数式编程的全部。

**4. 纯函数的好处**

- 可缓存性（Cacheable）
- 可移植性／自文档化（Portable / Self- Documenting）
- 可测试性（Testable）
- 合理性（Reasonable）
- 并行代码