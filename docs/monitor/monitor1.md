## 为什么要做前端监控

- 更快的发现和解决问题。

- 做产品的决策依据。

- 提升前端工程师的技术深度和广度，打造简历亮点。

- 为业务扩展提供更多的可能性。

## 前端监控目标

### 稳定性（stability）

错误名称 | 备注
-|-
JS 错误 | JS 执行错误或 promise 异常
资源异常 | script、link 等资源加载异常
接口错误 | ajax 或 fetch 请求接口异常
白屏 | 页面空白

### 用户体验（experience）

错误名称 | 备注
-|-
加载时间 | 各个阶段的加载时间
TTFB | 浏览器发起第一个请求到数据返回第一个字节消耗的时间，这个时间包含了网络请求时间、后端处理时间
FP | 首次绘制包括了任何用户自定义的背景绘制，它是将第一个像素点绘制到屏幕的时刻
FCP | 首次内容绘制是浏览器将第一个 DOM 渲染到屏幕的时间，可以是任何文本、图像、SVG等的时间
FMP | 首次有意义绘制是页面可用性的度量标准
FID | 用户首次和页面交互到页面响应交互的时间
卡顿 | 超过 50ms 的长任务

### 业务（business）

错误名称 | 备注
-|-
PV | 页面浏览量或点击量
UV | 访问某个站点的不同 IP 地址的人数
页面的停留时间 | 用户在每一个页面的停留时间

## 前端监控流程

- 前端埋点

- 数据上报

- 分析和计算，将采集到的数据进行加工汇总

- 可视化展示，将数据按各种维度进行展示

- 监控报警，发现问题后按一定的条件触发报警

![monitor](../.vuepress/public/assets/image/monitor/monitor1.png 'monitor')

对于前端人员来说，我们最需要关注的是**埋点**和**数据采集**两步。因为后面的步骤已经有一些现成的系统做的很好了，比如阿里云的日志服务系统。

## 常见的埋点方案

### 代码埋点

- 代码埋点就是以嵌入代码的形式进行埋点，比如需要监控用户的点击事件，会选择在用户点击时，插入一段代码，保存这个监听行为或者直接将监听行为以某一种数据格式直接传递给服务器。

- 优点：可以在任意时刻，精确的发送或保存所需要的数据信息。

- 缺点：工作量较大。

### 可视化埋点

- 通过可视化交互的手段，代替代码埋点。

- 将业务代码和埋点代码分离，提供一个可视化交互的页面，输入为业务代码，通过这个可视化系统，可以在业务代码中自定的增加埋点事件等等，最后输出的代码耦合了业务代码和埋点代码。

- 可视化埋点其实是用系统来代替手工插入埋点。

### 无痕埋点

- 前端的任意一个事件都被绑定一个标识，所有的事件都被记录下来。

- 通过定期上传记录文件，配合文件解析，解析出来我们想要的数据，并生成可视化报告供专业人员分析。

- 优点：采集全量数据，不会出现漏埋和误埋等现象。

- 缺点：给数据传输和服务器增加压力，也无法灵活定制数据结构。

## 编写监控采集脚本

### 开通日志服务

- 日志服务（Log Service，简称 SLS）是针对日志类数据一站式服务，用户无需开发就能快捷完成数据采集、消费、投递以及查询分析等功能，帮助提升运维、运营效率，建立 DT 时代海量处理日志能力。

