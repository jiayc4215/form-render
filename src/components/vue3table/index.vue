<template>
  <div>
    <el-table
      v-bind="options"
      :data="tableData"
      height="100%"
      style="width: 100%"
      ref="tableRef"
    >
      <template v-for="item in newColumns" :key="item.prop">
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
          <template v-for="(value, key) in item.slot" #[key]="scope">
            <slot :name="value" v-bind="scope"> </slot>
          </template>
          <template #default="scope" v-if="!item.slot">
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
            <template v-else-if="!item.type && !item.formatter">
              <span>{{
                scope.row[item.prop] === 0 ? 0 : scope.row[item.prop] || "--"
              }}</span>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script setup>
import { useSlots, onMounted, ref } from "vue";
let slots = useSlots();
let newColumns = ref([]);
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
const createColumns = () => {
  newColumns.value = props.columns.map((item) => {
    const slotKeys = Object.keys(slots);
    for (let key of slotKeys) {
      const res = key.match(/^(\S+)-(\S+)/);
      if (res && res[2] == item.prop) {
        if (!item.slot) {
          item.slot = {};
        }
        item.slot[res[1]] = res[0];
      }
    }

    return item;
  });
};
onMounted(() => {
  createColumns();
});
</script>

<style scoped lang="scss"></style>
