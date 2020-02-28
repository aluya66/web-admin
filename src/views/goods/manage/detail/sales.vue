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
      <el-form-item label="">
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
      <!-- <el-form-item label="样衣成本价(元):" prop="sampleCostprice">
        <el-input
          v-if="!isView"
          class="select-item"
          disabled
          v-model.trim="formModel.sampleCostprice"
          :size="size"
          placeholder="请输入样衣成本价"
          clearable
        />
        <span v-else>{{formModel.sampleCostprice}}</span>
      </el-form-item> -->
      <el-form-item label="平台成本价(元):" prop="costprice">
        <el-input
          v-if="!isView"
          class="select-item"
          disabled
          v-model.trim="formModel.costprice"
          :size="size"
          placeholder="请输入平台成本价"
          clearable
        />
        <span v-else>{{formModel.costprice}}</span>
      </el-form-item>
      <!-- <el-form-item label="成衣供货价(元):" prop="supplyprice">
        <el-input
          v-if="!isView"
          class="select-item"
          disabled
          v-model.trim="formModel.supplyprice"
          :size="size"
          placeholder="请输入成衣供货价"
          clearable
        />
        <span v-else>{{formModel.supplyprice}}</span>
      </el-form-item>
      <el-form-item label="成衣散批价(元):" prop="wholesaleprice">
        <el-input
          v-if="!isView"
          class="select-item"
          disabled
          v-model.trim="formModel.wholesaleprice"
          :size="size"
          placeholder="请输入成衣散批价"
          clearable
        />
        <span v-else>{{formModel.wholesaleprice}}</span>
      </el-form-item>
      <el-form-item label="成衣大批价(元):" prop="largePrice">
        <el-input
          v-if="!isView"
          class="select-item"
          disabled
          v-model.trim="formModel.largePrice"
          :size="size"
          placeholder="请输入成衣大批价"
          clearable
        />
        <span v-else>{{formModel.largePrice}}</span>
      </el-form-item>
      <el-form-item label="成衣会员价(元):" prop="price">
        <el-input
          v-if="!isView"
          class="select-item"
          disabled
          v-model.trim="formModel.price"
          :size="size"
          placeholder="请输入成衣会员价"
          clearable
        />
        <span v-else>{{formModel.price}}</span>
      </el-form-item> -->
      <el-form-item label="平台零售价(元):" prop="tagprice">
        <el-input
          v-if="!isView"
          class="select-item"
          disabled
          v-model.trim="formModel.tagprice"
          :size="size"
          placeholder="请输入零售价"
          clearable
        />
        <span v-else>{{formModel.tagprice}}</span>
      </el-form-item>
    </el-form>
  </c-card>
</template>
<script>
import CCard from 'components/card'
import SkuWrap from './sku-wrap.vue'
import utils from 'utils'

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
    const { goodsBn, skus, mustQuantity, sampleCostprice, supplyprice, largePrice, costprice, tagprice, price, wholesaleprice } = this.dataObj
    this.formModel = {
      goodsBn,
      skus,
      mustQuantity: mustQuantity || 1, // 起订量 没返回默认1
      sampleCostprice, // 样衣成本
      supplyprice, // 供货价
      largePrice, // 大批价
      costprice, // 成衣成本
      price, // 会员价
      tagprice, // 零售价
      wholesaleprice // 散批价
    }
  },
  created() {
    this.getAttrs()
  },
  methods: {
    validateSku(rule, value, callback) {
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
      // this.formModel = JSON.parse(JSON.stringify(this.formModel))
    },
    getAttrs() {
      this.$api.basic.getGoodsattrval({
        pageNo: 1,
        type: 2, // 1:参数，2:属性
        pageSize: 20
      }).then(res => {
        const { totalCount, data } = res
        if (totalCount) {
          const { skus, largeBatchRate, memberPriceRate, wholesalePriceRate, supplyRate } = this.dataObj
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
              supplyRate: supplyRate || 1,
              largeBatchRate: largeBatchRate || 1,
              memberPriceRate: memberPriceRate || 1,
              // retailPriceRate: retailPriceRate || 1,
              retailPriceRate: '', // 初始化不同步当前设置的倍率
              wholesalePriceRate: wholesalePriceRate || 1
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
