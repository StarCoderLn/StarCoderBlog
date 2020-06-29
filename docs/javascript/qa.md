## 什么是QA工程师

QA（Quality Assurance）是质量保证的意思。但实际上好像每家公司对 QA 的定义和岗位职责不太一样，具体可以参考下知乎上的这篇文章：[QA这个职位主要做什么？重要么？](https://www.zhihu.com/question/19685881)

## 测试核心概念

![QA](../.vuepress/public/assets/image/javascript/qa1.png 'QA')

**1. 单元测试**

- 目的：单元测试能够让开发明确知道代码结果。

- 原则：**单一职责**、**接口抽象**、**层次分离**。

- 断言库：保证最小单元是否正常运行的检测方法。

- 测试风格：

  **测试驱动开发**（Test-Driven Development，`TDD`）、**行为驱动开发**（Behavior Driven Development，`BDD`）均是**敏捷开发**方法论。

  **TDD 关注所有的功能是否被实现（每一个功能都必须有对应的测试用例）**，suite 配合 test 利用 assert('tobi' == user.name)。简单来说就是先写测试用例，再干活。

  **BDD 关注整体行为是否符合整体预期，编写的每一行代码都有目的提供一个全面的测试用例集**。expect/should，describe 配合 it 利用自然语言 expect(1).toEqual(fn()) 执行结果。简单来说就是先干活再写测试用例，国内大部分公司都是采用这种方式。

- **单元测试框架**

  [better-assert](https://github.com/tj/better-assert)（TDD 断言库，Github 276star 21fork）

  [should.js](https://github.com/tj/should.js)（BDD 断言库，Github 2761star 211fork）

  [expect.js](https://github.com/Automattic/expect.js)（BDD 断言库，Github 2057star 209fork）

  [chai.js](https://github.com/chaijs/chai)（TDD BDD 双模，Github 6826star 622fork）

  [Jasmine.js](https://github.com/jasmine/jasmine)（BDD，Github 14808star 2.2kfork）

  Node.js 本身集成 require('assert');

  [Intern](https://github.com/theintern/intern) 更是一个大而全的单元测试框架。

  [QUnit](https://github.com/qunitjs/qunit) 一个游离在 jQuery 左右的测试框架。

  [Macaca](https://github.com/alibaba/macaca/blob/master/README.zh.md) 一套完整的自动化测试解决方案，国内神器，来自阿里巴巴。

- **单元测试运行流程**

  （1）before 单个测试用例(it)开始前。

  （2）beforeEach 每一个测试用例开始前。

  （3）it 定义测试用例，并利用断言库进行，设置 chai 如：expect(x).to.equal(true); 异步 mocha。
  
  （4）以上专业术语叫 mock。

![QA](../.vuepress/public/assets/image/javascript/qa2.png 'QA')

- **自动化单元测试**

  karma 自动化 runner 集成 PhantomJS 无刷新

```js
npm install -g karma

npm install karma-cli --save-dev

npm install karma-chrome-launcher --save-dev

npm install karma-phantomjs-launcher --save-dev

npm install karma-mocha --save-dev

npm install karma-chai --save-dev
```

- **报告和单测覆盖率检查**

```js
npm install karma-coverage --save-dev

// 配置代码覆盖测试率生成结果
coverageReporter: {
  type: 'html',
  dir: 'coverage/'
}
```

**2. 性能测试**

- **基准测试**

  面向切面编程 AOP 无侵入式统计。

  Benchmark 基准测试方法，它并不是简单地统计执行多少次测试代码后对比时间，它对测试有着**严密的抽样过程**。执行多少次取决于采样到的数据能否完成统计。根据统计次数计算方差。

- **压力测试**

  对网络接口做压力测试需要检查的几个常用指标有`吞吐率`、`响应时间`和`并发数`，这些指标反映了服务器并发处理能力。

  PV 网站**当日访问人数**，UV **独立访问人数**。PV 每天几十万甚至上百万就需要考虑压力测试。换算公式：`QPS = PV / t`。PS：1000000 / 10 * 60 * 60 = 27.7（100万请求集中在10小时，服务器每秒处理27.7个业务请求）。

  常用的压力测试工具有：ab、siege、http_load。

  ab -c 100 -n 100 http:localhost:8081 每秒持续发出28个请求
  
  Request per second 表示服务器每秒处理请求数，即为 `QPS`;

  Failed requests 表示此次请求失败的请求数；

  Connection Times 连接时间，它包括客户端向服务器端建立连接、服务器端处理请求、等待报文响应的过程。

**3. 安全测试**

- **安全漏洞检查**

  XSS

  SQL

  CSRF

**4. 功能测试**

- **用户真实性检查**

  [selenium-webdriver](https://wizardforcel.gitbooks.io/selenium-doc/content/official-site/selenium-web-driver.html)

  [protractor](https://github.com/angular/protractor)
  
  [selenium-standalone](https://github.com/vvo/selenium-standalone)

  [WebdriverIO](http://webdriver.io)

  冒烟测试 SmokeTest 是自由测试的一种，找到一个 BUG 开发修复，然后专门针对此 BUG，优点是节省生煎防止 build 失败，缺点是覆盖率极低。

  回归测试是修改一处对整体功能全部测试，一般配合自动化测试。

**5. JsLint & JsHint**

- 目的：检测 JavaScript 代码标准。

- 原因：JavaScript 代码诡异，保证团队代码规范。

- [lint](http://www.jslint.com/)

- [hint](http://www.jshint.com/)

- 搭配自动化管理工具完善自动化测试 gtunt-jslint、grunt-jshint。


## 自动化测试实战演练

1. 一般测试用例文件都是以 .test.js、.spec.js 后缀命名的，也有的直接写成 indexSpec.js。并且测试用例文件和它对应的 js 文件名字也是一一对应的，比如 index.spec.js 就是 index.js 这个文件的测试用例文件。

```js
// index.js
window.add = function(a) {
  return (a = a + 1);
}
```

```js
// index.spec.js
describe('函数基本测试用例', function() {
  it('+1测试函数', function() {
    expect(window.add(1)).toBe(2);
  });
});
```

2. 执行 npm init -y 初始化 package.json 文件。

3. 安装 [karma](http://karma-runner.github.io/5.0/intro/installation.html)

安装方式首选 npm：

```
npm install karma --save-dev
```

如果 npm 实在太慢可以用 yarn，会比 npm 快一点：

```
yarn add karma
```

用 npm 安装的话会生成 package-lock.json 文件，用 yarn 安装的话会生成 yarn.lock 文件。

如果想全局安装 karma，还是需要先执行以上命名在本地安装好 karma，然后再执行以下命令安装 karma-cli (mac 系统下要加 sudo，不然没权限)：

```
sudo npm install -g karma-cli
```

或者用 yarn：

```
yarn add global karma-cli
```

全局安装完成后，就可以使用以下命令在本地配置 karma 的环境，这样就不需要在 package.json 手动添加命令了。

```
karma init
```

![karma](../.vuepress/public/assets/image/javascript/karma1.png 'karma')

配置完之后就可以在本地看到一个 karma.conf.js 文件了。这个文件需要重视，因为它就是 karma 的配置文件。

![karma](../.vuepress/public/assets/image/javascript/karma2.png 'karma')

![karma](../.vuepress/public/assets/image/javascript/karma3.png 'karma')

4. 在 package.json 的 scripts 中添加命令

```json
scripts: {
  "init": "karma init"
}
```

如果是全局安装了 karma，这一步就不需要了。

5. 学会使用无头浏览器

无头浏览器就是看不见界面但是确实存在的浏览器。PhantomJS 就是一个早期的无头浏览器，已经很老了，跟它差不多名字的还有一个叫作 PhantomCSS，前者管 js，后者管 css。

6. 新建一个 src 目录，把 index.js 移动到 src 目录下。然后在 karma 配置文件中配置：

```js
// 需要进行测试的文件
files: [
  "./src/**/*.js",
  "./tests/unit/**/*.spec.js"
],
```

7. 再设置 singleRun 为 true

```js
singleRun: true,
```

8. 接下来还需要安装以下包：

```
npm install karma-jasmine jasmine-core --save-dev
```

9. 在 package.json 中添加脚本命令：

```json
scripts: {
  "test": "karma start"
}
```

然后就可以运行 npm test 命令启动测试流程了。然而报错了：

![karma](../.vuepress/public/assets/image/javascript/karma4.png 'karma')

查看报错信息就会发现，原来是没找到 PhantomJS 这个无头浏览器，官网之所以没有提及这个，是因为它一开始就装了 chorme。

![karma](../.vuepress/public/assets/image/javascript/karma5.png 'karma')

10. 安装 [PhantomJS](https://www.npmjs.com/package/phantomjs)，这个包太老了，npm 上都不维护了。

```
npm install phantomjs --save-dev
```

但是下载过程太慢了，没办法换成 cnpm 来下载。

```
cnpm install phantomjs --save-dev
```

安装完成后重新运行 npm test，发现还是不行，报了同样的问题。所以我们还得再安装一个适配器 karma-phantomjs-launcher。

```
npm install karma-phantomjs-launcher --save-dev
```

重新运行 npm test 就可以看到启动成功了。

![karma](../.vuepress/public/assets/image/javascript/karma6.png 'karma')

图里展示我们的测试用例也测试通过了。

此时如果把测试用例改成：

```js
// index.spec.js
describe('函数基本测试用例', function() {
  it('+1测试函数', function() {
    expect(window.add(1)).toBe(3);
  });
});
```

就会发现测试不通过了。

![karma](../.vuepress/public/assets/image/javascript/karma7.png 'karma')

11. 查看测试覆盖率

接下来把 index.js 代码改一下

```js
// index.js
window.add = function(a) {
  if (a == 1) {
    return 1;
  } else {
    return (a = a + 1);
  }
}
```

相应的，index.spec.js 也得改：

```js
describe('函数基本测试用例', function() {
  it('+1测试函数', function() {
    expect(window.add(1)).toBe(1);
    expect(window.add(1)).toBe(2);
  });
});
```

因为代码里有 if ... else 分支，所以测试用例需要写两个 expect，如果只写一个的话，就会导致测试覆盖率不全。

那么，如何查看测试覆盖率呢？

（1）新建一个 docs 文件夹，用来生成测试报告给别人看。

（2）安装测试覆盖率检查工具 [karma-coverage](https://www.npmjs.com/package/karma-coverage)

```
npm install karma-coverage --save-dev
```

（3）安装完成后，需要改下 karma 的配置文件：

```js
preprocessors: {
  // 测试哪些文件对应的覆盖率
  'src/**/*.js': ['coverage']
},

reporters: ['progress', 'coverage'],

// 报表生成的位置
coverageReporter: {
  type: 'html',
  dir: 'docs/coverage/'
},
```

（4）重新运行 npm test，就会看到 docs 目录下生成了一些文件。

![karma](../.vuepress/public/assets/image/javascript/karma8.png 'karma')

（5）打开 index.html，就可以在浏览器中看到测试报告。覆盖率是通过分支语句计算出来的。

![karma](../.vuepress/public/assets/image/javascript/karma9.png 'karma')

点击 index.js 还能看到具体是哪行代码测试不通过。

![karma](../.vuepress/public/assets/image/javascript/karma10.png 'karma')

（6）把 index.js 再改下:

```js
describe('函数基本测试用例', function() {
  it('+1测试函数', function() {
    expect(window.add(1)).toBe(1);
    expect(window.add(2)).toBe(3);
  });
});
```

重新运行就可以看到所有测试用例通过了。

![karma](../.vuepress/public/assets/image/javascript/karma11.png 'karma')

12. UI 自动化测试

（1）一个比较好用的库：[backstop github](https://github.com/obfuscurity/backstop) [backstop npm](https://www.npmjs.com/package/backstopjs)

（2）全局安装

```
sudo npm install -g backstopjs
```

npm 安装实在是太慢了，没办法只能用 cnpm

```
sudo cnpm install -g backstopjs
```

（3）安装好之后运行以下命令，会生成 backstop 的配置文件 backstop.json 和 backstop_data 文件夹。

```
backstop init
```

![karma](../.vuepress/public/assets/image/javascript/karma12.png 'karma')