## HTTP 的请求模型

HTTP 的请求模型很简单，但是其中的实现却有许多具体细节。

![http](../.vuepress/public/assets/image/http/http1.png 'http')

## 浏览器请求资源的处理流程

1. 输入网址并回车

2. 解析域名

3. 浏览器发送 HTTP 请求

4. 服务器处理请求

5. 服务器返回 HTML 响应

6. 浏览器处理 HTML 页面

7. 继续请求其他资源

![http](../.vuepress/public/assets/image/http/http2.png 'http')

## 什么是 HTTP 协议

1. HTTP 是**超文本传输协议**，从 www 浏览器传输到本地浏览器的一种传输协议，网站是基于 HTTP 协议的，例如网站的图片、CSS、JS 等都是基于 HTTP 协议进行传输的。

2. HTTP 协议是对由从客户机到服务器的请求(Request)和从服务器到客户机的响应(response)进行**约束**和**规范**。

![http](../.vuepress/public/assets/image/http/http3.png 'http')

- HTTP/1.0 的出现意味着 HTTP 协议成熟了，HTTP/1.1 的出现意味着 HTTP/1 协议已经很完善了。

- 在 HTTP/2 之后还有 HTTP/3，HTTP/3 相对于前两者来说是一种全新的协议，它把底层的协议给换了。前两者底层的协议是 TCP，而 HTTP/3 把底层协议换成了 UDP 协议。

