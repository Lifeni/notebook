---
name: ssh-to-docker
title: SSH 连接服务器中的 Docker 容器进行开发
create-date: 2020-09-19
date: 2020-09-20
descriptions:
    - 在 Docker 中搭建多个开发环境，并使用 SSH 和 VSCode 进行连接和开发
tags:
    - Linux
    - Docker
    - VSCode
license: CC-BY-SA-4.0
---

# SSH 连接服务器中的 Docker 容器进行开发

📌 在 Docker 中搭建多个开发环境，并使用 SSH 和 VSCode 进行连接和开发

## 需求

有一个小组合作的前端项目 [ChatCat Web](https://github.com/ChatCat-Team/Web)，其余两位成员没有 npm 和 yarn 的使用经验，再加上国内网络情况一般，配置代理太麻烦了，所以我打算直接在服务器上用 Docker 做好开发环境，他们直接用 VSCode Remote 连到服务器上就可以进行开发了。

## 前提条件

1. 本地机器上装有 VSCode

2. 云服务器的安全组开放几个端口

3. 云服务器上装了 Docker

## 制作前端开发环境镜像

### 获取基础镜像

1. 由于是前端的项目，所以直接用 Node 镜像，Node 的 14 版本还有些问题，所以这里选择用 12 版本，buster 是 Debian 的版本，对应到 Ubuntu 就是 18.04：

   ```bash
   $ docker pull node:12.18.4-buster
   ```

2. 之后创建一个初始容器，配置好端口和文件映射：

   ```bash
   $ docker run -it -p 64800:22 -p 64801:3000 --name chatcat-web-00 -v /home/chatcat-web/00:/home -d node:12.18.4-buster
   ```

3. 进入容器内部：

   ```bash
   $ docker exec -it chatcat-web-00 /bin/bash
   root@8137bef9d08e:/#
   ```

### 安装必要的软件

Node 的 Docker 镜像用的是 Debian，所以先更新一下 apt 和 apt 源，之后再更新 Git 等常用软件。

1. 对 `/etc/apt/sources.list` 进行编辑，注释掉已有的之后添加 [debian | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/help/debian/) 数据：

   ```bash
   $ rm /etc/apt/sources.list
   $ cat >> /etc/apt/sources.list << EOF
   deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster main contrib non-free
   deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-updates main contrib non-free
   deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-backports main contrib non-free
   deb https://mirrors.tuna.tsinghua.edu.cn/debian-security buster/updates main contrib non-free
   EOF
   ```

2. 更新 apt 和系统里的软件：

   ```bash
   $ apt update
   $ apt upgrade
   ```

3. 安装 SSH-Server 和 Vim，并进行配置：

   ```bash
   $ apt install openssh-server vim
   $ vim /etc/ssh/sshd_config

   ...
   PubkeyAuthentication yes # 把注释去掉
   PermitRootLogin yes # 注释去掉，改成 yes
   ...
   ```

### 生成镜像

1. 首先退出容器，直接输入 exit 即可：

   ```bash
   root@8137bef9d08e:/# exit
   ```

2. 打包成镜像：

   ```bash
   $ docker commit -m "chatcat-web-v1" -a "LFN" f6e9e175015a chatcat/web:v1
   ```

## 运行多个容器

直接运行刚才写好的镜像即可，需要注意的是要根据需求把端口和目录映射进行修改。

```bash
$ docker run -it -p 64800:22 -p 64801:3000 --name chatcat-web-0 -v /home/chatcat-web/00:/home -d chatcat/web:v1
$ docker exec -it chatcat-web-0 /bin/bash
```

## 配置 SSH

### 生成秘钥

使用 `ssh-keygen` 命令生成秘钥，配置全部默认就行，之后把公钥复制到 `authorized_keys` 里。完成上面步骤之后启动 ssh 服务。

```bash
$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa):
Created directory '/root/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:l7g1kQJTjX+1KqawDJu/LKjiqb63n4ua4sq1n7omC9w root@b4bb6dd17e0d
The key's randomart image is:
+---[RSA 2048]----+
|      o..o       |
|       o. ..  .  |
|        ..o  . . |
|         o.o. .  |
|        S =. .   |
|. . . .  +o..    |
|.. E = o.o .     |
|=.=o*.= .        |
|%%B**O=.         |
+----[SHA256]-----+

$ cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
$ /etc/init.d/ssh restart
```

然后把私钥 `/root/.ssh/id_rsa` 复制到 `C:\Users\Liang\.ssh` 文件夹中。

### 尝试使用 SSH 进行连接

1. VSCode 安装拓展：

   - 名称: Remote - SSH
     ID: ms-vscode-remote.remote-ssh
     说明: Open any folder on a remote machine using SSH and take advantage of VS Code's full feature set.
     版本: 0.55.0
     发布者: Microsoft
     VS Marketplace 链接: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh

   - 名称: Remote - SSH: Editing Configuration Files
     ID: ms-vscode-remote.remote-ssh-edit
     说明: Edit SSH configuration files
     版本: 0.55.0
     发布者: Microsoft
     VS Marketplace 链接: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh-edit

2. 在侧边栏的远程资源管理器中添加 SSH Targets，输入：

   ```bash
   ssh root@139.9.138.39:XXX
   ```

3. 选择第一个配置文件地址：`C:\Users\Liang\.ssh\config`，打开这个文件，在里面修改刚才 VSCode 自动添加的配置，改成下面这样：

   ```
   Host ChatCatTest
       HostName 139.9.138.39
       User root
       Port XXX
       IdentityFile  ~/.ssh/id_rsa.pub
   ```

   可以看到 VSCode 侧栏里的名称已经自动变成 HOST 后面的名了。

4. 右键列表中的名字，选择 Connect to Host in Current Window，之后 VSCode 中上可能出现一个窗口，这里选择 Linux，然后打开侧栏里的资源管理器，选择打开文件夹，输入 `/home` 打开。

## 配置 Git

1. `ssh-keygen` 生成 Key：

   ```bash
   $ ssh-keygen -t rsa -C "liangfengning@foxmail.com"
   Generating public/private rsa key pair.
   Enter file in which to save the key (/root/.ssh/id_rsa): /root/.ssh/github
   Enter passphrase (empty for no passphrase):
   Enter same passphrase again:
   Your identification has been saved in /root/.ssh/github.
   Your public key has been saved in /root/.ssh/github.pub.
   The key fingerprint is:
   SHA256:DuMbWBKcHos4U5QbYAARJMP5E4z8dMUfXn5CMSRvmns liangfengning@foxmail.com
   The key's randomart image is:
   +---[RSA 2048]----+
   |#*=.  o. ..+.    |
   |oBo= o . .oo.    |
   |  =oB   o =o     |
   | o.* +   o+o .   |
   |+ . = + So  o    |
   | o   = +  .      |
   |    . o .. E     |
   |       o  .      |
   |      .          |
   +----[SHA256]-----+
   ```

2. 查看并复制生成的 **公钥**：

   ```bash
   $ cat /root/.ssh/github.pub
   ssh-rsa AAAAB3Nza ... jvvcZoh5ZaH liangfengning@foxmail.com
   ```

3. 把私钥复制到 GitHub 的 [SSH and GPG keys](https://github.com/settings/keys) 中，点 Add new，Title 随便写，Key 粘贴到里面。

4. 使用 `ssh -T git@github.com` 测试连接，如果出现 `git@github.com: Permission denied (publickey).`，则需要使用 `ssh-add` 命令：

   ```bash
   $ ssh-agent bash
   $ ssh-add ~/.ssh/github
   $ ssh -T git@github.com
   Warning: Permanently added the RSA host key for IP address '13.229.188.59' to the list of known hosts.
   Hi Lifeni! You've successfully authenticated, but GitHub does not provide shell access.
   ```

5. 设置好用户名和邮箱：

   ```bash
   $ git config --global user.name "Lifeni"
   $ git config --global user.email "liangfengning@foxmail.com"
   ```

6. 尝试 Clone：

   ```bash
   $ git clone https://github.com/ChatCat-Team/Web.git
   Cloning into 'Web'...
   remote: Enumerating objects: 63, done.
   remote: Counting objects: 100% (63/63), done.
   remote: Compressing objects: 100% (48/48), done.
   remote: Total 63 (delta 11), reused 56 (delta 10), pack-reused 0
   Unpacking objects: 100% (63/63), done.
   ```

之后就可以进行开发了。
