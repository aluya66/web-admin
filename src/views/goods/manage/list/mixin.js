import mixinTable from 'mixins/table'
export default {
	created() {
		this.getBrandList()
		this.getCategoryList()
	},
	activated() {
		this.fetchData()
	},
	mixins: [mixinTable],
	data() {
		return {
			goodsStatusList: [{
				value: 1,
				label: '上架'
			}, {
				value: 2,
				label: '下架'
			}],
			tableInnerBtns: [
				{
					name: '编辑',
					icon: 'el-icon-edit',
					handle(row) {
						const { id } = row
						vm.routerLink(`/goods/manage/detail/${id}`)
					}
				}
			]
		}
	},
	methods: {
		getCategoryList() {
			this.$api.basic.queryCategory().then(res => {
				this.setSearchOptionsList('categoryCode', res)
			})
		},
		getBrandList() {
			this.isLoading = true
			this.$api.basic
				.brandList({
					pageSize: 120,
					pageNo: 1
				})
				.then(res => {
					this.isLoading = false
					if (res && res.totalCount) {
						const { data } = res
						this.brandList = data || []
					} else {
						this.brandList = res || []
					}
					this.setSearchOptionsList('brandCode', this.brandList.map((item) => {
						return {
							value: item.code,
							label: item.name
						}
					}))
				})
		},
	}
}