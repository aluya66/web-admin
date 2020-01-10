export default {
  created() {
    this.getBrandList()
    this.getCategoryList()
  },
  activated() {
    this.fetchData()
    this.getSampleGoodsSum()
  },
  props: {
    noperfectCount: {
      type: Number,
      default: 0
    }
  },
  data(vm) {
    return {
      tableInnerBtns: [{
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          const {
            id,
            perfectName
          } = row
          vm.routerLink(`/goods/manage/detail/${id}/${perfectName}`)
        }
      }]
    }
  },
  methods: {
    getSampleGoodsSum() {
      this.$api.goods.getSampleGoodsSum().then(res => {
        if (res && res.totalCount) {
          const { data } = res
          this.noperfectCount = data || 0
        } else {
          this.noperfectCount = res || 0
        }
      })
    },
    getCategoryList() {
      this.$api.basic.queryCategory().then(res => {
        this.setSearchOptionsList('categoryCode', res)
      })
    },
    getBrandList() {
      this.isLoading = true
      this.$api.basic.brandList({
        pageSize: 120,
        pageNo: 1
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data } = res
          this.brandList = data || []
        } else {
          this.brandList = res || []
        }
        this.setSearchOptionsList('brandCode', this.brandList.map(item => ({
          value: item.code,
          label: item.name
        })))
      })
    }
  }
}
