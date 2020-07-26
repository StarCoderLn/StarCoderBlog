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
        collapsable: false,
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
        collapsable: false,
        children: [
          { title: 'XAMPP与IIS', path: '/server/xampp' }
        ]
      },
      {
        title: 'PHP',
        collapsable: false,
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
        collapsable: false,
        children: [
          { title: '《看完就够用的函数式编程》', path: '/fp/enoughFp' },
          { title: '《JavaScript轻量级函数式编程》', path: '/fp/lightFp' },
          { title: '函数式编程学习笔记', path: '/fp/fp' }
        ]
      },
      {
        title: 'Linux',
        collapsable: false,
        children: [
          { title: 'VirtualBox虚拟机与ubuntu系统', path: '/linux/ubuntu' },
          { title: 'Cygwin', path: '/linux/cygwin' },
          { title: 'Linux', path: '/linux/linux' }
        ]
      },
      {
        title: 'JavaScript',
        collapsable: false,
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
        collapsable: false,
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
        collapsable: false,
        children: [
          { title: '手写一个脚手架', path: '/engineering/cli.md' },
          { title: 'CI/CD', path: '/engineering/cicd.md' },
          { title: 'Java 环境搭建和 SonarQube 安装', path: '/engineering/sonar.md' },
          { title: 'Jenkins 安装', path: '/engineering/jenkins.md' }
        ]
      },
      {
        title: '算法学习总结',
        collapsable: false,
        children: [
          { title: '时间复杂度和空间复杂度', path: '/algorithm/complexity' },
          { title: '动态规划', path: '/algorithm/dynamic' }
        ]
      },
      {
        title: 'Mac 开发体验优化',
        collapsable: false,
        children: [
          { title: '终端美化', path: '/mac/iterm2' },
          { title: 'Homebrew 下载安装', path: '/mac/homebrew' }
        ]
      }
    ],
  }
}