---
name: cmd-scp
title: Linux 中的 SCP 命令与文件传输
create-date: 2020-10-19
date: 2020-10-28
description: 简单了解 Linux 中 SCP 命令的基本用法，并使用 SCP 命令编写一些命令行语句，实现项目文件自动上传到远程服务器的过程。
license: CC-BY-SA-4.0
---

# Linux 中的 SCP 命令与文件传输

## 基本用法

SCP 的全称是 Secure Copy，通过 SSH 进行文件的复制。Linux 中使用 `man scp` 命令可以查看 SCP 命令的帮助信息，我把重点翻译如下（文章最后附有英文原文）。

### 概要

```
scp [-346BCpqrTv] [-c cipher] [-F ssh_config] [-i identity_file] [-l limit] [-o ssh_option] [-P port] [-S program] [[user@]host1:]file1 ...
         [[user@]host2:]file2
```

### 详细描述

scp 在网络上的主机之间复制文件。 它使用 ssh(1) 进行数据传输，使用与 ssh(1) 相同的身份验证,并提供相同的安全性。如果身份验证需要密码，则 scp 将询问密码或者密码短语。

文件名可能包含用户和主机格式，用来指示要将文件复制到该主机，或从该主机复制文件。用绝对或相对路径名来明确显示本地文件名，以避免 scp 将包含 ":" 的文件名当做主机格式的一部分。scp 命令也允许在两个远程主机之间复制。

命令的选项如下：

- `-3` 两个远程主机之间的复制是通过本地主机传输的。 如果没有这个选项，数据会直接在两个远程主机之间复制。 请注意，此选项将禁用进度条。

- `-4` 强制 scp 只使用 IPv4 地址。

- `-6` 强制 scp 只使用 IPv6 地址。

- `-B` 使用批处理模式（防止询问密码或口令）。_其实这里的「批处理模式（batch mode）」就是后台运行模式，不使用交互界面。_

- `-C` 启用压缩。

- `-c <cipher>` 选择用于加密数据传输的密码。

- `-F [ssh_config]` 为 ssh 指定一个可供选择的每个用户配置文件。

- `-i <identity_file>` 选择从文件中读取用于公钥认证的身份（私钥）。

- `-l <limit>` 限制使用的带宽，以 Kbit/s 为单位。

- `-P port` 指定远程主机上要连接的端口。 注意，这个选项用大写的 'P' 来写，因为 `-p` 已经为保存文件的时间和模式保留了。

- `-p` 保留原始文件的修改时间、访问时间和模式。

- `-q` 静音模式：禁用进度表以及来自 ssh(1) 的警告和诊断信息。

- `-r` 递归地复制整个目录。 请注意，scp 遵循树形遍历中遇到的符号链接。

- `-S <program>` 用于加密连接的程序名称。 该程序必须了解 ssh(1) 选项。

- `-T` 禁用严格的文件名检查。默认情况下，当从远程主机复制文件到本地目录时，scp 会检查接收到的文件名是否与命令行中请求的文件名一致，以防止远程端发送意外的或不需要的文件 由于不同的操作系统和 shell 解释文件名通配符的方式不同，这些检查可能会导致想要的文件被拒绝。这个选项可以禁用这些检查，但代价是完全相信服务器不会发送意外的文件名。

- `-v` Verbose 模式。使 scp 和 ssh(1) 打印关于其进度的调试信息。 这对调试连接、认证和配置问题很有帮助。

### 退出状态

scp 实用程序在成功时退出 0，如果发生错误则退出 > 0 。

## 使用场景

### 复制文件夹内容到服务器

需求：需要复制当前目录下的 `public` 文件夹中所有文件到服务器 `/home/website` 文件夹中。

这里使用秘钥文件的方式连接 SSH，而且已经设置好 `~/.ssh/config` 文件，之后在终端中输入下面的命令，其中要指定 SSH Config 的位置，AliYun 是 Config 中的 Host。

```powershell
> scp -r -C -F C:\Users\Liang\.ssh\config ./public/* root@AliYun:/home/test

...

> debug1: client_input_channel_req: channel 0 rtype exit-status reply 0
debug1: channel 0: free: client-session, nchannels 1
Transferred: sent 8236632, received 29444 bytes, in 30.4 seconds
Bytes per second: sent 270785.1, received 968.0
debug1: Exit status 0
```

注意本地路径 `./public/*` 最后的 `*`，这样会把 public 文件夹中所有文件放在 test 文件夹中，而不是把 public 文件夹放在 test 里/

如果没有配置 SSH Config，则可以使用普通的方式上传，不过需要输入密码。

```powershell
> scp -r -C ./public/* root@123.123.123.123:/home/test
```

### 从服务器下载文件

下载和上传的区别就是把路径的前后位置换过来了，这里不再详细说，举个例子：

```powershell
> scp -r -C -F C:\Users\Liang\.ssh\config root@AliYun:/home/test C:\Users\Liang\Desktop\Temp\
```

## 问题解决

### SCP 和 SFTP 这两个命令有什么区别？

前面说过，SCP 的全称是 Secure Copy，而 SFTP 的全称是 SSH File Transfer Protocol，可见，两者可以实现的功能是大致相同的，SCP 的功能更简单一些，而且不支持断点续传（未确认）。

## 参考文章

