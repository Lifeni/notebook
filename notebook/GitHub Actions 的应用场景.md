---
name: github-actions-example
title: GitHub Actions 的应用场景
create-date: 2020-11-21
date: 2020-11-21
descriptions:
  - 记录一些常见的 GitHub Actions 配置与应用场景
tags:
  - GitHub Actions
license: CC-BY-SA-4.0
---

# GitHub Actions 的应用场景

📌 记录一些常见的 GitHub Actions 配置与应用场景

👀 之前写过一个类似的文章，[用 GitHub Actions 部署 Vue 项目到 GitHub Pages | 记录干杯](https://lifeni.life/article/deploy-with-github-actions)

## 构建 Node.js 应用并部署到服务器

### 需求

需求来自我的个人网站，需要使用 Gatsby.js 来把 Markdown 文件生成静态的网页文件，然后部署在服务器上。

借助 GitHub Actions 可以实现在文章或者网站发生修改并进行 git commit 后，自动生成新版本的网站，并上传到自己的服务器。相比之前要手动 Build 和 SFTP上传，节省了很多操作与时间。

### 实现

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
          submodules: "true"
	  # 设置 Node 环境
      - uses: actions/setup-node@v1
        with:
          node-version: 12
      # npm ci 是专门用于 ci 的命令
      # 与 npm install 的区别是 npm ci 每次执行的时候会删除 node_modules
      - run: npm ci			
      - run: npm run build
        env:	# algolia 是一个页内搜索，这个 env 等同于根目录下的 .env 文件
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
          source: "public"
          target: "/home/website"
          overwrite: true

```

## 使用 SSH 执行服务器上的部署命令

### 需求

有一些私密项目或者其他原因，我们可能不希望把代码文件放在 GitHub Actions 上执行，我也有这样一个仓库，是我的 API 服务器，一个使用 Nest.js 编写的项目，需要 Build 后使用 pm2 执行。

### 实现

我这里选择了直接在 Commit 后通过 SSH 连接到远程服务器，然后 Clone 代码再进行构建和部署操作。

需要注意的是，因为是私密仓库，所以在远程服务器上需要配置好 Git 的 SSH Key，才能在不输入密码的情况下 Clone 仓库。

### 配置文件

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

## 常用的 Actions

- actions/checkout

    用于获取 Git 仓库，默认是获取当前仓库。

    官方文档：[Checkout · Actions · GitHub Marketplace](https://github.com/marketplace/actions/checkout) 。

- actions/setup-node

    用于设置 Node.js 环境。

    官方文档：[Setup Node.js environment · Actions · GitHub Marketplace](https://github.com/marketplace/actions/setup-node-js-environment) 。

- appleboy/ssh-action

    用于执行远程的 SSH 命令。

    官方文档：[SSH Remote Commands · Actions · GitHub Marketplace](https://github.com/marketplace/actions/ssh-remote-commands) 。

- appleboy/scp-action

    用于执行 SCP 命令。

    官方文档：[SCP Files · Actions · GitHub Marketplace](https://github.com/marketplace/actions/scp-files) 。

## 进一步了解

- [GitHub Actions 快速入门 - GitHub Docs](https://docs.github.com/cn/free-pro-team@latest/actions/quickstart)
- [Gatsby](https://www.gatsbyjs.com/)
- [Git - 子模块](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)
- [npm-ci | npm Docs](https://docs.npmjs.com/cli/v6/commands/npm-ci)
- [Site Search & Discovery powered by AI | Algolia](https://www.algolia.com/)
- [NestJS - A progressive Node.js framework](https://nestjs.com/)