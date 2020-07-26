本文主要展示如何在服务器上安装 Jenkins。

## 安装 Java

1. 下载 .rpm 格式的 jdk 安装包到本地电脑。

2. 执行 [scp](https://www.runoob.com/linux/linux-comm-scp.html) 命令，将 jdk 安装包上传到服务器上，一般放在 opt 目录中，因为这个目录是用来存放应用程序的。注意，以下命令中的 scl 是我之前创建的免密登录服务器的别名。如果没有配置本地免密登录文件，则需要使用`服务器登录用户名@ IP 地址或域名`的形式。比如：`scp jdk-14.0.1_linux-x64_bin.rpm root@120.78.199.123:/opt`

```shell
scp jdk-14.0.1_linux-x64_bin.rpm scl:/opt
```

执行完毕后，登录服务器就可以看到 opt 目录中已经有上传的安装包了。

![jenkins](../.vuepress/public/assets/image/engineering/jenkins1.png 'jenkins')

3. 在服务器上，进入到 opt 目录中，执行 [rpm](https://www.runoob.com/linux/linux-comm-rpm.html) 命令进行安装。

```shell
rpm -ivh jdk-14.0.1_linux-x64_bin.rpm
```

这样，Java 开发需要的 jdk 环境就安装成功了。

## 安装 Jenkins

1. 我的服务器的系统是 ContOS 7，而[官网](https://www.jenkins.io/zh/doc/book/installing/)介绍的安装方式中，并没有这个系统的。注意，apt-get 命令是 Ubuntu 系统上的，在 ContOS 7 上安装软件包应该用 yum 命令。

2. ContOS 7 的 Jenkins 安装包可以从 [redhat](https://pkg.jenkins.io/redhat/) 获取，在服务器中执行相应的命令即可完成安装。

![jenkins](../.vuepress/public/assets/image/engineering/jenkins2.png 'jenkins')

![jenkins](../.vuepress/public/assets/image/engineering/jenkins3.png 'jenkins')

3. 配置用户名和端口号。首先执行 `find / -name jenkins` 命令，可以得到 jenkins 相关的所有目录。

```
/usr/lib/jenkins
/var/lib/yum/repos/x86_64/7/jenkins
/var/lib/jenkins
/var/cache/yum/x86_64/7/jenkins
/var/cache/jenkins
/var/log/jenkins
/run/lock/subsys/jenkins
/etc/logrotate.d/jenkins
/etc/sysconfig/jenkins
/etc/rc.d/init.d/jenkins
```

`/etc/sysconfig/jenkins` 这个就是 jenkins 的配置文件所在的目录。

执行 `vi /etc/sysconfig/jenkins` 命令可以进入配置文件中修改用户名和端口号。

```shell
JENKINS_USER = "root"  # 防止权限问题
JENKINS_PORT = "8082"  # 防止端口冲突
```

## 启动 Jenkins

1. 安装完成后，使用 `service jenkins` 命令可以查看 jenkins 的一些命令。可以使用 `service jenkins start` 命令来启动 jenkins。

![jenkins](../.vuepress/public/assets/image/engineering/jenkins4.png 'jenkins')

2. 此时，在本地电脑的浏览器中访问 `<你的服务器外网地址>:端口号`，我这里是：http://120.78.199.123:8082/。但是却出现了无法访问的问题。这可能是 jdk 版本不对的原因，可以[查看默认支持的 jdk 版本](https://pkg.jenkins.io/redhat/)。可以看到默认支持的是8或者11，而我已经安装的是14。

- 可以使用以下命令查看已安装的 jdk。

```shell
rpm -qa|grep jdk
```

- 卸载已安装的 jdk。

```shell
yum -y remove jdk-14.0.1-14.0.1-ga.x86_64
```

![jenkins](../.vuepress/public/assets/image/engineering/jenkins5.png 'jenkins')

- 重新安装版本是8的 jdk。

```shell
# 查看所有可安装的版本
yum --showduplicate list java*
```

```shell
# 安装版本为8的jdk
yum install java-1.8.0-openjdk.x86_64
```

然而，换了 jdk 的版本之后还是无法访问，看起来好像不是 jdk 版本的问题。因为后来我又从 Oracle 官网下载了版本11的 jdk，然后像安装版本14那样进行安装，发现还是一样无法访问。

3. 之后，我又怀疑是防火墙的问题，但是查看了下防火墙状态是关闭的，一开始我还以为这是正常的，后来才知道防火墙得打开。关于 Linux 防火墙的一些常用命令如下：

```shell
# 查看防火墙状态
systemctl status firewalld
# 启动防火墙
systemctl start firewalld
# 临时关闭防火墙
systemctl stop firewalld
# 永久关闭防火墙
systemctl disable firewalld
# 重启防火墙
systemctl reload firewalld
```

不过，打开了防火墙之后还是不行。看到网上资料说可能是没有开放 jenkins 的端口。可以用以下命令看看有没有开放我们设置的 jenkins 端口：8082.

```shell
firewall-cmd --list-ports
```

如果没有，用下面的命令开放下：

```shell
firewall-cmd --permanent --zone=public --add-port=8082/tcp
```

然后重启防火墙。

然而，这么一顿操作之后，还是无法访问成功。后来，又看到如果用的是阿里云的 esc 服务器，还得去安全组里配置下。

![jenkins](../.vuepress/public/assets/image/engineering/jenkins6.png 'jenkins')

配置好之后，再次访问，终于可以访问成功啦！:smile:

## 配置 Jenkins

下面就是根据引导一步一步进行 jenkins 的配置了。

- 在服务器上执行命令 `cat /var/lib/jenkins/secrets/initialAdminPassword` 获取密码，然后粘贴到这里登录。

![jenkins](../.vuepress/public/assets/image/engineering/jenkins7.png 'jenkins')

- 奇怪的是，点继续之后，看到的并不是常见的安装插件的引导页，而是直接进入了主页面，还是英文的。:flushed:

![jenkins](../.vuepress/public/assets/image/engineering/jenkins8.png 'jenkins')

  于是只好自己去安装一个中文插件：`Localization: Chinese (Simplified)`，之后需要使用什么插件再去安装就好了。安装好之后重启，界面就是中文的了。重启之后还跳到了下面创建管理员用户的引导页。

- 创建管理员用户。用户名是：`linnan`，密码是：`Ln19960206@`。

![jenkins](../.vuepress/public/assets/image/engineering/jenkins9.png 'jenkins')

- 实例配置，采用默认的就好了。

![jenkins](../.vuepress/public/assets/image/engineering/jenkins10.png 'jenkins')

- Jenkins 已准备就绪。

![jenkins](../.vuepress/public/assets/image/engineering/jenkins11.png 'jenkins')

- 点击开始使用 Jenkins，就可以看到我们一开始见到的主界面了。

![jenkins](../.vuepress/public/assets/image/engineering/jenkins12.png 'jenkins')

- 替换插件更新源。在 `系统管理 -> 插件管理 -> 高级 -> 升级站点` 中把原来的 `https://updates.jenkins.io/update-center.json` 替换成清华源 `https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json`。然后点击提交和立即获取。

到此，整个 Jenkins 的启动与配置就完成啦～接下来可以开心的使用啦。:smile:
