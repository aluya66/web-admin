<template>
  <c-table
    ref="cTable"
    selection
    hasBorder
    :size="size"
    :max-height="300"
    :loading="isLoading"
    :table-header="tableHeader"
    :page-info="pageInfo"
    @handle-select="handleSelect"
    @handle-selectall="handleSelect"
    :table-list="tableList"
    @change-pagination="changePagination"
  >
    <template v-slot:header>
      <c-search
        labelWidth="120px"
        :form-model="searchObj"
        :form-items="searchItems"
        @submit-form="searchSubmit"
        @reset-form="searchReset"
      ></c-search>
    </template>
  </c-table>
</template>

<script>
import mixinTable from 'mixins/table'

export default {
  mixins: [mixinTable],
  props: {
    initChecked: {
      // 初始化选中值
      type: Array,
      default() {
        return []
      }
    }
  },
  data(vm) {
    return {
      selectedList: [],
      tableList: [],
      tableHeader: [
        {
          label: '子渠道号',
          prop: 'channelCode',
          search: {
            label: '子渠道号或名称',
            prop: 'keyword',
            type: 'input'
          }
        },
        {
          label: '子渠道名称',
          prop: 'channelName'
        },
        {
          label: '渠道品牌',
          formatter(row) {
            let arr = []
            if (row.ruleInfos && row.ruleInfos.length) {
              row.ruleInfos.forEach((item) => {
                if (item.ruleBrandResp && item.ruleBrandResp.length) {
                  item.ruleBrandResp.forEach((brandItem) => {
                    arr.push(brandItem.brandName)
                  })
                }
              })
            }
            return arr.length > 0 ? arr.join(',') : ''
          }
        }
      ]
    }
  },
  created() {
    this.selectedList = this.initChecked
    this.fetchData()
  },
  methods: {
    handleSelect(val) {
      this.selectedList = val
    },
    fetchData() {
      this.isLoading = true
      const { totalNum, ...page } = this.pageInfo
      this.$api.channel.getShopChannel({
        ...this.searchObj,
        ...page,
        channelType: 2 // 类型： 2子渠道
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data || []
        } else {
          this.tableList = res || []
        }
        this.selectedList.length && this.selectedList.forEach((checkedItem) => {
          const idx = this.tableList.findIndex((item) => checkedItem.channelCode === item.channelCode)
          if (idx !== -1) {
            this.$nextTick(() => {
              this.$refs.cTable.$refs.multipleTable.toggleRowSelection(this.tableList[idx])
            })
          }
        })
      })
    }
  }
}
</script>
