import utils from 'utils'
import CTable from 'components/table'
import QueryDict from '../common/queryDict'

export default {
  data() {
    return {
      dictData: {}, // 字典数据
      isLoading: false, // 数据加载状态
      size: 'medium', // 表格、按钮大小
      tableList: [], // 列表数据
      tableCheckedList: [], // 列表批量选中
      pageInfo: { // 页码信息
        pageNo: 1,
        pageSize: 10,
        totalNum: 0
      }
    }
  },
  created() {
    if (this.dictOpts) { // 业务页面配置字典参数时触发
      const { codes, dictLob } = this.dictOpts
      if (codes && codes.length) {
        this.$store.dispatch('views/getDict', {
          codes,
          dictLob
        }).then(res => {
          this.dictData = res
        })
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
    getSearchDate(dataTime, formatFlag, startFlag = 'beginDate', endFlag = 'endDate') {
      let type = formatFlag === 'dateTime' ? '{y}-{m}-{d} {h}:{i}:{s}' : '{y}-{m}-{d}'
      if (dataTime) {
        const beginDate = utils.fomartDate(dataTime[0], type)
        const endDate = utils.fomartDate(dataTime[1], type)
        return {
          [startFlag]: beginDate,
          [endFlag]: endDate
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
    },
    /**
     * 新增&编辑保存时,请求返回通用处理函数
     * @param {*} msg
     */
    responeHandle(msg = '新增成功') {
      this.dialogObj.isShow = false
      this.$msgTip(msg)
      this.fetchData()
    }
  },
  components: {
    CTable,
    QueryDict
  }
}
