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

**5. 使用 SonarQube**

（1）登录完成后，我们需要先安装一个中文插件 Chinese Pack，安装完成后需要重启服务器，就可以看到界面是中文的了。

![sonar](../.vuepress/public/assets/image/engineering/sonar15.png 'sonar')

![sonar](../.vuepress/public/assets/image/engineering/sonar16.png 'sonar')

（2）接着创建一个新项目。

- 设置项目名称。

![sonar](../.vuepress/public/assets/image/engineering/sonar17.png 'sonar')

- 创建一个令牌（token），给客户端使用。

  **我创建的令牌是：tuoniaodan_token:8d6a0260d4dda3009a652ac176062ef5ef11bfd1。**

![sonar](../.vuepress/public/assets/image/engineering/sonar18.png 'sonar')

![sonar](../.vuepress/public/assets/image/engineering/sonar19.png 'sonar')

- 配置项目。

![sonar](../.vuepress/public/assets/image/engineering/sonar20.png 'sonar')

点击图里的下载按钮可以下载扫描器（SonarScanner）。

到此，服务端的配置就完成了。

**6. SonarScanner 的安装与使用**

[SonarScanner](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/) 是一个命令行工具。

（1）首先下载 SonarScanner 的安装包，然后解压。可以使用 unzip 命令解压，也可以直接右键解压。

（2）配置环境变量。

:bell: **这里要注意，对于 mac 默认的终端 bash，配置环境变量的文件是 .bash_profile，但是，我使用的终端是 zsh，它的环境变量配置文件是 .zshrc**。

- 首先进入到 .zshrc 文件中

```shell
vi .zshrc

# 或者

open -e .zshrc
```

- 然后在 .zshrc 文件中加上以下变量。SONAR_SCANNER_HOME 是一个变量名，名字可以随意命名。它的值就是 SonarScanner 解压后安装包的位置。因为我们需要把 SonarScanner 的 bin 目录配置到环境变量中。

```shell
export SONAR_SCANNER_HOME=/Users/linnan/Desktop/projects/sonar-scanner-4.4.0.2170-macosx
export PATH=$PATH:$SONAR_SCANNER_HOME/bin
```

![sonar](../.vuepress/public/assets/image/engineering/sonar21.png 'sonar')

- 配置好之后，还需要执行命令 `source .zshrc` 来使环境变量生效。最后在终端执行 `snoar-scanner -h` 命令，如果看到以下信息就说明安装成功了。

![sonar](../.vuepress/public/assets/image/engineering/sonar22.png 'sonar')

（3）安装好 SonarScanner 之后，我们就可以配合 SonarQube 来扫描项目了。首先我们需要在本机上有一个项目，然后在这个项目的根目录下创建一个 `sonar-project.properties` 文件，并在文件中添加以下命令。

```shell
# must be unique in a given SonarQube instance
sonar.projectKey=my:project

# --- optional properties ---

# defaults to project key
sonar.projectName=sell
# defaults to 'not provided'
#sonar.projectVersion=1.0
 
# Path is relative to the sonar-project.properties file. Defaults to .
sonar.sources=src
 
# Encoding of the source code. Default is default system encoding
#sonar.sourceEncoding=UTF-8
```

其中 sonar.projectKey 是一个唯一的标识，随便给个值就行，sonar.projectName 就是你的项目名称，sonar.sources 是项目中源代码所在的目录。

（4）配置好以上步骤之后，启动 SonarQube。在项目里执行以下命令，就会自动扫描我们的项目。扫描完成后就会生成关于项目的一些报表。在 SonarQube 的项目页面里可以看到。

```shell
sonar-scanner
```

![sonar](../.vuepress/public/assets/image/engineering/sonar23.png 'sonar')

![sonar](../.vuepress/public/assets/image/engineering/sonar24.png 'sonar')

（5）如果想知道扫描器是以什么规则去扫描代码的，可以在代码规则页面里查看。我们的项目是用什么语言，就在点击左侧对应的语言查看相关的规则。规则也可以自己根据公司的规范进行设定。而且点击每条规则之后还会有详细说明，这个说明文档也可以供我们学习。

**7. SonarQube 的价值所在**

- SonarQube 看起来好像跟 ESlint 的功能差不多，只不过是多了个服务器。**但是，SonarQube 真正值钱的地方在于它的处理流程，这个系统能够接入到 Jenkins，并且扫描出问题之后还能接入到缺陷管理相关的系统里，比如：Jira。它是代码质量管理流程中很重要的一个环节**。

**8. SonarQube 的处理流程**

- SonarQube 的架构值得我们学习，它有一个服务器 server，然后在本机上有一个扫描器 scanner。处理流程是这样的：

- 首先 scanner 通过 token 登录到 server 上，然后把代码规则拉下来，之后 scanner 再去扫描项目代码，扫描检查完项目代码之后，先在本机上生成一份检查报告，再把这份报告上传到服务器上。因此，要记住一点，扫描器 scanner 不能离开服务器 server。

**9. SonarQube 配置数据库**

- SonarQube 下载下来之后，需要配置数据库。不过，不配置也没关系，但是自带的数据库性能不高，用于学习和处理一些小项目是没问题的，但是处理大项目时可能就撑不住了。数据库在 sonar.properties 文件中配置，这个文件位于 sonarqube-8.4.0.35506 目录下的 conf 目录里。需要配置的是下面这些：

  ```shell
  # 数据库名称
  sonar.jdbc.username=...
  # 数据库密码
  sonar.jdbc.password=...
  # 数据库连接串
  sonar.jdbc.url=... 
  ```

- 还要注意，官方的 SonarQube 不支持 MySQL 数据库，默认支持的数据库是 PostgreSQL，这是一个开源的数据库。此外，还支持 ms SQL（微软的 SQLServer 数据库服务器）和 Qracle。如果想用 MySQL 的话，还得去下载 [MySQL Connector/J](https://dev.mysql.com/downloads/)。

