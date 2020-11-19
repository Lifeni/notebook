---
name: install-rime
title: 安装 RIME 输入法
create-date: 2019-12-24
date: 2020-02-05
descriptions:
    - 记录 Windows 10 下 RIME 输入法自然码的安装
    - 本文并没有完成详细配置，所以具体操作方法请看官方文档
tags:
    - Windows
license: CC-BY-SA-4.0
---

# 安装 RIME 输入法

📌 记录 Windows 10 下 RIME 输入法自然码的安装

💻 本文并没有完成详细配置，所以具体操作方法请看官方文档

## 开始之前

折腾这个输入法的原因是微软拼音不好用，还有 BUG，比如某些情况下突然不能输入中文标点。

RIME 输入法主页：[RIME | 中州韻輸入法引擎](https://rime.im/)

其实这个 RIME 是一个开源的输入法引擎，在 Windows 平台下的实现为“小狼毫 / Weasel”。

## 下载安装

首先下载主安装程序：[下載及安裝 | RIME | 中州韻輸入法引擎](https://rime.im/download/)，我这里是 `weasel-0.14.3.0-installer.exe`，安装。

## 基础配置

1. 下载双拼-自然码的输入方案：

    我这里直接给出自然码的链接：[rime/rime-double-pinyin: 雙拼輸入方案](https://github.com/rime/rime-double-pinyin)，如果需要其他输入方案，可以参考：[rime/plum: 東風破 /plum/: Rime configuration manager and input schema repository](https://github.com/rime/plum)。

    再点右侧 `Clone or download`，选择 `Download ZIP`，保存到任意位置。

2. 切换到小狼毫，右键托盘“中”的图标，选择“输入法设定”，左下角“获取更多输入方案”，在弹出窗口中输入刚才下载的文件的路径，即可安装。之后回到“输入法设定”，勾上“自然码”。

3. 切换到小狼毫，按 `f4`，选择“自然码”，然后选择“中/半/汉”，选择第四项，改成简体中文。

4. 可以使用了。

## 文件分布

**共享资料夹**：`安装目录\data`，例如：`C:\Program Files (x86)\Rime\weasel-0.14.3\data`。

> 共享資料夾包含預設輸入方案的源文件。 這些文件屬於 Rime 所發行軟件的一部份，在訪問權限控制較嚴格的系統上對用戶是只讀的，因此謝絕軟件版本更新以外的任何修改—— 一旦用戶修改這裏的文件，很可能影響後續的軟件升級或在升級時丟失數據。

**用户资料夹**：`%APPDATA%\Rime`，例如：`C:\Users\XXX\AppData\Roaming\Rime`。

> 用戶資料夾則包含爲用戶準備的內容，如：
>
> -   〔全局設定〕 `default.yaml`
> -   〔發行版設定〕 `weasel.yaml`
> -   〔預設輸入方案副本〕 `<方案標識>.schema.yaml`
> -   ※〔安裝信息〕 `installation.yaml`
> -   ※〔用戶狀態信息〕 `user.yaml`
>
> 以及用戶自己設定的：
>
> -   ※〔用戶對全局設定的定製信息〕 `default.custom.yaml`
> -   ※〔用戶對預設輸入方案的定製信息〕 `<方案標識>.custom.yaml`
> -   ※〔用戶自製輸入方案〕及配套的詞典源文件
>
> 註：以上標有 ※ 號的文件，包含用戶資料，您在清理文件時要注意備份！
>
> 引用来源：[RimeWithSchemata · rime/home Wiki](https://github.com/rime/home/wiki/RimeWithSchemata)

## 使用技巧

### 删除输错的记忆

词组打错了之后可能会被固定在首位，要删除这种记忆，可以再打出这个词时， 按 `shift` + `delete` 或 `ctrl` + `delete`。这个方法只能删除自己打的词组，如果你发现一个词删不掉，可能是输入法自己联想的词。

## 个性化

定制方法如下，也可以看下面的链接。

1. 右键小狼毫托盘图标，打开用户文件夹，再打开 `default.custom.yaml` 文件，没有就新建一个。（这个文件存放的是默认配置，若要更改单个主题的配置，可以更改相应的文件。）
2. 在 `patch` 字段中添加配置，如果原来有配置，需要用相同的缩进添加。
3. 右键小狼毫托盘图标，重新部署。

具体的个性化需求可以看这个文档：[CustomizationGuide · rime/home Wiki](https://github.com/rime/home/wiki/CustomizationGuide)，这里不再复制了。
