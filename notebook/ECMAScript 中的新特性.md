---
name: es-features
title: ECMAScript 中的新特性
create-date: 2021-01-04
date: 2021-01-09
descriptions:
    - 记录从 ES6 发布至今 ECMAScript 中出现的新特性，每年更新
    - 目前包含 ECMAScript 2016 ~ 2021 的部分新特性
tags:
    - ECMAScript
    - 年更
license: CC-BY-SA-4.0
---

# ECMAScript 中的新特性

📌 记录从 ES6 发布至今 ECMAScript 中出现的新特性，每年更新

💡 目前包含 ECMAScript 2016 ~ 2021 的部分新特性


## ES 2021

### `String.prototype.replaceAll`

替换字符串中所有匹配项。

```js
const newStr = str.replaceAll(regexp|substr, newSubstr)
```

`regexp|substr` 匹配的正则表达式（必须为全局模式，即 `/abc/g`）或者字符串。

`newSubstr` 用于替换的字符串。

`返回值` 替换后的字符串。

```js
'123456123'.replaceAll('123','000') === '000456000'
'abcdab'.replaceAll(/ab/g,'000') === '000cd000'
'abcdab'.replaceAll(/ef/g,'000') === 'abcdab'
```

在搜索的字符串为空的情况下，`replace` 和 `replaceAll` 的区别如下。

```js
'x'.replace('', '_');
// → '_x'
'xxx'.replace(/(?:)/g, '_');
// → '_x_x_x_'
'xxx'.replaceAll('', '_');
// → '_x_x_x_'
```

