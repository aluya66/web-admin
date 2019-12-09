<template>
  <el-cascader
    :class="bem()"
    v-model="data"
    :options="options"
    :props="props"
    v-bind="$attrs"
    v-on="$listeners"
    clearable
  ></el-cascader>
</template>
<script>
import create from 'utils/create'
export default create({
  name: 'cascader',
  props: {
    options: { // 源数据集合
      type: Array,
      required: true
    },
    props: { // 配置项
      type: Object
    },
    value: Array
  },
  computed: {
    data: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  }
})
</script>
