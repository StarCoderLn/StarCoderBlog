# 第一部分 作用域和闭包

## :books: 作用域是什么

### :blue_book: 作用域出现的背景

几乎所有编程语言最基本的功能之一，就是能够储存变量中的值，并且能在之后对这个值进行访问或修改。**正是这种储存和访问变量的能力将状态带给了程序**。

但是将变量引入程序会引起一些问题，比如，这些变量储存在哪里？程序需要时如何找到它们？

为了解决这些问题，就需要一套设计良好的规则来存储变量，并且之后可以方便的找到这些变量。这套规则被称为**作用域**。

### :blue_book: 编译原理

在传统编译语言的流程中，程序中的一段源代码在执行前会经历三个步骤，统称为“**编译**”。

- :gem: **分词/词法分析（Tokenizing/Lexing）**

  这个过程会将由字符组成的字符串分解成（对编译语言来说）有意义的代码块，这些代码块被称为**词法单元（token）**。

  例如，考虑程序 var a = 2;。这段程序通常会被分解成为下面这些词法单元：var、a、=、2 、;。**空格是否会被当作词法单元，取决于空格在这门语言中是否具有意义**。

  ::: warning 注意
  分词（tokenizing）和词法分析（Lexing）之间的区别是非常微妙、晦涩的，主要差异在于**词法单元的识别是通过有状态还是无状态的方式进行的**。简单来说，如果词法单元生成器在判断 a 是一个独立的词法单元还是其他词法单元的一部分时，调用的是**有状态的解析规则**，那么这个过程就**被称为词法分析**。
  :::

- :gem: **解析/语法分析（Parsing）**

  这个过程是将词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树。这个树被称为“**抽象语法树**”（Abstract Syntax Tree，`AST`）。

  var a = 2; 的抽象语法树中可能会有一个叫作 `VariableDeclaration` 的顶级节点，接下来是一个叫作 `Identifier`（它的值是 a）的子节点，以及一个叫作 `AssignmentExpression` 的子节点。AssignmentExpression 节点有一个叫作 `NumericLitral` （它的值是2）的子节点。

- :gem: **代码生成**

  **将 AST 转换为可执行代码的过程被称为代码生成**。这个过程**与语言、目标平台等息息相关**。

  抛开具体细节，简单来说就是有某种方法可以将 var a = 2; 的 AST 转化为一组机器指令，用来创建一个叫作 a 的变量（包括分配内存等），并将一个值储存在 a 中。

比起那些编译过程只有三个步骤的语言的编译器，**JavaScript 引擎要复杂得多**。例如，在语法分析和代码生成阶段有特定的步骤来对运行性能进行优化，包括对冗余元素进行优化等。

首先，JavaScript 引擎不会有大量的（像其他语言编译器那么多的）时间用来进行优化，因为与其他语言不同，**JavaScript 的编译过程不是发生在构建之前的**。

对于 JavaScript 来说，大部分情况下编译发生在代码执行前的几微秒（甚至更短！）的时间内。在我们所要讨论的作用域背后，JavaScript 引擎用尽了各种办法（比如 `JIT`，可以延迟编译甚至实施重编译）来保证性能最佳。

简单地说，**任何 JavaScript 代码片段在执行前都要进行编译（通常就在执行前）**。因此，JavaScript 编译器首先会对 var a = 2; 这段程序进行编译，然后做好执行它的准备，并且通常马上就会执行它。

### :blue_book: 理解作用域

在对程序 var a = 2; 的处理过程中，引擎、编译器和作用域分别负责重要的任务：

- :gem: **引擎**

  从头到尾负责整个 JavaScript 程序的编译及执行过程。

- :gem: **编译器**

  负责语法分析及代码生成等。

- :gem: **作用域**

  负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。

当前引擎碰见 var a = 2; 这段程序时，它会认为这里有两个完全不同的声明，**一个由编译器在编译时处理，另一个由引擎在运行时处理**。

下面我们将 var a = 2; 分解，看看引擎和它的朋友们是如何协同工作的。

编译器首先会将这段程序分解成词法单元，然后将词法单元解析成一个树结构。但是当编译器开始进行代码生成时，它对这段程序的处理方式会和预期的有所不同。

事实上编译器会进行如下处理。

1. 遇到 var a，编译器会询问作用域是否已经有一个该名称的变量存在于同一个作用域的集合中。如果是，编译器会忽略该声明，继续进行编译；否则它会要求作用域在当前作用域的集合中声明一个新的变量，并命名为 a。

2. 接下来编译器会为引擎生成运行时所需的代码，这些代码被用来处理 a = 2 这个赋值操作。引擎运行时会首先询问作用域，在当前的作用域集合中是否存在一个叫作 a 的变量。如果是，引擎就会使用这个变量；如果否，引擎会继续查找该变量。

如果引擎最终找到了 a 变量，就会将 2 赋值给它。否则引擎就会举手示意并抛出一个异常！

:pencil: 总结：变量的赋值操作会执行两个动作，**首先编译器会在当前作用域中声明一个变量（如果之前没有声明过），然后在运行时引擎会在作用域中查找该变量，如果能够找到就会对它赋值**。

### :blue_book: LHS 与 RHS

编译器在编译过程的第二步中生成了代码，引擎执行它时，会通过查找变量 a 来判断它是否已声明过。查找的过程由作用域进行协助，但是**引擎执行怎样的查找，会影响最终的查找结果**。

查询的方式有两种：`LHS` 查询和 `RHS` 查询。

其中，L 和 R 的含义是**一个赋值操作的左侧和右侧**。

可以简单理解成，当变量出现在赋值操作的左侧时进行 LHS 查询，出现在右侧时进行 RHS 查询。

但其实更准确的理解是，**RHS 查询与简单地查找某个变量的值别无二致，而 LHS 查询则是试图找到变量的容器本身，从而可以对其赋值**。从这个角度说，RHS 并不是真正意义上的“赋值操作的右侧”，更准确地说是“**非左侧**”。

看下面的例子：

```js
console.log(a)
```

这里对 a 的引用是一个 RHS 引用，因为这里的 a 并没有赋予任何值。相反，需要查找并取得 a 的值，这样才能将值传递给 console.log(...)。

再看另外一个例子：

```js
a = 2;
```

这里对 a 的引用则是 LHS 引用，因为实际上我们并不关心当前的值是什么，只是想要为 =2 这个赋值操作找到一个目标。

LHS 和 RHS 的含义是“赋值操作的左侧或右侧”并不一定意味着就是“= 赋值操作符的左侧或右侧”。赋值操作还有其他几种形式，因此，LHS 和 RHS 按下面的方式来理解最为适合：

:bell: LHS：**赋值操作的目标是谁**。

:bell: RHS：**谁是赋值操作的源头**。

下面这段程序中，既有 LHS 也有 RHS 引用：

```js
function foo(a) {
  console.log(a); // 2
}
foo(2);
```

最后一行 foo(..) 函数的调用需要对 foo 进行 RHS 引用，意味着“去找到 foo 的值，并把它给我”。

但是，代码中隐式的 a＝2 操作可能很容易被忽略掉。这个操作发生在 2 被当作参数传递给 foo(..) 函数时，2 会被分配给参数 a。为了给参数 a（隐式地）分配值，需要进行一次 LHS 查询。

这里还有对 a 进行的 RHS 引用，并且将得到的值传给了 console.log(..)。console. log(..) 本身也需要一个引用才能执行，因此会对 console 对象进行 RHS 查询，并且检查得到的值中是否有一个叫作 log 的方法。

### :blue_book: 小测验

```js
function foo(a) {
  var b = a;
  return a + b;
}
var c =foo(2);
```

1、找到其中所有的 LHS 查询。（有3处）

> 答案：c = ..;、a = 2（隐式变量分配）、b = ..

2、找到其中所有的 RHS 查询。（有4处）

