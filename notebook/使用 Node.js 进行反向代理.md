---
name: node-proxy
title: 使用 Node.js 进行反向代理
create-date: 2020-04-11
date: 2020-04-14
descriptions:
    - 写一个反向代理服务器，转发 API 请求到不同端口
tags:
    - Node
    - Express
    - JavaScript
license: CC-BY-SA-4.0
---

# 使用 Node.js 进行反向代理

📌 写一个反向代理服务器，转发 API 请求到不同端口

## 需求

根据客户端请求路径的不同，转发请求到一个服务器内的不同端口，实现不同功能。例如接口 `api.lifeni.life`：

- 当直接访问 `api.lifeni.life` 时，返回 API 的统计页面
- 访问 `api.lifeni.life/project/xxx` 时，转发请求到服务器内 project 应用的端口，比如 `localhost:3333`，实现 API 功能。

## 技术

使用到的 npm 模块：

- `express` `4.17.1`
- `http-proxy-middleware` `1.0.3`

http-proxy-middleware 是用于处理代理的中间件，Github 链接：[chimurai/http-proxy-middleware: The one-liner node.js http-proxy middleware for connect, express and browser-sync](https://github.com/chimurai/http-proxy-middleware)，里面有详细的文档。

## 过程

### 1. 安装必要的模块

```bash
$ npm i express
$ npm i http-proxy-middleware
```

### 2. 主要代码

新建 npm 项目时的入口文件是 `app.js`。在文件中加入下面的代码，代码来自官方示例，有翻译和改动。

```js
// 添加依赖
const express = require('express');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');

// 官方实例的翻译，有改动

// 代理中间件选项
const options = {
    target: 'http://localhost:3001', // 目标地址

    // 把目标主机获取到的 Host 替换成目标地址
    // 当为 true 时，目标主机获取到的 Host 端口为 3001，反之为3000
    changeOrigin: false,

    ws: true, // 是否代理 WebSockets
    pathRewrite: {
        '^/api/old-path': '/api/new-path', // 重写路径
        '^/api/remove/path': '/path', // 移除中间的路径
    },
    router: {
        // 当 request.headers.host == 'dev.localhost:3000' 时,
        // 把目标地址 'http://www.example.org' 转换成 'http://localhost:8000'
        'dev.localhost:3000': 'http://localhost:8000',
    },
};

// 创建代理 (without context)
const exampleProxy = createProxyMiddleware(options);

// 挂载 `exampleProxy` 到服务器
app.use('/api', exampleProxy);

// ---------------
// 符合自己需求的写法
const optionProject = {
    target: 'http://localhost:3001',
    changeOrigin: false,
    ws: true,
    pathRewrite: {
        '^/project-name': '/',
    },
};
const myProxy = createProxyMiddleware(optionProject);
app.use('/project-name', myProxy);
app.listen(3000);
```

简单的注释已经在代码里写了，具体的效果可以看下面的测试。

### 3. 测试

测试同样使用 express 在本地起一个端口，这里用的是 3001。

下面的代码可以获取到 `localhost:3001` 的 Host 以及路径，帮助判断代理是否成功：

```js
const express = require('express');
const app = express();

app.get('*', (req, res) => {
    console.log(req);
    res.end(req.headers.host + req.originalUrl);
});

app.listen(3001);
```

两个 Node 程序运行后进行测试：

- 浏览器输入 `localhost:3000`：

  ```
  Cannot GET /
  ```

  正常，因为没有代理根目录。

- 浏览器输入 `localhost:3000/api`：

  ```
  127.0.0.1:3000/api
  ```

  正常，此时测试程序获取到了主程序的 Host 和地址。此时如果把主程序中的 `changeOrigin: false` 改为 `true`，那么浏览器输出的应该是 `127.0.0.1:3001/api`。

- 浏览器输入 `localhost:3000/api/abc/555?name=123&age=0`：

  ```
  127.0.0.1:3000/api/abc/555?name=123&age=0
  ```

  正常。

- 浏览器输入 `localhost:3000/api/old-path?name=123&age=0`：

  ```
  127.0.0.1:3000/api/new-path?name=123&age=0
  ```

  正常，此时触发了 `pathRewrite` 的设置。

- 浏览器输入 `localhost:3000/project-name/api/v1/some-apis`：

  ```
  localhost:3000/api/v1/some-apis
  ```

  测试通过，满足需求。

## 高级的设置

官方给的示例已经够用了，但文档里还有一些其他的用法，以后可能会用到，所以在这里选一部分写，就当是翻译了。

### 内容匹配

下面是内容匹配的模式图，以 [RFC 3986 `path`](https://tools.ietf.org/html/rfc3986#section-3.3) 为标准：

```
  foo://example.com:8042/over/there?name=ferret#nose
  \_/   \______________/\_________/ \_________/ \__/
   |           |            |            |        |
  协议    主机名和端口      路径        查询参数   锚点
```

- **匹配路径**

  - `createProxyMiddleware({...})` - 匹配任何路径，代理所有请求
  - `createProxyMiddleware('/', {...})` - 匹配任何路径，代理所有请求（和上面一样）
  - `createProxyMiddleware('/api', {...})` - 匹配以 `/api` 开头的路径

- **匹配多个路径**

  - `createProxyMiddleware(['/api', '/ajax', '/someotherpath'], {...})`

- **使用通配符匹配路径**

  为了更精细的控制，可以使用通配符来匹配。 Glob 匹配模式由 _micromatch_ 完成，访问 [micromatch](https://www.npmjs.com/package/micromatch) 或者 [glob](https://www.npmjs.com/package/glob) 来获得更多例子。

  - `createProxyMiddleware('**', {...})` 匹配任何路径，代理所有请求
  - `createProxyMiddleware('**/*.html', {...})` 匹配所有以 `.html` 结尾的路径
  - `createProxyMiddleware('/*.html', {...})` 直接在绝对路径下匹配路径
  - `createProxyMiddleware('/api/**/*.html', {...})` 匹配 `/api` 路径中以 `.html` 结尾的请求
  - `createProxyMiddleware(['/api/**', '/ajax/**'], {...})` 组合多个模式
  - `createProxyMiddleware(['/api/**', '!**/bad.json'], {...})` 排除

  **注意**：在同时匹配多个路径的情况下，不能混合使用字符串和通配符。

- **自定义匹配**

  为了全面控制，你可以自定义一个函数来决定请求是否需要被代理。

  ```js
  /**
   * @return {Boolean}
   */
  const filter = function (pathname, req) {
      return pathname.match('^/api') && req.method === 'GET';
  };

  const apiProxy = createProxyMiddleware(filter, {
      target: 'http://www.example.org',
  });
  ```

### 代理选项

`http-proxy-middleware options` 和 `http-proxy events` 没有写，想看的可以去看原文。下面只翻译部分 `http-proxy options`（太简单的就不翻译了，没看懂的也不翻译了。。）。

下面这些选项来自底层的 [http-proxy](https://github.com/nodejitsu/node-http-proxy#options) 库。

- **option.target**: 要使用 url 模块解析的 url 字符串

- **option.forward**: 要使用 url 模块解析的 url 字符串

- **option.agent**: 传递给 http(s).request 的对象 (see Node's [https agent](http://nodejs.org/api/https.html#https_class_https_agent) and [http agent](http://nodejs.org/api/http.html#http_class_http_agent) objects)

- **option.ssl**: 传递给 https.createServer() 的对象

- **option.ws**: true/false: 如果你想代理 WebSockets

- **option.xfwd**: true/false, adds x-forward headers

- **option.secure**: true/false, 如果您想验证 SSL 证书

- **option.toProxy**: true/false, 传递绝对 URL 作为路径（用于代理到代理）

- **option.prependPath**: true/false, Default: true - 指定是否要将目标路径添加到代理路径之前

- **option.ignorePath**: true/false, Default: false - 指定是否要忽略传入请求的代理路径（注意：如果需要，您将必须手动添加/附加）

- **option.localAddress** : Local interface string to bind for outgoing connections

- **option.changeOrigin**: true/false, Default: false - 将主机标头的来源更改为目标 URL

- **option.preserveHeaderKeyCase**: true/false, Default: false -指定是否要保留响应头的字母大小写

- **option.auth** : Basic authentication i.e. 'user:password' to compute an Authorization header.

- **option.hostRewrite**: 在（301/302/307/308）重定向上重写本地主机名

- **option.autoRewrite**: 根据请求的主机/端口在（301/302/307/308）重定向上重写本地主机/端口。Default: false.

- **option.protocolRewrite**: 在（301/302/307/308）上将本地协议重写为“ http”或“ https”。Default: null.

- **option.cookieDomainRewrite**: rewrites domain of `set-cookie` headers. Possible values:

  - `false` (default): 禁用 cookie 重写

  - String: 新域, for example `cookieDomainRewrite: "new.domain"`. 移除域使用 `cookieDomainRewrite: ""`.

  - Object: 域到新域的映射，请使用“ \*”来匹配所有域

    例如，保持一个域不变，重写一个域并删除其他域：

    ```js
    cookieDomainRewrite: {
      "unchanged.domain": "unchanged.domain",
      "old.domain": "new.domain",
      "*": ""
    }
    ```

- **option.cookiePathRewrite**: rewrites path of `set-cookie` headers. Possible values:

  - `false` (default): disable cookie rewriting

  - String: new path, for example `cookiePathRewrite: "/newPath/"`. To remove the path, use `cookiePathRewrite: ""`. To set path to root use `cookiePathRewrite: "/"`.

  - Object: mapping of paths to new paths, use `"*"` to match all paths. For example, to keep one path unchanged, rewrite one path and remove other paths:

    ```js
    cookiePathRewrite: {
      "/unchanged.path/": "/unchanged.path/",
      "/old.path/": "/new.path/",
      "*": ""
    }
    ```

- **option.headers**: object, adds [request headers](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Request_fields). (Example: `{host:'www.example.org'}`)

- **option.proxyTimeout**: 代理未收到目标响应时超时（以毫秒为单位）

- **option.timeout**: 传入请求的超时（以毫秒为单位）

- **option.followRedirects**: true/false, Default: false - 指定是否要遵循重定向

- **option.selfHandleResponse** true/false, if set to true, none of the webOutgoing passes are called and it's your responsibility to appropriately return the response by listening and acting on the `proxyRes` event

- **option.buffer**: 要作为请求正文发送的数据流。也许您有一些中间件在请求代理之前消耗了请求流，例如如果您将请求的主体读入名为“ req.rawbody”的字段中，则可以在 buffer 选项中重新传输该字段：

  ```js
  'use strict';

  const streamify = require('stream-array');
  const HttpProxy = require('http-proxy');
  const proxy = new HttpProxy();

  module.exports = (req, res, next) => {
      proxy.web(
          req,
          res,
          {
              target: 'http://localhost:4003/',
              buffer: streamify(req.rawBody),
          },
          next
      );
  };
  ```

### 简写

简单的配置应该用简单的写法。使用简写的时候 `context` 和 `option.target`（就是内容匹配和代理选项）会自动配置好，如果需要的话，还可以加上代理选项。

```js
createProxyMiddleware('http://www.example.org:8000/api');
// createProxyMiddleware('/api', {target: 'http://www.example.org:8000'});

createProxyMiddleware('http://www.example.org:8000/api/books/*/**.json');
// createProxyMiddleware('/api/books/*/**.json', {target: 'http://www.example.org:8000'});

createProxyMiddleware('http://www.example.org:8000/api', {
    changeOrigin: true,
});
// createProxyMiddleware('/api', {target: 'http://www.example.org:8000', changeOrigin: true});
```

**关于 app.use(path, proxy)**：

如果你用的是服务器上的 `app.use` `path` 去匹配请求，那么就创建下面这种没有中间件内容匹配的写法：

```js
app.use(
    '/api',
    createProxyMiddleware({
        target: 'http://www.example.org',
        changeOrigin: true,
    })
);
```

`app.use` 的文档:

- express: http://expressjs.com/en/4x/api.html#app.use
- connect: https://github.com/senchalabs/connect#mount-middleware
- polka: https://github.com/lukeed/polka#usebase-fn

### WebSocket

```js
// 长 api
createProxyMiddleware('/', { target: 'http://echo.websocket.org', ws: true });

// 短
createProxyMiddleware('http://echo.websocket.org', { ws: true });

// 更短
createProxyMiddleware('ws://echo.websocket.org');
```

此处还有拓展的用法，可以去看文档，这里没翻译。

## 问题解决

1. **如何在访问根路径时返回静态网页？**

    假设静态网页的目录是 `/pubic`，在 `app.js` 中加入下面的代码即可：

   ```js
    app.use(express.static('public'));
   ```

## 参考资料

1. [chimurai/http-proxy-middleware: The one-liner node.js http-proxy middleware for connect, express and browser-sync](https://github.com/chimurai/http-proxy-middleware#http-proxy-options)
2. [Express "Hello World" example](https://expressjs.com/en/starter/hello-world.html)
3. [express 设置静态文件目录 - Alyson.fu - 博客园](https://www.cnblogs.com/formybestlife/p/9707071.html)
