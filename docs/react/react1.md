## React 简介

### 什么是 React

- **React 是一个用于构建用户界面的 JavaScript 库。**

- [React 英文文档](https://reactjs.org/)

- [React 中文文档](https://react.docschina.org/)

- React 16版本以上的称为 **React Fiber**。

::: warning 注意
- **React 不是一个框架，它只是一个库，只提供 UI（view）层面的解决方案**。在实际的项目当中，它并不能解决我们所有的问题，需要结合其它的库，例如 Redux、React-router 等来协助提供完整的解决方法。

- 在 MVC 模式中，React 就相当于 MVC 里面的 View。
:::

### 与其他框架并存

- React 可以与其他框架，比如 jQuery 一起使用。

- React 只负责 id 为 root 的元素里的内容，因此，只要 jQuery 不操作 id 为 root 的元素里的内容，操作其他 DOM 元素就行了。两者不相互影响就没问题。

### 单向数据流

- React 被设计成单向数据流，只允许父组件向子组件传值，不允许子组件直接修改父组件的值，这也是为了方便开发和测试。

- 如果子组件想修改父组件的值，应该是调用父组件中的方法去修改。

### 视图层框架

React 把自己称为视图层框架，这是想表达 React 并不是所有的事情都能做得到，比如数据传输，在大型项目中，我们就得借助 [Flux](https://github.com/facebook/flux)、[Redux](https://cn.redux.js.org/)、[Mobx](https://cn.mobx.js.org/) 等框架来辅助完成了。

### 函数式编程

React 是一个典型的函数式编程库。

## Vue 和 React 如何选择

- Vue 有着丰富的 API，实现起来快速简单，上手成本低，学习成本也相对较低。

- React 的灵活性和协作性更好一些，大型复杂项目还是比较推荐 React。

- 在实际项目选型的时候，还需要考虑自身或团队对 Vue 和 React 的掌握程度，优先选择自己擅长的。

## 创建 React 项目

1. 可以直接使用官方推荐的脚手架工具 create-react-app 来创建。

```
npx create-react-app react-api
```

::: warning 注意
npx 是 npm 5.2+自带的 package 运行工具。关于 npx 的使用方法可以参考：[npx 使用教程](http://www.ruanyifeng.com/blog/2019/02/npx.html)。
:::

2. React 项目默认是关闭 webpack 配置的，如果想开启，可以执行 `npm run eject` 命令。一旦开启，就没办法再关闭了。

3. 如果不想在安装包的时候版本号超过 package.json 里的版本，那么可以把包版本号前面的 `^` 去掉，这样，在安装依赖的时候，就会安装指定版本的包了。

4. serviceWorker 文件是用来做离线缓存的。

- [网站渐进式增强体验(PWA)改造：Service Worker 应用详解](https://lzw.me/a/pwa-service-worker.html)

- [React工程化之PWA之serviceWorker](https://www.51dev.com/cplus/24658)

## 编写 React

在编写 React 代码时，一定要引入 `react` 和 `react-dom` 这两个库，其中 react-dom 就是提供 DOM 操作的功能库。

### 编写 React 组件

组件的首字母一定要大写。

```jsx
// 函数组件
function App() {
  return (
    <div className="App">
      <h2>函数组件</h2>
    </div>
  );
}
```

```jsx
// 类组件
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h2>类组件</h2>
      </div>
    )
  }
}
```

::: warning 注意
类组件的写法有两种。

```jsx
import React from 'react';
class App extends React.Component { ... }
```

```jsx
import React, { Component } from 'react';
class App extends Component { ... }
```
:::

### 父子组件传值

:pushpin: **1. 父组件向子组件传值**

- 在 React 中，父组件向子组件传值也是通过属性的方式进行传递的，在子组件中通过 `this.props.xxx` 进行使用。

```jsx
// 父组件中传值
<TodoItem
  item={item}
  index={index}
  handleItemDelete={this.handleItemDelete.bind(this)} />
```

```jsx
// 子组件使用父组件传过来的值
import React, { Component } from "react";

class TodoItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  render() {
    return (
      <div onClick={this.handleClick}>{this.props.item}</div>
    )
  }
  handleClick() {
    this.props.handleItemDelete(this.props.index);
  }
}

export default TodoItem;
```

- 使用 ES6 的扩展运算符

```jsx
// 父组件
function Component1() {
  const prop = {
    name: 'xiaoming',
    age: '18'
  }
  return (
    <>
      <User {...prop} />
    </>
  )
}

// 当然也可以直接用下面的方式传值，但是明显组件多的时候就不方便
function Component1() {
  const prop = {
    name: 'xiaoming',
    age: '18'
  }
  return (
    <>
      <User name="xiaoming" age="18" />
    </>
  )
}

// 子组件
function User(props) {
  return (
    <div>
      <h2>我是user组件</h2>
      <p>{props.name}--{props.age}</p>
    </div>
  )
}
```

:pushpin: **2. 子组件向父组件传值**

同样是使用 props 巧妙地让子组件向父组件传值。

```jsx
// 父组件
function Component1() {
  const prop = {
    name: "xiaoming",
    age: "18",
  };

  // 父组件接收子组件传过来的值
  function getChildData(data) {
    console.log('子组件的值：' + data);
  }

  return (
    <Footer getChildData={getChildData} {...prop} />
  )
}
```

```jsx
// 子组件
class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }
  }

  handleAdd = () => {
    this.setState(state => ({
      count: state.count++
    }))
    this.props.getChildData(this.state.count);
  }

  render() {
    const {name, age} = this.props;
    return (
      <div>
        <button onClick={this.handleAdd}>点击加一{this.state.count}</button>
        <p>{`Footer：${name}--${age}`}</p>
      </div>
    )
  }
}
```

### JSX 详解

- [JSX](https://www.jianshu.com/p/3345e94baec0) 全称是 JavaScript and XML，是对 JavaScript 的一种语法扩展。它是一种技术，而不是一种语言。

- JSX 的底层原理就是通过 **React.createElement** 方法将 HTML 代码转换成 JS 对象的。

```jsx
function App() {
  const message = '函数组件';
  return (
    <div className="App" tabIndex="1" data-tab="1" dataid="1">
      <h2>{message}</h2>
    </div>
  );
}
```

上面这段代码用 JS 对象直接描述的方式来写的话就是下边这样的：

```js
function App() {
  const message = '函数组件';
  const element = React.createElement(
    'div',
    {
      className: 'App',
      tabIndex: '1',
      dataTab: '1',
      dataid: '1'
    },
    React.createElement(
      'h2',
      null,
      `${message}`
    )
  );
  return element;
}
```

可以看到，使用 JS 对象直接描述的方式相对于 JSX 来说繁琐了许多。

- 使用占位符 [Fragment](https://reactjs.org/docs/fragments.html) 可以实现同时有多个顶层 div 元素。

```jsx
import React, { Fragment } from 'react';
import './assets/css/App.css';

function App() {
  const message = '函数组件';
  return (
    <Fragment>
      <div className="App" tabIndex="1" data-tab="1" dataid="1">
        <h2>{message}</h2>
      </div>
      <div>使用占位符</div>
    </Fragment>
  );
}

// 或者直接使用 React.Fragment

function App() {
  const message = '函数组件';
  return (
    <React.Fragment>
      <div className="App" tabIndex="1" data-tab="1" dataid="1">
        <h2>{message}</h2>
      </div>
      <div>使用占位符</div>
    </React.Fragment>
  );
}

// 或者直接这么写

function App() {
  const message = '函数组件';
  return (
    <>
      <div className="App" tabIndex="1" data-tab="1" dataid="1">
        <h2>{message}</h2>
      </div>
      <div>使用占位符</div>
    </>
  );
}
```

::: warning 注意
1. JSX 中最外层只能有一个 div 元素。

2. 在 JSX 中，属性的命名要求用小驼峰的形式，比如：className、tabIndex等等；但是也有一个特例：dataid；此外，自定义的属性最好以 data- 开头。

3. JSX 中的注释方法如下。
   
- 多行注释

  ```jsx
  {/*  */}
  ```
   
- 单行注释

   ```jsx
   {
     // 注释
   }
   ```

4. 如果 return 后面不加括号，那么 HTML 代码只能写在一行里，不能换行。
:::

### setState

- 在 React 中，改变数据需要使用 [setState](https://zh-hans.reactjs.org/docs/faq-state.html#what-does-setstate-do) 方法，不能直接修改 [state](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html) 里的数据。

```jsx
handleInputChange(e) {
  this.setState({
    inputValue: e.target.value
  });
}
```

- 不过现在新版的 React 的 setState 方法一般不直接传一个对象了，而是传一个函数，函数中返回内容。

```jsx
handleInputChange(e) {
  const value = e.target.value;
  this.setState(() => ({
    inputValue: value
  }))
}
```

::: warning 注意
1. 这里要先把 e.target.value 的值保存下来，再赋给 setState 函数中的属性，不能直接像下面这么写，会报错。

```jsx
handleInputChange(e) {
  this.setState(() => ({
    inputValue: e.target.value
  }))
}
```

2. **在事件处理函数内部的 setState 是异步的。**

例如，如果 Parent 和 Child 在同一个 click 事件中都调用了 setState ，这样就可以确保 Child 不会被重新渲染两次。取而代之的是，React 会将该 state “冲洗” 到浏览器事件结束的时候，再统一地进行更新。这种机制可以在大型应用中得到很好的性能提升。

如果我们需要基于当前的 state 来计算出新的值，那就应该传递一个函数，而不是一个对象。因为传递一个函数可以让我们在函数内访问到当前的 state 的值。这就是给 setState 传递一个对象和传递一个函数的区别。
:::

- 注意下面这种写法是不推荐的。尽管运行的时候并不会报错，但是它直接修改了 state 里的数据，违背了 React 中的 [immutable](https://zh-hans.reactjs.org/docs/optimizing-performance.html#the-power-of-not-mutating-data) 理念。

```jsx
handleItemDelete(idx) {
  this.state.list.splice(idx, 1)
  this.setState({
    list: this.state.list
  })
}
```

推荐写法应该是这样的。

```jsx
handleItemDelete(idx) {
  const list = [...this.state.list];
  list.splice(idx, 1)
  this.setState({
    list
  })
}
```

更标准的写法。

```jsx
handleItemDelete(idx) {
  this.setState((prevState) => {
    const list = [...prevState.list];
    list.splice(idx, 1);
    return { list };
  })
}
```

- setState 里的函数可以接收一个参数，代表 `this.state`。用法如下：

```jsx
handleBtnClick() {
  if (!this.state.inputValue) return;
  this.setState(() => ({
    list: [...this.state.list, this.state.inputValue],
    inputValue: "",
  }))
}

// 等价于下面的写法，而且页更推荐下面的写法

handleBtnClick() {
  if (!this.state.inputValue) return;
  this.setState((prevState) => ({
    list: [...prevState.list, prevState.inputValue],
    inputValue: "",
  }))
}
```

::: tip state、props 和 render 的关系
- 当组件的 state 或者 props 发生改变时，render 函数就会重新执行。

- 当父组件的 render 函数重新执行时，子组件的 render 函数也会重新执行。
:::

### 修正 this 指向

在 React 中，绑定 this 有以下两种方式：

:pushpin: **1. 在 constructor 中绑定**

在绑定事件时，会导致 this 指向丢失，所以我们需要在绑定的时候用 bind 方法手动修正下。

```jsx
<ul>
  {
    this.state.list.map((item, index) => {
      return (
        <li key={index} onClick={this.handleItemDelete.bind(this, index)}>
          {item}
        </li>
      );
    })
  }
</ul>
```

不过，一般不推荐直接在 JSX 代码中 bind，会多次执行，影响性能问题。而是像下面这么写，统一在 constructor 中绑定。

```jsx
constructor(props) {
  super(props);
  this.handleItemDelete = this.handleItemDelete.bind(this);
}
```

:pushpin: **2. 使用 ES6 的箭头函数**

可以直接在 JSX 代码中绑定，如下：

```jsx
handleAdd() {
  this.setState(state => ({
    count: state.count++
  }))
}

render() {
  return (
    <div>
      <button onClick={() => {this.handleAdd()}}>点击加一{this.state.count}</button>
    </div>
  )
}
```

不过，这也是不推荐的写法，因为也会多次执行，影响性能问题。推荐的写法应该是下面这样的：

```jsx
handleAdd = () => {
  this.setState(state => ({
    count: state.count++
  }))
}

render() {
  return (
    <div>
      <button onClick={this.handleAdd}>点击加一{this.state.count}</button>
    </div>
  )
}
```

### label 标签的使用

使用 label 实现点击标签名的时候聚焦输入框。

给 input 绑定 `id` 属性，然后给 label 绑定一个值相同的 `htmlFor` 属性，就可以了。

```jsx
<label htmlFor="inputArea">请输入内容：</label>
<input
  id="inputArea"
  type="text"
  value={this.state.inputValue}
  onChange={this.handleInputChange.bind(this)}
  className="input"
/>
```

## React 非 DOM 属性

- dangerousSetInnerHTML

- ref

- key

### dangerousSetInnerHTML

- 这个属性相当于 HTML 中的 innerHTML 属性。容易造成 XSS 攻击，尽量少使用。

- 使用方法

  ```jsx
  <div dangerouslySetInnerHTML={{__html: '<p>我是插入的 html 代码</p>'}}></div>
  ```

### ref

- [ref](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html) 这个属性能让我们访问到页面中的某个元素或者组件实例。因为并不推荐直接操作 DOM，所以也是尽量少使用。

- 不能在函数组件上使用，因为函数组件没有实例。

- 不过可以在函数内部使用。

- 使用方法

  ```jsx
  function Component1() {
    // 创建一个 ref
    const userRef = React.createRef();

    return (
      <>
        {/* App 是一个类组件 */}
        <App ref={userRef} />
      </>
    )
  }
  ```

- ref 的值其实是一个对象。

  ![react](../.vuepress/public/assets/image/react/react1.png 'react')

  通过 current 属性我们可以操作到 DOM 元素，比如可以实现点击按钮聚焦 input 输入框的功能。

  ```jsx
  function Component1() {
    // 创建一个 ref
    const inputRef = React.createRef();

    function handleClick() {
      console.log(inputRef);
      inputRef.current.focus();
    }

    return (
      <>
        <button onClick={handleClick}>点我</button>
        <input type="text" ref={inputRef}></input>
      </>
    )
  }
  ```

- ref 和 setState 一起使用时要注意，如果我们想获取在 setState 执行完成后的 DOM 元素，我们应该把代码写在 setState 的第二个参数里，这个参数是一个函数，它会在 setState 执行完成后再执行。不能直接把代码写在 setState 下面，因为 setState 是异步的，不会立即执行，即使写在下面，也会比 setState 先一步执行，从而获取不到 DOM 元素。

```jsx
render() {
  return (
    <ul className="todoContent" ref={(ul) => this.ul = ul}>
      {this.getTodoItems()}
    </ul>
  )
}
```

```js
handleBtnClick() {
  this.setState((prevState) => ({
    list: [...prevState.list, prevState.inputValue],
    inputValue: "",
  }), () => {
    // 这才是正确的位置
    console.log(this.ul.querySelectorAll('li').length);
  })

  // 每次获取到的长度总会比预期的少1，这是因为 setState 是异步的，放在这里会比 setState 先执行
  // 应该把这句话写在 setState 的第二个参数里，这个参数是一个函数，当 setState 执行完成后就会执行这个回调
  console.log(this.ul.querySelectorAll('li').length);
}
```

### key

- 唯一标识，作用是为了提高渲染性能。跟 Vue 里的类似。

- 一般不建议使用 index 作为 key 值，这是因为当我们删除或者新增元素的时候，元素的 index 会发生改变，相应的它的 key 值就会跟上一次匹配不上，会影响到页面的渲染更新。因此要使用不会改变的并且唯一的值来作为 key 值。

## PropTypes 与 defaultProps

- 我们可以使用 [PropTypes](https://zh-hans.reactjs.org/docs/typechecking-with-proptypes.html#gatsby-focus-wrapper) 属性来对子组件接收到的 props 值进行类型检查，使用这个属性的时候需要导入 prop-types 这个库。用法如下：

```js
import PropTypes from "prop-types";

class TodoItem extends Component {
  ...
}

TodoItem.propTypes = {
  content: PropTypes.string,
  handleItemDelete: PropTypes.func,
  index: PropTypes.number,
  test: PropTypes.string.isRequired
}
```

- 我们还可以使用 defaultProps 属性来定义 props 的默认值，不需要导入 prop-types 这个库就可以使用。用法如下：

```js
class TodoItem extends Component {
  ...
}

TodoItem.defaultProps = {
  test: 'Hello World'
}
```

## 虚拟 DOM

### 什么是虚拟 DOM

- 虚拟 DOM 其实就是 JavaScript 对象，用来描述真实的 DOM 元素。

- React 通过使用虚拟 DOM 减少了生成 DOM 和比对 DOM 带来的性能损耗，因为创建和对比 JS 对象要远比操作 DOM 元素方便的多，也快的多。

- 一段 HTML 代码可以用 JS 对象来表示如下：

```html
<div class='box' id='content'>
  <div class='title'>Hello</div>
  <button>Click</button>
</div>
```

```js
{
  tag: 'div',
  attrs: { className: 'box', id: 'content'},
  children: [
    {
      tag: 'div',
      arrts: { className: 'title' },
      children: ['Hello']
    },
    {
      tag: 'button',
      attrs: null,
      children: ['Click']
    }
  ]
}
```

### JSX 代码的转化

- JSX 代码在 React 底层的转化过程如下：

```
JSX 代码 -> React.createElement -> 虚拟 DOM（JS 对象） -> 真实 DOM
```

- 对于一段 JSX 代码，我们也可以直接使用 [React.createElement](https://zh-hans.reactjs.org/docs/react-without-jsx.html) 方法来实现。

```jsx
class TodoItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { content, test } = this.props;
    return (
      <li className="todoItem" onClick={this.handleClick}>{test} - {content}</li>
    )
  }
}
```

```js
class TodoItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { content, test } = this.props;
    return React.createElement(
      'li',
      {
        className: 'todoItem',
        onClick: this.handleClick
      },
      `${test} - ${content}`
    )
  }
}
```

### 虚拟 DOM 的优点

- 提升性能。

- 使得跨端应用得以实现，比如 React Native，因为在安卓、ios 这些平台上是没有 DOM 元素的。

## React 生命周期函数

- 生命周期函数是指在某一时刻组件会自动调用执行的函数。

- [React 常用的生命周期方法](https://zh-hans.reactjs.org/docs/react-component.html#commonly-used-lifecycle-methods)

- [React 生命周期图谱](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

  ![react](../.vuepress/public/assets/image/react/react2.png 'react')

## React 发送请求

**在 React 中发送 ajax 请求，建议放在 componentDidMount 里面执行，只会执行一次，而且一定不会有问题**。不要放在 render 里面，因为会执行多次；放在 constructor 或者 componentWillMount 里也可以，但是碰到更深层次的技术（比如 React Native）时，也会有别的问题。发送 ajax 请求也是用 axios 这个库。

### Charles

使用 [charles](https://www.charlesproxy.com/) 进行数据 mock。使用方法如下：

1. 在本地新建一个 data.json 文件，里面存放着我们需要的数据。然后点击 charles 菜单栏的 Tools -> Map Local Settings -> Add，作如下配置。注意第二张图的两个多选框都要勾选上。

![react](../.vuepress/public/assets/image/react/react7.png 'react')

![react](../.vuepress/public/assets/image/react/react8.png 'react')

::: warning 注意
域名要写 localhost.charlesProxy.com，不要写 localhost。
:::

2. 关掉所有的代理，比如浏览器的上网代理等。

3. 在代码中这么使用。

```jsx
componentDidMount() {
  axios.get('/api/todolist')
    .then((res) => {
      this.setState(() => {
        return {
          list: res.data.data
        }
      })
      // alert('success')
    })
    .catch(() => { alert('error') })
}
```

4. 然后在浏览器中访问 http://localhost.charlesproxy.com:3000/，就可以看到我们从本地接口请求到的数据了。

![react](../.vuepress/public/assets/image/react/react9.png 'react')

### devServer

模拟数据请求还有其他的方式，比如可以使用 webpack 的 devServer 直接在本地起一个服务。

```js
devServer: {
  contentBase: path.resolve(__dirname, 'dist'),    // devServer 静态文件根目录
  before(router) { // 用来配置路由
    router.get('/success', function(req, res) {
      res.json({ id: 1 });
    });
    router.post('/error', function(req, res) {
      res.sendStatus(500);
    });
  }
},
```

### express

还可以使用 Node.js 的 express 模块启动一个服务。比如之前在 vue 项目中可以这么配置。

1. vue 2.x 是在 dev-server.js 文件中配置。

![react](../.vuepress/public/assets/image/react/react3.png 'react')

2. vue 3.x 是在 webpack.dev.config.js 文件中配置。

![react](../.vuepress/public/assets/image/react/react4.png 'react')

![react](../.vuepress/public/assets/image/react/react5.png 'react')

3. 配置 post 请求

![react](../.vuepress/public/assets/image/react/react6.png 'react')

## React 性能优化点

1. 修改事件内 this 指向的工作放在 constructor 里统一完成，这样可以保证修改 this 指向的工作只执行一次。

2. setState 的底层也做了性能优化的提升，它会将多次的操作放到最后统一执行。

3. 虚拟 DOM 的同层比对、key 值比对等等。

4. 利用 shouldComponentUpdate 生命周期也可以做一些性能提升。

```js
// 当下一次接收的 content 跟当前的 content 不一样时，才让子组件重新渲染
// 避免子组件做无谓的渲染操作，提升性能
shouldComponentUpdate(nextProps, nextState) {
  if (nextProps.content !== this.props.content) {
    return true;
  } else {
    return false;
  }
}
```

## React 动画效果

1. 在 React 中，简单的动画效果我们可以使用 CSS3 的 [transition](https://www.runoob.com/cssref/css3-pr-transition.html)、[transform](https://www.runoob.com/cssref/css3-pr-transform.html) 属性和 [@keyframes](https://www.runoob.com/cssref/css3-pr-animation-keyframes.html) 规则来完成。

2. 如果想实现一些比较复杂的动画效果，可以借助 [react-transition-group](https://github.com/reactjs/react-transition-group) 这个库。文档地址：[react-transition-group 文档](https://reactcommunity.org/react-transition-group/)。

- 如果只想对单个元素做动画效果，那么使用 [CSSTransition](http://reactcommunity.org/react-transition-group/css-transition) 就可以了。

- 如果碰到 CSSTransition 实现不了的动画，那就看看 [Transition](https://reactcommunity.org/react-transition-group/transition)，它是更接近底层的实现。

- 如果想对多个元素做动画效果，那就需要 [CSSTransition](http://reactcommunity.org/react-transition-group/css-transition) 和 [TransitionGroup](https://reactcommunity.org/react-transition-group/transition-group) 配合一起使用。