> 答案：foo(2..、= a;、a ..、.. b

### :blue_book: 作用域嵌套

通过前面的学习知道，**作用域是根据名称查找变量的一套规则**。实际情况中，通常需要同时顾及几个作用域。

:bell: **当一个块或函数嵌套在另一个块或函数中时，就发生了作用域的嵌套。因此，在当前作用域中无法找到某个变量时，引擎就会在外层嵌套的作用域中继续查找，直到找到该变量， 或抵达最外层的作用域（也就是全局作用域）为止。**

看下面这个例子：

```js
function foo(a) {
  console.log(a + b);
}
var b = 2;
foo(2); // 4
```

对 b 进行的 RHS 引用无法在函数 foo 内部完成，但可以在上一级作用域（在这个例子中就 是全局作用域）中完成。

:bell: 遍历嵌套作用域链的规则很简单：**引擎从当前的执行作用域开始查找变量，如果找不到， 就向上一级继续查找。当抵达最外层的全局作用域时，无论找到还是没找到，查找过程都会停止**。

### :blue_book: 异常

区分 LHS 和 RHS 是一件很重要的事情，因为**在变量还没有声明（在任何作用域中都无法找到该变量）的情况下，这两种查询的行为是不一样的**。

看下面的代码：

```js
function foo(a) {
  console.log(a + b);
  b = a;
}
foo(2);
```

第一次对 b 进行 RHS 查询时是无法找到该变量的。也就是说，这是一个“未声明”的变量，因为在任何相关的作用域中都无法找到它。

:bell: **如果 RHS 查询在所有嵌套的作用域中遍寻不到所需的变量，引擎就会抛出 `ReferenceError` 异常**。值得注意的是，ReferenceError 是非常重要的异常类型。

:bell: 相比之下，**当引擎执行 LHS 查询时，如果在顶层（全局作用域）中也无法找到目标变量， 全局作用域中就会创建一个具有该名称的变量，并将其返还给引擎，前提是程序运行在非 “严格模式”下**。

ES5 中引入了“严格模式”。同正常模式，或者说宽松/懒惰模式相比，严格模式在行为上有很多不同。其中一个不同的行为是**严格模式禁止自动或隐式地创建全局变量**。因此，在严格模式中 LHS 查询失败时，并不会创建并返回一个全局变量，引擎会抛出同 RHS 查询失败时类似的 ReferenceError 异常。

如果 RHS 查询找到了一个变量，但是你**尝试对这个变量的值进行不合理的操作**， 比如试图对一个非函数类型的值进行函数调用，或着引用 null 或 undefined 类型的值中的属性，那么引擎会抛出另外一种类型的异常，叫作 `TypeError`。

:bell: **ReferenceError 同作用域判别失败相关，而 TypeError 则代表作用域判别成功了，但是对结果的操作是非法或不合理的**。

### :blue_book: 小结

1. 作用域是一套规则，用于确定在何处以及如何查找变量（标识符）。

2. 如果查找的目的是对变量进行赋值，那么就会使用 LHS 查询；如果目的是获取变量的值，就会使用 RHS 查询。

3. 赋值操作符会导致 LHS 查询。＝操作符或调用函数时传入参数的操作都会导致关联作用域的赋值操作。

4. JavaScript 引擎首先会在代码执行前对其进行编译，在这个过程中，像 var a = 2 这样的声明会被分解成两个独立的步骤：

   （1）首先，var a 在其作用域中声明新变量。这会在最开始的阶段，也就是代码执行前进行。  

   （2）接下来，a = 2 会查询（LHS 查询）变量 a 并对其进行赋值。

5. LHS 和 RHS 查询都会在当前执行作用域中开始，如果有需要（也就是说它们没有找到所需的标识符），就会向上级作用域继续查找目标标识符，这样每次上升一级作用域（一层楼），最后抵达全局作用域（顶层），无论找到或没找到都将停止。

6. 不成功的 RHS 引用会导致抛出 ReferenceError 异常。不成功的 LHS 引用会导致自动隐式地创建一个全局变量（非严格模式下），该变量使用 LHS 引用的目标作为标识符，或者抛出 ReferenceError 异常（严格模式下）。


## :books: 词法作用域

通过前面的学习可知，作用域是一套规则，它用来管理引擎如何在当前作用域以及嵌套的子作用域中根据标识符名称进行变量查找。

作用域共有两种主要的工作模型：

:bell: **词法作用域**，这是最为普遍的，被大多数编程语言所采用的。

:bell: **动态作用域**，这种仍有一些编程语言在使用（比如 Bash 脚本、Perl 中的一些模式等）。

### :blue_book: 词法阶段

大部分标准语言编译器的第一个工作阶段叫作**词法化**（也叫**单词化**）。**词法化的过程会对源代码中的字符进行检查，如果是有状态的解析过程，还会赋予单词语义**。这个概念是理解词法作用域及其名称来历的基础。

:bell: **词法作用域就是定义在词法阶段的作用域**。换句话说，词法作用域是由你在写代码时将变量和块作用域写在哪里来决定的，因此当词法分析器处理代码时会保持作用域不变（大部分情况下是这样的）。

比如下面这个例子：

```js
function foo(a) {
  var b = a * 2;
  function bar(c) {
    console.log(a, b, c);
  }
  bar(b * 3);
}
foo(2); // 2, 4, 12
```

在这个例子中有三个逐级嵌套的作用域。可以将它们想象成几个逐级包含的气泡。

![jsunknow](../.vuepress/public/assets/image/javascript/jsunknow1.png 'jsunknow')

:one: 包含着整个全局作用域，其中只有一个标识符：foo。

:two: 包含着 foo 所创建的作用域，其中有三个标识符：a、bar 和 b。

:three: 包含着 bar 所创建的作用域，其中只有一个标识符：c。

作用域气泡由其对应的作用域块代码写在哪里决定，它们是逐级包含的。

::: warning 注意
这里所说的气泡是严格包含的。也就是说，没有任何函数的气泡可以（部分地）同时出现在两个外部作用域的气泡中，就如同没有任何函数可以部分地同时出现在两个父级函数中一样。
:::

#### :gem: 查找变量

作用域气泡的结构和互相之间的位置关系给引擎提供了足够的位置信息，引擎用这些信息来查找标识符的位置。

在上面那个例子中，引擎执行 console.log(..) 声明，并查找 a、b 和 c 三个变量的引用。它首先从最内部的作用域，也就是 bar(..) 函数的作用域气泡开始查找。引擎无法在这里找到 a，因此会去上一级到所嵌套的 foo(..) 的作用域中继续查找。在这里找到了 a， 因此引擎使用了这个引用。对 b 来讲也是一样的。而对 c 来说，引擎在 bar(..) 中就找到了它。

如果 a、c 都存在于 bar(..) 和 foo(..) 的内部，console.log(..) 就可以直接使用 bar(..) 中的变量，而无需到外面的 foo(..) 中查找。

:bell: **作用域查找会在找到第一个匹配的标识符时停止**。

#### :gem: 遮蔽效应

在多层的嵌套作用域中可以定义同名的标识符，这叫作“遮蔽效应”（**内部的标识符“遮蔽”了外部的标识符**）。

抛开遮蔽效应，作用域查找始终从运行时所处的最内部作用域开始，逐级向外或者说向上进行，直到遇见第一个匹配的标识符为止。

::: warning 注意
全局变量会自动成为全局对象（比如浏览器中的 window 对象）的属性，因此可以不直接通过全局对象的词法名称，而是间接地通过对全局对象属性的引用来对其进行访问。

window.a

通过这种技术可以访问那些被同名变量所遮蔽的全局变量。但非全局的变量如果被遮蔽了，无论如何都无法被访问到。
:::

无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定。

:bell: **词法作用域查找只会查找一级标识符**，比如 a、b 和 c。如果代码中引用了 foo.bar.baz， 词法作用域查找只会试图查找 foo 标识符，找到这个变量后，**对象属性访问规则**会分别接管对 bar 和 baz 属性的访问。

### :blue_book: 欺骗词法

JavaScript 中有两种机制可以实现在运行时“修改”（也可以说欺骗）词法作用域：

:bell: **eval**

:bell: **with**

::: warning 注意
欺骗词法作用域会导致性能下降。
:::

#### :gem: eval

eval(..) 函数接受一个字符串为参数，它可以在你写的代码中用程序生成代码并运行，就好像代码本来就是写在那个位置的一样。

在执行 eval(..) 之后的代码时，引擎并不 “知道” 或 “在意” 前面的代码是以动态形式插入进来，并对词法作用域的环境进行修改的。引擎只会如往常地进行词法作用域查找。

比如下面这个例子：

```js
function foo(str, a) {
  eval(str); // 欺骗
  console.log(a, b)
}
var b = 2;
foo('var b = 3;', 1) // 1  3
```

eval(..) 调用中的 "var b = 3;" 这段代码会被当作本来就在那里一样来处理。由于那段代码声明了一个新的变量 b，因此它对已经存在的 foo(..) 的词法作用域进行了修改。事实上，和前面提到的原理一样，**这段代码实际上在 foo(..) 内部创建了一个变量 b，并遮蔽了外部（全局）作用域中的同名变量**。

当 console.log(..) 被执行时，会在 foo(..) 的内部同时找到 a 和 b，但是永远也无法找到外部的 b。因此会输出 “1, 3” 而不是正常情况下会输出的 “1, 2”。

**eval(..) 通常被用来执行动态创建的代码**。默认情况下，如果 eval(..) 中所执行的代码包含有一个或多个声明（无论是变量还是函数），就会对 eval(..) 所处的词法作用域进行修改。

技术上，通过一些技巧（已经超出我们的讨论范围）可以间接调用 eval(..) 来使其运行在全局作用域中，并对全局作用域进行修改。

但无论何种情况，**eval(..) 都可以在运行期修改书写期的词法作用域**。

::: warning 注意

在严格模式的程序中，eval(..) 在运行时有其自己的词法作用域，意味着其 中的声明无法修改所在的作用域。

```js
function foo(str) {
  "use strict";
  eval(str);
  console.log(a); // ReferenceError: a is not defined
}
foo("var a = 2");
```
:::

JavaScript 中还有其他一些功能效果和 eval(..) 很相似。setTimeout(..) 和 setInterval(..) 的第一个参数可以是字符串，字符串的内容可以被解释为一段动态生成的函数代码。

::: warning 注意

这些功能已经过时且并不被提倡。不要使用它们！

:::

new Function(..) 函数的行为也很类似，最后一个参数可以接受代码字符串，并将其转化为动态生成的函数（前面的参数是这个新生成的函数的形参）。**这种构建函数的语法比 eval(..) 略微安全一些，但也要尽量避免使用**。

在程序中动态生成代码的使用场景非常罕见，因为**它所带来的好处无法抵消性能上的损失**。

#### :gem: with

可以有很多种方法来解释 with，在这里从这个角度来解释它：它如何同被它所影响的词法作用域进行交互。

:bell: **with 通常被当作重复引用同一个对象中的多个属性的快捷方式，可以不需要重复引用对象本身**。

比如：

```js
var obj = {
  a: 1,
  b: 2,
  c: 3
}

// 单调乏味的重复 obj
obj.a = 2
obj.b = 3
obj.c = 4

// 简单的快捷方式
with (obj) {
  a = 3
  b = 4
  c = 5
}
```

但实际上这不仅仅是为了方便地访问对象属性。看下面这个例子：

```js
function foo (obj) {
  with (obj) {
    a = 2
  }
}

var o1 = {
  a: 3
}

var o2 = {
  b: 3
}

foo(o1)
console.log(o1.a) // 2

foo(o2)
console.log(o2.a) // undefined
console.log(a) // 2 —— a 被泄漏到全局作用域上了！
```

这个例子中创建了 o1 和 o2 两个对象。其中一个具有 a 属性，另外一个没有。foo(..) 函 数接受一个 obj 参数，该参数是一个对象引用，并对这个对象引用执行了 with(obj) {..}。 在 with 块内部，我们写的代码看起来只是对变量 a 进行简单的词法引用，实际上就是一个 LHS 引用，并将 2 赋值给它。

当我们将 o1 传递进去，a ＝ 2 赋值操作找到了 o1.a 并将 2 赋值给它。而当 o2 传递进去，o2 并没有 a 属性，因此不会创建这个属性， o2.a 保持 undefined。

但是此时却产生了一个奇怪的副作用，**实际上 a = 2 赋值操作创建了一个全局的变量 a**。

:bell: **with 可以将一个没有或有多个属性的对象处理为一个完全隔离的词法作用域，因此这个对象的属性也会被处理为定义在这个作用域中的词法标识符**。

::: warning 注意
尽管 with 块可以将一个对象处理为词法作用域，但是这个块内部正常的 var 声明并不会被限制在这个块的作用域中，而是被添加到 with 所处的函数作用域中。
:::

:bell: **eval(..) 函数如果接受了含有一个或多个声明的代码，就会修改其所处的词法作用域，而 with 声明实际上是根据你传递给它的对象凭空创建了一个全新的词法作用域**。

可以这样理解，当我们传递 o1 给 with 时，with 所声明的作用域是 o1，而这个作用域中含有一个同 o1.a 属性相符的标识符。但当我们将 o2 作为作用域时，其中并没有 a 标识符， 因此**进行了正常的 LHS 标识符查找**。

o2 的作用域、foo(..) 的作用域和全局作用域中都没有找到标识符 a，因此当 a＝2 执行时，自动创建了一个全局变量（因为是非严格模式）。

::: warning 注意
另外一个不推荐使用 eval(..) 和 with 的原因是会被严格模式所影响（限制）。with 被完全禁止，而在保留核心功能的前提下，间接或非安全地使用 eval(..) 也被禁止了。
:::

#### :gem: 性能

JavaScript 引擎会在编译阶段进行数项的性能优化。其中**有些优化依赖于能够根据代码的词法进行静态分析，并预先确定所有变量和函数的定义位置，才能在执行过程中快速找到标识符**。

但**如果引擎在代码中发现了 eval(..) 或 with，它只能简单地假设关于标识符位置的判断都是无效的**，因为无法在词法分析阶段明确知道 eval(..) 会接收到什么代码，这些代码会如何对作用域进行修改，也无法知道传递给 with 用来创建新词法作用域的对象的内容到底是什么。

:bell: **因此如果代码中大量使用 eval(..) 或 with，那么运行起来一定会变得非常慢**。

### :blue_book: 小结

1. 词法作用域意味着作用域是由书写代码时函数声明的位置来决定的。编译的词法分析阶段基本能够知道全部标识符在哪里以及是如何声明的，从而能够预测在执行过程中如何对它们进行查找。

2. JavaScript 中有两个机制可以 “欺骗” 词法作用域：eval(..) 和 with。

   前者可以对一段包含一个或多个声明的 “代码” 字符串进行演算，并借此来修改已经存在的词法作用域（在运行时）。

   后者本质上是通过将一个对象的引用当作作用域来处理，将对象的属性当作作用域中的标识符来处理，从而创建了一个新的词法作用域（同样是在运行时）。

3. 这两个机制的副作用是引擎无法在编译时对作用域查找进行优化，因为引擎只能谨慎地认为这样的优化是无效的。使用这其中任何一个机制都将导致代码运行变慢。不要使用它们！

## :books: 函数作用域和块作用域

通过前面的学习可知，作用域包含了一系列 “气泡”，那么，究竟是什么生成了一个新的气泡？只有函数会生成新的气泡吗？ JavaScript 中的其他结构能生成作用域气泡吗？

### :blue_book: 函数中的作用域

要回答上面的问题，需要先研究一下函数作用域及其背后的一些内容。

看下面这段代码：

```js
function foo (a) {
  var b = 2
  // 一些代码
  function bar () {
    // ...
  }
  // 更多代码
  var c = 3
}
```

在这个代码片段中，foo(..) 的作用域气泡中包含了标识符 a、b、c 和 bar。无论标识符声明出现在作用域中的何处，这个标识符所代表的变量或函数都将附属于所处作用域的气泡。

bar(..) 拥有自己的作用域气泡。全局作用域也有自己的作用域气泡，它只包含了一个标识符：foo。

由于标识符 a、b、c 和 bar 都附属于 foo(..) 的作用域气泡，因此无法从 foo(..) 的外部对它们进行访问。也就是说，这些标识符全都无法从全局作用域中进行访问，因此下面的代码会导致 ReferenceError 错误：

```js
bar() // 失败
console.log(a, b, c) // 三个都失败
```

但是，这些标识符（a、b、c、foo 和 bar）在 foo(..) 的内部都是可以被访问的，同样在 bar(..) 内部也可以被访问（假设 bar(..) 内部没有同名的标识符声明）。

:bell: **函数作用域的含义是指，属于这个函数的全部变量都可以在整个函数的范围内使用及复用（事实上在嵌套的作用域中也可以使用）**。

这种设计方案是非常有用的，能充分利用 JavaScript 变量可以根据需要改变值类型的 “动态” 特性。

但与此同时，如果不细心处理那些可以在整个作用域范围内被访问的变量，可能会带来意 想不到的问题。

### :blue_book: 隐藏内部实现

对函数的传统认知就是先声明一个函数，然后再向里面添加代码。但反过来想也可以带来一些启示：从所写的代码中挑选出一个任意的片段，然后用函数声明对它进行包装，实际上就是把这些代码“隐藏”起来了。

实际的结果就是在这个代码片段的周围创建了一个作用域气泡，也就是说这段代码中的任何声明（变量或函数）都将绑定在这个新创建的包装函数的作用域中，而不是先前所在的作用域中。换句话说，**可以把变量和函数包裹在一个函数的作用域中，然后用这个作用域来 “隐藏” 它们**。

为什么 “隐藏” 变量和函数是一个有用的技术？

有很多原因促成了这种基于作用域的隐藏方法。

:bell: 它们大都是从**最小特权原则**中引申出来的，也叫**最小授权或最小暴露原则**。这个原则是指**在软件设计中，应该最小限度地暴露必要内容，而将其他内容都 “隐藏” 起来，比如某个模块或对象的 API 设计**。

这个原则可以延伸到如何选择作用域来包含变量和函数。如果所有变量和函数都在全局作用域中，当然可以在所有的内部嵌套作用域中访问到它们。但这样会破坏前面提到的最小特权原则，因为可能会暴漏过多的变量或函数，而这些变量或函数本应该是私有的，正确的代码应该是可以阻止对这些变量或函数进行访问的。

比如：

```js
function doSomething (a) {
  b = a + doSomethingElse(a * 2)
  console.log(b * 3)
}
function doSomethigElse (a) {
  return a - 1
}
var b
doSomethig(2) // 15
```

在这个代码片段中，变量 b 和函数 doSomethingElse(..) 应该是 doSomething(..) 内部具体实现的 “私有” 内容。给予外部作用域对 b 和 doSomethingElse(..) 的 “访问权限” 不仅没有必要，而且可能是 “危险” 的，因为它们可能被有意或无意地以非预期的方式使用， 从而导致超出了 doSomething(..) 的适用条件。更 “合理” 的设计会将这些私有的具体内容隐藏在 doSomething(..) 内部，例如：

```js
function doSomething (a) {
  function doSomethingElse (a) {
    return a - 1
  }
  var b
  b = a + doSomethingElse(a * 2)
}
doSmoething(2) // 15
```

现在，b 和 doSomethingElse(..) 都无法从外部被访问，而只能被 doSomething(..) 所控制。 功能性和最终效果都没有受影响，但是设计上将具体内容私有化了，设计良好的软件都会依此进行实现。

#### :gem: 规避冲突

:bell: “隐藏”作用域中的变量和函数所带来的另一个好处，是**可以避免同名标识符之间的冲突**。

两个标识符可能具有相同的名字但用途却不一样，无意间可能造成命名冲突。**冲突会导致变量的值被意外覆盖**。

比如：

```js
function foo () {
  function bar (a) {
    i = 3 // 修改 for 循环所属作用域的 i
    console.log(a + i)
  }
  for (var i = 0; i < 10; i++) {
    bar(i * 2) // 陷入死循环中！
  }
}
foo()
```

bar(..) 内部的赋值表达式 i = 3 意外地覆盖了声明在 foo(..) 内部 for 循环中的 i。在这个例子中将会导致无限循环，因为 i 被固定设置为 3，永远满足小于 10 这个条件。

解决这个问题的方法是，bar(..) 内部的赋值操作需要声明一个本地变量来使用，采用任何名字都可以 var i = 3 就可以满足这个需求（**同时会为 i 声明一个前面提到过的“遮蔽变量”**）。另外一种方法是采用一个完全不同的标识符名称，比如 var j = 3。

但是软件设计在某种情况下可能自然而然地要求使用同样的标识符名称，因此在这种情况下使用作用域来“隐藏”内部声明是唯一的最佳选择。

规避冲突的常见方法有以下两种：

**1. 全局命名空间**

很多第三方库通常会**在全局作用域中声明一个名字足够独特的变量，通常是一个对象。这个对象被用作库的命名空间，所有需要暴露给外界的功能都会成为这个对象（命名空间）的属性**，而不是将自己的标识符暴漏在顶级的词法作用域中。

比如：

```js
var MyReallyCoolLibrary = {
  awesome: 'stuff',
  doSomething: function () {
    // ...
  },
  doAnotherThing: function () {
    // ...
  }
}
```

**2. 模块管理**

这种方法和现代的模块机制很接近，就是从众多模块管理器中挑选一个来使用。使用这些工具，任何库都无需将标识符加入到全局作用域中，而是通过依赖管理器的机制将库的标识符显式地导入到另外一个特定的作用域中。

这些工具并没有能够违反词法作用域规则的“神奇”功能。**它们只是利用作用域的规则强制所有标识符都不能注入到共享作用域中**，而是保持在私有、无冲突的作用域中，这样可以有效规避掉所有的意外冲突。

不过，即使不使用任何依赖管理工具也可以实现相同的功效。


### :blue_book: 函数作用域

我们已经知道，在任意代码片段外部添加包装函数，可以将内部的变量和函数定义“隐藏”起来，外部作用域无法访问包装函数内部的任何内容。

比如：

```js
var a = 2

function foo () {
  var a = 3
  console.log(a) // 3
}
foo()

console.log(a) // 2
```

虽然这种技术可以解决一些问题，但是它并不理想，因为会导致一些额外的问题。

- 首先，必须声明一个具名函数 foo()，意味着 foo 这个名称本身“污染”了所在作用域（在这个例子中是全局作用域）。

- 其次，必须显式地通过函数名（foo()）调用这个函数才能运行其中的代码。

如果函数不需要函数名（或者至少函数名可以不污染所在作用域），并且能够自动运行，这将会更加理想。

JavaScript 提供了能够同时解决这两个问题的方案：

```js
var a = 2;

(function foo () {
  var a = 3
  console.log(a) // 3
})()
console.log(a) // 2
```

:question: 我运行这段代码，发现并不像书中说的打印2，而是会报 Uncaught TypeError: 2 is not a function 的错误，不知道为啥。

:exclamation: 找到原因了！原来是因为第一行 var a = 2 没带分号，导致立即执行函数执行时把2也当成一个函数去执行了！所以把分号还回去就没问题了。以后要注意，:bell: **立即执行函数前面声明变量时不要省略分号！**

在这段代码中，包装函数的声明以 `(function...` 而不仅是以 `function...` 开始，这是一个很重要的区别。:bell: **函数会被当作函数表达式而不是一个标准的函数声明来处理**。

::: warning 注意
区分函数声明和表达式最简单的方法是看 function 关键字出现在声明中的位置（不仅仅是一行代码，而是整个声明中的位置）。如果 function 是声明中的第一个词，那么就是一个函数声明，否则就是一个函数表达式。
:::

函数声明和函数表达式之间最重要的区别是**它们的名称标识符将会绑定在何处**。

第一段代码中 foo 被绑定在所在作用域中，可以直接通过 foo() 来调用它。第二段代码中 foo 被绑定在函数表达式自身的函数中而不是所在作用域中。

换句话说，(function foo(){ .. }) 作为函数表达式意味着 **foo 只能在 .. 所代表的位置中被访问，外部作用域则不行**。foo 变量名被隐藏在自身中意味着不会非必要地污染外部作用域。

#### :gem: 匿名和具名

对于函数表达式最熟悉的场景可能就是回调函数了，比如：

```js
setTimeout(function () {
  console.log('I waited 1 second!')
}, 1000)
```

这叫**匿名函数表达式**，因为 function().. 没有名称标识符。

:bell: **函数表达式可以是匿名的， 而函数声明则不可以省略函数名 —— 在 JavaScript 的语法中这是非法的**。

匿名函数表达式书写起来简单快捷，很多库和工具也倾向鼓励使用这种风格的代码。但它有几个缺点：

1. 匿名函数在栈追踪中不会显示出有意义的函数名，使得调试很困难。

2. 如果没有函数名，当函数需要引用自身时只能使用已经过期的 arguments.callee 引用，比如在递归中。另一个函数需要引用自身的例子，是在事件触发后事件监听器需要解绑自身。

3. 匿名函数省略了对于代码可读性/可理解性很重要的函数名。一个描述性的名称可以让代码不言自明。

:bell: **行内函数表达式**

给函数表达式指定一个函数名可以有效解决以上问题。始终给函数表达式命名是一个最佳实践：

```js
setTimeout(function timeoutHandler () {
  console.log('I waited 1 second!')
}, 1000)
```

#### :gem: 立即执行函数表达式

```js
(function () {
  // ...
})()

// 或者

(function () {
  // ...
}())
```

第一种形式中第一个 () 将函数变成表达式，第二个 () 执行了这个函数。

第二种形式中用来调用的 () 括号被移进了用来包装的 ( ) 括号中。

这两种形式在功能上是一样的，立即执行表达式有一个术语：`IIFE`。

::: warning 注意
函数名对 IIFE 当然不是必须的，IIFE 最常见的用法是使用一个匿名函数表达式。虽然使用具名函数的 IIFE 并不常见，但它具有上述匿名函数表达式的所有优势，因此也是一个值得推广的实践。
:::

IIFE 的另一个非常普遍的进阶用法是**把它们当作函数调用并传递参数进去**。

```js
var a = 2;

(function IIFE (global) {
  var a = 3
  console.log(a) // 3
  console.log(global.a) // 2
})(window)

console.log(a) // 2
```

这个模式的另外一个应用场景是**解决 undefined 标识符的默认值被错误覆盖导致的异常（虽然不常见）**。将一个参数命名为 undefined，但是在对应的位置不传入任何值，这样就可保证在代码块中 undefined 标识符的值真的是 undefined：

```js
undefined = true; // 给其他代码挖了一个大坑！绝对不要这样做！

(function IIFE (undefined) {
  var a
  if (a === undefined) {
    console.log('Undefined is safe here!')
  }
})()
```

IIFE 还有一种变化的用途是**倒置代码的运行顺序，将需要运行的函数放在第二位，在 IIFE 执行之后当作参数传递进去**。这种模式在 UMD（Universal Module Definition）项目中被广泛使用。尽管这种模式略显冗长，但有些人认为它更易理解。

```js
var a = 2;

(function IIFE (def) {
  def(window)
})(function def (global) {
  var a = 3
  console.log(a) // 3
  console.log(global.a) // 2
})
```

函数表达式 def 定义在片段的第二部分，然后当作参数（这个参数也叫作 def）被传递进 IIFE 函数定义的第一部分中。最后，参数 def（也就是传递进去的函数）被调用，并将 window 传入当作 global 参数的值。

### :blue_book: 块作用域

除 JavaScript 外的很多编程语言都支持块作用域，因此其他语言的开发者对于相关的思维方式会很熟悉，但是对于主要使用 JavaScript 的开发者来说，这个概念会很陌生。

先看一个例子：

```js
for (var i = 0; i < 10; i++) {
  console.log(i)
}
```

我们在 for 循环的头部直接定义了变量 i，通常是因为只想在 for 循环内部的上下文中使用 i，而忽略了 **i 会被绑定在外部作用域（函数或全局）中**的事实。

再看另一个例子：

```js
var foo = true

if (foo) {
  var bar = foo * 2
  bar = something(bar)
  console.log(bar)
}
```

bar 变量仅在 if 声明的上下文中使用，因此如果能将它声明在 if 块内部中会是一个很有意义的事情。但是，当使用 var 声明变量时，它写在哪里都是一样的，因为它们最终都会属于外部作用域。这段代码是为了风格更易读而伪装出的形式上的块作用域，如果使用这种形式，要确保没在作用域其他地方意外地使用 bar 只能依靠自觉性。

:bell: **块作用域是一个用来对之前的最小授权原则进行扩展的工具，将代码从在函数中隐藏信息 扩展为在块中隐藏信息**。

JavaScript 中能够提供块级作用域功能的方法有以下几种：

#### :gem: with

with 不仅是一个难于理解的结构，同时也是块作用域的一个例子（块作用域的一种形式），用 with 从对象中创建出的作用域仅在 with 声明中而非外部作用域中有效。

#### :gem: try/catch

JavaScript 的 ES3 规范中规定 try/catch 的 catch 分句会创建一个块作用域，其中声明的变量仅在 catch 内部有效。

比如：

```js
try {
  undefined() // 执行一个非法操作来强制制造一个异常
} catch (err) {
  console.log(err) // 能够正常执行
}
console.log(err) // ReferenceError: err not found
```

可见，err 仅存在 catch 分句内部，当试图从别处引用它时会抛出错误。

::: warning 注意
尽管这个行为已经被标准化，并且被大部分的标准 JavaScript 环境（除了老版本的 IE 浏览器）所支持，但是当同一个作用域中的两个或多个 catch 分句用同样的标识符名称声明错误变量时，很多静态检查工具还是会发出警告。实际上这并不是重复定义，因为所有变量都被安全地限制在块作用域内部，但是静态检查工具还是会很烦人地发出警告。

为了避免这个不必要的警告，很多开发者会将 catch 的参数命名为 err1、err2 等。也有开发者干脆关闭了静态检查工具对重复变量名的检查。
:::

#### :gem: let

let 关键字可以将变量绑定到所在的任意作用域中（通常是 { .. } 内部）。换句话说，**let 为其声明的变量隐式地绑定了所在的块作用域**。

```js
var foo = true

if (foo) {
  let bar = foo * 2
  bar = something(bar)
  console.log(bar)
}

console.log(bar) // ReferenceError
```

用 let 将变量附加在一个已经存在的块作用域上的行为是隐式的。

在开发和修改代码的过程中，如果没有密切关注哪些块作用域中有绑定的变量，并且习惯性地移动这些块或者将其包含在其他的块中，就会导致代码变得混乱。

为块作用域显式地创建块可以部分解决这个问题，使变量的附属关系变得更加清晰。**通常来讲，显式的代码优于隐式或一些精巧但不清晰的代码**。显式的块作用域风格非常容易书写，并且和其他语言中块作用域的工作原理一致：

```js
var foo = true

if (foo) {
  { // 显示的块
    let bar = foo * 2
    bar = something(bar)
    console.log(bar)
  }
}

console.log(bar) // ReferenceError
```

只要声明是有效的，在声明中的任意位置都可以使用 { .. } 括号来为 let 创建一个用于绑定的块。

使用 let 进行的声明不会在块作用域中进行提升。声明的代码被运行之前，声明并不 “存在”。比如：

```js
{
  console.log(bar) // ReferenceError
  let bar = 2
}
```

**1. 垃圾收集**

另一个块作用域非常有用的原因和闭包及回收内存垃圾的回收机制相关。

看下面的代码：

```js
function process (data) {
  // ...
}

var someReallyBigData = { ... }

process(someReallyBigData)

var btn = document.getElementById('my_button')

btn.addEventListener('click', function click (evt) {
  console.log('button clicked')
}, /*capturingPhase*/false)
```

click 函数的点击回调并不需要 someReallyBigData 变量。理论上这意味着当 process(..) 执行后，在内存中占用大量空间的数据结构就可以被垃圾回收了。但是，由于 click 函数形成了一个覆盖整个作用域的闭包，JavaScript 引擎极有可能依然保存着这个结构（取决于具体实现）。

块作用域可以打消这种顾虑，可以让引擎清楚地知道没有必要继续保存 someReallyBigData 了：

```js
function process (data) {
  // ...
}

{ // 在这个块中定义的内容可以销毁了！
  var someReallyBigData = { ... }

  process(someReallyBigData)
}

var btn = document.getElementById('my_button')

btn.addEventListener('click', function click (evt) {
  console.log('button clicked')
}, /*capturingPhase*/false)
```

**2. let 循环**

一个 let 可以发挥优势的典型例子就是之前讨论的 for 循环。

```js
for (let i = 0; i < 10; i++) {
  console.log(i)
}
console.log(i) // ReferenceError
```

for 循环头部的 let 不仅将 i 绑定到了 for 循环的块中，**事实上它将其重新绑定到了循环的每一个迭代中，确保使用上一个循环迭代结束时的值重新进行赋值**。

下面通过另一种方式来说明每次迭代时进行重新绑定的行为：

```js
{
  let j
  for (j = 0; j < 10; j++) {
    let i = j // 每个迭代重新绑定
    console.log(i)
  }
}
```

#### :gem: const

const 同样可以用来创建块作用域变量，但其值是固定的（常量）。之后任何试图修改值的操作都会引起错误。

```js
var foo = true

if (foo) {
  var a = 2
  const b = 3

  a = 3 // 正常
  b = 4 // 错误，TypeError
}

console.log(a) // 3
console.log(b) // ReferenceError
```

### :blue_book: 小结

1. 函数是 JavaScript 中最常见的作用域单元。本质上，声明在一个函数内部的变量或函数会在所处的作用域中“隐藏”起来，这是有意为之的良好软件的设计原则。

2. 但函数不是唯一的作用域单元。块作用域指的是变量和函数不仅可以属于所处的作用域，也可以属于某个代码块（通常指 { .. } 内部）。

3. 从 ES3 开始，try/catch 结构在 catch 分句中具有块作用域。

4. 在 ES6 中引入了 let 关键字（var 关键字的表亲），用来在任意代码块中声明变量。if (..) { let a = 2; } 会声明一个劫持了 if 的 { .. } 块的变量，并且将变量添加到这个块中。

5. 有些人认为块作用域不应该完全作为函数作用域的替代方案。两种功能应该同时存在，开发者可以并且也应该根据需要选择使用何种作用域，创造可读、可维护的优良代码。

## :books: 提升

先看下面两段代码：

```js
a = 2
var a
console.log(a) // 2
```

```js
console.log(a)
var a = 2 // undefined
```

### :blue_book: 编译器再度来袭

为了明白以上两段代码发生了什么，需要回忆一下前几章的内容。引擎会在解释 JavaScript 代码之前首先对其进行编译。编译阶段中的一部分工作就是找到所有的声明，并用合适的作用域将它们关联起来。第 2 章中展示了这个机制，也正是词法作用域的核心内容。

所以，正确的思考思路是：

:bell: **包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理**。

当你看到 var a = 2; 时，可能会认为这是一个声明。但 JavaScript 实际上会将其看成两个声明：var a; 和 a = 2;。**第一个定义声明是在编译阶段进行的。第二个赋值声明会被留在原地等待执行阶段**。

因此，第一段代码会以如下形式进行处理：

```js
var a
a = 2
console.log(a)
```

其中第一部分是编译，第二部分是执行。

第二段代码会按照以下流程进行处理：

```js
var a
console.log(a)
a = 2
```

不难发现，变量和函数声明被移动到了最上面，这个过程就叫作**提升**。因此，**先有声明后有赋值**。

::: warning 注意

只有声明本身会被提升，而赋值或其他运行逻辑会留在原地。如果提升改变了代码执行的顺序，会造成非常严重的破坏。

```js
foo()

function foo () {
  console.log(a) // undefined
  var a = 2
}
```

:::

foo 函数的声明被提升了，并且 foo(..) 函数自身也会在内部对 var a 进行提升，因此第一行中的调用可以正常执行。这段代码可以理解成下面的形式：

```js
function foo () {
  var a
  console.log(a) // undefined
  a = 2
}
foo()
```

:bell: **每个作用域都会进行提升操作**。

:bell: **函数声明会被提升，但是函数表达式却不会被提升**。

```js
foo() // Uncaught TypeError: foo is not a function

var foo = function bar() {
  // ...
}
```

这段程序中的变量标识符 foo() 被提升并分配给所在作用域（在这里是全局作用域），因此 foo() 不会导致 ReferenceError。但是 foo 此时并没有赋值（如果它是一个函数声明而不是函数表达式，那么就会赋值）。foo() 由于对 undefined 值进行函数调用而导致非法操作，因此抛出 TypeError 异常。

:bell: **即使是具名的函数表达式，名称标识符在赋值之前也无法在所在作用域中使用**。

```js
foo() // Uncaught TypeError: foo is not a function
bar() // Uncaught ReferenceError: bar is not defined

var foo = function bar() {
  // ...
}
```

这段代码经过提升后，会被理解成以下形式：

```js
var foo

foo()
bar()

foo = function () {
  var bar = ...self...
  // ...
}
```

### :blue_book: 函数优先

函数声明和变量声明都会被提升。但是有一个值得注意的细节是：

:bell: **函数会首先被提升，然后才是变量。**

```js
foo()

var foo

function foo() {
  console.log(1)
}

foo = function() {
  console.log(2)
}
```

这段代码会输出1而不是2！它会被引擎理解为如下形式：

```js
function foo() {
  console.log(1)
}

foo() // 1

foo = function() {
  console.log(2)
}
```

注意，var foo 尽管出现在 function foo()... 的声明之前，但它是重复的声明（因此被忽略了），因为函数声明会被提升到普通变量之前。

:bell: **尽管重复的 var 声明会被忽略掉，但出现在后面的函数声明还是可以覆盖前面的**。

```js
foo() // 3

function foo() {
  console.log(1)
}

var foo = function() {
  console.log(2)
}

function foo() {
  console.log(3)
}
```

一个普通块内部的函数声明通常会被提升到所在作用域的顶部。

```js
foo() // Uncaught TypeError: foo is not a function

var a = true
if (a) {
  function foo() {
    console.log('a')
  }
} else {
  function foo() {
    console.log('b')
  }
}
```

应该尽可能避免在块内部声明函数。

### :blue_book: 小结

1. JavaScript 会将 var a = 2; 看成是 var a 和 a = 2 两个单独的声明，第一个是在编译阶段的任务，第二个是在执行阶段的任务。

2. 无论作用域中的声明出现在什么地方，都将在代码本身被执行前首先进行处理。可以将这个过程形象地想象成所有的声明（变量和函数）都会被“移动”到各自作用域的最顶端，这个过程被称为提升。

3. 声明本身会被提升，而包括函数表达式的赋值在内的赋值操作并不会提升。

4. 要注意避免重复声明，特别是当普通的 var 声明和函数声明混合在一起的时候，否则会引起很多危险的问题！

## :books: 作用域闭包

闭包是基于词法作用域书写代码时所产生的自然结果，你甚至不需要为了利用它们而有意识地创建闭包。闭包的创建和使用在你的代码中随处可见。你缺少的是根据你自己的意愿来识别、拥抱和影响闭包的思维环境。

### :blue_book: 什么是闭包

闭包的定义如下：

:bell: **当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。**

下面用一些代码来解释这个定义：

```js
function foo() {
  var a = 2
  function bar() {
    console.log(a) // 2
  }
  bar()
}
foo()
```

这段代码看起来和嵌套作用域中的示例代码很相似。基于词法作用域的查找规则，函数 bar() 可以访问外部作用域中的变量 a（这个例子中的是一个 RHS 引用查询）。

:question: 这是闭包吗？

技术上来讲，也许是。但根据前面的定义，确切地说并不是。最准确地用来解释 bar() 对 a 的引用的方法是**词法作用域的查找规则，而这些规则只是闭包的一部分**。（但却是非常重要的一部分！）

从纯学术的角度说，在上面的代码片段中，函数 bar() 具有一个涵盖 foo() 作用域的闭包（事实上，涵盖了它能访问的所有作用域，比如全局作用域）。也可以认为 bar() 被封闭在了 foo() 的作用域中。为什么呢？原因简单明了，因为 bar() 嵌套在 foo() 内部。

但是通过这种方式定义的闭包并不能直接进行观察，也无法明白在这个代码片段中闭包是如何工作的。我们可以很容易地理解词法作用域，而闭包则隐藏在代码之后的神秘阴影里，并不那么容易理解。

下面这段代码就清晰地展示了闭包：

```js
function foo() {
  var a = 2
  function bar() {
    console.log(a)
  }
  return bar
}

var baz = foo()
baz() // 2 —— 这才是闭包的效果
```

- 函数 bar() 的词法作用域能够访问 foo() 的内部作用域。然后**我们将 bar() 函数本身当作一个值类型进行传递。在这个例子中，我们将 bar 所引用的函数对象本身当作返回值。**

- 在 foo() 执行后，其返回值（也就是内部的 bar() 函数）赋值给变量 baz 并调用 baz()，实际上只是通过不同的标识符引用调用了内部的函数 bar()。

- bar() 显然可以被正常执行。但是在这个例子中，它在自己定义的词法作用域以外的地方执行。

- 在 foo() 执行后，通常会期待 foo() 的整个内部作用域都被销毁，因为我们知道引擎有垃圾回收器用来释放不再使用的内存空间。由于看上去 foo() 的内容不会再被使用，所以很自然地会考虑对其进行回收。

- :bell: 而闭包的“神奇”之处正是可以阻止这件事情的发生。**事实上内部作用域依然存在，因此没有被回收**。谁在使用这个内部作用域？原来是 **bar() 本身在使用**。

- 拜 bar() 所声明的位置所赐，它拥有涵盖 foo() 内部作用域的闭包，使得该作用域能够一直存活，以供 bar() 在之后任何时间进行引用。

- bar() 依然持有对该作用域的引用，而这个引用就叫作闭包。

- 这个函数在定义时的词法作用域以外的地方被调用。闭包使得函数可以继续访问定义时的词法作用域。

无论使用何种方式对函数类型的值进行传递，当函数在别处被调用时都可以观察到闭包。

```js
function foo() {
  var a = 2
  function baz() {
    console.log(a) // 2
  }
  bar(baz)
}
function bar(fn) {
  fn() // 这是闭包
}
```

把内部函数 baz 传递给 bar，当调用这个内部函数时（现在叫作 fn），它涵盖的 foo() 内部作用域的闭包就可以观察到了，因为它能够访问 a。

传递函数也可以是间接的。

```js
var fn

function foo() {
  var a = 2
  function baz() {
    console.log(a)
  }
  fn = baz // 将 baz 分配给全局变量
}

function bar() {
  fn() // 这也是闭包
}

foo()
bar() // 2
```

无论通过何种手段将内部函数传递到所在的词法作用域以外，它都会持有对原始定义作用域的引用，无论在何处执行这个函数都会使用闭包。

```js
function wait(message) {
  setTimeout(function timer() {
    console.log(message)
  }, 1000)
}
wait('Hello World!') // Hello World!
```

将一个内部函数（名为 timer）传递给 setTimeout(..)。timer 具有涵盖 wait(..) 作用域的闭包，因此还保有对变量 message 的引用。wait(..) 执行 1000 毫秒后，它的内部作用域并不会消失，timer 函数依然保有 wait(..) 作用域的闭包。

下面是一段使用 jQuery 的代码：

```js
function setupBot(name, selector) {
  $(selector).click(function activator() {
    console.log('Activating:' + name)
  })
}
setupBot("Closure Bot 1", "#bot_1")
setupBot("Closure Bot 2", "#bot_2")
```

在定时器、事件监听器、Ajax 请求、跨窗口通信、Web Workers 或者任何其他的异步（或者同步）任务中，只要使用了回调函数，实际上就是在使用闭包！

::: warning 注意

通常认为 IIFE 是典型的闭包例子，但是根据之前对闭包的定义，我并不是很同意这个观点。

```js
var a = 2;
(function IIFE() {
  console.log(a)
})()
```

虽然这段代码可以正常工作，但严格来讲它并不是闭包。为什么？**因为函数（示例代码中 的 IIFE）并不是在它本身的词法作用域以外执行的**。它在定义时所在的作用域中执行（而外部作用域，也就是全局作用域也持有 a）。**a 是通过普通的词法作用域查找而非闭包被发现的**。

**尽管 IIFE 本身并不是观察闭包的恰当例子，但它的确创建了闭包，并且也是最常用来创建可以被封闭起来的闭包的工具**。因此 IIFE 的确同闭包息息相关，即使本身并不会真的使用闭包。

:::

### :blue_book: 循环和闭包

要说明闭包，for 循环是最常见的例子：

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
```

正常情况下，我们对这段代码行为的预期是分别输出数字 1~5，每秒一次，每次一个。但实际上，这段代码在运行时会以每秒一次的频率输出五次 6。

这是为什么？ 首先解释 6 是从哪里来的。这个循环的终止条件是 i 不再 <=5。条件首次成立时 i 的值是 6。因此，输出显示的是循环结束时 i 的最终值。

延迟函数的回调会在循环结束时才执行。事实上，当定时器运行时即使每个迭代中执行的是 setTimeout(.., 0)，所有的回调函数依然是在循环结束后才会被执行，因此会每次输出一个 6 出来。

这里引伸出一个更深入的问题，代码中到底有什么缺陷导致它的行为同语义所暗示的不一致呢？

缺陷是我们试图假设循环中的每个迭代在运行时都会给自己“捕获”一个 i 的副本。但是根据作用域的工作原理，实际情况是**尽管循环中的五个函数是在各个迭代中分别定义的，但是它们都被封闭在一个共享的全局作用域中，因此实际上只有一个 i**。

如果通过 IIFE 来为循环过程中的每次迭代都创建一个闭包作用域，能解决问题吗？

```js
for (var i = 1; i <= 5; i++) {
  (function () {
    setTimeout(function timer() {
      console.log(i)
    }, i * 1000)
  })()
}
```

答案是不行。因为我们的 IIFE 只是一个什么都没有的空作用域。它需要包含一点实质内容才能为我们所用。

它需要有自己的变量，用来在每个迭代中储存 i 的值：

```js
for (var i = 1; i <= 5; i++) {
  (function() {
    var j = i
    setTimeout(function timer() {
      console.log(j)
    }, j * 1000)
  })()
}
```

这样就可以了！

对这段代码进行一些改进：

```js
for (var i = 1; i <= 5; i++) {
  (function(j) {
    setTimeout(function timer() {
      console.log(j)
    }, j * 1000)
  })(i)
} 
```

在迭代内使用 IIFE 会为每个迭代都生成一个新的作用域，使得延迟函数的回调可以将新的作用域封闭在每个迭代内部，每个迭代中都会含有一个具有正确值的变量供我们访问。

上面的问题除了用 IIFE 解决，也可以用块作用域来解决。

```js
for (var i = 1; i <= 5; i++) {
  let j = i
  setTimeout(function timer() {
    console.log(j)
  }, j * 1000)
}
```

改进一下：

```js
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
```

完美解决！

### :blue_book: 模块

利用闭包还可以实现另外一个强大的东西：模块。

先看这段代码：

```js
function foo() {
  var something = 'cool'
  var another = [1, 2, 3]
  function doSomething() {
    console.log(something)
  }
  function doAnother() {
    console.log(another.join('!'))
  }
}
```

这段代码只有两个私有数据变量 something 和 another，以及 doSomething() 和 doAnother() 两个内部函数，它们的词法作用域（而这就是闭包）也就是 foo() 的内部作用域。

再看下面这段：

```js
function CoolModule() {
  var something = 'cool'
  var another = [1, 2, 3]
  function doSomething() {
    console.log(something)
  }
  function doAnother() {
    console.log(another.join('!'))
  }
  return {
    doSomething: doSomething,
    doAnother: doAnother
  }
}
var foo = CoolModule()

foo.doSomething() // cool
foo.doAnother() //1!2!3
```

这个模式在 JavaScript 中被称为模块。最常见的实现模块模式的方法通常被称为**模块暴露**，这里展示的是其变体。

首先，CoolModule() 只是一个函数，必须要通过调用它来创建一个模块实例。如果不执行外部函数，内部作用域和闭包都无法被创建。

其次，CoolModule() 返回一个用对象字面量语法 { key: value, ... } 来表示的对象。这个返回的对象中含有对内部函数而不是内部数据变量的引用。我们保持内部数据变量是隐藏且私有的状态。可以将这个对象类型的返回值看作本质上是**模块的公共 API**。

这个对象类型的返回值最终被赋值给外部的变量 foo，然后就可以通过它来访问 API 中的属性方法，比如 foo.doSomething()。

::: warning 注意
**从模块中返回一个实际的对象并不是必须的，也可以直接返回一个内部函数**。jQuery 就是一个很好的例子。jQuery 和 $ 标识符就是 jQuery 模块的公共 API，但它们本身都是函数(由于函数也是对象，它们本身也可以拥有属性)。
:::

doSomething() 和 doAnother() 函数**具有涵盖模块实例内部作用域的闭包(通过调用 CoolModule() 实现)**。当通过返回一个含有属性引用的对象的方式来将函数传递到词法作用域外部时，我们已经创造了可以观察和实践闭包的条件。

:bell: **简单来说，模块需要具备两个必要条件：**

1. 必须**有外部的封闭函数**，该函数必须**至少被调用一次**（每次调用都会创建一个新的模块实例）。

2. 封闭函数必须**返回至少一个内部函数**，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态。

一个具有函数属性的对象本身并不是真正的模块。**从方便观察的角度看，一个从函数调用所返回的，只有数据属性而没有闭包函数的对象并不是真正的模块**。

上面那段代码中有一个叫作 CoolModule() 的独立的模块创建器，可以被调用任意多次，每次调用都会创建一个新的模块实例。当只需要一个实例时，可以对这个模式进行简单的改进来实现**单例模式**：

```js
var foo = (function CoolModule() {
  var something = 'cool'
  var another = [1, 2, 3]

  function doSomething() {
    console.log(something)
  }

  function doAnother() {
    console.log(another.join('!'))
  }

  return {
    doSomething: doSomething,
    doAnother: doAnother
  }
})()

foo.doSomething() // cool
foo.doAnother() // 1!2!3
```

我们将模块函数转换成了 IIFE，立即调用这个函数并将返回值直接赋值给单例的模块实例标识符 foo。

模块也是普通的函数，因此**可以接受参数**：

```js
function CoolModule(id) {
  function identify() {
    console.log(id)
  }
  return {
    identify: identify
  }
}

var foo1 = CoolModule('foo1')
var foo2 = CoolModule('foo2')

foo1.identify() // foo1
foo2.identify() // foo2
```

模块模式另一个简单但强大的变化用法是，**命名将要作为公共 API 返回的对象**：

```js
var foo = (function CoolModule(id) {
  function change() {
    // 修改公共API
    publicAPI.identify = identify2
  }

  function identify1() {
    console.log(id)
  }

  function identify2() {
    console.log(id.toUpperCase())
  }

  var publicAPI = {
    change: change,
    identify: identify1
  }

  return publicAPI
})('foo module')

foo.identify() // foo module
foo.change()
foo.identify() // FOO MODULE
```

通过在模块实例的内部保留对公共 API 对象的内部引用，可以从内部对模块实例进行修改，包括添加或删除方法和属性，以及修改它们的值。

### :blue_book: 现代的模块机制

大多数模块依赖加载器/管理器本质上都是将这种模块定义封装进一个友好的 API。

```js
var MyModules = (function Manager() {
  var modules = {}

  function define(name, deps, impl) {
    for (var i = 0; i < deps.length; i++) {
      deps[i] = modules[deps[i]]
    }
    modules[name] = impl.apply(impl, deps)
  }

  function get(name) {
    return modules[name]
  }

  return {
    define: define,
    get: get
  }
})()
```

这段代码的核心是 `modules[name] = impl.apply(impl, deps)`。为了模块的定义引入了包装函数（可以传入任何依赖），并且将返回值，也就是模块的 API，储存在一个根据名字来管理的模块列表中。

下面展示如何使用它来定义模块：

```js
MyModules.define('bar', [], function() {
  function hello(who) {
    return 'Let me introduce：' + who
  }

  return {
    hello: hello
  }
})

MyModules.define('foo', ['bar'], function(bar) {
  var hungry = 'hippo'

  function awesome() {
    console.log(bar.hello(hungry).toUpperCase())
  }

  return {
    awesome: awesome
  }
})

var bar = MyModules.get('bar')
var foo = MyModules.get('foo')

console.log(bar.hello('hippo')) // Let me introduce：hippo
foo.awesome() // LET ME INTRODUCE：HIPPO
```

"foo" 和 "bar" 模块都是通过一个返回公共 API 的函数来定义的。"foo" 甚至接受 "bar" 的示例作为依赖参数，并能相应地使用它。

模块模式的两个特点：为函数定义引入包装函数，并保证它的返回值和模块的 API 保持一致。

### :blue_book: 未来的模块机制

ES6 中为模块增加了一级语法支持。但通过模块系统进行加载时，ES6 会将文件当作独立的模块来处理。每个模块都可以导入其他模块或特定的 API 成员，同样也可以导出自己的 API 成员。

::: warning 注意

基于函数的模块并不是一个能被稳定识别的模式（编译器无法识别），它们的 API 语义只有在运行时才会被考虑进来。因此可以在运行时修改一个模块 的 API。

相比之下，ES6 模块 API 更加稳定（API 不会在运行时改变）。由于编辑器知道这一点，因此可以在（的确也这样做了）编译期检查对导入模块的 API 成员的引用是否真实存在。如果 API 引用并不存在，编译器会在运行时抛出一个或多个“早期”错误，而不会像往常一样在运行期采用动态的解决方案。

:::

:bell: **ES6 的模块没有“行内”格式，必须被定义在独立的文件中（一个文件一个模块）**。浏览器或引擎有一个默认的“模块加载器”可以在导入模块时异步地加载模块文件。

关于 ES6 模块的使用方法可以参考这个：[Module 的语法](https://es6.ruanyifeng.com/#docs/module)。原书的例子太老了，已经不符合现在的语法，所以就不在这里写出来了。

### :blue_book: 小结

1. 当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域之外执行，这时就产生了闭包。闭包是一个非常强大的工具，可以用多种形式来实现模块等模式。

2. 模块有两个主要特征：
  
  （1）为创建内部作用域而调用了一个包装函数；

  （2）包装函数的返回值必须至少包括一个对内部函数的引用，这样就会创建涵盖整个包装函数内部作用域的闭包。

## :books: 动态作用域

:bell: **词法作用域是在写代码或者说定义时确定的，而动态作用域是在运行时确定的（this 也是！）。**

:bell: **词法作用域关注函数在何处声明，而动态作用域关注函数从何处调用。因此动态作用域的作用域链是基于调用栈的，而不是代码中的作用域嵌套。**

:bell: **JavaScript 并不具有动态作用域，它只有词法作用域。但是 this 机制某种程度上很像动态作用域**。

比如下面这段代码：

```js
function foo() {
  console.log(a);
}
function bar() {
  var a = 3;
  foo();
}
var a = 2;
bar();
```

- 词法作用域让 foo() 中的 a 通过 RHS 引用到了全局作用域中的 a，因此会输出 2。

- 但如果 JavaScript 具有动态作用域，理论上，就会输出 3。因为当 foo() 无法找到 a 的变量引用时，**会顺着调用栈在调用 foo() 的地方查找 a，而不是在嵌套的词法作用域链中向上查找**。由于 foo() 是在 bar() 中调用的，引擎会检查 bar() 的作用域，并在其中找到值为 3 的变量 a。

## :books: 块作用域的替代方案

从 ES3 发布以来，JavaScript 中就有了块作用域，而 with 和 catch 分句就是块作用域的两个小例子。

ES6 中引入了 let 之后，就能更方便的创建块作用域。

但如果我们想在 ES6 之前的环境中使用块作用域，怎么弄？

看下面的代码：

```js
{
  let a = 2;
  console.log(a); // 2
}
console.log(a); // ReferenceError
```

这段代码在 ES6 中能够正常工作，但是在 ES6 之前的环境中如何实现相同的效果呢？答案是使用 catch。

```js
try {
  throw 2;
} catch (a) {
  console.log(a); // 2 
}
console.log(a); // ReferenceError
```

但是使用 catch 的这种写法明显就很奇怪。

在从 ES6 之前的环境向 ES6 过渡时，我们可以使用代码转换工具来对 ES6 代码进行处理，生成兼容 ES5 的代码。

比如 google 的 [Traceur 转码器](https://github.com/google/traceur-compiler)，它会将上面的 ES6 代码转换成下面这样：

```js
{
  try {
    throw undefined;
  } catch (a) {
    a = 2;
    console.log(a);
  }
}
console.log(a);
```

## :books: this 词法

```js
var obj = { 
  id: "awesome", 
  cool: function coolFn() { 
    console.log(this.id); 
  }
};
var id = "not awesome";
obj.cool(); // awesome
setTimeout(obj.cool, 100); // not awesome
```

这段代码有问题，因为在 setTimeout 中 cool 函数丢失了同 this 之间的绑定。解决这个问题最常见的方法就是通过 var that = this; 提前把 this 保存下来。

```js
var obj = {
  count: 0,
  cool: function coolFn() {
    var that = this;
    if (that.count < 1) {
      setTimeout(function timer(){
        that.count++;
        console.log("awesome?");
      }, 100 );
    }
  }
};
obj.cool(); // awesome?
```

var that = this; 这种方案圆满解决了理解和正确使用 this 绑定的问题，它使用的工具正是词法作用域。

ES6 中的箭头函数引入一个叫作 this 词法的行为：

```js
var obj = {
  count: 0,
  cool: function coolFn() {
    if (this.count < 1) {
      setTimeout(() => {
        this.count++;
        console.log("awesome?");
      }, 100 );
    }
  }
};
obj.cool(); // awesome?
```

箭头函数在涉及 this 绑定时的行为和普通函数的行为完全不一致。它放弃了所有普通 this 绑定的规则，取而代之的是**用当前的词法作用域覆盖了 this 本来的值**。

另一种解决该问题的方法是正确使用和包含 this 机制。

```js
var obj = {
  count: 0,
  cool: function coolFn() {
    if (this.count < 1) {
      setTimeout(function timer() {
        this.count++;
        console.log("more awesome");
      }.bind(this), 100 ); // 使用 bind 函数将新函数 timer 的 this 指定为 bind 的第一个参数
    }
  }
};
obj.cool(); // more awesome
```

# 第二部分 this 和对象原型

## :books: 关于 this

this 关键字是 JavaScript 最复杂的机制之一。

### :blue_book: 为什么要用 this

先来看一段代码：

```js
function identify() {
  return this.name.toUpperCase();
}
function speak() {
  var greeting = 'Hello, I\'m ' + identify.call(this);
  console.log(greeting);
}

var me = {
  name: 'Kyle'
};
var you = {
  name: 'Reader'
}

identify.call(me); // KYLE
identify.call(you); // READER

speak.call(me); // Hello, I'm KYLE
speak.call(you); // Hello, I'm READER
```

这段代码可以在不同的上下文对象（me 和 you）中重复使用函数 identify() 和 speak()，不用针对每个对象编写不同版本的函数。

如果不使用 this，那就需要给 identify() 和 speak() 显式传入一个上下文对象。

```js
function identify(context) {
  return context.name.toUpperCase();
}
function speak(context) {
  var greeting = 'Hello, I\'m ' + identify.call(this);
  console.log(greeting);
}
identify(you); // READER
speak(me); // Hello, I'm KYLE
```

:bell: 很明显，**this 提供了一种更优雅的方式来隐式“传递”一个对象引用，因此可以将 API 设计得更加简洁并且易于复用**。

### :blue_book: 对 this 的误解

:gem: **误解一：this 指向函数自身。**

this 并不像我们所想的那样指向函数本身。

先看下面的代码：

```js
function foo(num) {
  console.log('foo:' + num);
  // 记录 foo 被调用的次数
  this.count++;
}
foo.count = 0;
var i;
for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
// foo:6
// foo:7
// foo:8
// foo:9
console.log(foo.count); // 0
```

可以看到，console.log 语句产生了 4 条输出，证明 foo(..) 确实被调用了 4 次，但是 foo.count 仍然 是 0。显然从字面意思来理解 this 是错误的。

执行 foo.count = 0 时，的确向函数对象 foo 添加了一个属性 count。但是函数内部代码 this.count 中的 this 并不是指向那个函数对象，所以虽然属性名相同，根对象却并不相同。

其实，这段代码在无意间**创建了一个全局变量 count，它的值为 NaN**，每次增加的操作都是针对它的。

:bell: **如果要从函数对象内部引用它自身，那只使用 this 是不够的。一般来说你需要通过一个指向函数对象的词法标识符（变量）来引用它**。

思考下面两个函数：

```js
function foo() {
  foo.count = 4; // foo 指向它自身
}
setTimeout(function() {
  // 匿名（没有名字的）函数无法指向自身
}, 10);
```

第一个函数被称为具名函数，在它内部可以使用 foo 来引用自身。但是在第二个例子中，传入 setTimeout(..) 的回调函数没有名称标识符（这种函数被称为匿名函数），因此无法从函数内部引用自身。

针对上面代码的问题，常见的解决方法有以下几种：

- 创建另一个带有 count 属性的对象。

```js
function foo(num) {
  console.log('foo:' + num);
  // 记录 foo 被调用的次数
  data.count++;
}
var data = {
  count: 0
};
var i;
for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
// foo:6
// foo:7
// foo:8
// foo:9
console.log(data.count); // 4
```

- 是使用 foo 标识符替代 this 来引用函数对象。

```js
function foo(num) {
  console.log('foo:' + num);
  // 记录 foo 被调用的次数
  foo.count++;
}
foo.count = 0;
var i;
for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
// foo:6
// foo:7
// foo:8
// foo:9
console.log(foo.count); // 4
```

- 强制 this 指向 foo 函数对象。

```js
function foo(num) {
  console.log('foo:' + num);
  // 记录 foo 被调用的次数
  this.count++;
}
foo.count = 0;
var i;
for (i = 0; i < 10; i++) {
  if (i > 5) {
    // 使用 call(..) 可以确保 this 指向函数对象 foo 本身
    foo.call(foo, i);
  }
}
// foo:6
// foo:7
// foo:8
// foo:9
console.log(foo.count); // 4
```

前两种方法虽然能够解决问题，但是都回避了真正的问题——无法理解 this 的含义和工作原理，并采用熟悉的技术——词法作用域去解决。只有最后一种方法是真正解决了 this 的问题，没有回避它。

:gem: **误解二：this 指向函数的作用域。**

这个问题有点复杂，因为在某种情况下它是正确的，但是在其他情况下它却是错误的。

:bell: 需要明确的是，**this 在任何情况下都不指向函数的词法作用域**。

在 JavaScript 内部，作用域确实和对象类似，可见的标识符都是它的属性。但是**作用域“对象”无法通过 JavaScript 代码访问，它存在于 JavaScript 引擎内部**。

比如下面的代码试图使用 this 来隐式引用函数的词法作用域：

```js
function foo() {
  var a = 2;
  this.bar();
}
function bar() {
  console.log(this.a);
}
foo(); // undefined
```

这段代码中的错误不止一个。

首先，这段代码试图通过 this.bar() 来引用 bar() 函数。这是绝对不可能成功的。调用 bar() 最自然的方法是省略前面的 this，直接使用词法引用标识符。

此外，编写这段代码的开发者还试图使用 this 联通 foo() 和 bar() 的词法作用域，从而让 bar() 可以访问 foo() 作用域里的变量 a。这是不可能实现的，**你不能使用 this 来引用一个词法作用域内部的东西**。

:bell: **每当你想要把 this 和词法作用域的查找混合使用时，一定要提醒自己，这是无法实现的**。

### :blue_book: this 到底是什么

当一个函数被调用时，会创建一个**活动记录**（有时候也称为**执行上下文**）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方法、传入的参数等信息。**this 就是记录的其中一个属性，会在函数执行的过程中用到**。

:bell: **this 是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件。this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式**。

### :blue_book: 小结

1. 学习 this 的第一步是明白 this 既不指向函数自身也不指向函数的词法作用域。

2. this 实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。

## :books: this 全面解析

### :blue_book: 调用位置

在理解 this 的绑定过程之前，首先要理解调用位置：**调用位置就是函数在代码中被调用的位置（而不是声明的位置）**。只有仔细分析调用位置才能回答这个问题：这个 this 到底引用的是什么？

通常来说，寻找调用位置就是寻找“函数被调用的位置”，但是做起来并没有这么简单，因为某些编程模式可能会隐藏真正的调用位置。

:bell: **最重要的是要分析调用栈（就是为了到达当前执行位置所调用的所有函数）。我们关心的调用位置就在当前正在执行的函数的前一个调用中。**

下面我们来看看到底什么是调用栈和调用位置：

```js
function baz() {
  // 当前调用栈是：baz
  // 因此，当前调用位置是全局作用域
  console.log('baz');
  bar(); // bar 的调用位置
}
function bar() {
  // 当前调用栈是 baz -> bar
  // 因此，当前调用位置在 baz 中
  console.log('bar');
  foo(); // foo 的调用位置
}
function foo() {
  // 当前调用栈是 baz -> bar -> foo
  // 因此，当前调用位置在 bar 中
  console.log('foo');
}
baz(); // baz 的调用位置
```

注意我们是如何（从调用栈中）分析出真正的调用位置的，因为它决定了 this 的绑定。

::: warning 注意
我们可以把调用栈想象成一个函数调用链，就像我们在前面代码段的注释中所写的一样。但是这种方法非常麻烦并且容易出错。

另一个查看调用栈的方法是使用浏览器的调试工具。在 foo 函数的第一行代码添加一个断点，或者直接在第一行代码之前插入一句 debugger; 语句。

![jsunknow](../.vuepress/public/assets/image/javascript/jsunknow2.png 'jsunknow')

如果想要分析 this 的绑定，使用开发者工具得到调用栈，然后找到栈中第二个元素，这就是真正的调用位置。
:::

### :blue_book: 绑定规则

当我们找到调用规则之后，就可以判断需要应用下面4条规则中的哪一条。

:gem: **1. 默认绑定**

首先要介绍的是最常用的函数调用类型：**独立函数调用**。这条规则是无法应用其他规则时的默认规则。

```js
function foo() {
  console.log(this.a);
}
var a = 2;
foo(); // 2
```

在这段代码中，首先要注意的是，**声明在全局作用域中的变量（比如 var a = 2）就是全局对象的一个同名属性**。它们本质上就是同一个东西，并不是通过复制得到的，就像一个硬币的两面一样。

接下来我们可以看到当调用 foo() 时，this.a 被解析成了全局变量 a。为什么？因为在本例中，函数调用时应用了 this 的默认绑定，因此 this 指向全局对象。

那么我们怎么知道这里应用了默认绑定呢？可以通过分析调用位置来看看 foo() 是如何调用的。**在代码中，foo() 是直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定，无法应用其他规则。**

**如果使用严格模式（strict mode），那么全局对象将无法使用默认绑定，因此 this 会绑定到 undefined：**

```js
function foo() {
  'use strict';
  console.log(this.a);
}
var a = 2;
foo(); // Uncaught TypeError: Cannot read property 'a' of undefined
```

:bell: **注意，虽然 this 的绑定规则完全取决于调用位置，但是只有 foo() 运行在非 strict mode 下时，默认绑定才能绑定到全局对象；严格模式下与 foo() 的调用位置无关：**

```js
function foo() {
  console.log(this.a);
}
var a = 2;
(function() {
  'use strict';
  foo(); // 2
})();
```

:gem: **2. 隐式绑定**

先看下面的代码：

```js
function foo() {
  console.log(this.a)
}
var obj = {
  a: 2,
  foo: foo
}
obj.foo(); // 2
```

在这段代码中，无论是直接在 obj 中定义 foo 还是先定义 foo 再添加为引用属性，这个函数严格来说都不属于 obj 对象。

然而，调用位置会使用 obj 上下文来引用函数，因此可以说函数被调用时 obj 对象“拥有”或者“包含”它。

:bell: **当函数引用有上下文对象时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象**。因为调用 foo() 时 this 被绑定到 obj，因此 this.a 和 obj.a 是一样的。

**对象属性引用链中只有最顶层或者说最后一层会影响调用位置**。比如：

```js
function foo() {
  console.log(this.a)
}
var obj2 = {
  a: 42,
  foo: foo
}
var obj1 = {
  a: 2,
  obj2: obj2
}
obj1.obj2.foo(); // 42
```

**隐式丢失**

一个最常见的 this 绑定问题就是**被隐式绑定的函数会丢失绑定对象**，也就是说**它会应用默认绑定，从而把 this 绑定到全局对象或者 undefined 上，取决于是否是严格模式**。

比如：

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
}
var bar = obj.foo;
var a = 'oops, global'; // a 是全局对象的属性
bar(); // oops, global
```

虽然 bar 是 obj.foo 的一个引用，但是实际上，它引用的是 foo 函数本身，因此此时的 bar() 其实是一个不带任何修饰的函数调用，因此应用了默认绑定。

再比如：

```js
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
  // fn 其实引用的是 foo
  fn(); // 调用位置
}
var obj = {
  a: 2,
  foo: foo
}
var a = 'oops, global'; // a 是全局对象的属性
doFoo(obj.foo); // oops, global
```

参数传递其实就是一种隐式赋值，因此我们传入函数时也会被隐式赋值，所以结果和上一个例子一样。

如果把函数传入语言内置的函数而不是传入自己声明的函数，结果也是一样的，没有区别:

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
}
var a = 'oops, global'; // a 是全局对象的属性
setTimeout(obj.foo, 100); // oops, global
```

通过这些例子可以看出，回调函数丢失 this 绑定是非常常见的。除此之外，还有一种情况 this 的行为会出乎我们意料：调用回调函数的函数可能会修改 this。

:gem: **3. 显示绑定**

在分析隐式绑定时，我们必须在一个对象内部包含一个指向函数的属性，并通过这个属性间接引用函数，从而把 this 间接(隐式)绑定到这个对象上。

那么如果我们不想在对象内部包含函数引用，而想在某个对象上强制调用函数，该怎么做呢?

可以使用函数的 `call(...)` 和 `apply(...)` 来实现。

这两个方法第一个参数是一个对象，它们会把这个对象绑定到 this，接着在调用函数时指定这个 this。

:bell: **使用 [call](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 和 [apply](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 方法可以直接指定 this 的绑定对象，这种方式就叫作显示绑定**。

比如：

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
}
foo.call(obj); // 2
```

