## 现代浏览器的进化

- 1990年，蒂姆·伯纳斯·李开发了第一个网页浏览器 **WorldWideWeb**，后改名为 **Nexus**。WorldWideWeb 浏览器支持早期的 HTML 标记语言，功能比较简单，只能支持文本、简单的样式表、电影、声音、图片等资源的显示。

- 1993年，马克·安德森领导的团开发了一个真正有影响力的浏览器 **Mosaic**，这就是后来世界上最流行的浏览器 **Netscape Navigator**。

- 1995年，微软推出了闻名于世的浏览器 **Internet Explorer**。**第一次浏览器大战开始，持续两年**。

- 1998年，Netscape 公司开放 Netscape Navigator 源代码，成立了 Mozilla 基金会。**第二次浏览器大战开始，持续八年**。

- 2003年，苹果公司发布了 **Safari** 浏览器。

- 2004年，Netscape 公司发布了著名的开源浏览器 **Mozilla Firefox**。

- 2005年，苹果公司开源了浏览器中的核心代码，基于此发起了一个新的开源项目 WebKit(Safari 浏览器的内核)。

- 2008年， Google 公司以 WebKit 为内核，创建了一个新的浏览器项目 **Chromium**。以 Chromium 为基础，谷歌发布了 **Chrome** 浏览器。 至于这两者的关系，可以简单地理解为：Chromium 为实验版，具有众多新特性；Chrome 为稳定版。

## 现代浏览器的特征

- 网络

- 资源缓存

- 网页浏览

- 多页面管理

- 插件和扩展

- 账户和同步

- 安全机制

- 开发者工具


## 现代浏览器的结构

![browser](../.vuepress/public/assets/image/browser/browser1.png 'browser')

浏览器主要包含8个子系统：

:pushpin: **1. 用户界面（User Interface）**

- 主要包括工具栏、地址栏、前进/后退按钮、书签菜单、可视化页面加载进度、智能下载处理、首选项、打印等。除了浏览器主窗口显示请求的页面之外，其他显示的部分都属于用户界面。

- 可以与桌面环境集成，以提供浏览器会话管理或与其他桌面应用程序的通信。

:pushpin: **2. 浏览器引擎（Browser Engine）**

- 是一个可嵌入的组件，其为渲染引擎提供高级接口。

- 可以加载一个给定的URI，并支持诸如：前进/后退/重新加载等浏览操作。

- 提供查看浏览会话的各个方面的挂钩，例如：当前页面加载进度、JavaScript alert。

- 允许查询/修改渲染引擎设置。

:pushpin: **3. 渲染引擎（Rendering Engine）**

- 为指定的URI生成可视化的表示。

- 能够显示HTML和XML文档，可选择CSS样式，以及嵌入式内容（如图片）。

- 能够准确计算页面布局，可使用“回流”算法逐步调整页面元素的位置。

- 内部包含HTML解析器。

:pushpin: **4. 网络（Networking）**

- 实现 HTTP 和 FTP 等文件传输协议。 

- 可以在不同的字符集之间进行转换，为文件解析 MIME 媒体类型。

- 可以实现最近检索资源的缓存功能。

:pushpin: **5. JS 解释器（JavaScript Interpreter）**

- 能够解释并执行嵌入在网页中的JavaScript（又称ECMAScript）代码。

- 为了安全起见，浏览器引擎或渲染引擎可能会禁用某些 JavaScript 功能，如弹出窗口的打开。

:pushpin: **6. XML 解析器（XML Parser）**

- 可以将 XML 文档解析成文档对象模型（Document Object Model，DOM）树。

- 是浏览器架构中复用最多的子系统之一，几乎所有的浏览器实现都利用现有的 XML 解析器，而不是从头开始创建自己的 XML 解析器。

- XML 解析方式主要有 DOM 和 SAX 解析两种。

:pushpin: **7. 显示后端（Display Backend）**

- 提供绘图和窗口原语，包括：用户界面控件集合、字体集合。

:pushpin: **8. 数据持久层（Data Persistence）**

- 将与浏览会话相关联的各种数据存储在硬盘上。这些数据可能是诸如：书签、工具栏设置等这样的高级数据，也可能是诸如：Cookie，安全证书、缓存等这样的低级数据。

## 常见的渲染引擎

1. 渲染引擎能够将 HTML/CSS/JavaScript 文本及相应的资源文件转换成图像结果。

2. 浏览器内核分为两部分：渲染引擎和 JS 引擎。最开始渲染引擎和 JS 引擎没有区分的很明确，后来 JS 引擎越来越独立，内核就倾向于只指渲染引擎。

浏览器 | Chrome | Firefox | Safari | IE | Edge | Opera
-|-|-|-|-|-|-
内核 | Blink | Gecko | WebKit | Trident | EdgeHTML | Presto
JS 引擎 | V8 | JagerMonkey | SquirrelFish Extreme | JScritp、Chakra | Chakra | Carakan

