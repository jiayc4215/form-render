<template>
  <div>
    <el-table
      id="iTable"
      ref="mutipleTable"
      v-loading="options.loading"
      :row-class-name="tableRowClassName"
      :header-cell-style="getRowClass"
      :border="options.border"
      :data="list"
      :height="noStatic ? customHeight : height"
      :max-height="noStatic ? customHeight : height"
      v-bind="options"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <!--region 选择框-->
      <el-table-column
        v-if="options.mutiSelect"
        type="selection"
        style="width: 60px"
        :selectable="options.selectable"
      >
      </el-table-column>
      <!--endregion-->
      <!--region 序号-->
      <el-table-column
        v-if="options.numbers"
        width="60"
        type="index"
        label="序号"
        align="center"
      ></el-table-column>
      <!--endregion-->
      <!--region 数据列-->
      <template v-for="(column, index) in columns">
        <el-table-column
          v-if="isShowColumn(column)"
          :min-width="headSpanFit(column)"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :align="column.align"
          :width="column.width"
          v-bind="column.el"
        >
          <template #default="scope">
            <template v-if="!column.render">
              <template v-if="column.formatter">
                <span v-html="column.formatter(scope.row, column)"></span>
              </template>
              <template v-else>
                <span>
                  {{ scope.row[column.prop] === 0 ? 0 : scope.row[column.prop] || "--" }}
                </span>
              </template>
            </template>
            <template v-else>
              <expandDom
                :column="column"
                :row="scope.row"
                :render="column.render"
                :index="index"
              >
              </expandDom>
            </template>
          </template>
        </el-table-column>
      </template>
      <!--endregion-->
      <!--region 按钮操作组-->
      <el-table-column
        ref="fixedColumn"
        label="操作"
        align="center"
        :width="operates && operates.width"
        :fixed="operates && operates.fixed"
        v-if="operates && operates.list.length > 0"
      >
        <template #default="scope">
          <expand-dom :row="scope.row" :render="renderOperates" :index="scope.$index">
          </expand-dom>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 12px"></div>
    <!--region 分页-->
    <el-pagination
      v-if="pagination"
      :pager-count="5"
      @size-change="handleSizeChange"
      @current-change="handleIndexChange"
      v-model:page-size="pagination.pageSize"
      :page-sizes="pagination.pageSizes || pageArray"
      v-model:current-page="pagination.pageIndex"
      layout="->,total,sizes, prev, pager, next,jumper"
      :total="total"
      :background="pagination.background || false"
    />
    <!--endregion-->
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  h,
  resolveComponent,
  onActivated,
  onMounted,
  nextTick,
  onBeforeUnmount,
  onDeactivated,
} from "vue";

