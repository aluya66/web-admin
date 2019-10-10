<template>
<c-view>
		<template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
		</template>
  <Card>
    <Form :model="formDynamic" label-position="right" :label-width="90" >
        <h4 class="message">基础信息</h4>
         <FormItem label="品牌名称:" >
          <span>{{ goodsName }}</span>
        </FormItem>
        <FormItem label="商品类目名称:" >
          <span>{{ goodsChannelValue }}</span>
        </FormItem>
        <FormItem label="商品封面图:" >
          <div class="itemImg">
            <a href="https://via.placeholder.com/300.png/09f/fff" target="_blank" >
              <img src="https://via.placeholder.com/300.png/09f/fff" alt="">
            </a>
            <!-- <img :src="coverImg" alt=""> -->
          </div>
        </FormItem>
        <FormItem label="商品名称:" >
          <span>{{ goodsName }}</span>
        </FormItem>
        <FormItem label="是否自营:" >
          <span>{{ goodsBusinessValue }}</span>
        </FormItem>
        <FormItem label="服装类型:" >
          <span>{{ categoryName }}</span>
        </FormItem>
        <FormItem label="商品定位:" >
          <span>{{ brandName }}</span>
        </FormItem>
        <FormItem label="商品类型:" >
          <span>{{ goodsType }}</span>
        </FormItem>
        <FormItem label="商品SKU码:" >
          <span>{{ goodsBn }}</span>
        </FormItem>
        <FormItem label="商品简介:" >
          <span>{{ goodsBrief }}</span>
        </FormItem>
        <FormItem label="商品简介:" >
          <span>{{ unit }}</span>
        </FormItem>
        <FormItem label="上架标志:" >
          <RadioGroup placeholder='上架标志' v-model="marketable">
            <Radio :label="1" true-value='1' disabled>上架</Radio>
            <Radio :label="2" true-value='2' disabled>下架</Radio>
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
            <Button v-if="item.isDefault===1" disabled>主图</Button>
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
              <CheckboxGroup  v-model="goodsAttrs">
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
            <CheckboxGroup  v-model="goodsSkus">
              <Checkbox disabled :label="item.id" :true-value='item.id'  v-for="item in i.bmsGoodsAttrVals" :key="item.id">
                {{item.value}}
              </Checkbox>
            </CheckboxGroup >
          </FormItem>
        </div>

        <Table border :columns="columns" :data="reportList" class="table">
          <template slot-scope="{ row }" slot="imageUrl">
            <div class="tableImg">
              <a :href="row.imageUrl" target="_blank" >
                <img :src="row.imageUrl" alt="">
              </a>
            </div>
          </template>
        </Table>

        <h4 class="message">其他信息</h4>
        <FormItem label="商品发货地址:" >
            <span>{{ place }}</span>
        </FormItem>
        <FormItem label="计价单位:" >
          <span>{{ unit }}</span>
        </FormItem>
        <FormItem label="重量:" >
          <span>{{ weightUnit }}</span>
        </FormItem>
        <FormItem label="重量单位:" >
          <span>{{ weightUnit }}</span>
        </FormItem>

        <FormItem label="富文本信息:" >
          <div id="wangeditor">
            <div ref="editorElem" class="editorElem">
              <img v-show="showImg" :src="intro" alt="">
              <span v-show="!showImg">{{intro}}</span>
            </div>
          </div>
        </FormItem>
      </Form>
  </Card>
</c-view>
</template>

<script>
// const columns=[

