<template>
  <el-form
    ref="formModel"
    :class="bem()"
    :inline="true"
    :model="formModel"
    :label-width="labelWidth"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-form-item
      v-for="(item, index) in formItems"
      :key="index"
      :label="item.label"
      :label-width="item.labelWidth"
      :prop="item.prop"
    >
      <template v-if="item.type === 'select'">
        <el-select
          v-model.trim="formModel[item.prop]"
          class="search-item"
          :size="size"
          clearable
          :disabled="item.disabled"
          :placeholder="item.label || '请选择'"
        >
          <el-option
            v-for="val in item.optionsList"
            :key="val.label +'_'+ val.value"
            :label="val.label"
            :value="val.value"
          ></el-option>
        </el-select>
      </template>
      <template v-else-if="item.type === 'dict'">
        <query-dict
          :allow-create="item.allowCreate"
          :filterable="item.filterable"
          :multiple="item.multiple"
          :disabled="item.disabled"
          :size="size"
          :value.sync="formModel[item.prop]"
          :dict-list="item.optionsList"
          class="search-item"
          :placeholder="item.label || '请选择'"
          clearable
        ></query-dict>
      </template>
      <template v-else-if="item.type === 'cascader'">
        <el-cascader
          clearable
          class="search-item"
          :size="size"
          :props="item.optionsProps"
          :show-all-levels="item.showAllLevels"
          v-model="formModel[item.prop]"
          :placeholder="item.label"
          :options="item.optionsList"
          filterable
        ></el-cascader>
      </template>
      <template v-else-if="item.type === 'min-max'">
        <el-input
          v-model.number="formModel[item.prop][0]"
          class="search-number"
          :disabled="item.disabled"
          :size="size"
          placeholder="最小值"
          clearable
        />
        <span>至</span>
        <el-input
          v-model.number="formModel[item.prop][1]"
          :disabled="item.disabled"
          class="search-number"
          :size="size"
          placeholder="最大值"
          clearable
        />
      </template>
      <template v-else-if="item.type === 'dateTime' && !item.isHidden">
        <el-date-picker
          :disabled="item.disabled"
          v-model="formModel[item.prop]"
          :type="item.dateType || 'daterange'"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00', '23:59:59']"
          :size="size"
          align="right"
        ></el-date-picker>
      </template>
      <template v-else>
        <el-input
          v-model.trim="formModel[item.prop]"
          class="search-item"
          :disabled="item.disabled"
          :size="size"
          :placeholder="item.label"
          clearable
        />
      </template>
    </el-form-item>
    <slot></slot>
    <el-form-item v-if="$slots.default || formItems.length">
      <template v-if="btns && btns.length">
        <el-button
          v-for="(btn, index) in btns"
          :key="index"
          :type="btn.type || primary"
          :size="btn.size || size"
          :icon="btn.icon"
          @click="btn.handle || submitForm"
        >{{btn.name}}</el-button>
      </template>
      <template v-else>
        <el-button type="primary" :size="size" icon="el-icon-search" @click="submitForm">查询</el-button>
        <el-button :size="size" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
import create from 'utils/create'
import utils from 'utils'
import QueryDict from '@/views/common/queryDict'

export default create({
  inheritAttrs: false,
  name: 'search',
  components: {
    QueryDict
  },
  props: {
    formModel: {
      type: Object,
      required: true
    },
    formItems: {
      type: Array,
      required: true
    },
    size: {
      type: String,
      default: 'medium'
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    btns: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      pickerOptions: utils.pickerOptions,
      initData: {}
    }
  },
  mounted() {
    this.initData = { ...this.formModel } // 保存初始化数据
  },
  methods: {
    submitForm() {
      this.$emit('submit-form')
    },
    resetForm() {
      this.$refs.formModel.resetFields()
      this.$emit('update:form-data', this.initData)
      this.$emit('reset-form')
    }
  }
})
</script>

<style lang='less'>
.c-search {
  .el-form-item {
    margin-bottom: 10px;
  }
  margin-bottom: 10px;
  width: 100%;
  .search-item {
    width: 250px;
  }
  .search-number {
    width: 114px;
  }
}
</style>
