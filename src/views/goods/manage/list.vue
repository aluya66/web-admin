<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button
          :size="size"
          type="primary"
          v-permission="$route.meta.roles"
          icon="el-icon-plus"
          @click="routerLink('/goods/add')"
        >新增</el-button>
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
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'

const marketableSelect = [{
  value: '1',
  label: '上架'
},
{
  value: '2',
  label: '下架'
}]

export default {
  name: 'goodsManage',
  mixins: [mixinTable],
  data(vm) {
    return {
      originList: [{
        label: '门店挂板',
        value: 1
      }, {
        label: '代销商品',
        value: 2
      }, {
        label: '自营商品',
        value: 3
      }],
      tableInnerBtns: [{
        width: 150,
        name: '详情',
        icon: 'el-icon-view',
        handle(row) {
          vm.routerLink(`/goods/manage/detail/${row.id}`)
        }
      },
      {
        name: '关联属性',
        icon: 'el-icon-plus',
        handle(row) {
          vm.routerLink(`/goods/manage/label/${row.id}`)
        }
      }
        // {
        //   name: '删除',
        //   icon: 'el-icon-delete',
        //   handle(row) {
        //     const { goodsName, id } = row
        //     vm.confirmTip(`确认删除${goodsName}商品信息`, () => {
        //       vm.deleteData({ id })
        //     })
        //   }
        // }
      ],
      tableHeader: [
        {
          label: '商品ID',
          prop: 'id',
          fixed: true
        },
        {
          label: '商品编码',
          prop: 'goodsBn',
          width: 180,
          search: {
            type: 'input'
          }
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
          label: '品牌',
          prop: 'brandName',
          search: {
            type: 'dict',
            optionsList: [],
            allowCreate: true,
            filterable: true
          }
        },
        {
          label: '商品类目',
          prop: 'categoryName',
          search: {
            prop: 'categoryCode',
            type: 'cascader',
            optionsList: [],
            optionsProps: {
              expandTrigger: 'hover'
            }
          }
        },
        {
          label: '商品来源',
          prop: 'origin',
          width: 120,
          formatter(row) {
            return row.origin ? vm.originList[row.origin - 1].label : ''
          }
        }, {
          label: '样衣成本价(元)',
          prop: 'sampleCostPrice',
          width: 115
        },
        {
          label: '成衣成本价(元)',
          prop: 'costPrice',
          width: 115
        },
        {
          label: '成衣供货价(元)',
          prop: 'supplyPrice',
          width: 115
        },
        {
          label: '成衣散批价(元)',
          prop: 'wholesalePrice',
          width: 115
        },
        {
          label: '成衣大批价(元)',
          prop: 'largeBatchPrice',
          width: 115
        },
        {
          label: '成衣会员价(元)',
          prop: 'memberPrice',
          width: 115
        },
        {
          label: '零售价(元)',
          prop: 'retailPrice',
          width: 90
        },
        {
          label: '成衣库存(件)',
          prop: 'stock',
          width: 100,
          search: {
            label: '库存',
            type: 'min-max'
          }
        },
        {
          label: '成本价',
          prop: 'marketable',
          width: 100
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
          label: '创建时间',
          prop: 'created',
          width: 100,
          search: {
            prop: 'dateTime',
            type: 'dateTime'
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
      const { dateTime, stock, categoryCode, ...other } = this.searchObj
      const curCategoryCode = categoryCode.length ? categoryCode[categoryCode.length - 1] : ''
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
      if (utils.isInteger(stock[0]) || utils.isInteger(stock[1])) {
        return this.$msgTip('商品库存请输入正整数', 'warning')
      }
      if (stock[0] > stock[1]) {
        return this.$msgTip('库存最小值不能大于最大值', 'warning')
      }
      this.isLoading = true
      this.$api.goods.getList(
        {
          ...searchDate,
          ...other,
          ...page,
          minStock: stock[0] || '',
          maxStock: stock[1] || '',
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
        const categoryList = utils.formartLevelData(res || [])
        this.setSearchOptionsList('categoryCode', categoryList)
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
          const brandList = res.data.map(res => ({ value: res.name, label: res.name })) || []
          this.setSearchOptionsList('brandName', brandList)
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
      this.$api.basic.deleteBrand(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    }
  }
}
</script>
