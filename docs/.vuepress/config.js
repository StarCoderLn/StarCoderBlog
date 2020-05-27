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
          { title: 'PHP面向对象', path: '/php/phpOop' }
        ]
      },
      {
        title: '函数式编程',
        collapsable: false,
        children: [
          { title: '看完就够用的函数式编程', path: '/fp/enoughFp' }
        ]
      },
      {
        title: 'Linux',
        collapsable: false,
        children: [
          { title: 'VirtualBox虚拟机与ubuntu系统', path: '/linux/ubuntu' },
          { title: 'Cygwin', path: '/linux/cygwin' },
          { title: 'Linux知识', path: '/linux/linux' }
        ]
      },
      {
        title: 'JavaScript',
        collapsable: false,
        children: [
          { title: 'ECMAScript', path: '/javascript/ecmascript' }
        ]
      }
    ],
  }
}