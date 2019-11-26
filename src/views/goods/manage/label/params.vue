<template>
  <c-card :name="title" class="form-card">
    <el-form-item :label="item.label" v-for="(item, tagIndex) in dataObj" :key="item.tagIndex">
      <!-- <div v-if="item.operateType === 1">
        <input type="text" class="select-item" v-model="item.checkedTag" :size="size" :disabled="isView || isDisabled" @change="handleCheckedChange">
      </div> -->
      <div v-if="item.operateType === 2">
        <el-button
          type="primary"
          :size="size"
          :disabled="isView || isDisabled"
          @click="setTagHandle(item.attrs, item.checkedTag, tagIndex)"
        >设置</el-button>
        <div class="checkedContent">
          <el-tag
            v-for="(tag, index) in getCheckedLabel(item.attrs, item.checkedTag)"
            :key="index"
          >{{ tag.label }}</el-tag>
        </div>
      </div>
      <el-select
        v-else
        class="select-item"
        v-model="item.checkedTag"
        :disabled="isView || isDisabled"
        filterable
        clearable
        placeholder="请选择"
        @change="handleCheckedChange"
        @focus="curIndex = tagIndex"
      >
        <el-option
          v-for="attr in item.attrs"
          :key="attr.value"
          :label="attr.label"
          :value="attr.value"
        ></el-option>
      </el-select>
      <!-- <el-radio-group
        v-if="item.operateType === 4"
        v-model="item.checkedTag"
        @change="handleCheckedChange"
      >
        <el-radio
          v-for="attr in item.attrs"
          :key="attr.value"
          :disabled="isView || isDisabled"
          :label="attr.value"
          @change="curIndex = tagIndex"
        >{{attr.label}}</el-radio>
      </el-radio-group> -->
    </el-form-item>
  </c-card>
</template>
<script>
import CCard from 'components/card'
import MixinFormCard from 'mixins/formCard'

export default {
  mixins: [MixinFormCard],
  components: {
    CCard
  },
  data() {
    return {
      curIndex: 0, // 标签下标
      checkAttrs: [] // 选中的标签
    }
  },
  methods: {
    handleCheckedChange(value) {
      this.checkAttrs[this.curIndex] = { [this.dataObj[this.curIndex].id]: value }
    },
    setTagHandle(val, checked, index) {
      this.curIndex = index
      this.$emit('set-tag', val, checked, index)
    },
    getCheckedLabel(tagsList, checkedTag) {
      const curTags = checkedTag.map(res => {
        const curTag = tagsList.find(val => val.value === res)
        return curTag ? { label: curTag.label, value: curTag.value } : ''
      })
      return curTags
    }
  }
}
</script>
<style lang="less" scoped>
.form-card {
  .el-form-item {
    width: 98%;
    margin-bottom: 15px;
  }
  .select-item {
    width: 30%;
  }
  .el-radio {
    width: 100px;
    margin: 10px 0px;
  }
  .checkedContent{
    .el-tag{
      margin-right: 5px;
    }
  }
}
</style>
