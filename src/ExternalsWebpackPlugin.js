// externals 后自动插入 <Script />
// 如果 externals 里的 module 没有被 import, 则不会被插入 <Script />

// 实现共分三步
// 1、将引入的模块跳过编译，转化为外部依赖。
// 2、判断当前 import 模块是否存在于 this.transformLibrary 中, 如果存在, 将它加入 this.usedLibrary 中。
// 3、注入 <Script />

const { ExternalModule } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const pluginName = 'ExternalsWebpackPlugin'

class ExternalsWebpackPlugin {
  constructor (options) {
    // 保存参数
    this.options = options
    // 需要 externals 的库名称, ['react', 'vue']
    this.transformLibrary = Object.keys(options)
    // 分析 import 依赖, 代码中 import 的库, 最后 usedLibrary 里保存的 module 要 externals
    this.usedLibrary = new Set() // Set 防止重复
  }

  apply (compiler) {
    // ? 1、（2）
    //  生成模块的钩子 —— 同步
    compiler.hooks.normalModuleFactory.tap(pluginName, (normalModuleFactory) => {
      // 在初始化解析模块之前调用的钩子 —— 异步
      normalModuleFactory.hooks.factorize.tapAsync(pluginName, (resolveData, callback) => {
        // 获取 import 的模块名称, 为什么是 request？因为每一个 import 被当作是一个请求
        const requireModuleName = resolveData.request
        if (this.transformLibrary.includes(requireModuleName)) {
          // // ? 另外一种实现方式：判断当前 import 模块是否存在于 this.transformLibrary 中, 如果存在, 将它加入 this.usedLibrary 中。
          // this.usedLibrary.add(requireModuleName)

          // 如果当前模块需要被处理为外部依赖
          // 首先获得当前模块需要转位成为的变量名
          const externalModuleName = this.options[requireModuleName].variableName
          callback(null, new ExternalModule(externalModuleName, 'window', requireModuleName))
        } else {
          // 正常编译 不需要处理为外部依赖 什么都不做
          callback()
        }
      })

      // ? 2
      // 在编译模块时触发 将模块变成为AST阶段调用
      normalModuleFactory.hooks.parser.for('javascript/auto').tap(pluginName, (parser) => {
        // 当遇到模块引入语句 import 时
        this.importHandler(parser)
        // 当遇到模块引入语句 require 时
        this.requireHandler(parser)
      })
    })

    // ? 3
    // compilation 创建之后执行的钩子 —— 同步
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // 获取 HTMLWebpackPlugin 拓展的 compilation Hooks
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(pluginName, (data) => {
        // 额外添加 scripts
        const scriptTag = data.assetTags.scripts
        this.usedLibrary.forEach((library) => {
          scriptTag.unshift({
            tagName: 'script',
            voidTag: false,
            meta: { plugin: pluginName },
            attributes: {
              defer: true,
              type: undefined,
              src: this.options[library].src,
            },
          })
        })
      })
    })
  }

  // ? 下面两个函数用来判断是否使用了 transformLibrary 中的 module
  importHandler (parser) {
    // 会在代码解析（将代码转化 AST ）过程中遇到每个 import 语句都会调用
    parser.hooks.import.tap(pluginName, (statement, source) => {
      // 解析当前模块中的import语句
      if (this.transformLibrary.includes(source)) {
        this.usedLibrary.add(source)
      }
    })
  }

  // 判断当前 require 模块是否存在于 this.transformLibrary 中, 如果存在, 将它加入 this.usedLibrary 中。
  requireHandler (parser) {
    // 解析当前模块中的require语句
    parser.hooks.call.for('require').tap(pluginName, (expression) => {
      const moduleName = expression.arguments[0].value
      // 当require语句中使用到传入的模块时
      if (this.transformLibrary.includes(moduleName)) {
        this.usedLibrary.add(moduleName)
      }
    })
  }
}

module.exports = { ExternalsWebpackPlugin }
