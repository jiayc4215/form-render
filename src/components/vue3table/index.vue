<template>
  <div>
    <div>
      <el-table
        id="iTable"
        :data="tableData"
        v-bind="options"
        ref="iTableRef"
        height="100%"
        style="width: 100%"
      >
        <template v-for="(column, index) in newTableHeader">
          <el-table-column
            :min-width="headSpanFit(column)"
            v-bind="column"
            v-if="
              column && column.show
                ? typeof column.show === 'function'
                  ? column.show()
                  : column.show
                : true
            "
            :key="index + 'column'"
          >
 

            <!-- 默认单元格 -->
            <template #default="scope">

              <div v-if="column.render">

                <div
                  v-if="typeof column.render === 'string'"
                  v-html="column.render"
                ></div>
                <component
                  v-else
                  v-bind="scope"
                  :row="scope.row"
                  :index="scope.$index"
                  :is="column.render"
                ></component>
              </div>

              <template v-else-if="column.formatter">
                <span
                  v-html="column.formatter(scope.row, column)"
                ></span>
              </template>

              <template v-else-if="!column.type">
                
                <span>
                  {{
                    scope.row[column.prop] === 0
                      ? 0
                      : scope.row[column.prop] || "--"
                  }}
                </span>
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUpdate, } from "vue";

// ----------- 纯 JS defineProps ----------
const props = defineProps({
  columns: {
    default: () => [],
  },
  tableData: {
    default: () => [],
  },
  options: {
    default: () => ({
      stripe: false,
      highlightCurrentRow: false,
      mutiSelect: false,
      border: true,
    }),
  },
});


const newTableHeader = ref([]);

// 自动计算列宽
function headSpanFit(column) {
  const labelLong = column.label ? column.label.length : 0;
  const size = 20;
  return labelLong * size < 100 ? 100 : labelLong * size;
}

/**
 * 生成新的表头配置（支持默认字段、插槽匹配）
 */
const genNewTableHeader = () => {
  newTableHeader.value = props.columns.map((col) => {
    if (typeof col !== "object") return col;

    // 1. 默认 key
    col.key ??= col.prop;

    // 2. 默认 prop（非 selection）
    if (!col.prop && col.type !== "selection") col.prop = col.prop;

 

    return col;
  });
};






onMounted(genNewTableHeader);
onBeforeUpdate(genNewTableHeader);
</script>

<style scoped lang="scss">

</style>
