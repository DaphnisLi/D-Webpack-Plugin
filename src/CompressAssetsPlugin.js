// 将本次构建结果都打包成为一个压缩包
// 基本思路
// 1、emit 阶段能够获取到全部的资源信息
// 2、compilation.getAssets 返回具体的资源信息
// 3、调用 jszip 生成压缩包
// 4、compilation.emitAsset 可以向 output 添加文件
// 5、结束 callback

const JSZip = require('jszip')
const { RawSource } = require('webpack-sources')

class CompressAssetsPlugin {
  constructor ({ output }) {
    this.output = output
  }

  apply (compiler) {
    // emit 阶段能够获取到全部的资源信息
    compiler.hooks.emit.tapAsync('CompressAssetsPlugin', (compilation, callback) => {
      // 创建zip对象
      const zip = new JSZip()
      // compilation.getAssets 返回具体的资源信息, getAssets 类型 https://github.com/webpack/webpack/blob/main/types.d.ts#L226
      const assets = compilation.getAssets()
      // 循环每一个资源
      assets.forEach(({ name, source }) => {
        // 调用 source() 方法获得对应的源代码, 这是一个源代码的字符串
        const sourceCode = source.source()
        // 往 zip 对象中添加资源名称和源代码内容
        zip.file(name, sourceCode)
      })
      // 调用 zip.generateAsync 生成 zip 压缩包
      zip.generateAsync({ type: 'nodebuffer' }).then((result) => {
        // 通过 new RawSource 创建压缩包
        // compilation.emitAsset 可以向 output 添加文件
        compilation.emitAsset(this.output, new RawSource(result))
        // 结束
        callback()
      })
    })
  }
}

module.exports = { CompressAssetsPlugin }
