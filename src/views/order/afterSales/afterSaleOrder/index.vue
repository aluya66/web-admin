<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
      <div class="header-btn">
        <el-button
          :size="size"
          type="primary"
          :loading="exportLoading"
          icon="el-icon-download"
          @click="exportFile"
        >导出</el-button>
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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        :no-btn="dialogObj.type === '2'"
        :btns="dialogObj.btns"
        @before-close="dialogObj.isShow = false"
        @on-submit="showRemarkDialog"
      >
        <c-details @update-submit="handleUpdateDetail" v-if="dialogObj.type !== 3" ref="childRef" :init-data.sync="dialogObj.initData"></c-details>
        <export-tip v-else @handle="dialogObj.isShow=false"></export-tip>
      </c-dialog>
    </div>

    <div v-if="remarkDialogShow">
      <c-dialog
        :is-show="remarkDialogShow"
        title="请输入审核说明"
        close-btn
        @before-close="remarkDialogShow = false"
        @on-submit="handleAduit"
      >
        <el-form
          ref="remarkFormRef"
          :model="remarkForm"
          label-width="80px"
          class="form"
          label-position="right"
          status-icon
          :rules="rules"
        >
          <el-form-item label="备注：" prop="remark">
            <el-input
              type="textarea"
              placeholder="请输入备注说明"
              v-model.trim="remarkForm.remark"
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
import CDetails from './details'
import dictObj from '@/store/dictData'
import ExportTip from '../../../common/exportTip.vue'
export default {
  name: 'afterSalesList',
  mixins: [mixinTable],
  components: {
    CDialog,
    CDetails,
    ExportTip
  },
  data(vm) {
    return {
      exportLoading: false,
      logisticsList: [],
      rules: {
        remark: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      aduitResult: '',
      remarkDialogShow: false,
      remarkForm: { remark: '' },
      // 对话框对象
      dialogObj: {},
      // 表格内操作按钮
      tableInnerBtns: [
        {
          name: '详情',
          icon: 'el-icon-show',
          handle(row) {
            vm.getDetail(row.afterSalesCode, 1)
          }
        },
        {
          prop: {
            name: 'status',
            toggle: [{
              title: '审核',
              icon: 'el-icon-aduit',
              value: ['1']
            }]
          },
          handle(row) {
            vm.getDetail(row.afterSalesCode, 2)
          }
        }
      ],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '售后单号',
          prop: 'afterSalesCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '订单号',
          prop: 'thirdOrderCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, dictObj.afterSalesStatus)
          },
          search: {
            prop: 'statusList',
            type: 'dict',
            optionsList: dictObj.afterSalesStatus
          }
        },
        {
          label: '售后类型',
          prop: 'afterSalesType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.afterSalesType, dictObj.afterSalesTypes)
          },
          search: {
            prop: 'applyAfterSalesType',
            type: 'dict',
            optionsList: dictObj.afterSalesTypes
          }
        },
        {
          label: '所属店铺',
          prop: 'storeName',
          search: {
            type: 'dict',
            optionsList: [],
            label: '物流',
            prop: 'deliveryCode'
          }
        },
        {
          label: '用户名称',
          prop: 'buyerNick',
          search: {
            label: '商品名称',
            prop: 'productAtrName',
            type: 'input'
          }
        },
        {
          label: '用户电话',
          prop: 'buyerMobile',
          search: {
            type: 'input'
          }
        },
        {
          label: '物流公司',
          prop: 'deliveryName',
          search: {
            label: 'SPU',
            type: 'input',
            prop: 'productAtrNumber'
          }
        },
        {
          label: '物流单号',
          prop: 'deliveryNo',
          search: {
            label: 'SKU',
            type: 'input',
            prop: 'skuCode'
          }
        },
        {
          width: 150,
          label: '售后时间',
          prop: 'created',
          search: {
            type: 'dateTime',
            prop: 'dateTime'
          }
        }
      ]
    }
  },
  created() {
    this.fetchData()
    this.getLogistics()
  },
  methods: {
    exportFile() {
      const { dateTime, statusList, ...other } = this.searchObj
      const searchDate = this.getSearchDate(
        dateTime,
        'dateTime',
        'startCreated',
        'endCreated'
      )
      this.exportLoading = true
      this.$api.order.afterSalesExport({
        ...searchDate,
        statusList: [statusList],
        ...other
      }).then(res => {
        if (res) {
          this.showDialog({
            title: '售后单导出',
            type: 3
          })
        } else {
          this.$msgTip('导出数据失败', 'warning')
        }
        this.exportLoading = false
      })
    },
    getLogistics() {
      this.$api.basic
        .getLogistics({
          pageSize: 100,
          pageNo: 1
        })
        .then(res => {
          this.isLoading = false
          if (res && res.totalCount) {
            const { data } = res
            this.logisticsList = data && data.map(val => ({ label: val.logiName, value: val.logiCode }))
          } else {
            this.logisticsList = res && res.map(val => ({ label: val.logiName, value: val.logiCode }))
          }
          this.setSearchOptionsList('deliveryCode', this.logisticsList)
        })
    },
    showRemarkDialog(btnName) { // 审核结果：10:通过，11:拒绝  坑点：btnName中文字带空格
      this.remarkDialogShow = true
      this.aduitResult = btnName.replace(/\s*/g, '') === '通过' ? 30 : 11// TODO：通过暂时处理流程扭转为 等待买家发货
    },
    handleAduit() {
      this.$refs.remarkFormRef.validate(valid => {
        if (valid) {
          const afterSalesType = this.$refs.childRef.formModel.afterSalesType
          this.$api.order
            .approveAfterSales({
              afterSalesCode: this.dialogObj.initData.afterSalesCode,
              afterSalesType,
              approveRemark: this.remarkForm.remark,
              approveResult: afterSalesType === 1 ? 50 : this.aduitResult// TODO：如果afterSalesType为1，则是仅退款，仅退款直接将转改扭转为等待退款
            })
            .then(res => {
              this.remarkDialogShow = false
              this.responeHandle('审核成功')
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getDetail(afterSalesCode, type) {
      this.$api.order
        .afterSalesDetail({
          afterSalesCode
        })
        .then(res => {
          this.isLoading = false
          this.showDialog({
            initData: { ...res, dialogType: type, logisticsList: this.logisticsList },
            btns: type === 2 ? [{ label: '通 过', name: 'submit', type: 'primary' }, { label: '拒 绝', name: 'submit' }, { label: '取 消', name: 'cancel' }] : [],
            type
          })
        })
    },
    /*
     * 查询表格列表数据
     */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { dateTime, statusList, ...other } = this.searchObj
      const searchDate = this.getSearchDate(
        dateTime,
        'dateTime',
        'startTime',
        'endTime'
      )
      this.isLoading = true
      this.$api.order
        .queryAfterSalesList({
          ...searchDate,
          statusList: [statusList],
          ...other,
          ...page
        })
        .then(res => {
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
     * dialog对话框数据处理
     * @opts {*}
     */
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '售后单详情',
        initData: opts.initData,
        btns: opts.btns,
        type: opts.type
      }
    },
    // 售后单详情中更新物流信息
    handleUpdateDetail(params) {
      this.$api.order.updateRefundDelivery(params).then(res => {
        this.$msgTip('修改成功！')
        this.fetchData()// 更新列表数据
      })
    }
  }
}
</script>
<style>
</style>
