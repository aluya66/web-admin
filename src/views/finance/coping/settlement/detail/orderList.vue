<template>
  <c-view>
    <c-table
      ref="cTable"
      hasBorder
      :max-height="300"
      :size="size"
      :loading="isLoading"
      :table-header="tableHeader"
      :table-list="tableList"
      :table-inner-btns="tableInnerBtns"
      :page-info="pageInfo"
      @change-pagination="changePagination"
    >
      <template v-slot:header>
        <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
          <el-form-item label="结算店铺" prop="shopId" :rules="{required: true, message: ''}">
            <query-dict
              :disabled="isEdit"
              :size="size"
              :dict-list="shopList"
              placeholder="请选择店铺"
              :value.sync="searchObj.shopId"
            ></query-dict>
          </el-form-item>
          <el-form-item label="结算日期">
            <el-date-picker
              disabled
              v-model="searchObj.settleStartDate"
              type="date"
              :size="size"
              placeholder="开始日期"
            ></el-date-picker>
            <span>～</span>
            <el-date-picker
              :disabled="isEdit"
              v-model="searchObj.settleEndDate"
              type="date"
              :size="size"
              placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-button
            type="primary"
            :size="size"
            :loading="btnLoading"
            v-if="!isEdit"
            @click="searchSubmitHandle"
          >匹配订单数据</el-button>
        </el-form>
        <div class="input-info">
          <p>1、点击【匹配订单数据】，系统会自动匹配符合该店铺在你设置的结算周期内可结算的订单以及售后订单</p>
          <p>2、数据加载需要时间，数据过大会有延时，可以喝口茶，等待一小会儿</p>
        </div>
      </template>
    </c-table>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'
// import dictObj from '@/store/dictData'

export default {
  mixins: [mixinTable],
  props: {
    initData: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    queryData: {
      get() {
        return this.initData
      },
      set(val) {
        this.$emit('update:init-data', val)
      }
    }
  },
  data(vm) {
    return {
      btnLoading: false,
      pickerOptions: {
        disabledDate(time) {
          const curDate = new Date()
          return time.getTime() > curDate.getTime() - 24 * 60 * 60 * 1000
        }
      },
      businessSettleId: '', // 订单列表查询id
      shopList: [], // 加盟店铺列表
      tableInnerBtns: [],
      tableHeader: [
        {
          label: '订单号',
          prop: 'orderCode'
        },
        {
          label: '订单完成时间',
          prop: 'orderFinishTime'
        },
        {
          label: '订单类型',
          prop: 'orderType'
        },
        {
          label: '订单金额(元)',
          prop: 'orderMoney'
        },
        {
          label: '订单优惠金额(元)',
          prop: 'orderDiscountsAmount'
        },
        {
          label: '余额抵扣(元)',
          prop: 'orderBalance'
        },
        {
          label: '代金券抵扣(元)',
          prop: 'orderVoucherAmount'
        },
        {
          label: '星购卡支付金额(元)',
          prop: 'storedCardAmount'
        },
        {
          label: '积分抵扣(元)',
          prop: 'payPointAmount'
        },
        {
          label: '订单实收金额(元)',
          prop: 'actualAmount'
        },
        {
          label: '平台服务费(元)',
          prop: 'serviceFee'
        },
        {
          label: '退款金额(元)',
          prop: 'afterRefundAmount'
        },
        {
          label: '实际退款金额(元)',
          prop: 'afterActualRetundAmount'
        },
        {
          label: '关联订单号',
          prop: 'objectOrderNo'
        }
      ]
    }
  },
  created() {
    this.searchObj = {
      shopId: '',
      settleStartDate: '',
      settleEndDate: ''
    }
    this.queryShopList()
  },
  watch: {
    'searchObj.shopId'(val) {
      val && this.queryDate(val)
    }
  },
  methods: {
    /**
     *  获取加盟开启的门店列表，
     */
    queryShopList() {
      this.$api.channel.getShopList({ shopType: 2, status: 1, pageSize: 100, pageNo: 1 }).then(res => {
        if (res && res.data) {
          console.log(res, 'shopList')
          this.shopList = res.data.map(val => ({ label: val.shopName, value: val.shopId }))
        }
      })
    },
    /**
     * 根据店铺id获取结算开始日期
    */
    queryDate() {
      const { shopId } = this.searchObj
      this.$api.finance.querySettleDate({ shopId }).then(res => {
        this.searchObj.settleStartDate = res.settleStartDate
      })
    },
    /**
     * 匹配订单列表数据
     */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.finance.queryBusinessSettleDetailPage({
        businessSettleId: this.businessSettleId,
        ...page
      }).then(res => {
        this.btnLoading = false
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
    /*
	   * 点击匹配订单数据按钮，得出合计、付款等信息
	   */
    searchSubmitHandle() {
      this.btnLoading = true
      const { settleStartDate, settleEndDate, ...other } = this.searchObj
      this.$api.finance.matchingOrder({
        settleStartDate: utils.fomartDate(settleStartDate, '{y}-{m}-{d}'),
        settleEndDate: utils.fomartDate(settleEndDate, '{y}-{m}-{d}'),
        ...other
      }).then(res => {
        if (res) {
          this.queryData = res
          this.businessSettleId = res.detailBusinessSettleVo ? res.detailBusinessSettleVo.id : ''
          this.fetchData()
        }
      })
    }
  }
}
</script>
