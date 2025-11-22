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
          <template
            v-for="(slotName, slotKey) in item.slots"
            :key="slotKey"
            #[slotKey]="scope"
          >
            <slot :name="slotName" v-bind="scope"></slot>
          </template>
          <template #default="scope" v-if="!item.slots">
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
import { ref, onMounted, useSlots } from "vue";
const newColumns = ref([]);
const slots = useSlots();
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
  const slotsKeys = Object.keys(slots);

  newColumns.value = props.columns.map((item) => {
    for (const key of slotsKeys) {
      const res = key.match(/^(\S+)-(\S+)/);

      if (res && res[2] === item.prop) {
        if (!item.slots) {
          item.slots = {};
        }
        item.slots[res[1]] = res[0];
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
