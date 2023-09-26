<template>
  <div>
    <el-form-item
      v-if="_show"
      :label="typeof data.label === 'string' ? data.label : ''"
      :rules="!readonly && Array.isArray(data.rules) ? data.rules : undefined"
      v-bind="data.attrs"
      class="render-form-item"
    >
      <!-- label -->
      <!-- <v-node v-if="typeof data.label !== 'string'" slot="label" :content="data.label" /> -->
      <!--只读 input select -->
      <template v-if="readonly && hasReadonlyContent">
        <el-input
          v-if="data.type === 'input'"
          v-bind="componentProps"
          :value="itemValue"
          readonly
          v-on="listeners"
        />
        <div v-else-if="data.type === 'select'">
          <template> {{ multipleValue }} </template>
        </div>
      </template>
      <custom-component
        v-else
        ref="customComponent"
        :component="data.component || `el-${data.type || 'input'}`"
        v-bind="componentProps"
        :value="itemValue"
        :disabled="disabled || componentProps.disabled || readonly"
        v-on="listeners"
      >
      </custom-component>
    </el-form-item>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated, watch, onUnmounted, reactive } from "vue";
import { noop } from "../util/utils";
import getEnableWhenStatus from "../util/enable-when";
import _includes from "lodash.includes";
import _topairs from "lodash.topairs";
import _frompairs from "lodash.frompairs";
import _get from "lodash.get";
import CustomComponent from "../util/CustomComponent";
let props = defineProps({
  data: Object,
  prop: String,
  itemValue: {},
  value: Object,
  disabled: Boolean,
  readonly: Boolean,
  options: Array,
});
let propsInner = reactive({});
const componentProps = computed(() => ({ ...props.data.el, ...propsInner }));
const hasReadonlyContent = computed(() => ["input", "select"].includes(props.data.type));
const hiddenStatus = computed(() => {
  const hidden = props.data.hidden || (() => false);
  return hidden(props.data.value, props.data);
});
const enableWhenStatus = computed(() =>
  getEnableWhenStatus(props.data.enableWhen, props.data.value)
);
const multipleValue = ({ data, itemValue, options = [] }) => {
  const multipleSelectValue =
    _get(data, "el.multiple") && Array.isArray(itemValue) ? itemValue : [itemValue];
  return multipleSelectValue
    .map((val) => (options.find((op) => op.value === val) || {}).label)
    .join();
};

const _show = computed(() => !hiddenStatus.value && enableWhenStatus.value);
</script>

<script>
export default {
  data() {
    return {
      isBlurTrigger:
        this.data.rules &&
        this.data.rules.some((rule) => {
          return rule.required && rule.trigger === "blur";
        }),
    };
  },
  computed: {
    listeners() {
      try {
        const {
          data: {
            id,
            atChange = noop,
            on = {},
            on: { input: originOnInput = noop, change: originOnChange = noop } = {},
            trim = true,
          },
          $parent: {
            $parent: { updateForm },
          },
        } = this;
        return {
          ..._frompairs(
            _topairs(on).map(([eName, handler]) => [
              eName,
              (...args) => handler(args, updateForm),
            ])
          ),
          // 手动更新表单数据
          input: (value, ...rest) => {
            // console.log(value);
            this.$emit("updateValue", { id, value });
            // 更新表单时调用
            try {
              atChange(id, value);
              originOnInput([value, ...rest], updateForm);

              // FIXME: rules 的 trigger 只写了 blur，依然会在 input 的时候触发校验！
              this.triggerValidate(id);
            } catch (error) {
              console.log(error);
            }
          },
          change: (value, ...rest) => {
            if (typeof value === "string" && trim) value = value.trim();
            this.$emit("updateValue", { id, value });
            originOnChange([value, ...rest], updateForm);

            // FIXME: rules 的 trigger 只写了 blur，依然会在 change 的时候触发校验！
            this.triggerValidate(id);
          },
        };
      } catch (error) {
        console.log(error);
      }
      try {
      } catch (error) {
        console.log(error);
      }
    },
  },
  methods: {
    triggerValidate(id) {
      console.log(id);
      try {
        console.log(this.data);
        if (!this.data.rules || !this.data.rules.length) return;

        if (this.isBlurTrigger) return;
        this.$nextTick(() => {
          this.elForm && this.elForm.validateField(id);
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
