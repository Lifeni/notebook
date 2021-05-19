---
name: learn-javascript
title: 学习 JavaScript
create-date: 2020-02-24
date: 2020-05-05
description: |
  记录学习 JavaScript 的笔记和常见问题，不定期更新，文章部分举例来自 MDN 及 [ECMAScript 6 入门](https://es6.ruanyifeng.com/) 。
tags:
  - JavaScript
license: CC-BY-SA-4.0
---

# 学习 JavaScript

## `for...in` `for...of` 的区别

`for...in` 在遍历对象时取出的 i 指向对象的 key，遍历数组时则指向数组的索引。

```js
let obj = { a: 1, b: 2, c: 5 };
let arr = [1, 5, 4];
for (let i in obj) {
  console.log(`${i} - ${obj[i]}`);
}
console.log('---');
for (let i in arr) {
  console.log(`${i} - ${arr[i]}`);
}
```

```
输出：
a - 1
b - 2
c - 5
---
0 - 1
1 - 5
2 - 4
```

`for...of` 无法遍历普通对象，提示 `oj is not iterable`，而在遍历数组时，会把数组的值当作取出的 i。

```js
let arr = [1, 5, 4];
for (let i of arr) {
  console.log(`${i} - ${arr[i]}`);
}
```

```
输出：
1 - 5
5 - undefined
4 - undefined
```

## 数组的拓展运算符 `...`

作用是将一个数组变成参数序列。简单地说，将 `...` 之后数组中的元素依次取出来。

```js
let arr = [1, 4, 7, 8, 5];
console.log(...arr);
console.log([...arr]);
console.log([...arr].constructor);
```

```
输出：
1 4 7 8 5
[ 1, 4, 7, 8, 5 ]
[Function: Array]
```

下面有几个例子：

```js
function add(...values) {
  let sum = 0;
  for (var val of values) {
    sum += val;
  }
  return sum;
}
add(2, 5, 3); // 10
```

```js
function push(array, ...items) {
  items.forEach(function (item) {
    array.push(item);
    console.log(item);
  });
}
var a = [];
push(a, 1, 2, 3);
```

## 使用正则表达式

在 ES6 中，使用 `new RegExp()` 创建正则表达式。

```js
// 以下四种方式等价：
let re = new RegExp(/xyz/i);
let re = new RegExp(/xyz/, 'i');
let re = new RegExp('xyz', 'i');
let re = /xyz/i;
```

待补充。

## 异步处理

这里只整理异步处理的简单用法，语法细节请参考其他资料。

### Promise 对象

Promise 是回调地狱的解决方案之一，下面的例子来自 MDN：

```js
chooseToppings(function (toppings) {
  placeOrder(
    toppings,
    function (order) {
      collectOrder(
        order,
        function (pizza) {
          eatPizza(pizza);
        },
        failureCallback
      );
    },
    failureCallback
  );
}, failureCallback);
```

这个代码改写成 Promise 的形式：

```js
chooseToppings()
  .then(toppings => placeOrder(toppings))
  .then(order => collectOrder(order))
  .then(pizza => eatPizza(pizza))
  .catch(failureCallback)
  .finally(something);
```

下面介绍如何创建 Promise：

看下面的例子，一个函数新建并返回了一个 Promise 对象，其构造函数返回两个参数（函数），其中 `resolve()` 代表异步操作完成，它会把参数传递给 `.then()` 里面的函数，而 `reject()` 代表异步操作失败，它会把参数传递给后面 `.catch()` 里的函数，像第二段代码那样。

```js
function timeoutPromise(message, interval) {
  return new Promise((resolve, reject) => {
    if (message === '' || typeof message !== 'string') {
      reject('Message is empty or not a string');
    } else if (interval < 0 || typeof interval !== 'number') {
      reject('Interval is negative or not a number');
    } else {
      setTimeout(function () {
        resolve(message);
      }, interval);
    }
  });
}
```

```js
timeoutPromise('Hello there!', 1000)
  .then(message => {
    alert(message);
  })
  .catch(e => {
    console.log('Error: ' + e);
  });
```

这个 `timeoutPromise()` 函数传入字符串和数值，如果这两个值都合法，会在数值对应的时间之后弹出提示框，否则会抛出错误。

### Generator 函数

并不常用，这里不再介绍，详见 [Generator 函数的语法 - ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/generator)。

`async` 和 `await` 是它的语法糖，可以直接看下面的部分。

### `async` 和 `await`

把 `async` 加在一个函数前可以将其变成 `async function`，它的返回值将变成 Promise：

```js
async function hello() {
  return 'Hello';
}
console.log(hello()); // Promise { 'Hello' }
hello().then(value => console.log(value)); // Hello
hello().then(console.log); // Hello
```

`await` 可以加在 `async` 声明的函数之前，只有当函数返回 Promise 完成时，代码才会继续执行。下面是一个 Promise 的例子，可以把它改成正常的写法：

```js
fetch('coffee.jpg')
  .then(response => response.blob())
  .then(myBlob => {
    let objectURL = URL.createObjectURL(myBlob);
    let image = document.createElement('img');
    image.src = objectURL;
    document.body.appendChild(image);
  })
  .catch(e => {
    console.log(
      'There has been a problem with your fetch operation: ' + e.message
    );
  });
```

```js
async function myFetch() {
  try {
    let response = await fetch('coffee.jpg');
    let myBlob = await response.blob();

    let objectURL = URL.createObjectURL(myBlob);
    let image = document.createElement('img');
    image.src = objectURL;
    document.body.appendChild(image);
  } catch (e) {
    console.log(e);
  }
}

myFetch();
```

当然也可以混搭：

```js
async function myFetch() {
  let response = await fetch('coffee.jpg');
  return await response.blob();
}

myFetch()
  .then(blob => {
    let objectURL = URL.createObjectURL(blob);
    let image = document.createElement('img');
    image.src = objectURL;
    document.body.appendChild(image);
  })
  .catch(e => console.log(e));
```

### `Promise.all()`

> `Promise.all(iterable)` 方法返回一个 [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 实例，此实例在 `iterable` 参数内所有的 `promise` 都“完成（resolved）”或参数中不包含 `promise` 时回调完成（resolve）；如果参数中 `promise` 有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败 `promise` 的结果。
>
> 引用来源：[Promise.all() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)。

```js
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then(function (values) {
  console.log(values);
});
// expected output: Array [3, 42, "foo"]
```

## 闭包的含义

为了读取某一个函数内部的变量，可以把这个函数内部的一个子函数返回，以便读取本体函数内部变量，这个子函数称为闭包。闭包把函数内部与函数外部连接。

```js
function makeFunc() {
  var name = 'Mozilla';
  function displayName() {
    alert(name);
  }
  return displayName;
}

var myFunc = makeFunc();
myFunc();
```

## `this` 和 `super`

`this` 指向函数当前对象，`super` 指向当前对象的原型对象。

```js
const proto = {
  foo: 'hello',
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  },
};

Object.setPrototypeOf(obj, proto);
obj.find(); // "hello"
```

```js
const proto = {
  x: 'hello',
  foo() {
    console.log(this.x);
  },
};

const obj = {
  x: 'world',
  foo() {
    super.foo();
  },
};

Object.setPrototypeOf(obj, proto);

obj.foo(); // "world"
```

在使用 `class` 语法时，如果出现子类继承父类的情况，则需要在子类的 `constructor` 方法中调用 `super` 方法。

> 子类必须在 `constructor` 方法中调用 `super` 方法，否则新建实例时会报错。这是因为子类自己的 `this` 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用 `super` 方法，子类就得不到 `this` 对象。
>
> 另一个需要注意的地方是，在子类的构造函数中，只有调用 `super` 之后，才可以使用 `this` 关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有 `super` 方法才能调用父类实例。
>
> 引用来源：[Class 的继承 - ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/class-extends)。

```js
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的 constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的 toString()
  }
}
```

## `call()`、`apply()` 和 `bind()`

`call()` 和 `apply()` 都是用来给某个函数指定 `this`，区别在于：`call()` 接收的是参数列表，而 `apply()` 接收的是一个参数数组。返回值是调用函数的结果。

```js
function.call(thisArg, arg1, arg2, ...)
function.apply(thisArg, [argsArray])
```

`bind()` 的作用与上面两个类似，不过返回的是一个新的函数。其调用时传入的是参数列表。

```js
function.bind(thisArg[, arg1[, arg2[, ...]]])
```

```js
let name = 'abc';
let age = 123;
let obj = {
  name: 'qwe',
  age: 0,
  fn(a, b) {
    console.log(`${this.name} & ${this.age} : ${a} -> ${b}`);
  },
};

let plus = {
  name: 'xyz',
  age: '999',
};

obj.fn('from', 'to'); // qwe & 0 : from -> to
obj.fn.call(plus, 'from', 'to'); // xyz & 999 : from -> to
obj.fn.apply(plus, ['from', 'to']); // xyz & 999 : from -> to
obj.fn.bind(plus, 'from', 'to')(); // xyz & 999 : from -> to
```

## 数组遍历方法

### `foreach()`

对数组中的每个元素执行一次函数。

```js
arr.forEach(callback(currentValue [, index [, array]])[, thisArg]);
```

### `map()`

对数组中的每个元素执行一次函数，并把每次函数的返回值组成一个新的数组，作为回调函数的结果。

```js
var new_array = arr.map(function callback(currentValue[, index[, array]]) {
 // Return element for new_array
}[, thisArg])
```

```js
var numbers = [1, 4, 9];
var roots = numbers.map(Math.sqrt);
// roots 的值为 [1, 2, 3], numbers 的值仍为 [1, 4, 9]
```

### `filter()`

对数组中的每个元素执行一次函数，把返回值为 `true` 的元素保留，并组成一个数组返回。

```js
var newArray = arr.filter(callback(element[, index[, array]])[, thisArg])
```

```js
const fruits = ['apple', 'banana', 'grapes', 'mango', 'orange'];

/**
 * Array filters items based on search criteria (query)
 */
const filterItems = query => {
  return fruits.filter(
    el => el.toLowerCase().indexOf(query.toLowerCase()) > -1
  );
};

console.log(filterItems('ap')); // ['apple', 'grapes']
console.log(filterItems('an')); // ['banana', 'mango', 'orange']
```

### `reduce()`

```js
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```

这里引用 MDN 上的解释。

> `reduce` 为数组中的每一个元素依次执行 `callback` 函数，不包括数组中被删除或从未被赋值的元素，接受四个参数：
>
> - `accumulator 累计器`
> - `currentValue 当前值`
> - `currentIndex 当前索引`
> - `array 数组`
>
> 回调函数第一次执行时，`accumulator` 和 `currentValue` 的取值有两种情况：如果调用 `reduce ()` 时提供了 `initialValue`，`accumulator` 取值为 `initialValue`，`currentValue` 取数组中的第一个值；如果没有提供 `initialValue`，那么 `accumulator` 取数组中的第一个值，`currentValue` 取数组中的第二个值。
>
> ** 注意：** 如果没有提供 `initialValue`，reduce 会从索引 1 的地方开始执行 callback 方法，跳过第一个索引。如果提供 `initialValue`，从索引 0 开始。
>
> 如果数组为空且没有提供 `initialValue`，会抛出 [`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 。如果数组仅有一个元素（无论位置如何）并且没有提供 `initialValue`， 或者有提供 `initialValue` 但是数组为空，那么此唯一值将被返回并且 `callback` 不会被执行。
>
> 引用来源：[Array.prototype.reduce () - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)。

```js
var total = [0, 1, 2, 3].reduce((acc, cur) => acc + cur, 0);
```

### `find()` `findIndex()`

返回数组中第一个满足回调函数的 **元素的值** / **元素的索引**。

### `some()` `every()`

数组中 **至少有一个元素** / **所有元素** 都满足回调函数的的条件时返回 `true`。

## 判断数据类型

### `typeof`

`typeof` 可以分辨的类型有：`unidfined` `boolean` `number` `bigint` `string` `symbol` `function` `object`。

```js
typeof undefined === 'undefind';

typeof 10 === 'number';
typeof NaN === 'number';
typeof 10n === 'bigint';

typeof '' === 'string';
typeof `` === 'string';

typeof true === 'boolean';

typeof Symbol('f') === 'symbol';

typeof {} === 'object';
typeof [] === 'object';
typeof /regex/ === 'object';
typeof new Date() === 'object';
typeof null === 'object';

typeof function () {} === 'function';
typeof class C {} === 'function';
```

这种方法无法区分数组等具体对象，则可以用 `instanceof` 区分。

### `instanceof`

`instanceof` 用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上，简单地说就是判断某个对象的原型链上是否存在某个构造函数的 `prototype` 属性。

```js
[] instanceof Array		// true
[] instanceof Object	// true

let s = '546';
s instanceof String;	// false 检查原型链会找到 undefined
let ss = new String('2445');
ss instanceof String	// true

({}) instanceof Object;	// true
// 创建一个空对象，没继承 Object.prototype 上的属性和方法
let o = Object.create(null);
o instanceof Object;	// false
```

### `Object.prototype.toString.call()`

也可以用 `apply()` 方法。

```js
Object.prototype.toString.call([]); // [object Array]
Object.prototype.toString.call(''); // [object String]
Object.prototype.toString.call({}); // [object Object]
Object.prototype.toString.call(new Date()); // [object Date]
Object.prototype.toString.call(new String()); // [object String]
Object.prototype.toString.call(Math); // [object Math]
```

### `constructor`

所有对象都会从它的原型上继承一个 `constructor` 属性。

```js
(5).constructor === Number;	// true
[].constructor === Array;	// true
{}.constructor === Object;	// true
(5).constructor === Number;	// true

(new Date()).constructor; 	// [Function: Date]
(new RegExp()).constructor;	// [Function: RegExp]
```

## 对 Object 中的属性排序

参考资料：[javascript - Sort array of objects by string property value - Stack Overflow](https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value)。

```js
// 错误的
[...].sort((a, b) => {
    return a.name < b.name
})

// 对的
[...].sort((a, b) => {
    if (a.name < b.name) {
        return 1;
    } else if (a.name > b. name) {
        return -1;
    }
    return 0;
})
```
