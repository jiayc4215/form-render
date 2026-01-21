export default {
  // 指定文件扩展名
  moduleFileExtensions: ["js", "json", "vue"],
  // 指定文件转换器
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest", // 指向新安装的 Vue 3 转换器
    "^.+\\.js$": "babel-jest"
  },
  // 指定测试文件
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"]
}
