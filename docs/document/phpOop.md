## 面向对象的产生

1. 软件危机是指落后的软件生产方式无法满足迅速增长的计算机软件需求，从而导致软件开发与维护过程中出现一系列严重问题的现象。泛指在计算机软件的开发和维护过程中所遇到的一系列严重问题。

2. 为了解决软件危机的问题，于是就出现了软件工程。软件工程学，是一门研究用工程化方法构建和维护有效的、实用的和高质量的软件的学科，它涉及到程序设计语言、数据库、软件开发工具、系统平台、标准、设计模式等方面。分为**结构化方法（按软件周期分为三个阶段：分析、设计、编程）**和**面向对象**。

## 面向对象的概念

1. `OOP`（Object-Oriented Programming，面向对象的编程）技术为编程人员敞开了一扇大门，使其编程的代码更简洁、更易于维护，并且具有更强的可重用性。

2. `OOP`达到了软件工程的三个目标：**重用性**、**灵活性**、**扩展性**。

3. `OOP`面向对象编程的特点：**封装**、**继承**、**多态**。

4. `OOP`的三个主要特性：对象的**行为**、对象的**状态**、对象的**标识**。

## 类和对象的关系

任何一个对象肯定是通过`new`一个类产生的。

## 如何抽象一个类

**1. 类的构成**

一个类包含**成员属性**和**成员方法**。

**2. 类的声明**

- 简单格式
```
[修饰符] class 类名 { // 使用class关键字加空格后加上类名
  [成员属性] // 也叫成员变量
  [成员方法] // 也叫成员函数
}
```

- 完整格式
```
[修饰符] class 类名 [extends 父类] [implements 接口1[,接口2...]] {
  [成员属性]
  [成员方法]
}
```

**3. 成员属性**

- 格式
```
修饰符 $变量名[=默认值]; // 如：public $name="zhangsan"
```

注意：成员属性不可以是带运算符的表达式、变量、方法或函数调用。

错误格式
```php
public $var3 = 1 + 2;
public $var4 = self::myStaticMethod();
public $var5 = $myVar;
```

正确格式
```php
public $var6 =  100; // 普通数值（4个标量：整数、浮点数、布尔、字符串）
public $var7 = myConstant; // 常量
public $var8 = self::classConstant; // 静态属性
public $var9 = array(true, false); // 数组
```

**4. 成员方法**

- 格式
```
[修饰符] function 方法名(参数...) {
  [方法体]
  [return 返回值]
}
```
```php
public function say() {
  echo "人在说话";
}
```

## 通过类实例化对象

**1. 实例化对象**

当定义好类后，使用`new`关键字来生成一个对象。
```
$对象名称 = new 类名称();
$对象名称 = new 类名称([参数列表]);
```

**2. 对象中成员的访问**

语法
```
$引用名 = new 类名(构造参数);
$引用名 -> 成员属性 = 赋值;  // 对象属性赋值
echo $引用名 -> 成员属性;  // 输出对象的属性
$引用名 -> 成员方法(参数);  // 调用对象方法
```

**3. 特殊对象引用$this**
```php
public function play() {
  echo "正在玩手机";
}
public function info() {
  $this -> play();
  return "手机的宽度：{$this->width}，手机的高度：{$this->height}";
}
```

**4. 一个简单的完整例子**
```php
<?php
  class Person {
    public $age;
    public function say($word) {
      echo "He say {$word}";
    }
    public function info() {
      $this -> say("Hi");
      return $this -> age;
    }
  }
  $xiaoming = new Person();
  $xiaoming -> age = 20;
  $age = $xiaoming -> info();
  echo "<br />";
  echo $age;
?>
```

## 构造方法与析构方法

主要了解它们的基本使用和执行时机。

**1. 构造方法**

- 语法格式
```
[修饰符] function __construct([参数]) {
  程序体
}
```

**2. 析构方法**

- 语法格式
```
[修饰符] function __destruct([参数]) {
  程序体
}
```

