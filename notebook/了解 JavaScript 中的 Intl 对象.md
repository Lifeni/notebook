---
name: javascript-intl
title: 了解 JavaScript 中的 Intl 对象
create-date: 2021-03-16
date: 2021-03-16
descriptions:
  - 学习和使用 Intl 这个 JS 自带的对象，了解其在中文环境下可用的语法
tags:
  - JavaScript
  - I18N
license: CC-BY-SA-4.0
---

# 了解 JavaScript 中的 Intl 对象

📌 学习和使用 Intl 这个 JS 自带的对象，了解其在中文环境下可用的语法

## `Intl` 对象

> `Intl` 对象是 ECMAScript 国际化 API 的一个命名空间，它提供了精确的字符串对比、数字格式化，和日期时间格式化。`Collator`，`NumberFormat` 和 `DateTimeFormat` 对象的构造函数是 `Intl` 对象的属性。本页文档内容包括了这些属性，以及国际化使用的构造器和其他语言的方法等常见的功能。

> 引用来源：[Intl - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl)

### 兼容性

![Can I Use](https://file.lifeni.life/markdown/javascript-intl/1.webp)

通过查询 [Can I Use](https://caniuse.com/internationalization) 来看，兼容性还是可以的。

## 方法

### `Intl.DateTimeFormat`

用来格式化日期。

```js
const date = new Date();
const locale = window.navigator.language;
// locale: zh-CN

new Intl.DateTimeFormat(locale).format(date);
// "2021/3/16"

new Intl.DateTimeFormat("en-US").format(date);
// "3/16/2021"

new Intl.DateTimeFormat("ja-JP-u-ca-japanese").format(date);
// "R3/3/16"
```

`Intl.DateTimeFormat` 可以接受一个 Option，用来自定义日期格式。如果不传入配置，默认只显示 `year` `month` `day` 这三个，且默认值均为 `numeric`。

```js
new Intl.DateTimeFormat("en-US", {
  year: "2-digit",
  month: "short",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
  weekday: "long",
  hour12: true,
}).format(new Date());
// Tuesday, Mar 16, 21, 4:49 PM
```

```js
new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  weekday: "short",
  hour12: false,
}).format(new Date());
// '2021/3/16周二 16:53'
```

部分常用配置在中文语境下的效果如下。

#### `hour12`

是否采用 12 小时制，中文下默认为 `true`。

| `true`  | `false`    |
| ------- | ---------- |
| `16:59` | `下午4:59` |

#### `year`

年份，默认为 `numeric`。

| `numeric` | `2-digit` |
| --------- | --------- |
| `2021`    | `21`      |

#### `month`

月份，默认为 `numeric`。

| `numeric` | `2-digit` | `narrow`   | `short`      | `long`         |
| --------- | --------- | ---------- | ------------ | -------------- |
| `3`       | `03`      | `3月（M）` | `3月（Mar）` | `3月（March）` |

#### `day` `hour` `minute` `second`

分别为日期、小时、分钟、秒，其中日期默认为 `numeric`，其他默认不显示。

| `numeric` | `2-digit` |
| --------- | --------- |
| `3`       | `03`      |

在测试中发现，`minute` 和 `second` 两个始终为两位数字，不符合上面表格，原因有待研究。

#### `weekday`

星期，默认不显示。

| `narrow`  | `short`       | `long`              |
| --------- | ------------- | ------------------- |
| `二（T）` | `周二（Tue）` | `星期二（Tuesday）` |

> 更多用法可以参考 [Intl.DateTimeFormat - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) 。

### `Intl.RelativeTimeFormat`

用来计算相对日期，比如 X 分钟前、X 天前这种。

```js
const rtf = new Intl.RelativeTimeFormat("en-US", {
  numeric: "always",
  style: "long",
});

rtf.format(-1, "day");
// "1 day ago"

rtf.format(1, "day");
// "in 1 day"
```

这个方法同样可以添加配置，其中 `numeric` 代表是否使用数字，`style` 代表时间的格式，对中文来说没影响。

```js
new Intl.RelativeTimeFormat("zh-CN", {
  numeric: "always",
  style: "long",
}).format(-1, "day");
// '1天前'

new Intl.RelativeTimeFormat("zh-CN", {
  numeric: "auto",
  style: "long",
}).format(-1, "day");
// '昨天'
```

`format` 可用的单位有 `year` `quarter` `month` `week` `day` `hour` `minute` `second`。

```js
new Intl.RelativeTimeFormat("zh-CN", {
  numeric: "auto",
  style: "long",
}).format(0, "second");
// '现在'
```

> 更多用法可以参考 [Intl.RelativeTimeFormat - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) 以及 [Intl.RelativeTimeFormat.prototype.format() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/format) 。尽量看英文版的，中文版没更新，不全。

### `Intl.ListFormat`

用来格式化一个自然语言描述的列表，比如苹果、橘子和香蕉这种。

```js
new Intl.ListFormat("en-US").format(["Hello", "你好", "123456", "@@@"]);
// 'Hello, 你好, 123456, and @@@'

new Intl.ListFormat("zh-CN").format(["Hello", "你好", "123456", "@@@"]);
// 'Hello、你好、123456和@@@'
```

这个方法的 Option 分为 `style` 和 `type`，前者还是输出日期的格式，这里不再展示，后者代表列表的关系是“和”还是“或”。

```js
new Intl.ListFormat("zh-CN", { type: "disjunction" }).format([
  "Hello",
  "你好",
  "123456",
]);
// 'Hello、你好或123456'

new Intl.ListFormat("zh-CN", { type: "conjunction" }).format([
  "Hello",
  "你好",
  "123456",
]);
// 'Hello、你好和123456'
```

> 更多用法可以参考 [Intl.ListFormat - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat) 。

### `Intl.NumberFormat`

格式化数字相关的内容，比如货币、数字分隔符、单位等等。

```js
new Intl.NumberFormat("zh-CN").format(1234567890);
// '1,234,567,890'

new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec").format(1234567890);
// '一,二三四,五六七,八九〇'

new Intl.NumberFormat("en-US").format(1234567890);
// '1,234,567,890'

new Intl.NumberFormat("de-DE").format(1234567890);
// '1.234.567.890'
```

```js
new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
  123465.789
);
// '$123,465.79'

new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(
  123465.789
);
// '¥123,465.79'
```

> 更多用法可以参考 [Intl.NumberFormat - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) 。

### `Intl.PluralRules`

复数相关的格式化，比如 dog 和 dogs，由于中文不在乎复数，所以这节省略，用法可以参考 [Intl.PluralRules - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) 。

### `Intl.DisplayNames`

把某些字符转换成指定语言。

```js
new Intl.DisplayNames(["en"], { type: "region" }).of("JP");
// 'Japan'

new Intl.DisplayNames(["zh-CN"], { type: "region" }).of("JP");
// '日本'
```

> 更多用法可以参考 [Intl.DisplayNames() constructor - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames/DisplayNames) 。

## 参考文章

- [Intl - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [Getting to know the Intl API in JavaScript - DEV Community 👩‍💻👨‍💻](https://dev.to/bnevilleoneill/getting-to-know-the-intl-api-in-javascript-8pj)
- [www.iana.org/assignments/language-subtag-registry/language-subtag-registry](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)
