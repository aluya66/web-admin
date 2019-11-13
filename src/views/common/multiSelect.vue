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
      <div class="title">已选择:【 {{distList.length}} 】</div>
    </div>
    <div class="content">
      <div class="source">
        <el-checkbox-group v-model="checkedAttr" @change="handleCheckedChange">
          <el-checkbox
            v-for="item in searchList"
            :label="item.value"
            :key="item.value"
            :disabled="disabled"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="dist">
        <el-checkbox-group v-model="checkedAttr" @change="handleCheckedChange">
          <el-checkbox
            v-for="item in distList"
            :label="item.value"
            :key="item.value"
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
    disabled: Boolean
  },
  data() {
    return {
      searchValue: '',
      sourceList: [],
      checkedAttr: []
    }
  },
  created() {
    this.getAttrs()
  },

  computed: {
    distList() {
      return this.checkedAttr.map(res => this.sourceList.find(val => res === val.value))
    },
    searchList() {
      const curData = this.searchValue ? [] : this.sourceList.slice()
      this.sourceList.forEach(res => {
        if (res.value.indexOf(this.searchValue) !== -1) {
          curData.push(res)
        }
      })
      return curData
    }
  },

  methods: {
    getAttrs() {
      this.$api.basic.getGoodsattrval({
        pageNo: 1,
        type: this.type, // 1:参数，2:属性
        pageSize: 20
      }).then(res => {
        const { totalCount, data } = res
        if (totalCount) {
          this.sourceList = data[0].bmsGoodsAttrVals.map(item => {
            return {
              value: item.id,
              label: item.value
            }
          })
          console.log(this.checkedList)
        }
      })
    },
    handleCheckedChange(val) {

    }
  },

  components: {
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
          width: 85px;
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
          width: 80px;
        }
      }
    }
  }
}
</style>
