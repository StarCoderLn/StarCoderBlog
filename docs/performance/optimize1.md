:bell: **一个小字走天下，一个监控啥也不怕！**

## 性能优化白皮书

1. [CDNetworks](https://www.cdnetworks.com/web-performance/)

2. 为什么要做性能优化？

- 57%的用户更在乎网⻚在3秒内是否完成加载。

- 52%的在线用户认为网⻚打开速度影响到他们对网站的忠实度。

- 每慢1秒造成⻚面 PV 降低11%，用户满意度也随之降低降低16%。

- 近半数移动用户因为在10秒内仍未打开⻚面从而放弃。

## 雅虎军规

![performance](../.vuepress/public/assets/image/performance/performance1.png 'performance')

[雅虎军规35条规则](https://translate.googleusercontent.com/translate_c?depth=1&hl=en&ie=UTF8&prev=_t&rurl=translate.google.com&sl=auto&sp=nmt4&tl=zh-CN&u=https://developer.yahoo.com/performance/rules.html&xid=25657,15700022,15700124,15700149,15700168,15700186,15700190,15700201,15700205&usg=ALkJrhhrz62Z7XRZCEdAz4dhkH8-sid_iA#cookie_free)

- Make Fewer HTTP Requests（减少 HTTP 请求）

- Use a Content Delivery Network(CDN)（使用内容分发网络 CDN）

- Add Expires or Cache-Control Header（添加过期或缓存控制标头）

- Gzip Components（Gzip 组件）

- Put Stylesheets at Top（将样式表放在顶部）

- Put Scripts at Bottom（将脚本放在底部）

- Avoid CSS Expressions（避免使用 CSS 表达式）

- Make JavaScript and CSS External（将 JavaScript 和 CSS 设为外部）

- Reduce DNS Lookups（减少 DNS 查找）

- Minify JavaScript and CSS（缩小 JavaScript 和 CSS）

- Avoid Redirects（避免重定向）

- Remove Duplicate Scripts（删除重复的脚本）

- Configure ETags（配置 ETags）

- Make Ajax Cacheable（使 Ajax 可缓存）

- Flush Buffer Early（尽早冲洗缓冲液）

- Use GET for Ajax Requests（使用 GET 处理 Ajax 请求）

- Postload Components（延迟加载组件）

- Preload Components（预加载组件）

- Reduce the Number of DOM Elements（减少 DOM 元素的数量）

- Split Components Across Domains（跨域拆分组件）

- Minimize Number of iframes（尽量减少 iframes 的数量）

- Avoid 404s（避免404）

- Reduce Cookie Size（减小Cookie大小）

- Use Cookie-Free Domains for Components（对组件使用无 Cookie 的域）

- Minimize DOM Access（最小化 DOM 访问）

- Develop Smart Event Handlers（开发智能事件处理程序）

- Choose Over @import（在@import上选择`<link>`）

- Avoid Filters（避免使用过滤器）

- Optimize Images（优化图像）

- Optimize CSS Sprites（优化 CSS 精灵）

- Do Not Scale Images in HTML（不要缩放 HTML 中的图像）

- Make favicon.ico Small and Cacheable（使 favicon.ico 小型且可缓存）

- Keep Components Under 25 KB（组件保持在 25K 以下）

- Pack Components Into a Multipart Document（将组件打包成多部分文档）

- Avoid Empty Image src（避免空图片源）

::: warning 注意
如果把一个大文件压缩拆成几个小文件，文件的大小虽然变小了，但是文件数量变多了，HTTP 请求数也就变多了；如果把几个小文件合成一个大文件，文件的数量虽然减少了，但是文件大小变大了。因此，在文件压缩与合并之间有一个分界线，这是需要我们进行权衡的。按照以往的经验，权衡方式如下：

- 如果文件大小达到了 30K 左右，那么这个文件就应该进行拆分了。

- HTTP 请求数一般最多是 5-6 个。
:::

## 缓存策略

1. HTTP 缓存

从左到右，4种缓存策略的优先级逐渐降低。前两者属于**强制缓存**，后两者属于**协商缓存**。

![performance](../.vuepress/public/assets/image/performance/performance2.png 'performance')

- **cache-control**

设置过期的时间长度（秒），在这个时间范围内，浏览器请求都会直接读缓存。当 expires 和 cache-control 都存在时，cache-control 的优先级更高。

- **expires**

在 http 头中设置一个过期时间，在这个过期时间之前，浏览器的请求都不会发出，而是自动从缓存中读取文件，除非缓存被清空，或者强制刷新。缺陷在于，服务器时间和客户端时间可能存在不一致，所以 HTTP/1.1 加入了 cache-control 来改进这个问题。

- **etag / if-if-none-match**

这是一组请求/相应头 

响应头: etag: "D5FC8B85A045FF720547BC36FC872550"，请求头: if-none-match: "D5FC8B85A045FF720547BC36FC872550"。

服务器端返回资源时，如果头部带上了 etag，那么下次请求资源时就会把值加入到请求头 if-none-match 中，服务器可以对比这个值，确定资源是否发生变化，如果没有发生变化，则返回 304。

- **last-modified / if-modified-since**

这也是一组请求/相应头

响应头: last-modified: Wed, 16 May 2018 02:57:16 GMT 01，请求头: if-modified-since: Wed, 16 May 2018 05:55:38 GMT。

服务器端返回资源时，如果头部带上了 last-modified，那么 资源下次请求时就会把值加入到请求头 if-modified-since 中，服务器可以对比这个值，确定资源是否发生变化，如果没有发生变化，则返回 304。

http 缓存具体的执行过程如下。

![performance](../.vuepress/public/assets/image/performance/performance3.png 'performance')

2. 本地缓存

除了 http 缓存之外，还有一种缓存叫**本地缓存（也叫离线缓存）**，比如 **localStorage**。

:lock: **为什么 http 缓存已经很健全了，还需要有本地缓存呢？**

其实 http 缓存主要是一些库使用，比如 jQuery，可以手动开启 http 缓存，对版本要求不是很严格。而本地缓存主要是用来缓存业务代码的，一方面是因为业务代码变化比较快，用 http 缓存没多大意义；另一方面是因为 http 缓存有可能由于不同的浏览器而失败，如果用来缓存业务代码，可能会造成一些额外的麻烦。

本地缓存主要有以下5种。

![performance](../.vuepress/public/assets/image/performance/performance4.png 'performance')

- localStorage 优先级最高，有 5M 的存储空间，并且它是**同步读取**的，**存在硬盘上**。

- IndexDB 和 WebSQL 的存储空间就很大，理论上无限（一般来说不会小于 250M），这两者是**异步读取**的，**存在硬盘上**。

关于本地缓存的具体区别可以看这篇文章：[浏览器存储](https://github.com/ljianshu/Blog/issues/25)

## HTTP/2.0 多路复用

1. HTTP/1.1 的请求过程如下：

- 浏览器请求某个网站 -> 解析域名 -> HTTP 连接 -> 服务器处理文件 -> 返回数据 -> 浏览器解析、渲染文件。

2. Keep-Alive 解决的核心问题是，一定时间内，同一域名多次请求数据，只建立一次 HTTP 请求，其他请求可复用每一次建立的连接通道，以达到提高请求效率的问题。

3. 一定时间是可以配置的，但是 HTTP/1.1 还是存在效率问题，第一个:串行的文件传输。第二个:连接数过多。

4. HTTP/2.0 对同一域名下所有请求都是**基于流**，也就是说**同一域名不管访问多少文件，也只建立一路连接**。同样 Apache 的最大连接数为300，因为有了这个新特性，最大的并发就可以提升到300，比原来提升了60倍!

## 网络机型

用户的网络机型可以使用 `navigator` 对象查看。不过，这个对象的信息有的时候可能没那么准确。

![performance](../.vuepress/public/assets/image/performance/performance5.png 'performance')

## DNS 详解

:pushpin: **1. 什么是 DNS？**

- DNS 是 Domain Name System，域名系统，用于将域名转换为 IP。

:pushpin: **2. 域名结构解析**

以 www.baidu.com 为例

- com 是根域名。

- baidu.com 是**一级域名**，也叫**顶级域名**。

- www.baidu.com 是**二级域名**，因为只要在 baidu.com 前面加个 . ，它就是二级域名。

- www.baidu.com 前面再加一个 . 的话，就是**三级域名**了。

::: tip 快速记忆
有几个 . ，就是几级域名。
:::

:pushpin: **3. 域名资源记录**

一个域名对应一个 IP，这种对应关系就叫记录。其中这个域名就叫域名资源。

记录类型 | 含义
-|-
SOA:(StartOf Authority, 起始授权记录) | 一个区域解析库有且只能有一个SOA记录，而且必须放在第一条
A记录(主机记录) | 用于名称解析的重要记录，将特定的主机名映射到对应主机的IP地址上
CNAME记录(别名记录) | 用于返回另⼀个域名，即当前查询的域名是另⼀个域名的跳转，主要用于域名的内部跳转，为服务器配置提供灵活性
NS记录(域名服务器记录) | 用于返回保存下一级域名信息的服务器地址。该记录只能设置为域名，不能设置为IP地址
MX(邮件记录) | ⽤于返回接收电子邮件的服务器地址
IPv6主机记录(AAAA记录) | 与A记录对应，⽤于将特定的主机名映射到⼀个主机的IPv6地址

::: tip 说明
1. A记录对应的 IP 地址是 IPv4。

2. 假设 www.abc.com 指向了某一个 IP 地址，此时有另一个域名 www.123.com 也想要指向这个 IP 地址，我们就可以给 www.123.com 配一个 CNAME 记录，让它指向 www.abc.com，其实就是做一个 www.123.com 向 www.abc.com 的跳转。这样不但 www.123.com 能够指向同一个 IP 地址，而且后面 IP 地址改变的时候，只需要改 www.abc.com 的 A记录就行了，www.123.com 也会跟着改变，很方便。

3. 邮件发送协议是 SMTP，邮件接收协议是 POP3。
:::

:pushpin: **4. 域名服务器**

做域名解析的服务器就叫域名服务器。

:pushpin: **5. 域名解析**

- 将域名解析成 IP 地址的过程。

- 解析后的 IP 地址仍然是一个文本，不论是 IPv4 还是 IPv6。实际上转换后的文本是给人看的，因为计算机不认识文本，所以在计算机里，IP 地址是一个整型数据，占4个字节，要用4个基本单位存储。一个字节所能表示的数字范围是0～255，这就是为什么 IP 每一块最大只能是255的原因。

::: tip 补充
[IPv4 和 IPv6 的区别](https://www.ibm.com/support/knowledgecenter/zh/ssw_ibm_i_72/rzai2/rzai2compipv4ipv6.htm)
:::

:pushpin: **6. DNS 解析的过程**

![dns](../.vuepress/public/assets/image/performance/dns1.png 'dns')

当访问 www.example.com 时，解析过程如下：

（1）检查浏览器缓存。

（2）检查操作系统缓存，常见的如 hosts 文件。

（3）检查路由器缓存。

（4）如果前几步都没找到，会向 ISP（网络服务提供商）的 LDNS 服务器查询。

（5）如果 LDNS 服务器没找到，会想根域名服务器（Root Server）请求解析。如下：

- 根域名服务器返回顶级域名（TLD）服务器如 .com、.cn、.org 等的地址，全球只有13台，此处会返回 .com 的地址。

- 接着向 TLD 发送请求，然后会返回次级域名（SLD）服务器的地址，此处会返回 .example 的地址。

- 接着向 SLD 域名服务器通过域名查询目标 IP，此处会返回 www.example.com 的地址。

- Local DNS Server 会缓存结果，并返回给用户，缓存在系统中。

## CDN 详解

:pushpin: **1. 什么是 CDN？**

CDN 的全称是 Content Delivery Network，即**内容分发网络**，它能够实时地根据网络流量和各节点的连接、负载状况以及到用户的距离和响应时间等综合信息将用户的请求重新导向离用户最近的服务节点上。其目的是使用户可就近取得所需内容，解决 Internet 网络拥挤的状况，提高用户访问网站的响应速度。

![cdn](../.vuepress/public/assets/image/performance/cdn1.png 'cdn')

:pushpin: **2. CDN 系统的组成**

- 分发服务系统

最基本的工作单元就是 Cache 设备，cache（边缘 cache）负责直接响应最终用户的访问请求，把缓存在本地的内容快速地提供给用户。同时 cache 还负责与源站点进行内容同步，把更新的内容以及本地没有的内容从源站点获取并保存在本地。Cache 设备的数量、规模、总服务能力是衡量一个CDN系统服务能力的最基本的指标。

- 负载均衡系统

主要功能是负责对所有发起服务请求的用户进行访问调度，确定提供给用户的最终实际访问地址。两级调度体系分为全局负载均衡（GSLB）和本地负载均衡（SLB）。GSLB 主要根据用户就近性原则，通过对每个服务节点进行“最优”判断，确定向用户提供服务的 cache 的物理位置。SLB 主要负责节点内部的设备负载均衡。

- 运营管理系统

分为运营管理和网络管理子系统，负责处理业务层面的与外界系统交互所必须的收集、整理、交付工作，包含客户管理、产品管理、计费管理、统计分析等功能。

:pushpin: **3. CDN 的过程**

- 使用 CDN 的方法很简单，只要修改自己的 DNS 解析，设置一个 CNAME 指向 CDN 服务商即可。

- 用户使用 CDN 后访问获取资源的过程如下。

（1）当用户点击网站页面上的内容 URL，经过本地 DNS 系统解析，DNS 系统最终会将域名的解析权交给 CNAME 指向的 CDN 专用 DNS 服务器。

（2）CDN 的 DNS 服务器将 CDN 的全局负载均衡设备 IP 地址返回给用户。

（3）用户向 CDN 的全局负载均衡设备发起内容 URL 访问请求。

（4）CDN 全局负载均衡设备根据用户 IP 地址，以及用户请求的内容 URL，选择一台用户所属区域的区域负载均衡设备，告诉用户向这台设备发起请求。

（5）区域负载均衡设备会为用户选择一台合适的缓存服务器提供服务，选择的依据包括：

    根据用户 IP 地址，判断哪一台服务器距离用户最近；

    根据用户所请求的 URL 中携带的内容名称，判断哪一台服务器上有用户所需内容；

    查询各个服务器当前的负载情况，判断哪台服务器尚有服务能力。

基于以上这些综合条件分析后，区域负载均衡设备会向全局负载均衡设备返回一台缓存服务器的 IP 地址。

（6）全局负载均衡设备把缓存服务器的 IP 地址返回给用户。

（7）用户向缓存服务器发起请求，缓存服务器响应用户请求，将用户所需内容传送到用户终端。如果这台缓存服务器上并没有用户想要的内容，而区域均衡设备依然把它分配给了用户，那么这台服务器就要向它的上一层缓存服务器请求内容，直至追溯到网站的源服务器将内容拉到本地。

总结起来就是，用户访问的资源原本是存放在你自己的服务器，通过修改 DNS 让用户根据 IP 等情况来选择合适的 CDN 缓存服务器来获取资源。

:pushpin: **4. CDN 的优点**

- 本地 Cache 加速，加快访问速度

- 镜像服务，消除运营商之间互联的瓶颈影响，保证不同网络的用户都能得到良好的访问质量

- 远程加速，自动选择 cache 服务器

- 带宽优化，分担网络流量，减轻压力

- 集群抗攻击

- 节约成本
