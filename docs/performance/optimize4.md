## 必须知道的概念

- TTFB（Time To First Byte），首字节时间。

- FP（First Paint），首次绘制。

- FCP（First Contentful Paint），首次有内容的绘制。

- FMP（First Meaningful Paint），首次有意义的绘制。

- Isomorphic JavaScript，同构化。

- SSR & CSR，服务端和客户端渲染。

- Long Tasks，超过了 50ms 的任务。

- TTI（Time To Interactive），可交互时间，推荐的响应时间是 100ms 以内，否则有延迟感。

- LCP（Largest Contentful Paint），最大内容绘制。用于记录视窗内最大的元素绘制的时间，该时间会随着⻚面渲染变化而变化，因为⻚面中的最大元素在渲染过程中可能会发生改变，另外该指标会在用户第一次交互后停止记录。

- FID（First Input Delay），首次输入延迟。记录在 FCP 和 TTI 之间用户首次与⻚面交互时响应的延迟。

- TBT（Total Blocking Time），阻塞总时间。记录在 FCP 到 TTI 之间所有⻓任务的阻塞时间总和。

- CLS（Cumulative Layout Shift），累计位移偏移。记录了⻚面上非预期的位移波动。使用按钮动态添加了某个元素，导致⻚面上其他位置的代码发生了偏移。

:bell: **核心的任务指标是：LCP、FID、CLS。**

- LCP 代表**⻚面的速度指标**， LCP 能体现的东⻄更多一些。一是指标实时更新，数据更精确，二是代表着⻚面最大元素的渲染时间，最大元素的快速载入能让用户感觉性能还挺好。

- FID 代表**⻚面的交互体验指标**，交互响应的快会让用户觉得网⻚流畅。

- CLS 代表**⻚面的稳定指标**，尤其在手机上这个指标更为重要。因为手机屏幕挺小，CLS 值一大的话会让用户觉得⻚面体验做的很差。

::: tip 快速获取各项性能指标
[web-vitals](https://www.npmjs.com/package/web-vitals) 这个库可以让我们很方便的获取到一些性能指标。

[tti-polyfill](https://www.npmjs.com/package/tti-polyfill) 这是一个可以获取 TTI 指标的库。
:::

## 指标的判断标准

- FP：仅有一个 div 根节点。

- FCP：包含⻚面的基本框架，但没有数据内容。

- FMP：包含⻚面所有元素及数据。

![performance](../.vuepress/public/assets/image/performance/performance26.png 'performance')

![performance](../.vuepress/public/assets/image/performance/performance27.png 'performance')

![performance](../.vuepress/public/assets/image/performance/performance28.png 'performance')

![performance](../.vuepress/public/assets/image/performance/performance29.png 'performance')

- CLS 的计算方法，以下面这张图为例。

![performance](../.vuepress/public/assets/image/performance/performance30.png 'performance')

文本移动了 25% 的屏幕高度距离(位移距离)，位移前后影响了 75% 的屏幕高度面积(位移影响的面积)，那么 CLS 为0.25 * 0.75 = 0.1875。
 
**CLS 推荐值为低于 0.1，越低说明⻚面跳来跳去的情况就越少，用户体验越好**。毕竟很少有人喜欢阅读或者交互过程中网⻚突然动态插入 DOM 的情况，比如说插入广告.

## 为什么会白屏

无非就是两个方面的原因，网络层面和渲染层面。网络层面可能是获取 CSS 和 JS 资源的时间太长，渲染层面就是 CSS 和 JS 的摆放位置会对页面渲染有影响，JS 放在顶部会对 DOM 解析和渲染都有影响，放在底部的话虽然不影响 DOM 解析，但是也会影响 DOM 渲染。CSS 也会影响 DOM 渲染。

## 浏览器中的 API

[W3C Navigation Timing](https://www.w3.org/TR/navigation-timing/#sec-navigation-timing-interface)

[Navigation Timing API](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigation_timing_API)

![performance](../.vuepress/public/assets/image/performance/performance31.png 'performance')

上面这张图展示的是从用户访问一个网页（敲回车或者点击）到整个网页展示出来的整个过程，这个过程中有各种浏览器的 API 可供我们使用。通过这张图并配合 [Performance.timing](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/timing) 我们还可以拿到其他的一些指标。比如：

```js
let t = performance.timing;
console.log('DNS 查询耗时 ：' + (t.domainLookupEnd - t.domainLookupStart).toFixed(0));
console.log('TCP 连接耗时 ：' + (t.connectEnd - t.connectStart).toFixed(0));
console.log('request 请求耗时 ：' + (t.responseEnd - t.responseStart).toFixed(0));
console.log('解析 dom 树耗时 ：' + (t.domComplete - t.domInteractive).toFixed(0));
console.log('白屏时间 ：' + (t.responseStart - t.navigationStart).toFixed(0));
console.log('domready 时间 ：' + (t.domContentLoadedEventEnd - t.navigationStart).toFixed(0));
console.log('onload 时间 ：' + (t.loadEventEnd - t.navigationStart).toFixed(0));
if ((t = performance.memory)) {
    console.log('js 内存使用占比 ：' + ((t.usedJSHeapSize / t.totalJSHeapSize) * 100).toFixed(2) + '%');
}
```

[Performance API](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance_API) 提供了获取性能信息的各项 API。比如，可以用 [PerformanceObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceObserver) 来监测性能事件。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body {
        background: gray;
      }
    </style>
  </head>
  <body>
    <div id="app">
      123
      <h1>深圳</h1>
      <script>
        // FMP 没有比较好的库可以获取，因此可以自己用 mark 去定义获取
        performance.mark('shenzhen');
      </script>
    </div>
    <script>
      // for(){
      // }
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(entry.name);
          console.log(entry.startTime);
          console.log(entry.duration);
        }
      });
      observer.observe({ entryTypes: ['paint', 'mark', 'longtask'] });
    </script>
  </body>
</html>
```

## 各种渲染方式优缺点

![performance](../.vuepress/public/assets/image/performance/performance32.png 'performance')