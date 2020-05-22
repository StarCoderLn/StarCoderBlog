module.exports = {
  title: '鸵鸟蛋的个人主页',
  description: '鸵鸟蛋的世界',
  markdown: {
    lineNumbers: true // 代码块显示行号
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.jpg' }]
  ],
  themeConfig: {
    nav: [
      {
        text: '主页',
        link: '/'
      },
      {
        text: 'Github',
        link: 'https://www.github.com'
      }
    ],
    sidebar: [
      {
        title: "文档",
        collapsable: false,
        children: [
          ["https://www.jianshu.com/p/191d1e21f7ed/", "Markdown基本语法"],
          ["https://vuepress.vuejs.org/zh/", "VuePress文档"],
          ["https://segmentfault.com/a/1190000015237352#comment-area", "VuePress从零开始搭建自己专属博客"],
          ["http://www.yishilingxu.xyz:8090/document/share.html#_1-%E5%B7%A5%E5%85%B7-vuepress", "搭建个人博客"]
        ]
      }
    ],
  }
}