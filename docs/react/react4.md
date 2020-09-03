## React Router 简介

1. [React Router 中文文档](http://react-guide.github.io/react-router-cn/index.html)

2. 目前已经发展到 [React Router5](https://www.npmjs.com/package/react-router) 了，在 React Router 的各个版本中，v4 和 v5 的理念和用法是基本一致的，但是 v4 和 v2、v3 的差异就比较大了。

3. v4 是当前大多数项目使用比较多的稳定版本，它跟之前版本的差异主要体现在以下几点：

- v4 属于动态路由；而 v4 之前的版本属于静态路由。

- v4 被拆分成 **react-router**（路由基础库）、**react-router-dom**（基于浏览器环境的再次封装）、**react-router-native**（基于 react-native 环境的再次封装）、**react-router-config**（静态路由配置助手）多个包，方便按需引入。

4. v5 相对于 v4 主要就是做了一些改进和新特性，更注重稳定性和兼容性。

- 完全兼容 v4。

- 完全兼容 >=react15 的版本，为 react16 提供更好的支持。

- 消除了严格模式的警告。

- 适用 create-react-context，升级了 react context api。

- 引入了预优化。

- 引入方式有所变化。

```js
// 之前
import Router from 'react-router/Router';

// 现在
import { Router } from 'react-router';
```

- 现在的 React Router 版本中，已经不需要路由配置，一切皆组件。

::: tip 前端路由
1. 原理：检测浏览器 url 的变化，截获 url 地址，然后进行 url 路由匹配。

2. 有 hash 和 history 两种模式。

3. hash 模式带有“#”符号，可以监听 hashchange 事件。

4. history 模式新增了 pushState、replaceState 方法以及 onpopstate 事件。

5. 注意：页面刷新时，hash 模式下浏览器不会向服务器发送请求，但是 history 模式就会。
:::

## React Router 使用

### 安装

如果是在浏览器中，就安装 `react-router-dom`；如果是在 react native 中，就安装 `react-router-native`。

### 基础路由配置

一个最基本的路由必须要用到 BrowserRouter 和 Route 这两个组件。

- HashRouter 组件，hash 模式

- BrowserRouter 组件，history 模式

- Route 组件

### 常见组件

#### 1. Router 组件

- 每个 router 都会创建一个 history 对象，用来保持当前位置的追踪。

- web 端

  HashRouter：只处理静态的 url

  BrowserRouter：非静态的站点，要处理不同的 url

- react native 端

  MemoryHistory

#### 2. Route 组件

- 只是一个具有渲染方法的普通 react 组件，路由匹配成功渲染该组件。

- 常用属性

  path，路由匹配规则，可以省略，字符串类型。如果没有指定 path，无论访问什么路由，都会匹配到

  exact，布尔类型，设置为 true 的话就是严格模式

  ```jsx
  {/* 指定严格模式后就匹配不到 Info 组件了 */}
  <Route path="/" exact component={Info} />
  ```

  component，要渲染的组件

  render，函数形式，渲染 JSX 代码，可以进行逻辑操作，只有在 path 匹配的时候才执行

  ```jsx
  <Route
    path="/render"
    render={() => {
      return <h1>Render</h1>
    }} 
  />
  ```

  children，函数形式，也可以做一些逻辑操作，任何时候都会执行。有一个 match 对象，匹配到路由时对象就有值，匹配不到路由时，就为 null。

  ```jsx
  {/* 当访问的路由是 /children 时，页面显示 Children/children，否则显示 Childrennull */}
  <Route
    path="/children"
    children={({match}) => {
      return <h1>Children{ match ? match.path : match + '' }</h1>
    }}
  />
  ```

  优先级：children > component > render

#### 3. Switch 组件

- 最多只会匹配一个组件。如果第一个组件匹配到了，就不会继续往下匹配了。

  ```jsx
  <Switch>
    {/* 指定严格模式后就匹配不到 Info 组件了 */}
    {/* 如果没有指定严格模式，那么 Switch 组件就会匹配到 Info 组件，从而渲染 Info；否则的话就会渲染 Home */}
    <Route path="/" exact component={Info} />
    <Route path="/home" component={Home} />
    <Route path="/about" component={About} />
  </Switch>
  ```

- 作用是可以将 Route 组件分组。

- 最常用的场景就是实现 404 页面渲染。

  ```jsx
  <Switch>
    {/* 当访问一个不存在的路由时，就会渲染最下面的 NotFound 组件 */}
    <Route path="/" exact component={Info} />
    <Route path="/home" component={Home} />
    <Route path="/about" component={About} />
    <Route component={NotFound} />
  </Switch>
  ```

#### 4. Link 组件

- 声明式的可访问导航。

- to 属性，跳转路径，可以是字符串，也可以是对象。对象形式可以添加这些属性：pathname、search、hash、state。

  ```jsx
  {/* 字符串 */}
  <Link to="/home">跳转到 Home</Link>

  {/* 对象 */}
  <Link to={{ pathname: "/home", search: "?name=abc" }}>跳转到 Home</Link>
  ```

- replace 属性，布尔类型，如果设置为 true，会替换当前的历史记录。

#### 5. NavLink 组件

- 可以理解成特殊的 Link，用法跟 Link 一样，只不过当匹配的时候可以添加样式。

- 可以通过 activeClassName 或者 activeStyle 的方式添加样式。

  ```jsx
  <NavLink activeStyle={{ color: 'red' }} to="/about">跳转到 About</NavLink>
  ```

- exact 属性，设置为 true 的话，表示只有严格匹配的时候才会应用设置的样式。

#### 6. Redirect 组件

- 重定向组件，必须有 to 属性。有以下常用属性：

  to 属性，可以是字符串或者对象。

  push 属性，布尔类型，为 true 的话表示会将新地址推入历史记录中，而不是替换。通过 history.push 实现的。

  from 属性

  exact 属性

- 最常用的场景就是登录跳转。

  ```jsx
  const isLogin = false; // 模拟未登录，当访问 /info 时就会重定向到 Home 页面

  return (
    <Route path="/info" render={() => { return isLogin ? <Info /> : <Redirect to="/home" />}} />
  )
  ```

#### 7. History 对象

- 使用它的 push 方法可以实现编程式导航。

  ```jsx
  import React from 'react';

  function Home(props) {
    function handleClick() {
      props.history.push('/about')
    }

    return (
      <div>
        <h1>Home</h1>
        <button onClick={handleClick}>跳转到 About</button>
      </div>
    )
  }

  export default Home;
  ```

#### 8. withRouter 组件

  ```jsx
  // App.js
  import { withRouter } from 'react-router-dom';

  function App(props) {
    // 使用了 withRouter 进行包裹之后，props 才有值
    console.log(props);

    return (
      ...
    )
  }

  export default withRouter(App);
  ```

  ```jsx
  // index.js
  // BrowserRouter 必须在最外层，所以在这里让它将整个 App 包裹起来就行了
  import { BrowserRouter } from 'react-router-dom';

  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root')
  );
  ```

### 动态路由

1. 指的是路由规则不是事先确定的，而是在渲染过程中确定的。比如：/about/1、/about/2... 这样的形式。

2. 使用 : 就可以实现。

  ```jsx
  <Route path="/about/:id" component={About} />
  ```

  然后在 About 组件中可以通过 props.match.params.id 获取到参数。

  ```jsx
  import React from 'react';

  function About(props) {
    return (
      <div>
        <h1>About</h1>
        <p>url 参数：{props.match.params.id}</p>
      </div>
    )
  }

  export default About;
  ```

### 嵌套路由

比如在 Home 组件中通过二级路由渲染 About 和 Info 组件。

```jsx
import React from 'react';
import About from './About';
import Info from './Info';

import { Route, Link } from 'react-router-dom';

function Home(props) {
  function handleClick() {
    props.history.push('/about')
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleClick}>跳转到 About</button>
      <div>
        <Link to={`${props.match.path}/one`}>二级路由 About</Link>
      </div>
      <div>
        <Link to='/home/two'>二级路由 Info</Link>
      </div>
      <Route path={`${props.match.path}/one`} component={About}></Route>
      <Route path='/home/two' component={Info}></Route>
    </div>
  )
}

export default Home;
```