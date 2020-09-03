本文主要介绍如何在服务器上安装 nginx。

- 服务器：阿里云 ESC 服务器

- 系统：CentOS7

1. 执行以下命令进行安装。

```shell
yum install -y nginx
```

2. 安装完成后，可以启动 nginx 服务。

```shell
# 启动 nginx
systemctl start nginx.service
# 重启 nginx
systemctl restart nginx.service
# 关掉 nginx
systemctl stop nginx.service
# 热重启 nginx
systemctl reload nginx.service
# 查看 nginx 的状态
systemctl status nginx.service
```

但是启动 nginx 时碰到了以下问题。

![nginx](../.vuepress/public/assets/image/nginx/install1.png 'nginx')

查看 nginx 服务的状态后发现，原来是端口号被占用了。

![nginx](../.vuepress/public/assets/image/nginx/install2.png 'nginx')

于是，使用以下命令查看 80 端口号是被哪个服务占用了。

```shell
netstat -apn|grep :80
```

![nginx](../.vuepress/public/assets/image/nginx/install3.png 'nginx')

原来已经有一个 nginx 服务占用了。可以使用以下命令杀掉这个服务，再重新启动 nginx 就可以了。

```shell
pkill -9 nginx
```

启动完成后，需要在阿里云服务器的安全组中添加上80端口号，并关闭防火墙，然后在浏览器中访问服务器地址，就可以看到以下界面，说明 nginx 已经安装成功了。

之所以是 CentOS 的欢迎界面，是因为 nginx 配置文件中的 `root /usr/share/nginx/html;` 指向的就是 CentOS 的欢迎界面。

![nginx](../.vuepress/public/assets/image/nginx/install5.png 'nginx')

3. 配置 nginx

nginx 的配置文件在 `/etc/nginx` 目录下。

![nginx](../.vuepress/public/assets/image/nginx/install4.png 'nginx')

其中的 nginx.config 就是 nginx 的配置文件。我们把其中的端口号设成80，server_name 设成自己的服务器公网 IP 地址。

![nginx](../.vuepress/public/assets/image/nginx/install6.png 'nginx')

::: tip 补充
[Windows 系统下安装 nginx](https://www.cnblogs.com/qfb620/p/5508468.html)
:::
