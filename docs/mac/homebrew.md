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

**采用以上方法安装的过程实在是太慢了，而且到后面一直会中断，后来没办法就搜了其他的安装方式。**

:bell: **以下方法能安装成功。**

1. 执行以下命令获取 install 文件，并命名为 brew_install。

```shell
curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh >> brew_install
```

2. 下载完成后，打开 brew_install 文件

```shell
vi brew_install
```

然后修改里面的 BREW_REPO。

```
BREW_REPO="https://github.com/Homebrew/brew" 
```

改成

```
BREW_REPO="https://mirrors.ustc.edu.cn/brew.git"
```

3. 网上有的方案会在这一步说执行以下命令：

```shell
ruby brew_install
```

但是我在自己的电脑上执行这句命令时，报了以下错误：

```
#!/bin/bash
Traceback (most recent call last):
ruby: no Ruby script found in input (LoadError)
```

这个问题没搜到什么好的解决方法，后来就放弃了。

改用另一种方式来执行 brew_install 文件。

4. 更改 brew_install 的权限。

```shell
chmod 755 brew_install
```

5. 执行以下命令运行 brew_install。

```shell
./brew_install
```

此时会看到开始正常下载安装了，但是没过一会，就卡在了以下地方：

```
HEAD is now at 84e4e1b44 Merge pull request #8040 from Homebrew/dependabot/bundler/Library/Homebrew/rubocop-performance-1.7.1
==> Homebrew is run entirely by unpaid volunteers. Please consider donating:
  https://github.com/Homebrew/brew#donations
==> Tapping homebrew/core
Cloning into '/usr/local/Homebrew/Library/Taps/homebrew/homebrew-core'...
```

6. 终止以上执行过程，然后依次执行以下命令。

```shell
git clone git://mirrors.ustc.edu.cn/homebrew-core.git/ /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core --depth=1
```

```shell
cd $(brew --repo)
git remote set-url origin https://mirrors.ustc.edu.cn/brew.git
```

```shell
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
```

![homebrew](../.vuepress/public/assets/image/mac/homebrew1.png 'homebrew')

执行完成后，Homebrew 就安装成功了。

此时在终端输入 brew 命令就会发现是绿色的了，回车后会输出 brew 的帮助信息。

```
Example usage:
  brew search [TEXT|/REGEX/]
  brew info [FORMULA...]
  brew install FORMULA...
  brew update
  brew upgrade [FORMULA...]
  brew uninstall FORMULA...
  brew list [FORMULA...]

Troubleshooting:
  brew config
  brew doctor
  brew install --verbose --debug FORMULA

Contributing:
  brew create [URL [--no-fetch]]
  brew edit [FORMULA...]

Further help:
  brew commands
  brew help [COMMAND]
  man brew
  https://docs.brew.sh
```