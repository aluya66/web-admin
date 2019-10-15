<template>
<c-view>
		<template v-slot:header>
			<div class="title">
				<!-- {{ $route.meta.name || $t(`route.${$route.meta.title}`) }} -->
        商品中心详情
        <Button type="primary" @click="goBack">返回</Button>
			</div>
		</template>
  <Card>
    <Form :model="formDynamic" label-position="right" :label-width="90" >
        <h4 class="message">基础信息</h4>
         <FormItem label="品牌名称:" >
          <span>{{ formDynamic.brandName }}</span>
        </FormItem>
        <FormItem label="商品类目名称:" >
          <span>{{ formDynamic.categoryName }}</span>
        </FormItem>
        <FormItem label="商品名称:" >
          <span>{{ formDynamic.goodsName }}</span>
        </FormItem>
        <FormItem label="商品封面图:" >
          <div class="itemImg">
            <a :href="formDynamic.coverImg" target="_blank" >
              <img :src="formDynamic.coverImg" alt="">
            </a>
          </div>
        </FormItem>
        <FormItem label="商品名称:" >
          <span>{{ formDynamic.goodsBn }}</span>
        </FormItem>
        <FormItem label="商品简介:" >
          <span>{{ formDynamic.goodsBrief }}</span>
        </FormItem>
        <FormItem label="上架标志:" >
          <RadioGroup placeholder='上架标志' v-model="formDynamic.marketable">
            <Radio :label="1" true-value='1'>上架</Radio>
            <Radio :label="2" true-value='2'>下架</Radio>
          </RadioGroup>
        </FormItem>
        <h4 class="message">商品资源</h4>
        <FormItem label="商品图片:" >
        </FormItem>
        <div class="imgWrap">
          <div class="imgItem" v-for="(item, index) in goodsStaticFilesImgUrl" :key="index">
            <a :href="item.imageUrl" target="_blank" >
              <img :src="item.imageUrl" alt="">
            </a>
            <Button v-if="item.isDefault===1">主图</Button>
          </div>
        </div>
        <FormItem label="商品视频:" >
        </FormItem>
        <div class="imgWrap">
          <div class="videoItem" v-for="(item, i) in goodsStaticFilesVideoUrl" :key="i">
            <video :src="item.videoUrl" controls="controls" />
          </div>
        </div>
        <h4 class="message">商品参数</h4>
        <template>
          <div v-for="(data, index) in styleList" :key="index">
            <FormItem :label="data.name+':'">
              <CheckboxGroup  v-model="formDynamic.goodsAttrs" @on-change="checkAllGroupChange">
                <Checkbox disabled :label="item.id" :true-value='item.id'  v-for="item in data.bmsGoodsAttrVals" :key="item.id">
                  {{item.value}}
                </Checkbox>
              </CheckboxGroup >
            </FormItem>
          </div>
        </template>
        <h4 class="message">skus</h4>
        <div v-for="(i) in styleSkuList" :key="i.id">
          <FormItem :label="i.name+':'">
            <CheckboxGroup  v-model="formDynamic.goodsSkus" @on-change="checkAllGroupChangeSkus">
              <Checkbox disabled :label="item.id" :true-value='item.id'  v-for="item in i.bmsGoodsAttrVals" :key="item.id">
                {{item.value}}
              </Checkbox>
            </CheckboxGroup >
          </FormItem>
        </div>
        <Table border :columns="columns" :data="list" class="table">
          <template slot-scope="{ row }" slot="imageUrl">
            <div class="tableImg">
              <img :src="row.imageUrl" alt="">
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="memberPrice">
            <Input v-model="row.memberPrice" @on-change="changeInput(row, index, 'memberPrice')"/>
          </template>
          <template slot-scope="{ row, index }" slot="mktPrice">
            <Input v-model="row.mktPrice" @on-change="changeInput(row, index, 'mktPrice')"/>
          </template>
          <template slot-scope="{ row, index }" slot="retailPrice">
            <Input v-model="row.retailPrice" @on-change="changeInput(row, index, 'retailPrice')"/>
          </template>
          <template slot-scope="{ row, index }" slot="salesPrice">
            <Input v-model="row.salesPrice" @on-change="changeInput(row, index, 'salesPrice')"/>
          </template>
        </Table>
        <h4 class="message">其他信息</h4>
        <FormItem label="商品发货地址:" >
          <span>{{ formDynamic.place }}</span>
        </FormItem>
        <FormItem label="计价单位:" >
          <span>{{ formDynamic.unit }}</span>
        </FormItem>
        <FormItem label="重量:" >
          <span>{{ formDynamic.weight }}</span>
        </FormItem>
        <FormItem label="重量单位:" >
          <span>{{ formDynamic.weightUnit }}</span>
        </FormItem>
        <FormItem label="富文本信息:" >
          <div id="wangeditor">
            <div ref="editorElem" class="editorElem">
              <img v-show="showImg" :src="formDynamic.intro" alt="">
              <span v-show="!showImg">{{formDynamic.intro}}</span>
            </div>
          </div>
        </FormItem>
        <FormItem class="addBtn">
          <Button type="primary" @click="addModalBtn">保存</Button>
          <Button @click="cancelBtn">取消</Button>
        </FormItem>
      </Form>
  </Card>
