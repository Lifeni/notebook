---
name: deploy-with-github-actions
title: 用 GitHub Actions 部署 Vue 项目到 GitHub Pages
create-date: 2020-10-19
date: 2020-10-19
descriptions:
    - 尝试使用 GitHub Workflows 实现前端代码自动部署
    - 使用 CNAME 绑定域名到 GitHub Pages
tags:
    - Vue.js
    - GitHub Actions
    - GitHub Pages
license: CC-BY-SA-4.0
---

# 用 GitHub Actions 部署 Vue 项目到 GitHub Pages

📌 尝试使用 GitHub Workflows 实现前端代码自动部署

🔗 使用 CNAME 绑定域名到 GitHub Pages

## 目标

借助 GitHub Actions，实现在每次 Push 代码之后，自动构建并部署到 GitHub Pages 的分支上，再借助 CNAME 实现自定义域名的访问。

## 前提

- 使用 Vue 编写的项目，运行 `npm build` 或者 `yarn build` 后会生成 dist 文件

- 项目已经发布到 GitHub，且为公开状态

## 实现

### 1. 获取 ACCESS_TOKEN

1. 打开 https://github.com/settings/tokens ，点击右上方 Generate new token，应该要输入你的密码。之后把 Note 起一个名字，比如 `github-actions-deploy`，然后把 repo 的候选框选中。最后点下面的绿色按钮，跳转页面后获得一个 key，**这个 key 只会出现一次**，先复制下来，一会要用。

2. 打开你项目的 Settings，点击侧栏 Secrets，点击右上角 New secrets，输入名称 `ACCESS_TOKEN`，这个名字可以自定义，但是之后的配置里要用到这个名字。然后把刚才复制的 key 粘贴到 value 里，保存。

### 2. 创建 GitHub Workflows 配置文件

在项目根目录下创建 `.github/workflows/` 文件夹，新建 YAML 文件如下，名字随意：

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
      - name: Checkout 🛎️
        uses: actions/checkout@v2.3.1
        with:
          persist-credentials: false

      - name: Install and Build 🔧
        run: |
          yarn
          yarn build
      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@3.7.1
        with:
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          BRANCH: gh-pages
          FOLDER: dist
          CLEAN: true
```

之后推送改动到 GitHub，然后就可以看到 GitHub Actions 在执行了。

### 3. 创建 CNAME

上面的方案可以直接通过 example.github.io 这种方式访问（虽然会有绝对路径的问题），下面是配置自定义域名的方案。

在项目根目录下新建 `CNAME` 文件，内容只有一行，就是你自己的域名，不加 `https://` 和最后的 `/`。写完之后同样推送到 GitHub。

### 4. 配置 DNS 解析

这一步需要在你买域名的地方配置 DNS 解析，我用的是阿里云，添加解析时，需要把记录类型设置成 CNAME，主机记录设置成你的域名（我用的是二级域名，如果你要用一级域名，那么还需要多一些设置，可以查看：[管理 GitHub Pages 站点的自定义域 - GitHub Docs](https://docs.github.com/cn/free-pro-team@latest/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site#%E9%85%8D%E7%BD%AE-apex-%E5%9F%9F)），记录值设置成你项目仓库所在的 用户 / 组织 地址，比如 `lifeni.github.io`。

如果你的设定是，一个仓库对应一个域名的话，就不用考虑地址路径的问题，也就是不用在 JS 和 CSS 资源路径前面加上仓库名。

### 5. 配置 Repo 中的设置

回到你仓库的设置，找到下面 GitHub Pages，Source 部分应该自动设置成 gh-pages 了，这个不用动，下面的 Custom domain 设置成你的域名，勾上下面的 Enforce HTTPS。

如果有一个黄色的提示，说你没有设置 CNAME，而且 Enforce HTTPS 勾不上，网站也提示 HTTPS 错误，那就等一会，因为 GitHub 正在给你的域名申请 SSL 证书（用的是 Let's Encrypt）。

## 问题解决

### 打开页面后白屏，JS & CSS 404

这个是因为 Vue 打包后的 JS 和 CSS 文件被放在 `_assets` 文件夹中，这个文件夹是下划线开头的，和 GitHub Pages 用的 Jekyll 冲突，[Bypassing Jekyll on GitHub Pages - The GitHub Blog](https://github.blog/2009-12-29-bypassing-jekyll-on-github-pages/) 。

**解决方法：** 在项目 `public` 文件夹中添加一个文件，名字是 `.nojekyll`，这样在生成 dist 的时候，这个文件就会同时被部署到 GitHub Pages 中，以解决这个问题。

## 参考资料

1. [GitHub Actions 入门教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

2. [使用 GithubActions 发布 Vue 网站到 GithubPage - 地对地导弹 - 博客园](https://dev-preview.cnblogs.com/missile/p/13821397.html)

3. [underscore folder problem with github pages · Issue #65 · mpetrovich/stylemark](https://github.com/mpetrovich/stylemark/issues/65)