通过 foo.call(..)，我们可以在调用 foo 时强制把它的 this 绑定到 obj 上。

如果你传入了一个原始值(字符串类型、布尔类型或者数字类型)来当作 this 的绑定对象，这个原始值会被转换成它的对象形式(也就是new String(..)、new Boolean(..)或者 new Number(..))。这通常被称为“**装箱**”。

不过，显示绑定也无法解决刚刚提到的绑定丢失问题。

**（1）硬绑定**

这是显示绑定的一个变种，它可以解决绑定丢失的问题。

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
}
var bar = function() {
  foo.call(obj)
}

bar(); // 2
setTimeout(bar, 100); // 2

// 硬绑定的 bar 不可能再修改它的 this
bar.call(window); // 2
```

这段代码创建了函数 bar()，并在它的内部手动调用了 foo.call(obj)，因此强制把 foo 的 this 绑定到了 obj。无论之后如何调用函数 bar，它总会手动在 obj 上调用 foo。这种绑定是一种显式的强制绑定，因此我们称之为**硬绑定**。

**硬绑定的应用场景**

- 创建一个包裹函数，传入所有的参数并返回接收到的所有值。

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
var obj = {
  a: 2
}
var bar = function() {
  return foo.apply(obj, arguments);
}
var b = bar(3); // 2 3
console.log(b); // 5
```

