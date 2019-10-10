<template>
	<c-table
		selection
		:table-header="headerList"
		:table-list="tableData"
		:inner-btns="innerBtns"
		:current-page="curPage"
		@change-page="changePage"
		@choose-item="chooseItem"
		@inner-handle="innerHandle"
	>
		<template v-slot:header>
			<el-form :inline="true" :model="formInline" class="search">
				<el-form-item label="审批人">
					<el-input v-model="formInline.user" placeholder="审批人" />
				</el-form-item>
				<el-form-item label="活动区域">
					<el-select v-model="formInline.region" placeholder="活动区域">
						<el-option label="区域一" value="shanghai" />
						<el-option label="区域二" value="beijing" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="searchLoading" @click="onSearch">
						查询
					</el-button>
				</el-form-item>
			</el-form>

			<el-button-group>
				<el-button size="small" type="primary" icon="el-icon-plus">
					新增
				</el-button>
				<el-button size="small" type="primary" icon="el-icon-delete">
					删除
				</el-button>
				<el-button size="small" type="primary" icon="el-icon-search">
					搜索
				</el-button>
			</el-button-group>
		</template>
	</c-table>
</template>

<script>
import CTable from 'components/table'

export default {
  name: 'List',

  components: {
    CTable
  },
  data () {
    return {
      formInline: {
        user: '',
        region: ''
      },
      searchLoading: true,
      innerBtns: [
        {
          name: '查看',
          handle: 'view'
        },
        {
          name: '编辑',
          handle: 'edit'
        },
        {
          name: '删除',
          handle: 'detele'
        }
      ],
      headerList: [
        {
          label: '日期',
          prop: 'date'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '地址',
          prop: 'address',
          inline: true
        }
      ],
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      curPage: 1
    }
  },

  methods: {
    changePage (page) {
      console.log(page)
    },
    chooseItem (val) {
      console.log('val', val)
    },
    onSearch () {
      console.log('submit!')
    },
    innerHandle (type, item) {
      console.log(type, item)
    }
  }
}
</script>
<style lang="less" scoped>
.table-button {
	margin: 20px 0;
}
</style>
