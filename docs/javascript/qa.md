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


## 自动化测试实战

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

（4）把 backstop.json 文件中的 id 和 scenarios 对象中的 url 改成腾讯地图：

```json
"id": "qq"

"scenarios": [
  {
    "url": "https://map.qq.com/m/"
  }
]
```

（5）puppeteer

这是当下最新的无头浏览器，生态也比较广。[puppeteer github](https://github.com/puppeteer/puppeteer)

puppet 文件夹下的东西就是用来操作这个的。puppet 也是一个库，[puppet npm](https://www.npmjs.com/package/puppet)、[puppet github](https://github.com/puppetlabs/puppet)

![karma](../.vuepress/public/assets/image/javascript/karma13.png 'karma')


（6）运行以下命令：

```js
backstop test
```

执行完成后会自动在浏览器中弹出以下页面：

![karma](../.vuepress/public/assets/image/javascript/karma14.png 'karma')

这个时候可以发现 backstop_data 文件夹下多出了两个文件夹。

![karma](../.vuepress/public/assets/image/javascript/karma15.png 'karma')

其中，bitmaps_test 文件夹存放的就是你的页面，页面的尺寸就是跟 backstop.json 里面设置的尺寸一样的。

![karma](../.vuepress/public/assets/image/javascript/karma16.png 'karma')

而 html_report 文件夹存放的是生成的一些报表。

（7）刚刚执行命令的时候还会发现报错了，说没有找到图片。

![karma](../.vuepress/public/assets/image/javascript/karma17.png 'karma')

没找到是因为这里的路径没找到。

![karma](../.vuepress/public/assets/image/javascript/karma18.png 'karma')

（8）直接在 backstop_data 文件夹中新建一个 bitmaps_reference 文件夹。然后让 UI 把新的图放这个文件夹里边。同时删掉 bitmaps_test 文件夹。

![karma](../.vuepress/public/assets/image/javascript/karma19.png 'karma')

（9）重新执行 backstop test 命令，就能看到自己的页面跟 UI 设计的图哪些地方不一样了。

![karma](../.vuepress/public/assets/image/javascript/karma20.png 'karma')

![karma](../.vuepress/public/assets/image/javascript/karma21.png 'karma')

（10）由于生成的报表很重要，接下来我们把生成报表的路径改一下。然后重新执行命令就可以了，就会在 docs 生成一个 html_report 目录。

```json
"paths": {
  "bitmaps_reference": "backstop_data/bitmaps_reference",
  "bitmaps_test": "backstop_data/bitmaps_test",
  "engine_scripts": "backstop_data/engine_scripts",
  "html_report": "docs/html_report", // 修改报表生成位置
  "ci_report": "backstop_data/ci_report"
}
```

（11）先把上面的基本流程练熟了之后，接下来就是要去熟悉操作 puppet 里面的东西了。

## e2e 测试实战

1. 在 tests 目录下新建 e2e 文件夹。

2. e2e 测试最流行的框架是 [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver)，同时它也是学习自动化测试最关键的一个库。

（1）安装这个库

```
npm install selenium-webdriver
```

（2）安装驱动，安装推荐的任意一个都可以

![selenium-webdriver](../.vuepress/public/assets/image/javascript/selenium-webdriver1.png 'selenium-webdriver')

（3）这里选择安装 FireFox 的驱动。

![selenium-webdriver](../.vuepress/public/assets/image/javascript/selenium-webdriver2.png 'selenium-webdriver')

（4）下载完成后解压缩，然后把 geckodriver 放到项目的根目录下。

![selenium-webdriver](../.vuepress/public/assets/image/javascript/selenium-webdriver3.png 'selenium-webdriver')

（5）接着在 e2e 目录下新建一个 baidu.spec.js 文件，然后到 selenium-webdriver 的 npm 上复制下面这段代码到这个文件中，地址改成百度的地址。

```js
const {Builder, By, Key, until} = require('selenium-webdriver');
 
(async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get('https://www.baidu.com/');
    await driver.findElement(By.name('wd')).sendKeys('深圳大学', Key.RETURN);
    await driver.wait(until.titleIs('深圳大学_百度搜索'), 1000);
  } finally {
    await driver.quit();
  }
})();
```

（6）接着执行以下命令

```
node ./tests/e2e/baidu.spec.js
```

但是出现了以下问题。

![selenium-webdriver](../.vuepress/public/assets/image/javascript/selenium-webdriver4.png 'selenium-webdriver')

想了一下，猜测可能是因为我没有安装火狐浏览器，于是下载安装了一个。然后重新运行命令，就发现成功了。命令执行完成后会自动打开火狐浏览器，百度搜索深圳大学，然后再关闭，说明端到端测试完成了。这就是最简单的 e2e 测试。

3. [Nightwatch.js](https://nightwatchjs.org/) 是另一个端到端测试框架，写起来很爽，但是配置起来太复杂、太难了。

4. [Cypress](https://www.cypress.io/) 也是一个端到端测试框架，这个就以配置简单闻名，而且有中文文档。

5. [Rize.js](https://rize.js.org/zh-CN/#%E7%89%B9%E6%80%A7) 是一个提供顶层的、流畅并且可以链式调用的 API 的库，它能让您简单地使用 puppeteer。它的 api 很少，但是却够用。puppeteer 本身是基于 Chrome 的，它的不足就是只能测 Chrome，不能测其他浏览器。

（1）执行以下命令安装 puppeteer 和 rize。

```
npm install --save-dev puppeteer rize
```

npm 安装太慢了，最后使用 cnpm 安装。

```
cnpm install --save-dev puppeteer rize
```

（2）安装完成后，在 e2e 文件夹下新建 github.spec.js 文件，并写入以下代码。

```js
const Rize = require('rize')
const rize = new Rize()

rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
  .waitForNavigation()
  .assertSee('Node.js')
  .end()  // 别忘了调用 `end` 方法来退出浏览器！
```

（3）执行以下命令：

```
node ./tests/e2e/github.spec.js
```

执行命令后需要等待一下，因为是无头浏览器，所以什么东西也看不到，只能等。如果执行成功，就会自动退出命令，如果执行不成功，就会报错。

6. [Jest](https://jestjs.io/zh-Hans/) 是比较全面的一个测试框架，什么都能做，还是希望能够多去使用下，因为后面很多项目实战都会用到。如果项目是 react，那测试框架就选这个了。如果是 vue，就选 cypress。唯一的弱点就是不适合做异步。

7. mocha + chai 和 Jest 是 vue 项目推荐的两套单元测试框架。Cypress 和 Nightwatch 是 vue 项目推荐的两套端到端测试框架。

## 接口测试实战

[mocha](https://mochajs.cn/) 主要用来做接口测试，因为它适合做异步测试。下面就来使用下它。

1. 在 tests 目录下新建 service 文件夹，并建一个 app.js 文件。从 [koa](https://koa.bootcss.com/) 官网上复制一段代码放到文件中。

```js
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = {
    data: '深圳大学'
  };
});

app.listen(3000, () => {
  console.log('服务启动成功');
});
```

2. 接着安装 koa

```
npm install koa --save-dev
```

3. 安装好之后执行

```
node ./tests/service/app.js
```

然后浏览器中访问 localhost:3000 就能看到接口返回的 json。

4. 在 service 目录下再建一个 app.spec.js 文件。

```js
const superagent = require('supertest');
const app = require('./app');

function request() {
    return superagent(app.listen());
}

describe('NodeUii 自动化脚本', function() {
    it('获取后台接口数据', function(done) {
        request()
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    done(new Error('请求出错！'));
                } else {
                    if (res.body.data === '深圳大学') {
                        done();
                    } else {
                        done(new Error('接口数据出错！'));
                    }
                }
            })
    })
    it('404容错脚本', function(done) {
        request().get('/user?').expect(404, done);
    })
})
```

然后 app.js 中要加一句 module.exports = app;，同时还要安装 superagent、mocha 和 mochawesome：

```
npm install superagent mocha mochawesome --save-dev
```

5. 接着在根目录下创建一个 mochaRunner.js 文件。

```js
const Mocha = require('mocha');

const mocha = new Mocha({
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: 'docs/mochawesome-report'
    }
});

mocha.addFile('./tests/service/app.spec.js');

mocha.run(function() {
    process.exit(0);
})
```

此时发现不应该安装 superagent，而是要安装 supertest：

```
npm install supertest --save-dev
```

6. 接着运行以下命令

```
node mochaRunner.js
```

但是此时报错了

![mocha](../.vuepress/public/assets/image/javascript/mocha1.png 'mocha')

检查发现是 res.body.data 而不是 res.body。重新运行就可以了。

![mocha](../.vuepress/public/assets/image/javascript/mocha2.png 'mocha')

可以看到有1个用例成功了，1个用例失败了，此时在 docs 目录下同样能看到生成的文件。

![mocha](../.vuepress/public/assets/image/javascript/mocha3.png 'mocha')

打开 mochawesome.html 文件，就可以看到性能测试报告了。

![mocha](../.vuepress/public/assets/image/javascript/mocha4.png 'mocha')