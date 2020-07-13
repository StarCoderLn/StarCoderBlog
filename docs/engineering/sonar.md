## Java 环境搭建

1. Java 环境的搭建需要下载安装 jdk。记住：一定要从 [oracle 官网](https://www.oracle.com/index.html) 下载最新的版本 [jdk 下载](https://www.oracle.com/java/technologies/javase-jdk14-downloads.html)，不要通过其他渠道下载，因为后面的 SonarQube 对 Java 版本是有要求的。我的电脑是 mac，所以就下载 .dmg 格式的安装包。下载完成后直接傻瓜式进行安装就行了。


2. 安装完成后，我们可以通过 java -version 命令来查看是否安装成功。

![sonar](../.vuepress/public/assets/image/engineering/sonar1.png 'sonar')

## SonarQube 安装与启动

[SonarQube](https://www.sonarqube.org/) 是一款代码质量和安全检测工具。它的安装与启动就比较麻烦，会遇到不少坑。下面就记录我遇到的一些坑。

1. 首先需要从 SonarQube 官网上下载 .zip 格式的安装包。下载完成后，可以在终端通过以下命令进行解压。

```shell
unzip sonarqube-8.4.0.35506.zip
```

解压完成后，将解压后的文件夹放到 opt 目录下，可以通过以下命令移动。

```shell
# 在 root 用户下
mv sonarqube-8.4.0.35506 /opt

# 在普通用户下
sudo mv sonarqube-8.4.0.35506 /opt
```

2. 进入到 sonarqube-8.4.0.35506 目录中，可以看到有以下文件。

![sonar](../.vuepress/public/assets/image/engineering/sonar2.png 'sonar')

再进入到 bin 目录中，这里面存放的就是一些存放启动脚本的目录，分别有 Linux、macOS 和 Windows 三种系统的，我的电脑是 macOS 系统，所以我选择 macosx-universal-64 目录。

![sonar](../.vuepress/public/assets/image/engineering/sonar3.png 'sonar')

最后再进入 macosx-universal-64 目录中，里面有以下三个文件。其中 sonar.sh 就是我们启动需要用到的启动脚本。

![sonar](../.vuepress/public/assets/image/engineering/sonar4.png 'sonar')

3. 我们可以通过执行 ./sonar.sh 命令来查看都有哪些帮助命令。

![sonar](../.vuepress/public/assets/image/engineering/sonar5.png 'sonar')

看起来 start 就是我们需要的启动命令，但是，注意这里不要用 start 命令去启动，因为用这个命令启动了之后并不能知道 SonarQube 启动成功了没。我们应该使用 console 命令来启动，因为它会打印出日志信息，出错了我们也好排查错误。

```shell
./sonar.sh console
```

4. 启动过程中碰到的问题。

- 第一个问题是这样的：

![sonar](../.vuepress/public/assets/image/engineering/sonar6.png 'sonar')

看到这个的时候一脸懵逼，看起来没输出什么错误啊，但是怎么跑不起来呢。肯定有某些地方出了问题，排查错误的一般方法如下：

（1）首先，先看下打印的日志中有没有错误信息；

（2）其次，再看看 macosx-universal-64 目录下生成的 wrapper.log 文件的内容，看看是不是打包器的问题。如果没有这个文件或者是文件内容为空，说明不是它的问题；

（3）最后，可以看下 sonarqube-8.4.0.35506 目录下的 logs 目录，里面有两个错误日志文件，先看 sonar.log，如果没找到问题，再看 es.log。

![sonar](../.vuepress/public/assets/image/engineering/sonar7.png 'sonar')

最终在 es.log 文件中找到了出错的原因：

![sonar](../.vuepress/public/assets/image/engineering/sonar8.png 'sonar')

细看不难发现：不能以 root 身份启动。既然不能以 root 身份启动，那我们需要以什么身份启动呢？

进入到 sonarqube-8.4.0.35506 目录下，然后查看目录里边所有文件的详细信息。里面的文件的所属用户是谁，我们就得用那个用户身份启动。而所属用户是你在解压的时候确定的，以哪个用户身份进行解压，所属用户就是哪个用户身份。

![sonar](../.vuepress/public/assets/image/engineering/sonar9.png 'sonar')

于是，我切换到 linnan 这个用户身份后，重新启动。却出现了第二个问题。

- 第二个问题是这样的：

![sonar](../.vuepress/public/assets/image/engineering/sonar10.png 'sonar')

可以发现这是文件的权限问题。解决方法就是修改下文件权限：

```shell
# 在 root 用户下
chmod 777 /opt/sonarqube-8.4.0.35506/temp/sharedmemory

# 在普通用户下
sudo chmod 777 /opt/sonarqube-8.4.0.35506/temp/sharedmemory
```

然后又出现了第三个问题。

- 第三个问题是这样的：

![sonar](../.vuepress/public/assets/image/engineering/sonar11.png 'sonar')

这是因为 /opt/sonarqube-8.4.0.35506/temp/conf/es/elasticsearch.yml 这个文件的所属用户并不是 linnan，而是 root。

![sonar](../.vuepress/public/assets/image/engineering/sonar12.png 'sonar')

所以需要改下这个文件的所属用户，修改命令如下：

```shell
# 在 root 用户下
chown linnan /opt/sonarqube-8.4.0.35506/temp/conf/es/elasticsearch.yml

# 在普通用户下
sudo chown linnan /opt/sonarqube-8.4.0.35506/temp/conf/es/elasticsearch.yml
```

改好之后重新启动，还会遇到其他的文件也有上面第二、第三种类型的问题，一一解决就好了。

解决完所有问题之后终于启动成功了！

![sonar](../.vuepress/public/assets/image/engineering/sonar13.png 'sonar')

在浏览器中访问 localhost:9000 就可以看到启动界面：

![sonar](../.vuepress/public/assets/image/engineering/sonar14.png 'sonar')

可以点击右上角进行登录，默认的用户名和密码都是 admin。