- 创建一个 i 可以重复使用的辅助函数。

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
function bind(fn, obj) {
  return function() {
    return fn.apply(obj, arguments);
  }
}
var obj = {
  a: 2
}
var bar = bind(foo, obj);
var b = bar(3); // 2 3
console.log(b); // 5
```

ES5 中提供的内置方法 Function.prototype.bind 就是一种硬绑定。用法如下：

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
var obj = {
  a: 2
}
var bar = foo.bind(obj);
var b = bar(3); // 2 3
console.log(b); // 5
```

bind(..) 会返回一个硬编码的新函数，它会把参数设置为 this 的上下文并调用原始函数。

**（2）API调用的“上下文”**

第三方库的许多函数，以及 JavaScript 语言和宿主环境中许多新的内置函数，都提供了一个可选的参数，通常被称为“上下文”(context)，其作用和 bind(..) 一样，确保你的回调函数使用指定的 this。

比如：

```js
function foo(el) {
  console.log(el, this.id);
}
var obj = {
  id: 'awesome'
}
const arr = [1, 2, 3];
// 调用 foo(..) 时把 this 绑定到 obj
arr.forEach(foo, obj); // 1 awesome 2 awesome 3 awesome
```

这些函数实际上就是通过 call(..) 或者 apply(..) 实现了显式绑定，这样可以少写一些代码。

