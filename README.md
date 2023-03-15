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

tap、tapAsync、tapPromise

参考以下图片即可

<img width="746" alt="图片" src="https://user-images.githubusercontent.com/67792799/225255714-8d431577-a18f-4061-a8fb-0b4fdfb3d61d.png">
<img width="1058" alt="image" src="https://user-images.githubusercontent.com/67792799/225256192-325f7d7d-dd8b-4f01-bdc1-fe53b7b26def.png">
