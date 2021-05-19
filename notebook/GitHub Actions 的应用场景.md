---
name: github-actions-example
title: GitHub Actions 的应用场景
create-date: 2020-11-21
date: 2021-03-28
description: |
  记录一些常见的 GitHub Actions 配置与应用场景，之前写过一个类似的文章，[用 GitHub Actions 部署 Vue 项目到 GitHub Pages | 记录干杯](https://lifeni.life/article/deploy-with-github-actions)，这次做一个相关配置的补充和整合。
tags:
  - GitHub Actions
license: CC-BY-SA-4.0
---

# GitHub Actions 的应用场景

## 制作并发布 Docker 镜像

我做了一个可以自托管的文字展示与分享应用（[Lifeni/i-show-you: A self-hosted web application for data presentation and sharing.](https://github.com/Lifeni/i-show-you)），并把它制作成了 Docker 镜像（[Docker Hub](https://hub.docker.com/repository/docker/lifeni/i-show-you/general)），然后用户可以通过 Docker Compose 进行应用的搭建。应用采用前后端分离，前端用的 React，后端用的 Golang，所以最后打包的镜像中要包含前端静态文件和后端的可执行二进制文件。

为了节省时间、避免网络问题带来的影响，我选择使用 GitHub Actions 进行应用的构建以及 Docker 镜像的构建与上传，具体流程及配置文件如下。

### 实现方式

直接根据 Docker 官方提供的 Actions，按照文档（[Build and push Docker images · Actions · GitHub Marketplace](https://github.com/marketplace/actions/build-and-push-docker-images)）修改即可。基本流程是根据写好的 Dockerfile 生成镜像，然后发布到 Docker Hub。

实际执行流程可以去我的项目的 Actions 中看看：[Actions · Lifeni/i-show-you](https://github.com/Lifeni/i-show-you/actions?query=workflow%3A%22Build+and+Publish+Docker+Image%22) 。

### 配置文件

构建镜像的 YAML 如下，需要在 GitHub 仓库的设置的 secret 中设定 `DOCKER_USERNAME` 和 `DOCKER_PASSWORD`，其中 `DOCKER_PASSWORD` 不是 Docker 账户的密码，而是一个用户令牌（Access Token），可以在 https://hub.docker.com/settings/security 这个页面中获取。

```yml
name: Build and Publish Docker Image

on:
  release:
    types: [published]

jobs:
  push-to-registry:
    name: Push Docker image to Docker Hub
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          persist-credentials: false

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v1

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Login to DockerHub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          context: .
          file: ./build/Dockerfile
          push: true
          tags: lifeni/i-show-you:latest
```

使用到的 Dockerfile 如下，先通过包含前端和后端环境的两个镜像把最终的可运行的文件构建出来，其中前端是静态 HTML、JS 等，后端是可执行文件。然后再把这些文件打包进 Alpine 镜像（一种精简的镜像），生成最终的镜像。最后生成的镜像大概只有十几 MB，比较精简。

```dockerfile
# Build Webapp
FROM node:lts-alpine as webapp
WORKDIR /web
COPY ./webapp .
RUN yarn && yarn build

# Build Server
FROM golang:alpine as server
WORKDIR /go/src/app
COPY ./server .
RUN go install -v ./... && go get -d -v ./...

FROM alpine:latest
WORKDIR /app
COPY --from=webapp /web/build ./public
COPY --from=server /go/bin/server .
COPY ./configs/main.yml ./configs/
RUN apk update && apk --no-cache add ca-certificates && rm -rf /var/cache/apk/*

EXPOSE 8080

CMD ["/app/server"]
```

## 构建与部署 Node.js 应用

需求来自我的个人网站，需要使用 Gatsby.js 来把 Markdown 文件生成静态的网页文件，然后部署在服务器上。

借助 GitHub Actions 可以实现在文章或者网站发生修改并进行 git commit 后，自动生成新版本的网站，并上传到自己的服务器。相比之前要手动 Build 和 SFTP 上传，节省了很多操作与时间。

### 实现方式

由于自己的服务器在国内，连接 npm 很慢，所以考虑直接在 GitHub 的服务器上进行 build 操作，然后把生成的静态文件通过 SCP 命令传输到自己的服务器上。

我的 Markdown 文章都是放在另一个 Git 仓库里，所以为了部署的时候方便，就把文章仓库设置为了网站仓库的 Submodule，这样在进行 git clone 的时候，可以直接把两个仓库都克隆下来，然后进行构建即可。

完成的 Actions：[Actions · Lifeni-Site/Website](https://github.com/Lifeni-Site/Website/actions) 以及 [Actions · Lifeni-Site/Content](https://github.com/Lifeni-Site/Content/actions) 。

### 配置文件

在项目根目录下新建 `.github/workflows/deploy.yml` 文件，文件名字可以随便起，并写入以下内容，这样在每次 Push 到 GitHub 之后都会自动执行 Actions。

```yml
name: GitHub Actions Build and Deploy
on:
  push:
    branches:
      - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      # 克隆仓库及子仓库
      - uses: actions/checkout@v2
        with:
          submodules: 'true'
      # 设置 Node 环境
      - uses: actions/setup-node@v1
        with:
          node-version: 12
      # npm ci 是专门用于 ci 的命令
      # 与 npm install 的区别是 npm ci 每次执行的时候会删除 node_modules
      - run: npm ci
      - run: npm run build
        env: # algolia 是一个页内搜索，这个 env 等同于根目录下的 .env 文件
          GATSBY_ALGOLIA_APP_ID: ${{ secrets.GATSBY_ALGOLIA_APP_ID }}
          GATSBY_ALGOLIA_SEARCH_KEY: ${{ secrets.GATSBY_ALGOLIA_SEARCH_KEY }}
          ALGOLIA_ADMIN_KEY: ${{ secrets.ALGOLIA_ADMIN_KEY }}
      # 使用 scp 命令传文件
      - uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          port: ${{ secrets.PORT }}
          source: 'public'
          target: '/home/website'
          overwrite: true
```

## 使用 SSH 远程执行命令

有一些私密项目或者其他原因，我们可能不希望把代码文件放在 GitHub Actions 上执行，我也有这样一个仓库，是我的 API 服务器，一个使用 Nest.js 编写的项目，需要 Build 后使用 pm2 执行。

### 实现与配置文件

我这里选择了直接在 Commit 后通过 SSH 连接到远程服务器，然后 Clone 代码再进行构建和部署操作。

需要注意的是，因为是私密仓库，所以在远程服务器上需要配置好 Git 的 SSH Key，才能在不输入密码的情况下 Clone 仓库。

```yml
name: GitHub Actions Build and Deploy
on:
  push:
    branches:
      - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: ssh
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          port: ${{ secrets.PORT }}
          script: |
            cd /home/server/
            git pull
            yarn
            yarn build
            pm2 restart all
```

## 打包文件为 zip 并上传到 Releases

因为做了一个浏览器扩展，所以需要在每次发布之后，把扩展打包为 zip 文件，给没有上架的浏览器平台使用。

### 实现与配置文件

关键点都有现成的 Actions，直接拿来用就行。

```yml
name: Build and Publish Zip

on:
  release: # 发布 Release 后才会运行
    types: [published]

jobs:
  build-zip:
    name: Build and Publish Extension Zip
    runs-on: ubuntu-latest
    steps:
      - name: Checkout # 克隆项目
        uses: actions/checkout@v2
        with:
          persist-credentials: false

      - name: Install and Build # 安装依赖
        run: |
          yarn
          yarn build:all

      - name: Archive Release V3 # 打包文件为 zip
        uses: thedoctor0/zip-release@master
        with:
          filename: 'make-it-beautiful.manifest-v3.zip'
          path: 'dist'

      - name: Archive Release V2 # 同样打包文件为 zip，我这里需要打包两个文件，根据自己需求来改
        uses: thedoctor0/zip-release@master
        with:
          filename: 'make-it-beautiful.manifest-v2.zip'
          path: 'dist-v2'

      - name: Upload Release # 发布到 Release
        uses: ncipollo/release-action@v1
        with:
          allowUpdates: true # 因为之前已经创建了 Release，所以要进行更新
          omitName: true # 更新的时候不改变 Release 的名字
          artifacts: 'make-it-beautiful.manifest-v3.zip,make-it-beautiful.manifest-v2.zip' # 多个文件逗号分开
          token: ${{ secrets.GIT_TOKEN }} # https://github.com/settings/tokens 只选 repo 就行
```

## 常用的 Actions

- actions/**checkout**

  用于获取 Git 仓库，默认是获取当前仓库。

  文档：[Checkout · Actions · GitHub Marketplace](https://github.com/marketplace/actions/checkout) 。

- actions/**setup-node**

  用于设置 Node.js 环境。

  文档：[Setup Node.js environment · Actions · GitHub Marketplace](https://github.com/marketplace/actions/setup-node-js-environment) 。

- appleboy/**ssh-action**

  用于执行远程的 SSH 命令。

  文档：[SSH Remote Commands · Actions · GitHub Marketplace](https://github.com/marketplace/actions/ssh-remote-commands) 。

- appleboy/**scp-action**

  用于执行 SCP 命令。

  文档：[SCP Files · Actions · GitHub Marketplace](https://github.com/marketplace/actions/scp-files) 。

- actions/**build-and-push-docker-images**

  用于构建和推送 Docker 镜像。

  文档：[Build and push Docker images · Actions · GitHub Marketplace](https://github.com/marketplace/actions/build-and-push-docker-images) 。

- actions/**create-release**

  可以创建 Release。

  文档：[Create Release · Actions · GitHub Marketplace](https://github.com/marketplace/actions/create-release) 。

- actions/**zip-release**

  打包文件为 zip 或者 tar。

  文档：[Zip Release · Actions · GitHub Marketplace](https://github.com/marketplace/actions/zip-release) 。

## 进一步了解

- [GitHub Actions 快速入门 - GitHub Docs](https://docs.github.com/cn/free-pro-team@latest/actions/quickstart)
- [Gatsby](https://www.gatsbyjs.com/)
- [Git - 子模块](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)
- [npm-ci | npm Docs](https://docs.npmjs.com/cli/v6/commands/npm-ci)
- [Site Search & Discovery powered by AI | Algolia](https://www.algolia.com/)
- [NestJS - A progressive Node.js framework](https://nestjs.com/)