:gem: **4. new 绑定**

在传统的面向类的语言中，“构造函数”是类中的一些特殊方法，使用 new 初始化类时会调用类中的构造函数。通常的形式是这样的:

```js
something = new MyClass(..);
```
JavaScript 也有一个 new 操作符，使用方法看起来也和那些面向类的语言一样，然而，JavaScript 中 new 的机制实际上和面向类的语言完全不同。

**在 JavaScript 中，构造函数只是一些使用 new 操作符时被调用的函数。它们并不会属于某个类，也不会实例化一个类。实际上，它们甚至都不能说是一种特殊的函数类型，它们只是被 new 操作符调用的普通函数而已。**

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

（1）创建（或者说构造）一个全新的对象。

（2）这个新对象会被执行原型连接。

（3）这个新对象会绑定到函数调用的 this。

（4）如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

比如：

```js
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a); // 2
```

**使用 new 来调用 foo(..) 时，我们会构造一个新对象并把它绑定到 foo(..) 调用中的 this 上。**

### :blue_book: 绑定规则的优先级

:gem: **隐式绑定和显示绑定比较。**

```js
function foo() {
  console.log(this.a);
}
var obj1 = {
  a: 2,
  foo: foo
}
var obj2 = {
  a: 3,
  foo: foo
}

obj1.foo(); // 2
obj2.foo(); // 3

obj1.foo.call(obj2); // 3
obj2.foo.call(obj1); // 2
```

