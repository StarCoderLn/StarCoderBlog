## 渲染面板

关于页面渲染方面的性能，我们可以在 Chorme 开发者工具中的渲染面板 Rendering 中观察到。

其中，FPS meter 是我们最需要关注的一个点。FPS 全称叫 **Frames Per Second (每秒帧数)**。**帧数越高，动画显示的越流畅**。一般的液晶显示器的刷新频率也就是 60HZ。也就是说，要想页面上的交互效果及动画流畅，那么 **FPS 稳定在60左右，是最佳的体验**。

关于 Chorme 开发工具各个面板的具体使用可以参考这个：[Chrome开发者工具使用指南](https://www.cnblogs.com/vvjiang/p/12370112.html)

![performance](../.vuepress/public/assets/image/performance/performance6.png 'performance')

## 渲染性能测试

**重排（回流）一定会引起重绘，但重绘不一定会引起重排（回流）。**

（1）不同的动画实现方式会导致渲染性能不一样

```html
<div class="container">
    <div class="ball" id="ball"></div>
</div>
<script>
    var balls = document.getElementById('ball');
    balls.classList.add('ball');
    balls.classList.add('ball-running');
</script>
```

- 使用改变手动改变 top 和 left 的方式实现。

```css
.container {
    position: relative;
    min-height: 400px;
}
.ball {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.75);
}
.ball-running {
    animation: run-around 4s infinite;
}
@keyframes run-around {
    0% {
        top: 0;
        left: 0;
    }
    25% {
        top: 0;
        left: 200px;
    }
    50% {
        top: 200px;
        left: 200px;
    }
    75% {
        top: 200px;
        left: 0;
    }
}
```

可以看到，小球每次在运动的时候，都会导致重绘和重排（绿色高亮部分是重绘，紫色高亮部分是重排），这样会导致页面的渲染性能比较差。

![performance](../.vuepress/public/assets/image/performance/performance1.gif 'performance')

- 使用 translate 的方式来实现。

```css
.container {
    position: relative;
    min-height: 400px;
}
.ball {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.75);
}
.ball-running {
    animation: run-around 4s infinite;
}
@keyframes run-around {
    0% {
        transform: translate(0, 0);
    }
    25% {
        transform: translate(200px, 0);
    }
    50% {
        transform: translate(200px, 200px);
    }
    75% {
        transform: translate(0, 200px);
    }
}
```

可以看到，现在小球每次运动时，不会有高亮显示了，说明不会触发重绘和重排，页面渲染性能得到了提升。

![performance](../.vuepress/public/assets/image/performance/performance2.gif 'performance')

## 网页渲染流程

[从URL输入到页面展现到底发生什么？](https://github.com/ljianshu/Blog/issues/24)

### DOM 分层

DOM 是分层的。那么是如何分层的呢？

（1）浏览器获取到 DOM 元素。

（2）对 DOM 元素节点计算样式结果（样式重计算 Recalculate Style）。

（3）为每个节点生成图形位置（Layout 回流或重排）。

（4）将每个节点绘制填充到图层位图中（Paint 重绘）。

（5）将图层作为纹理上传到 GPU 上去。

（6）GPU 把符合的图层合成生成到页面上（Composite Layers 合成层）。

![performance](../.vuepress/public/assets/image/performance/performance8-1.png 'performance')

![performance](../.vuepress/public/assets/image/performance/performance8-2.png 'performance')

以上就是整个网页的渲染流程，其中最重要三步就是：Layout -> Paint -> Composite Layers。

可以在 Chorme 开发者工具的性能面板中查看具体的过程和耗时。

![performance](../.vuepress/public/assets/image/performance/performance7.png 'performance')

### 合成层（Composite Layers）做了什么？

（1）图层列表准备好之后，提交给主线程（单独的合成线程）。

（2）合成线程根据当前视口 viewport 来划分图块。

（3）将分成的图块生成位图，这个过程就叫光栅化或栅格化（Raster）。

（4）所有图块都栅格化之后，合成线程就会生成 DrawQuad，提交给浏览器的渲染进程。

（5）浏览器有一个 viz 组件，接收到 DrawQuad 之后，把内容绘制到屏幕上。

### 哪些元素会分层？

- 会分层的元素有：根元素，设置了 position、transform、半透明、css 滤镜、overflow 的元素，canvas 元素，video 元素。

- CSS3D、transform、video、WebGL、css 滤镜、[will-change: transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/will-change) 能够跳过重绘重排，让 GPU 直接参与进来，触发硬件加速。

### 什么情况下会导致重绘重排？

- 颜色、阴影、字体大小等的变化都会导致重绘。

- 只要盒子动了，就会产生重排。除此之外，在读一些属性的时候也会触发重排，这些属性有 offset、scroll、client、width 等。因此，平时在写 css 的时候，尽量把读操作放在一起，把写操作放在一起，不要读写读写，这样浏览器会进行优化。

- [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame) 是操作 DOM 元素的一种高效的方法。我们可以使用它设置读写分离。

```js
requestAnimationFrame(function() {
    // 设置读写分离
})
```

- [CSS Triggers](https://csstriggers.com/) 这个网站可以查看 css 属性会不会引起重绘和重排。

- [fastdom](https://www.npmjs.com/package/fastdom) 可以帮助我们更好的管理 DOM 元素的读写操作。

### CPU 和 GPU 的区别

- CPU 主要负责操作系统和程序；GPU 主要负责显示工作和数据处理，效率更高，有一个库叫 [GPU.js](http://gpu.rocks/#/)，可以用来加速 JavaScript。

- 关于两者的详细区别可以参考这篇文章：[CPU 和 GPU 的区别](https://www.cnblogs.com/biglucky/p/4223565.html)。

### JS 代码放到底部会阻塞 DOM 渲染吗？

测试代码：

```html
<h1>深圳</h1>
<script>
    prompt('等待');
</script>
```

上面代码在浏览器中的效果如下：

![performance](../.vuepress/public/assets/image/performance/performance9.png 'performance')

可以看到，即使我们把 js 代码放到了页面底部，页面还是会先弹出等待框，此时页面上也并没有显示出 h1 的内容。只有当我们输入内容点确定之后，页面上才会显示 h1 的内容。

因此，**不管我们把 js 代码放到页面顶部还是底部，它都会影响 DOM 渲染**。

但是，**把 js 放页面底部还是有意义的，因为这样不会影响 DOM 解析，只会影响 DOM 渲染**。

### CSS 会影响 DOM 的解析和渲染吗？

测试代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        h1 {
            color: red !important;
        }
    </style>
    <script>
        function h() {
            console.log(document.querySelectorAll('h1'));
        }
        setTimeout(h, 0);
    </script>
    <link rel="stylesheet" href="https://cdn.staticfile.org/twitter-bootstrap/5.0.0-alpha1/css/bootstrap-grid.css">
</head>
<body>
    <h1>深圳</h1>
</body>
</html>
```

然后需要在浏览器的 Network 那里新增一个网络，来模拟网速很慢的情况，才看得出加载效果。

![performance](../.vuepress/public/assets/image/performance/performance10.png 'performance')

接着在浏览器中访问页面，

如果控制台中有打印出节点信息，说明 css 不会影响 DOM 解析；否则会影响。

如果页面中会马上显示出 h1 的内容，说明 css 不会影响 DOM 熏渲染；否则会影响。

可以看到效果如下，控制台输出节点信息了，但是页面上要等很久才会显示 h1 的内容。

![performance](../.vuepress/public/assets/image/performance/performance11.png 'performance')

因此，**css 不会影响 DOM 解析，但是会影响 DOM 渲染**。

### CSS 会影响 JS 的解析吗？

测试代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        h1 {
            color: red !important;
        }
    </style>
    <link rel="stylesheet" href="https://cdn.staticfile.org/twitter-bootstrap/5.0.0-alpha1/css/bootstrap-reboot.css">
</head>
<body>
    <h1>深圳</h1>
    <script>
        console.log(123);
    </script>
</body>
</html>
```

还是采用刚刚很慢的网络，可以在浏览器中看到，js 代码等了很久之后才执行。

![performance](../.vuepress/public/assets/image/performance/performance12.png 'performance')

因此，**css 会阻塞 js 代码的解析**。

### CSS 会影响 DOMContentLoaded 吗？

[DOMContentLoaded](https://developer.mozilla.org/zh-CN/docs/Web/Events/DOMContentLoaded)

测试代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded');
        })
    </script>
    <link rel="stylesheet" href="https://cdn.staticfile.org/twitter-bootstrap/5.0.0-alpha1/css/bootstrap-utilities.css">
</head>
<body>
    <h1>深圳</h1>
</body>
</html>
```

网速很慢的情况下执行结果如下：

![performance](../.vuepress/public/assets/image/performance/performance13.png 'performance')

说明此时 css 不会影响 DOMContentLoaded。

但是，在以下情况，就会影响了。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded');
        })
    </script>
    <link rel="stylesheet" href="https://cdn.staticfile.org/twitter-bootstrap/5.0.0-alpha1/css/bootstrap-utilities.css">
    <script>
        console.log('下一个 js');
    </script>
</head>
<body>
    <h1>深圳</h1>
</body>
</html>
```

网速很慢的情况下执行结果如下：

![performance](../.vuepress/public/assets/image/performance/performance14.png 'performance')

可以看到，控制台没有输出内容了。说明此时 css 影响了 DOMContentLoaded。当 css 加载完成之后，才会输出内容。

![performance](../.vuepress/public/assets/image/performance/performance15.png 'performance')

因此，**css 会不会影响 DOMContentLoaded 取决于 css 下边还有没有 js 脚本，如果有，就会影响，没有的话就不会影响**。