> 参考资料：
>
> - [tc39/proposal-string-replaceall: ECMAScript proposal: String.prototype.replaceAll](https://github.com/tc39/proposal-string-replaceall)
> - [String.prototype.replaceAll() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll)

### `Promise.any` 和 `AggregateError`

当传入的所有 Promise 中有一个成功时，就返回那个成功的 Promise，然后终止操作，不会等待其他 Promise。如果所有 Promise 都被拒绝，则会返回 `AggregateError`。

```js
Promise.any(iterable);
```

`iterable` 可迭代对象，比如 Array。

```js
try {
  const first = await Promise.any(promises);
  // Any of the promises was fulfilled.
} catch (error) {
  // All of the promises were rejected.
}
```

Or, without `async`/`await`:

```js
Promise.any(promises).then(
  (first) => {
    // Any of the promises was fulfilled.
  },
  (error) => {
    // All of the promises were rejected.
  }
);
```

下面有一个例子。

```js
Promise.any([
  fetch('https://v8.dev/').then(() => 'home'),
  fetch('https://v8.dev/blog').then(() => 'blog'),
  fetch('https://v8.dev/docs').then(() => 'docs')
]).then((first) => {
  // Any of the promises was fulfilled.
  console.log(first);
  // → 'home'
}).catch((error) => {
  // All of the promises were rejected.
  console.log(error);
});
```

> 参考资料：
>
> - [tc39/proposal-promise-any: ECMAScript proposal: Promise.any](https://github.com/tc39/proposal-promise-any)
> - [Promise.any() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

### 逻辑赋值符号 `||=`  `&&=`  `??=`

把逻辑运算符和赋值表达式结合起来。

```js
// "Or Or Equals" (or, the Mallet operator :wink:)
a ||= b;
a || (a = b);

// "And And Equals"
a &&= b;
a && (a = b);

// "QQ Equals"
a ??= b;
a ?? (a = b);
```

> 参考资料：[tc39/proposal-logical-assignment: A proposal to combine Logical Operators and Assignment Expressions](https://github.com/tc39/proposal-logical-assignment)

### 数字分隔符 `_`

就是英文里用于分隔很长的数字的 `,` 在这里以下划线 `_` 的形式出现。

```js
1_000_000_000           // Ah, so a billion
101_475_938.38          // And this is hundreds of millions

let fee = 123_00;       // $123 (12300 cents, apparently)
let fee = 12_300;       // $12,300 (woah, that fee!)
let amount = 12345_00;  // 12,345 (1234500 cents, apparently)
let amount = 123_4500;  // 123.45 (4-fixed financial)
let amount = 1_234_500; // 1,234,500
```

```js
0.000_001 // 1 millionth
1e10_000  // 10^10000 -- granted, far less useful / in-range...
```

更多用法可以看提案里的 [Examples](https://github.com/tc39/proposal-numeric-separator#examples)。

> 参考资料：[tc39/proposal-numeric-separator: A proposal to add numeric literal separators in JavaScript.](https://github.com/tc39/proposal-numeric-separator)

### WeakRefs

用于保留对一个对象的弱引用，不会阻止 GC（JavaScript 引擎的垃圾回收机制）。

下面的例子创建了一个计时器，计时器元素不存在时停止。

```js
class Counter {
  constructor(element) {
    // 记录一个弱引用到 DOM 元素
    this.ref = new WeakRef(element);
    this.start();
  }

  start() {
    if (this.timer) {
      return;
    }

    this.count = 0;

    const tick = () => {
      // 从弱引用中获取元素，如果存在就执行操作
      const element = this.ref.deref();
      if (element) {
        element.textContent = ++this.count;
      } else {
        // 元素不存在时
        console.log("The element is gone.");
        this.stop();
        this.ref = null;
      }
    };

    tick();
    this.timer = setInterval(tick, 1000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = 0;
    }
  }
}

const counter = new Counter(document.getElementById("counter"));
counter.start();
setTimeout(() => {
  document.getElementById("counter").remove();
}, 5000);
```

> 参考资料：
>
> - [tc39/proposal-weakrefs: WeakRefs](https://github.com/tc39/proposal-weakrefs)
> - [WeakRef - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakRef)

## ES 2020

### `String.prototype.matchAll`

匹配正则表达式，并返回结果的迭代器。

```js
str.matchAll(regexp)
```

`regexp` 要匹配的正则表达式，必须为 `g` 全局模式。

`返回值` 一个可迭代对象，不可重用，可以使用 `[...data]` 语法转换成数组。

```js
const regexp = /t(e)(st(\d?))/g;
const str = 'test1test2';

const array = [...str.matchAll(regexp)];

console.log(array[0]);
// expected output: Array ["test1", "e", "st1", "1"]

console.log(array[1]);
// expected output: Array ["test2", "e", "st2", "2"]
```

> 参考资料：
>
> - [tc39/proposal-string-matchall: ES Proposal, specs, tests, reference implementation, and polyfill/shim for String.prototype.matchAll](https://github.com/tc39/proposal-string-matchall)
> - [String.prototype.matchAll() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll)

### `BigInt`

在数字后面加字母 `n` 表示大整数。

ECMAScript 中 Number 类型的最大值为 `Number.MAX_SAFE_INTEGER === 2^53 - 1 `，即 9007199254740991，而 BigInt 可以表示任意大的整数。

```js
typeof 1n === 'bigint';		// true

const theBiggestInt = 9007199254740991n;

const alsoHuge = BigInt(9007199254740991);
// ↪ 9007199254740991n

const hugeButString = BigInt('9007199254740991');
// ↪ 9007199254740991n
```

BigInt 可以使用 `+`  `*`  `-`  `**` 和 `%` 符号，但符号两边必须都是 BigInt 类型，否则会报错。

```js
const previousMaxSafe = BigInt(Number.MAX_SAFE_INTEGER);
// ↪ 9007199254740991

const maxPlusOne = previousMaxSafe + 1n;
// ↪ 9007199254740992n
 
const theFuture = previousMaxSafe + 2n;
// ↪ 9007199254740993n, this works now!

const multi = previousMaxSafe * 2n;
// ↪ 18014398509481982n

const subtr = multi – 10n;
// ↪ 18014398509481972n

const mod = multi % 10n;
// ↪ 2n

const bigN = 2n ** 54n;
// ↪ 18014398509481984n

bigN * -1n
// ↪ –18014398509481984n
```

```js
1n + 2
// ↪ TypeError: Cannot mix BigInt and other types, use explicit conversions

1n * 2
// ↪ TypeError: Cannot mix BigInt and other types, use explicit conversions
```

除号 `/` 会向零取整。

```js
const expected = 4n / 2n;
// ↪ 2n

const rounded = 5n / 2n;
// ↪ 2n, not 2.5n
```

BigInt 在比较的时候不严格等于 Number，两者可以比较大小，也可以混合排序。

```js
0n === 0	// ↪ false
0n == 0		// ↪ true

1n < 2		// ↪ true
2n > 1		// ↪ true
2 > 2		// ↪ false
2n > 2		// ↪ false
2n >= 2		// ↪ true

const mixed = [4n, 6, -12n, 10, 4, 0, 0n];
// ↪  [4n, 6, -12n, 10, 4, 0, 0n]

mixed.sort();
// ↪ [-12n, 0, 0n, 10, 4n, 4, 6]
```

BigInt 在转换成 Boolean 的情况下的行为类似 Number。

```js
if (0n) {
  console.log('Hello from the if!');
} else {
  console.log('Hello from the else!');
}

// ↪ "Hello from the else!"

0n || 12n		// ↪ 12n
0n && 12n		// ↪ 0n

Boolean(0n)		// ↪ false
Boolean(12n)	// ↪ true

!12n			// ↪ false
!0n				// ↪ true
```

BigInt 需要使用 `Number()` 手动转换类型到 Number，不能使用隐形类型转换。

```js
+1n
// ↪ TypeError: Cannot convert a BigInt value to a number

Number(1n)
// ↪ 1
```

不过字符串没这个限制。

```js
1n + '2'
// ↪ "12"

'2' + 1n
// ↪ "21"
```

试图把 BigInt 直接转换成 Number 可能会造成精度丢失。

```js
const largeFriend = 900719925474099267n;
const alsoLarge = largeFriend + 2n;

const sendMeTheBiggest = (n, m) => Math.max(Number(n), Number(m));

sendMeTheBiggest(largeFriend, alsoLarge)
// ↪900719925474099300  // This is neither argument!
```

```js
Number(151851850485185185047n)
// ↪ 151851850485185200000

parseInt(900719925474099267n)
// ↪900719925474099300
```

可以使用 `BigInt(number|string)` 来生成一个大整数，不过同样需要注意精度的问题，传入的如果是 Number，则要小心不要超出范围，建议直接传入字符串作为参数或者直接数字后面加 `n`。

```js
const badPrecision = BigInt(9007199254740993);
// ↪9007199254740992n

const goodPrecision = BigInt('9007199254740993');
// ↪9007199254740993n

const alsoGoodPrecision = 9007199254740993n;
// ↪9007199254740993n
```

`BigInt()` 的参数不能是小数，字符串表示的小数也不行。

```js
BigInt(1.5)
// ↪ RangeError: The number 1.5 is not a safe integer and thus cannot be converted to a BigInt

BigInt('1.5')
// ↪ SyntaxError: Cannot convert 1.5 to a BigInt
```

BigInt 不能使用 `Math` 中的方法。

```js
Math.round(1n)
// ↪ TypeError: Cannot convert a BigInt value to a number

Math.max(1n, 10n)
// ↪ TypeError: Cannot convert a BigInt value to a number

1n|0
// ↪ TypeError: Cannot mix BigInt and other types, use explicit conversions
```

还有一点需要注意的是，`JSON.stringify` 不能序列化 BigInt。

```js
const bigObj = {a: BigInt(10n)};
JSON.stringify(bigObj)
// ↪TypeError: Do not know how to serialize a BigInt
```

> 参考资料：
>
> - [tc39/proposal-bigint: Arbitrary precision integers in JavaScript](https://github.com/tc39/proposal-bigint)
> - [BigInt - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

### `for-in` 

遍历对象中的可枚举属性。

```js
var obj = {a:1, b:2, c:3};

for (var prop in obj) {
  console.log("obj." + prop + " = " + obj[prop]);
}

// Output:
// "obj.a = 1"
// "obj.b = 2"
// "obj.c = 3"
```

> 参考资料：[for...in - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in)

### 空值合并运算符 `??`

当左侧为 `undefined` 或者 `null` 时，返回右侧值。

主要用来解决 `||` 操作符将 `''`  `0`  `false` 判断为假的情况，`??` 会把以上这些判断为真，并返回右侧的值。

```js
const response = {
  settings: {
    nullValue: null,
    height: 400,
    animationDuration: 0,
    headerText: '',
    showSplashScreen: false
  }
};

const undefinedValue = response.settings.undefinedValue ?? 'some other default'; 
// result: 'some other default'

const nullValue = response.settings.nullValue ?? 'some other default'; 
// result: 'some other default'

const headerText = response.settings.headerText ?? 'Hello, world!'; 
// result: ''

const animationDuration = response.settings.animationDuration ?? 300; 
// result: 0

const showSplashScreen = response.settings.showSplashScreen ?? true; 
// result: false
```

需要注意的是，`??` 在没有明确优先级的情况下，不能与 `&&` 和 `||` 并列使用。

```js
null || undefined ?? "foo"; // 抛出 SyntaxError
true || undefined ?? "foo"; // 抛出 SyntaxError

(null || undefined ) ?? "foo"; // 返回 "foo"
```

> 参考资料：
>
> - [tc39/proposal-nullish-coalescing: Nullish coalescing proposal x ?? y](https://github.com/tc39/proposal-nullish-coalescing)
> - [空值合并运算符 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)

### 可选链操作符 `?.`

如果操作符左侧为 `undefined` 或者 `null` 则表达式为 `undefined`，否则正常执行操作符右侧的属性、方法和函数调用。

```js
obj?.prop       // 调用可选的静态属性
obj?.[expr]     // 调用可选的动态属性
func?.(...args) // 调用可选的函数或者方法
arr?.[index]	// 调用可能的数组项
```

这其实是一种简化的写法，请看下面的例子。

```js
a?.b    // 如果 a 是 null/undefined 则返回 undefined 否则返回 a.b
a == null ? undefined : a.b

a?.[x]  // 如果 a 是 null/undefined 则返回 undefined 否则返回 a[x]
a == null ? undefined : a[x]

a?.b()  // 如果 a 是 null/undefined 则返回 undefined
a == null ? undefined : a.b() 
// 如果 a.b 不是函数，则抛出 TypeError
// 否则执行 a.b()

a?.()   // 如果 a 是 null/undefined 则返回 undefined
a == null ? undefined : a()  
// 如果 a 不是 null/undefined 也不是函数，则抛出 TypeError
// 否则调用函数 a
```

更多用例可以查看提案中的 [Semantics](https://github.com/tc39/proposal-optional-chaining#semantics) 部分以及 MDN 中的 [例子](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/%E5%8F%AF%E9%80%89%E9%93%BE#%E4%BE%8B%E5%AD%90) 。

> 参考资料：
>
> - [tc39/proposal-optional-chaining](https://github.com/tc39/proposal-optional-chaining)
> - [可选链操作符 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/%E5%8F%AF%E9%80%89%E9%93%BE)

### `Promise.allSettled`

所有 Promise 都完成时（无论是 `fulfilled` 还是 `reject`），返回结果的数组。

```js
const promises = [ 
    fetch('https://lifeni.life'), 
    fetch('https://does-not-exist/') 
];

const results = await Promise.allSettled(promises);
const errors = results
  .filter(p => p.status === 'rejected')
  .map(p => p.reason);

console.log(JSON.stringify(results));

/** output
[
  {
    "status":"fulfilled",
    "value":{...}
  },
  {
    "status":"rejected",
    "reason":{...}
  }
]
*/
```

> 参考资料：
>
> - [tc39/proposal-promise-allSettled: ECMAScript Proposal, specs, and reference implementation for Promise.allSettled](https://github.com/tc39/proposal-promise-allSettled)
> - [Promise.allSettled() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

### `import()`

也就是动态导入，返回一个 Promise。

```html
<!DOCTYPE html>
<nav>
  <a href="books.html" data-entry-module="books">Books</a>
  <a href="movies.html" data-entry-module="movies">Movies</a>
  <a href="video-games.html" data-entry-module="video-games">Video Games</a>
</nav>

<main>Content will load here!</main>

<script>
  const main = document.querySelector("main");
  for (const link of document.querySelectorAll("nav > a")) {
    link.addEventListener("click", e => {
      e.preventDefault();

      import(`./section-modules/${link.dataset.entryModule}.js`)
        .then(module => {
          module.loadPageInto(main);
        })
        .catch(err => {
          main.textContent = err.message;
        });
    });
  }
</script>
```

> 参考资料：
>
> - [tc39/proposal-dynamic-import: import() proposal for JavaScript](https://github.com/tc39/proposal-dynamic-import)
> - [import - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)

### `import.meta`

获取模块的元数据。

```html
<script type="module" src="my-module.mjs"></script>
```

```js
console.log(import.meta); // { url: "file:///home/user/my-module.mjs" }
```

下面是一个例子。

```html
<script type="module" src="path/to/hamster-displayer.mjs" data-size="500"></script>
```

```js
(async () => {
  // new URL() 的第二个参数是相对地址（baseUrl）
  const response = await fetch(new URL("../hamsters.jpg", import.meta.url));
  const blob = await response.blob();

  const size = import.meta.scriptElement.dataset.size || 300;

  const image = new Image();
  image.src = URL.createObjectURL(blob);
  image.width = image.height = size;

  document.body.appendChild(image);
})();
```

> 参考资料：
>
> - [tc39/proposal-import-meta: import.meta proposal for JavaScript](https://github.com/tc39/proposal-import-meta)
> - [import.meta - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import.meta)

### `globalThis`

在不同的运行环境下，获取全局对象的方式不同。

> 在以前，从不同的 JavaScript 环境中获取全局对象需要不同的语句。在 Web 中，可以通过 `window`、`self` 或者 `frames` 取到全局对象，但是在 [Web Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker) 中，只有 `self` 可以。在 Node.js 中，它们都无法获取，必须使用 `global`。

```js
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};

var globals = getGlobal();

if (typeof globals.setTimeout !== 'function') {
  // 此环境中没有 setTimeout 方法！
}
```

因此为了简化代码，可以使用 `globalThis` 来调用全局对象。

```js
if (typeof globalThis.setTimeout !== 'function') {
  //  此环境中没有 setTimeout 方法！
}
```

> 参考资料：
>
> - [tc39/proposal-global: ECMAScript Proposal, specs, and reference implementation for global](https://github.com/tc39/proposal-global)
> - [globalThis - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis)

## ES 2019

// TODO

###  `Object.fromEntries`

相当于 `Object.entries` 的反向操作，生成一个对象。

```js
obj = Object.fromEntries([['a', 0], ['b', 1]]); // { a: 0, b: 1 }
```

可以将 Map 或者 Array 转化为 Object。

```js
const map = new Map([ ['foo', 'bar'], ['baz', 42] ]);
const obj = Object.fromEntries(map);
console.log(obj); // { foo: "bar", baz: 42 }
```

```js
const arr = [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ];
const obj = Object.fromEntries(arr);
console.log(obj); // { 0: "a", 1: "b", 2: "c" }
```

如果键或者值不是字符串，则可能会出现意料之外的结果。

```js
const map = new Map([
  [{}, 'a'],
  [{}, 'b'],
]);
Object.fromEntries(map);
// → { '[object Object]': 'b' }
// Note: the value 'a' is nowhere to be found, since both keys
// stringify to the same value of '[object Object]'.
```

> 参考资料：
>
> - [tc39/proposal-object-from-entries: TC39 proposal for Object.fromEntries](https://github.com/tc39/proposal-object-from-entries)
> - [Object.fromEntries() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)
> - [【译】关于Object.fromEntries](https://juejin.cn/post/6844903877301665799#heading-3)

### `String.prototype.{trimStart,trimEnd}`

删除字符串中 开头/结尾 的连续空白符，也可以使用别名 `String.prototype.{trimLeft,trimRight}`。

```js
var str = "   foo  ";

console.log(str.length); // 8

str = str.trimStart()    // 等同于 str = str.trimLeft();
console.log(str.length); // 5
console.log(str);        // "foo  "

str = str.trimRight();  // 或写成str = str.trimEnd();
console.log(str.length); // 6
console.log(str);       // '   foo'
```

> 参考资料：
>
> - [String.prototype.trimStart() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/TrimLeft)
> - [String.prototype.trimRight() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/TrimRight)

### `Array.prototype.{flat,flatMap}`

`Array.prototype.flat` 用来把一个嵌套的数组展开成一个一维的数组。

```js
var newArray = arr.flat([depth]);
```

`depth` 展开的深度，默认为 1。

```js
var arr1 = [1, 2, [3, 4]];
arr1.flat();
// [1, 2, 3, 4]

var arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]

var arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]

// flat 会去除空元素
var arr4 = [1, 2, , 4, 5];
arr4.flat();
// [1, 2, 4, 5]
```

`Array.prototype.flatMap` 相当于把 `map()` 的结果进行 `flat()`，展开深度为 1。

```js
var arr1 = [1, 2, 3, 4];

arr1.map(x => [x * 2]);
// [[2], [4], [6], [8]]

arr1.flatMap(x => [x * 2]);
// [2, 4, 6, 8]

// 只会展开一层
arr1.flatMap(x => [[x * 2]]);
// [[2], [4], [6], [8]]
```

> 参考资料：
>
> - [Array.prototype.flat() - JavaScript | MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)
> - [Array.prototype.flatMap() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)

### `Function.prototype.toString`

把函数的源码转换成字符串，建议直接看 MDN 上的 [示例](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/toString#%E7%A4%BA%E4%BE%8B)，很详细。

> 参考资料：[Function.prototype.toString() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/toString)

### `Symbol.prototype.description`

返回 `Symbol` 的描述。

```js
Symbol('desc').toString();   // "Symbol(desc)"
Symbol('desc').description;  // "desc"
Symbol('').description;      // ""
Symbol().description;        // undefined

// well-known symbols
Symbol.iterator.toString();  // "Symbol(Symbol.iterator)"
Symbol.iterator.description; // "Symbol.iterator"

// global symbols
Symbol.for('foo').toString();  // "Symbol(foo)"
Symbol.for('foo').description; // "foo"
```

> 参考资料：[Symbol.prototype.description - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/description)

### 可选的 `catch` 绑定

如果不需要 `catch` 中的 Error 绑定，则可以省略。

```js
// 原来的写法，不需要 Error，但仍然要绑定变量到 Error
try {
  // 尝试使用可能不被支持的 Web 特性
} catch (unused) {
  // 退回到被广泛支持的 Web 特性
}
```

```js
// 现在的写法
try {
  // ...
} catch {
  // ...
}
```

> 参考资料：[tc39/proposal-optional-catch-binding: proposal for ECMAScript to allow omission of the catch binding](https://github.com/tc39/proposal-optional-catch-binding)

### 将 ECMAScript 语法拓展为 JSON 的超集

由于 JSON 中的字符串可以包含非转义的 U+2028 行分隔符 和 U+2029 段分隔符，而 ECMAScript 2018 及之前的字符串中不包含，所以在使用 `JSON.parse` 时会出现 `SyntaxError`。

```js
// A raw U+2029 character, produced by eval:
const PS = eval('"\u2029"');
// ES 2018: SyntaxError
// ES 2019: ok!
```

> 参考资料：
>
> - [tc39/proposal-json-superset: Proposal to make all JSON text valid ECMA-262](https://github.com/tc39/proposal-json-superset)
> - [Subsume JSON and Well-formed JSON.stringify | by Kesk -*- | JavaScript In Plain English | Medium](https://medium.com/javascript-in-plain-english/subsume-json-and-well-formed-json-stringify-323f70c9dc36)

### 格式正确的 `JSON.stringify`

JSON 规定使用 UTF-8 进行编码，但是对于一些编码，`JSON.stringify` 可能会出现解析失败的问题（这个地方看文档不太明白，啥 UTF-16 什么的）。所以提案对这种情况采取转义 Unicode 的方式。

```js
// Non-BMP characters still serialize to surrogate pairs.
JSON.stringify('𝌆')
// → '"𝌆"'
JSON.stringify('\uD834\uDF06')
// → '"𝌆"'

// Unpaired surrogate code units will serialize to escape sequences.
JSON.stringify('\uDF06\uD834')
// → '"\\udf06\\ud834"'
JSON.stringify('\uDEAD')
// → '"\\udead"'
```

> 参考资料：
>
> - [tc39/proposal-well-formed-stringify: Proposal to prevent JSON.stringify from returning ill-formed strings](https://github.com/tc39/proposal-well-formed-stringify)
> - [Subsume JSON and Well-formed JSON.stringify | by Kesk -*- | JavaScript In Plain English | Medium](https://medium.com/javascript-in-plain-english/subsume-json-and-well-formed-json-stringify-323f70c9dc36)

## ES 2018

### 异步迭代

这里只介绍 `for-await-of` 的用法，其他比如 `generator` 等内容可以查看下面的参考资料。

```js
// 创建一个可迭代的异步对象
var asyncIterable = {
  [Symbol.asyncIterator]() {
    return {
      i: 0,
      next() {
        if (this.i < 3) {
          return Promise.resolve({ value: this.i++, done: false });
        }

        return Promise.resolve({ done: true });
      }
    };
  }
};

// 然后可以使用 for await of 遍历这个对象
(async function() {
   for await (num of asyncIterable) {
     console.log(num);
   }
})();

// 0
// 1
// 2
```

> 参考资料：
>
> - [tc39/proposal-async-iteration: Asynchronous iteration for JavaScript](https://github.com/tc39/proposal-async-iteration)
> - [for await...of - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for-await...of)
> - [异步迭代和 generator](https://zh.javascript.info/async-iterators-generators)

### 对象属性的 `Spread` 和 `Rest` 语法

把 ES 6 里的 `...` 语法拓展到了对象的属性上。

```js
// 把剩余的属性赋值给 z
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x; // 1
y; // 2
z; // { a: 3, b: 4 }
```

```js
// 展开 z 中的属性
let n = { x, y, ...z };
n; // { x: 1, y: 2, a: 3, b: 4 }
```

> 参考资料：
>
> - [tc39/proposal-object-rest-spread: Rest/Spread Properties for ECMAScript](https://github.com/tc39/proposal-object-rest-spread)
> - [展开语法 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
> - [剩余参数 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters)

### `Promise.prototype.finally`

无论 Promise 的结果如何，都会执行回调函数。

```js
let isLoading = true;

fetch(myRequest).then(function(response) {
    var contentType = response.headers.get("content-type");
    if(contentType && contentType.includes("application/json")) {
      return response.json();
    }
    throw new TypeError("Oops, we haven't got JSON!");
  })
  .then(function(json) { /* process your JSON further */ })
  .catch(function(error) { console.log(error); })
  .finally(function() { isLoading = false; });
```

> 参考资料：
>
> - [tc39/proposal-promise-finally: ECMAScript Proposal, specs, and reference implementation for Promise.prototype.finally](https://github.com/tc39/proposal-promise-finally)
> - [Promise.prototype.finally() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)

### 模板字符串的修订

> 带标签的模版字符串应该允许嵌套支持常见转义序列的语言（例如 [DSLs](https://en.wikipedia.org/wiki/Domain-specific_language)、[LaTeX](https://en.wikipedia.org/wiki/LaTeX)）。ECMAScript 提议[模版字面量修订](https://tc39.github.io/proposal-template-literal-revision/)（第 4 阶段，将要集成到 ECMAScript 2018 标准）移除对 ECMAScript 在带标签的模版字符串中转义序列的语法限制。

```js
function latex(str) {
 return { "cooked": str[0], "raw": str.raw[0] }
}

latex`\unicode`
// 非法转义序列变成了 undefined
// { cooked: undefined, raw: "\\unicode" }

// 不带标签的没事
let bad = `bad escape sequence: \unicode`;
```

> 参考资料：[模板字符串 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings)

### 正则标识 `s`

在正则表达式后添加标识 `s` 可以使得 `.` 匹配任意字符，包含行终止符 `\n`，用来代替 `[^]` 这个写法。

```js
// ES 2017 -

/foo.bar/.test('foo\nbar');
// → false

/foo[^]bar/.test('foo\nbar');
// → true
```

```js
// ES 2018 +

/foo.bar/s.test('foo\nbar');
// → true
```

> 参考资料：[tc39/proposal-regexp-dotall-flag: Proposal to add the s (dotAll) flag to regular expressions in ECMAScript.](https://github.com/tc39/proposal-regexp-dotall-flag)

### 正则反向断言

肯定的反向断言使用 `(?<=...)` 的格式。

```js
const reLookbehind = /(?<=\$)\d+(\.\d*)?/;
const match1        = reLookbehind.exec('$123.89');
const match2        = reLookbehind.exec('€123.89');

console.log( match1[0] );   // 123.89
console.log( match2 );      // null
```

否定的反向断言使用 `(?<!...)` 的格式。

```js
const reLookbehind = /(?<!\$)\d+(?:\.\d*)/;
const match1        = reLookbehind.exec('$10.53');
const match2        = reLookbehind.exec('€10.53');

console.log( match1[0] );   // 0.53
console.log( match2[0] );   // 10.53
```

> 参考资料：[tc39/proposal-regexp-lookbehind: RegExp lookbehind assertions](https://github.com/tc39/proposal-regexp-lookbehind)

### 正则命名组

在正则表达式中使用 `?<name>` 的形式可以给一个匹配组进行命名。

```js
let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;
let result = re.exec('2015-01-02');
// result.groups.year === '2015';
// result.groups.month === '01';
// result.groups.day === '02';

// result[0] === '2015-01-02';
// result[1] === '2015';
// result[2] === '01';
// result[3] === '02';
```

也可以使用解构简化代码。

```js
let { groups: {one, two} } = /^(?<one>.*):(?<two>.*)$/u.exec('foo:bar');
console.log(`one: ${one}, two: ${two}`);  // prints one: foo, two: bar
```

> 参考资料：[tc39/proposal-regexp-named-groups: Named capture groups for JavaScript RegExps](https://github.com/tc39/proposal-regexp-named-groups)

### 正则 Unicode 转义

在正则表达式中使用 `\p{…}` 和 `\P{…}` 的格式来转义 Unicode。

```js
// GreekSymbol 是希腊符号的意思

const regexGreekSymbol = /\p{Script=Greek}/u;
regexGreekSymbol.test('π');
// → true
```

> 参考资料：[tc39/proposal-regexp-unicode-property-escapes: Proposal to add Unicode property escapes \p{…} and \P{…} to regular expressions in ECMAScript.](https://github.com/tc39/proposal-regexp-unicode-property-escapes)

## ES 2017

### 异步函数

使用 `async` 定义一个返回 Promise 的函数，函数内可以使用 `await`。

```js
async function name([param[, param[, ... param]]]) {
   statements
}
```

更多资料可以去 Google 的 [文档](https://developers.google.com/web/fundamentals/primers/async-functions) 看看。

> 参考资料：
>
> - [async function - JavaScript | MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/async_function)
> - [异步函数 - 提高 Promise 的易用性  |  Web  |  Google Developers](https://developers.google.com/web/fundamentals/primers/async-functions)

### `Object.{values,entries}` 

`Object.values`  返回一个对象所有可枚举的 **属性值** 的数组。

`Object.entries` 返回一个对象所有可枚举的 **键值对** 组成的数组。

```js
var obj = { foo: 'bar', baz: 42 };
Object.values(obj);     // ['bar', 42]
Object.entries(obj);    // [ ['foo', 'bar'], ['baz', 42] ]

// 类似数组的对象
var obj = { 0: 'a', 1: 'b', 2: 'c' };
Object.values(obj);     // ['a', 'b', 'c']
Object.entries(obj);    // [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]

// 乱序的类似数组的对象
// 当使用数字作为键时，值将会按照键的数字顺序返回
var an_obj = { 100: 'a', 2: 'b', 7: 'c' };
Object.values(an_obj);  // ['b', 'c', 'a']
Object.entries(an_obj);  // [ ['2', 'b'], ['7', 'c'], ['100', 'a'] ]

// getFoo 是一个不可枚举的属性
var my_obj = Object.create({}, { 
    getFoo: { value: function() { return this.foo; } } 
});
my_obj.foo = 'bar';
Object.values(my_obj);  // ['bar']
Object.entries(my_obj); // [ ['foo', 'bar'] 

// 非对象的参数将会强制转换成对象
Object.values('foo');   // ['f', 'o', 'o']
Object.entries('foo');  // [ ['0', 'f'], ['1', 'o'], ['2', 'o'] ]
```

`Object.entries` 还有很多用法。

```js
// 优雅地遍历 key-value
const obj = { a: 5, b: 7, c: 9 };
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
}

// 或者使用数组遍历对象
Object.entries(obj).forEach(([key, value]) => {
console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
});

// 将 Object 转换成 Map
var obj = { foo: "bar", baz: 42 };
var map = new Map(Object.entries(obj));
console.log(map); // Map { foo: "bar", baz: 42 }
```

> 参考资料：
>
> - [tc39/proposal-object-values-entries: ECMAScript Proposal, specs, and reference implementation for Object.values/Object.entries](https://github.com/tc39/proposal-object-values-entries)
> - [Object.values() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values)
> - [Object.entries() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)

### `String.prototype.{padStart,padEnd}`

用于 从头/从尾 部填充字符串到指定长度。

```js
str.padStart(targetLength [, padString])
```

`targetLength` 要填充到的长度，如果小于当前字符串的长度，则返回当前字符串。

`padString` 要填充的字符串，超出的部分会被截断。默认填充空格 ` ` 。

```js
'abc'.padStart(10);         // "       abc"
'abc'.padStart(10, "foo");  // "foofoofabc"
'abc'.padStart(6,"123465"); // "123abc"
'abc'.padStart(8, "0");     // "00000abc"
'abc'.padStart(1);          // "abc"
```

`String.prototype.padEnd` 同理。

```js
'abc'.padEnd(10);          // "abc       "
'abc'.padEnd(10, "foo");   // "abcfoofoof"
'abc'.padEnd(6, "123456"); // "abc123"
'abc'.padEnd(1);           // "abc"
```

> 参考资料：
>
> - [tc39/proposal-string-pad-start-end: ECMAScript spec proposal for String.prototype.{padStart,padEnd}](https://github.com/tc39/proposal-string-pad-start-end)
> - [String.prototype.padStart() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)
> - [String.prototype.padEnd() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd)

### 允许在函数参数中添加末尾逗号

如果函数有很多参数，那么经过格式化之后，参数会垂直排列。如果要添加一个参数，那么在代码管理软件（例如 Git）看来，实际上修改了两行：上一个参数后添加逗号、新的参数。

```js
function clownPuppiesEverywhere(
  param1,
  param2, // updated to add a comma
  param3  // updated to add new parameter
) { /* ... */ }

clownPuppiesEverywhere(
  'foo',
  'bar', // updated to add a comma
  'baz'  // updated to add new parameter
);
```

但是如果允许默认情况下在最后一个参数后加上逗号，那么未来添加新的参数时，要修改的代码就只有一行。

```js
function clownPuppiesEverywhere(
  param1,
  param2, // 添加下一个参数时只会修改下面这一行，而不会修改这一行
) { /* ... */ }

clownPuppiesEverywhere(
  'foo',
  'bar', // 添加下一个参数时只会修改下面这一行，而不会修改这一行
);

// 这样也是可以的
obj(1, 2, 3,)
```

其实不止函数的参数可以这样做，数组、对象的末尾逗号也是可以的，并且在 ECMAScript 5 中就已经得到了支持。但是在 JSON 中是不行的。

> 参考资料：
>
> - [tc39/proposal-trailing-function-commas](https://github.com/tc39/proposal-trailing-function-commas)
> - [尾后逗号 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Trailing_commas)

### `Object.getOwnPropertyDescriptors`

返回指定对象的所有自身属性的描述符。

```js
Object.getOwnPropertyDescriptors(Date)

/** output
UTC: {writable: true, enumerable: false, configurable: true, value: ƒ}
length: {value: 7, writable: false, enumerable: false, configurable: true}
name: {value: "Date", writable: false, enumerable: false, configurable: true}
now: {writable: true, enumerable: false, configurable: true, value: ƒ}
parse: {writable: true, enumerable: false, configurable: true, value: ƒ}
prototype: {value: {…}, writable: false, enumerable: false, configurable: false}
__proto__: Object
*/
```

可以用来进行浅拷贝。

```js
Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
);
```

> 参考资料：
>
> - [tc39/proposal-object-getownpropertydescriptors: ECMAScript proposal for Object.getOwnPropertyDescriptors](https://github.com/tc39/proposal-object-getownpropertydescriptors)
> - [Object.getOwnPropertyDescriptors() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors)

### 共享内存和 `Atomics` 

这里的共享内存指的是 `SharedArrayBuffer` 对象，用于 Web Worker 和主线程之间内存的共享。

关于 `SharedArrayBuffer` 和 `Atomics` 的更多信息可以查看下面的参考资料。

> 参考资料：
>
> - [tc39/ecmascript_sharedmem: Shared memory and atomics for ECMAscript](https://github.com/tc39/ecmascript_sharedmem)
> - [ecmascript_sharedmem/TUTORIAL.md at master · tc39/ecmascript_sharedmem](https://github.com/tc39/ecmascript_sharedmem/blob/master/TUTORIAL.md)
> - [SharedArrayBuffer - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
> - [Atomics - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Atomics)

## ES 2016

### `Array.prototype.includes`

用于判断数组中是否包含某个值。

```js
arr.includes(value[, fromIndex])
```

`value` 要查找的值。

`fromIndex` 开始查找的位置，默认为 0。

`返回值` Boolean。

```js
[1, 2, 3].includes(2) === true;
[1, 2, 3].includes(4) === false;

[1, 2, NaN].includes(NaN) === true;

[1, 2, -0].includes(+0) === true;
[1, 2, +0].includes(-0) === true;

["a", "b", "c"].includes("a") === true;
["a", "b", "c"].includes("a", 1) === false;
```

`String.prototype.includes` 与这个方法类似。

> 参考资料：
>
> - [tc39/proposal-Array.prototype.includes: Spec, tests, reference implementation, and docs for ESnext-track Array.prototype.includes](https://github.com/tc39/proposal-Array.prototype.includes)
> - [Array.prototype.includes() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
> - [String.prototype.includes() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/includes)

### 指数运算符 `x ** y`

表示 x 的 y 次方，相当于 `Math.pow(x, y)`。

```js
// x ** y

let cubed = 2 ** 3;
// 相当于 2 * 2 * 2
```
```js
// x **= y

let a = 2;
a **= 2;
// 相当于 a = a * a;
```

> 参考资料：[tc39/proposal-exponentiation-operator: Progress tracking for ES7 exponentiation operator](https://github.com/tc39/proposal-exponentiation-operator)

## 其他参考资料

- 所有进入标准的提案汇总：[proposals/finished-proposals.md at master · tc39/proposals](https://github.com/tc39/proposals/blob/master/finished-proposals.md)
- MDN 上的文档：[JavaScript 参考 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference)
- ECMAScript 2021 标准：[ECMAScript® 2021 Language Specification](https://tc39.es/ecma262/)

