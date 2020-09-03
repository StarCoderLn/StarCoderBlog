## Linux 常用命令

`Linux` 常用命令的使用可以参考：[Linux常用命令大全](http://www.jsons.cn/linuxcode/#)

> 补充：`Windows` 常用命令的使用可以参考：[Windows 命令](https://docs.microsoft.com/zh-cn/windows-server/administration/windows-commands/windows-commands)

## Linux 配置免密登录

正常我们想访问服务器，是需要输入密码的。

![linux](../.vuepress/public/assets/image/linux/linux4.png 'linux')

免密登录就是让我们省去输入密码这一步，直接就能访问服务器。

**1. 免密登录原理**

- ssh 的前身就是 telnet 协议，ssh 就包含了 ssl 协议。ssh 和 ssl 的关系就跟 HTTPS 和 HTTP 的关系一样。ssh 就是带加密的 telnet 协议。

- 使用通过 ssh 协议生成的非对称加密秘钥进行连接，同步公钥到服务端，每次请求的服务器时，服务器验证是否存在公钥，会使用公钥加密一段信息传输到客户端，客户端再使用配对的私钥解密进行验证，从而验证客户端登录。

**2. 详细流程**

- 在客户端使用 ssh-keygen 生成一对密钥：公钥 + 私钥

- 将客户端公钥追加到服务端的 authorized_key 文件中，完成公钥认证操作

- 认证完成后，客户端向服务端发起登录请求，并传递公钥到服务端

- 服务端检索 authorized_key 文件，确认该公钥是否存在

- 如果存在该公钥，则生成随机数R，并用公钥来进行加密，生成公钥加密字符串 pubKey(R)

- 将公钥加密字符串传递给客户端

- 客户端使用私钥解密公钥加密字符串，得到 R

- 服务端和客户端通信时会产生一个会话 ID(sessionKey)，用 MD5 对 R 和 SessionKey 进行加密，生成摘要（即 MD5 加密字符串）

- 客户端将生成的 MD5 加密字符串传给服务端

- 服务端同样生成 MD5(R,SessionKey) 加密字符串

- 如果客户端传来的加密字符串等于服务端自身生成的加密字符串，则认证成功

- 此时不用输入密码，即完成建连，可以开始远程执行 shell 命令了

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

ssh-copy-id 用于将公钥上传到服务器的 `/root/.ssh/authorized_keys` 文件中。

```shell
ssh-copy-id -i you_set_name_rsa.pub root@服务器ip/域名
```

在这一步中，一开始我用的是服务器的私网 IP：172.18.238.35。结果一直出现以下问题：

![linux](../.vuepress/public/assets/image/linux/linux1.png 'linux')

试着 ping 一下发现 ping 不通。后来换成了公网 IP：120.78.199.123。就可以了。

![linux](../.vuepress/public/assets/image/linux/linux2.png 'linux')

此时，在服务器中查看 authorized_keys 文件的内容就发现已经有我们上传的公钥了。

![linux](../.vuepress/public/assets/image/linux/linux3.png 'linux')

::: warning 注意
要确保公钥文件的访问权限是600，即 `-rw-------`。
:::

**5. 通过指定私钥的方式访问服务器**

现在，我们就可以通过指定私钥的方式来登录服务器了。如果想退出服务器，直接输入 `exit` 命令然后回车就行了。

```shell
ssh -i id_rsa root@120.78.199.123
```

![linux](../.vuepress/public/assets/image/linux/linux5.png 'linux')

但是，由于我之前在自己本地生成私钥的时候设置了访问密码，所以现在还得输入密码。要配置免密登录的话得把这个密码给去掉。

更改本地私钥的访问密码的方法如下：

- 在终端下输入 `ssh-keygen -p`。

- 系统会提示选择需要修改的私钥，在我的电脑上默认是 /var/root/.ssh/id_rsa。

- 选好文件后按回车，会提示输入旧密码。

- 输入好后会提示输入新密码。

- 连续两次回车，之前设置的私钥密码就被清除了。

![linux](../.vuepress/public/assets/image/linux/linux6.png 'linux')

再次访问服务器可以看到，可以直接登录了，不需要再输入密码。

![linux](../.vuepress/public/assets/image/linux/linux7.png 'linux')

**6. 更简便的访问方式**

上面我们虽然已经实现了 Linux 免密登录，但是需要我们输入的那行命令还是有点太长了。我们可以通过配置免密登录功能的本地配置文件来缩短这行命令。

- 编辑自己的 home 目录下（也就是路径显示为 ～）的 .ssh 目录中的 config 文件。默认情况下，.ssh 目录中要么为空，要么只有以下内容。其中 known_hosts 文件是你在第一次登录任何服务器的时候生成的文件。因此，我们需要在这里面创建一个 config 文件：`touch config`。

![linux](../.vuepress/public/assets/image/linux/linux8.png 'linux')

- 配置 config 文件的访问权限为644。

- 免密配置文件 config 的模版如下：

```shell
# 多主机配置，适用于同一个私钥给多台服务器使用的情况
Host gateway-produce
HostName IP或绑定的域名
Port 22
Host node-produce
HostName IP或绑定的域名
Port 22
Host java-produce
HostName IP或绑定的域名
Port 22

Host *-produce  # * 为通配符，匹配所有-produce 的服务器
User root
IdentityFile ~/.ssh/produce_key_rsa
Protocol 2
Compression yes
ServerAliveInterval 60
ServerAliveCountMax 20
LogLevel INFO

#单主机配置，适用于一个私钥只给一台服务器使用的情况
Host star-cloud                  # 给服务器取的别名
User root                        # 登录服务器的用户名
HostName IP或绑定的域名            # 服务器的 IP 地址或域名，注意前面不要加协议
IdentityFile ~/.ssh/id_rsa       # 私钥文件
Protocol 2
Compression yes
ServerAliveInterval 60
ServerAliveCountMax 20
LogLevel INFO

#单主机配置
Host git.yideng.site
User git
IdentityFile ~/.ssh/evilboy_rsa
Protocol 2
Compression yes
ServerAliveInterval 60
ServerAliveCountMax 20
LogLevel INFO
```

- 进入到 home 目录下的 .ssh 目录中，通过以下命令将私钥复制一份到这里。

```shell
sudo cp /var/root/.ssh/id_rsa id_rsa
```

::: warning 注意
要确保私钥文件的访问权限是600，即 `-rw-------`。
:::

- 我自己电脑上配置的 config 文件内容如下：

```
Host starcoderln
User root
HostName 120.78.199.123
IdentityFile ~/.ssh/id_rsa
Protocol 2
Compression yes
ServerAliveInterval 60
ServerAliveCountMax 20
LogLevel INFO
```

- 现在，就可以直接用 `ssh starcoderln` 命令登录服务器啦～ :smile:

![linux](../.vuepress/public/assets/image/linux/linux9.png 'linux')