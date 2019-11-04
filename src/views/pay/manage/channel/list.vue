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
            <el-form-item label="名称">
              <el-input
                v-model="searchObj.channelName"
                class="search-item"
                :size="size"
                placeholder="名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="编码">
              <el-select v-model="searchObj.channelCode" class="search-item" :size="size" clearable>
                <el-option
                  v-for="item in channelCodeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="searchObj.channelType" class="search-item" :size="size" clearable>
                <el-option
                  v-for="(item, index) in findchannel"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                v-model="searchObj.channelState"
                class="search-item"
                :size="size"
                clearable
              >
                <el-option
                  v-for="item in channelStateSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
  name: 'channelList',
  mixins: [mixinTable],
  components: {},
  data(vm) {
    return {
      findchannel: [], // 渠道枚举值
      pickerOptions: utils.pickerOptions,
      dialogObj: {},
      searchObj: {
        channelName: '', // 名称
        channelCode: '', // 编码
        channelType: '', // 类型
        channelState: '' // 状态
      },
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
      findchannel: [{
        label: '支付宝',
        value: 'ZPF'
      }, {
        label: '微信',
        value: 'WX'
      }, {
        label: '钱包',
        value: 'WALLET'
      }, {
        label: '星购卡',
        value: 'GOCARD'
      }],
      channelStateSelect: [
        {
          label: '禁用',
          value: 0
        },
        {
          label: '启用',
          value: 1
        }
      ],
      tableInnerBtns: [{
        name: '启用/禁用',
        width: 130,
        icon: 'el-icon-check',
        handle(row) {
          const { channelId, channelName } = row
          vm.confirmTip(`请确认启用/禁用 ${channelName} 此账户`, {
            confirmHandle() {
              vm.verifyData({ channelId })
            },
            cancalHandle() {
              vm.forbiddenData({ channelId })
            },
            confirmButtonText: '启用',
            cancelButtonText: '禁用'
          })
        }
      }],
      tableHeader: [
        {
          label: 'ID',
          prop: 'channelId'
        },
        {
          label: '名称',
          prop: 'channelName'
        },
        {
          label: '编码',
          prop: 'channelCode',
          formatter(row) {
            return row.channelCode === 'ZFBAPP'
              ? '支付宝'
              : row.channelCode === 'WXAPP'
                ? '微信'
                : row.channelCode === 'JSAPI'
                  ? '微信小程序'
                  : row.channelCode === 'NATIVE'
                    ? '微信二维码支付'
                    : '无'
          }
        },
        {
          label: '类型',
          prop: 'channelType',
          formatter(row) {
            return row.channelType === 'ZPF'
              ? '支付宝'
              : row.channelType === 'WX'
                ? '微信'
                : row.channelType === 'WALLET'
                  ? '钱包'
                  : row.channelType === 'GOCARD'
                    ? '星购卡'
                    : '无'
          }
        },
        {
          label: '交易金额*比例',
          prop: 'channelFeeRule'
        },
        {
          label: '状态',
          prop: 'channelState',
          formatter(row) {
            return row.channelState === 0 ? '禁用' : '启用'
          }
        },
        {
          label: '创建人',
          prop: 'opCreator',
          width: 100
        },
        {
          label: '修改人',
          prop: 'opEditor',
          width: 100
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100
        },
        {
          label: '最后更新时间',
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
      this.$api.pay
        .getPaychannel({
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
    },
    verifyData(param, msgTip = '启用成功') {
      this.$api.pay.paychannelStart(param).then(() => {
        this.$msgTip(msgTip)
        this.fetchData()
      })
    },
    forbiddenData(params, msgTip = '禁用成功') {
      this.$api.pay.paychannelForbidden(params).then(() => {
        this.$msgTip(msgTip)
        this.fetchData()
      })
    }
  }
}
</script>

<style lang='less' scoped>
</style>
