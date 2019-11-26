<template>
	<c-view>
		<template v-slot:header>
			<el-button
				size="small"
				type="primary"
				icon="el-icon-plus"
				@click="routerLink('/base/roleinfo')"
			>
				新增角色
			</el-button>
		</template>
		<div class="box">
			<c-table
				selection
				:loading="isLoading"
				:table-header="tableHeader"
				:table-list="tableList"
				:page-info="pageInfo"
				:table-inner-btns="tableInnerBtns"
				:max-height="546"
				@change-pagination="changePagination"
			>
				<template v-slot:header>
					<el-form
						:inline="true"
						:model="searchObj"
						label-width="100px"
						class="search-form"
					>
						<el-form-item label="角色名称">
							<el-input
								v-model="searchObj.roleName"
								class="search-item"
								size="medium"
								placeholder="角色名称"
								clearable
							/>
						</el-form-item>
						<el-form-item label="角色编码">
							<el-input
								v-model="searchObj.code"
								class="search-item"
								size="medium"
								placeholder="角色编码"
								clearable
							/>
						</el-form-item>
						<el-form-item label="角色状态">
							<el-select
								v-model="searchObj.status"
								size="medium"
								class="search-item"
								clearable
								placeholder="角色状态"
							>
								<el-option label="启用" :value="0"></el-option>
								<el-option label="禁用" :value="1"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button
								type="primary"
								class="search-btn"
								size="medium"
								@click="searchSubmit"
								>查询</el-button
							>
						</el-form-item>
					</el-form>
				</template>
			</c-table>
		</div>
		<div v-if="dialogVisible">
			<c-dialog
				title="配置菜单"
				:is-show="dialogVisible"
				close-btn
				:btns="dialogBtns"
				@before-close="dialogVisible = false"
			>
				<c-tree
					selection
					accordion
					:default-keys="curDefaultKeys"
					:data-promise="getTreeData()"
					@node-change="changeTreeNode"
				/>
			</c-dialog>
		</div>
	</c-view>
</template>

<script>
import CTable from 'components/table'
import CTree from 'components/tree'
import CDialog from 'components/dialog'
import utils from 'utils'

import { mapGetters } from 'vuex'

export default {
  components: {
    CTable,
    CTree,
    CDialog
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data (vm) {
    return {
      clearTimeDelay: null,
      dialogVisible: false,
      searchObj: {
        roleName: '',
        code: '',
        status: ''
      },
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
        totalSize: 0
      },
      curDefaultKeys: [],
      curCheckTree: [],
      curRole: '',
      tableList: [],
      isChange: false,
      isLoading: false,
      dialogBtns: [
        {
          label: '取 消',
          name: 'cancel'
        },
        {
          label: '确 认',
          type: 'primary',
          name: 'submit',
          handle () {
            const { id, roleName, note, code, status } = vm.curRole
            const resources = vm.curCheckTree.map(res => ({
              id: res.id,
              resName: res.label
            }))
            vm.$api.role.updRole({
              id,
              roleName,
              note,
              code,
              status,
              resources,
              updateBy: vm.userInfo.userName
            }).then(() => {
              vm.dialogVisible = false
              vm.$msgTip('更新成功')
              const curIndex = vm.tableList.findIndex(res => res.id === id)
              if (curIndex !== -1) {
                vm.$set(vm.tableList[curIndex], 'resources', resources)
              }
            })
          }
        }
      ],
      tableInnerBtns: [
        {
          name: '配置菜单',
          handle (row) {
            if (row && row.resources) {
              vm.curDefaultKeys = row && row.resources.map(res => res.id)
            } else {
              vm.curDefaultKeys = []
            }
            vm.curRole = row
            vm.dialogVisible = true
          }
        },
        {
          name: '修改',
          handle (row) {
            utils.setStore('_ROLEINFO', row)
            this.routerLink(`/base/roleinfo/${row.id}`)
          }
        },
        {
          name: '删除',
          handle (row) {
            const { updateBy, id, roleName } = row
            vm.$confirm(`是否确定删除 ${roleName} 角色 ?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            })
              .then(() => {
                vm.$api.role.delRole({
                  updateBy,
                  id
                }).then(() => {
                  vm.$msgTip('删除成功')
                  if (vm.tableList.length === 1) {
                    vm.pageInfo.pageNo = vm.pageInfo.pageNo > 1 ? vm.pageInfo.pageNo - 1 : 1
                  }
                  vm.fetchData()
                })
              })
              .catch(() => {
                console.log('取消')
              })
          }
        }
      ],
      tableHeader: [
        {
          label: '角色名称',
          prop: 'roleName'
        },
        {
          label: '角色编码',
          prop: 'code'
        },
        {
          label: '菜单项',
          prop: 'resources',
          width: 300,
          formatter (row) {
            return row && row.resources
              ? row.resources.map(res => res.resName).join(',')
              : ''
          }
        },
        // {
        // 	label: "角色id",
        // 	prop: "id"
        // },
        {
          label: '角色状态',
          width: 100,
          prop: 'status',
          formatter (row) {
            return row && row.status === 0 ? '启用' : '禁用'
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          formatter (row) {
            return row && utils.fomartDate(row.createTime)
          }
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          formatter (row) {
            return row && utils.fomartDate(row.updateTime)
          }
        }
      ]
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    getTreeData () {
      return this.$api.menu.getResourceList
    },
    searchSubmit () {
      this.pageInfo.pageNo = 1
      this.fetchData()
    },
    changeTreeNode (val, isChecked, treeRefs) {
      this.isChange = true
      this.curCheckTree = treeRefs.getCheckedNodes().slice()
      this.curDefaultKeys = treeRefs.getCheckedKeys().slice()
    },
    fetchData () {
      this.isLoading = true
      this.$api.role.getRoleList(
        {
          ...this.searchObj
        },
        this.pageInfo.pageNo,
        this.pageInfo.pageSize
      ).then(res => {
        this.isLoading = false
        if (res.page) {
          const { data, page } = res
          const { pageNo, totalRow } = page
          this.pageInfo.pageNo = pageNo
          this.pageInfo.totalSize = totalRow
          this.tableList = data
        } else {
          this.tableList = res
          this.pageInfo.totalSize = res.length
        }
      })
    },
    changePagination (pageInfo) {
      this.pageInfo.pageNo = pageInfo.page
      this.pageInfo.pageSize = pageInfo.limit
      this.fetchData()
    }
  }
}
</script>

<style lang="less" scoped>
.header-btns {
	font-size: 0.18rem;
	line-height: 24px;
}
.box {
	.search-form {
		width: 30%;
	}
}
</style>
