## 启动MySQL

在XAMPP软件中启动MySQL时遇到了以下问题：  

![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin1.png 'phpMyAdmin')  

这是因为我的电脑之前已经有装过MySQL了，仔细查看图中的报错信息可以发现，其实就是MySQL的读取路径不对

![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin2.png 'phpMyAdmin')

此时我们需要去注册表编辑器中把MySQL的路径改一下，按Win + R打开命令搜索框，输入`regedit`打开注册表编辑器，输入路径： 

```
计算机\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\MySQL
```

找到MySQL：  
![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin3.png 'phpMyAdmin')

可以看到原本的`ImagePath`的路径是：

```
"D:\Program Files\MySQL\bin\mysqld" MySQL
```

双击`ImagePath`，把里面的路径改成：

```
c:\xampp\mysql\bin\mysqld.exe --defaults-file=c:\xampp\mysql\bin\my.ini mysql
```

此时重新启动MySQL就可以成功启动了。

![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin4.png 'phpMyAdmin')

## 数据库增删改查

1. 上文我们把数据库启动成功之后，在浏览器中访问`localhost`，然后在XAMPP的欢迎页右上角点击`phpMyAdmin`  

![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin5.png 'phpMyAdmin')  

2. 进入`phpMyAdmin`的管理界面

![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin6.png 'phpMyAdmin')

3. 接下来我们就可以新建数据库，填写好表名，以及编码规则。编码规则一定要选择`utf8_general_ci`，防止乱码，然后点击创建

![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin7.png 'phpMyAdmin')

4. 创建好数据库之后，就可以创建表了，填写表名字以及所需要的字段数

![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin8.png 'phpMyAdmin')

5. 填写相应的字段信息

![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin9.png 'phpMyAdmin')