import expandDom from "./expandDom.vue";
import { debounce } from "./utils/index";
const pageArray = reactive([10, 20, 30, 50]); // 每页展示条数的控制集合
const props = defineProps({
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
});
const emit = defineEmits([
  "handleSelectionChange",
  "sortChange",
  "handleSizeChange",
  "handleIndexChange",
]);
const mutipleTable = ref("");
let height = ref(250);
let multipleSelection = reactive([]);
let $_resizeHandler = null;
// 通常是在使用 Vue.js 的 <keep-alive> 包装时，组件会被缓存并在重新激活时调用这个钩子函数。
onActivated(() => {
  if (!$_resizeHandler) {
    // 避免重复初始化;
    initListener();
  }
  resize();
});
//当组件即将被销毁时，会调用这个钩子函数。
onBeforeUnmount(() => {
  destroyListener();
});
//当组件被停用，通常也是在 <keep-alive> 包装下，组件会调用这个钩子函数。
onDeactivated(() => {
  destroyListener();
});
// 页面挂载完毕
onMounted(() => {
  initListener();
});
//这是一个销毁监听器的方法。
const destroyListener = () => {
  window.removeEventListener("resize", $_resizeHandler);
  $_resizeHandler = null;
};
// 初始化监听器的方法。(监听窗口变化，计算表格高度)
const initListener = () => {
  $_resizeHandler = debounce(() => {
    resize();
  }, 200);
  window.addEventListener("resize", $_resizeHandler);
  nextTick(() => {
    resize();
  });
};
//计算表格的高度
const resize = () => {
  //  不用计算
  if (props.noStatic) {
    return;
  }
  // 表格的高度的值等于以下几个部分的差：
  // window.innerHeight：表示浏览器窗口的高度。
  // mutipleTable.value.$el.offsetTop，它表示了表格元素距离其最近的已定位（positioned）祖先元素的顶部的像素距离。
  //  props.otherHeight，传入的其他高度
  // 所以，staticHeight的值实际上是浏览器窗口高度减去表格元素顶部距离浏览器窗口顶部的距离再减去props对象中其他元素的值。

  let staticHeight =
    window.innerHeight - mutipleTable.value.$el.offsetTop - props.otherHeight;
  height.value = staticHeight < 250 ? 250 : staticHeight;

  //保表格的布局在高度调整后得以更新。
  //doLayout：对 Table 进行重新布局。 当表格可见性变化时，您可能需要调用此方法以获得正确的布局
  mutipleTable.value && mutipleTable.value.doLayout();
};
// 每一行的样式
const tableRowClassName = ({ rowIndex }) => {
  if (rowIndex % 2 === 0) {
    return "warning-row";
  } else if (rowIndex % 2 === 1) {
    return "success-row";
  }
  return "";
};
// 校验权限
const rebuildList = ({ row }) => {
  // 检查 operates 是否为空对象
  if (!props.operates || !props.operates.list || !Array.isArray(props.operates.list)) {
    return [];
  }
  // 过滤操作项
  return props.operates.list.filter((item) => {
    // 如果定义了 show 函数，则根据该函数的返回值来决定是否显示
    if (typeof item.show === "function") {
      return item.show(row);
    }

    // 如果 show 是布尔值且为 true，则显示
    if (typeof item.show === "boolean" && item.show) {
      return true;
    }

    // 如果定义了权限要求，则检查权限

    // 默认允许显示
    return true;
  });
};
// 渲染外部按钮
const renderOutsideButton = (item, params) => {
  return h(
    resolveComponent("el-button"),
    {
      // 组件的属性（数据）
      type: item.type || "primary", //类型
      plain: item.plain || false, //plain：是否朴素按钮
      link: item.link || false, //type=“text”已弃用，将在3.0.0中删除，请考虑切换到新的API。在2.2.1中添加了新的APIlink，您可以使用类型API来设置link按钮的主题
      size: item.size || "small", //大小
      // 组件的属性（html属性）
      title: item.label, //label: 文本
      // 样式
      color: item.color,
      // 按钮的点击事件处理函数
      onClick: () => {
        item.method(params.index, params.row);
      },
    },
    // 判断是否线上图标
    () => [
      item.icon
        ? [
            item.label,
            h(resolveComponent("el-icon"), { class: "el-icon--right" }, () => [
              h(resolveComponent(item.icon)),
            ]),
          ]
        : item.label,
    ] //label: 文本
  );
};

