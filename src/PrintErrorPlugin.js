// 构建失败报错

class PrintError {
  apply (compiler) {
    compiler.hooks.done.tap('PrintError', (stats) => {
      if (stats.compilation?.errors?.length) {
        console.log('❌ build errors')
        process.exit('0213') // 生日
      }
    })
  }
}

module.exports = { PrintError }