::: tip 说明
1. 2008年谷歌公司发布了 Chrome 浏览器，浏览器使用的内核被命名为 Chromium，Chromium fork 自开源引擎 WebKit。最开始 Chrome 采用 WebKit 作为浏览器内核，直到2013年开始使用 WebKit 的分支内核 Blink。

2. IE6-8 用的 JS 引擎是 JScritp，IE9-11 用的 JS 引擎是 Chakra。
:::

## 渲染引擎的工作流程

渲染引擎的渲染流程示意图如下，其以 HTML/JavaScript/CSS 等文件作为输入，以可视化内容作为输出。

![browser](../.vuepress/public/assets/image/browser/browser2.png 'browser')

:pushpin: **1. Parsing HTML to Construct DOM Tree**

- 渲染引擎使用 HTML 解析器（调用 XML 解析器）解析 HTML（XML）文档，将各个 HTML（XML）元素逐个转化成 DOM 节点，从而生成 DOM 树。

- 同时，渲染引擎使用 CSS 解析器解析外部 CSS 文件以及 HTML（XML）元素中的样式规则。

:pushpin: **2. Render Tree construction**

- 渲染引擎使用第1步 CSS 解析器解析得到的样式规则，将其附着到 DOM 树上，从而构成渲染树。

- 渲染树包含多个带有视觉属性（如颜色和尺寸）的矩形。这些矩形的排列顺序就是它们将在屏幕上显示的顺序。

:pushpin: **3. Layout of Render Tree**

- 渲染树构建完毕之后，进入本阶段进行“布局”，也就是为每个节点分配一个应出现在屏幕上的确切坐标。

:pushpin: **4. Painting Render Tree**

渲染引擎将遍历渲染树，并调用显示后端将每个节点绘制出来。

## 渲染引擎的组成模块

![browser](../.vuepress/public/assets/image/browser/browser3.png 'browser')

上图所示为渲染引擎工作流程中各个步骤所对应的模块，其中第1步和第2步涉及到多个模块，并且耦合程度较高。

这样的设计是为了达到更好的用户体验，渲染引擎尽快将内容显示在屏幕上。它不必等到整个HTML文档解析完毕之后，就可以开始渲染树构建和布局设置。在不断接收和处理来自网络的其余内容的同时，渲染引擎会将部分内容解析并显示出来。

从图中可以看出，渲染引擎主要包含（或调用）的模块有：

- **HTML（XML）解析器**

解析 HTML（XML）文档，主要作用是将 HTML（XML）文档转换成 DOM 树。

- **CSS 解析器**

将 DOM 中的各个元素对象进行计算，获取样式信息，用于渲染树的构建。

- **JavaScript 解释器**

使用 JavaScript 可以修改网页的内容、CSS 规则等。JavaScript 解释器能够解释 JavaScript 代码，并通过 DOM 接口和 CSSOM 接口来修改网页内容、样式规则，从而改变渲染结果。

- **布局**

DOM 创建之后，渲染引擎将其中的元素对象与样式规则进行结合，可以得到渲染树。布局则是针对渲染树，计算其各个元素的大小、位置等布局信息。

- **绘图**

使用图形库将布局计算后的渲染树绘制成可视化的图像结果。

以上这些模块都是操作 **DOM 树**（**DOM Tree**）和**渲染树**（**Render Tree**）这两个核心数据结构的。

::: warning 注意
- **这块地方是重点，要吃透！尤其是其中的流程和数据流向，这两点在软件架构设计中也是很重要的。**

- 这个图有一个不太恰当的地方就是，CSS 解析器和 JavaScript 解释器应该是和 HTML（XML）解析器同时从入口文件那里分开的，而不是前两者从 HTML（XML）解析器那里分开。

- 但其实，JS 和 CSS 也是通过 HTML 中的链接引进来或者嵌在 HTML 中的，所以它们从 HTML（XML）解析器那里分开也说的过去。
:::

## Chrome 架构

![browser](../.vuepress/public/assets/image/browser/browser4.png 'browser')

- Browser：浏览器的主进程，控制 chrome 的应用程序部分，包括地址栏，书签，后退和前进按钮。还处理 Web 浏览器的不可见的和特权部分，例如网络请求和文件访问。

- Renderer：渲染器进程，负责显示网站的选项卡内的所有内容。

- Plugin：控制网站使用的所有插件，例如 flash。

- GPU：独立于其他进程的 GPU 处理任务。它被分成多个不同的进程，因为 GPU 处理来自多个程序的请求并将它们绘制在同一个页面中。

:pushpin: **1. Chrome 采用多进程架构的好处**

- 每个选项卡都有自己的渲染器进程。假设你打开了 3 个选项卡，每个选项卡都拥有独立的渲染器进程。如果一个选项卡没有响应，则可以关闭无响应的选项卡，并继续使用，同时保持其他选项卡处于活动状态。如果所有选项卡，都在一个进程上运行，则当一个选项卡无响应时，所有选项卡都不会响应。这就很尴尬了。

