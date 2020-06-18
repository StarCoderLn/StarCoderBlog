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

```js
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

```js
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
