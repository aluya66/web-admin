<template>
  <c-card :name="title" class="form-card">
    <el-form-item label="商品款号:">
      <el-input
        v-if="!isView"
        class="select-item"
        v-model.trim="formModel.goodsBn"
        :size="size"
        placeholder="请输入商品款号"
        clearable
      />
      <span v-else>{{formModel.goodsBn}}</span>
    </el-form-item>
    <el-form-item label="商品规格:">
      <sku-wrap v-if="curAttrs.length" :sku-attrs="curAttrs" :sku-list="formModel.skus" :spu-bn="formModel.goodsBn"></sku-wrap>
    </el-form-item>
  </c-card>
</template>
<script>
import CCard from 'components/card'
import SkuWrap from '../../common/sku-wrap.vue'
import utils from 'utils'

export default {
  data() {
    return {
      curAttrs: [], // 全部商品属性
      paramsData: {}, // sku 规格值
      formModel: {
        goodsBn: ''
      }
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
  mounted() {
    const { goodsBn, skus } = this.dataObj
    this.formModel = {
      goodsBn,
      skus
    }
  },
  created() {
    this.getAttrs()
  },
  methods: {
    getAttrs() {
      this.$api.basic.getGoodsattrval({
        pageNum: 1,
        type: 2, // 1:参数，2:属性
        numPerPage: 20
      }).then(res => {
        const { totalCount, data } = res
        if (totalCount) {
          const { skus } = this.dataObj
          data.forEach((val, index) => {
            const checkedAttr = []
            const attrs = val.bmsGoodsAttrVals.map(item => {
              if (skus.length) {
                skus.forEach(sku => {
                  if (sku.attrColorId === val.id && sku.attributeColorId === item.id) {
                    checkedAttr.push(sku.attributeColorValue)
                  }
                  if (sku.attrSpecId === val.id && sku.attributeSpecId === item.id) {
                    checkedAttr.push(sku.attributeSpecValue)
                  }
                })
              }
              return {
                value: item.id,
                label: item.value
              }
            })
            this.curAttrs.push({ attrs, name: val.name, label: `${val.name}:`, id: val.id, checkedAttr: utils.uniqueArr(checkedAttr), posterUrl: val.imageUrl })
          })
          console.log(this.curAttrs)
        }
      })
    }
  },
  components: {
    CCard,
    SkuWrap
  }
}
</script>
<style lang="less" scoped>
.form-card {
  .el-form-item {
    width: 98%;
  }
  .select-item {
    width: 30%;
  }
}
</style>
