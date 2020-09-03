在学习 HTTP/2.0 和 HTTP/3.0 之前，得先学习一些密码学的基本知识。

1. 密码学的处理对象是**数字**和**字符串**。

2. **散列**是一种数据一旦转换为其他形式将永远无法恢复的加密技术。比如 哈希算法和MD5，MD5 严格意义上来说不能算是加密技术，因为它不能被解密出来。

3. 加密分**对称加密**和**非对称加密**。

- 对称加密（AES、DES、3DES）：**加密和解密使用同一个密钥**。对称加密只有一个密钥容易被拦截，不安全，但是加解密效率比非对称加密要高。

- 非对称加密（RSA、ECC）：**加密和解密使用不同的密钥**。一把作为公钥，另一把作为私钥。公钥加密的信息，只有私钥才能解密。私钥加密的信息，只有公钥才能解密。由于私钥永远都在自己手里，所以很安全，只是效率相比对称加密要低一些。

在实际使用过程中，通常是两种一起使用的。

4. 加解密过程

![cipher](../.vuepress/public/assets/image/http/cipher1.png 'cipher')

5. 密钥交换算法

Diffie-Hellman 算法是一种著名的密钥协商算法，这种算法可以使得信息交换的双方通过公开的非安全的网络协商生成安全的共享密钥。

（1）Alice 与 Bob 确定两个大素数 n 和 g，这两个数不用保密。

（2）Alice 选择另一个大随机数 x，并计算 A 如下：A = gx mod n。

（3）Alice 将 A 发给 Bob。

（4）Bob 选择另一个大随机数 y，并计算 B 如下：B = gy mod n。

（5）Bob 将 B 发给 Alice。

（6）计算秘密密钥 K1 如下：K1 = Bx mod n。

（7）计算秘密密钥 K2 如下：K2 = Ay mod n。

（8）如果 K1 =K 2，那么 Alice 和 Bob 就可以用其进行加解密。

在这整个过程中，两个素数是公开的，但是两个随机数是保密的，随机数的产生是最关键的地方。

6. 证书签发机构（CA）

- 通过 CA 发放的证书完成密钥的交换，实际上是**利用非对称的加密算法完成数据加密密钥的安全交换**，然后再利用数据加密密钥完成数据的安全交换。

- 数字证书是互联网通信中标识双方身份信息的数字文件，由 CA 签发。

- CA(certification authority) 是数字证书的签发机构。作为权威机构，其审核申请者身份后签发数字证书，这样我们只需要校验数字证书即可确定对方的真实身份。

- CA 的工作流程

（1）服务器 example.com 将从 CA 请求 TLS 证书，例如 Digicert。

（2）Digicert 将为 example.com 创建证书，证书将包含必要的数据，例如服务器名称，服务器的公钥等。

（3）Digicert 将创建数据(证书)的哈希值，并使用自己的私钥对其进行加密。

（4）浏览器和操作系统自带 Digicert 等权威机构的公钥。

（5）当浏览器收到签名证书时，它将使用公钥从签名生成哈希值，它还将使用证书中指定的散列算法生成数据(证书)的散列，如果两个哈希值匹配，则签名验证成功并且证书是可信的。

（6）现在浏览器可以使用证书中指定的 example.com 的公钥继续进行身份验证过程。

在这里，我们可以将 Digicert 称为 Root CA。