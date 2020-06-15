## XAMPP

这是Apache一个集成了MySQL、PHP和Perl的软件，可以运行php文件，启动服务，操作数据库。

#### :key: Windows 系统上安装与使用

1. 下载XAMPP软件，并按照安装提示一步一步进行安装。

2. windows系统上安装完成后打开的面板如下，点击Apache那一行的start按钮，当看到Apache那里变成绿色时，说明服务器已经启动成功了。此时在浏览器中访问localhost，可以看到xampp默认启动的页面。

![xampp](../.vuepress/public/assets/image/server/xampp1.png 'xampp')  

![xampp](../.vuepress/public/assets/image/server/xampp2.png 'xampp')

3. 接着，点击右边菜单栏的Explorer，可以打开xampp软件安装的文件夹位置。

![xampp](../.vuepress/public/assets/image/server/xampp3.png 'xampp')

4. 然后打开htdocs这个文件夹，我们只要把想要放在服务器上的文件放在这个文件夹中，比如此处放了一个server文件夹，里面有写好的代码，然后在浏览器中访问localhost/server，就可以看到我们代码显示的内容了。到此，xampp的安装与使用就完成了。

![xampp](../.vuepress/public/assets/image/server/xampp4.png 'xampp')

![xampp](../.vuepress/public/assets/image/server/xampp5.png 'xampp')

#### :key: Mac 系统上安装与使用

1. 在官网上下载 xampp-osx-7.4.6-0-installer.dmg 安装包，然后跟着安装引导一步一步进行安装就可以了。

2. 启动界面和操作界面如下：

![xampp](../.vuepress/public/assets/image/server/xampp6.png 'xampp')

![xampp](../.vuepress/public/assets/image/server/xampp7.png 'xampp')

3. 点击下面的 Open Application Folder 可以打开 xampp 对应的文件夹。同样可以看到这里面有个 htdocs 文件夹，只要把我们写好的代码丢到这里面，然后在浏览器中访问就行了，跟 Windows 上的操作方法是一样的。

![xampp](../.vuepress/public/assets/image/server/xampp8.png 'xampp')



## IIS

如何开启本地的IIS管理器

1. 打开设置，点击应用。

![iis](../.vuepress/public/assets/image/server/iis1.png 'iis')

2. 点击右侧的程序与功能。

![iis](../.vuepress/public/assets/image/server/iis2.png 'iis')

3. 点击启用或关闭Windows功能。

![iis](../.vuepress/public/assets/image/server/iis3.png 'iis')

4. 找到 Internet Information Services（Internet信息服务），然后把图中红框里的东西都勾选上，再点击确定，这个时候就会搜索相关的文件并应用所做的更改。

![iis](../.vuepress/public/assets/image/server/iis4.png 'iis')

5. 应用更改完成后，在控制面板搜索服务。win10可以通过Win+R打开运行面板，然后输入control打开控制面板。

![iis](../.vuepress/public/assets/image/server/iis5.png 'iis')

6. 点击管理工具，找到IIS管理器，双击就可以打开本地的IIS管理器了。

![iis](../.vuepress/public/assets/image/server/iis6.png 'iis')  

![iis](../.vuepress/public/assets/image/server/iis7.png 'iis')

7. 右键点击浏览可以打开IIS网站的根目录，这个时候我们在这个目录下新建一个文件夹，编辑我们自己的代码，就同样可以在浏览器中访问了。

![iis](../.vuepress/public/assets/image/server/iis8.png 'iis')  

![iis](../.vuepress/public/assets/image/server/iis9.png 'iis')