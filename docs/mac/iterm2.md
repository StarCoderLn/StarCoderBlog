这篇文章主要介绍的是如何美化 mac 终端，一个好看的终端能让我们在开发的时候赏心悦目。

开始之前，需要具备以下几点：

- 一台 mac
 
- 安装了 iTerm2

- 具备 Linux 基础知识

## iTerm2

[iTerm2](https://www.iterm2.com/)是mac系统下的一款非常好用的终端工具，它比系统自带的Terminal好用得多。有丰富的特色功能供，比如快捷键、分屏、定制终端主题颜色等；这些功能极大的提高我们敲命令的效率，强烈推荐每一个程序员都尝试和习惯使用这款工具。直接官网下载安装即可。

## 配置方法

**1. 安装主题**

首先需要下载 [seti_ui](https://github.com/willmanduffy/seti-iterm) ，下载好之后放到指定的位置，比如桌面。然后打开 iTerm2 -> preferences -> profiles -> colors -> colors presets -> import选中刚才的文件。

![mac](../.vuepress/public/assets/image/mac/mac1.jpg 'mac')

**2. 让命令变色**

打开 iTerm，输入命令 vim ~/.bash_profile，然后输入以下内容，开启 iTerm 的颜色支持。

```shell
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
export PS1='\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\
[\033[00m\]\$ '
```

**3. 找到自己喜欢的字符画**

将自己喜欢的字符画放在名为 webcome.txt 的文件中，可以将这个文件放在任意位置，只要方便自己后面修改就行了。

```
,--^----------,--------,-----,-------^--,
  | |||||||||   `--------'     |         O 
 `+---------------------------^----------|
   `_,-------, _________________________| 
     / XXXXXX /`|    /
    / XXXXXX /  `   /
   / XXXXXX /______(
  / XXXXXX /
 / XXXXXX /
(________( ☄ ❄ linnan@1996 ❅ ☼ 
 `------'
```

**4. 让字符变得漂亮起来**

安装 [lolcat](https://github.com/busyloop/lolcat)，安装方法如下：

（1）gem install lolcat

（2）vi ~/.bash_profile

（3）将自己的 webcome.txt 文件的存放路径放在 .bash_profile 这个文件的最上面，比如我这里的路径是：lolcat ~/Desktop/webcome.txt。此时整个 .bash_profile 文件的内容应该如下：

![mac](../.vuepress/public/assets/image/mac/mac2.jpg 'mac')

（4）在这里，我们可以在 iTerm 中输入 lolcat ~/Desktop/webcome.txt 先测试下字符画能否正常显示。

**5. 下载安装字体库**

我们需要安装 [powerline](https://github.com/powerline/fonts) 这个字体库，安装完字体库之后，把 iTerm2 的设置里的 Profile 中的 Text 选项卡中里的 Regular Font 和 Non-ASCII Font 的字体都设置成 Powerline 的字体，我这里设置的字体是 12pt Meslo LG S DZ for Powerline。

![mac](../.vuepress/public/assets/image/mac/mac3.jpg 'mac')

这里需要注意的是，安装完字体库之后，需要重启 iTerm2，才能够在配置中找到这种字体。

**6. 安装 oh-my-zsh**

```shell
curl -L https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh | sh
```

但是当我输入这条命令时，却提示我：

```shell
Failed to connect to raw.githubusercontent.com port 443: Connection refused
```

后来搜索到了解决方法如下：

（1）首先，这个网站是需要科学上网才能访问的。

（2）开启科学上网之后，访问 https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh，可以访问的话会看到以下内容：

![mac](../.vuepress/public/assets/image/mac/mac4.jpg 'mac')

（3）接下来，把这个网页保存下来，命名为：zsh.sh 文件，注意，文件名可以任意，只要后缀是 .sh 就行了。然后打开终端，先给 zsh.sh 文件加上执行权限：

```shell
chmod +x zsh.sh
```

然后执行这个文件：

```shell
./zsh.sh
```

就大功告成啦～

![mac](../.vuepress/public/assets/image/mac/mac5.jpg 'mac')

按道理，配置到这里，打开终端的时候应该就能看到一把枪了，可奇怪的是，我的却没有自动出现一把枪，只有运行命令的时候才会出来。找了很久也不知道什么原因，无奈只好继续往下配置。

**7. 高亮显示**

首先，下载 [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting.git)

然后执行命令 vi .zshrc 打开 .zshrc 文件，在我的电脑中这个文件就在 ～ 目录下，是一个隐藏文件，需要用 ls -a 或 ls -al 才能看到。打开文件后在最下面添加这句话：

```shell
source XXX/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```

其中，XXX 表示的是 .zshrc 文件所在的目录。在我的电脑中是 /Users/linnan，也可以直接用 ～。

接着，执行命令

```shell
cd ~/.oh-my-zsh/custom/plugins
```

再次打开 .zshrc 文件，也是在最下面添加以下内容：

```shell
plugins=(zsh-syntax-highlighting)
```

此时，.zshrc 文件中的内容如下：

![mac](../.vuepress/public/assets/image/mac/mac6.jpg 'mac')

**8. 换主题**

首先，执行命令 

```shell
cd ~/.oh-my-zsh/themes
```

然后在这个目录下下载 agnoster 主题：

```shell
git clone https://github.com/agnoster/agnoster-zsh-theme.git
```

接着，执行 vi .zshrc 打开 .zshrc 文件，然后将里面的 ZSH_THEME 字段值改成 agnoster。即 ZSH_THEME = "agnoster" （agnoster就是要设置的主题）。

最后一步，也是最关键的一步，将之前在 .bash_profile 文件中添加的启动欢迎脚本删掉：

```shell
lolcat ~/Desktop/webcome.txt
```

然后在 .zrhrc 文件中添加这句脚本，如下：

![mac](../.vuepress/public/assets/image/mac/mac7.jpg 'mac')

重新启动终端，就可以看到梦寐以求的手枪啦 :laughing:

![mac](../.vuepress/public/assets/image/mac/mac8.jpg 'mac')

打开 vscode，也照样能看到 :laughing:

![mac](../.vuepress/public/assets/image/mac/mac9.jpg 'mac')