3. HTTP 协议的官方文档非常的晦涩难懂，而且枯燥。如果想学习协议的话，可以去看 [中文 RFC 文档](http://www.cnpaf.net/class/RFC/)，[HTTP 协议](http://www.cnpaf.net/Class/HTTP/)。

## TCP/IP 协议栈

:pushpin: **1. OSI 七层模型（ISO 协议），从上到下分别如下。**

- 应用层

- 表示层

- 会话层

- 传输层

- 网络层

- 数据链路层

- 物理层

:pushpin: **2. TCP/IP 四层模型，从上到下分别如下。**

- 应用层

- 传输层

- 网络层

- 网络接口层

**也有的是把 TCP/IP 分成了五层模型，其实是差不多的。**

- 应用层

- 传输层

- 网络层

- 数据链路层

- 物理层

:pushpin: **3. TCP/IP 四层模型每层的作用。**

- 应用层

  为用户提供所需要的各种服务，例如：**HTTP**、**FTP**、**DNS**、**SMTP**、**SSH**、**TELNET**、**POP3** 等。

- 传输层

  为应用层实体提供端到端的通信功能，保证数据包的顺序传送及数据的完整性。

  该层定义了两个主要的协议：**传输控制协议(TCP)**和**用户数据报协议(UDP)**。

  **TCP 是面向连接的协议，UDP 是无连接的协议。**

- 网络层

  主要解决主机到主机的通信问题。**IP 协议是网际互联层最重要的协议**。

  当我们去 ping 一个网址的时候，用到的协议是 **ICMP 协议**，这个协议也在网络层中。

  该层也叫做 **IP 层**。

- 网络接口层

  负责监视数据在主机和网络之间的交换。

发送数据的时候是一层一层往下传的，接收数据的时候是一层一层往上传的。

:pushpin: **4. HTTP 和 HTTPS 在 TCP/IP 协议栈中的位置**

![http](../.vuepress/public/assets/image/http/http4.png 'http')

- 目前普遍应用的版本是 HTTP/1.1，正在逐步向 HTTP/2.0 迁移。

- HTTP 的默认端口是`80`，HTTPS 的默认端口是`443`。

- HTTP/1.1 和 HTTP/1.0 之间的区别就是，新增了 **Keep-Alive**（长连接）特性。

## TCP 协议数据传输过程

![http](../.vuepress/public/assets/image/http/http15.png 'http')

TCP 这一层对数据的封装如下。TCP 传输数据时，**是把一个大数据包切成若干个小数据包进行发送的，这些小数据包根据 Sequence Number 进行排序，等到了接收方那里再根据各自的 Sequence Number 重新组装起来**，这样的话能提高传输效率。

![http](../.vuepress/public/assets/image/http/http17.png 'http')

## TCP 协议模型详解

OSI 中的层 | 功能 | TCP/IP 协议族
-|-|-
应用层 | 文件传输，电子邮件，文件服务，虚拟终端 | TFTP，HTTP，SNMP，FTP，SMTP，DNS，TELNET
表示层 | 数据格式化，代码转换，数据加密 | 没有协议
会话层 | 解除或建立与别的节点的联系 | 没有协议
传输层 | 提供端对端的接口 | TCP，UDP
网络层 | 为数据包选择路由 | IP，ICMP，RIP，OSPF，BGP，IGMP
数据链路层 | 传输有地址的帧以及错误检测功能 | SLIP，CSLIP，PPP，ARP，RARP，MTU
物理层 | 以二进制数据形式在物理媒体上传输数据 | ISO2110，IEEE802，IEEE802.2

## TCP 三次握手和四次挥手

![http](../.vuepress/public/assets/image/http/http18.png 'http')

::: tip 补充

1. 正常状态下，数据传输完成后，都是由客户端来断开连接；非正常状态下，如果客户端一直没有传输数据，服务器端也会自己断开连接。

2. 当客户端发送 FIN 请求断开连接时，此时客户端就没法再发送有效数据了，但是可以继续发送请求命令。

3. 图中像 SYN_SENT 等这些状态，在 mac 或者 linux 上可以通过 `netstat -an` 命令查看。

4. TCP 协议端口状态说明。

- **LISTENING**

提供某种服务，侦听远方 TCP 端口的连接请求，当提供的服务没有被连接时，处于 LISTENING 状态，端口是开放的，等待被连接。

- **SYN_SENT (客户端状态)**

客户端调用 connect，发送一个 SYN 请求建立一个连接，在发送连接请求后等待匹配的连接请求，此时状态为 SYN_SENT。

- **SYN_RCVD (服务端状态)**

在收到和发送一个连接请求后，等待对方对连接请求的确认，当服务器收到客户端发送的同步信号时，将标志位 ACK 和 SYN 置1发送给客户端，此时服务器端处于 SYN_RCVD 状态，如果连接成功了就变为 ESTABLISHED，正常情况下 SYN_RCVD 状态非常短暂。

- **ESTABLISHED**

ESTABLISHED 状态是表示两台机器正在传输数据。

- **FIN_WAIT_1**

等待远程 TCP 连接中断请求，或先前的连接中断请求的确认，主动关闭端应用程序调用 close，TCP 发出 FIN 请求主动关闭连接，之后进入 FIN_WAIT_1 状态。

- **FIN_WAIT_2**

从远程 TCP 等待连接中断请求，主动关闭端接到 ACK 后，就进入了 FIN_WAIT_2。这是在关闭连接时，客户端和服务器两次握手之后的状态，是著名的半关闭的状态了，在这个状态下，应用程序还有接受数据的能力，但是已经无法发送数据，但是也有一种可能是，客户端一直处于 FIN_WAIT_2 状态，而服务器则一直处于 WAIT_CLOSE 状态，而直到应用层来决定关闭这个状态。

- **CLOSE_WAIT**

等待从本地用户发来的连接中断请求，被动关闭端 TCP 接到 FIN 后，就发出 ACK 以回应 FIN 请求(它的接收也作为文件结束符传递给上层应用程序)，并进入CLOSE_WAIT。

- **CLOSING**

等待远程 TCP 对连接中断的确认，处于此种状态比较少见。

- **LAST_ACK**

等待原来的发向远程 TCP 的连接中断请求的确认，被动关闭端一段时间后，接收到文件结束符的应用程序将调用 close 关闭连接，TCP 也发送一个 FIN，等待对方的 ACK，进入 LAST_ACK。

- **TIME_WAIT**

在主动关闭端接收到 FIN 后，TCP 就发送 ACK 包，并进入 TIME_WAIT 状态，等待足够的时间以确保远程 TCP 接收到连接中断请求的确认，很大程度上保证了双方都可以正常结束，但是也存在问题，须等待 2MSL 时间的过去才能进行下一次连接。

- **CLOSED**

被动关闭端在接受到 ACK 包后，就进入了 CLOSED 的状态，连接结束，没有任何连接状态。
:::


## HTTP 的工作过程

一次 HTTP 操作（一个请求和一个响应）称为一个**事务**，其工作过程可分为四步:

1. 首先客户机与服务器需要**建立 TCP 连接**。只要单击某个超级链接，HTTP 的工作开始。

2. 建立连接后，客户机发送一个请求给服务器，请求方式的格式为：**统一资源标识符(URL)**、**协议版本号**，后边是 **MIME 信息，包括请求修饰符、客户机信息和可能的内容**。

3. 服务器接到请求后，给予相应的响应信息，其格式为一个**状态行**，包括**信息的协议版本号**、**一个成功或错误的代码**，后边是 **MIME 信息包括服务器信息、实体信息和可能的内容**。

4. 客户端接收服务器所返回的信息通过浏览器显示在用户的显示屏上，然后客户机与服务器**断开 TCP 连接**。

如果在以上过程中的某一步出现错误，那么产生错误的信息将返回到客户端，由显示屏输出。对于用户来说，这些过程是由 HTTP 自己完成的，用户只要用鼠标点击，等待信息显示就可以了。

::: tip 事务
所谓事务，就是有一个任务或操作，我们无法一次性完成，它包含若干个步骤，这些步骤相互之间有依赖性，当然有些步骤之间也有可能没有依赖性，像这样的任务或操作就叫做事务。

事务的特点就是，如果其中某个步骤失败了，那么依赖它的其他步骤也就无法执行，那么就认为这整个事务就失败了。而且，事务可以回滚。

数据库里就有事务，但是，事务并不是数据库专有的，在很多地方都有用到事务。

HTTP 工作过程的回滚不是我们常见的那种可以看到的回滚，比如关闭连接，释放内存等。
:::

## HTTP 的请求与响应

1. HTTP请求组成：**请求行**、**消息报头**、**请求正文**。

2. HTTP响应组成：**状态行**、**消息报头**、**响应正文**。

3. 请求行组成：以一个方法符号开头，后面跟着请求的 URL 和协议的版本。

4. 状态行组成：服务器 HTTP 协议的版本，服务器发回的响应状态代码和状态代码的文本描述。

- HTTP 请求报文

![http](../.vuepress/public/assets/image/http/http6.png 'http')

[ASCII 码表](http://www.asciima.com/ascii/12.html)

- HTTP 请求报文例子

![http](../.vuepress/public/assets/image/http/http5.png 'http')

- HTTP 响应报文

![http](../.vuepress/public/assets/image/http/http8.png 'http')

- HTTP 响应报文例子

![http](../.vuepress/public/assets/image/http/http7.png 'http')

**5. 常用的请求报头**

- `Accept` 请求报头域用于指定客户端接受哪些类型的信息。

> 注意，当我们在请求 JSON 接口时（JSON 接口是符合 RESTful 规范的），要指定 **Accept:application/json**，不然后端服务器那边无法正确返回数据。

- `Accept-Charset` 请求报头域用于指定客户端接受的字符集。

- `Accept-Encoding` 请求报头域类似于 Accept，但是它是用于指定可接受的内容编码。在服务端设定。

- `Accept-Language` 请求报头域类似于 Accept，但是它是用于指定一种自然语言。在服务器设定。

- `Authorization` 请求报头域主要用于证明客户端有权查看某个资源。当浏览器访问一个页面时，如果收到服务器的响应代码为401(未授权)，可以发送一个包含Authorization 请求报头域的请求，要求服务器对其进行验证。

- `Host` 请求报头域主要用于指定被请求资源的 Internet 主机和端口号，它通常从 HTTP URL 中提取出来的，发送请求时，该报头域是必需的。

- `User-Agent` 请求报头域允许客户端将它的操作系统、浏览器和其它属性告诉服务器。

- `Connection` 指定连接类型。keep-alive 是长连接。

- `Referer` 用来表明当前页面的上一页是哪个页面。主要用来防盗链。

**6. 常用的响应报头**

- `Content-Type` 指定响应体的格式以及字符集编码是什么。

- `Set-Cookie` 设置 cookie。

> 客户端向服务器上传 cookie 是整块上传的，但是服务器向浏览器设置 cookie 是逐条设置的。一个完整的 cookie 应该是有5个字段的。

- `Location` 响应报头域用于重定向接受者到一个新的位置。Location 响应报头域常用在更换域名的时候。

- `Server` 响应报头域包含了服务器用来处理请求的软件信息。与 User-Agent 请求报头域是相对应的。

- `WWW-Authenticate` 响应报头域必须被包含在401(未授权的)响应消息中，客户端收到 401 响应消息时候，并发送 Authorization 报头域请求服务器对其进行验证时，服务端响应报头就包含该报头域。

**7. 实体报头**

请求和响应消息都可以传送一个实体。一个实体由实体报头域和实体正文组成，**但并不是说实体报头域和实体正文要在一起发送，可以只发送实体报头域**。实体报头定义了关于实体正文(eg:有无实体正文)和请求所标识的资源的元信息。

- `Content-Encoding` 实体报头域被用作媒体类型的修饰符，它的值指示了已经被应用到实体正文的附加内容的编码，因而要获得 Content-Type 报头域中所引用的媒体类型，必须采用相应的解码机制。

> Content-Encoding: gzip 标记着传输内容会被压缩，但是报头并不会被压缩。

- `Content-Language` 实体报头域描述了资源所用的自然语言。

- `Content-Length` 实体报头域用于指明实体正文的长度，以字节方式存储的十进制数字来表示。

- `Content-Type` 实体报头域用于指明发送给接收者的实体正文的媒体类型。

- `Last-Modified` 实体报头域用于指示资源的最后修改日期和时间。

- `Expires` 实体报头域给出响应过期的日期和时间。

## HTTP 的请求方法

HTTP/1.0 定义了三种请求方法： GET、POST 和 HEAD 方法。

HTTP/1.1 新增了六种请求方法：OPTIONS、PUT、PATCH、DELETE、TRACE 和 CONNECT 方法。

具体可见：[HTTP 请求方法](https://www.runoob.com/http/http-methods.html)

HTTP 常见的8种请求方法如下：

1. **GET**: 请求获取 Request-URI 所标识的资源。

2. **POST**: 在 Request-URI 所标识的资源后附加新的数据。

3. **HEAD**: 请求获取由 Request-URI 所标识的资源的响应消息报头。

4. **PUT**: 请求服务器存储一个资源，并用 Request-URI 作为其标识。

5. **DELETE**: 请求服务器删除 Request-URI 所标识的资源。

6. **TRACE**: 请求服务器回送收到的请求信息，主要用于测试或诊断。

7. **CONNECT**: HTTP/1.1 协议中预留给能够将连接改为管道方式的代理服务器。

8. **OPTIONS**: 请求查询服务器的性能，或者查询与资源相关的选项和需求。

以上的方法其实暗含了类似数据库的 CRUD 操作，CRUD 分别对应 PUT、GET、POST、DELETE。

## HTTP 状态码

[HTTP 状态码](https://www.runoob.com/http/http-status-codes.html)

状态代码由三位数字组成，第一个数字定义了响应的类别，且有五种可能取值:

1. 1xx:指示信息--表示请求已接收，继续处理。

2. 2xx:成功--表示请求已被成功接收、理解、接受。

3. 3xx:重定向--要完成请求必须进行更进一步的操作。

4. 4xx:客户端错误--请求有语法错误或请求无法实现。

5. 5xx:服务器端错误--服务器未能实现合法的请求。

::: tip 推荐图书
[学会提问系列图书](https://item.jd.com/47379418374.html)
:::

## Cookie 与 Session

:pushpin: **什么是 Cookie**

1. Cookie 是**保存在客户端的小段文本**，随客户端点每一个请求发送该 url 下的所有 Cookie 到服务器端。

2. Cookie 绝大多数情况下是**产生在服务器端**的，不过浏览器端也可以产生 Cookie。

3. 浏览器中有一个专门的文件是用来保存 Cookie 的，它保存在硬盘上。

:pushpin: **什么是 Session**

1. Session **在服务器中生成，并且保存在服务器端**，通过唯一的值 SessionID 来区别每一个用户。SessionID 随每个连接请求发送到服务器，服务器根据 SessionID 来识别客户端，再通过 Session 的 key 获取 Session 值。

2. 一般情况下，一个 Session 对应一个客户端。Session 里边是要保存数据的，并且里面的数据根据需要产生 Cookie，这样客户端和服务器就有一些共同的凭据，有了这些共同的凭据之后，就可以维护登录状态。

3. Session 在服务器上是会过期的。

:pushpin: **Cookie 和 Session 的使用**

1. HTTP 是**无状态协议**，也就是说服务器不会维持客户端的连接状态。为什么不会维护呢？这是因为 HTTP 是建立在 TCP 之上的，TCP 可以维护客户端的连接状态。

2. 与 Cookie 相关的 HTTP 扩展头

- Cookie：客户端将服务器设置的 Cookie 返回到服务器。

- Set-Cookie：服务器向客户端设置 Cookie。

3. 服务器在响应消息中用 Set-Cookie 头将 Cookie 的内容回送给客户端，客户端在新的请求中将相同的内容携带在 Cookie 头中发送给服务器。从而实现会话的保持。

![http](../.vuepress/public/assets/image/http/http9.png 'http')

4. Cookie 和 Session 是需要配合使用的。下面就是它们的配合过程：

![http](../.vuepress/public/assets/image/http/http10.png 'http')

## HTTP 的缓存机制

缓存会根据请求保存输出内容的副本，例如html页面，图片，文件，当下一个请求来到的时候，如果是相同的URL，缓存直接使用副本响应访问请求，而不是向源服务器再次发送请求。

:pushpin: **缓存的优点**

- 减少相应延迟。

- 减少网络带宽消耗。

::: tip 补充
1. 在计算机里，速度最快的是 CPU，然后是内存，其次是在主板上的其他部件，比如硬盘。

2. 这些设备中，和浏览器相关的设备主要是 CPU、内存、显卡和网络设备。其中，网络是比较慢的，为了不让这些较慢的设备拖慢页面展示，所以就需要用缓存来提高速度。
:::

:pushpin: **缓存的基本流程**

浏览器首次发送请求时，服务器会返回资源。当浏览器再次请求时，服务器会先检查浏览器中是否有相关的缓存，如果有，则返回一个 304，让浏览器直接去缓存里取资源。

![http](../.vuepress/public/assets/image/http/http11.png 'http')

:pushpin: **浏览器缓存机制**

![http](../.vuepress/public/assets/image/http/http12.png 'http')

![http](../.vuepress/public/assets/image/http/http13.png 'http')

:pushpin: **两种缓存策略**

1. 强制缓存

服务器通知浏览器一个缓存时间，在缓存时间内，下次请求，直接用缓存，不在时间内，执行比较缓存策略。

![http](../.vuepress/public/assets/image/http/http14.png 'http')

2. 比较缓存（协商缓存）

将缓存信息中的 Etag 和 Last-Modified 通过请求发送给服务器，由服务器校验，返回304状态码时，浏览器直接使用缓存。

- **Etag/If-None-Match 策略**

（1）Etag：web 服务器响应请求时，告诉浏览器当前资源在服务器的唯一标识(生成规则由服务器决定)。

（2）If-None-Match：当资源过期时(使用 Cache-Control 标识的 max-age)，发现资源具有 Etage 声明，则再次向 web 服务器请求时带上头 If-None-Match (Etag 的值)。web 服务器收到请求后发现有头 If-None-Match，则与被请求资源的相应校验串进行比对，决定返回200或304。

- **Last-Modified/If-Modified-Since 策略**

（1）Last-Modified：标示这个响应资源的最后修改时间。web 服务器在响应请求时，告诉浏览器资源的最后修改时间。

（2）If-Modified-Since：当资源过期时(使用 Cache-Control 标识的 max-age)，发现资源具有 Last-Modified 声明，则再次向 web 服务器请求时带上头 If- Modified-Since，表示请求时间。web 服务器收到请求后发现有头 If-Modified-Since，则与被请求资源的最后修改时间进行比对。若最后修改时间较新，说明资源有被改动过，则响应整片资源内容(写在响应消息包体内)HTTP 200；若最后修改时间较旧，说明资源无新修改，则响应HTTP 304 (无需包体，节省浏览)，告知浏览器继续使用所保存的 cache。
