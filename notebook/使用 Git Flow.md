---
name: use-git-flow
title: 使用 Git Flow
create-date: 2020-07-26
date: 2020-08-14
description: |
  记录学习使用 Git Flow 和 GitHub Flow 中的笔记和遇到的一些问题，需要注意的是，文中使用 Windows 环境进行测试，部分命令与其他环境存在差异，请根据自己的情况进行调整。
tags:
  - Git
  - GitHub
license: CC-BY-SA-4.0
---

# 使用 Git Flow

## 安装

使用 Git Flow 需要用到 `git flow` 命令，Windows 版的 Git 已经自带了这个命令，Linux 以及其他平台需要自行安装。

安装可以参考这个文档：[Installation · petervanderdoes/gitflow-avh Wiki](https://github.com/petervanderdoes/gitflow-avh/wiki/Installation)，Ubuntu 直接使用 `apt-get` 即可：

```bash
$ sudo apt-get install git-flow
```

## 流程

下图是 Git Flow 的流程图，长期存在的分支为 `master` 和 `develop`。

| 分支      | 含义                                                                                       |
| --------- | ------------------------------------------------------------------------------------------ |
| `master`  | 主分支，用来存放最终产品的代码，不能直接在这个分支上进行提交，每次合并代码之后都需要打 Tag |
| `develop` | 开发分支，用来生成新的功能分支，同时也会合并分支到 release                                 |
| `feature` | 功能分支，每个功能都用一个分支来开发，开发完成后会合并到开发分支，然后被删除               |
| `release` | 发布分支，用来进行发布前的小修复，完善后会合并到 master 分支                               |
| `hotfix`  | master 分支中遇到 Bug 时，进行热修复                                                       |
| `bugfix`  | release 分支中遇到 Bug 时，进行修复                                                        |
| `support` | 用来支持多个版本，并不常见                                                                 |

![Git Flow](https://file.lifeni.life/markdown/use-git-flow/01.jpg)

> 图片来自：[A successful Git branching model » nvie.com](https://nvie.com/posts/a-successful-git-branching-model/)

## 命令

### `git flow init`

初始化操作，也就是确定分支的名称，一般也不用改，一直回车就行。

```bash
$  git flow init

Which branch should be used for bringing forth production releases?
   - develop
   - master
Branch name for production releases: [master]

Which branch should be used for integration of the "next release"?
   - develop
Branch name for "next release" development: [develop]

How to name your supporting branch prefixes?
Feature branches? [feature/]
Bugfix branches? [bugfix/]
Release branches? [release/]
Hotfix branches? [hotfix/]
Support branches? [support/]
Version tag prefix? []
Hooks and filters directory? [XXX/.git/hooks]
```

### `git flow feature`

使用 `git flow feature start [name]` 命令来创建一个功能分支：

```bash
$ git flow feature start backend-init
Switched to a new branch 'feature/backend-init'

Summary of actions:
- A new branch 'feature/backend-init' was created, based on 'develop'
- You are now on branch 'feature/backend-init'

Now, start committing on your feature. When done, use:

     git flow feature finish backend-init
```

之后在这个分支上修改代码之后，进行提交：

```bash
$ git add *
...
$ git commit -m "message..."
...
```

完成一次或者多次提交之后，使用命令 `git flow feature finish [name]`，可以完成这个功能分支：

```bash
$ git flow feature finish backend-init
Switched to branch 'develop'
Updating 27475fe..7f960db
Fast-forward
 backend/.idea/backend.iml                       |   2 +-
 backend/.idea/encodings.xml                     |   6 ++
 ...
 17 files changed, 265 insertions(+), 10 deletions(-)
 create mode 100644 backend/.idea/encodings.xml
 ...
Deleted branch feature/backend-init (was 7f960db).

Summary of actions:
- The feature branch 'feature/backend-init' was merged into 'develop'
- Feature branch 'feature/backend-init' has been locally deleted
- You are now on branch 'develop'
```

执行这个命令之后，功能分支会自动合并到开发分支，然后这个功能分支会被自动删除。

### `git flow release`

使用 `git flow release start [name]` 命令来创建一个发布分支：

```bash
$ git flow release start v0.0.1
Switched to a new branch 'release/v0.0.1'

Summary of actions:
- A new branch 'release/v0.0.1' was created, based on 'develop'
- You are now on branch 'release/v0.0.1'

Follow-up actions:
- Bump the version number now!
- Start committing last-minute fixes in preparing your release
- When done, run:

     git flow release finish 'v0.0.1'
```

在 release 分支上可以进行最后的 Bug 修复，完成后再进行提交，完成发布分支：

```bash
$ git flow release finish 'v0.0.1'
Switched to branch 'master'
Merge made by the 'recursive' strategy.
 first.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 first.txt
Already on 'master'
hint: Waiting for your editor to close the file...
Switched to branch 'develop'
Already up to date!
Merge made by the 'recursive' strategy.
Deleted branch release/v0.0.1 (was 31fa6c5).

Summary of actions:
- Release branch 'release/v0.0.1' has been merged into 'master'
- The release was tagged 'v0.0.1'
- Release tag 'v0.0.1' has been back-merged into 'develop'
- Release branch 'release/v0.0.1' has been locally deleted
- You are now on branch 'develop'
```

可能会弹出来编辑器页面，填写 Tag 的描述信息。

### `git flow hotfix`

热修复，同样有 `start` 和 `finish` 两个命令，后面接的是新的版本号。

```bash
$ git flow hotfix start v0.0.2
Switched to a new branch 'hotfix/v0.0.2'

Summary of actions:
- A new branch 'hotfix/v0.0.2' was created, based on 'master'
- You are now on branch 'hotfix/v0.0.2'

Follow-up actions:
- Start committing your hot fixes
- Bump the version number now!
- When done, run:

     git flow hotfix finish 'v0.0.2'
```

```bash
git flow hotfix finish 'v0.0.2'
hint: Waiting for your editor to close the file...
Switched to branch 'develop'
Deleted branch hotfix/v0.0.2 (was a6249bc).

Summary of actions:
- Hotfix branch 'hotfix/v0.0.2' has been merged into 'master'
- The hotfix was tagged 'v0.0.2'
- Hotfix branch 'hotfix/v0.0.2' has been locally deleted
- You are now on branch 'develop'
```

### `git flow bugfix`

这个和 Hotfix 不一样，后面接的是分支的名字。

```bash
$ git flow bugfix start bug-1
Switched to a new branch 'bugfix/bug-1'

Summary of actions:
- A new branch 'bugfix/bug-1' was created, based on 'develop'
- You are now on branch 'bugfix/bug-1'

Now, start committing on your bugfix. When done, use:

     git flow bugfix finish bug-1
```

### `git flow support`

这个命令后面要接两个参数：`git flow support start <name> <base>`，第二个参数是基准的 Tag。

```bash
git flow support start support-test v0.0.1
Switched to a new branch 'support/support-test'

Summary of actions:
- A new branch 'support/support-test' was created, based on 'v0.0.1'
- You are now on branch 'support/support-test'
```

这个命令只有 `start` 这一个命令，没有 `finish`。

## GitHub Flow

GitHub Flow 和 Git Flow 有些不一样，它只有一个基本分支，就是 master（现在是 main），在创建功能或者 Bug 修复的时候再去新建分支，分支的名字要是有意义的。

建好分支之后，进行 Commit，也就是提交。所有提交都完成之后，需要 Open a Pull Request，创建拉取请求，确定要合并的分支，添加标题和说明。这一步之后并不会直接合并，而是可以进行讨论和修改代码，分支上的更改会自动更新。

处理完成后，进行 Merge pull request，合并拉取请求，这里可以选择三种合并的方式（图片来自 参考#6）：

1. Merge pull request （合并拉请求）

   ![Merge pull request](https://file.lifeni.life/markdown/use-git-flow/02.jpg)

2. Squash and merge（压缩并合并）

   ![Squash and merge](https://file.lifeni.life/markdown/use-git-flow/03.jpg)

3. Rebase and merge（变基并合并）

   简单地说就是把新的分支的提交拼接到 master 分支的最后面（或者说前面，就是最新的一端）

如果有冲突，需要解决冲突再进行合并。合并完成后可以选择删除已经合并的分支。

## 参考

1. [git-flow 备忘清单](https://danielkummer.github.io/git-flow-cheatsheet/index.zh_CN.html)
2. [git-flow 的工作流程 | Learn Version Control with Git](https://www.git-tower.com/learn/git/ebook/cn/command-line/advanced-topics/git-flow)
3. [what is support command in git flow - Stack Overflow](https://stackoverflow.com/questions/37889187/what-is-support-command-in-git-flow)
4. [Understanding the GitHub flow · GitHub Guides](https://guides.github.com/introduction/flow/)
5. [GitHub 流程 - GitHub Docs](https://docs.github.com/cn/github/collaborating-with-issues-and-pull-requests/github-flow)
6. [关于拉取请求合并 - GitHub Docs](https://docs.github.com/cn/github/collaborating-with-issues-and-pull-requests/about-pull-request-merges)
