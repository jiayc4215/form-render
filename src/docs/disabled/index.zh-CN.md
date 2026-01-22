---
map:
  path: /form/disabled/
---

# disabled

disabled 可以设置在三个地方. 可以是一个函数.

- 作为 el-form-renderer 的 prop 传入，禁用整个表单项，优先级最高
- 作为 el 的属性传入，作用于单个表单项组件
- 与 el 平级传入，效果和 2 相同（因历史原因存在）

<demo src="./disabled.vue"
title="disabled"
desc="disabled 的使用">
</demo>
