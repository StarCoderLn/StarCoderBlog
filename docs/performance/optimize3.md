## 内存泄漏

:pushpin: **1. 什么是内存泄漏？**

- 程序的运行需要内存。只要程序提出要求，操作系统或者运行时（runtime）就必须供给内存。

- 对于持续运行的服务进程（daemon），必须及时释放不再用到的内存。否则，内存占用越来越高，轻则影响系统性能，重则导致进程崩溃。

- **不再用到的内存，没有及时释放，就叫做内存泄漏（memory leak）**。

- 有些语言（比如 C 语言）必须手动释放内存，程序员负责内存管理。

:pushpin: **2. 内存泄漏的具体表现**

- 比较平稳，没有内存泄漏

![performance](../.vuepress/public/assets/image/performance/performance16.png 'performance')

- 逐步上升，说明有内存泄漏

![performance](../.vuepress/public/assets/image/performance/performance17.png 'performance')

:pushpin: **3. 浏览器中如何查看内存泄漏？**

在[基础测试 E](../javascript/jsTest.md#基础测试-e) 第三题中已经有提到过方法。

## 压力测试

:pushpin: **1. PV 和 UV**

- PV 是指**页面访问人次**，UV 是指**页面访问人数**。

- PV 每天几十万甚至上百万就需要考虑压力测试。换算公式是：`QPS = PV / t`，比如服务器在10个小时内处理了100万个请求，那么它的 QPS 就是 1000000 / 10 * 60 * 60 = 27.7，每秒处理27.7个请求。

- QPS（Queries Per Second）的意思是**每秒查询率**，是**对一个特定的查询，服务器在规定时间内所处理流量多少的衡量标准**。`QPS = 并发量 / 平均响应时间`

- TPS（Transactions Per Second）的意思是**事务数/秒**，它是软件测试结果的测量单位。一个事务是指一个客户机向服务器发送请求然后服务器做出反应的过程。客户机在发送请求时开始计时，收到服务器响应后结束计时，以此来计算使用的时间和完成的事务个数。

:pushpin: **2. WRK**

- [wrk](https://github.com/wg/wrk) 是一款简单的 HTTP 压测工具。

- [wrk 使用教程](https://www.cnblogs.com/quanxiaoha/p/10661650.html)

- wrk 的子命令参数的含义

  子命令 | 含义
  -|-
  -c, --connections | 跟服务器建立并保持的 TCP 连接数量
  -d, --duration | 压测时间
  -t, --threads | 使用多少个线程进行压测
  -s, --script | 指定 Lua 脚本路径
  -H, --header | 为每一个 HTTP 请求添加 HTTP 头
  --latency | 在压测结束后，打印延迟统计信息
  --timeout | 超时时间
  -v, --version | 版本号信息

- wrk 生成的报告中的字段含义

  字段名 | 含义
  -|-
  Avg（平均值） | 每次测试的平均值
  Stdev（标准差） | 结果的离散程度，越大说明越不稳定
  Max（最大值） | 最大的一次结果
  +/- Stdev（正负一个标准差占比） | 结果的离散程度，越大说明越不稳定
  Latency（延迟） | 可以理解为响应时间
  Req / Sec（每秒请求数） | 每个线程每秒完成的请求数

- 一般来说，模拟的线程数不宜太多，设置成压测机器 CPU 核心数的 2 倍到 4 倍就够了。我们主要关注平均值和最大值。标准差如果太大说明样本本身离散程度比较高，有可能系统性能波动很大。

:pushpin: **3. Apache JMeter**

- [Apache JMeter](https://github.com/apache/jmeter) 是纯 Java 编写的应用程序，主要用来做功能测试和性能测试（压力测试/负载测试）。

:pushpin: **4. Node.js 内存信息**

- 一个运行的程序通常是通过在内存中分配一部分空间来表示的。这部分空间被称为**驻留集（Resident Set）**。V8 的内存管理模式有点类似于 [Java 虚拟机（JVM）](https://zhuanlan.zhihu.com/p/34426768)，它会将内存进行分段。

![performance](../.vuepress/public/assets/image/performance/performance18.png 'performance')

- [process.memoryUsage()](http://nodejs.cn/api/process/process_memoryusage.html) 会返回一个对象，包含了 Node.js 进程的内存占用信息。该对象包含四个字段，单位是字节。

  字段 | 含义
  -|-
  rss(resident set size) | 所有内存占用，包括指令区和堆栈
  heapTotal | “堆”占用的内存，包括用到的和没用到的
  heapUsed | 用到的堆的部分
  external | V8 引擎内部的 C++ 对象占用的内存

**判断内存泄漏，以 heapUsed 字段为准。**

:pushpin: **5. 查找 Node.js 内存泄漏的工具**

- [node-mtrace](https://github.com/Jimbly/node-mtrace)，它使用了 GCC 的 mtrace 工具来分析堆的使用。

- [node-heap-dump](https://github.com/davepacheco/node-heap-dump)，它对 V8 的堆抓取了一张快照并把所有的东西序列化成一个巨大的 JSON 文件，还包含了一些分析研究快照结果的 JavaScript 工具。

- [v8-profiler](https://github.com/node-inspector/v8-profiler) 和 [node-inspector](https://github.com/node-inspector/node-inspector)，提供了绑定在 Node.js 中的 V8 分析器和一个基于 WebKit Web Inspector 的 debug 界面。

- [Node.js 内存泄漏指导（Node Memory Leak Tutorial）](https://github.com/felixge/node-memory-leak-tutorial)，这是一个又短又酷的 v8-profiler 和 node-debugger 使用教程，同时也是目前最先进的 Node.js 内存泄漏调试技术指南。

- Joyent 的 [SmartOS](https://www.joyent.com/smartos) 平台，它提供了大量用于调试 Node.js 内存泄漏的工具。

- [memwatch](https://www.npmjs.com/package/memwatch) + [heapdump](https://www.npmjs.com/package/heapdump)。

  这两者适用于大型业务，因为只有在 CPU 压力达到一定比率时，才会跳出来 memwatch leak，而且近似随即。heapdump 文件随着时间增加，文件容量不断扩大。

  ```js
  // 一个“泄漏”事件发射器
  // 如果经过连续五次 GC，内存仍被持续分配而没有得到释放
  memwatch.on('leak', function(info) {
    var file = './tmp.heapsnapshot';
    heapdump.writeSnapshot(file, function(err) {
      if (err) {
        console.error(err);
      } else {
        console.error('Wrote snapshot：', file);
      }
    })
  })
  ```

  ```js
  // 通过 diff 的方式查找真正的元凶
  var hd = new memwatch.HeapDiff();
  // your code here
  var diff = hd.end();
  ```

  ```js
  // 一个“状态”事件发射器
  memwatch.on('stats', function(stats) {
    usage_trend       // 使用趋势
    current_base      // 当前基数
    estimated_base    // 预期基数
    num_full_gc       // 完整的垃圾回收次数
    num_inc_gc        // 增长的垃圾回收次数
    heap_compactions  // 内存压缩次数
    min               // 最小
    max               // 最大
  })
  ```

- [memeye](https://www.npmjs.com/package/memeye) 是轻量级的 NodeJS 进程监视工具，可提供进程内存、V8 堆空间内存和操作系统内存的数据可视化。这个工具挺好用的，适用于常规业务和日常学习。

- [Clinic.js](https://clinicjs.org/) 是目前最好用、最专业的 Node.js 性能监测工具。如果想深入研究或者公司有项目对 Node.js 涉及比较深的，可以尝试使用。

## 编码规范

- 函数内的变量是可以随着函数执行被回收的，但是全局不行。如果是在业务需求里应避免使用对象作为缓存，可使用 Redis 等专门处理缓存的技术。

  ```js
  // demo.js
  const http = require('http');
  const memeye = require('memeye');
  memeye();
  let leakArray = [];
  const server = http.createServer((req, res) => {
    if (req.url == '/') {
      leakArray.push(Math.random());
      console.log(leakArray);
      res.end('hello world');
    }
  })
  ```

  执行 `node demo`，通过 memeye 这个工具我们可以在浏览器中看到关于内存使用的一些情况。

  ![performance](../.vuepress/public/assets/image/performance/performance19.png 'performance')

  解决方法就是可以使用弱引用 WeakMap 来解决。

  ```js
  // demo.js
  const http = require('http');
  const memeye = require('memeye');
  memeye();
  let leakArray = [];
  const server = http.createServer((req, res) => {
    if (req.url == '/') {
      const wm = new WeakMap();
      leakArray.push(Math.random());
      wm.set(leakArray, leakArray);
      console.log(wm.get(leakArray));
      leakArray = null;
      res.end('hello world');
    }
  })
  ```

  相似例子

  ```js
  // demo.js
  global.gc();
  console.log('第一次', process.memoryUsage()); // 返回当前 Node.js 使用情况

  let map = new Map();
  let key = new Array(5 * 1024 * 1024);
  map.set(key, 1);
  global.gc();
  console.log('第二次', process.memoryUsage());
  ```

  执行命令 `node --expose-gc demo`，可以看到输出了以下结果。

  第二次的 heapUsed 值明显比第一次的大了很多。说明发生了内存泄漏。

  ![performance](../.vuepress/public/assets/image/performance/performance20.png 'performance')

  如何解决这个问题呢？

  :bell: **直接将 key 置为 null**

  ```js
  // demo.js
  global.gc();
  console.log('第一次', process.memoryUsage()); // 返回当前 Node.js 使用情况

  let map = new Map();
  let key = new Array(5 * 1024 * 1024);
  map.set(key, 1);
  global.gc();
  console.log('第二次', process.memoryUsage());

  key = null; // 直接将 key 置为 null 是没用的
  console.log('第三次', process.memoryUsage());
  ```

  可以看到，就算我们把 key 置为空，使用的堆内存还是那么多，并没有减少，说明这种方法不可行。

  ![performance](../.vuepress/public/assets/image/performance/performance21.png 'performance')

  :bell: **先将 map 和 key 之间的关系清掉，再把 key 置为 null**

  ```js
  // demo.js
  global.gc();
  console.log('第一次', process.memoryUsage()); // 返回当前 Node.js 使用情况

  let map = new Map();
  let key = new Array(5 * 1024 * 1024);
  map.set(key, 1);
  global.gc();
  console.log('第二次', process.memoryUsage());

  map.delete(key); // 要先将 map 和 key 的关系清掉，再把 key 置为 null，才有效
  key = null;
  global.gc();
  console.log('第三次', process.memoryUsage());
  ```

  可以看到，这种方法是可行的。第三次的时候堆内存的减少了，不过并没有回到最开始的值，这是因为代码也会占用部分内存。不过，这种方法有点麻烦，还有更简便的解决方法。

  ![performance](../.vuepress/public/assets/image/performance/performance22.png 'performance')

  :bell: **使用弱引用 WeakMap 解决**

  ```js
  // demo.js
  global.gc();
  console.log('第一次', process.memoryUsage()); // 返回当前 Node.js 使用情况

  const wm = new WeakMap();
  let key = new Array(5 * 1024 * 1024);
  wm.set(key, 1);
  key = null; // 用弱引用 WeakMap 的话，直接将 key 置为 null 就可以了
  global.gc();
  console.log('第二次', process.memoryUsage());
  ```

  可以看到，这种方法也是完全可行的。

  ![performance](../.vuepress/public/assets/image/performance/performance23.png 'performance')


- 消费队列不及时

  这也是一个不经意间产生的内存泄漏。队列一般在消费者-生产者模型中充当中间人的角色，当消费大于生产时没问题，但是当生产大于消费时，会产生堆积，就容易发生内存泄漏。

  比如收集日志，如果日志产生的速度大于文件写入的速度，就容易产生内存泄漏（Jmeter 接收到全部返回后，服务器 log4js 日志还在不停写），表层的解决方法是换用消费速度更高的技术，但是这不治本。根本的解决方案应该是**监控队列的长度一旦堆积就报警或拒绝新的请求**，还有一种是**所有的异步调用都有超时回调，一旦达到时间调用未得到结果就报警**。

- 闭包

  闭包一定会造成内存泄漏，但是闭包并不可怕，可怕的是在闭包里引用了一个大对象。所以我们在写闭包的时候，**不要传整个大的对象，而是需要哪个属性就传那个属性就行了**，这是写闭包时的一个小技巧。比如：

  ```js
  function foo() {
    var temp_object = {
      x: 1,
      y: 2,
      array: new Array(200000)
    }
    let closure = temp_object.x;
    return function() {
      console.log(closure);
    }
  }
  ```

  解决闭包造成的内存泄漏其实很简单，除了上面说的，还可以**将对象置为 null** 或者**使用 WeakMap** 来解决。

- 频繁的垃圾回收让 GC 无机会工作

  ![performance](../.vuepress/public/assets/image/performance/performance24.png 'performance')

  ![performance](../.vuepress/public/assets/image/performance/performance25.png 'performance')

- perf_hooks（性能钩子）

  [perf_hooks](http://nodejs.cn/api/perf_hooks.html#perf_hooks_performance_measurement_apis) 是 Node.js 的性能监控 API，可以通过调用 mark() 和 measure() API，监控 Node.js 事件执行时间。

  ```js
  // 及时统计代码运行 AB 比较
  // 避免代码执行逻辑过于复杂，无 GC 机会
  const { performance } = require('perf_hooks');
  performance.mark('A');
  setTimeout(() => {
    performance.mark('B');
    performance.measure('A to B', 'A', 'B');
    const entry = performance.getEntriesByName('A to B', 'measure');
    console.log(entry.duration);
  }, 10000);
  ```