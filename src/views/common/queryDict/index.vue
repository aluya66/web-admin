<template>
  <div v-if="this.dictList && this.dictList.length" class="dict">
    <el-select
      v-if="showType === '' || showType === 'select'"
      v-model="dictValue"
      :disabled="disabled"
      :multiple="multiple"
      filterable
      clearable
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-option
        v-for="dict in dictList"
        :key="dict.value"
        :label="dict.label"
        :disabled="dict.disabled"
        :value="dict.value"
      ></el-option>
    </el-select>
    <el-checkbox-group
      v-if="showType === 'checkbox'"
      v-model="dictValue"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-checkbox
        v-for="dict in dictList"
        :label="dict.value"
        :key="dict.value"
        :disabled="dict.disabled || disabled"
      >{{dict.label}}</el-checkbox>
    </el-checkbox-group>
    <el-radio-group
      v-if="showType === 'radio'"
      v-model="dictValue"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-radio
        v-for="dict in dictList"
        :key="dict.value"
        :disabled="dict.disabled || disabled"
        :label="dict.value"
      >{{dict.label}}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    dictList: {
      type: Array
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: [Number, String],
    showType: {
      type: String,
      default: 'select'
    },
    dictLob: String
  },
  computed: {
    dictValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.dict {
  display: inline-block;
  .el-select {
    width: 100%;
  }
}
</style>
