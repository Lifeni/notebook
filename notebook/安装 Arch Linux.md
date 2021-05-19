---
name: install-arch-linux
title: 安装 Arch Linux
create-date: 2020-02-03
date: 2020-02-03
description: |
  记录在旧的笔记本（联想 G460）上安装和简单配置 Arch Linux 的过程，需要注意的是，本文只给出了一种解决方案，也可以结合其他资料，根据自己的需求进行安装与配置。
tags:
  - Linux
license: CC-BY-SA-4.0
---

# 安装 Arch Linux

## 准备工作

### 下载镜像

最新版本： 2020.02.01，官方的下载地址：[Arch Linux - Downloads](https://www.archlinux.org/download/)，里面有种子、磁力和 HTTP 下载。

这里用清华大学的下载源：[Index of /archlinux/iso/2020.02.01/ | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/archlinux/iso/2020.02.01/)，选择 `archlinux-2020.02.01-x86_64.iso` 下载。

### 制作安装介质

这里在 Windows 下使用 USBWriter 制作启动 U 盘，下载链接：[USBWriter download | SourceForge.net](https://sourceforge.net/projects/usbwriter/)。

## 安装

我要安装的电脑是联想 G460，开机长按 F2 可以进入 BIOS，电脑的启动方式是 BIOS(Legacy) + MBR。

### BIOS 修改 U 盘启动

插入 U 盘，进入 BIOS，在 Boot 里把 U 盘的启动顺序调至第一位，保存并重启电脑。

### 启动 Live 系统

1. 启动后，会进入一个带有 Arch Linux 的安装界面，选择第一项 `Boot Arch Linux (x86_64)`，进入 Live 系统。
2. 等一会后出现 `root@archiso ~ #` 表示启动成功。

### 验证启动模式

虽然已经知道了，但还是要验证一下（听官方文档的），输入以下命令：

```bash
$ ls /sys/firmware/efi/efivars
```

我这里提示目录不存在，也就是下面的代码：

```bash
$ ls: cannot access '/sys/firmware/efi/efivars': No such file or directory
```

说明系统以 BIOS 模式启动，而不是 UEFI 模式。

### 联网

我这里选择 WiFi 联网，使用有线的可以参考最后“参考文章”里的链接。

输入下面命令连接无线网：

```bash
$ wifi-menu
```

之后进行 ping 测试（按 Ctrl + C 停止）：

```bash
$ ping archlinux.org
```

### 更新系统时间

使用下面命令同步系统时间：

```bash
$ timedatectl set-ntp true
```

成功后应该没有提示，可以用下面命令检查状态：

```bash
$ timedatectl status
```

### 硬盘分区

**数据无价，操作前请做好备份。**

1. 使用下面的命令查看硬盘设备：

   ```bash
   $ fdisk -l
   ```

   白色字体以 `Disk` 开头的设备中，路径以 `loop` 结尾的不用管，我这里还剩两个。第一个 `/dev/sda` 是 U 盘，第二个 `/dev/sdb` 是硬盘。

   当然也可以用 `lsblk` 命令查看。

2. 使用 cfdisk 工具进行操作，UEFI 引导的可以用 cgdisk 工具。

   ```bash
   $ cfdisk /dev/sdb
   ```

3. 因为我要格盘重装，所以先选中每一项然后 `Delete`，最后剩下 `free space`。

4. 选中 `New`，会让输入大小和选择主分区还是拓展分区，这里直接默认就好。

5. 创建好后，选择 `Write`，输入 `yes` 保存改动。

6. 最后选择 `Quit` 退出。

7. 输入 `lsblk` 查看分区是否分好。

### 格式化分区

输入下面命令将刚分好的区以 `ext4` 文件系统进行格式化：

```bash
$ mkfs.ext4 /dev/sdb1
```

### 挂载分区

将根分区挂载到 `/mnt`：

```bash
$ mount /dev/sdb1 /mnt
```

### 选择镜像源

1. 使用 `vim` 打开文件：

   ```bash
   $ vim /etc/pacman.d/mirrorlist
   ```

2. 按 `i` 进行编辑，在文件开头输入：

   ```
   ## 清华大学
   Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
   ## 网易
   Server = https://mirrors.163.com/archlinux/$repo/os/$arch
   ```

   `##` 开头的注释可以不输。

3. 按 `esc`，再输入 `:wq` 保存并退出。

### 安装软件包

把基本的系统和软件使用 `pacstrap` 命令安装：

```bash
$ pacstrap /mnt base base-devel linux linux-firmware dhcpcd
```

这里可以根据自己的需求定制。

### 配置 Fstab

貌似是生成挂载信息的东西。

> 默认情况下，只要电脑重启后，并不会自动挂在磁盘分区，会造成系统无法正常使用。因此，通过配置`/etc/fstab`文件，系统开机会读取这个文件里面的挂在信息，然后挂在相应的磁盘分区。
>
> 引用来源：[Arch Linux 安装指南 - 简书](https://www.jianshu.com/p/7c78dc4c53e5)

```bash
$ genfstab -U /mnt >> /mnt/etc/fstab
```

之后需要验证命令是否执行正确，输入以下命令：

```bash
$ cat /mnt/etc/fstab
```

如果 `<dir>` 对应的是 `/`，证明没问题。

### 执行 Chroot

目的是把操作由 Live 系统转移到已安装系统。

```bash
$ arch-chroot /mnt
```

可以看到终端里已经变成了 `[root@archiso /]#`。

## 配置

下面进行系统内的配置。

### 时区

依次执行下面两条命令：

```bash
$ ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

```bash
$ hwclock --systohc
```

### 本地化

1. 由于没装 Vim，所以先装 Vim：

   ```bash
   $ pacman -S vim
   ```

2. 编辑 `/etc/locale.gen` 文件：

   ```bash
   $ vim /etc/locale.gen
   ```

3. 找到下面的字段，并把前面的 `#` 去掉，然后保存并退出：

   ```
   #en_US.UTF-8 UTF-8
   ……
   #zh_CN.UTF-8 UTF-8
   #zh_HK.UTF-8 UTF-8
   #zh_TW.UTF-8 UTF-8
   ```

4. 之后执行下面命令：

   ```bash
   $ locale-gen
   ```

5. 打开 `/etc/locale.conf` 文件：

   ```bash
   $ vim /etc/locale.conf
   ```

6. 加入以下内容，保存并退出：

   ```bash
   $ LANG=en_US.UTF-8
   ```

### 主机名和 hosts 文件

1. 打开 `/etc/hostname`，输入自定义的主机名：

   ```bash
   $ vim /etc/hostname
   ```

2. 打开 `/etc/hosts`，并添加下面的信息：

   ```bash
   $ vim /etc/hosts
   ```

   ```
   127.0.0.1	localhost
   ::1		localhost
   127.0.1.1	myhostname.localdomain	myhostname
   ```

   `myhostname` 换成刚才的主机名。

### 设置 root 密码

输入下面命令输入密码，密码在输入的时候不会显示：

```bash
$ passwd
```

### 设置引导

1. 电脑是 Intel 的 CPU，需要安装 `intel-ucode`：

   ```bash
   $ pacman -S intel-ucode
   ```

2. 安装 `grub`：

   ```bash
   $ pacman -S grub
   ```

3. 部署 `grub`：

   ```bash
   $ grub-install --target=i386-pc /dev/sdb
   ```

4. 生成配置文件：

   ```bash
   $ grub-mkconfig -o /boot/grub/grub.cfg
   ```

5. 提示 `done` 则已完成。

### 重启系统

1. 退回启动盘：

   ```bash
   $ exit
   ```

2. 重启：

   ```bash
   $ reboot
   ```

## 常用操作

进入 Arch Linux 后登录 root 帐号。

### 连接网络

WiFi 没有搞明白怎么连。。`wifi-menu` 装不上。

有线的话，如果之前安装过 `dhcpcd` 这个包，那么直接输入下面命令即可：

```bash
$ dhcpcd
```

如果没安装，参考后面的“错误处理”部分。

### 安装社区仓库

> Add repo:
>
> ```bash
> [archlinuxcn]
> Server = https://repo.archlinuxcn.org/$arch
> ```
>
> to your /etc/pacman.conf .
>
> For mirrors (mainly in China), see https://github.com/archlinuxcn/mirrorlist-repo.
>
> Import PGP Keys:
>
> ```bash
> sudo pacman -Syy && sudo pacman -S archlinuxcn-keyring
> ```
>
> 引用来源：[GitHub - archlinuxcn/repo: Arch Linux CN Repository](https://github.com/archlinuxcn/repo)

### 图形界面

选择 xfce 作为桌面环境。

```bash
$ pacman -S xfce
```

我这里的选择全部默认。

输入下面命令启动：

```bash
$ startxfce4
```

不过重启还是会回到终端，想开机启动可以参考：[ArchLinux 安装后的必须配置与图形界面安装教程 | viseator's blog](https://www.viseator.com/2017/05/19/arch_setup/)

### 其他

可以参考：[ArchLinux 你可能需要知道的操作与软件包推荐「持续更新」 | viseator's blog](https://www.viseator.com/2017/07/02/arch_more/)

## 错误处理

### 没装必要的包导致无法联网

1. 插上启动盘，进入 Live 系统并联网。

2. 输入命令：

   ```bash
   $ mount /dev/sda1 /mnt  # sda 为主硬盘
   ```

   ```bash
   $ arch-chroot /mnt
   ```

3. 之后输入 pacman 命令即可。

## 参考文章

1. [Installation guide (简体中文) - ArchWiki](<https://wiki.archlinux.org/index.php/Installation_guide_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)>)

2. [以官方 Wiki 的方式安装 ArchLinux | viseator's blog](https://www.viseator.com/2017/05/17/arch_install/)

3. [给 GNU/Linux 萌新的 Arch Linux 安装指南 rev.B - 约伊兹的萌狼乡手札](https://blog.yoitsu.moe/arch-linux/installing_arch_linux_for_complete_newbies.html)

4. [Arch Linux 安装指南 - 简书](https://www.jianshu.com/p/7c78dc4c53e5)

以及文中的其他链接。