</c-view>
</template>

<script>
import E from 'wangeditor'
const columns = [
  {
    title: '主图',
    slot: 'imageUrl'
  },
  {
    title: '颜色',
    key: 'attributeColorValue'
  },
  {
    title: '尺寸',
    key: 'attributeSpecValue'
  },
  {
    title: 'sku款号',
    key: 'goodsSkuSn'
  },
  {
    title: '成本价(元)',
    slot: 'memberPrice'
  },
  {
    title: '市场价(元)',
    slot: 'mktPrice'
  },
  {
    title: '销售价(元)',
    slot: 'retailPrice'
  },
  {
    title: '库存',
    slot: 'salesPrice'
  }
]
export default {
  name: 'shopCenterDel',
  data() {
    return {
      showModal: false,
      editor: null,
      editorContent: '',
      columns,
      list: [],
      formDynamic: {
        brandName: '',
        categoryCode: '',
        categoryName: '',
        coverImg: '',
        goodsAttrs: [],
        goodsBn: '',
        goodsBrief: '',
        goodsBusinessValue: '',
        goodsChannelValue: '',
        goodsName: '',
        goodsSkus: [],
        goodsStaticFiles: [],
        isNomalVirtual: '',
        marketable: '',
        origin: '',
        place: '',
        sort: '',
        unit: '',
        weight: '',
        weightUnit: '',
        attributeValue: '', // 风格
        intro: '', // 富文本
        id: ''
      },
      skusLength: '',
      marketable: '',
      goodsStaticFilesImgUrl: [],
      goodsStaticFilesVideoUrl: [],
      styleList: [],
      styleItem: [],
      styleSkuList: [],
      attributeValueList: {},

      // updataSkuPrice: 0,
      showImg: null,

      basePrice: '',
      costPrice: '',
      goodsSkuId: '', // 这个是，每条SKU数据都有的bn码
      goodsSkuSn: '', // 这个是，每条SKU数据都有的bn码
      memberPrice: '',
      mktPrice: '',
      retailPrice: '',
      salesPrice: '',
      sampleCostPrice: '',
      skuExtendList: null,
      supplyPrice: '',
      tagPrice: '',
      wholesalePrice: '',
      dataList: {}
    }
  },
  created() {
    this.getShopList()
    this.getStyle()
    this.getsku()
  },
  methods: {
    getStyle() {
      let that = this
      let data = {
        parentId: 1,
        type: 1
      }
      this.$api.basic.getStyle(data).then(res => {
        that.styleList = res.data.map(({ name, id, bmsGoodsAttrVals }) => {
          return {
            name,
            id,
            bmsGoodsAttrVals: bmsGoodsAttrVals.map(({ id, value }) => ({
              id,
              value
            }))
          }
        })
      })
    },
    getsku() {
      let that = this
      let data = {
        parentId: 1,
        type: 2
      }
      this.$api.basic.getStyle(data).then(res => {
        that.styleSkuList = res.data.map(({ name, id, bmsGoodsAttrVals }) => {
          return {
            name,
            id,
            bmsGoodsAttrVals: bmsGoodsAttrVals.map(({ id, value }) => ({
              id,
              value
            }))
          }
        })
      })
    },
    getShopList() {
      let data = {
        id: this.$route.params.id
      }
      this.$api.goods.getDetail(data).then(data => {
        this.goodsStaticFiles = []
        this.dataList = data
        this.list = data.skus
        this.formDynamic.brandName = data.goodsName
        this.formDynamic.id = data.id
        this.formDynamic.marketable = data.marketable

        this.formDynamic.categoryCode = data.categoryCode
        this.formDynamic.categoryName = data.categoryName
        this.formDynamic.coverImg = data.coverImg

        this.formDynamic.goodsAttrs = data.goodsAttrs.map(({ attributeId }) => {
          return attributeId
        })
        this.formDynamic.goodsBn = data.goodsBn
        this.formDynamic.goodsBrief = data.goodsBrief
        this.formDynamic.goodsBusinessValue = data.goodsBusinessValue
        this.formDynamic.goodsChannelValue = data.goodsChannelValue
        this.formDynamic.goodsName = data.goodsName
        this.formDynamic.place = data.place
        this.formDynamic.unit = data.unit
        this.formDynamic.weight = data.weight
        this.formDynamic.weightUnit = data.weightUnit
        // 富文本
        this.formDynamic.intro = data.intro
        let text = this.formDynamic.intro
        text.indexOf('http') > -1 || text.indexOf('https') > -1 ? this.showImg = true : this.showImg = false
        console.log('qwe', text, this.showImg)

        let skusData = data.skus.map(({ goodsSkuExtends }) => {
          return {
            goodsSkuExtends: goodsSkuExtends.map(({ attributeId, attributeValue }) => ({
              attributeId,
              attributeValue
            }))
          }
        })
        let skusColor = []
        let skusSize = []
        for (var i = 0; i < skusData.length; i++) {
          skusColor.push(skusData[i].goodsSkuExtends[0])
          skusSize.push(skusData[i].goodsSkuExtends[1])
        }
        let arr1 = []
        let arr2 = []
        for (let i = 0; i < skusColor.length; i++) {
          arr1.push(skusColor[i].attributeId)
        }
        for (let i = 0; i < skusSize.length; i++) {
          arr2.push(skusSize[i].attributeId)
        }
        this.formDynamic.goodsSkus.push(...arr1, ...arr2)
        let imgData = data.goodsStaticFiles.map(({ imageUrl, isDefault }) => {
          return {
            imageUrl,
            isDefault
          }
        })
        for (let i in imgData) {
          if (imgData[i].imageUrl !== '') {
            this.goodsStaticFilesImgUrl.push(imgData[i])
          }
        }
        let videoData = data.goodsStaticFiles.map(({ videoUrl }) => {
          return {
            videoUrl
          }
        })
        for (let i in videoData) {
          if (videoData[i].videoUrl !== '') {
            this.goodsStaticFilesVideoUrl.push(videoData[i])
          }
        }
      })
    },
    checkAllGroupChange(e) {
      console.log(e)
    },
    checkAllGroupChangeSkus(id) {
      console.log(id)
    },

    changeInput(row, index, target) {
      this.$set(this.list[index], target, row[target])
    },
    addModalBtn() {
      let that = this
      this.$set(this.dataList, 'marketable', this.formDynamic.marketable)
      let data = this.dataList
      // {
      //   marketable: this.formDynamic.marketable,   //上下架
      //   goodsBn: this.formDynamic.goodsBn,
      //   id: this.formDynamic.id,
      //   skus: this.list,
      // }
      this.$api.goods.updateGoodsBnsDel(data).then(res => {
        that.$Message.info('确认成功')
        that.getShopList()
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    cancelBtn() {
      this.getShopList()
    }
  },
  props: ['catchData'],
  mounted() {
    this.editor = new E(this.$refs.editorElem)
    // 编辑器的事件，每次改变会获取其html内容
    this.editor.customConfig.onchange = html => {
      this.editorContent = html
      this.catchData(this.editorContent) // 把这个html通过catchData的方法传入父组件
    }
    this.editor.customConfig.menus = [
      // 菜单配置
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    this.editor.create() // 创建富文本实例
    this.editor.customConfig.uploadImgShowBase64 = true
    this.editor.$textElem.attr('contenteditable', false)
  }
}
</script>

<style scoped>
.select-bar,
.table{
  margin-bottom: 10px;
}
.title{
  display: flex;
  justify-content: space-between;
}
.message{
  border-bottom: 1px solid #eee;
  box-shadow: 10px 10px 5px #888888;
  margin-bottom: 30px;
}
.switchWrap{
  width: 100%;
  height: 100%;
}
.imgWrap{
  width: 100%;
  height: 200px;
}
.imgItem{
  /* border: 1px solid #000; */
  width: 200px;
  height: 160px;
  margin-left: 10px;
  float: left;
  text-align: center;
}
.imgItem img{
  width: 200px;
  height: 160px;
  display: block;
}
.videoItem{
  width: 200px;
  height: 160px;
  margin-left: 10px;
  float: left;
  text-align: center;
}
.videoItem video{
  width: 200px;
  height: 160px;
  display: block;
}
.tableImg{
  width: 100px;
  height: 100px;
  line-height: 150px;
}
.tableImg img{
  display: inline-block;
  width: 100px
}
.itemImg{
  width: 200px;
  height: 200px;
}
.itemImg img{
  display: inline-block;
  height: 100%
}
.selectWidth{
  width: 200px;
}
.addBtn{
  text-align: center;
}
.cancelBtn{
  margin-left: 8px
}
.editorElem{
  text-align:left;
}
</style>
