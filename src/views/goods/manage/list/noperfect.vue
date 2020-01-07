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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <el-form
          ref="formRef"
          :model="formModel"
          label-width="80px"
          class="form"
          label-position="right"
          status-icon
        >
          <el-form-item prop="couponRemark">
            <el-input
              type="textarea"
              placeholder="请输入备注说明"
              v-model.trim="formModel.couponRemark"
              rows="4"
              maxlength="300"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
const goodsStatusList = [{
  value: 1,
  label: '上架'
}, {
  value: 2,
  label: '下架'
}]
export default {
  name: 'ysspList',
  mixins: [mixinTable],
  components: {
    CDialog
  },
  data(vm) {
    return {
      formModel: {},
      dialogObj: {}, // 对话框数据
      tableInnerBtns: [
        {
          name: '编辑',
          notBtn: 'status',
          icon: 'el-icon-edit',
          handle(row) {
            const { couponId } = row
            vm.routerLink(`/marketing/rule/ruleInfo/yssp/${couponId}`)
          }
        }
      ],
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
            label: '商品状态',
            type: 'select',
            prop: 'marketable',
            optionsList: goodsStatusList
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
  activated() {
    this.fetchData()
    this.getCategoryList()
    this.getBrandList()
  },
  methods: {
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
    getCategoryList() {
      this.$api.basic.queryCategory().then(res => {
        this.setSearchOptionsList('categoryCode', res)
      })
    },
    /**
     * 获取表格数据
     */
    fetchData() {
      const { categoryCode, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const categoryVal = {
        cateCodeFirst: categoryCode[0] || '',
        cateCodeSecond: categoryCode[1] || '',
        cateCodeThird: categoryCode[2] || '',
      }
      this.isLoading = true
      this.$api.marketing.getSampleGoodsList({
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
