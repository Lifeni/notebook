---
name: windows-config
title: Windows 的习惯配置
create-date: 2020-08-07
date: 2021-02-26
descriptions:
    - 记录自己配置和完善 Windows 10 的方法和问题
    - 配置方法均来自网络，可能会随系统更新而失效
tags:
    - Windows
    - WSL
license: CC-BY-SA-4.0
---

# Windows 的习惯配置

📌 记录自己配置和完善 Windows 10 的方法和问题

🌐 配置方法均来自网络，可能会随系统更新而失效

&nbsp;

> **前排建议：**
>
> - 在下载 WSL 的时候，最好按照版本下载，比如下载 Ubuntu-18.04 而不是 Ubuntu
>
> - WSL1 与 Ubuntu 20.04 之间的兼容性存在问题，用 WSL1 最好使用 Ubuntu-18.04

## 配置

### 右下角时间显示秒数

> 在 Windows 10 2004 测试通过。
>
> 教程参考自：[怎么样让 Windows10 右下角的时间显示秒钟-百度经验](https://jingyan.baidu.com/article/4ae03de3e3c3d03eff9e6be7.html) 。

1. 按 `win` 键 + `Q` 呼出搜索窗口，然后输入 `reg`，打开第一项：注册表编辑器

2. 在地址栏粘贴下面的文本，然后回车：

    ```
     HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced
    ```

3. 在窗口的右侧右键，新建，DWORD（32 位）值，命名为 `ShowSecondsInSystemClock`

4. 双击建好的列表项，将值改为 1

5. 在任务管理器里重启“Windows 资源管理器”，或者直接重启电脑就可以了

### 右键菜单添加 Windows Terminal

> **Windows Terminal 已经自带这个功能了。**

<details>
 <summary>点击查看之前的解决方案</summary>

> 在 Windows 10 2004 测试通过。
>
> 教程参考自：[将 Windows Terminal 添加到右键菜单 · GitHub](https://gist.github.com/Garwih/b4ec0d853e0f3093874e919ace7fce2f) 。

1. 新建 `.reg` 文件，内容如下（**注意需要替换自己的用户名**）：

    ```
      Windows Registry Editor Version 5.00

      [HKEY_CLASSES_ROOT\Directory\Background\shell\wt]
      @="Windows Terminal Here"

      [HKEY_CLASSES_ROOT\Directory\Background\shell\wt\command]
      @="C:\\Users\\你的用户名\\AppData\\Local\\Microsoft\\WindowsApps\\wt.exe"
    ```

2. 双击运行，即可添加到右键菜单

3. 还需要修改 Terminal 的路径为当前路径。打开 Windows Terminal 的设置，添加下面这一行：

    ```json
     "startingDirectory": null
    ```

     添加完成后是这个样子的：

    ```json
     {
         "profiles": {
             "defaults": {},
             "list": [
                 {
                     // Make changes here to the powershell.exe profile.
                     "guid": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
                     "name": "Windows PowerShell",
                     "commandline": "powershell.exe",
                     "hidden": false,
                     "startingDirectory": null
                 }
             ]
         }
     }
    ```

</details>

### WSL2 中代理的设置

> 在 Windows 10 2004 & WSL Ubuntu 20.04 测试通过。
>
> 教程参考自：[WSL2 网络代理配置（apt 与 git) - 知乎](https://zhuanlan.zhihu.com/p/108927713) 。

#### bash 代理

1. 在设置中查看本机的局域网 IP 地址：`设置` > `网络和 Internet` > `状态` > 中间 `属性` 按钮 > 最下面的 `IPv4 地址`

2. 在 WSL 中输入下面命令，打开 Bash 的设置：

    ```bash
     $ sudo vim ~/.bashrc
    ```

3. 文件最后添加：

    ```bashrc
     export http_proxy="http://192.168.1.77:10809"
     export https_proxy="http://192.168.1.77:10809"
    ```

     IP 地址填上面查询的（我这里是 192.168.1.77）代理的 HTTP 端口号是 10808，代理需要开启“允许来自局域网的访问”

4. 重启 Terminal 进入 WSL 即可，可以输入 `curl www.google.com` 测试是否成功连接网络

#### npm 代理

输入下面两条命令，IP 地址和上面的一样（我这里是 192.168.1.77），端口用的是代理软件的 HTTP 端口：

```bash
$ npm config set proxy http://192.168.1.77:10809
$ npm config set https-proxy http://192.168.1.77:10809
```

### 让 WSL 中的 bash 自动补全忽略大小写

> 参考自：[bash - "set completion-ignore-case on " ignored in ~/.inputrc - Stack Overflow](https://stackoverflow.com/questions/43102223/set-completion-ignore-case-on-ignored-in-inputrc) 。

在 `~/.inputrc` 文件中添加：

```
set completion-ignore-case on
```

然后重新打开 bash 即可。

## 问题

### 安装 cnpm 后，命令行运行报错

**错误提示：** cnpm : 无法加载文件 C:\Users\XXX\AppData\Roaming\npm\cnpm.ps1，因为在此系统上禁止运行脚本。

> 教程参考自：[cnpm - 解决 " cnpm : 无法加载文件 C:\Users\93457\AppData\Roaming\npm\cnpm.ps1，因为在此系统上禁止运行脚本。有关详细信息 。。。 " - 武卡卡 - 博客园](https://www.cnblogs.com/500m/p/11634969.html) 。

1. 按 `win` 键 + `x`，打开 `Windows Powershell（管理员）`

2. 输入命令：

   ```powershell
     set-ExecutionPolicy RemoteSigned
   ```

3. 输入 `A`，选择“全是”，就可以了

### 使用 WSL2 时，Webpack 无法 Hot Reloading

> 这个是 WSL2 的缺陷。
>
> 参考：[[WSL2] File changes made by Windows apps on Windows filesystem don't trigger notifications for Linux apps · Issue #4739 · microsoft/WSL](https://github.com/microsoft/WSL/issues/4739) 与 [Comparing WSL 2 and WSL 1 | Microsoft Docs](https://docs.microsoft.com/en-us/windows/wsl/compare-versions#exceptions-for-using-wsl-1-rather-than-wsl-2) 。
>

WSL2 读写 Windows 文件系统中的文件时，性能不行，也不支持热重载的特性，因此最好把 WSL2 降级成 WSL1：

```powershell
$ wsl --set-version ubuntu 1
正在进行转换，这可能需要几分钟时间...
转换完成。
```

这个要在 PowerShell 中执行。

### 在 WSL1 和 Ubuntu 20.04 中使用 Node 时 CPU 占用高问题

> 这是一个 Bug，据说在下一个 WSL 版本中会修复。
>
> 参考：[High cpu usage of node process in Remote-WSL extension · Issue #2921 · microsoft/vscode-remote-release · GitHub](https://github.com/microsoft/vscode-remote-release/issues/2921) 与 [[WSL1] [glibc] sleep: cannot read realtime clock: Invalid argument · Issue #4898 · microsoft/WSL · GitHub](https://github.com/microsoft/WSL/issues/4898) 以及 [Ubuntu 20.04 and WSL 1 - WSL2 - Ubuntu Community Hub](https://discourse.ubuntu.com/t/ubuntu-20-04-and-wsl-1/15291/4) 。
>

1. WSL1 中依次执行：

   ```bash
     $ cd ~
     $ wget "https://launchpadlibrarian.net/474302949/libc6_2.31-0ubuntu8+lp1871129~1_amd64.deb"
     $ sudo dpkg -i libc6_2.31-0ubuntu8+lp1871129~1_amd64.deb
   ```

2. 管理员模式的 PowerShell 中执行：

   ```powershell
     > net stop LxssManager
     LxssManager 服务正在停止.
     LxssManager 服务已成功停止。

     > net start LxssManager
     LxssManager 服务正在启动 .
     LxssManager 服务已经启动成功。
   ```

    以重启 WSL。
