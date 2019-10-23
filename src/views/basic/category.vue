<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
      </div>
    </template>
    <div class="main__box" >
      <div class="category__box">
          <el-input
            class="category__box__input"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <div class="category__box__tree">
            <el-tree
              :data="dataItems"
              :props="defaultProps"
              ref="categoryTree"
              node-key="id"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              >
            </el-tree>
          </div>
      </div>
    </div>
  </c-view>
</template>
<script>

export default {
  name: 'category',
  data() {
    return {
      popoverShow: false,
      dataItems: [],
      defaultProps: {
        children: 'childrenList',
        label: 'categoryName'
      },
      formModel: {
        categoryName: '', // 分类名称
        parentCode: '', // 父分类编码code，不填默认为父级分类
        safeLevel: '', // 安全级别
        sortNumber: 100, // 排序值
        standard: '' // 执行标准
      },
      dialogTitle: '',
      dialogShop: false,
      isEdit: false,
      filterText: '',
      safeLevelSelect: [
        {
          value: 1,
          label: '一级'
        },
        {
          value: 2,
          label: '二级'
        },
        {
          value: 3,
          label: '三级'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    filterText(val) {
      this.$refs.categoryTree.filter(val)
    }
  },
  methods: {
    fetchData() {
      this.isLoading = true
      this.$api.basic
        .queryCategory()
        .then(res => {
          this.isLoading = false
          this.dataItems = res || []
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.categoryName.indexOf(value) !== -1
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.category__box{
  height: 750px;
  .category__box__input{
    width: 40%;
  }
  .category__box__tree{
    width: 40%;
    height: 720px;
    overflow : auto;
    padding-top: 10px;
  }
}
.form{
  .form-item{
    width: 90%;
  }
  .select-item{
    width: 45%;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
