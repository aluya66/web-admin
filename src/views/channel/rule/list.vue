<template>
  <c-view>
    <template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
       <div class="header-btn">
         <div class="header-btn">
          <el-button
            :size="size"
            type="primary"
            icon="el-icon-plus"
            @click="routerLink('/channel/rule/ruleInfo')"
          >新增</el-button>
        </div>
      </div>
		</template>
    <div class="main__box">
      <c-table
        selection
        hasBorder
        :size="size"
        :max-height="730"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
      </c-table>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'

export default {
  name: 'channelRule',
  mixins: [mixinTable],
  data(vm) {
    return {
      dialogObj: {}, // 对话框数据
      tableInnerBtns: [{
        width: 150,
        name: '开关',
        icon: 'el-icon-switch-button',
        handle (row) {
          const { ruleId, ruleName, status } = row
          const handleStatus = status === 1 ? 0 : 1 // 0关闭、1开启
          vm.confirmTip(
            `是否${handleStatus === 0 ? '关闭' : '开启'} ${ruleName} 渠道规则`,
            () => {
              vm.handleRuleStatus({ id: ruleId, status: handleStatus })
            }
          )
        }
      }, {
        width: 150,
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          vm.routerLink(`/channel/rule/ruleInfo/${row.id}`)
        }
      }, {
        name: '删除',
        icon: 'el-icon-detail',
        handle (row) {
          const { ruleId, ruleName } = row
          vm.confirmTip(`是否删除 ${ruleName} 渠道规则`, () => {
            vm.deleteRule({ id: ruleId })
          })
        }
      }],
      tableHeader: [ {
        label: '规则名称',
        prop: 'ruleName'
      }, {
        label: '渠道状态',
        prop: 'status',
        formatter(row) {
          return row.status === 0 ? '关闭' : '开启'
        }
      }, {
        label: '创建人',
        prop: 'createBy'
      }, {
        label: '创建时间',
        prop: 'created'
      }, {
        label: '更新人',
        prop: 'updateBy'
      }, {
        label: '更新时间',
        prop: 'updated'
      }]
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    // 删除渠道
    deleteRule(params, msgTip = '删除成功') {
      this.$api.channel.deleteRule(params).then(() => {
        this.$msgTip(msgTip)
        this.fetchData()
      })
    },
    // 开启、关闭渠道规则
    handleRuleStatus({ id, status }) {
      this.$api.channel.handleRuleStatus({ id, status }).then(() => {
        const msg = status === 0 ? '已关闭' : '已开启'
        this.$msgTip(msg)
        this.fetchData()
      })
    },
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.channel
        .getChannelRule({
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
