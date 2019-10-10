<template>
	<div class="app-container">
		<c-tree
			class="filter-tree"
			:tree-data="treeList"
			@choose-node="chooseNode"
		/>
		<c-table
			selection
			class="tree-table"
			:table-header="headerList"
			:table-list="tableData"
			:total-num="totalNum"
			:current-page="curPage"
			:page-size="curPageSize"
			@change-page="changePage"
		>
			<template v-slot:header>
				<div class="title">
					{{ nodeTitle }}
				</div>
			</template>
		</c-table>
	</div>
</template>

<script>
import CTree from '@/components/tree'
import CTable from '@/components/table'
// import { getDeptBySup } from "api/department";
// import { getDeptUser } from "api/user";

export default {
  name: 'c-treeTable',
  components: {
    CTree,
    CTable
  },
  data () {
    return {
      curPage: 1,
      curPageSize: 10,
      curTreeId: '',
      totalNum: 0,
      nodeTitle: '',
      tableData: [],
      headerList: [
        {
          label: '姓名',
          prop: 'realName'
        },
        {
          label: '性别',
          prop: 'sex'
        },
        {
          label: '电话',
          prop: 'phone'
        },
        {
          label: '部门',
          prop: 'deptName'
        },
        {
          label: '岗位',
          prop: 'posName'
        }
      ],
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {
    const supId = 0
    this.getDptData(supId)
  },
  methods: {
    getDptData () {
      // getDeptBySup({ supId }).then(res => {
      //   this.treeList = this.formartTreeData(res);
      //   this.curTreeId = res[0].id;
      //   this.nodeTitle = res[0].name;
      //   this.getUserList();
      // });
    },
    changePage (page) {
      this.curPage = page
      this.getUserList()
    },
    formartTreeData (res) {
      return res.map(val => {
        let children = []
        if (val.child.length) {
          children = this.formartTreeData(val.child)
        }
        return {
          id: val.id,
          code: val.code,
          isDel: val.isDel,
          label: val.name,
          supId: val.supId,
          depth: val.depth,
          deptType: val.deptType,
          children
        }
      })
    },
    getUserList () {
      // const id = this.curTreeId;
      // getDeptUser({ id }, this.curPage, this.curPageSize).then(val => {
      //   const { data, page } = val;
      //   const { currentPage, totalRow } = page;
      //   this.tableData = data;
      //   this.curPage = currentPage;
      //   this.totalNum = totalRow;
      // });
    },
    chooseNode (val) {
      this.curPage = 1
      this.curTreeId = val.id
      this.nodeTitle = val.label
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
.app-container {
	display: flex;
}
.filter-tree {
	width: 20%;
	padding-right: 20px;
	border-right: 1px solid #eeeeee;
}
.tree-button {
	margin: 20px 0;
}
.tree-table {
	width: 100%;
}
</style>
