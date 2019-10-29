<template>
  <c-card :name="title" class="form-card">
    <el-form-item label="商品款号:">
      <el-input
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model.trim="formModel.goodsBn"
        :size="size"
        placeholder="请输入商品款号"
        clearable
      />
      <span v-else>{{formModel.goodsBn}}</span>
    </el-form-item>
    <el-form-item label="商品规格:">
      <sku-wrap :is-view="isView || isDisabled" v-if="curAttrs.length" :sku-attrs="curAttrs" :sku-list="formModel.skus" :spu-bn="formModel.goodsBn"></sku-wrap>
    </el-form-item>
    <el-form-item label="样衣成本价(元):">
      <el-input
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model.trim="formModel.sampleCostPrice"
        :size="size"
        placeholder="请输入样衣成本价"
        clearable
      />
      <span v-else>{{formModel.sampleCostPrice}}</span>
    </el-form-item>
    <el-form-item label="成衣成本价(元):">
      <el-input
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model.trim="formModel.costprice"
        :size="size"
        placeholder="请输入成衣成本价"
        clearable
      />
      <span v-else>{{formModel.costprice}}</span>
    </el-form-item>
    <el-form-item label="成衣供货价(元):">
      <el-input
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model.trim="formModel.supplyprice"
        :size="size"
        placeholder="请输入成衣供货价"
        clearable
      />
      <span v-else>{{formModel.supplyprice}}</span>
    </el-form-item>
    <el-form-item label="成衣散批价(元):">
      <el-input
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model.trim="formModel.wholesaleprice"
        :size="size"
        placeholder="请输入成衣散批价"
        clearable
      />
      <span v-else>{{formModel.wholesaleprice}}</span>
    </el-form-item>
    <el-form-item label="成衣大批价(元):">
      <el-input
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model.trim="formModel.largeBatchPrice"
        :size="size"
        placeholder="请输入成衣大批价"
        clearable
      />
      <span v-else>{{formModel.largeBatchPrice}}</span>
    </el-form-item>
    <el-form-item label="成衣会员价(元):">
      <el-input
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model.trim="formModel.memberPrice"
        :size="size"
        placeholder="请输入成衣会员价"
        clearable
      />
      <span v-else>{{formModel.memberPrice}}</span>
    </el-form-item>
    <el-form-item label="零售价(元):">
      <el-input
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model.trim="formModel.retailPrice"
        :size="size"
        placeholder="请输入零售价"
        clearable
      />
      <span v-else>{{formModel.retailPrice}}</span>
    </el-form-item>
  </c-card>
</template>
<script>
import CCard from 'components/card'
import SkuWrap from './sku-wrap.vue'
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
    },
    isDisabled: {
      type: Boolean,
      default: false
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
        pageNo: 1,
        type: 2, // 1:参数，2:属性
        pageSize: 20
      }).then(res => {
        const { totalCount, data } = res
        if (totalCount) {
          const { skus } = this.dataObj
          data.forEach((val, index) => {
            let colorPosters = '' // sku列表 颜色对应图片
            let curVal = false // 是否为同一属性规格key标识
            const checkedAttr = []
            const attrs = val.bmsGoodsAttrVals.map(item => {
              if (skus.length) {
                skus.some(sku => {
                  if (sku.attrColorId === val.id && sku.attributeColorId === item.id) {
                    checkedAttr.push(sku.attributeColorValue)
                    if (curVal === false) {
                      curVal = true
                      colorPosters = sku.imageUrl
                    }
                    return true
                  }
                  if (sku.attrSpecId === val.id && sku.attributeSpecId === item.id) {
                    checkedAttr.push(sku.attributeSpecValue)
                    return true
                  }
                })
              }
              return {
                value: item.id,
                label: item.value
              }
            })
            this.curAttrs.push({ attrs, name: val.name, label: `${val.name}:`, id: val.id, checkedAttr: utils.uniqueArr(checkedAttr), posterUrl: colorPosters })
          })
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
    margin-bottom: 15px;
  }
  .select-item {
    width: 30%;
  }
}
</style>
