## 调整项目目录结构

1. 在之前做好的项目基础上，新建一个 src 文件夹，并在其下面新建 web 和 server 两个文件夹。然后把原来的 models、config、libs、logs、controllers 文件夹和 app.js 文件整个挪到 server 里面，原来的 views、widgets 和 assets 文件夹整个挪到 web 里面。web 就是你的前端项目，server 就是你的后端项目。

2. 完成以上调整后，再新建 gulpfile.js 和 webpack.config.js 文件，前者主要用来编译 Node.js，后者主要用来编译前端项目，编译完后还会生成一个 dist 目录。**为什么要使用 gulp 而不是使用 webpack 来编译 Node.js？**

- gulp 简单，能够很简单的对 ES6 需要的地方进行编译。

- 清洗项目的时候灵活。

- webpack 太慢了。webpack 强势的地方在于解决依赖的问题。

调整好之后的目录结构如下：

![cli](../.vuepress/public/assets/image/engineering/cli1.png 'cli')

## 开发脚手架

1. 新建一个 star-cli 项目，并新建一个 bin 文件夹。然后进入到这个项目中，执行 npm init -y 初始化项目。

2. 在 star-cli 项目的 bin 目录下新建 starcli 文件。我们可以在项目目录下使用 Node.js 去执行这个文件：node ./bin/starcli。但是如果想全局去执行这个文件，就需要在 package.json 中加上 bin。

```
"bin": {
    "star": "bin/starcli"
}
```

然后执行 npm link，就会链接到全局的 node。可以使用 where node 命令查看全局的 node 路径。

![cli](../.vuepress/public/assets/image/engineering/cli2.png 'cli')

此时在全局就有一个 star 命令了。

![cli](../.vuepress/public/assets/image/engineering/cli3.png 'cli')

在 starcli 文件中输入以下内容：

```js
#!/usr/bin/env node
console.log(123);
```

然后在终端执行 star 就能看到输出结果了。

![cli](../.vuepress/public/assets/image/engineering/cli4.png 'cli')

3. 接下来就可以开始整活了。首先我们可以弄一个好玩的字符画，这需要用到 [figlet](https://www.npmjs.com/package/figlet)。直接 npm install figlet 安装就行了。

在 starcli 中编辑以下代码：

```js
#!/usr/bin/env node
const figlet = require('figlet');
const fontStr = figlet.textSync('linnan');
console.log(fontStr);
```

然后执行 star 命令，就可以看到终端输出字符画了。不过这个字符画看起来有点丑，我们是可以自己设置它的字体、大小什么的，具体参考 figlet 的用法。

![cli](../.vuepress/public/assets/image/engineering/cli5.png 'cli')

我们可以给这个字符画加一些颜色，需要用到 [lolcatjs](https://www.npmjs.com/package/@darkobits/lolcatjs)。**一定要全局安装它**，然后补充 starcli 的内容。

这里需要注意的一点是，lolcatjs 官方的用法是需要用 import 来使用的，但是我们这里暂时不支持 import，只能用 require 的方式，可是使用 require 方法引入包会有问题，会报 “Printer.fromString is not a function” 的错误。解决方法就是通过 `Printer.default.fromString` 的方式调用。

```js
#!/usr/bin/env node
const figlet = require('figlet');
const fontStr = figlet.textSync('linnan');
const Printer = require('@darkobits/lolcatjs');
const transformed = Printer.default.fromString(fontStr);
console.log(transformed);
```

执行后就会看到以下效果。

![cli](../.vuepress/public/assets/image/engineering/cli6.png 'cli')

4. 弄好字符画之后，接下来看看怎么实现接受用户的命令执行不同的操作。

这块功能需要用到两个经典的库：[shelljs](https://www.npmjs.com/package/shelljs) 和 [commander](https://www.npmjs.com/package/commander)。shelljs 是一个在 js 文件中编写 shell 脚本的库，而 commander 就是用来接收处理用户命令的库。

在 starcli 文件中补充以下代码：

```js
#!/usr/bin/env node
const figlet = require('figlet');
const fontStr = figlet.textSync('linnan');
const Printer = require('@darkobits/lolcatjs');
const transformed = Printer.default.fromString(fontStr);
const { program } = require('commander');

program.version(transformed);

program
  .option('-u, --update', 'Get lastest version')
  .option('-d, --download', 'Download a project')
  .option('-c, --create', 'Create a project');
 
program.parse(process.argv);

// console.log(transformed);
```

然后执行 star --help 或者 star -h 就可以看到我们创建的那些命令了。

![cli](../.vuepress/public/assets/image/engineering/cli7.png 'cli')

执行 star -V 或者 star --version 就可以看到字符画。

![cli](../.vuepress/public/assets/image/engineering/cli8.png 'cli')

我们也可以直接读取 package.json 里面的 version，然后输出出来。

```js
#!/usr/bin/env node
const figlet = require('figlet');
const fontStr = figlet.textSync('linnan');
const version = require('../package').version;
const Printer = require('@darkobits/lolcatjs');
const transformed = Printer.default.fromString(` 星际开发脚手架：${version} \n ${fontStr}`);
const { program } = require('commander');

program.version(transformed);

program
  .option('-u, --update', 'Get lastest version')
  .option('-d, --download', 'Download a project')
  .option('-c, --create', 'Create a project');
 
program.parse(process.argv);

// console.log(transformed);
```

执行效果如下：

![cli](../.vuepress/public/assets/image/engineering/cli9.png 'cli')
