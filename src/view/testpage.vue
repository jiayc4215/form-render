<template>
  <div class="test-page">
    <h2>ITable 分页测试页</h2>

    <ITable
      :columns="columns"
      :tableData="tableData"
      :options="options"
      :operates="tableOperates"
      :isShowPagination="true"
      :paginationConfig="paginationConfig"
      :total="pagination.total"
      v-model:page="pagination.page"
      v-model:pageSize="pagination.pageSize"
      @pagination="loadData"
    >
      <!-- 开关列插槽 -->
      <template #default-switch="{ row }">
        <el-switch v-model="row.switch" />
      </template>

      <template #header-switch>
        <el-icon>
          <Edit />
        </el-icon>
        <span>开关</span>
      </template>
    </ITable>
  </div>
</template>

<script setup>
import { ref, h, resolveComponent, onMounted } from "vue";
import ITable from "../components/vue3table/index.vue";

// 分页配置

const paginationConfig = {
  layout: "total, sizes, prev, pager, next, jumper", // 分页组件布局
  pageSizes: [10, 20, 50, 100], // 每页条数选项
  background: true, // 是否显示分页组件背景
};

// 分页数据

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});

// 表格数据

const tableData = ref([]);

// 模拟接口（分页）

const mockRequest = (page, pageSize) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 造 100 条假数据
      const all = Array.from({ length: 100 }).map((_, i) => ({
        id: i + 1,
        name: "用户 " + (i + 1),
        age: 18 + ((i + 1) % 20),
        address: ["北京", "上海", "广州"][i % 3],
        status: ["success", "danger", "info"][i % 3],
        show: true,
        switch: Math.random() > 0.5,
      }));

      const start = (page - 1) * pageSize;
      const list = all.slice(start, start + pageSize);

      resolve({
        list,
        total: all.length,
      });
    }, 400);
  });
};

// 加载数据（翻页时调用）

const loadData = async () => {
  const { page, pageSize } = pagination.value;

  console.log(page, pageSize);
  const res = await mockRequest(page, pageSize);

  tableData.value = res.list;
  pagination.value.total = res.total;
};

// 监听分页变化

// 首次加载
onMounted(() => {
  loadData();
});

// 列配置

const statusRender = (props) => {
  return h(
    resolveComponent("el-tag"),
    { type: props.row.status },
    () => props.row.status
  );
};

const columns = [
  { type: "selection", width: 60 },
  { label: "名称", prop: "name" },
  { label: "年龄", prop: "age", formatter: (row) => row.age + " 岁" },
  { label: "地址", prop: "address" },
  { label: "状态", prop: "status", render: statusRender },
  { label: "开关", prop: "switch" },
];

// 操作列配置

const tableOperates = {
  width: 300,
  fixed: "right",
  list: [
    {
      icon: "Edit",
      label: "编辑",
      props: { type: "primary", link: true },
      show: (row) => row.switch,
      method: (row) => console.log("编辑", row),
    },
    {
      icon: "Edit",
      label: "详情",
      props: { type: "primary", link: true },
      show: true,
      method: (row) => console.log("详情", row),
    },
    {
      icon: "Edit",
      label: "禁用",
      props: { type: "danger", link: true },
      show: true,
      method: (row) => console.log("禁用", row),
    },
    {
      icon: "Edit",
      label: "更多操作",
      props: { type: "success", link: true },
      show: true,
      method: (row) => console.log("更多操作", row),
    },
  ],
};

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
</style>
