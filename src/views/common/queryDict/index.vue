<template>
  <div v-if="this.dictList" class="dict">
    <template v-if="this.dictList.length">
      <el-select
        v-if="showType === '' || showType === 'select'"
        v-model="dictValue"
        :disabled="disabled"
        clearable
        v-bind="$attrs"
        v-on="$listeners"
      >
        <el-option
          v-for="(dict, index) in dictList"
          :key="dict.value + '_' + index"
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
    </template>
    <template v-else>
      <el-input
        v-model="dictValue"
        clearable
        v-bind="$attrs"
        v-on="$listeners"
      />
    </template>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    dictList: {
      type: Array
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: [Number, String, Array],
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
