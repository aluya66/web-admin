<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
    </template>
    <div class="main__box">
      <c-table
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
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
            <el-form-item label="昵称">
              <el-input
                v-model="searchObj.nickName"
                class="search-item"
                :size="size"
                placeholder="昵称"
                clearable
              />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input
                v-model="searchObj.phoneNumber"
                class="search-item"
                :size="size"
                placeholder="手机号码"
                clearable
              />
            </el-form-item>
            <!-- <el-form-item label="操作时间">
              <el-date-picker
                :size="size"
                v-model="searchObj.dataTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始时间"
                format="yyyy-MM-dd HH:mm:ss"
                end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']"
              >align="right"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
              <el-button
                type="primary"
                class="search-btn"
                :size="size"
                icon="el-icon-search"
                @click="searchSubmit"
              >查询</el-button>
            </el-form-item>
          </el-form>
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
import utils from 'utils'

export default {
  name: 'memberWalletList',
  mixins: [mixinTable],
  components: {
    CDialog,
    WAdd
  },
  data(vm) {
    return {
      pickerOptions: utils.pickerOptions,
      dialogObj: {},
      searchObj: {
        nickName: '', // 昵称
        phoneNumber: '', // 手机号
        dataTime: ''
      },
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
          prop: 'nickName'
        },
        {
          label: '手机号',
          prop: 'phoneNumber'
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
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
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

<style lang='less' scoped>
</style>
