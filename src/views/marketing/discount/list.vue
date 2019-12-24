<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button
          type="primary"
          :size="size"
          icon="el-icon-plus"
          @click="routerLink('/marketing/discount/discountInfo')"
        >新增</el-button>
      </div>
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
        @on-submit="dialogConfirm"
      ></c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
// import utils from 'utils'
import CDialog from 'components/dialog'
import dictObj from '@/store/dictData'

export default {
  name: 'discountList',
  mixins: [mixinTable],
  components: {
    CDialog
  },
  data(vm) {
    return {
      dialogObj: {}, // 对话框数据
      searchObj: {
        couponName: '', // 劵名称
        couponRuleType: '', // 劵规则类型
        couponRuleName: '', // 劵规则类型名称
        couponStatus: '', // 劵审核状态
        dataTime: ''
      },
      tableInnerBtns: [
        {
          width: 180,
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
            const { activityId, status, activityName } = row
            const tip = status === 1 ? '禁用' : '启用'
            const updateStatus = status === 1 ? 0 : 1
            vm.confirmTip(`确认${tip}【${activityName}】 活动`, () => {
              vm.changeStatus({ activityId, status: updateStatus }, tip)
            })
          }
        },
        {
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const { activityId } = row
            vm.routerLink(`/marketing/discount/discountInfo/${activityId}`)
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { activityId, activityName, status } = row
            if (status === 1) return vm.$msgTip('已启用的折扣活动不能进行删除操作', 'warning')
            vm.confirmTip(`确认删除  ${activityName}  折扣活动`, () => {
              vm.deleteData({ activityId })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '活动名称',
          prop: 'activityName',
          fixed: true,
          search: {
            type: 'input'
          }
        },
        {
          label: '活动类型',
          prop: 'activityType',
          fixed: true,
          formatter(row) {
            return row && vm.setTableColumnLabel(row.activityType, 'activityTypeList')
          },
          search: {
            type: 'select',
            optionsList: dictObj.activityTypeList
          }
        },
        {
          label: '使用渠道',
          prop: 'platformList',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.platformList, 'lobList')
          },
          search: {
            type: 'select',
            optionsList: dictObj.lobList
          }
        },
        {
          label: '折扣条件',
          prop: 'activityTypeName'
        },
        {
          label: '活动状态',
          prop: 'activityStatus',
          formatter(row) { // 1待开始 2活动中 3已结束
            return row && vm.setTableColumnLabel(row.activityStatus, 'activityStatusList')
          },
          search: {
            type: 'select',
            optionsList: dictObj.activityStatusList
          }
        },
        {
          label: '活动开始时间',
          prop: 'activityTime',
          search: {
            label: '活动时间',
            prop: 'dateTime',
            type: 'dateTime'
          }
        },
        {
          label: '活动结束时间',
          prop: 'activityEndTime'
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, 'disStatus')
          }
        },
        {
          label: '申请人',
          prop: 'applicants',
          search: {
            type: 'input'
          }
        }
      ]
    }
  },
  created() {
    this.fetchData()
    this.isCreated = !this.isCreated
  },
  activated() {
    this.isCreated && this.fetchData()
  },
  methods: {
    // 启用、禁用
    changeStatus(params, msg) {
      this.$api.marketing.changeGoodsActivityStatus(params).then(() => {
        this.$msgTip(`${msg}成功`)
        this.fetchData()
      })
    },
    /**
     * 获取表格数据
     */
    fetchData() {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.marketing.getGoodsActivityList({
        ...searchDate,
        ...other,
        ...page
      }).then(res => {
        this.isLoading = false
        console.log(res, res.totalCount)
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
     * 删除表格单条数据
     *
     * @param {*} curPromise
     * @param {string} [msgTip='删除成功']
     */
    deleteData(param, msgTip = '删除成功') {
      this.$api.marketing.deleteGoodsActivity(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    }
  }
}
</script>
