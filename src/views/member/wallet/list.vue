<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :max-height="685"
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
        @before-close="dialogObj.isShow = false"
        :btns="dialogObj.btns"
      >
        <w-add ref="childRef" :wallet-id="dialogObj.id"></w-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import WAdd from './add'

export default {
  name: 'memberWalletList',
  mixins: [mixinTable],
  components: {
    CDialog,
    WAdd
  },
  data(vm) {
    return {
      dialogObj: {},
      tableInnerBtns: [
        {
          width: 100,
          name: '查看明细',
          icon: 'el-icon-view',
          handle(row) {
            vm.showDialog(row.id)
          }
        }
      ],
      tableHeader: [
        {
          label: '昵称',
          prop: 'nickName',
          search: {
            type: 'input'
          }
        },
        {
          label: '手机号',
          prop: 'phoneNumber',
          search: {
            type: 'input'
          }
        },
        {
          label: '充值总金额(元)',
          prop: 'totalAmount'
        },
        {
          label: '余额(元)',
          prop: 'balance'
        },
        {
          label: '冻结金额(元)',
          prop: 'frozen'
        },
        {
          label: '已消费充值金额(元)',
          prop: 'consumptionAmount'
        },
        {
          label: '已赠送总金额(元)',
          prop: 'totalGiftAmount'
        },
        {
          label: '可用赠送金额(元)',
          prop: 'availableGiftAmount'
        },
        {
          label: '失效赠送金额(元)',
          prop: 'expiredGiftAmount'
        },
        {
          label: '已消费赠送金额(元)',
          prop: 'consumptionGiftAmount'
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100,
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
  },
  methods: {
    fetchData() {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.member.getWallet({
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
    showDialog(id) {
      this.dialogObj = {
        id,
        isShow: true,
        title: '明细列表',
        btns: [{
          label: '取消',
          name: 'cancel'
        }]
      }
    }
  }
}
</script>
