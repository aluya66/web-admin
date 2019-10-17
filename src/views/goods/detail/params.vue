<template>
  <c-card :name="title" class="form-item">
    <el-form-item :label="item.label" v-for="(item, index) in curAttrs" :key="item.id">
      <el-checkbox-group v-model="item.checkedAttr" @change="handleCheckedChange">
        <el-checkbox
          v-for="attr in item.attrs"
          :label="attr.label"
          :key="attr.label"
          :disabled="isView"
          @change="curIndex = index"
        >{{attr.value}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </c-card>
</template>
<script>
import CCard from 'components/card'

export default {
  data() {
    return {
      curAttrs: [],   // 全部商品属性
      curIndex: 0,    // 一类商品属性下标
      checkAttrs: []  // 选中商品属性值[{1010:[212,3133]}]
    }
  },
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    isView: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  created() {
    this.getAttrs()
  },
  methods: {
    getAttrs() {
      this.$api.basic.getGoodsattrval({
        pageNum: 1,
        type: 1, //1:参数，2:属性
        numPerPage: 20
      }).then(res => {
        const { totalCount, data } = res
        const { goodsAttrs } = this.dataObj
        console.log(this.dataObj, 12121)
        if (totalCount) {
          data.forEach((val, index) => {
            const checkedAttr = []
            const attrs = val.bmsGoodsAttrVals.map(item => {
              if (goodsAttrs) {
                goodsAttrs.forEach(eidtAttr => {
                  if (eidtAttr.attrId === val.id && eidtAttr.attributeId === item.id) {
                    checkedAttr.push(eidtAttr.attributeId)
                  }
                })
              }
              return {
                label: item.id,
                value: item.value
              }
            })
            this.curAttrs.push({ attrs, paramType: val.paramType, id: val.id, label: `${val.name}:`, checkedAttr })
          })
          console.log(this.curAttrs)
        }
      })
    },
    handleCheckedChange(value) {
      this.checkAttrs[this.curIndex] = { [this.curAttrs[this.curIndex].id]: value }
      console.log(this.checkAttrs)
    }
  },
  components: {
    CCard
  }
}
</script>
<style lang="less" scoped>
.form-item {
  .el-form-item {
    width: 97%;
  }
}
</style>
