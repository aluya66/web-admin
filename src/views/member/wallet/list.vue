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
                placeholder="手机号"
                clearable
              />
            </el-form-item>
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
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  name: 'memberWalletList',
  mixins: [mixinTable],
  data(vm) {
    return {
      pickerOptions: utils.pickerOptions,
      tableList: [],
      dialogObj: {},
      searchObj: {
        nickName: '', // 昵称
        phoneNumber: '' // 手机号
      },
      tableInnerBtns: [],
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
      this.$api.member
        .getWallet({
          ...searchDate,
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
    }
  }
}
</script>

<style lang='less' scoped>
</style>
