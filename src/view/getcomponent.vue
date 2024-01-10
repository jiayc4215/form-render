<template>
  <div>
    <el-form-renderer :content="content" ref="form" class="render-form">
    </el-form-renderer>
    <el-button @click="getComponent('id')">获取id input</el-button>
    <el-button @click="getComponent('first')">获取first name input</el-button>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import elFormRenderer from "../components/femessage/el-form-renderer.vue";

const form = ref();
const content = reactive([
  {
    id: "id",
    type: "input",
    label: "id",
    el: {
      placeholder: "id",
    },
  },
  {
    type: "group",
    label: "name",
    id: "name",
    items: [
      {
        id: "first",
        label: "first name",
        type: "input",
      },
      {
        id: "last",
        label: "last name",
        type: "input",
      },
    ],
  },
]);
const getComponent = (id) => {
  console.log(form.value.getComponentById(id));
};
</script>
<style scoped lang='scss'>
.box {
  margin: 20px 0;
  font-size: 20px;
}
.render-form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex-shrink: 0;
  flex-grow: 0;
  background: #fff;
  margin: -20px -20px 20px;
  padding: 20px 20px 0;
  gap: 0 calc(4% / 4);

  &.is-dialog .el-form-item__label {
    min-width: 100px;
    text-align: justify;
    text-align-last: justify;
  }

  &.is-position-top {
    > .el-form-item {
      flex-wrap: wrap;

      .el-form-item__label {
        width: 100%;
      }

      .el-form-item__content {
        flex: 1;
        width: 100%;
        margin-left: 0 !important;
      }
    }
  }

  // justify-content: space-between;
  > .el-form-item {
    width: 18%;
    min-width: 300px;
    display: flex;
    flex-shrink: 0;
    flex-grow: 0;

    &:last-child {
      width: auto;
      // min-width: 180px;
    }

    &.date-range {
      width: 440px;
    }

    .el-form-item__content {
      flex: 1;
      margin-left: 0 !important;

      .el-date-editor--datetimerange.el-input,
      .el-date-editor--datetimerange.el-input__inner {
        width: 100%;
      }
    }
  }
}
</style>