- 分成多个进程的另一个好处是安全性和沙盒。由于操作系统提供了限制进程权限的方法，因此浏览器可以从某些功能中，对某些进程进行沙箱处理。例如，Chrome 浏览器可以对处理用户输入（如渲染器）的进程，限制其文件访问的权限。

:pushpin: **2. Chrome 服务化——更省内存**

- 每个进程都有自己的私有内存空间，因此它们通常包含公有基础功能（例如 V8 是 Chrome 的 JavaScript 引擎）。这意味着更多的内存使用，因为如果它们是同一进程内的线程，则无法以它们的方式共享。

- 为了节省内存，Chrome 限制了它可以启动的进程数量。限制会根据设备的内存和 CPU 功率动态调整，但当 Chrome 达到限制时，它会在一个新的进程中打开这个站点。

- Chrome 正在进行体系结构更改，以便将浏览器程序的每个部分，作为一项服务运行，从而可以轻松拆分为不同的流程或汇总为同一个流程。

- 一般的想法是，当 Chrome 在强大的硬件上运行时，它可能会将每个服务拆分为不同的进程，从而提供更高的稳定性，但如果它位于资源约束的设备上，Chrome 会将服务整合到一个进程中，从而节省内存占用。

![browser](../.vuepress/public/assets/image/browser/browser1.gif 'browser')

## Chrome 渲染器进程

![browser](../.vuepress/public/assets/image/browser/browser5.png 'browser')

1. 渲染器进程负责选项卡内发生的所有事情。在渲染器进程中，主线程处理你为用户编写的大部分代码。

2. 如果你使用了 web worker 或 service worker，有时 JavaScript 代码的一部分将由工作线程处理。排版和栅格线程也在渲染器进程内运行，以便高效、流畅地呈现页面。

## Chrome 渲染过程

### 解析部分

- 构建 DOM

- 子资源加载，比如 JS 和 CSS 资源

::: warning 注意
1. JavaScript 会阻止 DOM 解析，这就是要把 script 脚本放在页面底部的原因。

2. 构建 DOM 的过程中如果发现子资源，就会立即进行网络请求，这两步是并行进行的，不是串行的。
:::

- 提示浏览器如何加载资源

![browser](../.vuepress/public/assets/image/browser/browser6.png 'browser')

- 样式表计算，将样式表中定义的每个样式跟对应的 DOM 元素进行关联。

![browser](../.vuepress/public/assets/image/browser/browser7.png 'browser')

- 布局

![browser](../.vuepress/public/assets/image/browser/browser8.png 'browser')

- 绘制，在进行绘制之前，还要先进行合成，再交给 GPU 去渲染。

### 合成部分

- 把文档的结构、元素的样式、几何形状和绘制顺序转换为屏幕上的像素点的过程称为**光栅化（栅格化）**。

- 合成是一种将页面的各个部分分层，分别栅格化，并在一个被称为合成器线程的独立线程中合成为页面的技术。

![browser](../.vuepress/public/assets/image/browser/browser9.png 'browser')

### GPU 渲染

- 一旦创建了层树并确定了绘制顺序，主线程就会将该信息提交给合成器线程。然后合成器线程栅格化每个图层。 一个图层可能像页面的整个长度一样大，因此**合成器线程会将它们分成图块 tile，并将每个图块发送到光栅线程**。栅格线程栅格化每一个 tile 并将它们存储在 GPU 内存中。

- 通过 IPC 将合成器帧提交给浏览器进程。这时可以从 UI 线程添加另一个合成器帧以用于浏览器 UI 更改，或者从其他渲染器进程添加扩充数据。这些合成器帧被发送到GPU 用来在屏幕上显示。如果发生滚动事件，合成器线程会创建另一个合成器帧并发送到 GPU。

- 合成的好处是它可以在不涉及主线程的情况下完成。合成线程不需要等待样式计算或 JavaScript 执行。这就是合成动画是平滑性能的最佳选择的原因。如果需要再次计算布局或绘图，则必须涉及主线程。

![browser](../.vuepress/public/assets/image/browser/browser10.png 'browser')

![browser](../.vuepress/public/assets/image/browser/browser11.png 'browser')

::: tip 补充
- CPU 是多核处理器，GPU 是众核处理器。处理器数目至少在48个以上才能称为众核。

- [CPU 和 GPU 的区别](https://www.cnblogs.com/biglucky/p/4223565.html)
:::

## 初窥 WebKit

1. [WebKit 官网](https://webkit.org/)

2. [Blink 官方文档](http://www.chromium.org/blink)，Blink 是未来

3. WebKit 架构图

![browser](../.vuepress/public/assets/image/browser/browser12.png 'browser')