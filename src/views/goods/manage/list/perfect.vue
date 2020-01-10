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
import mixinList from './mixin'
import utils from 'utils'
const goodsStatusList = [{
  value: 1,
  label: '可销售'
}, {
  value: 2,
  label: '不可销售'
}]
export default {
  name: 'perfectList',
  mixins: [mixinList, mixinTable],
  data(vm) {
    return {
      tableInnerBtns: [{
        width: 150,
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          const {
            id,
            perfectName
          } = row
          vm.routerLink(`/goods/manage/detail/${id}/${perfectName}`)
        }
      },
      {
        name: '关联属性',
        icon: 'el-icon-plus',
        handle(row) {
          vm.routerLink(`/goods/manage/label/${row.id}`)
        }
      }],
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
          label: '商品来源',
          prop: 'originName'
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
          label: '成衣供货价(元)',
          prop: 'supplyprice'
        },
        {
          label: '成衣散批价(元)',
          prop: 'wholesaleprice'
        },
        {
          label: '成衣大批价(元)',
          prop: 'largePrice'
        },
        {
          label: '成衣会员价(元)',
          prop: 'price'
        },
        {
          label: '零售价(元)',
          prop: 'tagprice'
        },
        {
          label: '库存',
          prop: 'stock',
          search: {
            type: 'min-max'
          }
        },
        {
          label: '上架状态',
          prop: 'marketableName'
        },
        {
          label: '创建时间',
          prop: 'created',
          search: {
            prop: 'createDateTime',
            type: 'dateTime'
          }
        },
        {
          label: '更新时间',
          prop: 'updated'
        }
      ]
    }
  },
  methods: {
    /**
     * 获取表格数据
     */
    fetchData() {
      const { createDateTime, updateDateTime, categoryCode, stock, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const createDate = this.getSearchDate(createDateTime, '', 'beginDate', 'endDate')
      const updateDate = this.getSearchDate(updateDateTime, '', 'updateBeginDate', 'updateEndDate')
      const categoryVal = {
        cateCodeFirst: categoryCode[0] || '',
        cateCodeSecond: categoryCode[1] || '',
        cateCodeThird: categoryCode[2] || ''
      }
      if (utils.isInteger(stock[0]) || utils.isInteger(stock[1])) {
        return this.$msgTip('商品库存请输入正整数', 'warning')
      }
      if (stock[0] > stock[1]) {
        return this.$msgTip('库存最小值不能大于最大值', 'warning')
      }

      this.isLoading = true
      this.$api.goods.getPerfectGoodsList({
        ...createDate,
        ...updateDate,
        ...categoryVal,
        ...other,
        ...page,
        minStock: stock[0] || '',
        maxStock: stock[1] || ''
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
