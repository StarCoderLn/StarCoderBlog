1. [Homebrew](https://brew.sh/index_zh-cn) 是 macOS 或 Linux 的包管理器。

2. 按照官网的安装命令执行之后，却出现了问题。

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

```
Failed to connect to raw.githubusercontent.com port 443: Connection refused
```

3. 解决方法就是在 hosts 文件中加入以下内容，hosts 文件在 etc 目录中。

```
199.232.28.133 raw.githubusercontent.com
```

4. 再执行安装命令就可以发现能正常安装了，但是安装过程特别慢。