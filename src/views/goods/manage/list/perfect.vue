<template>
  <c-view>
    <c-table
      selection
      hasBorder
      :max-height="maxHeight"
      :size="size"
      :loading="isLoading"
      :table-header="tableHeader"
      :table-list="tableList"
      :page-info="pageInfo"
      :table-inner-btns="tableInnerBtns"
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
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
const goodsStatusList = [{
  value: 1,
  label: '上架'
}, {
  value: 2,
  label: '下架'
}]
export default {
  name: 'perfectList',
  mixins: [mixinTable],
  data(vm) {
    return {
      brandList: [],
      formModel: {},
      tableInnerBtns: [
        {
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const { couponId } = row
            vm.routerLink(`/marketing/rule/ruleInfo/yssp/${couponId}`)
          }
        }
      ],
      tableHeader: [
        {
          label: '商品ID',
          prop: 'id',
          width: 100,
          fixed: true,
          search: {
            prop: 'goodsName',
            type: 'input',
            label: '商品名称'
          }
        },
        {
          label: '商品款号',
          prop: 'goodsBn',
          search: {
            type: 'input'
          }
        },
        {
          label: '商品名称',
          prop: 'goodsName',
          search: {
            label: '供应商款号',
            type: 'input',
            prop: 'supplierNumber'
          }
        },
        {
          label: '商品图片',
          prop: 'coverImg',
          width: 100,
          isImage: true,
          search: {
            label: '商品状态',
            type: 'select',
            prop: 'marketable',
            optionsList: goodsStatusList
          }
        },
        {
          label: '品牌',
          prop: 'brandName',
          search: {
            prop: 'brandCode',
            type: 'dict',
            optionsList: []
          }
        },
        {
          label: '商品类目',
          prop: 'categoryName',
          search: {
            type: 'cascader',
            prop: 'categoryCode',
            label: '所属分类',
            optionsProps: {
              children: 'childrenList',
              label: 'categoryName',
              value: 'categoryCode',
              checkStrictly: true
            },
            optionsList: []
          }
        },
        {
          label: '样衣成本价',
          prop: 'sampleCostprice',
          search: {
            label: '更新时间',
            prop: 'updateDateTime',
            type: 'dateTime'
          }
        },
        {
          label: '成衣成本价',
          prop: 'costprice'
        },
        {
          label: '创建时间',
          prop: 'created',
          search: {
            prop: 'createDateTime',
            type: 'dateTime'
          }
        }
      ]
    }
  },
  created() {
    this.getBrandList()
    this.getCategoryList()
  },
  activated() {
    this.fetchData()
  },
  methods: {
    getCategoryList() {
      this.$api.basic.queryCategory().then(res => {
        this.setSearchOptionsList('categoryCode', res)
      })
    },
    getBrandList() {
      this.isLoading = true
      this.$api.basic
        .brandList({
          pageSize: 120,
          pageNo: 1
        })
        .then(res => {
          this.isLoading = false
          if (res && res.totalCount) {
            const { data } = res
            this.brandList = data || []
          } else {
            this.brandList = res || []
          }
          this.setSearchOptionsList('brandCode', this.brandList.map((item) => {
            return {
              value: item.code,
              label: item.name
            }
          }))
        })
    },
    /**
     * 获取表格数据
     */
    fetchData() {
      const { createDateTime, updateDateTime, categoryCode, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const createDate = this.getSearchDate(createDateTime, '', 'beginDate', 'endDate')
      const updateDate = this.getSearchDate(updateDateTime, '', 'updateBeginDate', 'updateEndDate')
      const categoryVal = {
        cateCodeFirst: categoryCode[0] || '',
        cateCodeSecond: categoryCode[1] || '',
        cateCodeThird: categoryCode[2] || '',
      }
      this.isLoading = true
      this.$api.goods.getPerfectGoodsList({
        ...createDate,
        ...updateDate,
        ...categoryVal,
        ...other,
        ...page
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data || []
        } else {
          this.tableList = res || []
        }
      })
    }
  }
}
</script>
