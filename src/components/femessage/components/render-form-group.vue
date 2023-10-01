<template>
  <div>
    <template v-for="(item, index) in data.items">
      <slot :name="`id:${item.id}`" />
      <slot :name="`$id:${item.id}`" />

      <render-form-item :ref="`formItem-${item.id}`" :prop="`${data.id}.${item.id}`" :data="item" :value="value"
        :item-value="itemValue[item.id]" :disabled="disabled" :readonly="readonly" :options="options[item.id]"
        @updateValue="updateValue" />
    </template>
  </div>
</template>
<script setup>
import RenderFormItem from './render-form-item.vue'
const emit = defineEmits(["updateValue"]);
let props = defineProps({
  data: Object,
  itemValue: {},
  value: Object,
  disabled: Boolean,
  readonly: Boolean,
  options: Object,
})
const updateValue = ({ id, value }) => {
  emit('updateValue', {
    id: props.data.id,
    value: {
      ...props.itemValue,
      [id]: value,
    }
  })
}
</script>