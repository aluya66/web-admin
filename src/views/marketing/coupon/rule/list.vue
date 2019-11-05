<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button
          :size="size"
          type="primary"
          icon="el-icon-plus"
          @click="routerLink('/marketing/coupon/ruleInfo')"
        >新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        selection
        hasBorder
        :size="size"
        :max-height="685"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search">
            <el-form-item label="类型名称">
              <el-input
                v-model="searchObj.couponRuleName"
                class="search-item"
                :size="size"
                placeholder="类型名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="类型">
              <el-select
                v-model="searchObj.couponRuleType"
                class="search-item"
                :size="size"
                clearable
              >
                <el-option
                  v-for="item in couponRuleSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型状态">
              <el-select
                v-model="searchObj.couponRuleStatus"
                :size="size"
                class="search-item"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in couponRuleTypeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker
                :size="size"
                v-model="searchObj.dataTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始时间"
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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
      >
        <add-rule ref="childRef" :init-data="dialogObj.initData"></add-rule>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'
import CDialog from 'components/dialog'
import AddRule from './detail/index'

export default {
  name: 'couponRuleList',
  mixins: [mixinTable],
  components: {
    CDialog,
    AddRule
  },
  data(vm) {
    return {
      searchObj: {
        couponRuleType: '', // 劵类型
        couponRuleStatus: '', // 劵规则状态
        couponRuleName: '', // 劵类型名称
        dataTime: '' // 时间
      },
      pickerOptions: utils.pickerOptions,
      dialogObj: {}, // 对话框数据
      channelList: [{
        label: 'IPX',
        code: 'YSDP',
        value: 1
      }, {
        label: '星购',
        code: 'YSGO',
        value: 2
      }, {
        label: 'YOSHOP',
        code: 'YOSHOP',
        value: 4
      }, {
        label: 'YSIA',
        code: 'YSIA',
        value: 8
      }],
      couponRuleTypeSelect: [
        {
          value: 0,
          label: '启用'
        },
        {
          value: 1,
          label: '作废'
        }
      ],
      couponRuleSelect: [
        {
          label: '劵',
          value: 0
        },
        {
          label: '卡',
          value: 1
        },
        {
          label: '通用劵',
          value: 2
        },
        {
          label: '运费劵',
          value: 3
        }, {
          label: '售后代金劵',
          value: 4
        }
      ],
      returnRulesSelect: [{
        label: '订单取消返还',
        value: 0
      }, {
        label: '订单取消不返还',
        value: 1
      }, {
        label: '订单退款返还',
        value: 2
      }, {
        label: '订单退款不返还',
        value: 4
      }],
      tableList: [],
      isLoading: false,
      tableInnerBtns: [
        {
          width: 150,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            vm.routerLink(`/marketing/coupon/ruleInfo/${row.couponRuleId}`)
          }
        },
        {
          name: '作废',
          icon: 'el-icon-close',
          handle(row) {
            const { couponRuleName, couponRuleId } = row
            vm.confirmTip(`确认作废  ${couponRuleName}  此规则劵`, () => {
              vm.deleteData({ couponRuleId })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '类型名称',
          prop: 'couponRuleName',
          width: 100,
          fixed: true
        },
        {
          label: '类型',
          prop: 'couponRuleType',
          width: 100,
          formatter(row) {
            return row.couponRuleType !== '' ? vm.couponRuleSelect[row.couponRuleType].label : ''
          }
        },
        {
          label: '渠道',
          prop: 'platforms',
          width: 120,
          formatter(row) {
            return row && row.platforms ? row.platforms.map(res => {
              const curVal = vm.channelList.find(val => val.value === res)
              return curVal ? curVal.label : ''
            }).join(', ') : ''
          }
        },
        {
          label: '品类规则',
          prop: 'categoryType',
          formatter(row) {
            return row.categoryType === 0 ? '全部类' : '限品类'
          }
        },
        {
          label: '等级门槛',
          prop: 'userLevel',
          formatter(row) {
            return row.userLevel === 0 ? '有' : '无'
          }
        },
        {
          label: '积分门槛',
          prop: 'pointLimit',
          formatter(row) {
            return row.pointLimit === 1 ? '有' : '无'
          }
        },
        {
          label: '优惠门槛',
          prop: 'preferentialLevel',
          formatter(row) {
            return row.preferentialLevel === 1 ? '有' : '无'
          }
        },
        {
          label: '优惠类型',
          prop: 'preferentialType',
          formatter(row) {
            return row.preferentialType === 0 ? '代金' : '折扣'
          }
        },
        {
          label: '优惠值(元)',
          prop: 'preferentialValue',
          width: 160,
          formatter(row) {
            if (row.marketPreferentialRules && row.marketPreferentialRules.length) {
              return row.marketPreferentialRules.map(res => {
                if (res.preferentialType === 0) {
                  return `满 ${res.preferentialLevel}元 减 ${res.preferentialValue} 元`
                }
                return `满 ${res.preferentialLevel}元 打 ${res.preferentialValue} 折`
              }).join(';')
            }
          }
        },
        {
          label: '重复使用',
          prop: 'repeatUse',
          formatter(row) {
            return row.repeatUse === 1 ? '可以' : '不可以'
          }
        },
        {
          label: '人均限领(张)',
          prop: 'limitReceive',
          width: 100
        },
        {
          label: '返回规则',
          prop: 'returnRules',
          width: 120,
          formatter(row) {
            return row && row.returnRules ? row.returnRules.map(res => {
              const curVal = vm.returnRulesSelect.find(val => res === val.value)
              return curVal ? curVal.label : ''
            }).join(';') : ''
          }
        },
        // {
        //   label: '需要密码',
        //   prop: 'useCode',
        //   formatter(row) {
        //     return row.useCode === 0 ? '需要' : '不需要'
        //   }
        // },
        {
          label: '类型状态',
          prop: 'couponRuleStatus',
          formatter(row) {
            return row.couponRuleStatus === 1 ? '启用中' : '已作废'
          }
        },
        {
          label: '申请人',
          prop: 'applicants'
        },
        {
          label: '申请部门',
          prop: 'applyingDepartment'
        },
        {
          label: '创建时间',
          prop: 'created',
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
      this.$api.marketing
        .getCouponRule({
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
    deleteData(parms, msgTip = '作废成功') {
      // 主要修改接口
      this.$api.marketing.unableCoupon(parms).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main__box {
  .search {
    margin-bottom: 10px;
    width: 100%;
    .search-item {
      width: 250px;
    }
  }
}
</style>
