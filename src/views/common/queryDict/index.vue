<template>
  <div v-if="this.optionsList" class="dict">
    <template v-if="this.optionsList.length">
      <el-select
        v-if="showType === '' || showType === 'select'"
        v-model="dictValue"
        :disabled="disabled"
        clearable
        v-bind="$attrs"
        v-on="$listeners"
        @change="changeQueryDict"
      >
        <el-option
          v-for="(dict, index) in optionsList"
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
        @change="changeQueryDict"
      >
        <el-checkbox
          v-for="(dict, index) in optionsList"
          :label="dict.value"
          :key="dict.value"
          :disabled="dict.disabled || disabled"
          @change="(checked) => changeCheck(checked, index)"
        >{{dict.label}}</el-checkbox>
      </el-checkbox-group>
      <el-radio-group
        v-if="showType === 'radio'"
        v-model="dictValue"
        v-bind="$attrs"
        v-on="$listeners"
        @change="changeQueryDict"
      >
        <el-radio
          v-for="(dict, index) in optionsList"
          :key="dict.value"
          :disabled="dict.disabled || disabled"
          :label="dict.value"
          @change="(checked) => changeCheck(checked, index)"
        >{{dict.label}}</el-radio>
      </el-radio-group>
    </template>
    <template v-else>
      <el-input
        v-if="showType === '' || showType === 'select'"
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
    }
  },
  data() {
    return {
      checkStatus: false,
      checkIndex: ''
    }
  },
  methods: {
    changeQueryDict(val) {
      let selectedTarget = null
      if (this.showType === '' || this.showType === 'select' || this.showType === 'radio') {
        selectedTarget = this.dictList.find(item => item.value === val)
        this.$emit('ChangeQueryDict', selectedTarget)
      } else {
        selectedTarget = this.dictList.filter(item => val.includes(item.value))
        this.$emit('ChangeQueryDict', selectedTarget, this.checkStatus, this.checkIndex)
      }
    },
    changeCheck(val, index) {
      this.checkStatus = val
      this.checkIndex = index
    }
  },
  computed: {
    dictValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    },
    optionsList() {
      return this.dictList
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
