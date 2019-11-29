<template>
  <div class="vue-sku">
    <div class="sku-box" v-for="(item, index) in skuAttrs" :key="item.id">
      <div class="label">{{item.label}}</div>
      <el-checkbox-group
        class="content-box"
        v-model="item.checkedAttr"
        @change="handleCheckedChange"
      >
        <el-checkbox
          v-for="attr in item.attrs"
          :label="attr.label"
          :key="attr.value"
          :disabled="isView"
          @change="curSkuIndex = index"
        >{{attr.label}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 实战DEMO -->
    <div class="sku-box">
      <div class="label">规格:</div>
      <div class="content-box">
        <template>
          <el-input
            v-for="(item, index) in batchList"
            :key="index"
            size="mini"
            class="batch-set"
            :disabled="isView"
            v-model.number="item.value"
            @focus="batchIndex = index"
            @change="setBatch"
            clearable
            placeholder="批量设置"
          >
            <template slot="prepend">{{item.label}}</template>
          </el-input>
          <!-- <el-button type="primary" size="mini" @click="setBatch">
            <i class="set-btn blue el-icon-check"></i>批量设置
          </el-button>-->
        </template>
      </div>
    </div>
    <div class="sku-box">
      <div class="label"></div>
      <table class="el-table sku-table content-box" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th>主图</th>
            <th v-for="(item, index) in specification" :key="index">{{item.name}}</th>
            <th style="width: 150px;">sku款号</th>
            <th
              v-for="(item, index) in batchList"
              :key="'th_'+index"
              :title="item.name"
            >{{item.name !== 'stock' ? item.label + '(元)': item.label}}</th>
            <th>是否启用</th>
            <th>是否主sku</th>
          </tr>
        </thead>
        <tbody v-if="specification[0] && specification[0].value.length">
          <tr :key="index" v-for="(item, index) in countSum(0)">
            <template v-for="(n, specIndex) in specification.length">
              <td
                v-if="specIndex === 0 && showTd(specIndex, index)"
                :key="'img_'+ index +'_'+ n"
                :rowspan="countSum(n)"
              >
                <!-- {{index}} {{countSum(specIndex + 1)}} {{specIndex}} {{countSum(0)}} {{index/countSum(specIndex + 1)}} -->
                <c-upload
                  v-if="!specification[specIndex].posterUrl[index/countSum(specIndex + 1)]"
                  :ref="'spec_'+index/countSum(specIndex + 1)"
                  class="pic"
                  auto-upload
                  action="/api/upload/file"
                  :size="10"
                  :limit="1"
                  :fileList="specification[specIndex].fileList"
                  :disabled="isView"
                  :on-success="uploadSuccess"
                  :on-remove="uploadRemove"
                  :on-preview="uploadReview"
                  @on-change="uploadIndex = specIndex"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传图片png/jepg后缀文件，且不超过10M</div>
                </c-upload>
                <c-image
                  v-else
                  :url="specification[specIndex].posterUrl[index/countSum(specIndex + 1)]"
                  fit="contain"
                  :preview-src-list="[specification[specIndex].posterUrl[index/countSum(specIndex + 1)]]"
                  lazy
                ></c-image>
              </td>
              <td
                v-if="showTd(specIndex, index)"
                :key="n"
                :rowspan="countSum(n)"
              >{{getSpecAttr(specIndex, index)}}</td>
            </template>
            <td>{{childProductArray[index].goodsSkuSn}}</td>
            <td v-for="(tdItem, tdIndex) in batchList" :key="'td_' + tdIndex">
              <el-input
                size="small"
                type="text"
                v-model.number="childProductArray[index][tdItem.name]"
                :placeholder="'请输入' + tdItem.label"
                :disabled="isView || !childProductArray[index].isUse"
              ></el-input>
            </td>
            <td>
              <el-switch
                v-model="childProductArray[index].isUse"
                :disabled="isView"
                @change="(val) => {handleUserChange(index, val)}"
              ></el-switch>
            </td>
            <td>
              <el-switch
                v-model="childProductArray[index].isDefalut"
                :disabled="isView"
                @change="(val) => {handleDefaultChange(index, val)}"
              ></el-switch>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 数据格式 调试用 -->
    <!-- <div class="sku-box">
      <div class="label">数据格式:</div>
      <section class="content-box">
        <div v-for="(item, index) in childProductArray" :key="index">
          {{ item }}
          <el-divider></el-divider>
        </div>
      </section>
    </div>-->
    <!-- 数据格式 调试用 -->
  </div>
</template>

<script>
import CUpload from 'components/upload'
import CImage from 'components/image'

function objEquals(object1, object2) {
  for (let propName in object1) {
    if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
      return false
    } else if (typeof object1[propName] !== typeof object2[propName]) {
      return false
    }
  }
  for (let propName in object2) {
    if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
      return false
    } else if (typeof object1[propName] !== typeof object2[propName]) {
      return false
    }
    if (!object1.hasOwnProperty(propName)) {
      continue
    }
    if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
      if (objEquals(!object1[propName], object2[propName])) {
        return false
      }
    } else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
      if (objEquals(!object1[propName], object2[propName])) {
        return false
      }
    } else if (object1[propName] !== object2[propName]) {
      return false
    }
  }
  return true
}
export default {
  name: 'sku',
  components: {
    CUpload,
    CImage
  },
  props: {
    skuAttrs: {
      type: Array,
      required: true
    },
    isView: {
      type: Boolean,
      default: false
    },
    spuBn: {
      type: String,
      required: true,
      default: 'PRODUCTNO_'
    },
    skuList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      specification: [], // 规格
      childProductArray: [], // 子规格
      addValues: [], // 用来存储要添加的规格属性
      cacheSpecification: [], // 缓存规格名称,
      curSkuIndex: '', // 选中sku属性下标
      uploadIndex: '', // sku 列表属性
      batchIndex: '', // 批量设置下标
      batchList: [{ // 批量处理
        label: '样衣成本价',
        value: '',
        name: 'sampleCostPrice'
      }, {
        label: '成衣成本价',
        value: '',
        name: 'costPrice'
      }, {
        label: '成衣供货价',
        value: '',
        name: 'supplyPrice'
      }, {
        label: '成衣散批价',
        value: '',
        name: 'wholesalePrice'
      }, {
        label: '成衣大批价',
        value: '',
        name: 'largeBatchPrice'
      }, {
        label: '成衣会员价',
        value: '',
        name: 'memberPrice'
      }, {
        label: '零售价',
        value: '',
        name: 'retailPrice'
      }, {
        label: '成衣库存',
        value: '',
        name: 'stock'
      }]
    }
  },
  computed: {
    // 所有sku的id
    stockSpecArr() {
      return this.childProductArray.map(item => item.childProductSpec)
    }
  },
  created() {
    this.createData()
  },
  methods: {
    // 创建模拟数据
    createData() {
      this.skuAttrs.forEach((res, i) => {
        // 添加规格数据
        this.addSpec()
        // 规格名称
        this.specification[i].name = res.name
        if (i === 0) {
          this.specification[i].posterUrl = this.skuAttrs[i].posterUrl // 从颜色那个规格取图片
        }
        // 缓存按钮键值
        this.cacheSpecification[i].status = false
        this.cacheSpecification[i].name = res.name
        if (res.checkedAttr && res.checkedAttr.length) {
          this.curSkuIndex = i
          this.handleCheckedChange(res.checkedAttr)
        }
      })
      // console.log(this.specification)
    },
    // 上传图片成功
    uploadSuccess(response, file, fileList) {
      this.specification[this.uploadIndex].fileList = fileList
    },
    // 删除图片
    uploadRemove(file, fileList) {
      this.specification[this.uploadIndex].fileList = fileList
    },
    // 预览图片
    uploadReview(file) {
      this.$emit('show-image', file)
    },
    // 选择规格属性，生成sku列表
    handleCheckedChange(value) {
      this.$set(this.specification[this.curSkuIndex], 'value', value)
      this.handleSpecChange('add')
      this.specification[this.curSkuIndex].name = this.cacheSpecification[this.curSkuIndex].name
      this.cacheSpecification[this.curSkuIndex].status = false
    },
    // 添加规格项目
    addSpec() {
      if (this.specification.length < 5) {
        this.cacheSpecification.push({
          status: true,
          name: ''
        })
        this.specification.push({
          name: '',
          value: []
        })
      }
    },
    /*
      根据传入的属性值，拿到相应规格的属性
      @params
        specIndex 规格项目在 advancedSpecification 中的序号
        index 所有属性在遍历时的序号
    */
    getSpecAttr(specIndex, index) {
      // 获取当前规格项目下的属性值
      const currentValues = this.specification[specIndex].value
      let indexCopy
      // 判断是否是最后一个规格项目
      if (this.specification[specIndex + 1] && this.specification[specIndex + 1].value.length) {
        indexCopy = index / this.countSum(specIndex + 1)
      } else {
        indexCopy = index
      }
      const i = Math.floor(indexCopy % currentValues.length)
      if (i.toString() !== 'NaN') {
        return currentValues[i]
      } else {
        return ''
      }
    },
    /*
      计算属性的乘积
      @params
        specIndex 规格项目在 advancedSpecification 中的序号
    */
    countSum(specIndex) {
      let num = 1
      this.specification.forEach((item, index) => {
        if (index >= specIndex && item.value.length) {
          num *= item.value.length
        }
      })
      return num
    },
    // 根据传入的条件，来判断是否显示该td
    showTd(specIndex, index) {
      // 如果当前项目下没有属性，则不显示
      if (!this.specification[specIndex]) {
        return false
      } else if (index % this.countSum(specIndex + 1) === 0) {
        return true
      }
      return false
    },
    /**
     * [handleSpecChange 监听标签的变化,当添加标签时；求出每一行的hash id，再动态变更库存信息；当删除标签时，先清空已有库存信息，然后将原有库存信息暂存到stockCopy中，方便后面调用]
     * @param  {[string]} option ['add'|'del' 操作类型，添加或删除]
     * @return {[type]}        [description]
     */
    handleSpecChange(option) {
      const stockCopy = JSON.parse(JSON.stringify(this.childProductArray))
      if (option === 'del') {
        this.childProductArray = []
      }
      for (let i = 0; i < this.countSum(0); i++) {
        this.changeStock(option, i, stockCopy)
      }
    },
    /**
     * [根据规格，动态改变库存相关信息]
     * @param  {[string]} option    ['add'|'del' 操作类型，添加或删除]
     * @param  {[array]} stockCopy [库存信息的拷贝]
     * @return {[type]}           [description]
     */
    changeStock(option, index, stockCopy) {
      let childProduct = {
        childProductSpec: this.getChildProductSpec(index),
        goodsSkuSn: `${this.spuBn}-${index + 1}`, // sku款号
        costPrice: '', // 成衣成本价
        sampleCostPrice: '', // 样衣成本价
        supplyPrice: '', // 成衣供货价
        largeBatchPrice: '', // 成衣大批价
        wholesalePrice: '', // 成衣散批价
        retailPrice: '', // 零售价
        memberPrice: '', // 成衣会员价
        stock: 0, // 成衣库存
        isUse: true, // 是否有用sku
        isDefalut: false // 是否默认SKU
      }
      // console.log(this.skuList[index], childProduct.childProductSpec)
      // 判断是否从详情读取sku列表数据
      const curSkuInfo = this.skuList.find(item => {
        return item.attributeColorValue === childProduct.childProductSpec[item.attrColorName] && item.attributeSpecValue === childProduct.childProductSpec[item.attrSpecName]
      })
      if (curSkuInfo) {
        childProduct = {
          ...childProduct,
          goodsSkuSn: curSkuInfo.goodsSkuSn, // 商品sku款号
          costPrice: curSkuInfo.costPrice, // 成衣成本价
          sampleCostPrice: curSkuInfo.sampleCostPrice, // 样衣成本价
          supplyPrice: curSkuInfo.supplyPrice, // 成衣供货价
          wholesalePrice: curSkuInfo.wholesalePrice, // 成衣散批价
          largeBatchPrice: curSkuInfo.largeBatchPrice, // 成衣大批价
          retailPrice: curSkuInfo.retailPrice, // 零售价
          memberPrice: curSkuInfo.memberPrice, // 成衣会员价
          stock: curSkuInfo.stock, // 成衣库存
          isDefalut: curSkuInfo.isDefalut === 1
        }
      }
      const spec = childProduct.childProductSpec
      if (option === 'add') {
        // 如果此id不存在，说明为新增属性，则向 childProductArray 中添加一条数据
        if (this.stockSpecArr.findIndex((item) => objEquals(spec, item)) === -1) {
          this.$set(this.childProductArray, index, childProduct)
        }
      } else if (option === 'del') {
        // 因为是删除操作，理论上所有数据都能从stockCopy中获取到
        let origin = ''
        stockCopy.forEach(item => {
          if (objEquals(spec, item.childProductSpec)) {
            origin = item
            return false
          }
        })
        this.childProductArray.push(origin || childProduct)
      }
    },
    // 获取childProductArray的childProductSpec属性
    getChildProductSpec(index) {
      let obj = {}
      this.specification.forEach((item, specIndex) => {
        obj[item.name] = this.getSpecAttr(specIndex, index)
      })
      return obj
    },
    // sku规则是否生效，生效的sku有goodsSkuSn，否则为空
    handleUserChange(index, value) {
      // 启用规格时，生成不重复的商品编号；关闭规格时，清空商品编号
      if (value) {
        this.$set(this.childProductArray[index], 'goodsSkuSn', `${this.spuBn}-${index}`)
      } else {
        this.$set(this.childProductArray[index], 'goodsSkuSn', '')
      }
    },
    // 设置是否为主sku
    handleDefaultChange(index, value) {
      this.childProductArray.forEach((res, num) => {
        if (index === num) {
          this.$set(this.childProductArray, 'isDefalut', value)
        } else if (res.isDefalut === value) {
          this.$set(this.childProductArray, 'isDefalut', !value)
        }
      })
    },
    // 批量参数设置
    setBatch() {
      if (typeof this.batchList[this.batchIndex].value === 'string' && this.batchList[this.batchIndex].value !== '') {
        this.$message({
          type: 'warning',
          message: '请输入正确的值'
        })
        return
      }
      this.childProductArray.forEach(item => {
        if (item.isUse) {
          item[this.batchList[this.batchIndex].name] = this.batchList[this.batchIndex].value
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.vue-sku {
  margin-top: 24px;
  .sku-table {
    border: 1px solid @border-default;
    td,
    th {
      border-right: 1px solid @border-default;
      text-align: center;
      padding: 0;
      .el-input {
        width: 80%;
      }
      &:last-child {
        border-right: none;
      }
    }
  }
  .sku-box {
    display: flex;
    margin-left: -69px;
    .label {
      text-align: center;
      flex: 1;
      font-weight: bold;
      color: @form-label-font-color;
    }
    .content-box {
      flex: 18;
      .batch-set {
        margin-top: 8px;
        padding-right: 5px;
        width: 200px;
      }
    }
  }
  .pic {
    .info {
      margin-top: -30px;
      line-height: 30px;
    }
  }
}
</style>
