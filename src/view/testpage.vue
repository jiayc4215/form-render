<template>
  <div class="test-page">
    <h2>ITable 测试页</h2>

    <ITable
      :columns="columns"
      :tableData="tableData"
      :options="options"
    >
      <!-- slot 示例：default-name -->
      <template #default-name="{ row }">
        <span class="slot-name">{{ row.name }}（slot）</span>
      </template>
    </ITable>
  </div>
</template>

<script setup >
import { ref, h ,resolveComponent} from "vue";
import ITable from "../components/vue3table/index.vue";
const statusRender = (props) => {
let obj = {
  '正常':'success',
  '禁用':'danger',
  '锁定':'info',
}
  return h(resolveComponent('el-tag'), {
  type: obj[props.row.status] || 'primary',
},()=>props.row.status)
};

// 表格列配置
const columns = ([
  {
    type: "selection",
    width: 60,
  },
  {
    label: "名称",
    prop: "name",
    key: "name",
  },
  {
    label: "年龄",
    prop: "age",
    key: "age",
    formatter: (row) => row.age + " 岁",
  },
  {
    label: "地址",
    prop: "address",
    key: "address",
    render:'北京',
  },
  {
    label: "状态",
    prop: "status",
    key: "status",
    render: statusRender,
  },
  {
    show(){
      return true
    },
    label: "是否显示",
    prop: "show",
    key: "show",

  }



]);

// 表格数据
const tableData = ref([
  { name: "张三", age: 18, address: "北京", status: "正常", show: true },
  { name: "李四", age: 25, address: "上海", status: "禁用", show: true },
  { name: "王五", age: 30, address: "广州", status: "锁定", show: true },
]);

// 表格基础配置
const options = {
  border: true,
  stripe: true,
  highlightCurrentRow: true,
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
