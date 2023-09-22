<template>
  <input type="text" :value="value" @input="onInput" />
</template>

<script>
export default {
  rules: [
    {
      required: true,
      message: "自定义组件的提醒消息",
    },
  ],
  props: ["value"],
  methods: {
    onInput(val) {
      this.$emit("input", val);
    },
  },
};
</script>
