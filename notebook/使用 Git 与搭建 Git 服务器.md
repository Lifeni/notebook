---
name: use-git
title: 使用 Git 与搭建 Git 服务器
create-date: 2020-03-19
date: 2020-05-05
description: |
  学习 Git 的基本用法，并尝试使用 Gitea 搭建 Git 服务器。
tags:
  - Git
  - Gitea
  - Linux
license: CC-BY-SA-4.0
---

# 使用 Git 与搭建 Git 服务器

## Git 基本用法

根据 [官方文档](https://git-scm.com/book/zh/v2/) 的学习路线进行总结。

### `git help`

获取详细的帮助。

```bash
$ git help stash
$ git merge --help
$ git merge -h    # 获取简明帮助
```

### `git init` `--bare`

初始化一个 Git 仓库，两者的区别是：

- `git init` 用于创建一个本地库，里面存放有你写的代码文件和 `.git` 文件夹。
- `git init --bare` 创建一个裸库，常用于远程仓库，里面只有 `.git` 文件夹。远程仓库用于多人协作或者备份，使用 Git 时会把代码 `commit` 到本地仓库，再 `push` 到远程仓库。

```bash
$ cd /mnt/d/git/init-test
$ git init
Initialized empty Git repository in /mnt/d/git/init-test/.git/
```

### `git status`

查看当前仓库的状态。

```bash
$ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   modified.txt
        new file:   tobecommited.txt

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   modified.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        untracked.txt
```

`-s` 和 `--short` 参数可以简化输出：

```bash
$ git status -s
A  777.txt
AM 888.txt
M  modified.txt
?? untracked.txt
```

### `git diff` `--staged`

比较文件差异，两者区别是：

- `git diff` 查看当前文件与**暂存区**文件的差异，也就是执行 `git add` 前后文件的差异，不包括未跟踪的文件。

- `git diff --staged` 查看当前文件与**最后一次提交**的文件的差异，也就是执行 `git commit` 前后文件的差异，包括在 `git commit` 之前新添加跟踪的文件。`git diff --cached` 为另一种写法。

```bash
$ git diff
diff --git a/modified.txt b/modified.txt
index e5aa983..151e604 100644
--- a/modified.txt
+++ b/modified.txt
@@ -1 +1,2 @@
-99912
\ No newline at end of file
+99912^M
+hgfdg
\ No newline at end of file
```

### `git add`

开始跟踪一个文件或把文件添加到暂存区。

```bash
$ git add example.txt
$ git add .            # . 指当前目录
$ git add code/        # 跟踪指定目录下所有文件
```

使用场景如下：

- 新建一个文件 --- `git add` --- 开始跟踪文件并提交到暂存区 --- `git commit`
- 修改一个已跟踪的文件 --- `git add` --- 提交到暂存区 --- `git commit`

### `git commit` `--amdend`

直接输入命令 `git commit` 会打开文本编辑器编写 Commit 信息。不过也可以使用 `git commit -m "message"` 这种写法。

```bash
$ git commit -m "git test 5"
[master e2706a2]  On branch master  Your branch is ahead of 'origin/master' by 1 commit.    (use "git push" to publish
your local commits)
 7 files changed, 3 insertions(+)
 create mode 100644 777.txt
 create mode 100644 888.txt
 create mode 100644 "untracked - \345\211\257\346\234\254 (2).txt"
 create mode 100644 "untracked - \345\211\257\346\234\254.txt"
 create mode 100644 untracked.txt
```

`git commit -a` 对于已跟踪过的文件，可以“省略”`git add` 步骤，相当于同时执行 `add` 和 `commit` 。

```bash
$ git status -s
 M modified.txt
$ git commit -a -m "commit -a test"
[master 4d2a641] commit -a test
 1 file changed, 2 insertions(+), 1 deletion(-)
```

如果你在执行 `commit` 之后又改动了一些文件，但不想让这次改动污染提交历史，那么可以用 `git commit --amend` 命令把当前暂存区中的文件提交，并覆盖上一次提交。

```bash
$ git commit -m "one commit"
[master deef0a2] one commit
 1 file changed, 0 insertions(+), 0 deletions(-)
 rename 222.md => 233.md (100%)
$ vim 000.txt
$ git add 000.txt
$ git log -2
* deef0a2 - (HEAD -> master) one commit (60 seconds ago) <liangfengning>
* 6b2ad04 - git rm test 2 (6 days ago) <liangfengning>
$ git commit --amend
[master 08a4f90] one commit
 Date: Fri Apr 3 18:31:23 2020 +0800
 2 files changed, 1 insertion(+)
 create mode 100644 000.txt
 rename 222.md => 233.md (100%)
$ git log -2    # 可以看到合并后只有一条记录
* 08a4f90 - (HEAD -> master) one commit (22 seconds ago) <liangfengning>
* 6b2ad04 - git rm test 2 (6 days ago) <liangfengning>
```

### `git rm`

从已跟踪的文件中移除某个文件，并删除文件。

```bash
$ git rm readme.txt
rm 'readme.txt'
$ git status
On branch master
Your branch is ahead of 'origin/master' by 1 commit.
  (use "git push" to publish your local commits)

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        deleted:    readme.txt
$ cat readme.txt
cat: readme.txt: No such file or directory
```

文件从 Git 和本地都删除了，如果只删除本地文件则不会把更改提交到暂存区：

```bash
$ rm modified.txt
$ git status
On branch master
Your branch is ahead of 'origin/master' by 1 commit.
  (use "git push" to publish your local commits)

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        deleted:    readme.txt

Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        deleted:    modified.txt
```

如果要 `git rm` **已经修改但未加入暂存区（add）** 和 **加入暂存区但未提交（commit）** 的文件，则会出错，需要使用 `git rm -f`：

```bash
$ vim commit.txt
$ git rm commit.txt
error: the following file has local modifications:
    commit.txt
(use --cached to keep the file, or -f to force removal)
$ git add commit.txt
$ git rm commit.txt
error: the following file has changes staged in the index:
    commit.txt
(use --cached to keep the file, or -f to force removal)
$ git rm -f commit.txt
rm 'commit.txt'
```

如果要把一个文件从 Git 中移除（不被跟踪），但不删除源文件，可以用 `git rm --cache` 命令：

```bash
$ git rm --cache 777.txt
rm '777.txt'
$ git status
On branch master
Your branch is ahead of 'origin/master' by 3 commits.
  (use "git push" to publish your local commits)

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        deleted:    777.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        777.txt
```

常用于忘记添加 `.gitignore` 的情况。

### `git mv`

移动文件，也可以是重命名。

```bash
$ git mv 222.md 233.md
$ git status
On branch master
Your branch is ahead of 'origin/master' by 3 commits.
  (use "git push" to publish your local commits)

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        renamed:    222.md -> 233.md
```

相当于以下命令：

```bash
$ mv 222.md 233.md
$ git rm 222.md
$ git add 233.md
```

### `git log`

查看 Git 的历史记录，最新的在最上面，中间的是提交说明。

```bash
$ git log
commit 6b2ad042395e6bd74bf4187677955383c79b017d (HEAD -> master)
Author: liangfengning <liangfengning@foxmail.com>
Date:   Sat Mar 28 19:39:15 2020 +0800

    git rm test 2

...
```

`git log -p` 可以查看每次提交的详细改动，`git log -2` 只展示最近两条提交：

```bash
t$ git log -p -2
commit 6b2ad042395e6bd74bf4187677955383c79b017d (HEAD -> master)
Author: liangfengning <liangfengning@foxmail.com>
Date:   Sat Mar 28 19:39:15 2020 +0800

    git rm test 2

diff --git a/222.md b/222.md
new file mode 100644
index 0000000..ada8034
--- /dev/null
+++ b/222.md
@@ -0,0 +1 @@
+# Test for Git
...
```

`git log --stat` 展示相对简略的信息：

```bash
$ git log --stat
commit 6b2ad042395e6bd74bf4187677955383c79b017d (HEAD -> master)
Author: liangfengning <liangfengning@foxmail.com>
Date:   Sat Mar 28 19:39:15 2020 +0800

    git rm test 2

 222.md       | 1 +
 modified.txt | 2 --
 2 files changed, 1 insertion(+), 2 deletions(-)
...
```

`git log --pretty=oneline` 把每次提交放在一行里，`--graph` 类图形化展示：

```bash
$ git log --pretty=oneline --graph
6b2ad042395e6bd74bf4187677955383c79b017d (HEAD -> master) git rm test 2
e797abf049a3c355c93ec3645d11c3f7cbb04cc6 git rm test
4d2a64150f5c2718566b605fce49fafb4661f123 commit -a test
...
*   bc8811421a40e134e8e01219decedadbdc6ca4e0 (tag: v1.0) merge with no-ff
|\
| * e1de0db0c9552eff4877c1d115b82f34106417d7 add merge
|/
*   4a0cec3aaba4d993f0912325214126418bf6b622 conflict fixed
|\
| * fc2dae62967912c581ed617a4ed3ce6aadeac232 AND simple
* | 075ee45a491458df9e9d70bce7220e2944c3ac83 & simple
|/
* d049c3bb6c386a7c24e4a1f6129532a33713c258 branch test
...
```

更多用法见：[Git - 查看提交历史](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E6%9F%A5%E7%9C%8B%E6%8F%90%E4%BA%A4%E5%8E%86%E5%8F%B2)。

### `git reset`

`git reset HEAD <filename>` 用于把暂存区的文件撤回未 `add` 状态。常见应用是把不应该 `git add` 的文件添加到暂存区，要撤回这个操作。

```bash
$ git status
On branch master
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   1.txt
$git reset HEAD 1.txt
Unstaged changes after reset:
M       1.txt
$ git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   1.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

### `git checkout` `撤销操作`

`git checkout --<filename>` 把一个文件的改动撤回到上一次提交的状态。**注意**：这个操作无法撤销，源文件会被覆盖。

新版本的 `git restore` 可以替代这个命令。

```bash
# 使用 checkout
$ git status
On branch master

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   2.txt

no changes added to commit (use "git add" and/or "git commit -a")
$ git checkout -- 2.txt
$ git status
On branch master

nothing to commit, working tree clean
```

```bash
# 使用 restore
$ git status
On branch master

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   1.txt

no changes added to commit (use "git add" and/or "git commit -a")
$ git restore 1.txt
 git status
On branch master

nothing to commit, working tree clean
```

### `git tag`

查看标签，使用 `git tag -l "通配符"` 可以进行筛选。

```bash
$ git  tag
v1.0
```

```bash
# 下面的例子来自官方文档，有改动
$ git tag -l "v1.8.5*"
v1.8.5
v1.8.5-rc0
v1.8.5.1
```

> Git 支持两种标签：轻量标签（lightweight）与附注标签（annotated）。
>
> 轻量标签很像一个不会改变的分支——它只是某个特定提交的引用。
>
> 而附注标签是存储在 Git 数据库中的一个完整对象， 它们是可以被校验的，其中包含打标签者的名字、电子邮件地址、日期时间， 此外还有一个标签信息，并且可以使用 GNU Privacy Guard （GPG）签名并验证。 通常会建议创建附注标签，这样你可以拥有以上所有信息。但是如果你只是想用一个临时的标签， 或者因为某些原因不想要保存这些信息，那么也可以用轻量标签。
>
> 引用来源：[Git - 打标签](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E6%89%93%E6%A0%87%E7%AD%BE)。

使用 `git tag -a` 创建一个附注标签。

```bash
$ git tag -a v1.1 -m "tag test"
$ git show v1.1
tag v1.1
Tagger: liangfengning <liangfengning@foxmail.com>
Date:   Tue May 5 18:26:10 2020 +0800

tag test

commit 354b9e0c162c50cfbfc837f312c8cc75c7632fae (HEAD -> master, tag: v1.1, origin/master)
Merge: 380e12e fc5e06f
Author: liangfengning <liangfengning@foxmail.com>
Date:   Tue May 5 17:50:10 2020 +0800

    Merge branch 'test'
```

直接创建轻量标签。

```bash
$ git tag v1.1.1
$ git show v1.1.1
commit 354b9e0c162c50cfbfc837f312c8cc75c7632fae (HEAD -> master, tag: v1.1.1, tag: v1.1, origin/master)
Merge: 380e12e fc5e06f
Author: liangfengning <liangfengning@foxmail.com>
Date:   Tue May 5 17:50:10 2020 +0800

    Merge branch 'test'
```

也可以在某次提交上打标签。

```bash
$ git tag v0.1.1 d65b938
$ git show v0.1.1
commit d65b938fda4e87759d9ffe40e816e9582ca1ba9a (tag: v0.1.1)
Author: liangfengning <liangfengning@foxmail.com>
Date:   Sun Apr 19 00:48:02 2020 +0800
...
```

标签需要主动推送到远程服务器，不能使用全局的 push。

```bash
# 这样不行
$ git push origin master
Everything up-to-date

# 需要单独 push
$ git push origin v1.1
Enumerating objects: 1, done.
Counting objects: 100% (1/1), done.
Writing objects: 100% (1/1), 158 bytes | 158.00 KiB/s, done.
Total 1 (delta 0), reused 0 (delta 0)
remote: . Processing 1 references
remote: Processed 1 references in total
To https://dev.lifeni.life/gitea/liangfengning/git-test.git
 * [new tag]         v1.1 -> v1.1
```

使用 `git push origin --tags` 可以把所有标签都 push 到远程服务器。

```bash
$ git push origin --tags
Total 0 (delta 0), reused 0 (delta 0)
remote: .. Processing 2 references
remote: Processed 2 references in total
To https://dev.lifeni.life/gitea/liangfengning/git-test.git
 * [new tag]         v0.1.1 -> v0.1.1
 * [new tag]         v1.1.1 -> v1.1.1
```

`git tag -d` 和 `git push origin --delete` 可以分别删除本地和远程的 tag。

```bash
$ git tag -d v1.0
Deleted tag 'v1.0' (was bc88114)
```

```bash
$ git push origin --delete v0.1.1
Username for 'https://dev.lifeni.life': liangfengning
Password for 'https://liangfengning@dev.lifeni.life':
remote: . Processing 1 references
remote: Processed 1 references in total
To https://dev.lifeni.life/gitea/liangfengning/git-test.git
 - [deleted]         v0.1.1
```

### `git show`

Shows one or more objects (blobs, trees, tags and commits).

```bash
$ git show v1.0
commit bc8811421a40e134e8e01219decedadbdc6ca4e0 (tag: v1.0)
Merge: 4a0cec3 e1de0db
Author: liangfengning <liangfengning@foxmail.com>
Date:   Sat Mar 21 18:57:49 2020 +0800

    merge with no-ff

$ git show 354b9e0
commit 354b9e0c162c50cfbfc837f312c8cc75c7632fae (origin/master, master)
Merge: 380e12e fc5e06f
Author: liangfengning <liangfengning@foxmail.com>
Date:   Tue May 5 17:50:10 2020 +0800

    Merge branch 'test'
```

## Git 分支管理

推荐看官方文档的解释，因为有配图：[Git - 分支简介](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%AE%80%E4%BB%8B)。

### `git branch`

查看、创建分支。

```bash
$ git branch test
$ git branch dev
$ git log --oneline --decorate
d65b938 (HEAD -> master, origin/master, test, dev) msg
```

```bash
$ git branch
  dev
* master
  test
```

`git branch -d` 删除一个分支。

```bash
$ git branch -d temp
Deleted branch temp (was d65b938).
```

`git branch -v` 查看每个分支的最后一次提交。

```bash
$ git branch -v
  dev    9ea5bd7 merge test 1
  master 354b9e0 Merge branch 'test'
* test   fc5e06f fix conflicts
```

`git branch --merged` 和 `git branch --no-merged` 分别筛选已经合并和尚未合并到当前分支的分支。

```bash
$ git branch --merged
  dev
* test
$ git branch --no-merged
  master
```

没有合并的分支无法直接删除：

```bash
$ git branch -d master
error: The branch 'master' is not fully merged.
If you are sure you want to delete it, run 'git branch -D master'.
```

### `git checkout` `分支相关`

这里的 `git checkout` 用于切换到一个已存在的分支。可以用 `git switch` 替代。

```bash
$ git checkout dev
Switched to branch 'dev'
```

```bash
$ git switch master
Switched to branch 'master'
```

`git checkout -b` 可以创建一个分支并切换过去。

```bash
$ git checkout -b temp
Switched to a new branch 'temp'
```

### `git merge` `--no-ff`

合并分支。

```bash
$ git branch
  dev
* master
  test
$ git merge dev
Updating d65b938..9ea5bd7
Fast-forward
 1.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

如果遇到了冲突：

```bash
$ git merge dev
Auto-merging 1.txt
CONFLICT (content): Merge conflict in 1.txt
Automatic merge failed; fix conflicts and then commit the result.
```

合并后的 log 是这样的：

```bash
*   fc5e06f - (HEAD -> test) fix conflicts (2 minutes ago) <liangfengning>
|\
| * 9ea5bd7 - (dev) merge test 1 (7 minutes ago) <liangfengning>
* | 7756594 - merge test 2 (6 minutes ago) <liangfengning>
|/
```

fast-forward：当要进行合并的两个分支是直接后继的关系的时候，就会采用这个方式，只是移动指针。详情可以查看：[git merge --no-ff 是什么意思 - SegmentFault 思否](https://segmentfault.com/q/1010000002477106)。

### `git rebase`

变基。在合并两个分支的时候，可以采用变基，也就是把要并入的分支修改后放到当前分支的后面，而不是产生一个合并的 commit，最后产生的 log 图形是一条直线。详见：[Git - 变基](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA)，这里不再介绍。

写法和 `git merge` 类似：

```bash
$ git rebase master
```

## Git 远程仓库

### `git clone`

从远程项目克隆，支持 `https://` `http://` `git://` `ssh://` 等协议。

```bash
$ git clone https://github.com/user/example/git
$ git clone user@server:path/to/repo.git
```

### `git remote`

查看远程仓库服务器。

```bash
$ git remote
origin
$ git remote -v
origin  https://dev.lifeni.life/gitea/liangfengning/git-test.git (fetch)
origin  https://dev.lifeni.life/gitea/liangfengning/git-test.git (push)
```

`git remote add` 可以添加一个远程仓库。

```bash
$ git remote add fff https://github.com/liangfengning/git-test.git
$ git remote -v
fff     https://github.com/liangfengning/git-test.git (fetch)
fff     https://github.com/liangfengning/git-test.git (push)
origin  https://dev.lifeni.life/gitea/liangfengning/git-test.git (fetch)
origin  https://dev.lifeni.life/gitea/liangfengning/git-test.git (push)
```

`git remote show` 查看远程仓库的信息。

```bash
$ git remote show origin
* remote origin
  Fetch URL: https://dev.lifeni.life/gitea/liangfengning/git-test.git
  Push  URL: https://dev.lifeni.life/gitea/liangfengning/git-test.git
  HEAD branch: master
  Remote branch:
    master tracked
  Local ref configured for 'git push':
    master pushes to master (up to date)
```

`git remote rename` 和 `git remote remove` 可以重命名和移除一个远程仓库，重命名时所有的引用会自动改变。下面的例子把 `origin` 移除，并把另一个仓库重命名为 `origin`。

```bash
$ git remote remove origin
$ git remote rename fff origin
$ git remote -v
origin  https://github.com/liangfengning/git-test.gitt (fetch)
origin  https://github.com/liangfengning/git-test.git (push)
```

### `git fetch`

访问远程仓库并获取本地没有的数据。

`git fetch` 与 `git pull` 的区别是：前者只是拉取数据，不会合并（merge），而后者会自动执行合并。

### `git push`

推送某个分支到远程服务器。

```bash
$ git push origin master
Username for 'https://dev.lifeni.life': liangfengning
Password for 'https://liangfengning@dev.lifeni.life':
Enumerating objects: 19, done.
Counting objects: 100% (19/19), done.
Delta compression using up to 8 threads
Compressing objects: 100% (12/12), done.
Writing objects: 100% (17/17), 1.33 KiB | 227.00 KiB/s, done.
Total 17 (delta 6), reused 0 (delta 0)
remote: . Processing 1 references
remote: Processed 1 references in total
To https://dev.lifeni.life/gitea/liangfengning/git-test.git
   e2706a2..d65b938  master -> master
```

> 只有当你有所克隆服务器的写入权限，并且之前没有人推送过时，这条命令才能生效。 当你和其他人在同一时间克隆，他们先推送到上游然后你再推送到上游，你的推送就会毫无疑问地被拒绝。 你必须先抓取他们的工作并将其合并进你的工作后才能推送。
>
> 引用来源：[Git - 远程仓库的使用](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93%E7%9A%84%E4%BD%BF%E7%94%A8)。

## `.gitignore`

忽略文件，即不会跟踪文件。

> 文件 `.gitignore` 的格式规范如下：
>
> - 所有空行或者以 `#` 开头的行都会被 Git 忽略。
> - 可以使用标准的 glob 模式匹配，它会递归地应用在整个工作区中。
> - 匹配模式可以以（`/`）开头防止递归。
> - 匹配模式可以以（`/`）结尾指定目录。
> - 要忽略指定模式以外的文件或目录，可以在模式前加上叹号（`!`）取反。
>
> 所谓的 glob 模式是指 shell 所使用的简化了的正则表达式。 星号（`*`）匹配零个或多个任意字符；`[abc]` 匹配任何一个列在方括号中的字符 （这个例子要么匹配一个 a，要么匹配一个 b，要么匹配一个 c）； 问号（`?`）只匹配一个任意字符；如果在方括号中使用短划线分隔两个字符， 表示所有在这两个字符范围内的都可以匹配（比如 `[0-9]` 表示匹配所有 0 到 9 的数字）。 使用两个星号（`**`）表示匹配任意中间目录，比如 `a/**/z` 可以匹配 `a/z` 、 `a/b/z` 或 `a/b/c/z` 等。
>
> 引用来源：[Git - 记录每次更新到仓库](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E8%AE%B0%E5%BD%95%E6%AF%8F%E6%AC%A1%E6%9B%B4%E6%96%B0%E5%88%B0%E4%BB%93%E5%BA%93)。

Github 上有整理好的 `.gitignore` 文件：[github/gitignore: A collection of useful .gitignore templates](https://github.com/github/gitignore)。

## 常见的情况及解决方案

### 合并冲突

1. 两个分支修改同一个文件，在 merge 时发生冲突：

   ```bash
    # 修改文件
    $ git checkout dev
    $ vim 1.txt
    $ git add *
    $ git commit -m "merge test 1"
    $ git switch test
    $ vim 1.txt
    $ git add *
    $ git commit -m "merge test 2"
   ```

   ```bash
    $ git merge dev
    Auto-merging 1.txt
    CONFLICT (content): Merge conflict in 1.txt
    Automatic merge failed; fix conflicts and then commit the result.
   ```

2. 查看冲突情况：

   ```bash
    $ cat 1.txt
    <<<<<<< HEAD
    1236677
    555
    =======
    12345
    >>>>>>> dev
    ghfhfg
    jhg
   ```

3. 手动解决冲突并 add 和 commit：

   ```bash
    $ vim 1.txt
    $ git add *
    $ git status
    On branch test
    All conflicts fixed but you are still merging.
      (use "git commit" to conclude merge)

    Changes to be committed:
            modified:   1.txt

    $ git commit -m "fix conflicts"
   ```

4. 此时 test 分支上的冲突已经被我们手动解决，而 dev 分支上的文件没有改动。

## 搭建 Git 服务器

### 安装

这里选择用 Docker 和 Gitea 搭建 Git 服务器，文档：[Installation with Docker - Docs](https://docs.gitea.io/en-us/install-with-docker/)。

安装 Docker Compose 的方法见：[Install Docker Compose | Docker Documentation](https://docs.docker.com/compose/install/)。

使用的 `docker-compose.yml` 文件如下，将其放进 `/home`：

```yml
version: '2'

networks:
  gitea:
    external: false

services:
  server:
    image: gitea/gitea:latest
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - DB_TYPE=mysql
      - DB_HOST=db:3306
      - DB_NAME=gitea
      - DB_USER=gitea
      - DB_PASSWD=gitea
    restart: always
    networks:
      - gitea
    volumes:
      - ./gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - '10080:3000'
      - '10022:22'
    depends_on:
      - db

  db:
    image: mysql:5.7
    restart: always
    environment:
      - MYSQL_ROOT_PASSWORD=gitea
      - MYSQL_USER=gitea
      - MYSQL_PASSWORD=gitea
      - MYSQL_DATABASE=gitea
    networks:
      - gitea
    volumes:
      - ./mysql:/var/lib/mysql
```

在 `/home` 下输入以下命令安装：

```
docker-compose up -d
```

安装完成后，在客户端浏览器输入 `[ip]:10080` 进入管理页面，创建账号，按页面要求配置即可。

### 获取 SSH Key

在用户目录下的 `.ssh` 文件夹下执行命令 `ssh-keygen`，选项全部默认即可（三次回车）：

```bash
# Ubuntu 下：
$ cd /home/ubuntu/.ssh
$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/c/Users/xxx/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in id_rsa
Your public key has been saved in id_rsa.pub
...
```

```bash
# Windows 下建议用 WSL 或者 Git Bash：
$ cd /mnt/c/user/xxx/.ssh
$ ssh-keygen
...
```

之后把目录下的 `id_rsa.pub` 文件内容复制到 Gitea 设置页面的 SSH 页即可。

### 问题解决

1. **用 Nginx 把网站反代部署在二级目录，但除了首页均 404。**

   即，访问 `example.com/gitea`，Nginx 把请求转发到 `localhost:3000`。由于网页中使用绝对路径，如 `/img/logo.png`，实际请求时会指向 `example.com/img/logo.png` 而不是`example.com/gitea/img/logo.png`，因此产生 404 错误。

   **解决方法：**[使用：反向代理 - Docs](https://docs.gitea.io/zh-cn/reverse-proxies/#%E4%BD%BF%E7%94%A8-nginx-%E4%BD%9C%E4%B8%BA%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86%E6%9C%8D%E5%8A%A1%E5%B9%B6%E5%B0%86-gitea-%E8%B7%AF%E7%94%B1%E8%87%B3%E4%B8%80%E4%B8%AA%E5%AD%90%E8%B7%AF%E5%BE%84) 中的第二条。

   Nginx 配置好转发后，在 Gitea 的配置文件 `/home/gitea/gitea/conf/app.ini` 里修改：

   ```ini
    [server]
    ...
    ROOT_URL = http://localhost:3000/gitea/
    ...
   ```

   之后重启 Nginx 和 Gitea。

2. **配置好 SSH Key 之后，仍然需要输入密码，而且不知道密码是什么。**

   **解决方法：**在 `git@[ip]` 之前加上 `ssh://`：

   ```bash
    # Error
    $ git clone git@[ip]:username/example.git
    Cloning into 'git-test'...
    git@[ip]'s password:

    # Success
    $ git clone ssh://git@[ip]:username/example.git
   ```

   或者参考 [Cloning via ssh asks for password · Issue #9267 · go-gitea/gitea](https://github.com/go-gitea/gitea/issues/9267) 里的第二种方法。

## 参考资料

1. [Git - Book](https://git-scm.com/book/zh/v2)
2. [github - git init 和 git init --bare 的区别？ - SegmentFault 思否](https://segmentfault.com/q/1010000004683286)
3. [Cloning via ssh asks for password · Issue #9267 · go-gitea/gitea](https://github.com/go-gitea/gitea/issues/9267)
