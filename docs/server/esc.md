## 安装 Node

1. 在服务器上下载 node 包，放在 opt 目录下。各个版本的 node 包下载地址在这：[下载](https://nodejs.org/zh-cn/download/releases/)。

```shell
wget https://https://nodejs.org/dist/v12.18.3/node-v12.18.3-linux-x64.tar.xz
```

2. 将压缩包进行解压。

- 将 .tar.xz 解压成 .tar

```shell
xz -d node-v12.18.3-linux-x64.tar.xz
```

- 再进一步解压 .tar 包

```shell
tar -xvf node-v12.18.3-linux-x64.tar
```

3. 设置环境变量，在 /etc/profile 文件中输入以下内容。

```shell
export NODE_HOME=/opt/node-v12.18.3-linux-x64
export PATH=$NODE_HOME/bin:$PATH
```

保存之后，执行以下命令让环境变量生效。

```shell
source profile
```

4. 检查 node 和 npm 是否安装成功。

![esc](../.vuepress/public/assets/image/server/esc1.png 'esc')

## 安装 wrk

1. 进入到 opt 目录中，从 wrk 的 github 代码仓库拉下来代码。

```shell
git clone https://github.com/wg/wrk.git
```

2. 进入到 wrk 目录中，执行 make 命令。

```shell
cd wrk
make
```

::: warning 注意
make 命令需要用到 gcc 编译，所以服务器要先安装好 gcc，才可以使用。

```shell
yum install gcc
```
:::

3. 将 wrk 的可执行文件移动到 /usr/local/bin 中。

```shell
sudo cp wrk /usr/local/bin
```

4. 检查 wrk 是否安装成功。

![esc](../.vuepress/public/assets/image/server/esc2.png 'esc')