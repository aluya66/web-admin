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
        :max-height="730"
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
            <el-form-item label="app编码">
              <el-select v-model="searchObj.appCode" class="search-item" :size="size" clearable>
                <el-option
                  v-for="item in appCodeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="渠道编号">
              <!-- <el-input
                v-model="searchObj.channelCode"
                class="search-item"
                :size="size"
                placeholder="渠道编号"
                clearable
              />-->
              <el-select v-model="searchObj.channelCode" class="search-item" :size="size" clearable>
                <el-option
                  v-for="item in channelCodeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商户号">
              <el-input
                v-model="searchObj.mchId"
                class="search-item"
                :size="size"
                placeholder="商户号"
                clearable
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchObj.status" class="search-item" :size="size" clearable>
                <el-option
                  v-for="item in appSecretSelect"
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
  name: 'accountList',
  mixins: [mixinTable],
  components: {},
  data(vm) {
    return {
      pickerOptions: utils.pickerOptions,
      dialogObj: {},
      searchObj: {
        appCode: '', // app编码
        channelCode: '', // 渠道编号
        mchId: '', // 商户号
        status: '' // 状态
      },
      appCodeSelect: [
        {
          label: 'ipx',
          value: 'ysdp'
        },
        {
          label: 'yoshop',
          value: 'yssp'
        },
        {
          label: '星go',
          value: 'ysgo'
        }
      ],
      appSecretSelect: [
        {
          label: '禁用',
          value: 0
        },
        {
          label: '启用',
          value: 1
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
        //   {
        //   width: 180,
        //   name: '查看详情',
        //   icon: 'el-icon-view',
        //   handle(row) {
        //     vm.showDialog({
        //       title: '详情',
        //       initData: row,
        //       isEdit: true
        //     })
        //   }
        // },
        {
          width: 100,
          prop: {
            name: 'status', // 为0或1
            toggle: [{
              icon: 'el-icon-check',
              title: '启用'
            }, {
              icon: 'el-icon-close',
              title: '禁用'
            }]
          },
          handle(row) {
            const { id, appCode, status } = row
            const tip = status === 1 ? '禁用' : '启用'
            vm.confirmTip(`请确认是否${tip} ${appCode} 账户`, {
              confirmHandle() {
                if (status === 1) {
                  vm.forbiddenData({ id })
                } else {
                  vm.verifyData({ id })
                }
              },
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
          }
        }
      ],
      tableHeader: [
        {
          label: 'app编号',
          prop: 'appCode',
          fixed: true,
          width: 100,
          formatter(row) {
            // return row.appCode === 'ysdp' ? 'IPX' : row.appCode === 'yssp' ? 'yoshop' : row.appCode === 'ysgo' ? '星GO' : row.appCode
            const items =
              row &&
              row.appCode &&
              vm.appCodeSelect.find(item => item.value === row.appCode)
            return items ? items.label : row.appCode
          }
        },
        {
          label: '渠道编号',
          prop: 'channelCode',
          fixed: true,
          width: 130,
          formatter(row) {
            return row.channelCode === 'ZFBAPP'
              ? '支付宝'
              : row.channelCode === 'WXAPP'
                ? '微信'
                : row.channelCode === 'JSAPI'
                  ? '微信小程序'
                  : row.channelCode === 'NATIVE'
                    ? '微信二维码'
                    : row.channelCode
          }
        },
        {
          label: '门店ID',
          prop: 'shopCode',
          width: 130
        },
        {
          label: '应用ID',
          prop: 'appId',
          width: 170
        },
        {
          label: '商户号',
          prop: 'mchId',
          width: 120
        },
        // {
        //   label: "应用 key",
        //   prop: "appKey",
        //   width: 120
        // },
        // {
        //   label: "应用密钥",
        //   prop: "appSecret",
        //   width: 200
        // },
        {
          label: '商户私钥',
          prop: 'mchPrivateKey',
          formatter(row) {
            return row.mchPrivateKey ? '已配置' : ''
          }
        },
        {
          label: '平台公钥',
          prop: 'platPublicKey',
          formatter(row) {
            return row.platPublicKey ? '已配置' : ''
          }
        },
        {
          label: '支付密钥',
          prop: 'payKey',
          formatter(row) {
            return row.payKey ? '已配置' : ''
          }
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row.status === 1 ? '启用' : '禁用'
          }
        },
        // {
        //   label: '创建人',
        //   prop: 'opCreator',
        //   width: 100
        // },
        // {
        //   label: '更新人',
        //   prop: 'opEditor',
        //   width: 100
        // },
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
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.pay.getAccount({
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
    // showDialog(opts) {
    //   this.dialogObj = {
    //     isShow: true,
    //     title: opts.title,
    //     isEdit: opts.isEdit,
    //     initData: opts.initData
    //   }
    // },
    verifyData(params, msgTip = '启用成功') {
      this.$api.pay.startAccount(params).then(() => {
        this.$msgTip(msgTip)
        this.fetchData()
      })
    },
    forbiddenData(params, msgTip = '禁用成功') {
      this.$api.pay.forbiddenAccount(params).then(() => {
        this.$msgTip(msgTip)
        this.fetchData()
      })
    }
  }
}
</script>