// ]
import E from 'wangeditor'
export default {
  name: 'Editor',
  data() {
    return {
      editor: null,
      editorContent: '',
      columns: [
        {
          title: '主图',
          slot: 'imageUrl'
        },
        {
          title: '颜色',
          key: 'attrColorName'
        },
        // {
        //   title: '尺寸',
        //   key: 'attributeSpecValue'
        // },
        // {
        //   title: 'sku款号',
        //   key: 'goodsSkuSn'
        // },
        // {
        //   title: '成本价(元)',
        //   key: 'memberPrice'
        // },
        // {
        //   title: '市场价(元)',
        //   key: 'mktPrice'
        // },
        // {
        //   title: '销售价(元)',
        //   key: 'retailPrice'
        // },
        // {
        //   title: '库存',
        //   key: 'salesPrice'
        // },
        // {
        //   title: '尺寸',
        //   key: 'soodsSkuVoResps',
        //   align:'center',
        //   render: (h, params) => {
        //     return h('div', {
        //       attrs: {
        //         class:'subCol'
        //       },
        //     }, [
        //     h('ul', this.reportList[params.index].list.map(item => {
        //       return h('li', {
        //       }, item.attributeSpecValue)
        //     }))
        //     ]);
        //   }
        // },
        {
          title: '尺寸',
          key: 'soodsSkuVoResps',
          align: 'center',
          render: (h, params) => {
            if (this.reportList[params.index].soodsSkuVoResps[0].attributeSpecValue !== undefined) {
              return h('div', {
                attrs: {
                  class: 'subCol'
                }
              }, [
                h('ul', this.reportList[params.index].soodsSkuVoResps.map(item => {
                  return h('li', {
                  }, item.attributeSpecValue)
                }))
              ])
            } else {
              return h('div', [
                h('span', '----')
              ])
            }
          }
        },
        {
          title: 'sku款号',
          key: 'soodsSkuVoResps',
          align: 'center',
          render: (h, params) => {
            if (this.reportList[params.index].soodsSkuVoResps[0].goodsSkuSn !== undefined) {
              return h('div', {
                attrs: {
                  class: 'subCol'
                }
              }, [
                h('ul', this.reportList[params.index].soodsSkuVoResps.map(item => {
                  return h('li', {
                  }, item.goodsSkuSn)
                }))
              ])
            } else {
              return h('div', [
                h('span', '----')
              ])
            }
          }
        },
        {
          title: '成本价(元)',
          key: 'soodsSkuVoResps',
          align: 'center',
          render: (h, params) => {
            if (this.reportList[params.index].soodsSkuVoResps[0].costPrice !== undefined) {
              return h('div', {
                attrs: {
                  class: 'subCol'
                }
              }, [
                h('ul', this.reportList[params.index].soodsSkuVoResps.map(item => {
                  return h('li', {
                  }, item.costPrice)
                }))
              ])
            } else {
              return h('div', [
                h('span', '----')
              ])
            }
          }
        },
        {
          title: '市场价(元)',
          key: 'soodsSkuVoResps',
          align: 'center',
          render: (h, params) => {
            if (this.reportList[params.index].soodsSkuVoResps[0].tagPrice !== undefined) {
              return h('div', {
                attrs: {
                  class: 'subCol'
                }
              }, [
                h('ul', this.reportList[params.index].soodsSkuVoResps.map(item => {
                  return h('li', {
                  }, item.tagPrice)
                }))
              ])
            } else {
              return h('div', [
                h('span', '----')
              ])
            }
          }
        },
        {
          title: '销售价(元)',
          key: 'soodsSkuVoResps',
          align: 'center',
          render: (h, params) => {
            if (this.reportList[params.index].soodsSkuVoResps[0].retailPrice !== undefined) {
              return h('div', {
                attrs: {
                  class: 'subCol'
                }
              }, [
                h('ul', this.reportList[params.index].soodsSkuVoResps.map(item => {
                  return h('li', {
                  }, item.retailPrice)
                }))
              ])
            } else {
              return h('div', [
                h('span', '----')
              ])
            }
          }
        },
        {
          title: '库存',
          key: 'soodsSkuVoResps',
          align: 'center',
          render: (h, params) => {
            if (this.reportList[params.index].soodsSkuVoResps[0].basePrice !== undefined) {
              return h('div', {
                attrs: {
                  class: 'subCol'
                }
              }, [
                h('ul', this.reportList[params.index].soodsSkuVoResps.map(item => {
                  return h('li', {
                  }, item.basePrice)
                }))
              ])
            } else {
              return h('div', [
                h('span', '----')
              ])
            }
          }
        }
      ],
      reportList: [],
      formDynamic: {
      },
      goodsSkus: [],

      goodsBn: '',
      goodsStaticFilesImgUrl: [],
      goodsStaticFilesVideoUrl: [],
      styleList: [],
      styleSkuList: [],
      showImg: null,
      marketable: '',
      goodsName: '',
      goodsChannelValue: '',
      intro: '',
      place: '',
      goodsBusinessValue: '',
      categoryName: '',
      coverImg: '',
      goodsBrief: '',
      brandName: '',
      goodsType: '',
      unit: '',
      weightUnit: '',
      goodsAttrs: []
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
        id: this.$route.query.id
      }
      this.$api.goods.getGoodssnapshotDel(data).then(res => {
        this.goodsName = res.data.goodsName
        // console.log(res.data.goodsSnapshot)
        let data = JSON.parse(res.data.goodsSnapshot)
        this.goodsChannelValue = data.goodsChannelValue
        this.place = data.place
        this.intro = data.intro
        let text = this.intro
        text.indexOf('http') > -1 || text.indexOf('https') > -1 ? this.showImg = true : this.showImg = false
        this.goodsName = data.goodsName
        this.goodsBusinessValue = data.goodsBusinessValue
        this.categoryName = data.categoryName
        this.coverImg = data.coverImg
        this.goodsBrief = data.goodsBrief
        this.brandName = data.brandName
        this.goodsType = data.goodsType
        this.unit = data.unit
        this.weightUnit = data.weightUnit
        this.marketable = data.marketable
        this.goodsBn = data.goodsBn

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
        this.reportList = data.goodsSkuWebResps
        data.goodsSkuWebResps.forEach(item => {
          const [{ attributeColorId, attributeSpecId }] = item.soodsSkuVoResps
          this.goodsSkus.push(attributeColorId, attributeSpecId)
        })

        data.goodsAttrs.map(item => {
          this.goodsAttrs.push(item.attributeId)
        })
      })
    },
    goBack() {
      this.$router.go(-2)
    }
  },
  props: ['catchData'],
  mounted() {
    this.editor = new E(this.$refs.editorElem)
    // 编辑器的事件，每次改变会获取其html内容
    // this.editor.customConfig.onchange = html => {
    //   this.editorContent = html;
    //   this.catchData(editorContent); // 把这个html通过catchData的方法传入父组件
    // };
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
  border: 1px solid #000;
}
.itemImg img{
  display: inline-block;
  width: 100%
}
.selectWidth{
  width: 200px;
}
.editorElem{
  text-align:left
}
</style>
