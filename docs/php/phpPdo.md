## PHP PDO的简单使用

具体使用方法参照[PHP PDO](https://www.runoob.com/php/php-pdo.html)

```php
<?php
  header("Content-type: text/html;charset=utf-8");
  $dbms = "mysql"; // 数据库类型
  $host = "localhost"; // 数据库主机名
  $dbName = "phppdo"; // 数据库名称
  $user = "root"; // 数据库连接用户
  $pass = ""; // 数据库连接用户密码
  $dsn = "$dbms:host=$host; dbname=$dbName"; // 构建连接串
  try {
    $dbh = new PDO($dsn, $user, $pass);
    echo "连接成功<br />";
    // 打印数据库信息
    foreach($dbh->query("SELECT * FROM `student` WHERE 1") as $row) {
      print_r($row);
      echo "<br />";
    }
    // 插入数据
    $sql = "INSERT INTO `student`(`name`, `age`, `male`) VALUES ('小芳',17,'女')";
    $res = $dbh->exec($sql);
    echo "添加数据库成功，受影响的行数是".$res."行";
    // 用完要关掉
    $dbh = null;
  } catch (PDOException $e) {
    die("Error：" . $e->getMessage() . "<br />");
  }
?>
```

效果如下

![phppdo](../.vuepress/public/assets/image/php/phppdo1.png 'phppdo')