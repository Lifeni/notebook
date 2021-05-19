---
name: cookies-issue
title: 使用 Cookies 时遇到的问题
create-date: 2020-08-19
date: 2020-08-19
description: |
  尝试解决实际开发中关于 Cookies 的一些问题。
tags:
  - Cookies
  - JavaScript
  - Nginx
license: CC-BY-SA-4.0
---

# 使用 Cookies 时遇到的问题

## 场景一：跨域身份验证

网页通过 fetch 获取另一个网址的数据，需要先访问一个地址获取 Cookies，之后再进行其他地址的访问时，需要根据这个 Cookies 进行身份的验证，也就是根据 Cookies 中携带的 ID 来判断请求的来源。

涉及到的技术：Koa、Nginx（反向代理）。

**下面展示的是一系列问题，如果你也遇到了其中某个一样的问题，请把所有步骤都看完再去修改代码。**

### 1. 跨域

服务端用的是 Koa，所以直接用 `@koa/cors`，文档：[@koa/cors - npm](https://www.npmjs.com/package/@koa/cors) 。

```bash
$ npm i @koa/cors
```

然后在服务端的文件里添加：

```js
const Koa = require('koa');
const cors = require('@koa/cors');

const app = new Koa();
app.use(cors());
```

### 2. 无法保存 Cookies

> 默认情况下 fetch 不会发送和接收 Cookies，需要把 `credentials` 设置为 `include`，表示允许跨域。
>
> 参考：[使用 Fetch - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch) 。
>
> **这一步不能解决这个问题，请继续看下面的步骤。**

解决方法的示例代码如下：

```js
// 客户端
fetch('https://api.example.com/token', {
  method: 'GET',
  credentials: 'include',
})
  .then(res => res.json())
  .then(data => {
    console.log(data);
  });
```

```js
// 服务端也要修改
app.use(
  cors({
    credentials: true,
  })
);
```

### 3. This Set-Cookie didn't specify a "SameSite" attribute and ...

> 经过上面的设置还是无法储存 Cookies，在控制台 Network 中的请求中可以找到这个警告，提示需要设置 `SameSite=None`。
>
> **这一步不能解决这个问题，请继续看下面的步骤。**

修改服务端发送 Cookies 的地方：

```js
ctx.cookies.set('uuid', uuid, {
  httpOnly: true,
  sameSite: 'none', // 添加这一句
  expires: dayjs()
    .add(Number(process.env.UUID_MAX_AGE) * 1000, 'ms')
    .toDate(),
});
```

### 4. This Set-Cookie was blocked because it had the "SameSite=None" attribute but ...

> 还是刚才的警告位置，根据提示需要设置 `Secure` 字段。如果使用了 Nginx 的反向代理，这一步还需要修改 Nginx 的配置。
>
> 参考：
>
> [Library should not throw an error when attempting to set a "Secure" cookie on insecure connection · Issue #87 · pillarjs/cookies · GitHub](https://github.com/pillarjs/cookies/issues/87) ，
>
> [amazon web services - How do I prevent nginx from stripping secure cookies? - Server Fault](https://serverfault.com/questions/797129/how-do-i-prevent-nginx-from-stripping-secure-cookies) 。

再次修改服务端发送 Cookies 的地方：

```js
ctx.cookies.set('uuid', uuid, {
  httpOnly: true,
  sameSite: 'none',
  secure: true, // 添加这一句
  expires: dayjs()
    .add(Number(process.env.UUID_MAX_AGE) * 1000, 'ms')
    .toDate(),
});
```

然后在服务端的入口文件（引入 Koa 的文件）中添加：

```js
const Koa = require('koa');
const app = new Koa();

app.proxy = true; // 添加这一句
```

最后打开 Nginx 关于服务端的配置文件，一般在 `/etc/nginx/conf.d` 目录，修改文件：

```nginx
server {
    listen 80;
    server_name  api.lifeni.life;
    rewrite ^(.*)$  https://$host$1 permanent;
    ...
}

# 添加这一段
map $http_x_forwarded_proto $real_scheme {
  default $http_x_forwarded_proto;
  ''      $scheme;
}

server {
    listen 443 ssl http2;
    server_name api.lifeni.life;
    ...
    location / {
        proxy_set_header Host  $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # 添加这一句
        proxy_set_header X-Forwarded-Proto $real_scheme;

        proxy_pass http://127.0.0.1:3030/;
    }
}
```

之后重启 Nginx，重新部署服务端、客户端即可。
