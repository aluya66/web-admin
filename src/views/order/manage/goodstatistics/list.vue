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
          prop: 'productSkuCode'
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
      let curDate = new Date()
      let lastDays = this.getMonthDay(1)
      let lastMonthDate = new Date() // 上月日期
      // let today = new Date().getDate()
      lastMonthDate.setDate(1)
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
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
          end = curDate
          start = new Date(new Date().toDateString())
          start.setTime(start.getTime() - 3600 * 1000 * 24 * (new Date().getDay() - 1))
          break
        case 3:
          end = curDate
          start = new Date(new Date().toDateString())
          end.setTime(start.getTime() - 3600 * 1000 * 24 * (new Date().getDay()))
          start.setTime(start.getTime() - 3600 * 1000 * 24 * (new Date().getDay() + 7))
          break
        case 4:
          end = curDate
          start = new Date(new Date().toDateString())
          start.setTime(start.getTime() - (start.getDate() - 1) * 3600 * 1000 * 24)
          break
        case 5:
          start = lastMonthDate
          let year = this.getYear(start)
          end = new Date(year, start.getMonth(), lastDays)
          break
        case 6:
          end = curDate
          start = new Date()
          start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
          break
        case 7:
          end = new Date(new Date().toDateString())
          start = this.getnMonth(1)
          break
        case 8:
          end = new Date(new Date().toDateString())
          start = this.getnMonth(3)
          break
        case 9:
          end = new Date(new Date().toDateString())
          start = this.getnMonth(6)
          break
        case 10:
          end = new Date(new Date().toDateString())
          start = this.getnMonth(12)
          break
      }
      this.searchObj.dateTime = [start, end]
    }
  },
  methods: {
    // 获取年
    getYear(date) {
      let years = date.getYear()
      years += (years < 2000) ? 1900 : 0 //
      return years
    },
    // 获取某月的天数(n为前某月)
    getMonthDay(n) {
      let preDate = new Date()
      let nextDate = new Date()
      preDate.setMonth(preDate.getMonth() - n)
      nextDate.setMonth(nextDate.getMonth() - n + 1)
      let monthStartDate = new Date(preDate.getYear(), preDate.getMonth(), 1)
      let monthEndDate = new Date(nextDate.getYear(), nextDate.getMonth(), 1)
      let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
      return days
    },
    // 获取前n月开始时间
    getnMonth(n) {
      let preDate = new Date()
      let nextDate = new Date()
      preDate.setMonth(preDate.getMonth() - n)
      nextDate.setMonth(nextDate.getMonth() - n + 1)
      let monthStartDate = new Date(preDate.getYear(), preDate.getMonth(), 1)
      let monthEndDate = new Date(nextDate.getYear(), nextDate.getMonth(), 1)
      let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
      let today = (new Date()).getDate()
      let startYear = today > days ? this.getYear(nextDate) : this.getYear(preDate)
      let startMonth = today > days ? nextDate.getMonth() : preDate.getMonth()
      let startDay = today > days ? 1 : today + 1
      return new Date(startYear, startMonth, startDay)
    },
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
