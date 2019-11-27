import utils from 'utils'
import CTable from 'components/table'
import QueryDict from '../common/queryDict'
import CSearch from 'components/search'

export default {
  data() {
    return {
      dictData: {}, // 字典数据
      isLoading: false, // 数据加载状态
      size: 'medium', // 表格、按钮大小
      searchObj: {}, // 搜索查询对象
      searchItems: [], // 搜索表单元素配置项
      tableList: [], // 列表数据
      tableCheckedList: [], // 列表批量选中
      maxHeight: 650, // table最大高度
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
    this.setSearchItems()
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
      if (dataTime && dataTime[0]) {
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
      this.$refs.cTable && this.$refs.cTable.resetScroll()
    },
    /**
     *  重置按钮
     */
    searchReset() {
      this.searchSubmit()
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
    },
    /**
     * 设置搜索表单元素
     */
    setSearchItems() {
      const searchObj = {} // 缓存查询初始值
      this.tableHeader && this.tableHeader.forEach(res => {
        const { search, label, prop } = res
        if (search) {
          const opts = { label, prop, ...search }
          searchObj[opts.prop] = opts.type && (opts.type === 'cascader' || opts.type === 'min-max') ? [] : ''
          this.searchItems.push(opts)
        }
      })
      this.searchObj = searchObj
      // console.log(this.searchObj, this.searchItems)
    },
    /**
     * 设置搜索元素cascader, dict的可选值
     */
    setSearchOptionsList(name, value, optionType = 'optionsList') {
      const curIndex = this.searchItems.findIndex(res => name === res.prop)
      if (curIndex !== -1) {
        this.$set(this.searchItems[curIndex], optionType, value)
      }
    }
  },
  components: {
    CTable,
    QueryDict,
    CSearch
  }
}
