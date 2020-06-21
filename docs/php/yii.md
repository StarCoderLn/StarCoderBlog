[Yii2](https://www.yiiframework.com/doc/guide/2.0/zh-cn/intro-yii) 是一个通用的 Web 编程框架，即可以用于开发各种用 PHP 构建的 Web 应用。 因为基于组件的框架结构和设计精巧的缓存支持，它特别适合开发大型应用，如门户网站、社区、内容管理系统（CMS）、电子商务项目和 RESTful Web 服务等。

这篇文章主要记录在使用 Yii2 的过程中碰到的一些坑。

## 下载安装

官网给出了两种安装 Yii2 的方法，一种是通过 composer 来安装，但是这种方法在安装的时候特别慢，我自己的电脑就没安装成功；另一种方法是通过归档文件来安装，这种方法比较省事，建议采用这种方式，把时间花在学习上，而不是花费大量时间在环境安装上。

（1）首先从 [yiiframework.com](https://www.yiiframework.com/download) 上下载 basic 项目，**记住不要下载 advanced 项目**。

![yii](../.vuepress/public/assets/image/php/yii1.png 'yii')

（2）下载完之后把 basic 项目**放到 xampp 的 htdocs 目录中**。

（3）打开 basic 项目，修改 config/web.php 文件，给 cookieValidationKey 配置项添加一个密钥，**密钥值随意就行了**。

（4）运行命令 `php yii serve`，然后在浏览器中访问 localhost:8080 就可以访问到 yii 项目了。

![yii](../.vuepress/public/assets/image/php/yii2.png 'yii')

## 连接数据库

在连接数据库时，遇到了以下问题：

![yii](../.vuepress/public/assets/image/php/yii3.png 'yii')

解决方法是修改 config/db.php 文件里的配置，把 localhost 改成 127.0.0.1 就可以了。

```php
<?php

return [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=localhost;dbname=yii2basic',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8',

    // Schema cache options (for production environment)
    //'enableSchemaCache' => true,
    //'schemaCacheDuration' => 60,
    //'schemaCache' => 'cache',
];
```

改成：

```php
<?php

return [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=127.0.0.1;dbname=yii2basic',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8',

    // Schema cache options (for production environment)
    //'enableSchemaCache' => true,
    //'schemaCacheDuration' => 60,
    //'schemaCache' => 'cache',
];
```

重新访问就没问题了。

![yii](../.vuepress/public/assets/image/php/yii4.png 'yii')

## Gii 生成代码

1. 在使用 `Model Generator` 时，需要先在数据库中建好一张表，比如叫：books，再去填写 Table Name 的值，也叫 books，否则无法生成，会提示所填写的表不存在。数据库设计的表如下：

![yii](../.vuepress/public/assets/image/php/yii8.png 'yii')

2. model 和 controller 命名时一定要采用大驼峰式，不要用 TBooks 这种形式命名，不然生成之后会找不到页面路径，报404。

用 gii 生成一个图书管理系统，生成成功后的界面如下：

![yii](../.vuepress/public/assets/image/php/yii5.png 'yii')

3. 生成出来的表头都是英文的，如果我们想把它改成中文的，直接在 Books.php 文件里改就行了。

![yii](../.vuepress/public/assets/image/php/yii6.png 'yii')

修改后效果如下：

![yii](../.vuepress/public/assets/image/php/yii7.png 'yii')

## MVC 知识

采用 MVC 模式写出来的东西是一个**单体应用**，就是前后端的东西都杂糅在一个项目里，前后端不分离。

### MVC 模式关系图

M 是 model，也就是**数据**。V 是 view，也就是**视图**，但是要注意 view 不是界面，它是帮助你去生成界面的，跟界面相关的东西归 view 去管。C 是 controller，也就是**控制器**，说白了就是路由，但是比路由复杂多了。

:bell: 其实**用户 User** 也是 MVC 模式中很重要的一环，但是网上很多资料都没有把用户这一层体现出来，那是不完整的。需要用户参与进来才是完整的。

![mvc](../.vuepress/public/assets/image/php/mvc1.png 'mvc')

:bell: **程序的本质就是数据结构加算法**。数据永远是核心东西，算法就是用来处理数据的，它不可能独立存在。在这种模式中，model 正好是来处理数据的，数据最重要，因此这种模式叫 MVC 模式，而不是叫 CMV、VCM 或者别的。

### MVC 模式数据流向图

![mvc](../.vuepress/public/assets/image/php/mvc2.png 'mvc')

:bell: 将数据写入数据库的操作叫作**数据持久化**。最开始数据是存储内存条中的，但是数据量一大的时候就会导致内存不足的情况，而且计算机一停电，存在内存条中的数据就没了，因此内存还有另外一种叫法：**易失性存储器**。后来又把数据存在了磁盘上，磁盘可以永久保存数据，但是用磁盘去管理数据并不方便，问题也多，所以就出现了数据库，专门把所有的数据集中起来，方便维护和管理，也能够将数据永久的保存下来。

:bell: 前后端半分离就是指数据在浏览器端进行渲染，不是在服务器端进行渲染，比如用 ajax 就是一种前后端半分离。

:bell: 如果采用前后端完全分离，就要用到 node.js 了。后端只负责业务逻辑。

:bell: 一个系统或者项目最值钱的东西是**流程**和**机制**。机制就是遇到哪种情况如何去处理。我们真正要学习的应该是这些东西，而不仅仅是框架语法、api。