<template>
  <c-card :name="title" class="form-card">
    <el-form-item :label="item.label" v-for="(item, index) in curAttrs" :key="item.id">
      <el-checkbox-group
        v-if="item.paramType === '' || item.paramType === 'checkbox'"
        v-model="item.checkedAttr"
        @change="handleCheckedChange"
      >
        <el-checkbox
          v-for="attr in item.attrs"
          :label="attr.value"
          :key="attr.value"
          :disabled="isView || isDisabled"
          @change="curIndex = index"
        >{{attr.label}}</el-checkbox>
      </el-checkbox-group>
      <el-select
        class="select-item"
        v-if="item.paramType === 'select'"
        v-model="item.checkedAttr"
        :disabled="isView || isDisabled"
        filterable
        clearable
        placeholder="请选择"
        @change="handleCheckedChange"
        @focus="curIndex = index"
      >
        <el-option
          v-for="attr in item.attrs"
          :key="attr.value"
          :label="attr.label"
          :value="attr.value"
        ></el-option>
      </el-select>
      <el-radio-group
        v-if="item.paramType === 'radio'"
        v-model="item.checkedAttr"
        @change="handleCheckedChange"
      >
        <el-radio
          v-for="attr in item.attrs"
          :key="attr.value"
          :disabled="isView || isDisabled"
          :label="attr.value"
          @change="curIndex = index"
        >{{attr.label}}</el-radio>
      </el-radio-group>
    </el-form-item>
  </c-card>
</template>
<script>
import CCard from 'components/card'

export default {
  data() {
    return {
      curAttrs: [], // 全部商品参数
      curIndex: 0, // 一类商品参数下标
      checkAttrs: [] // 选中商品参数值[{1010:[212,3133]}]
      // formModel: {
      // }
    }
  },
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    type: {
      type: Number,
      default: 1
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
  created() {
    this.getAttrs()
  },
  methods: {
    getAttrs() {
      this.$api.basic.getGoodsattrval({
        pageNum: 1,
        type: this.type, // 1:参数，2:属性
        pageNo: 20
      }).then(res => {
        const { totalCount, data } = res
        if (totalCount) {
          const { goodsAttrs } = this.dataObj
          data.forEach((val, index) => {
            const checkedAttr = []
            const attrs = val.bmsGoodsAttrVals.map(item => {
              if (goodsAttrs.length) {
                goodsAttrs.forEach(eidtAttr => {
                  if (eidtAttr.attrId === val.id && eidtAttr.attributeId === item.id) {
                    checkedAttr.push(eidtAttr.attributeId)
                  }
                })
              }
              return {
                value: item.id,
                label: item.value
              }
            })
            this.curAttrs.push({ attrs, paramType: val.paramType || '', id: val.id, label: `${val.name}:`, checkedAttr })
          })
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
}
</style>
