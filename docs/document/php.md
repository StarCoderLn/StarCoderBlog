## 初识PHP

PHP（外文名：`PHP Hypertext Preprocessor`，中文：“超文本预处理器”）是一种通用开源脚本语言。语法吸收了C语言、Java和Perl的特点，利于学习，Perl以及PHP自创的语法。它可以比CGl或者Perl更快速地执行动态网页。用PHP做出的动态网页与其他的编程语言相比，PHP是将程序嵌入到HTML（标准通用标记语言下的一个应用）文档中去执行，执行效率比完成生成HTML标记的CGl要高许多；PHP还可以执行编译后代码，编译可以达到加密和优化代码运行，使代码运行更快。

这篇文章主要是记录PHP入门时需要注意的一些点，PHP具体用法可以参照W3C文档：[PHP](https://www.w3school.com.cn/php/php_ref.asp)

1. PHP语句书写时一定要带分号，并且连接字符串是用`.`。

2. PHP中变量用`$`符号来声明。
```php
<?php
  $a = '变量测试';
  echo $a;
?>
```

3. PHP是块级作用域的。比如在下面这段代码中，变量a根本就没有声明，打印的时候肯定会报错。但是在JS中其实是有声明的了，只是打印出来的结果是`undefined`。
```php
<?php
  if (false) {
    $a = '测试';
  }
  echo $a;
?>
```
  PHP中判断一个变量是否有被声明可以用`isset`方法。
```php
<?php
  if (false) {
    $a = '测试';
  }
  if (isset($a)) {
    echo '我是被声明的';
  } else {
    echo '我没被声明';
  }
?>
```
  上面这段代码会在浏览器打印出‘我没被声明’。  
![php](../.vuepress/public/assets/image/document/php1.png 'php')

4. `global`关键字可以将一个变量变成全局的。下面这段代码在浏览器中运行时会报错，因为变量a是在函数外面声明的，在函数里面没法直接访问到。
```php
<?php
  $a="我是外面的";
  function test(){
    echo $a;
  }
  test();
?>
```
如果我们想访问到变量a，那么就需要给a加上`global`。
```php
<?php  
  $a="我是外面的";
  function test(){
    global $a;
    echo $a;
  }
  test();
?>
```
此外，PHP中还有另外一个关键字`$GLOBALS`。加了这个关键字的变量在所有的PHP文件中都会生效。比如下面这段代码中的变量a的值会被修改，最终输出‘我被改了’
```php
<?php  
  $a="我是外面的";
  function test(){
    global $a;
    $GLOBALS['a'] = "我被改了";
    echo $a;
  }
  test();
?>
```

5. 在PHP文件中引入其他的PHP文件。引用方式有两种：
```php
<?php
  require_once('a.php');
  include_once('a.php');
?>
```
once就是引入一次，两者的区别就是`include`不论有没有引入错误，代码都是会执行的；`require`如果代码中出错就不会执行了，和php文件融为一体了。
```php
// test.php
<?php
  $GLOBALS['b'] = 'test';
?>

// index.php
<?php
  require_once('test.php');
  function test () {
    echo $GLOBALS['b'];
  }
  test();
?>
```
直接打印出test.php文件中定义的全局变量b的值。

6. PHP数组
```php
<?php
  $arr = array('0' => '苹果', '1' => '梨');
  echo json_encode($arr, JSON_UNESCAPED_UNICODE);
  echo $arr[0];
?>
```
浏览器中直接打印出json格式的数据  
![php](../.vuepress/public/assets/image/document/php2.png 'php')

7. `session`会话机制  
如果在网站上执行过某个php文件，打开过这个页面，然后在这个网站上打开别的页面，就像跟浏览器做了一次对话，这时候往`session`里存一个东西，我们就能在其他页面取到。比如，先访问session.php，再访问array.php，就能够取到view的值，这是一个会话间的存储。
```php
// session.php
<?php
  session_start(); // 会话机制需要设置，设置一次就行了
  $_SESSION['view'] = 1
?>

// array.php
<?php
  require_once('session.php');
  echo $_SESSION['view'];
?>
```

8. 向PHP文件发起请求，比如下面的代码模拟了一个表单提交请求。
```html
<form action="form.php" method="post">
  <label>用户名</label>
  <input type="text" id="username" name="username" />
  <label>密码</label>
  <input type="text" name="password">
  <input type="submit" id="btn" value="提交" />
</form>
```
```js
$('#btn').click(function (e) {
  e.preventDefault();
  $.ajax({
    url: 'form.php',
    type: 'post',
    data: {
      username: $('#username').val()
    },
    dataType: 'json',
    success: function (data) {
      console.log(data)
    },
    error: function (e) {
      console.log(e)
    }
  })
})
```
```php
<?php
  // 通过报头的形式设置php页面的编码格式
  header('Content-type: text/html; charset=utf-8');
  $username = $_REQUEST['username']; // $_REQUEST 能接受任何请求
  if ($username === 'admin') {
    echo  json_encode(array('msg' => '登录成功', 'errorCode' => 'ok'));
  } else {
    echo  json_encode(array('msg' => '登录失败', 'errorCode' => 'fail'));
  }
?>
```
上面代码的运行效果如下：  
- 点击提交按钮发起请求  
![php](../.vuepress/public/assets/image/document/php3.png 'php')  
- 请求返回结果  
![php](../.vuepress/public/assets/image/document/php4.png 'php')