// 渲染下拉按钮
const renderDropdownButton = (insideArr, params) => {
  return h(
    // 创建了一个 "el-dropdown" 组件
    resolveComponent("el-dropdown"),
    // dropdown 样式
    {
      class: ["custom-dropdown"],
      // 组件的属性（数据）：
      trigger: "click", //下拉框点击触发
    },
    {
      default: () =>
        h(
          resolveComponent("el-button"),
          {
            // 按钮样式
            style: {
              fontSize: "18px",
            },
            // 按钮类名
            class: ["custom-text"],
            link: true,
            plain: false,
            size: "small",
          },
          // 在按钮的内容中，使用了一个 "i" 标签，其 class 属性为 "el-icon-more"，显示一个图标。
          () => h(resolveComponent("el-icon"), () => [h(resolveComponent("MoreFilled"))])
        ),
      // 创建了一个 "el-dropdown-menu" el-dropdown-item" 组件
      dropdown: () =>
        h(resolveComponent("el-dropdown-menu"), null, () =>
          insideArr.map((item) => {
            return h(
              resolveComponent("el-dropdown-item"),
              {
                onclick: () => {
                  item.method(params.index, params.row);
                },
              },

              () => item.label
            );
          })
        ),
    }
  );
};
// 用于渲染操作按钮的方法
const renderOperates = (params) => {
  const endArr = rebuildList(params); //权限验证后最终按钮数组

  let outSideBtnArr = endArr.slice(0, 2); //外部按钮 默认前两个
  let insideArr = endArr.slice(2); //下拉菜单按钮数组
  const buttonArr = []; //最终渲染数组

  outSideBtnArr.forEach((item) => {
    buttonArr.push(renderOutsideButton(item, params));
  });

  if (insideArr.length > 0) {
    buttonArr.push(renderDropdownButton(insideArr, params));
  }

  return h("div", { class: "operate-group" }, buttonArr);
};

// 表头样式
const getRowClass = ({ rowIndex }) => {
  if (rowIndex == 0) {
    return props.options.headerCellStyle || "";
  } else {
    return " ";
  }
};
// 多行选中
const handleSelectionChange = (val) => {
  multipleSelection = val;
  emit("handleSelectionChange", val);
};
// 排序
const sortChange = ({ column, prop, order }) => {
  emit("sortChange", { column, prop, order });
};
// 判断列的数据是否显示
const isShowColumn = (column) => {
  if (column.show === undefined) {
    return true;
  }
  if (typeof column.show !== "function") {
    return column.show;
  }
  return column.show(column);
};
//计算小列宽
const headSpanFit = (column) => {
  let labelLong = column.label.length; // 表头label长度
  let size = 20; // 根据需要定义标尺，直接使用字体大小确定就行，也可以根据需要定义
  let minWidth = labelLong * size < 100 ? 100 : labelLong * size; // 根据label长度计算该表头最终宽度
  return minWidth;
};
// 切换每页显示的数量
const handleSizeChange = (size) => {
  if (props.pagination) {
    emit("handleSizeChange", { ...props.pagination });
  }
};
// 切换页码
const handleIndexChange = (currnet) => {
  if (props.pagination) {
    emit("handleIndexChange", { ...props.pagination });
  }
};
</script>
<style lang="scss">
.table {
  height: 100%;

  .el-pagination {
    float: right;
    margin: 20px;
  }

  .el-table__header-wrapper,
  .el-table__fixed-header-wrapper {
    thead {
      tr {
        th {
          color: #333333;
        }
      }
    }
  }

  .el-table-column--selection .cell {
    padding: 0;
    text-align: center;
  }

  .el-table__fixed-right {
    bottom: 0 !important;
    right: 6px !important;
    z-index: 1004;
  }

  .operate-group {
    display: flex;
    flex-wrap: wrap;

    .item {
      margin-top: 4px;
      margin-bottom: 4px;
      display: block;
      flex: 0 0 50%;
    }
  }

  .filter-data {
    top: e("calc((100% - 100px) / 3)");
    background-color: rgba(0, 0, 0, 0.7);
  }

  .table-action {
    top: e("calc((100% - 100px) / 2)");
    background-color: rgba(0, 0, 0, 0.7);
  }

  .fix-right {
    position: absolute;
    right: 0;
    height: 100px;
    color: #ffffff;
    width: 30px;
    display: block;
    z-index: 1005;
    writing-mode: vertical-rl;
    text-align: center;
    line-height: 28px;
    border-bottom-left-radius: 6px;
    border-top-left-radius: 6px;
    cursor: pointer;
  }

  .custom-dropdown {
    color: #666;

    &:hover {
      color: inherit;
    }
  }

  .operate-group {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;

    .item {
      margin-right: 2px;
      display: block;
      flex: 0 1 auto;
    }
  }

  .el-button--text.custom-text {
    span {
      vertical-align: middle;
    }

    color: #666;

    &:hover {
      color: #66b1ff;
    }
  }
}
</style>