可以看到，显示绑定优先级更高。

:gem: **new 绑定和隐式绑定比较。**

```js
function foo(something) {
  this.a = something;
}
var obj1 = {
  foo: foo
};
var obj2 = {};

obj1.foo(2);
console.log(obj1.a); // 2

obj1.foo.call(obj2, 3);
console.log(obj2.a); // 3

var bar = new obj1.foo(4);
console.log(obj1.a); // 2
console.log(bar.a); // 4
```

可以看到，new 绑定优先级更高。

:gem: **new 绑定和显示绑定比较。**

new 和 call/apply 无法一起使用，因此无法通过 new foo.call(obj1) 来直接进行测试。但是我们可以使用硬绑定来测试它俩的优先级。

**Function.prototype.bind(..) 会创建一个新的包装函数，这个函数会忽略它当前的 this 绑定(无论绑定的对象是什么)，并把我们提供的对象绑定到 this 上。**

```js
function foo(something) {
  this.a = something;
}

var obj1 = {};

var bar = foo.bind(obj1);
bar(2);
console.log(obj1.a); // 2

var baz = new bar(3);
console.log(obj1.a); // 2
console.log(baz.a); // 3
```

在这段代码中，bar 被硬绑定到 obj1 上，但是 new bar(3) 并没有像我们预计的那样把 obj1.a 修改为 3。相反，new 修改了硬绑定(到 obj1 的)调用 bar(..) 中的 this。因为使用了 new 绑定，我们得到了一个名字为 baz 的新对象，并且 baz.a 的值是 3。

