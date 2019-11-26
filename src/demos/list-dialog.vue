<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button :size="size" type="primary" icon="el-icon-plus" @click="showDialog">新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :max-height="maxHeight"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <c-search
            :form-model="searchObj"
            :form-items="searchItems"
            @submit-form="searchSubmit"
            @reset-form="searchReset"
          ></c-search>
        </template>
      </c-table>
    </div>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <add-goods ref="childRef" :init-data="dialogObj.initData"></add-goods>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'
import CDialog from 'components/dialog'
import AddGoods from './addGoods'
import CSearch from 'components/search'

const marketableSelect = [{
  value: '1',
  label: '上架'
},
{
  value: '2',
  label: '下架'
}]

export default {
  mixins: [mixinTable],
  components: {
    CDialog,
    AddGoods,
    CSearch
  },
  data(vm) {
    return {
      brandList: [], // 品牌数据集合
      categoryList: [], // 商品类目集合
      dialogObj: {}, // 对话框数据
      searchObj: {
        categoryCode: [], // 商品类目
        goodsBn: '', // 商品编码
        goodsName: '', // 商品名称
        marketable: '', // 上下架
        brandName: '', // 品牌名称
        dataTime: '', // 操作时间
        retailPrice: [] // 库存最小值
      },
      searchItems: [],
      tableHeader: [
        {
          label: '商品ID',
          prop: 'id',
          width: 120,
          fixed: true
        },
        {
          label: '商品名称',
          prop: 'goodsName',
          width: 200,
          search: {
            type: 'input'
          }
        },
        {
          label: '商品图片',
          prop: 'coverImg',
          width: 100,
          isImage: true
        },
        {
          label: '商品编码',
          prop: 'goodsBn',
          search: {
            type: 'input'
          }
        },
        {
          label: '商品类目',
          prop: 'categoryName',
          search: {
            prop: 'categoryCode',
            type: 'cascader',
            optionsList: []
          }
        },
        {
          label: '品牌',
          prop: 'brandName',
          search: {
            type: 'dict',
            optionsList: []
          }
        },
        {
          label: '库存',
          prop: 'retailPrice',
          width: 100,
          search: {
            type: 'min-max'
          }
        },
        {
          label: '成本价',
          prop: 'marketable',
          width: 100,
        },
        {
          label: '市场价',
          prop: 'memberPrice',
          width: 100
        },
        {
          label: '销售价',
          prop: 'mktPrice',
          width: 100
        },
        {
          label: '上架状态',
          prop: 'marketable',
          width: 100,
          formatter(row) {
            return row.marketable ? marketableSelect[row.marketable - 1].label : ''
          },
          search: {
            type: 'select',
            optionsList: marketableSelect
          }
        },
        {
          label: '上货人',
          prop: 'tagPrice',
          width: 100
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100,
          search: {
            prop: 'dataTime',
            type: 'dateTime',
            dateType: 'daterange'
          }
        },
        {
          label: '更新时间',
          prop: 'updated',
          width: 100
        }
      ]
    }
  },
  created() {
    this.getCategoryList()
    this.getBrandList()
    this.fetchData()
  },
  methods: {
    /**
     * 获取表格数据
     */
    fetchData() {
      const { dataTime, retailPrice, categoryCode, ...other } = this.searchObj
      const curCategoryCode = categoryCode.length ? categoryCode[categoryCode.length - 1] : []
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
      if (utils.isInteger(retailPrice[0]) || utils.isInteger(retailPrice[1])) {
        return this.$msgTip('商品库存请输入正整数', 'warning')
      }
      if (retailPrice[0] > retailPrice[1]) {
        return this.$msgTip('库存最小值不能大于最大值', 'warning')
      }
      this.isLoading = true
      this.$api.goods.getList(
        {
          ...searchDate,
          ...other,
          ...page,
          minStock: retailPrice[0] || '',
          maxStock: retailPrice[1] || '',
          categoryCode: curCategoryCode
        }
      ).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data || []
        } else {
          this.tableList = res || []
        }
      })
    },
    // 获取商品类目集合
    getCategoryList() {
      this.$api.basic.queryCategory().then(res => {
        this.categoryList = utils.formartLevelData(res || [])
        this.$set(this.searchItems[2], 'optionsList', this.categoryList)
      })
    },
    // 获取品牌列表
    getBrandList() {
      this.$api.basic.brandList({
        pageNo: 1,
        pageSize: 100,
        status: 1
      }).then(res => {
        if (res && res.totalCount) {
          this.brandList = res.data.map(res => ({ value: res.name, label: res.name })) || []
          this.$set(this.searchItems[3], 'optionsList', this.brandList)
        }
      })
    },
    /**
     * 删除表格单条数据
     *
     * @param {*} curPromise
     * @param {string} [msgTip='删除成功']
     */
    deleteData(param, msgTip = '删除成功') {
      console.log(param, msgTip)
      // 主要修改接口
      this.$api.basic.deleteBrand(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    },
    /**
     * 对话框确认按钮，集成了表单提交功能
     */
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          if (!this.dialogObj.isEdit) {
            this.addHandle()
          } else {
            this.editHandle(childFormModel)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增商品',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    /**
     * 确认新增操作
    */
    addHandle() {
      // codeing ajax
      // ajax成功方法里面加入 关闭对话框标识
      this.dialogObj.isShow = false
    },
    /**
     * 确认修改操作
    */
    editHandle(formModel) {
      // codeing ajax
      // ajax成功方法里面加入 关闭对话框标识
      this.dialogObj.isShow = false
    }
  }
}
</script>
