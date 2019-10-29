import utils from 'utils'
import CTable from 'components/table'

export default {
  data() {
    return {
      isLoading: false, // 数据加载状态
      size: 'medium', // 表格、按钮大小
      tableList: [], // 列表数据
      pageInfo: { // 页码信息
        pageNo: 1,
        pageSize: 10,
        totalNum: 0
      }
    }
  },
  methods: {
    // 删除二次确认
    confirmTip: utils.confirmTip,
    /**
     * 页码翻页处理
     * @param {*} pageInfo  页码参数
     * @param {*} fetchData 数据请求方法
     */
    changePagination(pageInfo, fetchData) {
      this.pageInfo.pageNo = pageInfo.page
      this.pageInfo.pageSize = pageInfo.limit
      fetchData ? fetchData() : this.fetchData()
    },
    /**
     * 获取搜索时间
     * @param {*} dataTime
     */
    getSearchDate(dataTime) {
      if (dataTime) {
        const beginDate = utils.fomartDate(dataTime[0], '{y}-{m}-{d}')
        const endDate = utils.fomartDate(dataTime[1], '{y}-{m}-{d}')
        return {
          beginDate,
          endDate
        }
      }
      return {}
    },
    /**
     *  搜索按钮
     */
    searchSubmit() {
      this.pageInfo.pageNo = 1
      this.fetchData()
    },
    /**
     * 删除列表数据
     */
    delResetData(data) {
      if (this.tableList.length === 1) {
        const { pageNo } = this.pageInfo
        this.pageInfo.pageNo = pageNo > 1 ? pageNo - 1 : 1
      }
      this.fetchData()
    }
  },
  components: {
    CTable
  }
}
