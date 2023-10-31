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
import appTable from "../components/i-table/table.vue";
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
