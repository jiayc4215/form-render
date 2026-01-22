<template>
  <el-input
    v-bind="$attrs"
    :model-value="version"
    class="semver-input"
    :class="{ 'is-error': !isValid }"
    @input="handelInput"
    @blur="handleBlur"
  >
  </el-input>
</template>

<script>
/**
 * 版本号正则
 */
const VERSION_PATTERN = /^v?([1-9]\d*|0)\.([1-9]\d*|0)\.([1-9]\d*|0)$/

// 默认版本
const NONSENSE_VERSION = "0.0.0"
const MIN_VERSION = "0.0.1"
const DEFAULT_VERSION = "1.0.0"
const v = "v"

// 自动填充规则
const autoPaddingRegularListDefault = [
  {
    regular: VERSION_PATTERN,
    padding: ""
  },
  {
    regular: /^v?([1-9]\d*|0)\.([1-9]\d*|0)\.$/,
    padding: "0"
  },
  {
    regular: /^v?([1-9]\d*|0)\.([1-9]\d*|0)$/,
    padding: ".0"
  },
  {
    regular: /^v?([1-9]\d*|0)\.$/,
    padding: "0.0"
  },
  {
    regular: /^v?([1-9]\d*|0)$/,
    padding: ".0.0"
  },
  {
    regular: /^v?$/,
    padding: DEFAULT_VERSION
  }
]

const autoFixRegular = [
  {
    regular: /^v?([1-9]\d*|0)\.([1-9]\d*|0)\.0+$/,
    fixStr(str) {
      let stringList = str.split(".")
      let last = stringList.length - 1
      stringList[last] = stringList[last].replace(/^0+/, "0")
      return stringList.join(".")
    }
  },
  {
    regular: /^v?([1-9]\d*|0)\.([1-9]\d*|0)\.0+[1-9]\d*$/,
    fixStr(str) {
      let stringList = str.split(".")
      let last = stringList.length - 1
      stringList[last] = stringList[last].replace(/^0+/, "")
      return stringList.join(".")
    }
  },
  {
    regular: /^v?([1-9]\d*|0)\.([1-9]\d*|0)\.\d+\.(.*)$/,
    fixStr(str) {
      return str.split(".").slice(0, 3).join(".")
    }
  }
]
</script>

<script setup>
import { ref, watch, nextTick } from "vue"

defineOptions({
  name: "ElSemverInput"
})

const props = defineProps({
  modelValue: {
    type: String
  },
  preventIllegal: {
    type: Boolean,
    default: true
  },
  autoPadding: {
    type: Boolean,
    default: true
  },
  prefix: {
    type: Boolean,
    default: true
  },
  validRegular: {
    type: RegExp,
    default: () => VERSION_PATTERN
  },
  autoPaddingRegularList: {
    type: Array,
    default: () => autoPaddingRegularListDefault
  }
})

const emit = defineEmits(["update:modelValue", "validChange", "input"])

// Data
const version = ref(props.modelValue)
const isValid = ref(true)

// Watch
watch(
  () => props.modelValue,
  data => {
    version.value = data
  }
)

// Methods
const checkVersionVaild = (ver = "") => {
  return ver.split(".").some(item => item != 0) && props.validRegular.test(ver)
}

const updateValue = val => {
  emit("update:modelValue", val)
  emit("input", val)
}

const updateValid = valid => {
  emit("validChange", valid)
  isValid.value = valid
}

const notify = ({ value, isValid: valid = true }) => {
  updateValue(value)
  updateValid(valid)
}

const setDefaultVersion = () => {
  notify({
    value: props.prefix ? v + DEFAULT_VERSION : DEFAULT_VERSION
  })
}

const handelInput = (e = "") => {
  let hasV = false
  if (props.preventIllegal) {
    // 修复点：[^\d\.] 改为 [^\d.]，去掉了不必要的转义符
    e = e.replace(/[^\d.]/g, function (data) {
      if (data == v && e.startsWith(v) && !hasV) {
        hasV = true
        return v
      }
      return ""
    })
  }

  let value = props.prefix && e.length > 0 && !e.startsWith(v) ? v + e : e
  let isValidStatus = checkVersionVaild(value)

  nextTick(() => {
    notify({ value, isValid: isValidStatus })
  })
}

const handleBlur = () => {
  let originValue = version.value || ""

  let matchPaddingRegular = props.autoPaddingRegularList.find(item => {
    return item.regular.test(originValue)
  })

  if (props.autoPadding && matchPaddingRegular) {
    let paddedValue = originValue + matchPaddingRegular.padding
    paddedValue = paddedValue.replace(NONSENSE_VERSION, MIN_VERSION)
    paddedValue = props.prefix && !paddedValue.startsWith(v) ? v + paddedValue : paddedValue

    notify({ value: paddedValue })
    return
  }

  let matchFixRegular = autoFixRegular.find(item => {
    return item.regular.test(originValue)
  })

  if (matchFixRegular) {
    let fixValue = matchFixRegular.fixStr(originValue)
    notify({ value: fixValue })
    return
  }

  if (!checkVersionVaild(originValue)) {
    setDefaultVersion()
  }
}
</script>

<style lang="scss"></style>