为什么要在 new 中使用硬绑定函数呢？直接使用普通函数不是更简单吗？

之所以要在 new 中使用硬绑定函数，主要目的是预先设置函数的一些参数，这样在使用 new 进行初始化时就可以只传入其余的参数。

bind(..) 的功能之一就是可以把除了第一个参数(第一个参数用于绑定 this)之外的其他参数都传给下层的函数(这种技术称为“部分应用”，是“柯里化”的一种)。比如：

```js
function foo(p1, p2) {
  this.val = p1 + p2;
}
var bar = foo.bind(null, 'p1');
var baz = new bar('p2');
console.log(baz.val); // p1p2
```

:gem: **总结**

综上所述，可以按照下面的顺序来判断函数在某个调用位置应用的是哪条规则。

**1. 函数是否在 new 中调用（new 绑定）？如果是的话，this 绑定的是新创建的对象。**

```js
var bar = new foo();
```

**2. 函数是否通过 call、apply（显示绑定）或者硬绑定调用？如果是的话，this 绑定的是指定的对象。**

```js
var bar = foo.call(obj2);
```

**3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this 绑定的是那个上下文对象。**

```js
var bar = obj1.foo();
```

**4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined，否则绑定到全局对象。**

```js
var bar = foo();
```

### :blue_book: 绑定例外

对于正常的函数调用来说，都是遵循4条绑定规则的。但是规则总有例外，在某些场景下 this 的绑定行为会出乎意料，你认为应当应用其他绑定规则时，实际上应用的可能是默认绑定规则。

:gem: **1. 被忽略的 this**

**如果你把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind，这些值在调用时会被忽略，实际应用的是默认绑定规则:**

```js
function foo() {
  console.log(this.a);
}
var a = 2;
foo.call(null); // 2
```

什么情况下会传入 null 呢？

一种非常常见的做法是**使用 apply(..) 来“展开”一个数组，并当作参数传入一个函数**。类似地，**bind(..) 可以对参数进行柯里化(预先设置一些参数)**，这种方法有时非常有用:

```js
function foo(a, b) {
  console.log('a:' + a + ', b:' + b);
}

// 把数组展开成参数
foo.apply(null, [2, 3]); // a:2, b:3

// 使用 bind 进行柯里化
var bar = foo.bind(null, 2);
bar(3); // a:2, b:3
```

这两种方法都需要传入一个参数当作 this 的绑定对象。

:bell: **如果函数并不关心 this 的话，你仍然需要传入一个占位值，这时 null 是一个不错的选择.**

然而，总是使用 null 来忽略 this 绑定可能产生一些副作用。如果某个函数确实使用了 this(比如第三方库中的一个函数)，那默认绑定规则会把 this 绑定到全局对象(在浏览器中这个对象是 window)，这将导致不可预计的后果(比如修改全局对象)。

:bell: **因此，一种更安全的做法是，传入一个空的非委托的对象，把 this 绑定到这个对象不会对程序产生任何副作用。**

在书中，作者把这个对象命名为 `ø`，因为这是数学中表示空集合符号的小写形式。不过命名是随意的，可以用任何别的名称来替代它。

:bell: **在 JavaScript 中创建一个空对象最简单的方法是 Object.create(null)。Object.create(null) 和 {} 很像，但是并不会创建 Object.prototype 这个委托，所以它比 {}“更空”。**

```js
function foo(a, b) {
  console.log('a:' + a + ', b:' + b);
}

var ø = Object.create(null);

foo.apply(ø, [2, 3]); // a:2, b:3

var bar = foo.bind(ø, 2);
bar(3); // a:2, b:3
```

使用变量名 ø 不仅让函数变得更加“安全”，而且可以提高代码的可读性，因为 ø 表示 “我希望 this 是空”，这比 null 的含义更清楚。

:gem: **2. 间接引用**

**另一个需要注意的是，有的时候我们可能(有意或者无意地)创建一个函数的“间接引用”，在这种情况下，调用这个函数会应用默认绑定规则。**

间接引用最容易在赋值时发生:

```js
function foo() {
  console.log(this.a);
}
var a = 2;
var o = { 
  a: 3,
  foo: foo
}
var p = {
  a:4
}
o.foo(); // 3
(p.foo = o.foo)(); // 2
```

赋值表达式 p.foo = o.foo 的返回值是目标函数的引用，因此调用位置是 foo() 而不是 p.foo() 或者 o.foo()。所以会应用默认绑定。

::: warning 注意
对于默认绑定来说，**决定 this 绑定对象的并不是调用位置是否处于严格模式，而是函数体是否处于严格模式**。如果函数体处于严格模式，this 会被绑定到 undefined，否则 this 会被绑定到全局对象。
:::

:gem: **3. 软绑定**

硬绑定这种方式可以把 this 强制绑定到指定的对象(除了使用 new 时)，防止函数调用应用默认绑定规则。问题在于，硬绑定会大大降低函数的灵活性，使用硬绑定之后就无法使用隐式绑定或者显式绑定来修改 this。

如果可以给默认绑定指定一个全局对象和 undefined 以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改 this 的能力。

软绑定可以做到这点，下面是它的方法：

```js
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function(obj) {
    var fn = this;
    // 捕获所有的 curried 参数
    var curried = [].slice.call(arguments, 1);
    var bound = function() {
      return fn.apply(
        (!this || this === (window || global)) ? obj : this,
        curried.concat.apply(curried, arguments)
      )
    }
    bound.prototype = Object.create(fn.prototype);
    return bound;
  }
}
```

除了软绑定之外，softBind(..) 的其他原理和 ES5 内置的 bind(..) 类似。

它会对指定的函数进行封装，首先检查调用时的 this，如果 this 绑定到全局对象或者 undefined，那就把指定的默认对象 obj 绑定到 this，否则不会修改 this。此外，这段代码还支持可选的柯里化.

下面使用下 softBind：

```js
function foo() {
  console.log('name:' + this.name);
}
var obj = { name: 'obj' }, obj2 = { name: 'obj2' }, obj3 = { name: 'obj3' };
var fooOBJ = foo.softBind(obj);

fooOBJ(); // name:obj

obj2.foo = foo.softBind(obj);
obj2.foo(); // name:obj2

fooOBJ.call( obj3 ); // name:obj3

setTimeout( obj2.foo, 10 ); // name:obj   应用了软绑定
```

可以看到，软绑定版本的 foo() 可以手动将 this 绑定到 obj2 或者 obj3 上，但如果应用默认绑定，则会将 this 绑定到 obj。

### :blue_book: this 词法

**ES6 的箭头函数不使用 this 的4种标准规则，而是根据外层(函数或者全局)作用域来决定 this。**

先来看看箭头函数的词法作用域：

```js
function foo() {
  // 返回一个箭头函数 
  return (a) => {
    //this 继承自 foo()
    console.log(this.a); 
  };
}
var obj1 = { 
  a: 2
};
var obj2 = {
  a: 3
};
var bar = foo.call(obj1);
bar.call(obj2) ; // 2, 不是 3 !
```

foo() 内部创建的箭头函数会捕获调用时 foo() 的 this。由于 foo() 的 this 绑定到 obj1， bar(引用箭头函数)的 this 也会绑定到 obj1，箭头函数的绑定无法被修改。(new 也不行!)

箭头函数最常用于回调函数中，例如事件处理器或者定时器:

```js
function foo() { 
  setTimeout(() => {
    // 这里的 this 在词法上继承自 foo()
    console.log(this.a); 
  },100);
}
var obj = { 
  a: 2
};
foo.call(obj); // 2
```

箭头函数可以像 bind(..) 一样确保函数的 this 被绑定到指定对象，此外，其重要性还体现在它用更常见的词法作用域取代了传统的 this 机制。

实际上，在 ES6 之前我们就已经在使用一种几乎和箭头函数完全一样的模式。

```js
function foo() {
  var that = this;
  setTimeout(function() {
    console.log(that.a); 
  }, 100);
}
var obj = { 
  a: 2
};
foo.call(obj); // 2
```

### :blue_book: 小结

1. 如果要判断一个运行中函数的 this 绑定，就需要找到这个函数的直接调用位置。找到之后就可以顺序应用下面这四条规则来判断 this 的绑定对象。

  （1） 由new调用?绑定到新创建的对象。

  （2） 由call或者apply(或者bind)调用?绑定到指定的对象。

  （3） 由上下文对象调用?绑定到那个上下文对象。

  （4） 默认:在严格模式下绑定到undefined，否则绑定到全局对象。

2. 有些调用可能在无意中使用默认绑定规则。如果想“更安全”地忽略 this 绑定，你可以使用一个 DMZ 对象，比如 ø = Object.create(null)，以保护全局对象。

