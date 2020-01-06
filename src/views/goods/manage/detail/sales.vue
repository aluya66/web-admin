<template>
  <c-card :name="title" class="form-card" id="form-sales">
    <el-form
      ref="salesFormRef"
      :model="formModel"
      label-width="120px"
      class="form"
      :rules="salesForm"
      label-position="right"
    >
      <el-form-item label="商品规格:">
        <sku-wrap
          ref="skuWrapRef"
          :is-view="isView || isDisabled"
          v-if="curAttrs.length"
          :sku-attrs="curAttrs"
          :rate-obj="rateValueObj"
          :sku-list="formModel.skus"
          :spu-bn="formModel.goodsBn"
          @set-min-price="setMinPrice"
        ></sku-wrap>
      </el-form-item>
      <el-form-item label="起订量:" prop="mustQuantity">
        <el-input
          v-if="!isView"
          class="select-item"
          :disabled="isDisabled"
          :size="size"
          placeholder="请输入起订量"
          clearable
          v-model.trim="formModel.mustQuantity"
        />
        <span v-else>{{formModel.sampleCostPrice}}</span>
      </el-form-item>
      <el-form-item label="样衣成本价(元):" prop="sampleCostPrice">
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
      <el-form-item label="成衣成本价(元):" prop="costPrice">
        <el-input
          v-if="!isView"
          class="select-item"
          :disabled="isDisabled"
          v-model.trim="formModel.costPrice"
          :size="size"
          placeholder="请输入成衣成本价"
          clearable
        />
        <span v-else>{{formModel.costPrice}}</span>
      </el-form-item>
      <el-form-item label="成衣供货价(元):" prop="supplyPrice">
        <el-input
          v-if="!isView"
          class="select-item"
          :disabled="isDisabled"
          v-model.trim="formModel.supplyPrice"
          :size="size"
          placeholder="请输入成衣供货价"
          clearable
        />
        <span v-else>{{formModel.supplyPrice}}</span>
      </el-form-item>
      <el-form-item label="成衣散批价(元):" prop="wholesalePrice">
        <el-input
          v-if="!isView"
          class="select-item"
          :disabled="isDisabled"
          v-model.trim="formModel.wholesalePrice"
          :size="size"
          placeholder="请输入成衣散批价"
          clearable
        />
        <span v-else>{{formModel.wholesalePrice}}</span>
      </el-form-item>
      <el-form-item label="成衣大批价(元):" prop="largeBatchPrice">
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
      <el-form-item label="成衣会员价(元):" prop="memberPrice">
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
      <el-form-item label="零售价(元):" prop="retailPrice">
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
    </el-form>
  </c-card>
</template>
<script>
import CCard from 'components/card'
import SkuWrap from './sku-wrap.vue'
import utils from 'utils'
// const requiredKey = [ // 必填字段
//   'sampleCostPrice',
//   'supplyPrice',
//   'sampleCostPrice',
//   'supplyPrice',
//   'largeBatchPrice',
//   'costPrice',
//   'memberPrice',
//   'retailPrice',
//   'wholesalePrice'
// ]
export default {
  data() {
    return {
      salesForm: {
        mustQuantity: [{ validator: utils.validater.checkNumber, trigger: 'blur' }],
        sampleCostPrice: [{ validator: utils.validater.checkNumber, trigger: 'blur' }],
        supplyPrice: [{ validator: utils.validater.checkNumber, trigger: 'blur' }],
        largeBatchPrice: [{ validator: utils.validater.checkNumber, trigger: 'blur' }],
        costPrice: [{ validator: utils.validater.checkNumber, trigger: 'blur' }],
        memberPrice: [{ validator: utils.validater.checkNumber, trigger: 'blur' }],
        retailPrice: [{ validator: utils.validater.checkNumber, trigger: 'blur' }],
        wholesalePrice: [{ validator: utils.validater.checkNumber, trigger: 'blur' }]
      },
      rateValueObj: {},
      curAttrs: [], // 全部商品属性
      paramsData: {}, // sku 规格值
      formModel: {}
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
    const { goodsBn, skus, mustQuantity, sampleCostprice, supplyprice, largePrice, costprice, mktprice, price, wholesaleprice } = this.dataObj
    this.formModel = {
      goodsBn,
      skus,
      mustQuantity,
      sampleCostPrice: sampleCostprice,
      supplyPrice: supplyprice,
      largeBatchPrice: largePrice,
      costPrice: costprice,
      memberPrice: mktprice,
      retailPrice: price,
      wholesalePrice: wholesaleprice
    }
  },
  created() {
    this.getAttrs()
  },
  methods: {
    validateSku(rule, value, callback) {
      console.log(value)
      var text = /，/g
      if (text.test(value)) {
        callback(new Error('输入不可以包含“,”'))
      } else {
        callback()
      }
    },
    setMinPrice(val) {
      let goodsSkus = this.$refs.skuWrapRef.childProductArray
      this.formModel = {
        ...this.formModel,
        goodsSkus,
        ...val
      }
    },
    getAttrs() {
      this.$api.basic.getGoodsattrval({
        pageNo: 1,
        type: 2, // 1:参数，2:属性
        pageSize: 20
      }).then(res => {
        const { totalCount, data } = res
        if (totalCount) {
          const { skus, largeBatchRate, memberPriceRate, retailPriceRate, wholesalePriceRate, supplyRate } = this.dataObj
          data.forEach((val, index) => {
            let colorPosters = [] // sku列表 颜色对应图片, 存在curAttrs第一个值中
            const checkedAttr = []
            const attrs = val.bmsGoodsAttrVals.map(item => {
              if (skus.length) {
                skus.some(sku => {
                  if (sku.attrColorId === val.id && sku.attributeColorId === item.id) {
                    checkedAttr.push(sku.attributeColorValue)
                    colorPosters.push(sku.imageUrl || '')
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
            this.rateValueObj = {
              supplyRate,
              largeBatchRate,
              memberPriceRate,
              retailPriceRate,
              wholesalePriceRate
            }
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
