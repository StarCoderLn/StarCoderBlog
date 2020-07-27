本文的主要内容有以下两部分：

- 使用 Webpack 编译前端代码。

- 使用 Gulp 对 Node.js 项目进行流清洗。

## 调整项目目录结构

1. 在之前做好的项目基础上，新建一个 src 文件夹，并在其下面新建 web 和 server 两个文件夹。然后把原来的 models、config、libs、logs、controllers 文件夹和 app.js 文件整个挪到 server 里面，原来的 views、widgets 和 assets 文件夹整个挪到 web 里面。web 就是你的前端项目，server 就是你的后端项目。

2. 完成以上调整后，再新建 gulpfile.js 和 webpack.config.js 文件，前者主要用来编译 Node.js，后者主要用来编译前端项目，编译完后还会生成一个 dist 目录。**为什么要使用 gulp 而不是使用 webpack 来编译 Node.js？**

- gulp 简单，能够很简单的对 ES6 需要的地方进行编译。

- 清洗项目的时候灵活。

- webpack 太慢了。webpack 强势的地方在于解决依赖的问题。

调整好之后的目录结构如下：

![buildtool](../.vuepress/public/assets/image/engineering/cli1.png 'buildtool')

## 使用 Webpack 编译前端代码

1. 首先安装 webpack-cli 和 webpack。

```
npm install webpack-cli webpack -D
```

2. 在编写 webpack.config.js 之前，先来看下 package.json 文件的一些功能。

- package.json 其实也是有生命周期的，比如在 scripts 中添加以下两句。

```json
"scripts": {
    "pretest": "echo 11",
    "test": "echo 22"
}
```

然后执行 npm run test，会看到先输出 pretest 钩子的内容，再输出 test 钩子的内容。

![buildtool](../.vuepress/public/assets/image/engineering/buildtool1.png 'buildtool')

- 并行运行多条命令。

```json
"scripts": {
    "dev": "echo 11",
    "server": "echo 22",
    "start": "npm run dev & npm run server"
}
```

结果如下：

![buildtool](../.vuepress/public/assets/image/engineering/buildtool2.png 'buildtool')

- 串行运行多条命令。

```json
"scripts": {
    "dev": "echo 11",
    "server": "echo 22",
    "start": "npm run dev && npm run server"
}
```

结果如下：

![buildtool](../.vuepress/public/assets/image/engineering/buildtool3.png 'buildtool')

- npm-run-all

不管是并行还是串行运行多条命令，上面的写法都有点繁琐，可以用 [npm-run-all](https://www.npmjs.com/package/npm-run-all) 这个包来简化写法。它可以通过指定参数来实现并行或者串行执行多条命令。

需要全局安装，局部安装好了之后还是会提示 npm-run-all 命令不存在。

```
sudo npm install -g npm-run-all
```

使用方法也很简单：

```shell
# 串行
npm-run-all dev server

# 并行
npm-run-all --parallel dev server
```

或者：

```shell
# 串行
run-s dev server

# 并行
run-p dev server
```

- 添加可能需要的脚本命令和对应的脚本文件。比如：

```json
"scripts": {
    "client:dev": "webpack --mode development",
    "client:prod": "webpack --mode production",
    "server:start": "npm run dev && npm run server",
    "server:dev": "cross-env NODE_ENV=development gulp",
    "server:prod": "cross-env NODE_ENV=production gulp"
}
```

然后我们需要新建一个 scripts 文件夹，并在其下新建 server 和 client 文件夹，用来存放脚本执行文件，每个脚本执行文件的名称跟 scripts 中冒号后面的名称相对应。可以是 .sh 格式（shell 文件），也可以是 .js 格式。

![buildtool](../.vuepress/public/assets/image/engineering/buildtool4.png 'buildtool')

- scripty

[scripty](https://www.npmjs.com/package/scripty) 能够帮我们自动定位到相应的脚本文件，安装好这个包之后，scripts 里的命令就可以大大简化了。

先把 scripts 里的命令都移动到各自的脚本文件中，然后再把每行命令的内容改为 scripty 就行了。

```shell
# client/dev.sh
webpack --mode development

# client/prod.sh
webpack --mode production

# server/start.sh
cross-env NODE_ENV=development nodemon ./dist/app.js

# server/dev.sh
cross-env NODE_ENV=development gulp

# server/prod.sh
cross-env NODE_ENV=production gulp
```

```json
"scripts": {
    "client:dev": "scripty",
    "client:prod": "scripty",
    "server:start": "scripty",
    "server:dev": "scripty",
    "server:prod": "scripty",
    "start": "",
    "build": "npm-run-all client:prod erver:prod"
}
```

改好之后试着执行下 `npm run client:dev`，却发现报了下面的错误。

![buildtool](../.vuepress/public/assets/image/engineering/buildtool5.png 'buildtool')

这是因为 scripts 文件夹下面的 shell 文件还没有执行权限，我们可以使用下面的命令给它们都加上执行权限。

```shell
chmod -R +x ./scripts

# 或者

chmod 600 ./scripts
```

然后重新执行命令就可以了。

这样，我们就把 package.json 文件过渡到能够执行 shell 命令了，它不再只是一个依赖包的管理文件。此时的 package.json 就拥有了十分强大的功能了，它甚至可以在远程服务器上编译代码，实现集群编译。

> 集群编译是指，把我们本地的不同资源（css、js、静态资源图片等等）分别通过 scp 命令上传到各个专门处理相应资源的其他服务器上进行编译，编译完成后的资源再从各个服务器回传到本地，这样，我们就同时拥有了各种资源的编译结果。这就是所谓的集群编译。

- 在 package.json 中使用自定义的参数。

```json
"scripts": {
    "star": "echo $npm_package_config_port"
},
"config": {
    "port": 3000
}
```

执行 `npm run star` 之后就会看到输出了3000。

![buildtool](../.vuepress/public/assets/image/engineering/buildtool6.png 'buildtool')

直接执行 `npm run env` 能够得到 npm 的所有参数。

![buildtool](../.vuepress/public/assets/image/engineering/buildtool7.png 'buildtool')
