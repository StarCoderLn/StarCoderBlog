本文主要介绍如何开发一个脚手架的基本框架。

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

::: warning 注意
解释下 `#!/usr/bin/env node` 这句代码的作用。

- 首先，`#!` 其实是一个符号，这个符号在 Linux 或 Unix 中被称为 `Shebang`。**用于指明这个脚本文件的解释程序**，因此加这一行的目的就是指定 Node.js 来执行脚本文件。

- 其次，由于不同用户或者不同的脚本解释器有可能安装在不同的目录下，那么系统如何知道要去哪里找解释程序呢？ `/usr/bin/env` 就是**告诉系统可以去 PATH 目录中查找，这就解决了不同用户的 Node.js 路径不同的问题，可以让系统动态的去查找 Node.js 来执行你的脚本文件**。有时候如果加了这一行，碰到了 `No such file or directory` 这样的错误，那应该是你的 Node.js 没有添加到系统的 PATH 中，配置下就好了。

- 最后，**这句命令一定要放在第一行才会生效**！如果是 window 系统，就不需要加这一行了，也能执行，因为 **window 系统并不支持 Shebang，它是通过文件的扩展名来确定使用什么解释器来执行脚本**。
:::

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

::: warning 注意
在 window 上还会报找不到 @darkobits/lolcatjs 这个包的错误，原因是这个包是全局安装的，而 Node.js 默认不在全局找包。我们需要配置环境变量才能解决这个问题，那么如何配置呢？

- 首先，通过 `where node` 命令查看自己本机的 Node.js 的安装路径，比如我自己的是在：C:\Program Files\nodejs\node.exe。 

- 然后，打开文件夹，输入 `控制面板\系统和安全\系统` 打开系统设置页面，再点击 `高级系统设置` -> `环境变量`。

- 最后，在当前用户的环境变量里或者是系统变量里增加一个环境变量 `NODE_PATH`，值是 `C:\Program Files\nodejs\node_modules`。配置好之后重新打开终端，执行命令就没问题了。
:::

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

5. quicktype

[quicktype](https://quicktype.io/) 是一个能将 JSON 转换为任何语言的包。需要全局安装。

[chalk](https://www.npmjs.com/package/chalk) 是一个能使文字以某种颜色高亮显示的包。

```js
#!/usr/bin/env node
const figlet = require('figlet');
const fontStr = figlet.textSync('linnan');
const version = require('../package').version;
const Printer = require('@darkobits/lolcatjs');
const transformed = Printer.default.fromString(` 星际开发脚手架：${version} \n ${fontStr}`);
const chalk = require('chalk');
const shell = require('shelljs');
const { program } = require('commander');

program.version(transformed);

program
  .option('-u, --update', 'Get lastest version')
  .option('-d, --download', 'Download a project')
  .option('-c, --create', 'Create a project')
  .option('-j, json', 'Convert JSON to any language');

const handlers = {
  json(dataURL) {
    shell.exec(`quicktype ${dataURL} -o ${shell.pwd().stdout}/Weather.ts --runtime-typecheck`);
    // shell.exec(`quicktype ${dataURL} -o Weather.ts --runtime-typecheck`);
  }
}

program
  .usage('[cmd] <options>')
  .arguments('<cmd> [env]')
  .action((cmd, otherParams) => {
    const handler = handlers[cmd];
    if (typeof handler == 'undefined') {
      console.log(chalk.blue(`${cmd}`) + chalk.red('暂未支持'));
    } else {
      handler(otherParams);
    }
  });

program.parse(process.argv);
```

6. 脚手架的基本要求

- 用 [inquirer](https://www.npmjs.com/package/inquirer) 完成与用户的交互。

- 能够根据用户的选择，下载 github 项目，[download-git-repo](https://www.npmjs.com/package/download-git-repo)。

- 下载下来的项目能够放到用户指定的目录，利用 [shelljs](https://www.npmjs.com/package/shelljs)、[ora](https://www.npmjs.com/package/ora)（一个能提供 loading 效果的包）。

- 帮用户完善最终的操作。npm install / yarn install

::: warning 注意
使用脚手架之前，要确保有一个模版项目可供下载，不然这个脚手架就发挥不了用处了。
:::