**3. 简单例子**
```php
<?php
  class Person {
    public function __construct($name, $age) {
      // 当这个类new的时候自动执行
      $this -> name = $name;
      $this -> age = $age;
      echo "hello ".$name;
      echo "<br />";
    }
    public function data() {
      return $this -> age;
    }
    public function __destruct() {
      // 可以进行资源的释放操作，比如数据库关闭。在对象被销毁时执行
      echo "bye bye {$this -> name}";
      echo "<hr />";
    }
  }
  new Person("first", 20);
  new Person("second", 22);
?>
```

代码运行效果  
![oop](../.vuepress/public/assets/image/document/oop1.png 'oop')

## 面向对象封装

封装就是把对象中的成员属性和成员方法加上访问修饰符，使其尽可能**隐藏对象的内部细节**，以达到对成员的**访问控制（切记不是拒绝访问）**。

**1. 封装的修饰符**

PHP5支持以下3种访问修饰符
- `public`    公有的，默认
- `private`   私有的
- `protected` 受保护的

**2. 私有成员**

- 设置私有成员

只要在声明成员属性或成员方法时，使用`private`关键字修饰就是实现了对成员的私有封装。

- 访问私有成员

封装后的成员在对象外部不能直接访问，只能在对象的内部方法中使用`$this`访问。比如：
```php
class Person {
  private $name;
  public function say() {
    return $this -> name;
  }
}
```

**3. 魔术方法**

PHP中在类里面声明的以“__”开始的方法都是PHP给我们提供的魔术方法，都是在某一时刻不同情况下**自动调用执行**的方法。

- __set()
- __get()
- __isset()
- __unset()

注意：魔术方法都只针对`private`和`protected`成员才有用。

**4. 简单例子**
```php
<?php
  class Person {
    public $x = 0;
    private $name = "小王";
    private $age = "20";
    protected $money = "10000";

    // 私有成员方法在类外部是不能直接访问的
    private function getAge() {
      return $this -> age;
    }
    // 被保护的方法在类外部也是不能直接访问的
    protected function getMoney() {
      return $this -> money;
    }
    public function userCard() {
      echo $this ->name . "的年龄是" . $this -> getAge() . "岁，存款是"
       . $this -> getMoney();
    }
    // 注意：以下几个魔术方法都只针对 protected 和 private
    public function __set($key, $value) {
      if ($key === "name" && $value === "小红") {
        $this -> name = "小王";
      }
    }
    public function __get($key) {
      if ($key === "age") {
        echo "<br />";
        return "I don't know age";
      }
    }
    public function __isset($key) {
      if ($key === "age") {
        echo "<br />";
        return "private age";
      }
    }
    public function __unset($key) {
      if ($key === "age") {
        unset($this -> age);
        return "age 被干掉了";
      }
    }
  }
  $xw = new Person();
  $xw -> name = "小红";
  echo $xw -> userCard();
  echo $xw -> age;
  var_dump(isset($xw -> age));
  echo isset($xw -> age);
  unset($xw -> x);
  echo $xw -> x;
?>
```

运行结果  

![oop](../.vuepress/public/assets/image/document/oop3.png 'oop')

## 面向对象继承和多态

PHP只支持**单继承**，不允许多重继承。即一个子类只能有一个父类，不允许一个类直接继承多个类，但一个类可以被多个类继承。可以有**多层继承**，即一个类可以继承某一个类的子类，比如类B继承了类A，类C又继承了类B，那么类C也简接继承了类A。

**1. 访问控制**

![oop](../.vuepress/public/assets/image/document/oop2.png 'oop')

**2. 重载（overload）**

重载是指一个类中有多个同名的方法，但是彼此参数不一样。

**3. 重写（override）**

重写是指子类中覆盖了父类中的同名方法。

**4. PHP中，子类重载父类的方法**

在子类中，可以使用`parent`访问父类中被覆盖的属性和方法，来实现重载。
```php
parent::construct();
parent::fun();
```

