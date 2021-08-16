---
name: use-docker
title: 使用 Docker 搭建开发环境
create-date: 2019-12-10
date: 2020-03-19
description: 学习 Docker 的用法，记录常用配置过程，文中的操作均以 CentOS 7.6 64 位 为例，命令均以 root 执行。
license: CC-BY-SA-4.0
---

# 使用 Docker 搭建开发环境

## 安装 Docker

官方文档：[Get Docker Engine - Community for CentOS | Docker Documentation](https://docs.docker.com/install/linux/docker-ce/centos/#install-using-the-repository)

官方提供了三种安装方法，这里采用第一种：使用 Repository 安装。

1. 安装必要的包。

   ```bash
   $ yum install -y yum-utils \
   device-mapper-persistent-data \
   lvm2
   ```

2. 设定 Repository。

   ```bash
   $ yum-config-manager \
   --add-repo \
   https://download.docker.com/linux/centos/docker-ce.repo
   ```

3. 安装 Docker Engine - Community。

   ```bash
   $ yum install docker-ce docker-ce-cli containerd.io
   ```

4. 启动 Docker。

   ```bash
   $ systemctl start docker
   ```

5. 使用 hello-world 镜像测试。

   ```bash
   $ docker run hello-world
   ```

## 基本操作

使用 `docker --help` 查看帮助。

### 配置国内镜像

可以使用下面给出的这个，也可以用 阿里云 提供的加速服务，配置可以参考：[官方镜像加速*快速入门*容器镜像服务-阿里云](https://help.aliyun.com/document_detail/60750.html)，目前这个服务是免费的。

```bash
$ vim /etc/docker/daemmon.json

# 添加下面这句：
# {"registry-mirrors":["https://registry.docker-cn.com"]}

$ systemctl daemon-reload
$ systemctl restart docker
```

### 查看版本信息

```bash
$ docker version        # 查看详细版本信息
$ docker --version         # 查看简单版本信息
$ docker -v             # 同上
$ docker info            # 显示系统相关信息
```

### 镜像

镜像和虚拟机中的镜像类似，可以用来创建容器。

- 搜索镜像：

  ```bash
  $ docker search nginx
  ```

- 获取镜像，默认为 latest：

  ```bash
  $ docker pull nginx
  ```

- 查看已安装镜像：

  ```bash
  $ docker images
  ```

- 移除镜像，需要先移除使用镜像的容器：

  ```bash
  $ docker rmi hello-world
  ```

- 设置标签 test：

  ```bash
  $ docker tag 231d40e811cd author/nginx:test
  ```

可以根据容器来**创建一个镜像**，这里使用命令创建，另外可以使用 Dockerfile 文件创建。

```bash
# 描述信息 作者 容器ID 目标镜像名:TAG
$ docker commit -m="description" -a="author" 231d40e811cd author/nginx:new
```

之后运行 `docker images` 可以看到新的镜像。

### 容器

容器是镜像的实例。

- 启动容器（以终端模式）：

  ```bash
  # -i 交互式操作 -t 终端 镜像名 命令
  $ docker run -it ubuntu /bin/bash
  # 退出终端
  exit
  ```

- 查看所有容器：

  ```bash
  $ docker ps -a
  ```

- 停止容器：

  ```bash
  $ docker stop 231d40e811cd
  ```

- 重启容器：

  ```bash
  $ docker restart 231d40e811cd
  ```

- 删除容器：

  ```bash
  $ docker rm 79f8c2bcaed3
  ```

- 复制文件到主机：

  ```bash
  $ docker cp ab520f782c4b:/etc/nginx/nginx.conf /home/nginx
  ```

在启动容器时添加 `-d` 参数可以在 **后台运行**，此时可以用 `exec` 命令重新进入。

```bash
$ docker exec -it 231d40e811cd /bin/bash
```

在 Web 应用中还可以使用以下命令。

- 设置端口：

  ```bash
  $ docker run -d -p 5000:5000 webapp    # -p 设置端口
  ```

- 查看端口：

  ```bash
  $ docker port 231d40e811cd
  ```

- 查看日志：

  ```bash
  $ docker logs -f 231d40e811cd
  ```

- 查看进程：

  ```bash
  $ docker top 231d40e811cd
  ```

## Dockerfile

Dockerfile 的常用命令如下，详细用法见官方文档：[| Docker Documentation](https://docs.docker.com/engine/reference/builder/#maintainer-deprecated)。

| 命令         | 作用                                                               | 示例                                                                                            |
| ------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `FROM`       | 指定原始镜像，必须放在首位                                         | `FROM centos`                                                                                   |
| `LABEL`      | 给镜像添加标签，使用 `docker inspect [ID]` 可以查看镜像的 LABEL    | `LABEL version="1.0"`                                                                           |
| `RUN`        | 制作镜像过程中运行的命令                                           | `RUN yum install -y git`                                                                        |
| `CMD`        | 容器启动后调用的命令，只能写一条，会被 `docker run` 后面的命令覆盖 | `CMD ["executable","param1","param2"]` 例如 `CMD ["/usr/bin/wc","--help"]` 和 `CMD "/bin/bash"` |
| `EXPOSE`     | 指定需要暴露的端口                                                 | `EXPOSE 80`                                                                                     |
| `ENV`        | 指定环境变量，可以在后续指令中使用                                 | `ENV name John Doe` 或者 `ENV name="John Doe"`                                                  |
| `ADD` `COPY` | 两者功能相似，都是把文件添加到镜像中，`ADD` 可以添加网络资源       | `COPY requirements.txt /tmp/` 和 `ADD http://example.com/big.tar.xz /usr/src/things/`           |
| `ENTRYPOINT` | 与 `CMD` 类似，只能写一条，但不会被覆盖，除非用 `--entrypoint`     | `ENTRYPOINT ["executable", "param1", "param2"]`                                                 |
| `VOLUME`     | 设定容器可访问的主机目录                                           | `VOLUME ["/data"]`                                                                              |
| `USER`       | 设定运行容器时的 UID                                               | `USER <UID>[:<GID>]`                                                                            |
| `WORKDIR`    | 为之后的命令设定工作目录                                           | `WORKDIR /path/to/workdir`                                                                      |
| `ARG`        | 设置一个变量，在运行 `docker build` 时赋值                         | `ARG user=default` 和 `$ docker build --build-arg user=what_user .`                             |
| `ONBUILD`    | 当构建的镜像作为其他的镜像的基础镜像时要触发的命令                 | `ONBUILD RUN /usr/local/bin/python-build --dir /app/src`                                        |

### Best Practices

- `MAINTAINER` 已经被弃用，可以使用 `LABEL` 代替。

  ```dockerfile
  LABEL maintainer="SvenDowideit@home.org.au"
  ```

- 避免使用 `RUN apt-get upgrade`，因为父镜像中有些程序无法升级。

- 总是把 `RUN apt-get update` 与 `ap-get install` 放在一条语句里执行，否则会导致缓存问题。

  ```dockerfile
  # 官方文档中的最佳实践
  RUN apt-get update && apt-get install -y \
      aufs-tools \
      automake \
      build-essential \
      curl \
      dpkg-sig \
      libcap-dev \
      libsqlite3-dev \
      mercurial \
      reprepro \
      ruby1.9.1 \
      ruby1.9.1-dev \
      s3cmd=1.1.* \
   && rm -rf /var/lib/apt/lists/*
  ```

- `ENV` 的一种用法：

  ```dockerfile
  ENV PG_MAJOR 9.3
  ENV PG_VERSION 9.3.4
  RUN curl -SL http://example.com/postgres-$PG_VERSION.tar.xz | tar -xJC /usr/src/postgress && …
  ENV PATH /usr/local/postgres-$PG_MAJOR/bin:$PATH
  ```

- `WORKDIR` 多次使用则是相对上一个的路径，比如：

  ```dockerfile
  WORKDIR /a
  WORKDIR b
  WORKDIR c
  RUN pwd
  ```

  输出的是 `/a/b/c`。

- 由于 `CMD` 在运行 `docker run` 时可以被覆盖，所以可以把 `ENTRYPOINT` 与 `CMD` 结合，前者为命令，不可变，后者为命令的参数，可以改变：

  > 组合使用 ENTRYPOINT 和 CMD, ENTRYPOINT 指定默认的运行命令, CMD 指定默认的运行参数. 例子如下:
  >
  > ```docker
  > FROM ubuntu:trusty
  > ENTRYPOINT ["/bin/ping","-c","3"]
  > CMD ["localhost"]
  > ```
  >
  > 根据上面的 Dockerfile 构建镜像, 不带任何参数运行 docker run 命令
  >
  > ```text
  > $ docker build -t ping .
  > [truncated]
  >
  > $ docker run ping
  > PING localhost (127.0.0.1) 56(84) bytes of data.
  > 64 bytes from localhost (127.0.0.1): icmp_seq=1 ttl=64 time=0.025 ms
  > 64 bytes from localhost (127.0.0.1): icmp_seq=2 ttl=64 time=0.038 ms
  > 64 bytes from localhost (127.0.0.1): icmp_seq=3 ttl=64 time=0.051 ms
  >
  > --- localhost ping statistics ---
  > 3 packets transmitted, 3 received, 0% packet loss, time 1999ms
  > rtt min/avg/max/mdev = 0.025/0.038/0.051/0.010 ms
  >
  > $ docker ps -l
  > CONTAINER ID IMAGE COMMAND CREATED
  > 82df66a2a9f1 ping:latest "/bin/ping -c 3 localhost" 6 seconds ago
  > ```
  >
  > 上面执行的命令是 ENTRYPOINT 和 CMD 指令拼接而成. ENTRYPOINT 和 CMD 同时存在时, docker 把 CMD 的命令拼接到 ENTRYPOINT 命令之后, 拼接后的命令才是最终执行的命令. 但是由于上文说 docker run 命令行执行时, 可以覆盖 CMD 指令的值. 如果你希望这个 docker 镜像启动后不是 ping localhost, 而是 ping 其他服务器,, 可以这样执行 docker run:
  >
  > ```text
  > $ docker run ping docker.io
  > PING docker.io (162.242.195.84) 56(84) bytes of data.
  > 64 bytes from 162.242.195.84: icmp_seq=1 ttl=61 time=76.7 ms
  > 64 bytes from 162.242.195.84: icmp_seq=2 ttl=61 time=81.5 ms
  > 64 bytes from 162.242.195.84: icmp_seq=3 ttl=61 time=77.8 ms
  >
  > --- docker.io ping statistics ---
  > 3 packets transmitted, 3 received, 0% packet loss, time 2003ms
  > rtt min/avg/max/mdev = 76.722/78.695/81.533/2.057 ms
  >
  > $ docker ps -l --no-trunc
  > CONTAINER ID IMAGE COMMAND CREATED
  > 0d739d5ea4e5 ping:latest "/bin/ping -c 3 docker.io" 51 seconds ago
  > ```
  >
  > 运行 docker 镜像, 感觉上和执行任何其他的程序没有区别 --- 你指定要执行的程序(ping) 和 指定 ping 命令需要的参数.
  >
  > 注意到参数-c 3, 这个参数表示 ping 请求只发送 3 次, 这个参数包括在 ENTRYPOINT 里面, 相当于硬编码 docker 镜像中. 每次执行 docker 镜像都会带上这个参数, 并且也不能被 CMD 参数覆盖.
  >
  > 引用来源：[Dockerfile: ENTRYPOINT 和 CMD 的区别 - 知乎](https://zhuanlan.zhihu.com/p/30555962)

## Docker Compose

Docker Compose 与 Dockerfile 不同，前者前者负责的是一系列服务，后者指针对一个容器，两者可以同时使用。

### 安装

参考官方文档：[Install Docker Compose | Docker Documentation](https://docs.docker.com/compose/install/)：

```bash
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
$ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

### 使用

- 启动

  ```bash
  # -d 后台进行
  $ docker-compose up -d
  ```

- 停止

  ```bash
  $ docker-compose down
  ```

## 部署 Nginx

### 安装

1. 安装最新版：

   ```bash
    $ docker pull nginx:latest
   ```

2. 启动 Nginx：

   ```bash
    $ docker run -d \      # 后台运行
    -p 80:80 \            # 端口映射 主机:容器
    --name nginx-test \  # 命名
    nginx
   ```

3. 之后访问主机 IP 即可看到 Nginx 的欢迎页面。

### 配置

1. 在主机上创建好目录和文件，重定向到容器中即可，我这里同时配置了 SSL，所以会有两个端口。

   - `:ro` 表示只读模式。

   - `--net=host` 表示容器可以直接访问主机上所有的网络信息。

   ```bash
   $ docker run \
   --name nginx \
   -d -p 80:80 -p 443:443 \
   --net=host \
   -v /home:/usr/share/nginx/html \
   -v /home/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
   -v /home/nginx/conf.d:/etc/nginx/conf.d:ro \
   -v /home/nginx/cert:/etc/nginx/cert:ro \
   -v /home/nginx/log:/var/log/nginx \
   nginx
   ```

2. 之后可以将镜像导出，以便以后使用（这里导出其实没什么用，因为没有改动，重定向不会被记录到镜像中）。

   ```bash
   $ docker commit \
   --author "Lifeni" \
   --message "New Nginx" \
   nginx \
   nginx:v1
   ```

## 部署 Node.js

1. 先获取 Nodejs 镜像，再使用 Dockerfile 配置。

   ```bash
    $ docker pull node
   ```

2. 在 Nodejs 项目下新建 Dockerfile:

   ```dockerfile
    FROM node:latest
    RUN mkdir -p /home/app
    WORKDIR /home/app
    COPY . /home/app
    RUN npm install -d --registry=https://registry.npm.taobao.org
    RUN npm install
    EXPOSE 2333
    CMD ["npm", "start"]
   ```

3. 之后在项目目录下运行以下命令，构建镜像。

   ```bash
    $ docker build -t node-blog /home/node
   ```

4. 启动容器。

   ```bash
    $ docker run -d \
    -p 2333:2333 \
    node-blog
   ```

## 部署 Tomcat

只是简单的部署：

1. 安装：

   ```bash
    $ docker pull tomcat
   ```

2. 运行：

   ```bash
    $ docker run -d \
    -v /root/java/server.war:/usr/local/tomcat/webapps/server.war \
    -p 8080:8080 \
    tomcat
   ```

3. 进入 Container

   ```bash
    $ docker exec -it 59b9517b8a1e /bin/bash
   ```

## 构建基于 CentOS 镜像

由于很多 Linux 教程都是基于 CentOS，制作成镜像方便还原。

构建镜像可以选择从容器构建和用 Dockerfile 构建，**推荐使用后者**。

### 获取原始镜像

```bash
$ docker pull centos
```

### 使用 `commit` 命令创建镜像

1. 从服务器上下载原始镜像并运行：

   ```bash
    $ docker run -it centos /bin/bash
   ```

2. 安装常用软件：

   - dnf 包管理器

     ```bash
       $ yum install epel-release
     ```

     ```bash
       $ yum install dnf
     ```

     之后可以选择更新系统组件：

     ```bash
       $ dnf upgrade
     ```

   - Git

     ```bash
       $ dnf install git
     ```

   - Vim

     ```bash
       $ dnf install vim
     ```

3. 生成镜像：

   输入 `exit` 退回主机后，输入下面命令获取容器 ID 并创建镜像

   ```bash
    $ docker ps -a
   ```

   ```bash
    $ docker commit \
    --author "Lifeni" \
    --message "dnf+git+vim" \
    c99faa1bf08c \
    centos:v1
   ```

4. 运行时：

   ```bash
    $ docker run -it centos:v1 /bin/bash
   ```

### 使用 Dockerfile 构建镜像

1. 使用 Vim 新建一个 Dockerfile 文件：

   ```bash
    $ vim Dockerfile
   ```

2. 输入下面的命令：

   ```dockerfile
    FROM centos
    RUN yum install -y epel-release
    RUN yum install -y dnf
    RUN dnf install -y git
    RUN dnf install -y vim
   ```

3. 保存并退出。

4. 构建镜像，命令最后有一个点，表示上下文路径：

   ```bash
    $ docker build -t centos:v2 .
   ```

5. 运行测试：

   ```bash
    $ docker run -it centos:v2 /bin/bash
   ```

## 部分参考文章

1. [Get Docker Engine - Community for CentOS | Docker Documentation](https://docs.docker.com/install/linux/docker-ce/centos/)
2. [利用 commit 理解镜像构成 · Docker —— 从入门到实践](https://yeasy.gitbooks.io/docker_practice/image/commit.html)
3. [dnf 命令\_Linux dnf 命令用法详解：新一代的 RPM 软件包管理器](https://man.linuxde.net/dnf)
4. [| Docker Documentation](https://docs.docker.com/engine/reference/builder/)
5. [Dockerfile 文件详解 - 百衲本 - 博客园](https://www.cnblogs.com/panwenbin-logs/p/8007348.html)
6. [Dockerfile: ENTRYPOINT 和 CMD 的区别 - 知乎](https://zhuanlan.zhihu.com/p/30555962)
