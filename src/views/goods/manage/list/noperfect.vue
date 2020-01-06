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
          prop: 'couponId',
          width: 100,
          fixed: true
        },
        {
          label: '商品名称',
          prop: 'couponName',
          search: {
            type: 'input'
          }
        },
        {
          label: '商品款号',
          prop: 'receiveType'
        },
        {
          label: '供应商款号',
          prop: 'typeName'
        },
        {
          label: '所属分类',
          prop: 'opCreator'
        },
        {
          label: '内容完善状态',
          prop: 'opCreator'
        },
         {
          label: '创建人',
          prop: 'opCreator'
        },
        {
          label: '创建时间',
          prop: 'created'
        },
         {
          label: '编辑人',
          prop: 'opCreator'
        },
         {
          label: '编辑时间',
          prop: 'opCreator'
        }
      ]
    }
  },
  activated() {
    this.fetchData()
  },
  methods: {
    /**
     * 获取表格数据
     */
    fetchData() {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.marketing.getSampleGoodsList({
        ...searchDate,
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
    },
    /**
     * 删除表格单条数据
     *
     * @param {*} curPromise
     * @param {string} [msgTip='删除成功']
     */
    deleteData(param, msgTip = '删除成功') {
      this.$api.marketing.deleteCouponRule(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  width: 90%;
}
</style>
