---
name: js-deep-clone
title: JavaScript 实现对象的深拷贝
create-date: 2021-03-24
date: 2021-04-10
descriptions:
  - 尝试用不同方法实现 JS 中对象的深拷贝功能
  - 本文的深拷贝只考虑嵌套的对象和数组，不考虑函数、正则等
tags:
  - JavaScript
license: CC-BY-SA-4.0
---

# JavaScript 实现对象的深拷贝

📌 尝试用不同方法实现 JS 中对象的深拷贝功能

🚧 本文的深拷贝只考虑嵌套的对象和数组，不考虑函数、正则等

## 前提

由于 JavaScript 中的数据类型非常多，大部分数据都可以放在对象里，其中有很多不适合进行 Clone，比如 DOM 节点、原型链等，所以这里仅探讨 JSON 所包含的数据的深拷贝，也就是拷贝 Object 的嵌套对象和数组结构。

### 测试用的对象

测试用的对象分为两个，第一个是 JSON 所支持的格式，第二个包含了一些 JS 中的一些数据结构。

```js
const obj = {
  num: 123,
  str: 'hello',
  arr: [456, 'world', [1, [2, [3]]], { a: 'A' }, false],
  obj: {
    obj: {
      obj: {
        arr: [],
      },
    },
  },
  bool: true,
  emoji: '🚀',
  中文: '测试',
  is_null: null,
};
```

```js
const extend = {
  regex: /123/,
  func: function () {
    console.log('hello');
  },
  date: new Date(),
  symbol: Symbol(),
  map: new Map(),
  set: new Set(),
  is_undefined: undefined,
  not_a_num: NaN,
};
```

## `JSON.parse` 和 `JSON.stringify`

最简单的深拷贝方法了，缺点是只能拷贝 JSON 支持的数据，其他的比如 Map、Set 都没有被拷贝。

```js
let justCopy = obj;
justCopy.obj === obj.obj; // true

let deepClone = JSON.parse(JSON.stringify(obj));
deepClone.obj === obj.obj; // false

JSON.parse(JSON.stringify(extend));
// output:
{
  "regex": {},
  "date": "2021-03-28T13:41:24.189Z",
  "map": {},
  "set": {},
  "not_a_num": null
}

```

## 递归拷贝

用递归的方式拷贝嵌套对象和数组，同样只有一部分的 JS 对象能被拷贝，但是对于 JSON 对象可以比较好的完成拷贝。

```js
const cloneDeep = target => {
  // 判断如果不是 Object 或者 Array 就返回
  // 需要注意 typeof [] === 'object'
  if (typeof target !== 'object') {
    return target;
  }

  // 判断整体上是对象还是数组，之后往里面拷贝属性
  let newTarget = Array.isArray(target) ? [] : {};

  // 遍历对象或者数组中的每一项（属性）
  for (let key in target) {
    // 只对对象本身的属性进行拷贝，而不拷贝集成的属性（也就是原型链中的东西）
    if (target.hasOwnProperty(key)) {
      // 这里 target[key] 既包含对象，也包含数字字符串等，因为函数开头判断过了，不是对象和数组的直接返回
      newTarget[key] = cloneDeep(target[key]);
    }
  }

  return newTarget;
};
```

```js
cloneDeep(obj);
// output:
{
  num: 123,
  str: 'hello',
  arr: [456, 'world', [1, [2, [3]]], { a: 'A' }, false],
  obj: {
    obj: {
      obj: {
        arr: [],
      },
    },
  },
  bool: true,
  emoji: '🚀',
  中文: '测试',
  is_null: {},
};

cloneDeep(extend);
// output:
{
  regex: {},
  func: [(Function: func)],
  date: {},
  symbol: Symbol(),
  map: {},
  set: {},
  is_undefined: undefined,
  not_a_num: NaN,
};
```

这里的代码参考了文章：[深拷贝系列 ———— 自己通过递归实现一个深拷贝](https://juejin.cn/post/6844904004170809351#heading-15)，文章的作者还尝试实现了其他数据类型的深拷贝，想要深入了解的话可以去看看这个文章。

## `Object.assign`

ES6 中新加入的方法，可以把一个或多个对象的属性拷贝到一个对象中，实现的是浅拷贝（或者说是只有一层的深拷贝）。

```js
let justCopy = obj;
justCopy.obj === obj.obj; // true

let assignClone = Object.assign({}, obj);
assignClone.obj === obj.obj; // true
```

`Object.assign` 的优点是可以拷贝多种类型的数据。

```js
Object.assign({}, extend);
// output:
{
  regex: /123/,
  func: [Function: func],
  date: 2021-03-28T13:48:41.912Z,
  symbol: Symbol(),
  map: Map(0) {},
  set: Set(0) {},
  is_undefined: undefined,
  not_a_num: NaN
}
```

## 相关的库

前端库这么多，随便找找就有深拷贝的实现，直接拿来用就好了。

#### rfdc

[Really Fast Deep Clone](https://www.npmjs.com/package/rfdc)，npm 上下载比较多的一个库。

#### `_.cloneDeep`

Loadsh 的实现，文档：[Lodash Documentation](https://lodash.com/docs/4.17.15#cloneDeep) 。

#### `$.extend`

jQuery 也有，文档：[jQuery.extend() | jQuery API Documentation](https://api.jquery.com/jQuery.extend/) 。

## 参考资料

- [JavaScript 如何完整实现深度 Clone 对象？ - 知乎](https://www.zhihu.com/question/47746441)
- [The structured clone algorithm - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
- [Object.assign() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
