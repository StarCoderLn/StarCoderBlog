## Cygwin介绍

`Cygwin`是一个在windows平台上运行的类`UNIX`模拟环境，它对于学习`UNIX/Linux`操作环境，或者从`UNIX`到Windows的应用程序移植，或者进行某些特殊的开发工作，尤其是使用GNU工具集在Windows上进行嵌入式开发，非常有用。

## Cygwin的安装与使用

下载地址：[Cygwin](http://www.cygwin.com/)

下载完成后，只需要根据安装向导一步一步进行安装就行了。但是其中有几步需要注意的：

1. 安装过程中需要在网上下载一些文件，所以这里要选择第一个

![cygwin](../.vuepress/public/assets/image/cygwin/cygwin1.png 'cygwin')

2. 这里选择`Direct Connection`

![cygwin](../.vuepress/public/assets/image/cygwin/cygwin2.png 'cygwin')

3. 可是接下来却提示我无法获取到镜像下载列表

![cygwin](../.vuepress/public/assets/image/cygwin/cygwin3.png 'cygwin')

4. 点击确定之后镜像下载列表果然是空白的，这下我就懵逼了，没有下载地址可以选我还怎么下载

![cygwin](../.vuepress/public/assets/image/cygwin/cygwin4.png 'cygwin')

5. 后来我就去网上搜了`Cygwin`的安装教程，找了一个阿里云的镜像地址
```
http://mirrors.aliyun.com
```
![cygwin](../.vuepress/public/assets/image/cygwin/cygwin5.png 'cygwin')

6. 添加完之后继续点击下一步，终于可以下载了。然后到这里需要选择"Full"下载全部的组件

![cygwin](../.vuepress/public/assets/image/cygwin/cygwin6.png 'cygwin')

到此，整个Cygwin环境就安装完成了，接着就可以在Cygwin窗口敲Linux命令啦。

![cygwin](../.vuepress/public/assets/image/cygwin/cygwin7.png 'cygwin')