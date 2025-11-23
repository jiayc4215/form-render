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
      <!-- 操作列 -->
      <el-table-column
        v-if="operates.list && operates.list.length"
        label="操作"
        align="left"
        :width="operates.width"
        :fixed="operates.fixed"
      >
        <template #default="scope">
          <div class="operate-group">
            <!-- ====== 外部按钮（前两个） ====== -->
            <template
              v-for="(item, index) in getVisibleButtons(scope.row, scope.$index)
                .outside"
              :key="item.label"
            >
              <el-button
                v-bind="item.props"
                @click="item.method(scope.row, scope.$index)"
              >
                <!-- 图标 -->
                <el-icon v-if="item.icon">
                  <component :is="item.icon" />
                </el-icon>
                <!-- 文本 -->
                <span>{{ item.label }}</span>
              </el-button>
            </template>

            <!-- ====== 下拉（超出部分） ====== -->
            <el-dropdown
              v-if="getVisibleButtons(scope.row, scope.$index).inside.length"
              trigger="click"
              class="custom-dropdown"
            >
              <!-- 下拉按钮 -->
              <el-button size="small" link>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <!-- 下拉菜单 -->
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- 下拉菜单项目 渲染超出的按钮 -->
                  <el-dropdown-item
                    v-for="item in getVisibleButtons(scope.row, scope.$index)
                      .inside"
                    :key="item.label"
                    @click="item.method(scope.row, scope.$index)"
                  >
                    <div style="display: flex; align-items: center">
                      <!-- 图标 -->
                      <el-icon v-if="item.icon" style="margin-right: 4px">
                        <component :is="item.icon" />
                      </el-icon>
                      <!-- 文本 -->
                      <span>{{ item.label }}</span>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
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
  /**
   * 表格操作配置
   */
  operates: {
    default: () => ({
      width: 300, // 操作列宽度
      fixed: false, // 是否固定在右侧
      list: [], // 操作列配置列表
    }),
  },
});
// 计算按钮可见性 & 拆分外部 / 内部
const getVisibleButtons = (row, index) => {
  // 1. 过滤 show 条件
  const visibleList = props.operates.list.filter((item) => {
    if (item.show === undefined) return true;
    if (typeof item.show === "function") return item.show(row, index);
    return item.show;
  });

  // 2. 超过 3 个 → 前两个显示，其余折叠
  if (visibleList.length > 3) {
    return {
      outside: visibleList.slice(0, 2),
      inside: visibleList.slice(2),
    };
  }

  // 3. 不超过 3 个 → 全部外部显示
  return {
    outside: visibleList,
    inside: [],
  };
};

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
