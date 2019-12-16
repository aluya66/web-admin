<template>
  <c-view>
    <template v-slot:headerTab>
      <el-tabs type="card" v-model="currentType" @tab-click="changeTab">
        <el-tab-pane
          v-for="(item, index) in tabTitle"
          :key="index"
          :label="item.label"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
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
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
const statusList = [{
  label: '失败',
  value: 0
}, {
  label: '成功',
  value: 1
}]
export default {
  name: 'settingsQrcode',
  mixins: [mixinTable],
  data(vm) {
    return {
      currentType: '1', // 当前日志类型 1内部请求日志、2外部请求日志
      tabTitle: [
        {
          value: '1',
          label: '内部请求日志'
        },
        {
          value: '2',
          label: '外部请求日志'
        }
      ],
      tableInnerBtns: [
        {
          width: 100,
          name: '重发',
          handle(row) {
            const { requestUrl, id } = row
            if (row.type !== 2 || row.status !== 0) return vm.$msgTip('该日志不支持此操作', 'warning')
            vm.confirmTip(`是否重发【${requestUrl}】请求地址`, () => {
              vm.retryRequest(id)
            })
          }
        }
      ],
      tableHeader: [
        {
          label: 'appCode',
          prop: 'appCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '请求地址',
          prop: 'requestUrl',
          isPopover: true,
          search: {
            type: 'input'
          }
        },
        {
          label: '请求参数',
          prop: 'requestParam',
          isPopover: true
        },
        // {
        //   label: '响应明细',
        //   prop: 'responeDetail'
        // },
        {
          label: '请求类型',
          prop: 'type',
          formatter(row) {
            return row.type === 1 ? '内部请求日志' : '外部请求日志'
          }
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row.status === 0 ? '失败' : '成功'
          },
          search: {
            type: 'select',
            optionsList: statusList
          }
        },
        {
          label: '创建人',
          prop: 'opCreator',
          search: {
            type: 'input'
          }
        },
        {
          label: '创建时间',
          prop: 'created',
          search: {
            prop: 'dateTime',
            type: 'dateTime'
          }
        },
        {
          label: '修改人',
          prop: 'opEditor',
          search: {
            type: 'input'
          }
        },
        {
          label: '更新时间',
          prop: 'updated'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    changeTab() {
      const extraItemIndex = this.tableHeader.findIndex((item) => item.prop === 'retryCounts') // 是否已有该表头字段
      if (this.currentType === '2') {
        if (extraItemIndex > -1) return
        const obj = {
          label: '重发次数',
          prop: 'retryCounts'
        }
        this.tableHeader.splice(5, 0, obj)
      } else {
        if (extraItemIndex === -1) return
        this.tableHeader.splice(extraItemIndex, 1)
      }
      this.fetchData()
    },
    retryRequest(id) {
      this.$api.settings.getAccessLogList({ id }).then(() => {
        this.$msgTip('操作成功')
        this.fetchData()
      })
    },
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { dateTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.settings
        .getAccessLogList({
          type: this.currentType,
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
