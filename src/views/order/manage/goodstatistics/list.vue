<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :max-height="maxHeight"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <c-search
            :form-model="searchObj"
            :form-items="searchItems"
            @submit-form="searchSubmit"
            @reset-form="searchReset"
          ></c-search>
          <div class="header-btn">
            <el-radio-group v-model="curDate" :size="size">
              <el-radio-button
                v-for="(item, index) in dateArr"
                :key="index"
                :label="item.value"
              >{{item.label}}</el-radio-button>
            </el-radio-group>
          </div>
        </template>
      </c-table>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'

// 日期
const dateArr = [{
  label: '今天',
  value: 0
}, {
  label: '昨天',
  value: 1
}, {
  label: '本周',
  value: 2
}, {
  label: '上周',
  value: 3
}, {
  label: '本月',
  value: 4
}, {
  label: '上月',
  value: 5
}, {
  label: '一周内',
  value: 6
}, {
  label: '一月内',
  value: 7
}, {
  label: '三月内',
  value: 8
}, {
  label: '半年内',
  value: 9
}, {
  label: '一年内',
  value: 10
}]

export default {
  name: 'order',
  mixins: [mixinTable],
  data(vm) {
    return {
      curDate: '',
      dateArr,
      // 表格内操作按钮
      tableHeader: [
        {
          width: 50,
          label: '排名',
          prop: 'sortNumber',
          search: {
            label: '时间范围',
            type: 'dateTime',
            prop: 'dateTime',
            dateType: 'datetimerange'
          }
        },
        {
          label: '销量',
          prop: 'totalSalesQuantity',
          search: {
            type: 'dict',
            label: '排名条件',
            prop: 'rankConditions',
            optionsList: [{
              label: '销量',
              value: 'totalSalesQuantity'
            }, {
              label: '销售额',
              value: 'totalSalesAmount'
            }]
          }
        },
        {
          label: '销售额(元)',
          prop: 'totalSalesAmount',
          search: {
            label: '升降序',
            prop: 'sort',
            type: 'dict',
            optionsList: [{
              label: '升序',
              value: 'asc'
            }, {
              label: '降序',
              value: 'desc'
            }]
          }
        },
        {
          label: '缩略图',
          isImage: true,
          prop: 'picturePath'
        },
        {
          label: '商品名称',
          prop: 'productName'
        },
        {
          label: '规格',
          prop: 'specifications'
        },
        {
          label: '货号',
          prop: 'starasSkuCode'
        }
      ]
    }
  },
  created() {
    this.searchObj.sort = 'asc'
    this.searchObj.rankConditions = 'totalSalesQuantity'
    this.fetchData()
  },
  watch: {
    curDate(newVal, oldVal) {
      let end = null
      let start = null
      const curDate = new Date()
      switch (newVal) {
        case 0:
          end = curDate
          start = new Date(new Date().toDateString())
          end.setTime(start.getTime() + 3600 * 1000 * 24 - 1)
          break
        case 1:
          end = curDate
          start = new Date(new Date().toDateString())
          end.setTime(start.getTime() - 3600 * 1000 * 24)
          start = end
          break
        case 2:

          break
        case 3:
          break
        case 4:
          break
        case 5:
          break
        case 6:
          end = new Date(new Date().toDateString())
          start = new Date()
          start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
          break
        case 7:
          end = new Date(new Date().toDateString())
          start = new Date()
          start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
          break
        case 8:
          end = new Date(new Date().toDateString())
          start = new Date()
          start.setTime(end.getTime() - 3600 * 1000 * 24 * 90)
          break
        case 9:
          end = new Date(new Date().toDateString())
          start = new Date()
          start.setTime(end.getTime() - 3600 * 1000 * 24 * 183)
          break
        case 10:
          end = new Date(new Date().toDateString())
          start = new Date()
          start.setTime(end.getTime() - 3600 * 1000 * 24 * 364)
          break
      }
      this.searchObj.dateTime = [start, end]
    }
  },
  methods: {
    /*
	   * 查询表格列表数据
	   */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { dateTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(dateTime, 'dateTime', 'beginTime', 'endTime')
      this.isLoading = true
      this.$api.order.queryGoodsStatistics({
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
  }
}
</script>
