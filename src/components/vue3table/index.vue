<template>
  <div>
    <el-table
      v-bind="options"
      :data="tableData"
      height="100%"
      style="width: 100%"
      ref="tableRef"
    >
      <template v-for="item in columns" :key="item.prop">
        <el-table-column
          v-bind="item"
          v-if="
            item.show === undefined
              ? true
              : typeof item.show === 'function'
              ? item.show(item)
              : item.show
          "
        >
          <template #default="scope">
            <div v-if="item.render">
              <div
                v-if="typeof item.render === 'string'"
                v-html="item.render"
              ></div>
              <component
                v-else
                :is="item.render"
                :row="scope.row"
                :index="scope.$index"
                v-bind="scope"
              ></component>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script setup>
let props = defineProps({
  /**
   * 表格列配置
   */
  columns: {
    default: () => [],
  },
  /**
   * 表格数据
   */
  tableData: {
    default: () => [],
  },
  /**
   * 表格选项配置
   */
  options: {
    default: () => ({
      stripe: false,
      highlightCurrentRow: false,
      border: false,
    }),
  },
});
</script>

<style scoped lang="scss"></style>
