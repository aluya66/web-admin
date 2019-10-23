<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
      </div>
    </template>
    <div class="main__box">
      <div class="area__box__centen">
        <el-aside class="area__box__tree" width="400px">
          <el-tree
            v-if="data && data.length"
            :props="props"
            :load="loadNode"
            lazy
            :expand-on-click-node="false"
          >
          </el-tree>
        </el-aside>
      </div>
    </div>
  </c-view>
</template>
<script>
export default {
  name: 'area',
  data() {
    return {
      isEdit: false,
      props: {
        label: 'name',
        children: '',
        isLeaf: 'leaf'
      },
      formModel: {
        name: '',
        code: ''
      },
      showModal: false,
      dialogTitle: '',
      parentCode: 0,
      data: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(callback) {
      this.$api.basic
        .queryAllRegion({
          parentCode: this.parentCode
        })
        .then(res => {
          const { data } = res
          let curData = []
          if (data && data.length) {
            curData = data.map(res => ({
              leaf: !res.hasChildBoolean,
              name: res.name,
              code: res.code,
              parentCode: res.parentCode
            }))
          }
          if (this.parentCode === 0) {
            this.data = curData
          }
          callback && callback(curData)
        })
    },

    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.data)
      }
      if (node.level > 0 && !node.data.leaf) {
        this.parentCode = node.data && node.data.code
        this.fetchData(res => {
          resolve(res)
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.main__box {
  .area__box__centen {
    padding: 10px 0;
    .area__box__tree {
      height: 740px;
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
    }
  }
}
.form-item {
  width: 90%;
}
.title {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
