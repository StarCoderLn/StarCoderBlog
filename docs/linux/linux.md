## Linux 常用命令

`Linux` 常用命令的使用可以参考：[Linux常用命令大全](http://www.jsons.cn/linuxcode/#)

> 补充：`Windows` 常用命令的使用可以参考：[Windows 命令](https://docs.microsoft.com/zh-cn/windows-server/administration/windows-commands/windows-commands)

## Linux 配置免密登录

**1. 免密登录原理**

- 使用通过 ssh 协议生成的非对称加密秘钥进行连接，同步公钥到服务端，每次请求的服务器时，服务器验证是否存在公钥，会使用公钥加密一段信息传输到客户端，客户端再使用配对的私钥解密进行验证，从而验证客户端登录。

**2. 详细流程**

- 在客户端使用ssh-keygen生成一对密钥：公钥 + 私钥

- 将客户端公钥追加到服务端的authorized_key文件中，完成公钥认证操作

- 认证完成后，客户端向服务端发起登录请求，并传递公钥到服务端

- 服务端检索authorized_key文件，确认该公钥是否存在

- 如果存在该公钥，则生成随机数R，并用公钥来进行加密，生成公钥加密字符串pubKey(R)

- 将公钥加密字符串传递给客户端

- 客户端使用私钥解密公钥加密字符串，得到 R

- 服务端和客户端通信时会产生一个会话ID(sessionKey)，用MD5对R和SessionKey进行加密，生成摘要（即MD5加密字符串）

- 客户端将生成的MD5加密字符串传给服务端

- 服务端同样生成MD5(R,SessionKey)加密字符串

- 如果客户端传来的加密字符串等于服务端自身生成的加密字符串，则认证成功

- 此时不用输入密码，即完成建连，可以开始远程执行shell命令了

**3. 生成密钥**

ssh-keygen 用于生成公钥和私钥。常用的参数如下：

- -t: 指定生成密钥类型（rsa、dsa）。默认为rsa

- -f: 指定存放私钥的文件，公钥文件名为私钥文件名加 .pub 后缀。默认为 id_rsa

- -P: 指定 passphrase（私钥的密码），用于确保私钥的安全。默认为空

- -C: 备注。默认为 user@hostname

```shell
ssh-keygen -t rsa -C "you_set_name" -f "you_set_name_rsa"
```

**4. 上传公钥**

ssh-copy-id 用于将公钥拷贝到服务器的 /root/.ssh/authorized_keys 文件中。

```shell
ssh-copy-id -i you_set_nae_rsa.pub root@服务器ip/域名
```

在这一步中，一开始我用的是服务器的私网 IP：172.18.238.35。结果一直出现以下问题：

![linux](../.vuepress/public/assets/image/linux/linux1.png 'linux')

试着 ping 一下发现 ping 不通。后来换成了公网 IP：120.78.199.123。就可以了。

![linux](../.vuepress/public/assets/image/linux/linux2.png 'linux')

此时，在服务器中查看 authorized_keys 文件的内容就发现已经有我们上传的公钥了。

![linux](../.vuepress/public/assets/image/linux/linux3.png 'linux')