3. ES6 中的箭头函数并不会使用4条标准的绑定规则，而是根据当前的词法作用域来决定 this，具体来说，箭头函数会继承外层函数调用的 this 绑定(无论 this 绑定到什么)。这其实和 ES6 之前代码中的 that = this 机制一样。

## :books: 对象

### :blue_book: 语法

对象可以通过两种形式定义：**声明（文字）形式**和**构造形式**。

声明（文字）形式：

```js
var myObj = {
  key: value
  // ...
}
```

构造形式：

```js
var myObj = new Object();
myObj.key = value;
```

**构造形式和文字形式生成的对象是一样的。唯一的区别是，在文字声明中你可以添加多个键/值对，但是在构造形式中你必须逐个添加属性**。

### :blue_book: 类型

[JavaScript 数据类型和数据结构](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)

目前，最新的 ECMAScript 标准定义了 8 种数据类型，其中基本数据类型共有7种：

- **Boolean**

- **String**

- **Number**

- **Null**

- **Undefined**

- **Symbol**

- **BigInt**

此外，还有一种类型是对象 **Object**。数组和函数本质上都是对象的一种类型。

null 有时会被当作一种对象类型，但是这其实只是语言本身的一个 bug。null 本身不是对象，它是基本类型。

```js
typeof null // object
```

有一种常见的说法是“JavaScript 中万物皆是对象”，这显然是错误的。

### :blue_book: 内置对象

1. [JavaScript 标准内置对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)。

2. [typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof) 操作符返回一个字符串，表示未经计算的操作数的类型。

3. [instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

4. 看下面的代码：

```js
var strPrimitive = 'I am a string';
console.log(strPrimitive.length); // 13
console.log(strPrimitive.charAt(3)); // m
```

原始值 "I am a string" 并不是一个对象，它只是一个字面量，并且是一个不可变的值。如果要在这个字面量上执行一些操作，比如获取长度、访问其中某个字符等，那需要将其转换为 String 对象。**引擎会自动把字面量转换成 String 对象**，所以可以访问属性和方法。同样的，**数值字面量和布尔字面量也会自动转换成相应的对象**。

**null 和 undefined 没有对应的构造形式，它们只有文字形式**。相反，**Date 只有构造，没有文字形式**。

**对于 Object、Array、Function 和 RegExp（正则表达式）来说，无论使用文字形式还是构造形式，它们都是对象，不是字面量**。

Error 对象很少在代码中显式创建，**一般是在抛出异常时被自动创建**。也可以使用 new Error(..) 这种构造形式来创建，不过一般来说用不着。

### :blue_book: 内容

对象的内容是由一些存储在特定命名位置的（任意类型的）值组成的，我们称之为属性。

::: warning 注意
在引擎内部，这些值的存储方式是多种多样的，一般并不会存在对象容器内部。**存储在对象容器内部的是这些属性的名称**，它们就像指针（从技术角度来说就是引用）一样，指向这些值真正的存储位置。
:::

访问对象属性的方法有两种：`.` 操作符和 `[]` 操作符。

```js
var myObject = {
  a: 2
};
myObject.a; // 2
myObject['a']; // 2
```

.a 语法通常被称为“ **属性访问** ”，['a'] 语法通常被称为“ **键访问** ”。

这两种语法的主要区别在于， **. 操作符要求属性名满足标识符的命名规范，而 ['..'] 语法可以接受任意 UTF-8/Unicode 字符串作为属性名**。举例来说，如果要引用名称为 "Super- Fun!" 的属性，那就必须使用 ['Super-Fun!'] 语法访问，因为 Super-Fun! 并不是一个有效的标识符属性名。

此外，由于 ['..'] 语法使用字符串来访问属性，所以可以在程序中构造这个字符串，比如：

```js
var myObject = {
  a: 2
};
var idx;
if (wantA) {
  idx = 'a';
}
// 之后
console.log(myObject[idx]); // 2
```

**在对象中，属性名永远都是字符串。**

如果你使用 string（字面量）以外的其他值作为属性名，那它首先会被转换为一个字符串。即使是数字也不例外，虽然在数组下标中使用的的确是数字，但是在对象属性名中数字会被转换成字符串，所以当心不要搞混对象和数组中 数字的用法：

```js
var myObject = {};

myObject[true] = 'foo';
myObject[3] = 'bar';
myObject[myObject] = 'baz';

myObject['true']; // foo
myObject['3']; // bar
myObject['[object Object]']; // baz
```

:gem: **1. 可计算属性名**

ES6 增加了可计算属性名，可以在文字形式中使用 [] 包裹一个表达式来当作属性名：

```js
var prefix = 'foo';

var myObject = {
  [prefix + 'bar']: 'hello',
  [prefix + 'baz']: 'world'
}

myObject['foobar']; // hello
myObject['foobaz']; // world
```

可计算属性名最常用的场景可能是 ES6 的符号（Symbol）。

:gem: **2. 属性与方法**

如果访问的对象属性是一个函数，那么函数很容易被认为是属于某个对象的。在其他语言中，属于对象（也被称为“类”）的函数通常被称为“方法”，因此经常会把“属性访问”说成是“方法访问”。

**但是在 JavaScript 中，函数永远不会“属于”一个对象。**

无论返回值是什么类型，每次访问对象的属性就是属性访问。如果属性访问返回的是一个函数，那它也并不是一个“方法”。属性访问返回的函数和其他函数没有任何区别，除了可能会发生隐式绑定之外。

比如：

```js
function foo() {
  console.log('foo');
}
var someFoo = foo; // 对 foo 的变量引用

var myObject = {
  someFoo: foo
};

foo; // ƒ foo() { console.log('foo'); }
someFoo; // ƒ foo() { console.log('foo'); }
myObject.someFoo; // ƒ foo() { console.log('foo'); }
```

someFoo 和 myObject.someFoo 只是对于同一个函数的不同引用，并不能说明这个函数是特别的或者“属于”某个对象。如果 foo() 定义时在内部有一个 this 引用，那这两个函数引用的唯一区别就是 myObject.someFoo 中的 this 会被隐式绑定到一个对象。无论哪种引用形式都不能称之为“方法”。

即使你在对象的文字形式中声明一个函数表达式，这个函数也不会“属于”这个对象——它们只是对于相同函数对象的多个引用。

```js
var myObject = {
  foo: function() {
    console.log('foo');
  }
}
var someFoo = myObject.foo;

someFoo; // ƒ foo() { console.log('foo'); }
myObject.foo; // ƒ foo() { console.log('foo'); }
```

所以，最保险的说法可能是，“函数”和“方法”在 JavaScript 中是可以互换的。

:gem: **3. 数组**

数组也是对象，所以虽然每个下标都是整数，但仍然可以给数组添加属性。

```js
var myArray = ['foo', 42, 'bar'];
myArray.baz = 'baz';
myArray.length; // 3
myArray.baz; // baz
```

可以看到，**虽然添加了命名属性（无论是通过 . 语法还是 [] 语法），数组的 length 值并未发生变化。**

:bell: **如果试图向数组添加一个属性，但是属性名“看起来”像一个数字，那它会变成一个数值下标（因此会修改数组的内容而不是添加一个属性）。**

```js
var myArray = ['foo', 42, 'bar'];
myArray['3'] = 'baz';
myArray.length; // 4
myArray[3]; // baz
```

:gem: **4. 复制对象**

（1）复制对象分为浅拷贝和深拷贝。

<!-- - 如果对象的属性值是基本数据类型的话，那么不管是浅拷贝还是深拷贝，新旧对象的属性值都是互相独立的，互不影响。因为基本数据类型的变量名和值都存在栈内存中，拷贝的时候会在栈内存中开辟一块新的内存来存放新对象的属性值。 -->

- 对于一个基本数据类型的数据来说，它的变量名和值都是存在栈内存中的。如果是浅拷贝，新旧对象会相互影响，如果是深拷贝，新旧对象互不影响。

- 对于一个引用数据类型的数据来说，栈内存中存储的是指向堆内存中的值的地址，即变量名，堆内存中存储的才是真正的值。如果对象的属性值是引用数据类型的话，浅拷贝只会复制旧对象的属性的引用地址给新对象，因此新旧对象的同个属性实际上指向的是栈中同一个地址，当改变其中一个时，堆中存储的值自然也会受到影响。而深拷贝除了会复制引用地址之外，还会在堆内存中开辟一块新的内存用来存放新对象的属性值，所以新旧对象是相互独立的，互不影响。

比如：

```js
// 浅拷贝
var obj = {
  a: 1,
  b: {
    c: 1
  }
}
var newObj = obj

newObj.a = 2
newObj.b.c = 3

console.log(obj.a) // 2
console.log(newObj.a) // 2

console.log(obj.b.c) // 3
console.log(newObj.b.c) // 3
```

```js
// 深拷贝
var obj = {
  a: 1,
  b: {
    c: 1
  }
}
var newObj = JSON.parse(JSON.stringify(obj))

newObj.a = 2
newObj.b.c = 3

console.log(obj.a) // 1
console.log(newObj.a) // 2

console.log(obj.b.c) // 1
console.log(newObj.b.c) // 3
```

（2）根据以上原理，区分两者最简单的方法就是：

**假设 B 复制了 A，当修改 B 时，看 A 是否会发生变化，如果 A 也跟着变了，说明是浅拷贝；如果 A 没变，说明是深拷贝。**

（3）实现浅拷贝的方法

- 直接使用 `=` 赋值。

- 使用 ES6 的 [Object.assign()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 方法。用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。

  但是这个方法我发现一点神奇的地方：

  ```js
  var obj = {
    a: 1
  }

  var newObj = Object.assign(obj)
  newObj.a = 2
  
  console.log(obj.a) // 2
  console.log(newObj.a) // 2
  ```

  ```js
  var obj = {
    a: 1
  }

  var newObj = Object.assign({}, obj)
  newObj.a = 2
  
  console.log(obj.a) // 1
  console.log(newObj.a) // 2
  ```

- 使用 for ... in 只循环第一层

  ```js
  function shallowCopy(obj1) {
    var obj2 = Array.isArray(obj1) ? [] : {};
    for (let i in obj1) {
      obj2[i] = obj1[i];
    }
    return obj2;
  }
  var obj1 = {
    a: 1,
    b: 2,
    c: {
      d: 3
    }
  }
  var obj2 = shallowCopy(obj1);
  obj2.a = 3;
  obj2.c.d = 4;
  console.log(obj1.a); // 1
  console.log(obj2.a); // 3
  console.log(obj1.c.d); // 4
  console.log(obj2.c.d); // 4
  ```

（4）实现深拷贝的方法

- 最常见的实现深拷贝的方法是通过序列化反序列化的方式。

  ```js
  var newObj = JSON.parse(JSON.stringify(obj));
  ```

  但是这种方式有一些坑，限制比较多，可参照：[关于 JSON.parse(JSON.stringify(obj)) 实现深拷贝的一些坑](https://segmentfault.com/a/1190000020297508)。

- 使用 jQuery 的 extend 方法。

  ```js
  var arr = [1,2,3,4];
  var newArr = $.extend(true, [], arr); // true为深拷贝，false为浅拷贝
  ```

- 使用 lodash 的 [_.cloneDeep()](https://www.lodashjs.com/docs/lodash.cloneDeep) 方法。

- 手动实现深拷贝。

  ```js
  let obj1 = {
    a: 1,
    b: {
      c: 2
    }
  }
  let obj2 = {
    a: obj1.a,
    b: {
      c: obj1.b.c
    }
  }
  
  obj2.a = 3;
  obj2.b.c = 4;

  console.log(obj1.a); // 1
  console.log(obj2.a); // 3

  console.log(obj1.b.c); // 2
  console.log(obj2.b.c); // 4
  ```

- 递归实现深拷贝。

  ```js
  function deepClone(obj) {
    let newObj = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === 'object') {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          // 判断 obj 的属性是否为对象
          if (obj[key] && typeof obj[key] === 'object') {
            // 如果是，递归
            newObj[key] = deepClone(obj[key]);
          } else {
            // 如果不是，直接赋值
            newObj[key] = obj[key];
          }
        }
      }
    }
    return newObj;
  }    
  let a = [1,2,3,4], b = deepClone(a);
  a[0] = 2;
  console.log('a:' + a, 'b:' + b); // [2, 2, 3, 4]  [1, 2, 3, 4]
  ```

:bell: **以下深拷贝方法只适用于元素是基本数据类型。**

- [Object.assign()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

  ```js
  var obj = {
    a: 1
  }

  var newObj = Object.assign({}, obj)
  newObj.a = 2
  
  console.log(obj.a) // 1
  console.log(newObj.a) // 2
  ```

- [slice()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

  一查才知道，原来字符串也有这个方法：[String.prototype.slice()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/slice)

  ```js
  var arr1 = [1, 2, 3]; 
  var arr2 = arr1.slice(0);
  arr2[1] = 4;
  console.log(arr1); // [1, 2, 3]
  console.log(arr2); // [1, 4, 3]
  ```

- [concat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)

  ```js
  var arr1 = [1, 2, 3]; 
  var arr2 = arr1.concat();
  arr2[1] = 4;
  console.log(arr1); // [1, 2, 3]
  console.log(arr2); // [1, 4, 3]
  ```

- [展开语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

  ```js
  var arr1 = [1, 2, 3]; 
  var arr2 = [...arr1];
  arr2[1] = 4;
  console.log(arr1); // [1, 2, 3]
  console.log(arr2); // [1, 4, 3]
  ```