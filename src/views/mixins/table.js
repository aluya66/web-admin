export default {
  data() {
    return {
      isLoading: false,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        totalCount: 0
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
      this.pageInfo.pageSize = pageInfo.limit
      fetchData ? fetchData() : this.fetchData()
    },
    /**
     *  搜索按钮
     */
    searchSubmit () {
      this.pageInfo.pageNum = 1
      this.fetchData()
    }
  }
}
