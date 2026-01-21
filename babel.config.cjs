module.exports = {
  // 1. 默认配置（用于打包/生产）
  // @babel/env 是 @babel/preset-env 的缩写
  presets: [["@babel/env", { modules: false }]],

  // 2. 环境覆盖（专门用于 jest 测试）
  env: {
    test: {
      // 当 Jest 运行时（NODE_ENV=test），会强制使用这个配置
      presets: [["@babel/env", { modules: "commonjs" }]]
    }
  },

  // 3. 插件配置（处理 async/await 和辅助函数）
  plugins: [
    [
      "@babel/transform-runtime",
      {
        regenerator: true // 开启 async/await 的支持
      }
    ]
  ]
}
