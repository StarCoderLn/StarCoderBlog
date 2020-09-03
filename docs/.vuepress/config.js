module.exports = {
  title: '鸵鸟蛋的个人主页',
  description: '鸵鸟蛋的世界',
  markdown: {
    lineNumbers: true // 代码块显示行号
  },
  head: [
    ['link', { rel: 'icon', href: '/image/logo.jpg' }]
  ],
  themeConfig: {
    nav: [
      {
        text: '主页',
        link: 'https://starcoderln.github.io/'
      },
      {
        text: 'Github',
        link: 'https://www.github.com/StarCoderLn'
      }
    ],
    sidebar: [
      {
        title: "VuePress",
        collapsable: true,
        children: [
          { title: '搭建个人博客', path: '/blog/vuepress' }
          // ["https://github.com/cdoco/markdown-syntax", "Markdown语法详解"],
          // ["https://segmentfault.com/a/1190000015237352#comment-area", "VuePress从零开始搭建自己专属博客"],
          // ["http://www.yishilingxu.xyz:8090/document/share.html#_1-%E5%B7%A5%E5%85%B7-vuepress", "搭建个人博客"],
          // ["https://mp.weixin.qq.com/s/TR8TS-teKhCbGKtjNqMqWQ", "VuePress搭建技术网站与个人博客"]
        ]
      },
      {
        title: '服务器',
        collapsable: true,
        children: [
          { title: 'XAMPP与IIS', path: '/server/xampp' },
          { title: 'ESC', path: '/server/esc' }
        ]
      },
      {
        title: 'Nginx',
        collapsable: true,
        children: [
          { title: 'Nginx 安装', path: '/nginx/install' },
          { title: 'Nginx 使用', path: '/nginx/nginx' }
        ]
      },
      {
        title: 'PHP',
        collapsable: true,
        children: [
          { title: 'PHP入门', path: '/php/php' },
          { title: 'phpMyAdmin', path: '/php/phpMyAdmin' },
          { title: 'PHP PDO', path: '/php/phpPdo' },
          { title: 'PHP面向对象', path: '/php/phpOop' },
          { title: 'Yii2 踩坑记录', path: '/php/yii' }
        ]
      },
      {
        title: '函数式编程',
        collapsable: true,
        children: [
          { title: '《看完就够用的函数式编程》', path: '/fp/enoughFp' },
          { title: '《JavaScript轻量级函数式编程》', path: '/fp/lightFp' },
          { title: '函数式编程学习笔记', path: '/fp/fp' }
        ]
      },
      {
        title: '面向切面编程',
        collapsable: true,
        children: [
          { title: '理论知识', path: '/aop/aop1' },
          { title: 'SOLID & DDD 实战', path: '/aop/aop2' }
        ]
      },
      { 
        title: 'React',
        collapsable: true,
        children: [
          { title: 'React 相关知识', path: '/react/react1.md' },
          { title: 'Redux 相关知识', path: '/react/react2.md' },
          { title: 'Hook 相关知识', path: '/react/react3.md' },
          { title: 'React Router 相关知识', path: '/react/react4.md' }
        ]
      },
      {
        title: 'Linux',
        collapsable: true,
        children: [
          { title: 'VirtualBox虚拟机与ubuntu系统', path: '/linux/ubuntu' },
          { title: 'Cygwin', path: '/linux/cygwin' },
          { title: 'Linux', path: '/linux/linux' }
        ]
      },
      {
        title: 'JavaScript',
        collapsable: true,
        children: [
          { title: '你不知道的JavaScript（上）', path: '/javascript/jsUnknow1' },
          { title: 'ECMAScript', path: '/javascript/ecmascript' },
          { title: '手写Promise', path: '/javascript/promise' },
          { title: 'Event loop 总结', path: '/javascript/eventloop' },
          { title: 'JavaScript常用工具方法', path: '/javascript/jsUtils' },
          { title: 'JavaScript与QA工程师', path: '/javascript/qa' },
          { title: 'JavaScript基础测试', path: '/javascript/jsTest' }
        ]
      },
      {
        title: 'Node.js',
        collapsable: true,
        children: [
          { title: 'Node.js 入门', path: '/nodejs/nodejsStart' },
          { title: 'Node.js 基本使用', path: '/nodejs/nodejsApi' },
          { title: 'Node.js Express 框架', path: '/nodejs/express' },
          { title: 'Node.js Koa 框架', path: '/nodejs/koa' },
          { title: '前后端 BFF 架构实战', path: '/nodejs/nodejsYii' }
        ]
      },
      {
        title: '前端工程化',
        collapsable: true,
        children: [
          { title: '开发脚手架', path: '/engineering/cli.md' },
          { title: 'Webpack 与 Gulp', path: '/engineering/buildtool.md' },
          { title: 'CI/CD', path: '/engineering/cicd.md' },
          { title: 'Java 环境搭建和 SonarQube 安装', path: '/engineering/sonar.md' },
          { title: 'Jenkins 安装', path: '/engineering/jenkins.md' }
        ]
      },
      {
        title: 'HTTP',
        collapsable: true,
        children: [
          { title: 'HTTP 协议', path: '/http/http.md' },
          { title: '密码学入门', path: '/http/cryptography.md' },
          { title: 'HTTPS、HTTP2、HTTP3', path: '/http/http2.md' }
        ]
      },
      {
        title: '浏览器',
        collapsable: true,
        children: [
          { title: 'Chrome 浏览器渲染机制内幕', path: '/browser/chrome.md' }
        ]
      },
      {
        title: '性能优化',
        collapsable: true,
        children: [
          { title: '性能优化基础知识', path: '/performance/optimize1.md' },
          { title: '渲染中的性能优化', path: '/performance/optimize2.md' },
          { title: 'Node.js 性能调优', path: '/performance/optimize3.md' },
          { title: '页面加载性能优化', path: '/performance/optimize4.md' },
          { title: '性能优化项目实战', path: '/performance/optimize5.md' }
        ]
      },
      {
        title: '前端监控',
        collapsable: true,
        children: [
          { title: '前端监控基础知识', path: '/monitor/monitor1.md' }
        ]
      },
      {
        title: '算法学习总结',
        collapsable: true,
        children: [
          { title: '时间复杂度和空间复杂度', path: '/algorithm/complexity' },
          { title: '动态规划', path: '/algorithm/dynamic' }
        ]
      },
      {
        title: 'Mac 开发体验优化',
        collapsable: true,
        children: [
          { title: 'iTerm2 安装使用', path: '/mac/iterm2' },
          { title: 'Homebrew 下载安装', path: '/mac/homebrew' }
        ]
      }
    ],
    sidebarDepth: 2 // 默认为1，提取到 h2 标题；最大深度为2，提取到 h2 和 h3 标题；设置为0时禁用标题链接
  }
}