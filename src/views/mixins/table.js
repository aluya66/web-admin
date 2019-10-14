import utils from 'utils'

export default {
  data() {
    return {
      isLoading: false, // 数据加载状态
      size: 'medium', // 表格、按钮大小
      pageInfo: { // 页码信息
        pageNum: 1,
        numPerPage: 10,
        totalNum: 0
      }
    }
  },
  methods: {
    /**
     * 页码翻页处理
     * @param {*} pageInfo  页码参数
     * @param {*} fetchData 数据请求方法
     */
    changePagination(pageInfo, fetchData) {
      this.pageInfo.pageNum = pageInfo.page
      this.pageInfo.numPerPage = pageInfo.limit
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
      this.pageInfo.pageNum = 1
      this.fetchData()
    }
  }
}