**5. 多态**

重载和重写使得同一个方法在子类中会有不同的行为和状态，这就是所谓的多态。

**6. 简单例子**
```php
<?php
  class Person {
    public $name;
    private $age; // 没法继承
    protected $money; // 外部访问不了，但是可以继承
    function __construct($name, $age, $money) {
      $this -> name = $name;
      $this -> age = $age;
      $this -> money = $money;
    }
    public function cardInfo() {
      echo $this ->name . "的年龄是" . $this -> age . "岁，存款是" . $this -> money;
    }
  }
  class Yellow extends Person {
    function __construct($name, $age, $money) {
      parent::__construct($name, $age, $money);
    }
    public function cardInfo() {
      parent::cardInfo(); // 重载父类的方法，如果没加这句，就变成重写父类的方法
      echo "<br />123";
    }
    public function test() {
      echo $this -> age;
      echo $this -> money;
    }
  }
  $s = new Yellow("xiaowang", 20, 1000);
  $s -> cardInfo();
  echo $s -> test();
?>
```

运行结果  

![oop](../.vuepress/public/assets/image/document/oop4.png 'oop')

## 抽象类和接口

**1. 抽象方法和抽象类**

- 当类中有一个方法，它没有方法体，也就是没有花括号，直接分号结束，像这种方法我们称为**抽象方法**，必须使用关键字`abstract`定义。
```php
public abstract function fun();
```

- 包含这种方法的类必须是**抽象类**，也要使用关键字`abstract`加以声明。即使用关键字`abstract`修饰的类为抽象类。

- 抽象类的特点：  
（1）不能实例化，也就是**不能new成对象**。  
（2）若想使用抽象类，就必须**定义一个类去继承它**，并定义覆盖父类的抽象方法（**实现抽象方法**）。

- 简单例子
```php
<?php
  /*
   * 1、含有抽象方法的类必须是抽象类
   * 2、抽象类不一定非得含有抽象方法，可以存在普通方法
   * 3、抽象类中定义了抽象方法，继承它的子类必须得实现才能使用
   * 4、抽象类不能被实例化，必须由一个子类去继承，并且把抽象类的抽象方法都实现
   */
  abstract class Person {
    // 抽象方法，没有方法体
    public abstract function eat();
  }
  class Man extends Person {
    public function eat() {
      echo "Man eating";
    }
  }
  $man = new Man();
  $man -> eat();
?>
```

运行结果

![oop](../.vuepress/public/assets/image/document/oop5.png 'oop')

**2. 接口技术**

- PHP与大多数面向对象编程语言一样，不支持多重继承，也就是说每个类只能继承一个父类。为了解决这个问题，PHP引入了接口，接口的思想是指定了**一个实现了该接口的类必须实现的一系列函数**。

- 定义格式
```
interface 接口名称 {
  // 常量成员（使用 const 关键字定义）
  // 抽象方法（不需要使用 abstract 关键字）
}
```

- 使用格式
```
class 类名 implements 接口名1,接口名2 {...}
```

- 简单例子
```php
<?php
  /*
   * 1、接口声明关键字是 interface
   * 2、接口可以声明常量也可以抽象方法
   * 3、接口中的方法都是抽象方法，不需要使用abstract关键字
   * 4、接口不能被实例化，需要一个类去实现它
   * 5、一个类不能继承多个类，但是一个类可以实现多个接口
   */
  interface Person {
    const NAME = "xiaowang";
    public function run();
    public function eat();
  }
  interface Study {
    public function study();
  }
  class Student implements Person, Study {
    const data = 3.14;
    public function run() {
      echo "run";
    }
    public function eat() {
      echo "eat";
    }
    public function study() {
      echo "study";
    }
    public function test() {
      echo self::data; // 访问自身常量的方法
    }
    public static function test1() {
      echo "这是一个静态方法";
    }
  }
  $xw = new Student();
  $xw -> study();
  echo "<br />";
  echo $xw::NAME; // 访问常量的方法
  echo "<br />";
  echo $xw -> test();
  echo "<br />";
  echo Student::data; // 也可以直接通过类去找到常量
  echo "<br />";
  echo Student::test1(); // 访问一个静态方法
?>
```

