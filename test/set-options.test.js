import { reactive } from "vue"
import _set from "lodash.set"
// 这一步模拟了组件初始化的 state
const options = reactive({
  shell: [
    {
      value: "zsh"
    }
  ],
  name: [
    {
      value: "finn hudson"
    }
  ]
})

// 模拟 setOptions 方法
const setOptions = (id, O) => {
  _set(options, id, O)
}
// 构造 mocking 对象
const mocking = {
  options,
  setOptions
}

// --- 验证逻辑 (完全不变) ---
test("set options", () => {
  mocking.setOptions("shell", [
    {
      name: "using fish shell",
      value: "fish shell"
    }
  ])
  mocking.setOptions("name", [
    {
      value: "reachel berry"
    }
  ])

  expect(mocking.options).toEqual({
    shell: [
      {
        name: "using fish shell",
        value: "fish shell"
      }
    ],
    name: [
      {
        value: "reachel berry"
      }
    ]
  })
})
