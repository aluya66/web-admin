<template>
  <div class="vue-sku">
    <div class="sku-box" style="display:none;" v-for="(item, index) in skuAttrs" :key="item.id">
      <div class="label">{{item.label}}</div>
      <el-checkbox-group
        disabled
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
      <div class="label">倍率:</div>
      <div class="content-box">
        <el-input
          size="mini"
          class="rate-set hidden"
          disabled
          clearable
          placeholder="占位"
        >
          <template slot="prepend">占位</template>
        </el-input>
        <template>
          <el-input
            v-for="(item, index) in rateList"
            :key="index"
            size="mini"
            class="rate-set"
            :disabled="isView"
            v-model="item.value"
            @focus="rateIndex = index"
            @blur="setRate"
            clearable
            :placeholder="item.label"
          >
            <template slot="prepend">{{item.label}}</template>
          </el-input>
          <!-- <el-button type="primary" size="mini" @click="setBatch">计算</el-button> -->
        </template>
      </div>
    </div>
    <!-- <div class="sku-box">
      <p
        class="rate-text"
      >当前品牌倍率为：供货价: {{rateListFromPort[0].value}}倍;散批价:{{rateListFromPort[1].value}}倍;大批价:{{rateListFromPort[2].value}}倍;会员价:{{rateListFromPort[3].value}}倍;零售价:{{rateListFromPort[4].value}}倍;</p>
    </div>-->
    <div class="sku-box">
      <div class="label">SKU批量填充:</div>
      <div class="content-box">
        <template>
          <el-input
            v-for="(item, index) in batchList.slice(1)"
            :key="index"
            v-show="item.name !== 'skuStock'"
            size="mini"
            class="batch-set"
            :disabled="isView"
            v-model="item.value"
            @focus="batchIndex = index + 1"
            @change="setBatch"
            clearable
            placeholder="批量设置"
          >
            <template slot="prepend">{{item.label}}</template>
          </el-input>
          <!-- <el-button type="primary" size="mini" @click="setBatch">确认</el-button> -->
        </template>
      </div>
    </div>
    <div class="sku-box">
      <div class="label"></div>
      <table class="el-table sku-table content-box" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th style="width: 80px;">主图</th>
            <th v-for="(item, index) in specification" :key="index">{{item.name}}</th>
            <th style="width: 150px;">sku款号</th>
            <th
              v-for="(item, index) in batchList"
              :key="'th_'+index"
              :title="item.name"
            >{{item.name !== 'skuStock' ? item.label + '(元)': item.label}}</th>
            <!-- <th>是否启用</th> -->
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
                <!-- v-if="!specification[specIndex].posterUrl[index/countSum(specIndex + 1)]" :disabled="isView"-->
                <c-upload
                  :ref="'spec_'+index/countSum(specIndex + 1)"
                  class="pic"
                  auto-upload
                  action="/api/upload/file"
                  :http-request="uploadHandle"
                  :size="10"
                  :limit="2"
                  :fileList="[]"
                  @on-success="uploadSuccess"
                  :on-remove="(file, fileList) => { uploadIndex=index/countSum(specIndex + 1); uploadRemove(file, fileList) }"
                  :on-preview="uploadReview"
                >
                  <!-- @on-change="uploadIndex=specIndex" -->
                  <el-button size="small" type="primary" @click="changeSku(index, specIndex)">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传图片png/jepg后缀文件，且不超过10M</div>
                </c-upload>
                <c-image
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
            <td v-if="childProductArray[index]">{{childProductArray[index].goodsSkuSn}}</td>
            <td v-for="(tdItem, tdIndex) in batchList" :key="'td_' + tdIndex">
              <el-input
                size="small"
                type="text"
                v-if="childProductArray[index]"
                v-model.number="childProductArray[index][tdItem.name]"
                :placeholder="tdItem.label"
                @change="(val) => { changeSkuPrice(val, index, tdItem.name) }"
                :disabled="tdItem.name === 'sampleCostPrice' || tdItem.name === 'skuStock'"
              ></el-input>
            </td>
            <!-- <td>
              <el-switch
                v-model="childProductArray[index].isUse"
                :disabled="isView"
                @change="(val) => {handleUserChange(index, val)}"
              ></el-switch>
            </td>-->
            <td>
              <el-switch
                v-if="childProductArray[index]"
                v-model="childProductArray[index].isDefalut"
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
    rateObj: {
      type: Object
    },
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
      currentSku: '',
      specification: [], // 规格
      childProductArray: [], // 子规格
      addValues: [], // 用来存储要添加的规格属性
      cacheSpecification: [], // 缓存规格名称,
      curSkuIndex: '', // 选中sku属性下标
      uploadIndex: '', // sku 列表属性
      batchIndex: '', // 批量设置下标
      rateIndex: '', // 倍率下标
      rateListFromPort: [], // 接口返回的倍率
      rateList: [{ // 倍率列表
        label: '供货倍率',
        value: '',
        name: 'supplyRate'
      }, {
        label: '散批价倍率',
        value: '',
        name: 'wholesalePriceRate'
      }, {
        label: '大批价格倍率',
        value: '',
        name: 'largeBatchRate'
      }, {
        label: '会员价倍率',
        value: '',
        name: 'memberPriceRate'
      }, {
        label: '零售倍率',
        value: '',
        name: 'retailPriceRate'
      }],
      batchList: [{
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
        name: 'skuStock'
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
    changeSku(index, specIndex) {
      this.uploadIndex = index / this.countSum(specIndex + 1) // 点击上传图片的下标
      this.currentSku = 'spec_' + index / this.countSum(specIndex + 1)
    },
    uploadHandle(file) {
      const ref = this.currentSku
      this.$refs[ref][0].customUpload(file)
    },
    // 创建模拟数据
    createData() {
      this.skuAttrs.forEach((res, i) => {
        // 添加规格数据
        this.addSpec()
        // 规格名称
        this.specification[i].name = res.name
        // this.specification[i].posterUrl = this.skuAttrs[i].posterUrl || [] // 从颜色那个规格取图片
        if (i === 0) {
          this.specification[i].posterUrl = this.skuAttrs[i].posterUrl // 从颜色那个规格取图片
          // this.specification[i].fileList = this.skuAttrs[i].posterUrl.map((item, index) => ([{ url: item, name: `sku图片${index + 1 }`}])) // 从颜色那个规格取图片
        }
        // 缓存按钮键值
        this.cacheSpecification[i].status = false
        this.cacheSpecification[i].name = res.name
        if (res.checkedAttr && res.checkedAttr.length) {
          this.curSkuIndex = i
          this.handleCheckedChange(res.checkedAttr)
        }
      })
      // 处理倍率字段
      Object.keys(this.rateObj).forEach((item, index) => {
        this.rateList.forEach((rateItem) => {
          if (rateItem.name === item) {
            rateItem.value = this.rateObj[item]
          }
        })
      })
      // this.rateListFromPort = JSON.parse(JSON.stringify(this.rateList))
    },
    // 上传图片成功
    uploadSuccess(response, file, fileList) {
      // this.specification[0].fileList[this.uploadIndex] = [fileList[fileList.length - 1]] // 获取最后一张覆盖原图
      this.specification[0].posterUrl[this.uploadIndex] = fileList[fileList.length - 1].url
      this.specification = JSON.parse(JSON.stringify(this.specification))
    },
    // 删除图片
    uploadRemove(file, fileList) {
      this.specification[0].posterUrl[this.uploadIndex] = ''
      // this.specification[0].fileList[this.uploadIndex] = fileList
      this.specification = JSON.parse(JSON.stringify(this.specification))
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
        skuStock: 0, // 成衣库存
        // isUse: true, // 是否有用sku
        isDefalut: false // 是否默认SKU
      }
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
          skuStock: curSkuInfo.skuStock || 0, // 成衣库存
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
    // handleUserChange(index, value) {
    //   // 启用规格时，生成不重复的商品编号；关闭规格时，清空商品编号
    //   if (value) {
    //     this.$set(this.childProductArray[index], 'goodsSkuSn', `${this.spuBn}-${index}`)
    //   } else {
    //     this.$set(this.childProductArray[index], 'goodsSkuSn', '')
    //   }
    // },
    // 设置是否为主sku
    handleDefaultChange(index, value) {
      if (!value) return
      this.childProductArray.forEach((item, cindex) => {
        if (cindex !== index) {
          this.$set(this.childProductArray[cindex], 'isDefalut', false)
        } else {
          this.$set(this.childProductArray[index], 'isDefalut', true)
        }
      })
      const target = this.childProductArray[index]
      this.handleMinPrice(target)
    },
    // sku默认选中 则为最新价 【target: 选中的sku】
    handleMinPrice(target) {
      const minObj = {
        costprice: target.costPrice, // 成衣成本价
        supplyprice: target.supplyPrice, // 供货价
        wholesaleprice: target.wholesalePrice, // 散批价
        largePrice: target.largeBatchPrice, // 大批价
        price: target.memberPrice, // 会员价
        tagprice: target.retailPrice // 零售价
      }
      this.$emit('set-min-price', minObj)
    },
    changeSkuPrice(val, index, priceType) {
      if (val) {
        this.$set(this.childProductArray[index], priceType, Number(val).toFixed(2))
        this.childProductArray[index].isDefalut && this.handleMinPrice(this.childProductArray[index])
      }
    },
    // 倍率设置
    setRate() {
      if (!Number(this.rateList[this.rateIndex].value) || Number(this.rateList[this.rateIndex].value) <= 0) {
        this.rateList[this.rateIndex].value = 1
        this.$message({
          type: 'warning',
          message: '请输入正确的值'
        })
        return
      }
      this.rateList[this.rateIndex].value = Number(this.rateList[this.rateIndex].value).toFixed(2) // 保留2位小数
      const name = this.rateList[this.rateIndex].name // 当前设置得倍率
      let value // 倍率对应得价格
      let target // sku列表得input
      switch (name) { // 供货倍率、大批价格倍率、 散批价倍率、 会员价倍率、零售倍率
        case 'supplyRate': // 供货
          value = this.batchList[2].value
          target = 'supplyPrice'
          break
        case 'wholesalePriceRate': // 散批价
          value = this.batchList[3].value
          target = 'wholesalePrice'
          break
        case 'largeBatchRate': // 大批价格
          value = this.batchList[4].value
          target = 'largeBatchPrice'
          break
        case 'memberPriceRate': // 会员价
          value = this.batchList[5].value
          target = 'memberPrice'
          break
        case 'retailPriceRate': // 零售
          value = this.batchList[6].value
          target = 'retailPrice'
          break
      }
      this.childProductArray.forEach(item => {
        if (value) {
          if (target === 'memberPrice' || target === 'retailPrice') {
            this.batchSameTypePrice(target, value, this.rateList[this.rateIndex].value, 'handlePrice')
          } else {
            this.batchSameTypePrice(target, value, this.rateList[this.rateIndex].value)
          }
          // item[target] = (value * this.rateList[this.rateIndex].value).toFixed(2)
        }
      })
      // this.setMinPrice()
      // this.rateList[this.rateIndex].value = this.rateList[this.rateIndex].value.toFixed(2)
    },
    // 批量参数设置
    setBatch() {
      // 成衣成本价=样衣成本价，不做处理；
      // 供货价=供货价倍率*采购价，价格取整数，比如计算出来的价格为55.34，则系统去小数点后两位数取整为56.00；
      // 大批价=大批价倍率*采购价，价格取整数，比如计算出来的价格为55.34，则系统去小数点后两位数取整为56.00；
      // 散批价=散批价倍率*采购价，价格取整数，比如计算出来的价格为55.34，则系统去小数点后两位数取整为56.00；
      // 会员价=会员价倍率*采购价，价格取整数，同时要求个位数系统自动调整为8，比如计算出来的价格是55.34，则系统去小数点后两位数取整为56.00，同时系统自动调整个位数为8，即结果为58.00；
      // 零售价=零售价倍率*采购价，价格取整数，同时要求个位数系统自动调整为8，比如计算出来的价格是55.34，则系统去小数点后两位数取整为56.00，同时系统自动调整个位数为8，即结果为58.00；
      // 在样衣库管理新增/编辑商品，提交后，若有新增的sku，均以上述的规则计算各个价格，填充到对应的值中，同时按照现有规则，在生成sku价格后，针对spu价格按照现有规则自动填充；

      // typeof this.batchList[this.batchIndex].value === 'string' && this.batchList[this.batchIndex].value !== ''
      if (!Number(this.batchList[this.batchIndex].value) || Number(this.batchList[this.batchIndex].value) <= 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的值'
        })
        return
      }
      const curPrice = Number(this.batchList[this.batchIndex].value) // 设置的价格
      const name = this.batchList[this.batchIndex].name // 设置的价格类型
      this.batchList[this.batchIndex].value = curPrice.toFixed(2)
      let rate
      // const list = this.batchList.filter((item) => item.name !== 'costPrice')
      // const list = this.batchList
      switch (name) {
        case 'costPrice': // 成衣成本价 根据价格类型的倍率设置全部价格
          this.batchList.slice(1).forEach((item) => {
            switch (item.name) {
              case 'costPrice':
                this.batchSameTypePrice('costPrice', curPrice, 1)
                break
              case 'supplyPrice': // 成衣供货价
                rate = this.rateList[0].value // 供货价倍率
                this.batchSameTypePrice('supplyPrice', curPrice, rate)
                break
              case 'wholesalePrice': // 成衣散批价
                rate = this.rateList[1].value // 成衣散批价倍率
                this.batchSameTypePrice('wholesalePrice', curPrice, rate)
                break
              case 'largeBatchPrice': // 成衣大批价
                rate = this.rateList[2].value // 成衣大批价倍率
                this.batchSameTypePrice('largeBatchPrice', curPrice, rate)
                break
              case 'memberPrice': // 成衣会员价
                rate = this.rateList[3].value // 成衣会员价倍率
                this.batchSameTypePrice('memberPrice', curPrice, rate, 'handlePrice')
                break
              case 'retailPrice': // 零售价
                rate = this.rateList[4].value // 零售价倍率
                this.batchSameTypePrice('retailPrice', curPrice, rate, 'handlePrice')
                break
            }
          })
          break
        case 'supplyPrice': // 成衣供货价
          rate = this.rateList[0].value // 供货价倍率
          this.batchSameTypePrice('supplyPrice', curPrice, rate)
          break
        case 'wholesalePrice': // 成衣散批价
          rate = this.rateList[1].value // 成衣散批价倍率
          this.batchSameTypePrice('wholesalePrice', curPrice, rate)
          break
        case 'largeBatchPrice': // 成衣大批价
          rate = this.rateList[2].value // 成衣大批价倍率
          this.batchSameTypePrice('largeBatchPrice', curPrice, rate)
          break
        case 'memberPrice': // 成衣会员价
          rate = this.rateList[3].value // 成衣会员价倍率
          this.batchSameTypePrice('memberPrice', curPrice, rate, 'handlePrice')
          break
        case 'retailPrice': // 零售价
          rate = this.rateList[4].value // 零售价倍率
          this.batchSameTypePrice('retailPrice', curPrice, rate, 'handlePrice')
          break
      }
      // this.setMinPrice()

      // this.childProductArray.forEach(item => {
      //   item[this.batchList[this.batchIndex].name] = this.batchList[this.batchIndex].value
      // })
      // this.setMinPrice()
    },
    // 获取sku各价格最低价
    // setMinPrice() {
    //   const minDataList = ['sampleCostPrice', 'costPrice', 'supplyPrice', 'wholesalePrice', 'largeBatchPrice', 'memberPrice', 'retailPrice']
    //   let minObj = {}
    //   minDataList.forEach((item) => {
    //     let list = this.childProductArray.length ? this.childProductArray.map((skuItem) => Number(skuItem[item])) : []
    //     if (list.length >= 1) minObj[item] = Math.min.apply(Math, list).toFixed(2)
    //   })
    //   if (Object.keys(minObj).length > 1) this.$emit('set-min-price', minObj)
    // },
    // 设置成衣成本价，同时批量设置sku相关价格
    batchSameTypePrice(target, curPrice, rate, handlePrice = '') {
      this.childProductArray.forEach((item) => {
        item[target] = this.getPrice(curPrice, rate, handlePrice)
      })
    },
    getPrice(val, rate, handlePrice = '') {
      if (handlePrice === 'handlePrice') {
        // 获取个位数，原数字减个位数加8 得会员价、零售价
        return (parseInt(Math.ceil(val * rate)) - parseInt(Math.ceil(val * rate) % 10) + 8).toFixed(2)
      }
      return Math.ceil(val * rate).toFixed(2)
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
      .batch-set,
      .rate-set {
        margin-top: 8px;
        padding-right: 5px;
        width: 200px;
      }
      .hidden {
        margin-right: -5px;
        visibility: hidden;
      }
    }
    .rate-text {
      color: blue;
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
