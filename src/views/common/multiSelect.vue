<template>
  <div class="multi-select">
    <div class="header">
      <div class="search">
        <el-input
          placeholder="请输入匹配关键字"
          prefix-icon="el-icon-search"
          clearable
          v-model="searchValue"
        ></el-input>
      </div>
      <div class="title"><el-checkbox v-model="checkAll" @change="handleCheckAllChange" v-if="checkedAttr.length"></el-checkbox>已选择:【 {{distList.length}} 】</div>
    </div>
    <div class="content">
      <div class="source">
        <el-checkbox-group v-model="checkedAttr">
          <el-checkbox
            v-for="(item, index) in searchList"
            :label="item.value"
            :key="index"
            :disabled="disabled"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="dist">
        <el-checkbox-group v-model="checkedAttr">
          <el-checkbox
            v-for="(item, index) in distList"
            :label="item.value"
            :key="index"
            :disabled="disabled"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'multiSelect',
  props: {
    disabled: Boolean,
    sourceList: { // 源数据集合
      type: Array,
      required: true
    },
    initChecked: { // 编辑初始化选中值
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      searchValue: '', // 搜索关键字
      checkedAttr: [], // 选中的值
      checkAll: true // 已选择值默认全选
    }
  },
  computed: {
    distList() { // 选中集合
      return this.checkedAttr.map(res => this.sourceList.find(val => res === val.value))
    },
    searchList() { // 搜索列表集合
      let curData = []
      if (this.searchValue) {
        this.sourceList.forEach(res => {
          if (res && res.label && res.label.indexOf(this.searchValue) !== -1) {
            curData.push(res)
          }
        })
      } else {
        curData = this.sourceList
      }
      return curData
    }
  },
  mounted() {
    this.checkedAttr = this.initChecked
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedAttr = []
      this.checkAll = !val
    }
  }
}
</script>

<style lang='less' scoped>
.multi-select {
  border: 1px solid @border-default;
  margin: 0 40px;
  border-radius: 4px;
  .header {
    display: flex;
    border-bottom: 1px solid @border-default;
    .search {
      flex: 3;
      border-right: 1px solid @border-default;
      padding: 8px 0;
      .el-input {
        margin-left: 12px;
        width: 96%;
      }
    }
    .title {
      flex: 1.2;
      font-size: @f16;
      font-weight: bold;
      padding: 16px 0;
      text-align: center;
      .el-checkbox {
        margin-right: 10px;
      }
    }
  }
  .content {
    display: flex;
    height: 400px;
    .source {
      flex: 3;
      border-right: 1px solid @border-default;
      overflow-y: auto;

      .el-checkbox-group {
        margin: 20px 20px;
        .el-checkbox {
          margin: 5px 12px;
          min-width: 85px;
        }
      }
    }

    .dist {
      flex: 1.2;
      overflow-y: auto;

      .el-checkbox-group {
        margin: 20px 15px;
        .el-checkbox {
          margin: 5px 10px;
          min-width: 80px;
        }
      }
    }
  }
}
</style>