1. [Linux 小知识翻译 - 「SCP 和 SFTP」 - wang_yb - 博客园](https://www.cnblogs.com/wang_yb/p/3819441.html)

## 附录：`man scp`

<details>
<summary>点击展开附录</summary>

```
NAME
     scp — secure copy (remote file copy program)

SYNOPSIS
     scp [-346BCpqrTv] [-c cipher] [-F ssh_config] [-i identity_file] [-l limit] [-o ssh_option] [-P port]
         [-S program] [[user@]host1:]file1 ... [[user@]host2:]file2

DESCRIPTION
     scp copies files between hosts on a network.  It uses ssh(1) for data transfer, and uses the same authentication
     and provides the same security as ssh(1).  scp will ask for passwords or passphrases if they are needed for
     authentication.

     File names may contain a user and host specification to indicate that the file is to be copied to/from that
     host.  Local file names can be made explicit using absolute or relative pathnames to avoid scp treating file
     names containing ‘:’ as host specifiers.  Copies between two remote hosts are also permitted.

     The options are as follows:

     -3      Copies between two remote hosts are transferred through the local host.  Without this option the data is
             copied directly between the two remote hosts.  Note that this option disables the progress meter.

     -4      Forces scp to use IPv4 addresses only.

     -6      Forces scp to use IPv6 addresses only.

     -B      Selects batch mode (prevents asking for passwords or passphrases).

     -C      Compression enable.  Passes the -C flag to ssh(1) to enable compression.

     -c cipher
             Selects the cipher to use for encrypting the data transfer.  This option is directly passed to ssh(1).

     -F ssh_config
             Specifies an alternative per-user configuration file for ssh.  This option is directly passed to ssh(1).

     -i identity_file
             Selects the file from which the identity (private key) for public key authentication is read.  This
             option is directly passed to ssh(1).

     -l limit
             Limits the used bandwidth, specified in Kbit/s.

     -o ssh_option
             Can be used to pass options to ssh in the format used in ssh_config(5).  This is useful for specifying
             options for which there is no separate scp command-line flag.  For full details of the options listed
             below, and their possible values, see ssh_config(5).

                   AddressFamily
                   BatchMode
                   BindAddress
                   CanonicalDomains
                   CanonicalizeFallbackLocal
                   CanonicalizeHostname
                   CanonicalizeMaxDots
                   CanonicalizePermittedCNAMEs
                   CertificateFile
                   ChallengeResponseAuthentication
                   CheckHostIP
                   Ciphers
                   Compression
                   ConnectionAttempts
                   ConnectTimeout
                   ControlMaster
                   ControlPath
                   ControlPersist
                   GlobalKnownHostsFile
                   GSSAPIAuthentication
                   GSSAPIDelegateCredentials
                   HashKnownHosts
                   Host
                   HostbasedAuthentication
                   HostbasedKeyTypes
                   HostKeyAlgorithms
                   HostKeyAlias
                   HostName
                   IdentitiesOnly
                   IdentityAgent
                   IdentityFile
                   IPQoS
                   KbdInteractiveAuthentication
                   KbdInteractiveDevices
                   KexAlgorithms
                   LogLevel
                   MACs
                   NoHostAuthenticationForLocalhost
                   NumberOfPasswordPrompts
                   PasswordAuthentication
                   PKCS11Provider
                   Port
                   PreferredAuthentications
                   ProxyCommand
                   ProxyJump
                   PubkeyAcceptedKeyTypes
                   PubkeyAuthentication
                   RekeyLimit
                   SendEnv
                   ServerAliveInterval
                   ServerAliveCountMax
                   StrictHostKeyChecking
                   TCPKeepAlive
                   UpdateHostKeys
                   UsePrivilegedPort
                   User
                   UserKnownHostsFile
                   VerifyHostKeyDNS


     -P port
             Specifies the port to connect to on the remote host.  Note that this option is written with a capital
             ‘P’, because -p is already reserved for preserving the times and modes of the file.

     -p      Preserves modification times, access times, and modes from the original file.

     -q      Quiet mode: disables the progress meter as well as warning and diagnostic messages from ssh(1).

     -r      Recursively copy entire directories.  Note that scp follows symbolic links encountered in the tree tra‐
             versal.

     -S program
             Name of program to use for the encrypted connection.  The program must understand ssh(1) options.

     -T      Disable strict filename checking.  By default when copying files from a remote host to a local directory
             scp checks that the received filenames match those requested on the command-line to prevent the remote
             end from sending unexpected or unwanted files.  Because of differences in how various operating systems
             and shells interpret filename wildcards, these checks may cause wanted files to be rejected.  This
             option disables these checks at the expense of fully trusting that the server will not send unexpected
             filenames.

     -v      Verbose mode.  Causes scp and ssh(1) to print debugging messages about their progress.  This is helpful
             in debugging connection, authentication, and configuration problems.

EXIT STATUS
     The scp utility exits 0 on success, and >0 if an error occurs.

SEE ALSO
     sftp(1), ssh(1), ssh-add(1), ssh-agent(1), ssh-keygen(1), ssh_config(5), sshd(8)

HISTORY
     scp is based on the rcp program in BSD source code from the Regents of the University of California.

AUTHORS
     Timo Rinne <tri@iki.fi>
     Tatu Ylonen <ylo@cs.hut.fi>

```

</details>
