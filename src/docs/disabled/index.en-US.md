---
map:
  path: /form/disabled/
---

# disabled

`disabled` can be set in three places. It can be a function.

- Passed as a prop of `el-form-renderer` to disable the entire form item, with the highest priority.
- Passed as a property of `el`, acting on a single form item component.
- Passed at the same level as `el`, the effect is the same as 2 (exists for historical reasons).

<demo src="./disabled.vue"
title="disabled"
desc="Usage of disabled">
</demo>