- [日志服务帮助文档](https://help.aliyun.com/document_detail/54604.html)

- 如何使用阿里云日志服务？

（1）创建项目

![monitor](../.vuepress/public/assets/image/monitor/monitor2.png 'monitor')

（2）立即创建logStore用于日志数据存储

![monitor](../.vuepress/public/assets/image/monitor/monitor3.png 'monitor')

（3）创建 Logstore

![monitor](../.vuepress/public/assets/image/monitor/monitor4.png 'monitor')

（4）立即接入数据

![monitor](../.vuepress/public/assets/image/monitor/monitor5.png 'monitor')

（5）搜索 WebTracking，点击进去

![monitor](../.vuepress/public/assets/image/monitor/monitor6.png 'monitor')

![monitor](../.vuepress/public/assets/image/monitor/monitor7.png 'monitor')

（6）点击下一步，然后开启“包含中文”，再点击下一步

![monitor](../.vuepress/public/assets/image/monitor/monitor8.png 'monitor')

（7）这样，项目就创建好了。会提示一分钟内生效

![monitor](../.vuepress/public/assets/image/monitor/monitor9.png 'monitor')

（8）接着，点击“查询日志”模块的“立即尝试”，就可以看到刚刚新建的项目了

![monitor](../.vuepress/public/assets/image/monitor/monitor10.png 'monitor')

（9）接下来就可以往刚刚创建的项目里添加数据了，添加方法可以查看：[PutWebtracking](https://help.aliyun.com/document_detail/120218.html?spm=a2c4g.11186623.6.1164.2fff778fupq1kP)

- 服务入口 [endpoint](https://help.aliyun.com/document_detail/29008.html?spm=a2c4g.11186623.2.15.5500778flpbYwx#reference-wgx-pwq-zdb) 可以在项目概览里查看，公网域名。

![monitor](../.vuepress/public/assets/image/monitor/monitor11.png 'monitor')

### 监控错误

**1. 错误分类**

- JS 错误（监听 [error](https://developer.mozilla.org/zh-CN/docs/Web/Events/error) 事件）

- Promise 错误（监听 [unhandledrejection](https://developer.mozilla.org/zh-CN/docs/Web/Events/unhandledrejection) 事件）

- 资源加载异常错误（监听 [error](https://developer.mozilla.org/zh-CN/docs/Web/Events/error) 事件）

**2. 数据结构设计**

- jsError 设计

```json
{
    "title": "前端监控系统",        // 页面标题    
    "url": "",                    // 页面 url
    "timestamp": "",              // 访问时间戳
    "userAgent": "",              // 用户浏览器类型
    "kind": "stability",          // 大类
    "type": "error",              // 小类
    "errorType": "jsError",       // 错误类型
    "message": "",                // 报错详情
    "filename": "",               // 访问的文件名
    "position": "0:0",            // 行列信息
    "stack": "",                  // 堆栈信息
    "selector": ""                // 选择器，触发错误事件的元素
}
```

- promiseError 设计

```json
{
    "title": "前端监控系统",        // 页面标题    
    "url": "",                    // 页面 url
    "timestamp": "",              // 访问时间戳
    "userAgent": "",              // 用户浏览器类型
    "kind": "stability",          // 大类
    "type": "error",              // 小类
    "errorType": "promiseError",  // 错误类型
    "message": "",                // 报错详情
    "filename": "",               // 访问的文件名
    "position": "0:0",            // 行列信息
    "stack": "",                  // 堆栈信息
    "selector": ""                // 选择器，触发错误事件的元素
}
```

- resourceError 设计

```json
{
    "title": "前端监控SDK",
    "url": "http://localhost:8081/",
    "timestamp": "1597673051686",
    "userAgent": "chrome",
    "kind": "stability",
    "type": "error",
    "errorType": "resourceError",
    "filename": "http://localhost:8081/someError.js",
    "selector": "html body script",
    "tagName": "SCRIPT",
}
```

### 接口异常采集脚本

- [XMLHttpRequest.readyState](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readyState)

- 监听接口的事件有 load、error、abort 三种，只要 readyState 的值为 4，就会进入 load 事件，不论是200还是其他状态码。我们需要自己根据不同的状态码再去加判断是哪种事件。

- axios 请求的原理有两种：如果是在浏览器中，就是 XMLHttpRequest；如果是在 Node.js 中，就是 http。

**数据结构设计**

```json
{
    "title": "前端监控系统",        // 页面标题    
    "url": "",                    // 页面 url
    "timestamp": "",              // 访问时间戳
    "userAgent": "",              // 用户浏览器类型
    "kind": "stability",          // 大类
    "type": "xhr",                // 小类
    "errorType": "load",          // 错误类型
    "pathname": "",               // 接口路径
    "status": "200-OK",           // 状态码
    "duration": "",               // 持续时间
    "response": "",               // 响应内容
    "params": ""                  // 参数
}
```

### 白屏

- 监控白屏的原理就是在页面上选取一些点（如何选择这些点要根据页面具体长什么样来确定，一般可以取页面两条对角线、页面中心横轴和纵轴上的点），选取需要用到 elementsFromPoint 这个 api，然后再统计下选取的这些点中，空白点有多少（判断空白点的方法是看这些点的选择器是不是 html、body 或者自己定义的一些外壳的 id 和类名），将结果与自己预先设置好的值进行对比，如果空白点数量大于设定的值，说明就是白屏。

**数据结构设计**

```json
{
    "title": "前端监控系统",        // 页面标题    
    "url": "",                    // 页面 url
    "timestamp": "",              // 访问时间戳
    "userAgent": "",              // 用户浏览器类型
    "kind": "stability",          // 大类
    "type": "blank",              // 小类
    "emptyPoints": "0",           // 空白点数量
    "screen": "2049x1152",        // 分辨率
    "viewPort": "2048x994",       // 视口
    "selector": ""                // 选择器
}
```

**相关 API**

- [screen](https://developer.mozilla.org/zh-CN/docs/Web/API/Screen) 返回当前 window 的 screen 对象，返回当前渲染窗口中和屏幕相关的属性。

- [innerWidth](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerWidth) 返回以像素为单位的窗口的内部宽度。

- [innerHeight](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerHeight) 返回以像素为单位的窗口的内部高度。

- [layout_viewport](https://developer.mozilla.org/en-US/docs/Glossary/layout_viewport) 布局视口，是浏览器在其中绘制网页的视口。

- [elementsFromPoint](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/elementsFromPoint) 方法可以获取到当前视口内指定坐标处，由里到外排列的所有元素。

### 加载时间

- [Performance Timing](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming)

- [DOMContentLoaded](https://developer.mozilla.org/zh-CN/docs/Web/Events/DOMContentLoaded)

- FMP

![performance](../.vuepress/public/assets/image/performance/performance31.png 'performance')

**各个时间点的含义，总共20个**

字段 | 含义
-|-
navigationStart | 初始化页面，在同一个浏览器上下文中前一个页面 unload 的时间戳，如果没有前一个页面的 unload，则与 fetchStart 相等
redirectStart | 第一个 HTTP 重定向发生的时间，有跳转且是同域的重定向，否则为0
redirectEnd | 最后一个重定向完成时的时间，否则为0
fetchStart | 浏览器准备好使用 HTTP 请求获取文档的时间，这发生在检查缓存之前
domainLookupStart | DNS 域名开始查询的时间，如果有本地缓存或者 keep-alive，则时间为0
domainLookupEnd | DNS 域名结束查询的时间
connectStart | TCP 开始建立连接的时间，如果是持久连接，则与 fetchStart 值相等
secureConnectionStart | HTTPS 连接开始的时间，如果不是安全连接则为0
connectEnd | TCP 完成握手的时间，如果是持久连接，则与 fetchStart 值相等
requestStart | HTTP 请求读取真实文档开始的时间，包括从本地缓存读取
requestEnd | HTTP 请求读取真实文档结束的时间，包括从本地缓存读取
responseStart | 返回浏览器从服务器收到（或从本地缓存读取）第一个字节的 Unix 毫秒时间戳
responseEnd | 返回浏览器从服务器收到（或从本地缓存读取）最后一个字节的 Unix 毫秒时间戳
unloadEventStart | 前一个页面的 unload 时间戳，如果没有则为0
unloadEventEnd | 与 unloadEventStart 相对应，返回的是 unload 函数执行完成时间戳
domLoading | 返回当前网页 DOM 结构开始解析时的时间戳，此时 document.readyState 变成 loading，并将抛出 readyStateChange 事件
domInteractive | 返回当前网页 DOM 结构结束解析、开始加载内嵌资源时的时间戳，此时 document.readyState 变成 Interactive，并将抛出 readyStateChange 事件（注意只是 DOM 树解析完成，这时候并没有开始加载网页内的资源）
domComplete | DOM 树解析完成，且资源也准备就绪的时间，document.readyState 变成 complete，并抛出 readyStateChange 事件
loadEventStart | load 事件发送给文档，也即 load 回调函数开始执行的时间
loadEventEnd | load 回调函数执行完成的时间

**各个时间阶段计算，总共17个**

字段 | 描述 | 计算方式 | 意义
-|-|-|-
unload | 前一个页面卸载耗时 | unloadEventEnd - unloadEventStart | -
redirect | 重定向耗时 | redirectEnd - redirectStart | 重定向的时间
appCache | 缓存耗时 | domainLookupStart - fetchStart | 读取缓存的时间
dns | DNS 解析耗时 | domainLookupEnd - domainLookupStart | 可观察域名解析服务是否正常
tcp | TCP 连接耗时 | connectEnd - connectStart | 建立连接的耗时
ssl | SSL 安全连接耗时 | connectEnd - secureConnectionStart | 反映数据安全连接耗时
ttfb | Time To First Byte（TTFB），网络请求耗时 | responseStart - requestStart | 发出页面请求到接收到应答数据第一个字节所花费的毫秒数
response | 响应数据传输耗时 | responseEnd - responseStart | 观察网络是否正常
dom | DOM 解析耗时 | domInteractive - responseEnd | 观察 DOM 结构是否合理，是否有 JS 阻塞页面解析
dcl | DOMContentLoaded 事件耗时 | domContentLoadedEventEnd - domContentLoadedEventStart | 当 HTML 文档被完全加载和解析完成后，DOMContentLoaded 事件触发，等待样式表、图像和子框架的完成加载
resources | 资源加载耗时 | domComplete - domContentLoadedEventEnd | 可观察文档流是否过大
domReady | DOM 阶段渲染耗时 | domContentLoadedEventEnd - fetchStart | DOM 树和页面资源加载完成时间，会触发 domContentLoaded 事件
首次渲染耗时 | 首次渲染耗时 | responseEnd - fetchStart | 加载文档看到第一帧非空图像的时间，也叫白屏时间
首次可交互时间 | 首次可交互时间 | domInteractive - fetchStart | DOM 树解析完成的时间，此时 document.readyState 为 interactive
首包时间耗时 | 首包时间 | responseStart - domainLookupStart | DNS 解析到响应返回给浏览器第一个字节的时间
页面完全加载时间 | 页面完全加载时间 | loadEventStart - fetchStart | -
onLoad | onLoad 事件耗时 | loadEventEnd - loadEventStart | -

### 性能指标

- [PerformanceObserver.observe()](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceObserver/observe)

- [PerformanceEntry.entryType](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry/entryType)

- [paint-timing](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformancePaintTiming)，[w3c/paint-timing](https://w3c.github.io/paint-timing/)

- [event-timing](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming)，[w3c/event-timing](https://w3c.github.io/event-timing/)

- [LCP](https://developer.mozilla.org/en-US/docs/Web/API/LargestContentfulPaint)，[w3c/largest-contentful-paint](https://w3c.github.io/largest-contentful-paint/)

- [FMP](https://web.dev/first-meaningful-paint/)

- [time-to-interactive](https://web.dev/interactive/)，[WICG/time-to-interactive](https://github.com/WICG/time-to-interactive)

- 判断一个元素有意义的方法就是给元素加上 `elementtiming` 属性，属性名是规定的，值可以自己定，浏览器会自动根据这个属性去识别哪个元素有意义。

- 最大内容绘制是由浏览器自动绘制的。

- 性能监控的标准可以找阿里的核心产品对比下，比如淘宝。

字段 | 描述 | 含义
-|-|-
FP | First Paint（首次绘制） | 包括了任何用户自定义的背景绘制，它是首先将像素绘制到屏幕的时刻
FCP | First Content Paint（首次内容绘制） | 是浏览器将第一个 DOM 渲染到屏幕的时间，可能是文本、图像、SVG 等，其实就是白屏时间
FMP | First Meaningful Paint（首次有意义绘制） | 页面有意义的内容渲染的时间
LCP | Largest Contentful Paint（最大内容渲染） | 代表在 viewport 中最大的页面元素加载的时间
DCL | DomContentLoaded（DOM 加载完成） | 当 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，无需等待样式表、图像和子框架的完成加载
L | onLoad | 当依赖的资源全部加载完毕之后才会触发
TTI | Time To Interactive（可交互时间） | 用于标记应用已进行视觉渲染并能可靠响应用户输入的时间点
FID | First Input Delay（首次输入延迟） | 用户首次和页面交互（单击链接，点击按钮等）到页面响应交互的时间


### 卡顿

### PV

- netinfo

- RTT（Round Trip Time）一个连接的往返时间，即发送数据时刻到接收到数据时刻的差值。

- [navigator.sendBeacon()](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon) 方法可用于通过 HTTP 将少量数据异步传输到 Web 服务器。

### UV

### 页面停留时间

## 如何可视化展示

- 如何写各种各样的查询条件，做出最实用的报表

- 设备占比

- 浏览器占比

- PV UV 停留时间

- PV 增长情况

- SLS

## 实现报警

- 设置各种各样的条件触发邮件、短信报警

## 现代主流的开源产品

- [sentry](https://sentry.io/welcome/)，搭配 vue、react 一起使用

- [lighthouse](https://github.com/GoogleChrome/lighthouse)

- 商业产品 —— [神策](https://www.sensorsdata.cn/?utm_source=baidusem&utm_medium=cpc&utm_term=%E7%A5%9E%E7%AD%96&utm_content=%E5%93%81%E7%89%8C%5F%E5%93%81%E7%89%8C%5F%E7%A5%9E%E7%AD%96&utm_campaign=%E5%93%81%E7%89%8C%E7%B2%BE%E7%A1%AE%5FS&account=exact)