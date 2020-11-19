---
name: translate-callback-hell
title: 翻译：Callback Hell
create-date: 2020-03-16
date: 2020-03-18
descriptions:
    - 翻译文章，原文来自：http://callbackhell.com
    - 本文采取双语对照的方式，正文内容中英语原文在上，翻译在下
tags:
    - 翻译
    - JavaScript
license: CC-BY-SA-4.0
---

# 翻译：Callback Hell

📌 翻译文章，原文来自：[http://callbackhell.com](http://callbackhell.com)

🤔 本文采取双语对照的方式，正文内容中英语原文在上，翻译在下

| 词汇         | 解释                                                      |
| ------------ | --------------------------------------------------------- |
| asynchronous | 异步的                                                    |
| I/O          | 输入/输出                                                 |
| block        | 堵塞                                                      |
| AJAX         | Asynchronous JavaScript And XML（异步 JavaScript 和 XML） |

_A guide to writing asynchronous JavaScript programs_

_一份用于编写异步的 JavaScript 程序的指南_

## What is "_callback hell_"? “_回调地狱_”是什么？

Asynchronous JavaScript, or JavaScript that uses callbacks, is hard to get right intuitively. A lot of code ends up looking like this:

异步的 JavaScript，或者使用了回调的 JavaScript，很难一眼看出运行的结果。到最后，很多代码都会变成这个样子：

```js
fs.readdir(source, function (err, files) {
    if (err) {
        console.log('Error finding files: ' + err);
    } else {
        files.forEach(function (filename, fileIndex) {
            console.log(filename);
            gm(source + filename).size(function (err, values) {
                if (err) {
                    console.log('Error identifying file size: ' + err);
                } else {
                    console.log(filename + ' : ' + values);
                    aspect = values.width / values.height;
                    widths.forEach(
                        function (width, widthIndex) {
                            height = Math.round(width / aspect);
                            console.log(
                                'resizing ' +
                                    filename +
                                    'to ' +
                                    height +
                                    'x' +
                                    height
                            );
                            this.resize(width, height).write(
                                dest + 'w' + width + '_' + filename,
                                function (err) {
                                    if (err)
                                        console.log(
                                            'Error writing file: ' + err
                                        );
                                }
                            );
                        }.bind(this)
                    );
                }
            });
        });
    }
});
```

See the pyramid shape and all the `})` at the end? Eek! This is affectionately known as **callback hell**.

看见最后像金字塔形状的 `})` 了吗？这种现象被亲切地称为**回调地狱**。

The cause of callback hell is when people try to write JavaScript in a way where execution happens visually from top to bottom. Lots of people make this mistake! In other languages like C, Ruby or Python there is the expectation that whatever happens on line 1 will finish before the code on line 2 starts running and so on down the file. As you will learn, JavaScript is different.

当程序员们试图用一种“理所当然”的写法，从上到下把代码写出来时，就产生了回调地狱。很多程序员都犯过这种错误！在 C、Ruby 或 Python 等其他编程语言中，程序员知道在第二行的代码运行之前，第一行代码就已经运行完了，所有的代码都是这样。但是 JavaScript 不一样。

## What are callbacks? 什么是回调？

Callbacks are just the name of a convention for using JavaScript functions. There isn't a special thing called a 'callback' in the JavaScript language, it's just a convention. Instead of immediately returning some result like most functions, functions that use callbacks take some time to produce a result. The word 'asynchronous', aka 'async' just means 'takes some time' or 'happens in the future, not right now'. Usually callbacks are only used when doing I/O, e.g. downloading things, reading files, talking to databases, etc.

回调只是 JavaScript 中某些函数的习惯叫法。JavaScript 中没有回调这种东西，这个名字真的只是一种习惯叫法。回调函数不同于大多数可以立即返回结果的函数，它需要一些时间执行才能返回结果。英语单词“asynchronous”，简称“async”，在这里的意思是“做这件事需要花一些时间”或者“事件发生在未来，而不是现在”。一般来说，回调只在执行 I/O 操作时使用，例如下载东西、读取文件、与数据库通信等。

When you call a normal function you can use its return value:

当你调用一个普通函数的时候，你可以使用它的返回值：

```js
var result = multiplyTwoNumbers(5, 10);
console.log(result);
// 50 gets printed out
```

However, functions that are async and use callbacks don't return anything right away.

不过，使用异步的回调函数时，并不会立刻返回任何数据。

```js
var photo = downloadPhoto('http://coolcats.com/cat.gif');
// photo is 'undefined'!
```

In this case the gif might take a very long time to download, and you don't want your program to pause (aka 'block') while waiting for the download to finish.

某些情况下，这个图片文件可能需要很长时间才能下载完成，但是你不想让你的程序在等待下载的过程中暂停运行（也就是“block”）。

Instead, you store the code that should run after the download is complete in a function. This is the callback! You give it to the `downloadPhoto` function and it will run your callback (e.g. 'call you back later') when the download is complete, and pass in the photo (or an error if something went wrong).

为了解决这个问题，你把下载完成后要执行的代码放在一个函数里。这就是回调！你把回调函数放进 `downloadPhoto` 函数，这个函数会在下载完成后运行回调函数（像是“一会叫你回来”那样），然后传入照片（如果出错了，那么会传入错误信息）。

```js
downloadPhoto('http://coolcats.com/cat.gif', handlePhoto);

function handlePhoto(error, photo) {
    if (error) console.error('Download error!', error);
    else console.log('Download finished', photo);
}

console.log('Download started');
```

The biggest hurdle people have when trying to understand callbacks is understanding the order that things execute as a program runs. In this example three major things happen. First the `handlePhoto` function is declared, then the `downloadPhoto` function is invoked and passed the `handlePhoto` as its callback, and finally `'Download started'` is printed out.

如何理解程序的运行顺序，是人们理解回调的最大障碍。上面的例子中发生了三件事。首先声明函数 `handlePhoto`，然后调用函数 `downloadPhoto` ，并传入它的回调函数 `handlePhoto`，最后输出 `'Download started'`。

Note that the `handlePhoto` is not invoked yet, it is just created and passed as a callback into `downloadPhoto`. But it won't run until `downloadPhoto` finishes doing its task, which could take a long time depending on how fast the Internet connection is.

注意，函数 `handlePhoto` 还没有被调用，它只是被创建然后作为回调函数传入 `downloadPhoto` 。但是直到函数 `downloadPhoto` 执行完成后它才开始运行，网络快不快决定了它等待的时间。

This example is meant to illustrate two important concepts:

这个例子说明了两个重要的概念：

-   The `handlePhoto` callback is just a way to store some things to do at a later time
-   回调函数 `handlePhoto` 只是一种存放待办事物的方法。
-   The order in which things happen does not read top-to-bottom, it jumps around based on when things complete
-   事件并不是从头到尾按顺序执行的，而是按时间完成的顺序执行。

## How do I fix callback hell? 怎样才能避免回调地狱？

Callback hell is caused by poor coding practices. Luckily writing better code isn't that hard!

回调地狱的源头是不好的代码习惯。幸运的是，写出好的代码并不难！

You only need to follow **three rules**:

你只需要遵循下面这**三个原则**：

### 1. Keep your code shallow 保持代码简洁易懂

Here is some messy browser JavaScript that uses [browser-request](https://github.com/iriscouch/browser-request) to make an AJAX request to a server:

这里有一些比较混乱的 JavaScript 代码，运行在浏览器中，使用 [browser-request](https://github.com/iriscouch/browser-request) 实现 AJAX 请求。

```js
var form = document.querySelector('form');
form.onsubmit = function (submitEvent) {
    var name = document.querySelector('input').value;
    request(
        {
            uri: 'http://example.com/upload',
            body: name,
            method: 'POST',
        },
        function (err, response, body) {
            var statusMessage = document.querySelector('.status');
            if (err) return (statusMessage.value = err);
            statusMessage.value = body;
        }
    );
};
```

This code has two anonymous functions. Let's give em names!

上面这段代码有两个匿名函数。给他们起个名字吧！

```js
var form = document.querySelector('form');
form.onsubmit = function formSubmit(submitEvent) {
    var name = document.querySelector('input').value;
    request(
        {
            uri: 'http://example.com/upload',
            body: name,
            method: 'POST',
        },
        function postResponse(err, response, body) {
            var statusMessage = document.querySelector('.status');
            if (err) return (statusMessage.value = err);
            statusMessage.value = body;
        }
    );
};
```

As you can see naming functions is super easy and has some immediate benefits:

如你所见，给一个函数命名非常简单，而且有几个直接的好处：

-   makes code easier to read thanks to the descriptive function names
-   函数名可以用来描述函数的作用，使代码更容易阅读
-   when exceptions happen you will get stacktraces that reference actual function names instead of "anonymous"
-   出现错误时，可以获得确切的堆栈跟踪信息，知道错误来自哪个函数而不是“匿名”函数
-   allows you to move the functions and reference them by their names
-   可以通过更改函数名的方式来变更函数

Now we can move the functions to the top level of our program:

现在我们可以把函数放在程序的最外层：

```js
document.querySelector('form').onsubmit = formSubmit;

function formSubmit(submitEvent) {
    var name = document.querySelector('input').value;
    request(
        {
            uri: 'http://example.com/upload',
            body: name,
            method: 'POST',
        },
        postResponse
    );
}

function postResponse(err, response, body) {
    var statusMessage = document.querySelector('.status');
    if (err) return (statusMessage.value = err);
    statusMessage.value = body;
}
```

Note that the `function` declarations here are defined at the bottom of the file. This is thanks to [function hoisting](https://gist.github.com/maxogden/4bed247d9852de93c94c).

注意，声明 `function` 的语句被定义在文件的底部，可以这样做是因为 [function hoisting](https://gist.github.com/maxogden/4bed247d9852de93c94c) 特性。

### 2. Modularize 模块化

This is the most important part: **Anyone is capable of creating modules** (aka libraries). To quote [Isaac Schlueter](http://twitter.com/izs) (of the node.js project): _"Write small modules that each do one thing, and assemble them into other modules that do a bigger thing. You can't get into callback hell if you don't go there."_

这句话非常重要：**任何人都可以（应该）创建模块**（类似库）。引用 [Isaac Schlueter](http://twitter.com/izs)（有关 Node.js 项目）中的一句话：“_编写只做一件事的小模块，然后把它们组装成做更多事情的大模块。如果你能做到这一点，那么你就不会陷入回调地狱。_”

Let's take out the boilerplate code from above and turn it into a module by splitting it up into a couple of files. I'll show a module pattern that works for either browser code or server code (or code that works in both):

让我们把上面例子中的代码分成几个文件，然后将每个文件转换成模块。下面我来说说怎么使用模块，这个方式适用于浏览器端或者服务器端（也许两者都适用）：

Here is a new file called `formuploader.js` that contains our two functions from before:

新建文件，命名为 `formuploader.js`，里面包含了之前提到的两个函数：

```js
module.exports.submit = formSubmit;

function formSubmit(submitEvent) {
    var name = document.querySelector('input').value;
    request(
        {
            uri: 'http://example.com/upload',
            body: name,
            method: 'POST',
        },
        postResponse
    );
}

function postResponse(err, response, body) {
    var statusMessage = document.querySelector('.status');
    if (err) return (statusMessage.value = err);
    statusMessage.value = body;
}
```

The `module.exports` bit is an example of the node.js module system which works in node, Electron and the browser using [browserify](https://github.com/substack/node-browserify). I quite like this style of modules because it works everywhere, is very simple to understand and doesn't require complex configuration files or scripts.

`module.exports` 这个语句是 Node.js 模块系统中的一个规范写法，它可以工作在 Node，Electron 和使用了 [browserify](https://github.com/substack/node-browserify) 的浏览器上。我非常喜欢这种风格的模块，因为它可以在任何平台运行，容易理解，而且不需要复杂的配置或脚本。

Now that we have `formuploader.js` (and it is loaded in the page as a script tag after being browserified) we just need to require it and use it! Here is how our application specific code looks now:

现在我们有了这个 `formuploader.js`（这个文件也通过 [browserify](https://github.com/substack/node-browserify) 编译并链接到了原网页上），我们只需要 require 它就可以使用了！下面是现在我们的应用程序的代码的样子：

```js
var formUploader = require('formuploader');
document.querySelector('form').onsubmit = formUploader.submit;
```

Now our application is only two lines of code and has the following benefits:

现在我们的应用程序只剩两行代码，而且还有下面的好处：

-   easier for new developers to understand -- they won't get bogged down by having to read through all of the `formuploader` functions
-   新加入的开发者更容易理解代码——他们不用担心要读完整个 `formuploader` 函数
-   `formuploader` can get used in other places without duplicating code and can easily be shared on github or npm
-   `formuploader` 函数可以用在其他的地方而不用再写一遍，而且这个函数可以被简单地分享在 Github 或者 NPM 上。

### 3. Handle every single error 处理每一处错误

There are different types of errors: syntax errors caused by the programmer (usually caught when you try to first run the program), runtime errors caused by the programmer (the code ran but had a bug that caused something to mess up), platform errors caused by things like invalid file permissions, hard drive failure, no network connection etc. This section is only meant to address this last class of errors.

写程序的过程中会遇到各种类型的错误：由程序员导致的语法错误（通常发生在你第一次运行程序的时候），由程序员导致的运行时错误（代码已经运行了，但是有一个错误导致了程序产生了混乱），由无效的文件权限、硬盘故障、没有网络链接等导致的平台错误。这一部分只讲一讲最后一种错误。

The first two rules are primarily about making your code readable, but this one is about making your code stable. When dealing with callbacks you are by definition dealing with tasks that get dispatched, go off and do something in the background, and then complete successfully or abort due to failure. Any experienced developer will tell you that you can never know when these errors happen, so you have to plan on them always happening.

前两个代码原则主要是关于如何让代码具有可读性，但这一部分要讲的代码原则是如何让你的代码更稳定。根据回调函数的定义，当处理回调函数时，会先处理当前分配到的任务，在后台执行一些操作，然后得到回调成功执行或者因为错误而中断的结果。任何有经验的开发者都会告诉你，你永远无法知道错误何时发生，所以你只能做好它会发生的准备。

With callbacks the most popular way to handle errors is the Node.js style where the first argument to the callback is always reserved for an error.

对于回调，最流行的处理错误的方式是 Node.js 风格，它总是把回调函数的第一个参数作为错误信息返回。

```js
var fs = require('fs');

fs.readFile('/Does/not/exist', handleFile);

function handleFile(error, file) {
    if (error) return console.error('Uhoh, there was an error', error);
    // otherwise, continue on and use `file` in your code
}
```

Having the first argument be the `error` is a simple convention that encourages you to remember to handle your errors. If it was the second argument you could write code like `function handleFile (file) { }` and more easily ignore the error.

把第一个参数作为 `error` 是一个简单的习惯，可以帮助你去记住要处理错误。如果错误处理是第二个参数，那么你也许会写出 类似 `function handleFile (file) { }` 这样的代码，很容易忽略了错误的处理。

Code linters can also be configured to help you remember to handle callback errors. The simplest one to use is called [standard](http://standardjs.com/). All you have to do is run `$ standard` in your code folder and it will show you every callback in your code with an unhandled error.

代码检查工具也可以帮助你记住去处理回调错误。最简单的一个是 [standard](http://standardjs.com/)。你要做的只是在你代码所在的文件夹里运行 `$ standard` 命令，然后它就会显示你的代码中每一个未处理错误的回调。

## Summary 总结

1. Don't nest functions. Give them names and place them at the top level of your program 不要嵌套函数。给函数命名然后把它们放在程序的最外层。
2. Use [function hoisting](https://gist.github.com/maxogden/4bed247d9852de93c94c) to your advantage to move functions 'below the fold' 合理地利用 [function hoisting](https://gist.github.com/maxogden/4bed247d9852de93c94c) 把函数放在不显眼的位置。
3. Handle **every single error** in every one of your callbacks. Use a linter like [standard](http://standardjs.com/) to help you with this. 在每个回调中处理每个错误，可以使用 [standard](http://standardjs.com/) 之类的代码检查工具帮助你完成这件事。
4. Create reusable functions and place them in a module to reduce the cognitive load required to understand your code. Splitting your code into small pieces like this also helps you handle errors, write tests, forces you to create a stable and documented public API for your code, and helps with refactoring. 创建可以重复使用的函数，并把它们放入一个模块，这样可以减少理解代码所需的认知负荷。把代码分成小的部分可以帮助你处理错误，编写测试，强制你去构建一个稳定和有文档的公共 API，还有利于代码的重构。

The most important aspect of avoiding callback hell is **moving functions out of the way** so that the programs flow can be more easily understood without newcomers having to wade through all the detail of the functions to get to the meat of what the program is trying to do.

避免回调最重要的方面是**把函数单独拿出来**，这样之后，整个程序的流程会变得容易理解，新加入的开发者可以知道程序到底在干什么，而不用了解每个函数的细节。

You can start by moving the functions to the bottom of the file, then graduate to moving them into another file that you load in using a relative require like `require('./photo-helpers.js')` and then finally move them into a standalone module like `require('image-resize')`.

你可以从把函数移到文件底部开始做，然后逐步把他们移动到另一个文件中，这样以后你可以使用像是 `require('./photo-helpers.js')` 这样的相对地址来引用代码，最后把它们移动到一个独立的模块中，像是 `require('image-resize')`。

Here are some rules of thumb when creating a module:

下面是创建一个模块时的经验之谈：

-   Start by moving repeatedly used code into a function
-   从把重复使用的代码移动到一个函数里做起
-   When your function (or a group of functions related to the same theme) get big enough, move them into another file and expose them using `module.exports`. You can load this using a relative require
-   当你写的函数足够大时，把它们移动到另一个文件中，然后使用 `module.exports` 语句把接口暴露出来。然后你可以使用 require 来使用它
-   If you have some code that can be used across multiple projects give it it's own readme, tests and `package.json` and publish it to github and npm. There are too many awesome benefits to this specific approach to list here!
-   如果你写的代码被用于多个项目，那么应该给它编写 README 和测试以及 `package.json`，然后把它发布到 Github 和 NPM。这种方法有很多好处。
-   A good module is small and focuses on one problem
-   一个好的模块小巧而且专注于解决一个问题
-   Individual files in a module should not be longer than around 150 lines of JavaScript
-   对于模块中的单个文件，JavaScript 代码不应该超过 150 行左右
-   A module shouldn't have more than one level of nested folders full of JavaScript files. If it does, it is probably doing too many things
-   一个模块不应该有超过一层的嵌套文件夹，里面都是 JavaScript 文件，如果有，那么这个模块可以做了太多的事。
-   Ask more experienced coders you know to show you examples of good modules until you have a good idea of what they look like. If it takes more than a few minutes to understand what is happening, it probably isn't a very good module.
-   可以让有经验的程序员给你展示一下好的模块，知道你对好的模块有印象。如果如果你需要几分钟才能理解程序干了什么，那么这可能不是一个好的模块。

## More reading 拓展阅读

Try reading my [longer introduction to callbacks](https://github.com/maxogden/art-of-node#callbacks), or try out some of the [nodeschool](http://nodeschool.io/) tutorials.

尝试阅读我的 [longer introduction to callbacks](https://github.com/maxogden/art-of-node#callbacks)，或者尝试一些 [nodeschool](http://nodeschool.io/) 教程。

Also check out the [browserify-handbook](https://github.com/substack/browserify-handbook) for examples of writing modular code.

也可以看看 [browserify-handbook](https://github.com/substack/browserify-handbook) 里模块化代码的示例。

## What about promises/generators/ES6 etc? Promise/Generators/ES6 等，这些特性怎么样？

Before looking at more advanced solutions, remember that callbacks are a fundamental part of JavaScript (since they are just functions) and you should learn how to read and write them before moving on to more advanced language features, since they all depend on an understanding of callbacks. If you can't yet write maintainable callback code, keep working at it!

在研究这些更高级的方案之前，请记住，回调是 JavaScript 中的基本部分（因为回调是函数），在你转向使用更高级的语言特性之前，你要学会如何理解和编写回调函数，因为更高级的语言特性都依赖于对回调函数的理解。如果你还不能编写出可维护的回调代码，那就请继续学习它吧。

If you _really_ want your async code to read top-to-bottom, there are some fancy things you can try. Note that **these may introduce performance and/or cross platform runtime compatibility issues**, so make sure to do your research.

如果你*真的*希望你的异步代码可以一口气从头读到尾，那么这些新的特性你一定要试一试。注意，**这些特性可能会产生性能问题或者跨平台的兼容性问题**，所以请做好准备再尝试。

**Promises** are a way to write async code that still appears as though it is executing in a top-down way, and handles more types of errors due to encouraged use of `try/catch` style error handling.

**Promise** 是一种编写异步代码的方法，它看起来仍然是自顶向下执行，而且可以处理更多类型的错误，这是因为它鼓励使用 `try/catch` 进行错误处理。

**Generators** let you 'pause' individual functions without pausing the state of the whole program, which at the cost of slightly more complex to understand code lets your async code appear to execute in a top-down fashion. Check out [watt](https://github.com/mappum/watt) for an example of this approach.

**Generous** 可以让你“暂停”单个函数而不用暂停整个程序，这以稍微复杂的代码理解为代价，换取异步代码从上到下的执行风格。这种方法的一个例子：[watt](https://github.com/mappum/watt) 。

**Async functions** are a proposed ES7 feature that will further wrap generators and promises in a higher level syntax. Check them out if that sounds interesting to you.

**Async functions** 是在 ES7 中的提案，它用高级的语法封装了 generators 和 promises。如果你感兴趣，那就去学学看吧。

Personally I use callbacks for 90% of the async code I write and when things get complicated I bring in something like [run-parallel](https://github.com/feross/run-parallel) or [run-series](https://github.com/feross/run-series). I don't think callbacks vs promises vs whatever else really make a difference for me, the biggest impact comes from keeping code simple, not nested and split up into small modules.

我个人编写的异步代码中，90%都用到了回调，当我遇到了复杂的回调情况时，我会尝试引入 [run-parallel](https://github.com/feross/run-parallel) 以及 [run-series](https://github.com/feross/run-series) 这种库。我不觉得回调和 Promise 或是其他东西对我有真正的影响，对我来说，最大的影响来自保持代码简单，而不是把代码嵌套和分割成小的模块。

Regardless of the method you choose, always **handle every error** and **keep your code simple**.

无论你选择哪种方法，请始终记住处理**每一个错误**，**把代码变得简单**。

## Remember, only _you_ can prevent callback hell and forest fires 记住，只有*你*可以阻止回调地狱和之后的各种麻烦

You can find the source for this [on github](http://github.com/maxogden/callback-hell).

你可以在这里查看原文所在网页的代码：[Github](https://github.com/maxogden/callback-hell)。
