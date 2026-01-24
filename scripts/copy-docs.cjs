/**
 * 该文件用于处理 @ruabick/vite-plugin-gen-temp 和 vitepress 不兼容问题，后续会删除，仅构建文档过程中生效
 */
const path = require("path")
const fse = require("fs-extra")
// 复制 root docs
const sourceDir = path.join(__dirname, "../.docs/root")
const destinationDir = path.join(__dirname, "../.docs")

// 复制 src/docs 到 .docs/src/docs 用于处理相对路径导入
const srcDocsDir = path.join(__dirname, "../src/docs")
const destSrcDocsDir = path.join(__dirname, "../.docs/src/docs")

function copyDirectoryContents(source, destination) {
  fse.copySync(source, destination, {
    overwrite: true,
    errorOnExist: false,
    recursive: true
  })
}

// 复制 root docs
copyDirectoryContents(sourceDir, destinationDir)

// 复制 src/docs 到 .docs/src/docs 用于处理相对路径导入
copyDirectoryContents(srcDocsDir, destSrcDocsDir)
