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
            <el-form-item label="用户名称">
              <el-input
                v-model="searchObj.tradeUserName"
                class="search-item"
                :size="size"
                placeholder="用户名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="订单编号">
              <el-input
                v-model="searchObj.transactionCode"
                class="search-item"
                :size="size"
                placeholder="订单编号"
                clearable
              />
            </el-form-item>
            <el-form-item label="类型">
              <el-select
                v-model="searchObj.tradeItemType"
                class="search-item"
                :size="size"
                clearable
              >
                <el-option
                  v-for="item in tradeItemSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="业务线">
              <el-select v-model="searchObj.appCode" class="search-item" :size="size" clearable>
                <el-option
                  v-for="item in appCodeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="渠道">
              <el-select v-model="searchObj.channelCode" class="search-item" :size="size" clearable>
                <el-option
                  v-for="item in channelCodeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="对账状态">
              <el-select
                v-model="searchObj.accountStatus"
                class="search-item"
                :size="size"
                clearable
              >
                <el-option
                  v-for="item in accountStatusSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="支付方式">
              <el-select
                v-model="searchObj.tradeStatus"
                class="search-item"
                :size="size"
                clearable
              >
                <el-option
                  v-for="item in Select"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="交易时间">
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
  name: 'payList',
  mixins: [mixinTable],
  components: {
  },
  data(vm) {
    return {
      pickerOptions: utils.pickerOptions,
      dialogObj: {},
      searchObj: {
        tradeUserName: '', // 用户名称
        transactionCode: '', // 订单编号
        tradeItemType: '', // 类型
        appCode: '', // 业务线
        accountStatus: '', // 对账状态
        channelCode: '', // 交易渠道
        dataTime: ''
      },
      tradeItemSelect: [
        {
          label: '支付',
          value: 10
        },
        {
          label: '退款',
          value: 20
        },
        {
          label: '售后退款',
          value: 30
        },
        {
          label: '提现',
          value: 40
        }
      ],
      appCodeSelect: [
        {
          label: 'IPX',
          value: 'ysdp'
        }, {
          label: 'yoshop',
          value: 'yssp'
        }, {
          label: '星go',
          value: 'ysgo'
        }
      ],
      accountStatusSelect: [
        {
          label: '初始化',
          value: 1
        },
        {
          label: '待分批处理',
          value: 2
        },
        {
          label: '待统计',
          value: 3
        },
        {
          label: '成功',
          value: 4
        },
        {
          label: '失败',
          value: 5
        }
      ],
      tradeStatusSelect: [
        {
          label: '不需支付',
          value: 10
        },
        {
          label: '待支付',
          value: 20
        },
        {
          label: '支付中',
          value: 21
        },
        {
          label: '支付失败',
          value: 22
        },
        {
          label: '支付成功',
          value: 23
        },
        {
          label: '扣款通知中',
          value: 24
        },
        {
          label: '扣款通知失败',
          value: 25
        },
        {
          label: '扣款通知成功',
          value: 26
        },
        {
          label: '退款中',
          value: 30
        },
        {
          label: '退款失败',
          value: 31
        },
        {
          label: '退款成功',
          value: 32
        },
        {
          label: '退款通知中',
          value: 33
        },
        {
          label: '退款通知失败',
          value: 34
        },
        {
          label: '退款通知成功',
          value: 35
        },
        {
          label: '交易异常',
          value: 40
        },
        {
          label: '交易结束',
          value: 41
        },
        {
          label: '交易关闭',
          value: 50
        }
      ],
      channelCodeSelect: [
        {
          label: '支付宝',
          value: 'ZFBAPP'
        },
        {
          label: '微信',
          value: 'WXAPP'
        },
        {
          label: '微信小程序',
          value: 'JSAPI'
        },
        {
          label: '微信二维码支付',
          value: 'NATIVE'
        }
      ],
      tableInnerBtns: [
        // {
        //   width: 100,
        //   name: '查看详情',
        //   icon: 'el-icon-view',
        //   handle(row) {
        //     vm.showDialog({
        //       title: '详情',
        //       initData: row,
        //       isEdit: true
        //     })
        //   }
        // }
      ],
      tableHeader: [
        // {
        //   label: '用户名称',
        //   prop: 'tradeUserName',
        //   width: 130,
        //   fixed: true
        // },
        {
          label: '订单编号',
          prop: 'transactionCode',
          width: 160,
          fixed: true
        },
        {
          label: '业务线编码',
          prop: 'appCode',
          fixed: true,
          formatter(row) {
            return row.appCode === 'ysdp' ? 'IPX' : row.appCode === 'yssp' ? 'yoshop' : row.appCode === 'ysgo' ? '星GO' : '无'
          }
        },
        // {
        //   label: '门店编码',
        //   prop: 'shopCode',
        //   width: 180
        // },
        {
          label: '第三方交易编码',
          prop: 'thirdTradeCode',
          width: 250
        },
        {
          label: '流水号',
          prop: 'tradeItemCode',
          width: 220
        },
        {
          label: '支付类型',
          prop: 'payType'
        },
        {
          label: '对账状态',
          prop: 'accountStatus',
          width: 120,
          formatter(row) {
            return row.accountStatus
              ? vm.accountStatusSelect[row.accountStatus].label
              : ''
          }
        },
        {
          label: '交易渠道',
          prop: 'channelCode',
          formatter(row) {
            return row.channelCode === 'ZFBAPP' ? '支付宝' : row.channelCode === 'WXAPP' ? '微信' : row.channelCode === 'JSAPI' ? '微信小程序' : row.channelCode === 'NATIVE' ? '微信二维码支付' : '无'
          }
        },
        {
          label: '交易状态',
          prop: 'tradeStatus',
          formatter(row) {
            const curStatus = row && row.tradeStatus && vm.tradeStatusSelect.find(item => item.value === row.tradeStatus)
            return curStatus ? curStatus.label : ''
          }
        },
        {
          label: '交易手续费(元)',
          prop: 'fee',
          width: 100
        },
        {
          label: '交易支付总金额(元)',
          prop: 'payTotalAmountYuan',
          width: 100
        },
        {
          label: '交易实际支付的金额(元)',
          prop: 'paiedAmountYuan',
          width: 100
        },
        {
          label: '交易退款总金额(元)',
          prop: 'refundTotalAmountYuan',
          width: 100
        },
        {
          label: '交易实际退款的金额(元)',
          prop: 'refundAmountYuan',
          width: 100
        },
        {
          label: '交易通知时间',
          prop: 'tradeNotifiedTime',
          width: 100
        },
        {
          label: '交易时间',
          prop: 'tradeTime',
          width: 100
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100
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
    this.fetchData()
  },

  methods: {
    fetchData() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime, 'dateTime')
      this.isLoading = true
      this.$api.pay.getPay({
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
    }

    // showDialog(opts) {
    //   this.dialogObj = {
    //     isShow: true,
    //     title: opts.title,
    //     isEdit: opts.isEdit,
    //     initData: opts.initData
    //   }
    // }
  }
}
</script>
