/**
 * 该文件用于处理 @ruabick/vite-plugin-gen-temp 和 vitepress 不兼容问题，后续会删除，仅构建文档过程中生效
 */
const path = require("path")
const fse = require("fs-extra")
const sourceDir = path.join(__dirname, "../.docs/root")
const destinationDir = path.join(__dirname, "../.docs")

// Copy source docs for markdown imports (e.g., <<< imports in .md files)
const srcDocsDir = path.join(__dirname, "../src/docs")
const destSrcDocsDir = path.join(__dirname, "../.docs/src/docs")

function copyDirectoryContents(source, destination) {
  fse.copySync(source, destination, {
    overwrite: true,
    errorOnExist: false,
    recursive: true
  })
}

// Copy root docs
copyDirectoryContents(sourceDir, destinationDir)

// Copy src/docs to .docs/src/docs for relative imports
copyDirectoryContents(srcDocsDir, destSrcDocsDir)