6. 接下来就可以通过菜单栏或者SQL语句来对数据库表进行增删改查的操作了。关于SQL语句的具体用法可以参照W3C文档：[SQL](https://www.w3school.com.cn/sql/index.asp)

![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin10.png 'phpMyAdmin')

## PHP与MySQL

上面我们其实是在直接操作数据库，但是实际开发过程中，应该是前端链接PHP，然后PHP链接数据库，通过PHP来对数据库进行操作的。前端连接PHP有两种方式，一种是通过`Form`表单，另外一种是通过`Ajax`请求。下面就来介绍下PHP如何链接数据库。  

需要注意的是，不同版本的PHP操作MySQL的函数有所不同，PHP版本在5以下，参照[PHP MySQL函数](https://www.w3school.com.cn/php/php_ref_mysql.asp)；PHP版本在5以上，参照[PHP5 MySQLi函数](https://www.w3school.com.cn/php/php_ref_mysqli.asp)。以下演示的PHP版本都是在5以上。

1. 连接MySQL
在PHP中，连接MySQL是通过`mysqli_connect()`函数来完成的。

```php
<?php
  $con = mysqli_connect("localhost","root","");
  if (!$con){
    die('Could not connect:'.mysqli_connect_error());
  } else {
    echo 'mysql connect ok';
  }
  mysqli_close($con);
?>
```

2. 插入数据

```php
<?php
  $con = mysqli_connect("localhost","root","");
  if (!$con){
    die('Could not connect:'.mysqli_connect_error());
  } else {
    mysqli_select_db($con, "phpdemo");
    $sql = "INSERT INTO `news`(`newsTitle`, `newsImg`, `newsContent`, `addTime`) VALUES ('新闻标题','新闻图片','新闻内容','2020-05-23')";
    mysqli_query($con, "set names 'utf-8'"); // 防止乱码
    $result= mysqli_query($con, $sql);
    if (!$result) {
      die('Error：'.mysqli_error($con));
    } else {
      echo '数据插入成功';
    }
  }
  mysqli_close($con);
?>
```
执行后可以看到在数据库中已经有新插入的数据了  
![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin11.png 'phpMyAdmin')

3. 删除数据

```php
<?php
  $con = mysqli_connect("localhost","root","");
  if (!$con){
    die('Could not connect:'.mysqli_connect_error());
  } else {
    mysqli_select_db($con, "phpdemo");
    $sql = "DELETE FROM `news` WHERE `newsId`=8";
    mysqli_query($con, "set names 'utf-8'"); // 防止乱码
    $result= mysqli_query($con, $sql);
    if (!$result) {
      die('Error：'.mysqli_error($con));
    } else {
      echo '数据删除成功';
    }
  }
  mysqli_close($con);
?>
```

4. 更新数据

```php
<?php
  $con = mysqli_connect("localhost","root","");
  if (!$con){
    die('Could not connect:'.mysqli_connect_error());
  } else {
    mysqli_select_db($con, "phpdemo");
    $sql = "UPDATE `news` SET `newsTitle`='第九条新闻的标题',`newsImg`='第九条新闻的图片' WHERE `newsId`=9";
    mysqli_query($con, "set names 'utf-8'"); // 防止乱码
    $result= mysqli_query($con, $sql);
    if (!$result) {
      die('Error：'.mysqli_error($con));
    } else {
      echo '数据更新成功';
    }
  }
  mysqli_close($con);
?>
```

5. 前端界面向后台提交数据

```html
<form action="mysql.php">
  <div>
    <label for="newsTitle">新闻标题：</label>
    <input type="text" name="newsTitle" id="newsTitle">
  </div>
  <div>
    <label for="newsImg">新闻图片：</label>
    <input type="text" name="newsImg" id="newsImg">
  </div>
  <div>
    <label for="newsContent">新闻内容：</label>
    <textarea name="newsContent" id="newsContent" cols="30" rows="10"></textarea>
  </div>
  <div>
    <label for="addTime">新闻时间：</label>
    <input type="date" id="addTime" name="addTime" value="2020-05-23">
  </div>
  <div>
    <input type="submit" value="提交">
    <input type="reset" value="重置">
  </div>
</form>
```
```php
<?php
  $con = mysqli_connect("localhost","root","");
  if (!$con){
    die('Could not connect:'.mysqli_connect_error());
  } else {
    mysqli_select_db($con, "phpdemo");
    $newsTitle = $_REQUEST['newsTitle'];
    $newsImg = $_REQUEST['newsImg'];
    $newsContent = $_REQUEST['newsContent'];
    $addTime = $_REQUEST['addTime'];
    $sql = "INSERT INTO `news`(`newsTitle`, `newsImg`, `newsContent`, `addTime`) VALUES ('".$newsTitle."', '".$newsImg."', '".$newsContent."', '".$addTime."')";
    mysqli_query($con, "set names 'utf-8'"); // 防止乱码
    $result= mysqli_query($con, $sql);
    if (!$result) {
      die('Error：'.mysqli_error($con));
    } else {
      echo '数据插入成功';
    }
  }
  mysqli_close($con);
?>
```

界面操作输入数据，点击提交

![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin12.png 'phpMyAdmin')

查看数据库发现数据插入成功了

![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin13.png 'phpMyAdmin')

6. 前端展示数据库信息

```php
<?php
  $con = mysqli_connect("localhost","root","");
  if (!$con){
    die('Could not connect:'.mysqli_connect_error());
  } else {
    mysqli_select_db($con, "phpdemo");
    mysqli_query($con, "set names 'utf-8'"); // 防止乱码
    $sql = "SELECT * FROM `news` WHERE 1";

    $result= mysqli_query($con, $sql);
    if (!$result) {
      die('Error：'.mysqli_error($con));
    } else {
      // echo '查询数据成功';
    }
  }
  $arr = array();
  while ($row = mysqli_fetch_array($result)) {
    array_push($arr, array(
      "newsTitle" => $row['newsTitle'],
      "newsImg" => $row['newsImg'],
      "newsContent" => $row['newsContent'],
      "addTime" => $row['addTime']
    ));
  }
  $res = array('errorCode' => 0, 'result' => $arr);
  echo json_encode($res, JSON_UNESCAPED_UNICODE);
  mysqli_close($con);
?>
```

展示结果如下，可以发现这其实就是我们平时从接口里获取到的数据结构

![phpMyAdmin](../.vuepress/public/assets/image/document/phpMyAdmin14.png 'phpMyAdmin')
