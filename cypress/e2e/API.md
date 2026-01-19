# Cypress API 参考

## 核心 API

### `describe(title, fn)`

定义一个测试套件 (Test Suite)。

### `it(title, fn)`

定义一个测试用例 (Test Case)。

### `beforeEach(fn)`

钩子函数，在每个 `it` 执行前运行，用于重置环境。

### `cy.visit(url)`

访问页面。

### `cy.get(selector)`

使用 CSS 选择器定位元素。

### `cy.contains(text | regexp)`

根据文本内容查找元素。支持字符串或正则表达式。

### `cy.click(options)`

点击元素。

- `{ force: true }`: 强制点击，忽略可见性或遮挡检查。
- `{ multiple: true }`: 如果匹配多个元素，则全部执行点击。

### `cy.type(text)`

模拟键盘输入。

### `cy.focus()`

聚焦于指定的元素。

### `cy.blur()`

使指定的元素失去焦点。

### `cy.first()`

获取匹配到的第一个元素。

### `cy.next()`

获取下一个兄弟元素。

### `cy.should(assertion, value)`

建立断言。

- `have.value`: 检查元素的 `value` 属性。
- `be.visible`: 检查元素是否可见。
- `not.be.visible`: 检查元素是否不可见。
- `not.exist`: 检查元素是否不存在。
- `be.enabled`: 检查元素是否可用。
- `be.disabled`: 检查元素是否被禁用。
- `match`: 检查元素是否匹配特定的选择器或正则表达式。
- `contain`: 检查元素是否包含指定的文本或子元素。

### `cy.eq(index)`

获取匹配到的元素集合中指定索引的元素。索引从 0 开始。

### `cy.find(selector)`

在当前选中的元素内查找符合选择器的子元素。

### `cy.clear()`

清除输入框或文本域的内容。

## 自定义 API (Custom Commands)

### `cy.$goto(demoName)`

跳转到指定的示例路由。底层通过点击侧边栏匹配 `demoName` 的链接实现。

### `cy.$getFormItemInput(label, el = "input")`

获取表单项中的输入组件。

- `label`: 表单项的标签文本。
- `el`: 指定查找的组件类型（如 `input`, `textarea`），默认为 `input`。
