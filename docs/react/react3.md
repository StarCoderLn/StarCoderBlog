## Hook 简介

1. [Hook](https://react.docschina.org/docs/hooks-intro.html) 是 React 16.8 的新增特性。它可以让我们在不编写 class 的情况下使用 state 以及其他的 React 特性。

2. Hook 并没有带来[破坏性改动](https://react.docschina.org/docs/hooks-intro.html#no-breaking-changes)。

- 完全可选的。

- 100% 向后兼容的。

- 现在可用。

- 没有计划从 React 中移除 class。

- Hook 不会影响对 React 概念的理解。

## 为什么要使用 Hook

**很多人觉得 React 比 vue 难学的原因，主要有以下几点：**

1. 生命周期难以理解，很难熟练使用。

2. 高阶组件理解起来也不容易。

3. React 的许多优秀解决方案都在社区，并且都是英文的。

4. Redux 概念非常多，难以理解。

**而 Hook 能降低我们学习 React 的学习成本，主要体现在以下几点:**

1. 上手更容易，编写的代码更简洁。

2. Hook 使得学习成本降低了，有了 Hook，生命周期和高阶组件可以不用学，redux 也不再是必需品。

3. 开发体验好，可以让函数组件维护内部的状态。

## Hook API

### [useState](https://react.docschina.org/docs/hooks-reference.html#usestate)

- 可以接收任意类型的参数，返回一个 state，以及更新 state 的函数。

- 在组件每次渲染时都会重新执行。

- 底层也是使用了闭包的原理。首次渲染时 state 获取的是初始值，再次渲染时 state 获取的就是闭包中的缓存值了。

- 允许使用多次。

  ```jsx
  import React, { useState } from 'react';

  function HookComponent() {
    // useState 在组件每次渲染时都会重新执行
    // useState 底层也是使用了闭包的原理
    // 首次渲染时 count 获取的是初始值，再次渲染时 count 获取的就是闭包中的缓存值了
    // useState 允许使用多次

    // let [count, setCount] = useState(0);

    // let [count, setCount] = useState({ a: 1 });
    
    const num = 2;
    let [count, setCount] = useState(() => {
      // 接收函数进行逻辑运算
      return 10 * num;
    })
    return (
      <div>
        {/*<p>{count.a}-{count.b}</p>*/}
        <p>{count}</p>
        <button onClick={handleBtnClick}>加一</button>
      </div>
    )
    function handleBtnClick() {
      // setCount 接收的参数可以是任意类型，会覆盖掉原来 count 的值
      // 也是异步的
      // setCount(++count);

      // 不想被覆盖的话可以使用 es6 的扩展运算符
      // setCount({...count, b: 2})

      setCount(count => {
        return ++count;
      })
    }
  }

  export default HookComponent;
  ```

### [useEffect](https://react.docschina.org/docs/hooks-reference.html#useeffect)

- 接收一个函数，要么返回一个清除副作用的函数，要么不返回。

- 用来处理副作用，比如定时器、ajax 请求等。跟生命周期函数 componentDidMount 用途相同，在 DOM 渲染完成后执行。

- 传给 useEffect 的函数会延迟调用，如果需要同步执行，就得使用 useLayoutEffect。

- 第二个参数让副作用变得可控。

  在以上代码的基础上，使用 useEffect 让 count 等一秒后加一。

  ```js
  import React, { useEffect } from 'react';

  // DOM 渲染完成后执行
  useEffect(() => {
    setTimeout(() => {
      setCount(count => {
        return ++count;
      })
    }, 1000)
  })
  ```

  但是这么写了之后会发现一个问题，count 会一直在加一，这是因为在副作用（setTimeout）执行过程中，修改了 count，组件的状态发生了改变，就会引发重新渲染，重新渲染又会触发 useEffect 重新执行，从而陷入了无限循环。

  解决这个问题的方法是给 useEffect 传入第二个参数，一个空数组，这样就只会执行一次。

  **传入第二个参数就相当于告诉 React，useEffect 不依赖 state 或者 props 的变化，只依赖传入的第二个参数的变化**。

  ```js
  import React, { useEffect } from 'react';

  // DOM 渲染完成后执行
  useEffect(() => {
    setTimeout(() => {
      setCount(count => {
        return ++count;
      })
    }, 1000)
  }, [])
  ```

  使用第二个参数可以让副作用变得可控，比如当点击按钮的时候，改变第二个参数里的值，触发 useEffect 的执行。

  ```jsx
  let [refresh, setRefresh] = useState(0);

  // DOM 渲染完成后执行
  useEffect(() => {
    setTimeout(() => {
      setCount(count => {
        return ++count;
      })
    }, 1000)
  }, [refresh])

  return (
    <button onClick={() => setRefresh(!refresh)}>刷新</button>
  )
  ```

  每次点击刷新按钮的时候，count 的值就会在一秒后再次加一。

- **如何清除副作用？**

  在生命周期函数中，清除副作用一般是在 componentWillUnmount 里完成的。

  在 useEffect 中是通过返回一个清除副作用的函数来完成的。

  ```js
  // DOM 渲染完成后执行
  useEffect(() => {
    setTimeout(() => {
      setCount(count => {
        return ++count;
      })
    }, 1000)
    console.log('副作用函数');
    function clear() {
      // 清除副作用的工作放在这里
      // 执行时机有两个
      // 1. 组件卸载前
      // 2. 下一次 useEffect 触发前
      console.log('清除副作用函数');
    }
    return clear;
  }, [refresh])
  ```

  每次点击刷新按钮都会先打印“清除副作用函数”，再打印“副作用函数”。

### [useContext](https://react.docschina.org/docs/hooks-reference.html#usecontext)

- 接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值。

- 主要用于爷孙组件传值。

- context 和 useContext 配合使用能够更好的解决组件之间状态共享的问题。

  ```jsx
  // 顶层组件 ContextProvider.js
  import React, { createContext, useState } from 'react';

  export const context = createContext({});

  export function ContextProvider({ children }) {
    let [count, setCount] = useState(10);
    const countVal = {
      count,
      setCount,
      add: () => setCount(count + 1),
      reduce: () => setCount(count - 1)
    }
    // context 对象中提供了一个自带的 Provider 组件
    return <context.Provider value={countVal}>{ children }</context.Provider>
  }
  ```

  ```jsx
  // 子组件 SubCount.js
  import React, { useContext } from 'react';
  import { context, ContextProvider } from './ContextProvider';

  function SubCount() {
    const { count = 0, add, reduce } = useContext(context);

    return (
      <div>
        <p>{count}</p>
        <button onClick={add}>加</button>
        <button onClick={reduce}>减</button>
      </div>
    )
  }

  export default () => (
    <ContextProvider>
      <SubCount />
    </ContextProvider>
  )
  ```

- 如果有多个顶层组件向同一个组件传数据，那么只需要嵌套使用就行了。

  ```jsx
  // 顶层组件 ContextProvider2.js
  import React, { createContext, useState } from 'react';

  export const context2 = createContext({});

  export function ContextProvider2({ children }) {
    let [val, setVal] = useState(10);
    const value = {
      val,
      setVal
    }
    // context2 对象中提供了一个自带的 Provider 组件
    return <context2.Provider value={value}>{ children }</context2.Provider>
  }
  ```

  ```jsx
  // 子组件 SubCount.js
  import React, { useContext } from 'react';
  import { context, ContextProvider } from './ContextProvider';
  import { context2, ContextProvider2 } from './ContextProvider2';

  function SubCount() {
    const { count = 0, add, reduce } = useContext(context);
    const { val } = useContext(context2);

    return (
      <div>
        <p>{count}--{val}</p>
        <button onClick={add}>加</button>
        <button onClick={reduce}>减</button>
      </div>
    )
  }

  export default () => (
    <ContextProvider2>
      <ContextProvider>
        <SubCount />
      </ContextProvider>
    </ContextProvider2>
  )
  ```

### [useReducer](https://react.docschina.org/docs/hooks-reference.html#usereducer)

- useState 的替代方案。

- 接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法。

  ```js
  const [state, dispatch] = useReducer(reducer, initialArg, init);
  ```

- 跟 redux 里的 reducer 用法类似。

  ```jsx
  import React, { useReducer } from 'react';

  // 第一个参数，定义 reducer
  const reducer = (state, action) => {
    switch(action.type) {
      case 'add':
        return { ...state, count: state.count + 1 };
      case 'reduce':
        return { ...state, count: state.count - 1 };
      default:
        return state;
    }
  }

  // 第二个参数，指定默认值
  const initialState = { count: 10 };

  // 第三个参数，是一个函数，会将第二个参数当作它的参数执行。此参数可选
  const init = initialState => {
    // 对初始值进行一些逻辑处理
    return { count: initialState.count + 2 }
  }

  export default function ReducerComponent() {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    return (
      <div>
        <p>{state.count}</p>
        <button onClick={() => dispatch({ type: 'add' })}>加</button>
        <button onClick={() => dispatch({ type: 'reduce' })}>减</button>
      </div>
    )
  }
  ```

  可以看到，用 useReducer 来实现计数器的功能要比 useState 复杂，因此，对于一些简单的功能，能用 useState 实现就用它实现。使用 useReducer 时需要评估好当前场景是否适用。

### [useRef](https://react.docschina.org/docs/hooks-reference.html#useref)

- 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数。

- 跟 React.createRef() 的作用是一样，用来访问 DOM 节点。

- 放在 useEffect 中去操作 DOM 节点。

  ```jsx
  import React, { useRef } from 'react';
  
  function HookComponent() {
    const inputRef = useRef(null);

    useEffect(() => {
      inputRef.current.focus();
    }, [])
  
    return (
      <div>
        <label htmlFor="input">输入框：</label>
        <input type="text" id="input" ref={inputRef}></input>
      </div>
    )
  }
  ```

  页面渲染完成后 input 框会聚焦，点击 label 标签也会聚焦 input 框。

### [useMemo](https://react.docschina.org/docs/hooks-reference.html#usememo)

- 把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

- 返回函数运行的结果，是一个值。

### [useCallback](https://react.docschina.org/docs/hooks-reference.html#usecallback)

- 把内联回调函数及依赖项数组作为参数传入 useCallback，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。

- 返回一个函数。

  这两个 Hook 可以用来实现计算缓存和记忆函数，但是不能盲目使用。

  ```js
  const memorized1 = useCallback(() => {
    return count;
  }, [num])
  const memorized2 = useMemo(() => {
    return count;
  }, [num])

  console.log('useCallback: ' + memorized1());
  console.log('useMemo: ' + memorized2);
  console.log('count: ' + count);
  ```

  用了 useMemo 和 useCallback 之后，count 的值会被缓存下来，只有当 num 的值发生改变时，count 的值才会更新，否则就一直会是初始值。
  
  ::: warning 注意
  两个 Hook 的第二个参数依赖项数组一定要传，否则不会进行缓存。
  :::

## 自定义 Hook

1. 通过[自定义 Hook](https://react.docschina.org/docs/hooks-custom.html)，我们可以将一些相同的逻辑代码提取到函数中来复用。

2. 自定义 Hook 是一个函数，**其名称必须以 “use” 开头**，函数内部可以调用其他的 Hook。

3. 自定义 Hook 是一种重用状态逻辑的机制，所以每次使用自定义 Hook 时，**其中的所有 state 和副作用都是完全隔离的**。

  比如，把计数器的功能封装成自定义 Hook 进行使用。

  ```js
  // /utils/useNumber.js
  import { useEffect, useState } from 'react';

  export function useNumber() {
    let [number, setNumber] = useState(0);
    useEffect(() => {
      setTimeout(() => {
        setNumber(number => number + 1);
      }, 1000)
    }, []);
    return [number, setNumber];
  }
  ```

  在组件中使用它。

  ```js
  import { useNumber } from '../utils/useNumber';

  function HookComponent() {
    const [number, setNumber] = useNumber();
    console.log(number);
    console.log(setNumber);
  }
  ```

## Hook 使用规则

1. 只在最顶层使用 Hook，不要在循环，条件或嵌套函数中调用 Hook。

2. 只在 React 函数中调用 Hook，不要在普通的 JavaScript 函数中调用 Hook。