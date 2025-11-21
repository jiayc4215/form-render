<template>
  <div class="test-page">
    <h2>ITable 测试页</h2>

    <!-- { slots: { "default": "default-switch", header:"header-switch"} } 
    const res = key.match(/^(\S+)-(\S+)/);  
    -->
    <ITable :columns="columns" :tableData="tableData" :options="options">
      <template #default-switch="{ row }">
        <el-switch v-model="row.switch" />
      </template>
      <template #header-switch="{ row }">
        <el-icon>
          <edit />
        </el-icon>
        <span>开关</span>
      </template>
    </ITable>
  </div>
</template>

<script setup>
import { ref, h, resolveComponent } from "vue";
import ITable from "../components/vue3table/index.vue";

const statusRender = (props) => {
  return h(
    resolveComponent("el-tag"),
    {
      type: props.row.status || "primary",
    },
    () => props.row.status
  );
};

// 表格列配置
const columns = [
  {
    type: "selection",
    width: 60,
  },
  {
    label: "名称",
    prop: "name",
  },
  {
    label: "年龄",
    prop: "age",
    formatter: (row) => row.age + " 岁",
  },
  {
    label: "地址",
    prop: "address",
    render: "<a style='color: #409eff;' href='#'> 111 </a>",
  },
  {
    label: "状态",
    prop: "status",
    render: statusRender,
  },
  {
    show: () => {
      return false;
    },
    label: "是否显示",
    prop: "show",
  },
  {
    label: "开关",
    prop: "switch",
  },
];

// 表格数据
const tableData = ref([
  {
    name: 0,
    age: 18,
    address: "北京",
    status: "success",
    show: true,
    switch: true,
  },
  {
    name: "",
    age: 25,
    address: "上海",
    status: "danger",
    show: true,
    switch: false,
  },
  {
    name: "王五",
    age: 30,
    address: "广州",
    status: "info",
    show: true,
    switch: true,
  },
]);

// 表格基础配置
const options = {
  border: true, // 是否显示边框
  stripe: true, // 是否显示斑马纹
  highlightCurrentRow: true, // 是否高亮当前行
};
</script>

<style scoped>
.test-page {
  padding: 20px;
}

.slot-name {
  color: #409eff;
  font-weight: bold;
}

.status-render {
  color: #67c23a;
}
</style>
