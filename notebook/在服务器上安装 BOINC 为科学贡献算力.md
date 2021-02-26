---
name: hello-boinc
title: 在服务器上安装 BOINC 为科学贡献算力
create-date: 2021-02-23
date: 2021-02-23
descriptions:
    - 利用 BOINC 这个平台，把闲置服务器的资源用于科学计算
    - 使用 Docker Compose 安装，自带 Web 图形界面
tags:
    - BOINC
    - Docker
license: CC-BY-SA-4.0
---

# 在服务器上安装 BOINC 为科学贡献算力

📌 利用 BOINC 这个平台，把闲置服务器的资源用于科学计算

📦 使用 Docker Compose 安装，自带 Web 图形界面

## 关于 BOINC

> **伯克利开放式网络计算平台**（英语：**Berkeley Open Infrastructure for Network Computing**，简称**BOINC**）是目前主流的[分布式计算平台](https://zh.wikipedia.org/wiki/分布式计算平台)之一，由[加州大学伯克利分校](https://zh.wikipedia.org/wiki/加州大學柏克萊分校)电脑学系发展出的[分布式计算](https://zh.wikipedia.org/wiki/分散式計算)系统。原本专为[SETI@home](https://zh.wikipedia.org/wiki/SETI@home)项目而设计，目前纳入的领域包括[数学](https://zh.wikipedia.org/wiki/數學)、[医学](https://zh.wikipedia.org/wiki/醫學)、[天文学](https://zh.wikipedia.org/wiki/天文學)和[气象学](https://zh.wikipedia.org/wiki/氣象學)等。BOINC汇集全球各地志愿者的电脑或移动设备，提供运算能力给研究者。截至2017年3月，BOINC在全世界有约815,912台活跃的主机，提供约18.971[PetaFLOPS](https://zh.wikipedia.org/wiki/FLOPS)的运算能力。

> 引用来源：[BOINC - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/BOINC)

## 安装 BOINC 客户端

### 用 Docker Compose 安装

这里我用 Docker Compose 安装 BOINC，下面是 docker-compose.yml，把文件复制到服务器上，确保没有端口和文件冲突之后执行 `docker-compose up -d` 就可以启动容器了：

```yml
version: "2.1"
services:
  boinc:
    image: ghcr.io/linuxserver/boinc
    container_name: boinc
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
      - GUAC_USER=boinc	# 登录管理页面的用户名
      - GUAC_PASS=63bb1d581528b32bbf566c9628add02a	# 登录管理页面的密码
    volumes:
      - /home/boinc/data:/config	# 存放配置文件的位置
    ports:
      - 8080:8080
    restart: unless-stopped
```

需要注意的是，`GUAC_PASS` 是登录密码的 32 位 md5 值，这个随便上网上找个 md5 加密的网站就能生成，其他的配置项及含义可以查看 [Parameters](https://github.com/linuxserver/docker-boinc#parameters) 这个页面。

因为我的机器的配置不好，也没有 GPU，所以直接用这个简单配置就行，如果你想用 GPU 加速之类的，需要根据 [GPU Hardware Acceleration](https://github.com/linuxserver/docker-boinc#gpu-hardware-acceleration) 这个文档进行调整。

### Nginx 反向代理

上面的 docker-compose.yml 默认端口是 8080，可以自行修改，也可以使用反向代理进行代理。下面是我用的 Nginx 反向代理的配置文件，在 docker-compose.yml 里我用的是 11000 端口，也就是把 11000 端口反向代理到 `/boinc/` 这个子目录下。

```nginx
 location /boinc/ {
    proxy_set_header Host  $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $real_scheme;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection "upgrade";
    proxy_pass http://127.0.0.1:11000/;
}
```

## 运行计算项目

下面主要介绍怎么运行项目，BOINC 中其他的功能比如统计等部分可以自己探索。

### 打开管理界面

打开 8080 端口对应的 Web 页面（或者你自己设的端口，或者反向代理后的地址），不出意外会打开一个需要输入用户名和密码的页面，输入在 docker-compose.yml 中设定的用户名和密码（密码是原密码，不是 md5），就能进入主界面了。

下面我已经运行了几个项目，所以和刚开始可能不太一样。

![进入主页](https://file.lifeni.life/markdown/hello-boinc/1.webp)

建议在 View 菜单中设置成 Advanced View，这样看起来比较方便。

![高级视图](https://file.lifeni.life/markdown/hello-boinc/2.webp)

### 选择想要贡献的项目

选择工具栏 Tools → Add projects... 添加项目。

![添加项目窗口](https://file.lifeni.life/markdown/hello-boinc/3.webp)

<details>
<summary>点击查看部分项目的描述</summary>

> **生物学、医学**
>
> - [Docking@Home](https://zh.wikipedia.org/wiki/Docking@Home)—研究更深入的[蛋白质](https://zh.wikipedia.org/wiki/蛋白質)键结和反应的[原子](https://zh.wikipedia.org/wiki/原子)等级构造和细节，并借由其研究结果来研发药物以治疗人类疾病，目前已停止运作。
> - [DrugDiscovery@Home](https://zh.wikipedia.org/w/index.php?title=DrugDiscovery@Home&action=edit&redlink=1)—研发药物以治疗人类疾病，目前已停止运作。
> - [Malaria Control](https://zh.wikipedia.org/w/index.php?title=Malaria_Control&action=edit&redlink=1)—模拟[疟疾](https://zh.wikipedia.org/wiki/瘧疾)的影响及控制，目前已停止运作。
> - [Predictor@home](https://zh.wikipedia.org/wiki/Predictor@home)—预测蛋白质的结构，目前已停止运作。
> - [Proteins@home](https://web.archive.org/web/20080325060652/http://biology.polytechnique.fr/proteinsathome/)—推论[DNA](https://zh.wikipedia.org/wiki/去氧核醣核酸)的次序，目前已停止运作。
> - [GPUGRID.net](http://www.gpugrid.net/index.php)，存于[互联网档案馆](https://zh.wikipedia.org/wiki/互联网档案馆)—研究[分子生物](https://zh.wikipedia.org/wiki/分子生物)[动力学](https://zh.wikipedia.org/wiki/動力學)相关的研究，主要运行环境为支持[CUDA](https://zh.wikipedia.org/wiki/CUDA)的NVidia GPU。
> - [Rosetta@home](https://zh.wikipedia.org/wiki/Rosetta@home)—研究蛋白质的折叠。
>
> - [SIMAP](https://zh.wikipedia.org/wiki/SIMAP)（[Similarity Matrix of Proteins](https://web.archive.org/web/20141218040720/http://boinc.bio.wzw.tum.de/boincsimap/)）－ 一个蛋白质同源计算序列并可以对这些序列数据提供专业的检索工具的数据库，目前已停止运作。
>- [TANPAKU](https://zh.wikipedia.org/w/index.php?title=TANPAKU&action=edit&redlink=1)—利用[布朗动力学](https://zh.wikipedia.org/w/index.php?title=布朗動力學&action=edit&redlink=1)方法计算蛋白质的结构，目前已停止运作。
> - [POEM@HOME](https://zh.wikipedia.org/w/index.php?title=POEM@HOME&action=edit&redlink=1)—利用能量法来研究蛋白质的结构，目前已停止运作。
> - [MindModeling@Home](https://zh.wikipedia.org/w/index.php?title=MindModeling@Home&action=edit&redlink=1)—研究人类脑部的[认知科学](https://zh.wikipedia.org/wiki/認知科學)。
> - [Superlink@Technion](https://zh.wikipedia.org/w/index.php?title=Superlink@Technion&action=edit&redlink=1)—帮助科学家研究人类[基因](https://zh.wikipedia.org/wiki/基因)及其异常所产生的疾病，目前已停止运作。
> - [The Lattice Project](https://zh.wikipedia.org/w/index.php?title=The_Lattice_Project&action=edit&redlink=1)—[美国](https://zh.wikipedia.org/wiki/美國)[马里兰大学](https://zh.wikipedia.org/wiki/马里兰大学)的研究[生物信息学](https://zh.wikipedia.org/wiki/生物資訊學)领域相关的分布式计算平台，目前已停止运作。
> - [Virtual Prairie](https://zh.wikipedia.org/w/index.php?title=Virtual_Prairie&action=edit&redlink=1)
> - [Cels@Home](https://zh.wikipedia.org/w/index.php?title=Cels@Home&action=edit&redlink=1)
> - [RNA world](https://zh.wikipedia.org/w/index.php?title=RNA_world&action=edit&redlink=1)—研究分析生物中[RNA](https://zh.wikipedia.org/wiki/核醣核酸)的分子结构。
> - [DNA@Home](https://zh.wikipedia.org/w/index.php?title=DNA@Home&action=edit&redlink=1)—研究有关生物中DNA的基因调控作用，目前已停止运作。
> - [FightNeglectedDiseases@Home](https://zh.wikipedia.org/w/index.php?title=FightNeglectedDiseases@Home&action=edit&redlink=1)（FiND@Home）
>
> **气象学、地球科学**
>
> - [Climateprediction.net](https://zh.wikipedia.org/wiki/Climateprediction.net)（CPDN）—预测[廿一世纪](https://zh.wikipedia.org/wiki/廿一世紀)的气候。
>
> - [地震捕手网络(Quake Catcher Network)](https://zh.wikipedia.org/wiki/地震捕手网络)—利用分布在全球各地电脑的[传感器](https://zh.wikipedia.org/wiki/传感器)来侦测和研究[地震](https://zh.wikipedia.org/wiki/地震)现象。
>
> **物理、化学、天文学**
>
> - [Einstein@Home](https://zh.wikipedia.org/wiki/Einstein@Home)—搜索[脉冲星](https://zh.wikipedia.org/wiki/脈衝星)的[引力波](https://zh.wikipedia.org/wiki/引力波)。
>- [Cosmology@Home](https://zh.wikipedia.org/w/index.php?title=Cosmology@Home&action=edit&redlink=1)—研究宇宙的模型及其相关的物理天文学信息。
> - [Leiden Classical](https://zh.wikipedia.org/wiki/Leiden_Classical)—模拟在经典物理环境下的各种[分子](https://zh.wikipedia.org/wiki/分子)和[原子](https://zh.wikipedia.org/wiki/原子)。
>- [LHC@home](https://zh.wikipedia.org/wiki/LHC@home)—模拟[粒子加速](https://zh.wikipedia.org/w/index.php?title=粒子加速&action=edit&redlink=1)，协助设计及改善[LHC](https://zh.wikipedia.org/wiki/LHC)[粒子加速器](https://zh.wikipedia.org/wiki/粒子加速器)。
>
> - [NanoHive@Home](https://zh.wikipedia.org/w/index.php?title=NanoHive@Home&action=edit&redlink=1)—模拟和研究[奈米分子](https://zh.wikipedia.org/w/index.php?title=奈米分子&action=edit&redlink=1)的结构系统和特性，目前已停止运作。
> - [Orbit@home](https://zh.wikipedia.org/w/index.php?title=Orbit@home&action=edit&redlink=1)—计算[近地小行星](https://zh.wikipedia.org/wiki/近地小行星)的轨道路径，以预防其碰撞地球而对地球造成损害，曾经由于缺乏资金已暂停运作，已在2014-15年恢复运行。
> - [QMC@Home](https://zh.wikipedia.org/w/index.php?title=QMC@Home&action=edit&redlink=1)—发展在[量子化学](https://zh.wikipedia.org/wiki/量子化學)领域广泛使用的量子统计模拟方法。
>- [SETI@home](https://zh.wikipedia.org/wiki/SETI@home)—搜索[外太空文明](https://zh.wikipedia.org/wiki/外太空文明)，已于3月31日无限期暂停。
>
>- [μFluids@Home](https://web.archive.org/web/20100910021816/http://www.ufluids.net/)—模拟[微重力](https://zh.wikipedia.org/wiki/微重力)和[微流体力学](https://zh.wikipedia.org/w/index.php?title=微流體力學&action=edit&redlink=1)问题的两相现象，目前已停止运作。
> - [Milkyway@home](https://zh.wikipedia.org/w/index.php?title=Milkyway@home&action=edit&redlink=1)—研究[银河系](https://zh.wikipedia.org/wiki/銀河系)的重力波，支持NVidia CUDA及[ATi](https://zh.wikipedia.org/wiki/ATi)的显卡运算。
> - [Spinhenge@home](https://zh.wikipedia.org/w/index.php?title=Spinhenge@home&action=edit&redlink=1)—研究[纳米磁性分子](https://zh.wikipedia.org/w/index.php?title=納米磁性分子&action=edit&redlink=1)的物理特性，目前已停止运作。
> - [BRaTS@home](https://zh.wikipedia.org/w/index.php?title=BRaTS@home&action=edit&redlink=1)—进行引力波束追踪的相关计算，目前已停止运作。
> - [Hydrogen@Home](https://zh.wikipedia.org/w/index.php?title=Hydrogen@Home&action=edit&redlink=1)—研究以[氢](https://zh.wikipedia.org/wiki/氫)作为动力的干净能源，目前已停止运作。
>- [Magnetism@home](https://zh.wikipedia.org/w/index.php?title=Magnetism@home&action=edit&redlink=1)
> - [SLinCA@Home](https://zh.wikipedia.org/w/index.php?title=SLinCA@Home&action=edit&redlink=1)—研究物理及[材料科学](https://zh.wikipedia.org/wiki/材料科學)领域。
>- [Eon](https://zh.wikipedia.org/w/index.php?title=Eon&action=edit&redlink=1)—利用[理论化学](https://zh.wikipedia.org/wiki/理论化学)方法来研究[凝聚态物理学](https://zh.wikipedia.org/wiki/凝聚态物理学)和材料科学。
>
> **数学**
>
> - [ABC@Home](https://zh.wikipedia.org/wiki/ABC@Home)—尝试解决[ABC猜想](https://zh.wikipedia.org/wiki/Abc猜想)。
> - [Chess960@Home](https://zh.wikipedia.org/wiki/Chess960@Home)—研究[菲舍尔任意制象棋](https://zh.wikipedia.org/wiki/菲舍爾任意制象棋)的开局理论并创建巨型的[国际象棋](https://zh.wikipedia.org/wiki/國際象棋)棋局数据库。
> - [NQueens@home](https://zh.wikipedia.org/wiki/NQueens@home)—解决国际象棋的[N皇后问题](https://zh.wikipedia.org/wiki/N皇后問題)，目前已停止运作。
> - [PrimeGrid](https://zh.wikipedia.org/w/index.php?title=PrimeGrid&action=edit&redlink=1)—尝试将巨大的数字进行因式分解，查找人类未知的质数。
> - [Rectilinear Crossing Number](http://dist.ist.tugraz.at/cape5/)[页面存档备份](https://web.archive.org/web/20080625230740/http://dist.ist.tugraz.at/cape5/)，存于[互联网档案馆](https://zh.wikipedia.org/wiki/互联网档案馆)—研究平面中最少的[交叉数](https://zh.wikipedia.org/wiki/交叉數)问题，目前已停止运作。
>- [RieselSieve](https://web.archive.org/web/20060815152921/http://boinc.rieselsieve.com/)—查找k*2^n-1形式的素数，显示k=509203是最小的[黎瑟尔斯数](https://zh.wikipedia.org/w/index.php?title=黎瑟爾斯數&action=edit&redlink=1)，目前已并入PrimeGrid项目中。
> - [Collatz Conjecture](https://zh.wikipedia.org/w/index.php?title=Collatz_Conjecture&action=edit&redlink=1)—研究[考拉兹猜想](https://zh.wikipedia.org/wiki/考拉茲猜想)。
>- [NFS@Home](https://zh.wikipedia.org/w/index.php?title=NFS@Home&action=edit&redlink=1)
> - [Sudoku project](https://zh.wikipedia.org/w/index.php?title=Sudoku_project&action=edit&redlink=1)—研究[数独](https://zh.wikipedia.org/wiki/數獨)问题，目前已停止运作。
> - [Ramsey@Home](https://zh.wikipedia.org/w/index.php?title=Ramsey@Home&action=edit&redlink=1)—研究[拉姆西数](https://zh.wikipedia.org/w/index.php?title=拉姆西數&action=edit&redlink=1)，目前已停止运作。
> - [Reversi](https://zh.wikipedia.org/w/index.php?title=Reversi&action=edit&redlink=1)—研究[黑白棋](https://zh.wikipedia.org/wiki/黑白棋)游戏，目前已停止运作。
> - [WEP-M+2 Project](https://zh.wikipedia.org/w/index.php?title=WEP-M%2B2_Project&action=edit&redlink=1)—使用WEP算法对2^p+1进行因式分解。
> - [Sudoku@vtaiwan](https://zh.wikipedia.org/w/index.php?title=Sudoku@vtaiwan&action=edit&redlink=1)—由[台湾](https://zh.wikipedia.org/wiki/台灣)的[交通大学](https://zh.wikipedia.org/wiki/交通大學)推出的计划，研究数独问题，目前已停止运作。
> - [DNETC@HOME](https://zh.wikipedia.org/w/index.php?title=DNETC@HOME&action=edit&redlink=1)
>
> **电脑、信息技术**
>
> - [World Community Grid](https://zh.wikipedia.org/wiki/World_Community_Grid)—由[IBM](https://zh.wikipedia.org/wiki/IBM)主持，主要目的为利用分布式计算来帮助查找人类疾病的治疗方法，和改善人类生活的相关研究。
> - [AQUA@home](https://zh.wikipedia.org/w/index.php?title=AQUA@home&action=edit&redlink=1)—帮助设计量子电脑，目前已停止运作。
> - [BURP](https://zh.wikipedia.org/w/index.php?title=BURP&action=edit&redlink=1)—处理及创作三维动画。
> - [DepSpid](https://zh.wikipedia.org/w/index.php?title=DepSpid&action=edit&redlink=1)—互联网搜索器，目前已停止运作。
> - [EDGeS@Home](https://zh.wikipedia.org/w/index.php?title=EDGeS@Home&action=edit&redlink=1)
>- [Enigma@Home](https://zh.wikipedia.org/w/index.php?title=Enigma@Home&action=edit&redlink=1)—尝试破解[第二次世界大战](https://zh.wikipedia.org/wiki/第二次世界大戰)时由[恩尼格玛密码机](https://zh.wikipedia.org/wiki/恩尼格瑪密碼機)发送的原始消息。
> - [HashClash](https://zh.wikipedia.org/w/index.php?title=HashClash&action=edit&redlink=1)
>- [Project Neuron](https://zh.wikipedia.org/w/index.php?title=Project_Neuron&action=edit&redlink=1)—测试BOINC框架，目前已停止运作。
> - [SHA-1 Collision Search Graz](https://web.archive.org/web/20100412170738/http://boinc.iaik.tugraz.at/sha1_coll_search/)—[密码学](https://zh.wikipedia.org/wiki/密碼學)：查找[SHA-1](https://zh.wikipedia.org/wiki/SHA-1)碰撞，目前已停止运作。
> - [VGTU@Home](http://boinc.vgtu.lt/vtuathome/)[页面存档备份](https://web.archive.org/web/20160120012504/http://boinc.vgtu.lt/vtuathome/)，存于[互联网档案馆](https://zh.wikipedia.org/wiki/互联网档案馆)—[软件测试](https://zh.wikipedia.org/wiki/軟體測試)：提供[分布式计算平台](https://zh.wikipedia.org/w/index.php?title=分散式計算平台&action=edit&redlink=1)，改善BOINC。
> - [IBERCIVIS](https://zh.wikipedia.org/w/index.php?title=IBERCIVIS&action=edit&redlink=1)—提供[西班牙](https://zh.wikipedia.org/wiki/西班牙)科学研究的分布式计算平台。
> - [DistrRTgen](https://zh.wikipedia.org/w/index.php?title=DistrRTgen&action=edit&redlink=1)—利用BOINC的分布式运算产生[彩虹表](https://zh.wikipedia.org/wiki/彩虹表)。
> - [SZTAKI Desktop Grid](https://web.archive.org/web/20160814071936/http://szdg.lpds.sztaki.hu/szdg/)—搜索广义[二进制](https://zh.wikipedia.org/wiki/二進制)[数系](https://zh.wikipedia.org/wiki/數系)。
> - [yoyo@home](https://zh.wikipedia.org/w/index.php?title=Yoyo@home&action=edit&redlink=1)—利用BOINC的封装技术将现有的分布式计算项目引入到BOINC平台，支持[PS3](https://zh.wikipedia.org/wiki/PS3)运算。
> - [Pirates@home](https://zh.wikipedia.org/w/index.php?title=Pirates@home&action=edit&redlink=1)—测试BOINC项目。
> - [XtremLab](https://zh.wikipedia.org/wiki/XtremLab)—研究并改善网格计算，包括BOINC平台，目前已停止运作。

</details>

我选择的是 Rosetta@Home 这个项目，本来是要选 World Community Grid，但是在下载项目的时候有一个 100MB+ 的文件下载不下来，所以只能放弃。

选好项目之后，让登录账号，如果没有就注册一个，然后一直下一步就行了。最后点 finish，BOINC 会自动下载所需要的资源，然后运行项目。如果你的服务器在国内，可能需要很长时间才能把项目下载下来，不过反正是闲置的服务器，不用太在乎花的时间，有贡献就行。


### 调整计算选项

在 Options → Computing preferences... 中可以调整 BOINC 资源占用的限制。

![资源占用选项](https://file.lifeni.life/markdown/hello-boinc/4.webp)

除了上面的 CPU 的限制，后面的选项卡中还有内存和磁盘的限制，可以根据自己的需求进行调整。

## 解决问题

### 运行项目一段时间后服务器卡死

> 主要表现为 CPU 一直是 100%，内存接近 100%，磁盘一直在读取，并且无法通过 SSH 连接到服务器，服务器上的其他服务也处于无响应的状态，但是服务器可以被 ping 通。

这是因为机器的内存不足，用到了虚拟内存，所以很慢，尤其是 Rosetta@Home 这个项目，要占用很多内存资源。解决方法就是，把 BOINC 的计算占用调低一点，或者换个项目。

## 参考资料

- [BOINC](https://boinc.berkeley.edu/)
- [BOINC - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/BOINC)
- [linuxserver/boinc](https://hub.docker.com/r/linuxserver/boinc)