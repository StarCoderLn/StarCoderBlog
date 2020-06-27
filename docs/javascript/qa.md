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

  ab -c 100 -n 100 http:localhost:8081 每秒持续发出28个请求，Request per second 表示服务器每秒处理请求数，即为 `QPS`。

**3. 安全测试**

- **安全漏洞检查**

  XSS

  SQL

  CSRF

**4. 功能测试**

- **用户真实性检查**

  selenium-webdriver

  protractor selenium-standalone 这是两个工具

  WEBDRIVER I/O  http://webdriver.io

  冒烟测试 SmokeTest 是自由测试的一种，找到一个 BUG 开发修复，然后专门针对此 BUG，优点是节省生煎防止 build 失败，缺点是覆盖率极低。

  回归测试是修改一处对整体功能全部测试，一般配合自动化测试。

**5. JsLint & JsHint**

- 目的：检测 JavaScript 代码标准。

- 原因：JavaScript 代码诡异，保证团队代码规范。

- [lint](http://www.jslint.com/)

- [hint](http://www.jshint.com/)

- 搭配自动化管理工具完善自动化测试 gtunt-jslint、grunt-jshint。