运行结果

![oop](../.vuepress/public/assets/image/document/oop6.png 'oop')

**3. 抽象类和接口的区别**

- 当你关注一个**事物的本质**时，用**抽象类**；当你关注**一个操作**时，用**接口**。

- 接口是对**动作**的抽象，表示这个对象能做什么，对类的局部行为进行抽象。  
  抽象类是对**根源**的抽象，表示这个类是什么，对类的整体进行抽象，对一类事物的抽象描述。  

假如男人、女人是两个类，他们的抽象类是人。他们都是人，人可以吃东西，狗也可以吃东西，你可以把“吃东西”定义成一个接口，然后让这些类去实现它。  

所以，在高级语言上，一个类只能继承一个类（抽象类）（正如人不可能同时是生物和非生物），但是可以实现多个接口（吃饭接口、走路接口）。

- 接口是抽象类的变体，接口中所有的方法都是抽象的。而抽象类是声明方法的存在而不去实现它的类。
- 接口可以多继承，抽象类不行。
- 接口定义方法，不能实现；而抽象类可以实现部分方法。
- 接口中基本数据类型为`static`，而抽象类不是。
- 接口中不能含有静态代码块和静态方法，而抽象类可以含有静态方法和静态代码块。

**4. 多态应用**

- 对象的多态是指，在父类中定义的属性或行为被子类继承之后，可以具有不同的数据类型或表现出不同的行为。这使得同一个属性或行为在父类及其各个子类中具有不同的语义。

## PHP常见关键字

**1. final关键字**

- 在PHP5中新增加了final关键字，它**只能用来修饰类和方法**，**不能修饰成员属性**。

- final的特性：  
  （1）使用final关键字标识的类**不能被继承**。  
  （2）使用final关键字标识的方法**不能被子类覆盖（重写）**。

- 目的  
  （1）为了安全。  
  （2）没必要被继承或重写。

**2. static关键字**

- static关键字表示静态的意思，用于修饰类的成员属性或成员方法（即静态属性和静态方法）。

- 类中的静态属性和方法不用实例化（new）就可以直接使用类名访问。
```
类::$静态属性
类::$静态方法
```

- 在类的方法中，不能使用this来引用静态变量或静态方法，而是需要用self来引用。
```
self::$静态属性
self::$静态方法
```

- 静态方法中**不可以使用非静态内容**，也就是不让使用this。

- 静态属性是**共享的**。也就是**new很多对象也是共用一个属性**。

**3. 单例设计模式**

单态模式的主要作用是保证在面向对象编程设计中，**一个类只能有一个实例对象存在**。

**4. const关键字**

PHP中定义常量使用的是`define()`这个函数，但是在类里面定义常量使用的是`const`这个关键字。
```php
const CONSTANT = 'constant value';  // 定义
echo self::CONSTANT;                // 类内部访问
echo className::CONSTANT;           // 类外部访问
```

**5. instanceof关键字**

- instanceof关键字用于检测当前对象实例是否属于某一个类或者这个类的子类。

## 异常处理

**1. 系统自带的异常处理**

**2. 自定义异常处理**

**3. 捕捉多个异常处理**

## 博客学习资料 
[PHP面向对象入门编程](https://www.cnblogs.com/52php/p/?page=49)  
[常用的PHP知识](https://www.cnblogs.com/xiaochaohuashengmi/archive/2010/09/10/1823042.html)  
[Javascript面向对象编程（一）：封装](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_encapsulation.html)  
[Javascript面向对象编程（二）：构造函数的继承](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html)  
[Javascript面向对象编程（三）：非构造函数的继承](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance_continued.html)  