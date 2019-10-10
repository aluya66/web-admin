<template>
	<div class="app-container">
		<c-tree
			class="filter-tree"
			:tree-data="data2"
			show-btn
			@btn-handle="btnHandle"
		>
			<template v-slot:button>
				<el-button-group class="tree-button">
					<el-button
						size="small"
						icon="el-icon-plus"
						type="primary"
						@click="onSubmit"
					>
						新增一级部门
					</el-button>
				</el-button-group>
			</template>
		</c-tree>
		<c-table
			class="table"
			:table-header="headerList"
			:table-list="tableData"
			@change-page="changePage"
		/>
		<el-dialog title="添加部门" :visible.sync="dialogFormVisible">
			<el-form class="con-dialog" :model="form">
				<el-form-item label="部门名称" label-width="100px">
					<el-input v-model="form.name" autocomplete="off" />
				</el-form-item>
				<el-form-item label="部门编码" label-width="100px">
					<el-input v-model="form.code" autocomplete="off" />
				</el-form-item>
				<el-form-item label="所属部门" label-width="100px">
					<el-input v-model="form.supId" autocomplete="off" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelBtn">
					取 消
				</el-button>
				<el-button type="primary" @click="okBtn">
					确 定
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import CTree from 'components/tree'
import CTable from 'components/table'

export default {
  components: {
    CTree,
    CTable
  },
  data () {
    return {
      form: {
        name: '',
        code: '',
        supId: ''
      },
      curData: '',
      dialogFormVisible: false,
      filterText: '',
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
      headerList: [
        {
          label: '日期',
          // width: 120,
          prop: 'date'
        },
        {
          label: '姓名',
          // width: 120,
          prop: 'name'
        },
        {
          label: '地址',
          prop: 'address',
          inline: true
        }
      ],
      data2: [
        {
          id: 1,
          label: 'Level one 1',
          children: [
            {
              id: 4,
              label: 'Level two 1-1',
              children: [
                {
                  id: 9,
                  label: 'Level three 1-1-1'
                },
                {
                  id: 10,
                  label: 'Level three 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: 'Level one 2',
          children: [
            {
              id: 5,
              label: 'Level two 2-1'
            },
            {
              id: 6,
              label: 'Level two 2-2'
            }
          ]
        },
        {
          id: 3,
          label: 'Level one 3',
          children: [
            {
              id: 7,
              label: 'Level two 3-1'
            },
            {
              id: 8,
              label: 'Level two 3-2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
    cancelBtn () {
      this.dialogFormVisible = false
    },
    okBtn () {
      let id = 1000
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!this.curData.children) {
        this.$set(this.curData, 'children', [])
      }
      this.curData.children.push(newChild)
      this.dialogFormVisible = false
    },

    addTree () {},
    onSubmit () {
      this.addTree()
    },
    btnHandle (type, data, node) {
      if (type === 'add') {
        this.dialogFormVisible = true
        this.curData = data
      } else if (type === 'remove') {
        this.$confirm(`此操作将永久删除 ${data.label}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(() => {
            console.log('取消')
          })
      }
    },
    changePage (page) {
      console.log(page)
    }
  }
}
</script>

<style lang="less" scoped>
.app-container {
	display: flex;
}
.filter-tree {
	width: 40%;
	border-right: 1px solid #eeeeee;
}
.tree-button {
	margin: 20px 0;
}
.table {
	width: 100%;
}
.con-dialog {
	width: 90%;
}
</style>
