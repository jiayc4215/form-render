## 技术交流群 711368818

<img src="../qq.jpg"  width="200" />

## Introduction

### WHAT

i-table 基于元素 element-plus，但不限于元素 element-plus 组件。在完全继承 element-plus 元素的 table 属性的基础上，进行了扩展。一些非表格组件或自定义组件，因此，用户可以使用一段 json 来呈现完整的表格。

### WHY

在我们的日常开发中，有很多有表格的页面，通常表格结构相似，逻辑重复。i-table 没有复杂的逻辑。它只转换 JSON 来呈现表格项，节省了编写业务逻辑的时间和精力，并减少了重复代码。

## Features

- 用 json 呈现表格
- 支持数据列配置及插槽
- 支持操作列配置及插槽
- 支持多选框配置
- 支持分页显示
- 支持响应式表格

## Links

- [vue2&&vue3--render 函数(h)](https://blog.csdn.net/qq_63358859/article/details/134004642?spm=1001.2014.3001.5501)
- [vue2 与 vue3 生命周期的区别](https://blog.csdn.net/qq_63358859/article/details/134015846?spm=1001.2014.3001.5502)
- [vue2 与 vue3 v-model 的区别](https://marketplace.visualstudio.com/items?itemName=FEMessage.fem-vscode-helper)
- [vue2 版本](https://blog.csdn.net/qq_63358859/article/details/132714435?spm=1001.2014.3001.5502)
- [element-plus 表单的封装](https://gitee.com/childe-jia/form-render.git)

## Quick Start

```ts
git clone https://gitee.com/childe-jia/table-vue3.git
拉下项把 src\components\i-table 下组件放入自己项目 可跟业务场景自行修改
```

```ts
<template>
  <!--region table 表格-->
  <app-table
    :list="list"
    :total="total"
    :otherHeight="otherHeight"
    :options="options"
    :pagination="pagination"
    :columns="columns"
    :operates="operates"
    @handleSizeChange="handleSizeChange"
    @handleIndexChange="handleIndexChange"
    @handleSelectionChange="handleSelectionChange"
    @sortChange="sortChange"
  >
  </app-table>
</template>

<script setup>
import { ref, reactive, h, resolveComponent } from "vue";
import appTable from "./components/i-table/table.vue";
let total = ref(1000);

let list = reactive([
  {
    id: 1,
    title: "标题",
    state: 1,
    author: "张三",
    phone: "12346788901",
    email: "1234556778@qq.com",
    createDate: "2023-04-23 16:11:38",
    zero: null,
    isOpend: true,
    headimgurl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
  },
]);
let otherHeight = ref(288);
let columns = reactive([
  {
    prop: "id",
    label: "编号",
    align: "center",
    el: {
      // element ui的一些props...
      sortable: true, //开启排序
    },
  },

  {
    prop: "author",
    label: "作者",
    align: "center",
    width: 120,
  },
  {
    prop: "phone",
    label: "联系方式",
    align: "center",
    width: 160,
    show: false, //控制这一列是否展示
  },
  {
    prop: "zero",
    label: "邮箱",
    align: "center",
    width: 240,
  },

  {
    prop: "createDate",
    label: "发布时间",
    align: "center",
    width: 180,
    formatter: (row, column, cellValue) => {
      return row.createDate;
    },
  },
  {
    prop: "title",
    label: "标题",
    align: "center",
    formatter: (row, column, cellValue) => {
      return `<span style="white-space: nowrap;color: dodgerblue;">${row.title}</span>`;
    },
  },
  {
    prop: "state",
    label: "状态",
    align: "center",
    width: "160",
    render: (params) => {
      const fieldValue = params.row.state;
      const textMapping = {
        0: { type: "success", text: "上架" },
        1: { type: "info", text: "下架" },
        2: { type: "danger", text: "审核中" },
      };
      const type = textMapping.hasOwnProperty(fieldValue)
        ? textMapping[fieldValue].type
        : "default"; // 默认类型，可以根据需要修改

      const labelText = textMapping.hasOwnProperty(fieldValue)
        ? textMapping[fieldValue].text
        : "未知"; // 默认显示字段值，可以根据需要修改

      return h(resolveComponent("el-tag"), { type }, () => labelText);
    },
  },
  {
    prop: "switch",
    label: "开关",
    align: "center",
    width: "160",
    render: (params) => {
      return h(resolveComponent("el-switch"), {
        size: "default",
        modelValue: params.row.isOpend,
        onChange: (events) => {
          changeMsgStatus(events, params);
        },
      });
    },
  },

  {
    prop: "headimgurl",
    label: "头像",
    align: "center",
    render: (params) => {
      return h(
        resolveComponent("el-avatar"),
        {
          size: 44,
          src: params.row.headimgurl,
          // 图片加载失败展示默认图片
          onError: (e) => {
            return true;
          },
        },
        () => [
          h("img", {
            src: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
          }),
        ]
      );
    },
  },

  {
    prop: "link",
    label: "查看",
    align: "center",
    width: "160",
    render: (params) => {
      return h(
        resolveComponent("el-link"),
        {
          type: "primary",
          underline: false,
          onClick: (e) => {
            handleDetail(params);
          },
        },
        () => "查看"
      );
    },
  },
]);
const operates = reactive({
  width: 200,
  fixed: "right",
  list: [
    {
      label: "编辑",
      type: "primary",
      plain: true,
      link: true,
      show: (index, row) => {
        return true;
      },
      icon: "Edit",
      disabled: false,
      method: (index, row) => {
        console.log("编辑");
        handleEdit(index, row);
      },
    },
    {
      label: "删除",
      type: "primary",
      icon: "Delete",
      plain: true,
      link: true,
      show: true,
      disabled: (index, row) => {
        return false;
      },
      method: (index, row) => {
        console.log("删除");
        handleDel(index, row);
      },
    },
    {
      label: "测试下拉1",
      type: "primary",
      icon: "el-icon-delete",
      show: true,
      disabled: (index, row) => {
        return false;
      },
      method: (index, row) => {
        console.log("测试下拉1");
        handleDel(index, row);
      },
    },
    {
      label: "测试下拉2",
      type: "primary",
      icon: "el-icon-delete",
      show: true,
      disabled: (index, row) => {
        return false;
      },
      method: (index, row) => {
        console.log("测试下拉2");
        handleDel(index, row);
      },
    },
  ],
});
const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
});
const options = reactive({
  stripe: true, // 是否为斑马纹 table
  loading: false, // 是否添加表格loading加载动画
  highlightCurrentRow: true, // 是否支持当前行高亮显示
  mutiSelect: true, // 是否支持列表项选中功能
  border: true, //是否显示边框
  numbers: true, //是否显示序号
  selectable() {
    //禁用选中
    return true;
  },
  headerCellStyle: { backgroundColor: "#FFF" }, //表头颜色
});
const handleSizeChange = (pagination) => {
  console.log("pagination", pagination);
};
const handleIndexChange = (pagination) => {
  console.log("pagination", pagination);
};
const handleSelectionChange = (val) => {
  console.log("val:", val);
};
const handleEdit = (index, row) => {
  console.log(" index:", index);
  console.log(" row:", row);
};
const handleDel = (index, row) => {
  console.log(" index:", index);
  console.log(" row:", row);
};
const sortChange = (data) => {
  console.log(data);
};
const changeMsgStatus = (ev, params) => {
  console.log(ev, params);
  list[0].isOpend = !list[0].isOpend;
};
const handleDetail = (params) => {
  console.log(params);
};
</script>

```

## Props

```ts
export default {
  // ...
  props: {
    noStatic: false, // 是否计算表格高度
    options: {
      type: Object,
      default: {
        stripe: false, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: false, // 是否支持当前行高亮显示
        mutiSelect: false, // 是否支持列表项选中功能
        border: false, //是否显示边框
        selectable: () => {
          //是否可以选中
          return false;
        },
      },
    }, // table 表格的控制参数
    total: {
      type: Number,
      default: 0,
    }, // 总数
    list: {
      type: Array,
      default: [], // prop:表头绑定的地段，label：表头名称，align：每列数据展示形式（left, center, right），width:列宽
    }, // 数据列表
    customHeight: {
      //与noStatic一起使用
      type: Number,
      default: 320,
    },
    columns: {
      type: Array,
      default: [], // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
    },
    operates: {
      type: Object,
      defaultt: () => {}, // width:按钮列宽，fixed：是否固定（left,right）,按钮集合 === label: 文本，type :类型（primary / success / warning / danger / info / text），show：是否显示，icon：按钮图标，plain：是否朴素按钮，disabled：是否禁用，method：回调方法
    },
    otherHeight: {
      type: Number,
      default: 180,
    }, // 计算表格的高度
    pagination: {
      type: Object,
      default: null, // 分页参数 === pageSize:每页展示的条数，pageIndex:当前页，pageArray: 每页展示条数的控制集合，默认 _page_array
    },
  },
};
```

## Methods

support all [el-table's methods](https://element-plus.org/zh-CN/#/zh-CN)

## Inspiration

thanks to [Vue2.5 结合 Element UI 之 Table 和 Pagination 组件实现分页](https://juejin.cn/post/6844903555598401544)
