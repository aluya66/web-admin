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
const perfectStatusList = [{
  value: 'UN_PERFECT',
  label: '未完善'
}, {
  value: 'PERFECT',
  label: '完善'
}, {
  value: 'PART_PERFECT',
  label: '部分完善'
}]
export default {
  name: 'noPerfectList',
  mixins: [mixinList, mixinTable],
  data(vm) {
    return {
      tableHeader: [
        {
          label: '商品主图',
          prop: 'coverImg',
          width: 100,
          fixed: true,
          isImage: true
        },
        {
          label: '商品名称',
          prop: 'goodsName',
          search: {
            type: 'input'
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
          label: '供应商款号',
          prop: 'supplierNumber',
          search: {
            type: 'input'
          }
        },
        {
          label: '所属分类',
          prop: 'categoryName',
          search: {
            type: 'cascader',
            prop: 'categoryCode',
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
          label: '内容完善状态',
          prop: 'perfectName',
          search: {
            label: '状态',
            type: 'select',
            prop: 'perfectStatus',
            optionsList: perfectStatusList
          }
        },
        {
          label: '创建人',
          prop: 'createbyName',
          search: {
            type: 'input'
          }
        },
        {
          label: '上货人',
          prop: 'publisher'
        },
        {
          label: '创建时间',
          prop: 'created'
        },
        {
          label: '编辑人',
          prop: 'updatebyName'
        },
        {
          label: '编辑时间',
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
      const { categoryCode, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const categoryVal = {
        cateCodeFirst: categoryCode[0] || '',
        cateCodeSecond: categoryCode[1] || '',
        cateCodeThird: categoryCode[2] || ''
      }
      this.isLoading = true
      this.$api.goods.getSampleGoodsList({
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
