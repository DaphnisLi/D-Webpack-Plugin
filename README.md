# D-Webpack-Plugin

## Plugin



### 重要提示：找不到资料就去看源码和类型定义
compiler： webpack 配置
compilation：能够访问所有的模块和它们的依赖
NormalModuleFactory： 生成模块
compilation 代表这一次资源构建的过程，在 compilation 对象中我们可以通过一系列 API 访问/修改本次打包生成的 module、assets 以及 chunks 。



### 1、选择一个 Hook
  一共分五大类钩子：compiler 钩子、compilation 钩子、ContextModuleFactory Hooks、JavascriptParser Hooks、NormalModuleFactory Hooks
  https://webpack.docschina.org/api/compiler-hooks/

- 先想好要在哪个阶段做哪件事
- 然后去 compiler 找到指定的钩子, 这个钩子一般会返回一个参数, 基本上就是上面五个钩子的信息, 具体 type 去 webpack 仓库找, 因为文档一般不全。
- 然后再去这个返回的参数中找到具体的方法



### 2、以什么方式注册事件

同步钩子：tab
异步钩子：tap、tapAsync、tapPromise
https://juejin.cn/post/7040982789650382855

tapAsync 的 callback(error, result) 函数调用时接受两个参数
error：发生错误时的错误信息
result：本次 hook 事件函数的返回值
