<template>
  <c-view class="container">
    <c-card>
      <div class="info">
        <div class="label">店铺信息</div>
        <ul class="msg">
          <li>
            <span>店铺名称：</span>
            <span>{{formModel.shopName}}</span>
          </li>
          <li>
            <span>店铺类型：</span>
            <span>{{setTableColumnLabel(formModel.shopType, 'shopTypeList')}}</span>
          </li>
          <li>
            <span>店铺状态：</span>
            <span>{{setTableColumnLabel(formModel.shopStatus, 'disStatus')}}</span>
          </li>
        </ul>
      </div>
      <div class="info">
        <div class="label">账户信息</div>
        <ul class="msg">
          <li>
            <span>预存款余额(元)：</span>
            <span>{{formModel.transactionAmount || 0}}</span>
          </li>
        </ul>
      </div>
    </c-card>
    <c-card class="list-table">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :max-height="500"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :table-inner-btns="tableInnerBtns"
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
          <div class="opt-btn">
            <el-button type="primary" icon="el-icon-plus" :size="size" @click="showDialog">新增交易明细</el-button>
            <el-button :size="size" icon="el-icon-download" @click="exportFile">导出</el-button>
          </div>
        </template>
      </c-table>
    </c-card>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <list-add ref="childRef" :is-edit="dialogObj.isEdit" :init-data.sync="dialogObj.initData"></list-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import MixinTable from 'mixins/table'
import MixinForm from 'mixins/form'
import CDialog from 'components/dialog'
import CCard from 'components/card'
import ListAdd from './add'
import dictObj from '@/store/dictData'

export default {
  name: 'finance',
  mixins: [MixinTable, MixinForm],
  components: {
    CDialog,
    CCard,
    ListAdd
  },
  data(vm) {
    return {
      dialogObj: {},
      formModel: {},
      tableInnerBtns: [{
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          vm.showDialog({
            title: '更新交易明细',
            isEdit: true,
            initData: {
              id: row.id,
              type: row.type,
              transactionAmount: row.transactionAmount,
              orderNo: row.orderNo,
              remark: row.remark
            }
          })
        }
      },
      {
        name: '删除',
        icon: 'el-icon-detele',
        handle(row) {
          const { orderNo, id } = row
          vm.confirmTip(`确认删除 ${orderNo} 交易信息?`, () => {
            vm.deleteHandle({ id })
          })
        }
      }],
      tableHeader: [
        {
          label: '交易类型',
          prop: 'type',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.type, 'salesTypeList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.salesTypeList
          }
        },
        {
          label: '支付时间',
          prop: 'transactionTime',
          search: {
            type: 'dateTime'
          }
        },
        {
          label: '金额(元)',
          prop: 'transactionAmount'
        },
        {
          label: '关联订单号',
          prop: 'orderNo'
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '创建人',
          prop: 'opCreator'
        }
      ]
    }
  },

  created() {
    this.fetchData()
    this.getDetailInfo()
  },

  methods: {
    exportFile() {

    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增交易明细',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    getDetailInfo() {
      const { id } = this.$route.params
      this.$api.finance.queryShopList({ shopId: id }).then(res => {
        this.setTagsViewTitle()
        if (res.totalCount) {
          if (res.data) {
            this.formModel = res.data[0]
          }
        }
      })
    },
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { transactionTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(transactionTime, 'dateTime', 'startTime', 'endTime')
      this.isLoading = true
      this.$api.finance.queryAccountList({
        ...searchDate,
        ...other,
        ...page
      }).then(res => {
        this.isLoading = false
        if (res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data || []
        } else {
          this.tableList = res || []
        }
      })
    },
    dialogConfirm() {
      const { id } = this.$route.params
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const params = childRef.formModel
          const curAction = this.dialogObj.isEdit ? 'editAccountList' : 'addAccountList'
          this.$api.finance[curAction]({
            shopId: id,
            ...params
          }).then(res => {
            this.responeHandle(this.dialogObj.isEdit ? '更新成功' : '新增成功')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
		 * 删除单条表格数据
		 * @id {Number}
		 */
    deleteHandle(params) {
      this.$api.finance.deleteAccountList(params).then(() => {
        this.$msgTip('删除成功')
        this.fetchData()
      })
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding: 10px 0px;
  .info {
    padding: 10px 20px 0 20px;
    font-size: @f14;
    .label {
      font-weight: 600;
      margin-bottom: 20px;
    }
    .msg {
      margin-left: 50px;
      display: flex;
      li {
        width: 100%;
      }
      span {
        width: 50%;
        display: inline-block;

        &:first-child {
          width: 150px;
          text-align: right;
          font-weight: 500;
        }
      }
    }
  }
  .list-table {
    min-height: 670px;
    .opt-btn {
      margin-top: -10px;
      margin-bottom: 10px;
    }
  }
}
</style>
