---
name: js-size-position
title: 使用 JavaScript 获取元素的大小和位置
create-date: 2020-03-12
date: 2020-03-12
description: 使用 JavaScript 获取 DOM 元素大小和位置的几种常见写法。
license: CC-BY-SA-4.0
---

# 使用 JavaScript 获取元素的大小和位置

## 需要注意的地方

### `box-sizing`

表明一个元素的宽度是否包含 `border` 和 `padding`，有两个值。

- `content-box` 默认值，元素的宽度不包括 `border` 和 `padding`，即内容的宽度就是元素的宽度。
- `border-box` 元素的宽度为 `border` + `padding` + `内容`。

```html
<div class="box">
  <div class="inner content-box"></div>
  <div class="inner border-box"></div>
</div>
```

```css
.box {
  width: 200px;
  border: solid 10px blue;
}
.inner {
  width: 100%;
  height: 100px;
  padding: 10px;
}
.content-box {
  box-sizing: content-box;
  border: solid 10px red;
}
.border-box {
  box-sizing: border-box;
  border: solid 10px yellow;
}
```

结果如下：

![box-sizing 两种写法的对比](https://file.lifeni.life/markdown/js-size-position/01.png)

### 滚动条

滚动条的宽度算在元素的 `padding` 内，可以参考 [padding 与滚动条关系\_Genge -CSDN 博客](https://blog.csdn.net/huzhigenlaohu/article/details/49636041)。

## 元素大小

我们在设置元素属性的时候，常使用 `element.style.xxx` 进行设置，此时 JS 会把 CSS 属性添加到 HTML 里。所以如果 HTML 里没有 CSS 属性，那么使用这个语句就无法获取元素的 CSS。

因此 JS 中可以使用 `element.clientWidth / element.clientHeight` `element.offsetWidth / element.offsetHeight` `element.scrollWidth / element.scrollHeight` 获取元素的大小。

### `element.clientHeight`

可见区域高度，**包括** 内容和 `padding`，**不包括** `border` `margin` 和滚动条。

### `element.offsetHeight`

**包括** 内容 `padding` `border` 和滚动条。

### `element.scrollHeight`

元素本身的高度，包含因溢出而不可见的内容。

### 举例

以下举例来自 [javascript - What is offsetHeight, clientHeight, scrollHeight? - Stack Overflow](https://stackoverflow.com/questions/22675126/what-is-offsetheight-clientheight-scrollheight) 最高票回答。

> Consider:
>
> ```js
> <element>
>     <!-- *content*: child nodes: -->        | content
>     A child node as text node               | of
>     <div id="another_child_node"></div>     | the
>     ... and I am the 4th child node         | element
> </element>
> ```
>
> **scrollHeight**: `ENTIRE content & padding (visible or not)`
> Height of all content + paddings, despite of height of the element.
>
> **clientHeight**: `VISIBLE content & padding`
> Only visible height: content portion limited by explicitly defined height of the element.
>
> **offsetHeight**: `VISIBLE content & padding` `+ border + scrollbar`
> Height occupied by the element on document.
>
> ![引用的图片：三种写法的对比](https://file.lifeni.life/markdown/js-size-position/02.webp)

## 元素位置

元素位置的获取方法除了传统的 `offsetTop` 和 `offsetLeft` 等，还可以使用 `element.getBoundingClientRect()` 方法。

### `element.getBoundingClientRect()`

返回一个对象，包含 `x` `y` `width` `height` `top` `right` `bottom` `left` 这几个属性，表示到浏览器可视区域的距离。这个方法看着挺长，其实兼容性挺好，基本全绿，除了 IE 和老 Edge 没有 `x` `y` 两个属性。

| 属性     | 解释                                                             |
| -------- | ---------------------------------------------------------------- |
| `x`      | [?] 貌似与 `left` 的作用相同                                     |
| `y`      | [?] 貌似与 `top` 的作用相同                                      |
| `width`  | 同 `element.offsetWidth`，包括 `padding` `border` 和滚动条       |
| `height` | 同 `element.offsetHeight`                                        |
| `top`    | 盒子上边到页面顶部（浏览器可视区域顶部）的距离，**不是文档顶部** |
| `right`  | 盒子右边到**页面左边**的距离，即 `left` + `width`                |
| `bottom` | 盒子底边到**页面顶部**的距离，即 `top` + `height`                |
| `left`   | 盒子左边到页面左边的距离                                         |

### `element.offsetTop` 和 `element.offsetLeft`

可以获取**元素的左上角**相对于**父容器**（`offsetParent`）**左上角**的距离。如果要获取元素在网页上的绝对位置（即相对整个文档左上角的距离），则可以一层层往上算出各个层级的距离，再相加。

### `element.scrollTop` 和 `element.scrollLeft`

分别指**滚动条滚动的垂直距离和水平距离**。可以借助其获得元素的相对位置（元素左上角相对于浏览器左上角（不是浏览器窗口的左上角，而是浏览器显示区域的左上角）的距离）：绝对位置 - 滚动距离。

这两个属性可写的，可以用做回到顶部。

## 参考文章

1. [box-sizing - CSS（层叠样式表） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing)
2. [javascript - What is offsetHeight, clientHeight, scrollHeight? - Stack Overflow](https://stackoverflow.com/questions/22675126/what-is-offsetheight-clientheight-scrollheight)
3. [原生 JS 获取元素的尺寸和位置 - 渔人 - SegmentFault 思否](https://segmentfault.com/a/1190000007687940)
4. [用 Javascript 获取页面元素的位置 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html)
