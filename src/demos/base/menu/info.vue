<template>
	<c-view>
		<template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
		</template>
		<div class="box">
			<c-tree
				ref="curTree"
				class="filter-tree"
				is-edit
				@btn-handle="btnHandle"
				:data-promise="getTreeData()"
			>
				<!-- <el-button size="medium" @click="onBack">
          返回
        </el-button> -->
			</c-tree>
		</div>
		<div v-if="dialogVisible">
			<c-dialog
				title="修改菜单"
				:is-show="dialogVisible"
				close-btn
				:btns="dialogBtns"
				@before-close="dialogVisible = false"
			>
				<el-form ref="form" class="con-dialog" :rules="rules" :model="form">
					<el-form-item label="菜单名:" label-width="100px" prop="resName">
						<el-input v-model.trim="form.resName" />
					</el-form-item>
					<!-- <el-form-item label="是否禁用" label-width="100px" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">禁用</el-radio>
              <el-radio :label="0">不禁用</el-radio>
            </el-radio-group>
          </el-form-item> -->
					<el-form-item label="菜单图标:" label-width="100px">
						<el-input v-model="form.mIcon" />
					</el-form-item>
					<el-form-item label="菜单地址:" label-width="100px" prop="router">
						<el-input v-model="form.router" disabled />
					</el-form-item>
				</el-form>
			</c-dialog>
		</div>
	</c-view>
</template>

<script>
import CTree from 'components/tree'
import CDialog from 'components/dialog'

import { mapGetters } from 'vuex'

export default {
  components: {
    CTree,
    CDialog
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data (vm) {
    return {
      form: {
        resName: '',
        router: '',
        mIcon: ''
        // status: ""
      },
      curTreeNode: '',
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
            vm.$refs['form'].validate(valid => {
              if (valid) {
                vm.$api.menu.updResource({
                  ...vm.form,
                  updateBy: vm.userInfo.userName
                }).then(async () => {
                  vm.$set(vm.curTreeNode, 'label', vm.form.resName)
                  vm.$set(vm.curTreeNode, 'mIcon', vm.form.mIcon)
                  // vm.$set(vm.curTreeNode, "status", vm.form.status);
                  vm.$msgTip('更新成功')
                  vm.dialogVisible = false
                  const { roles } = await vm.$store.dispatch('user/getInfo')
                  await vm.$store.dispatch('permission/generateRoutes', roles)
                })
              }
            })
          }
        }
      ],
      rules: {
        resName: [
          { required: true, message: '请输入菜单名', trigger: 'blur' },
          {
            min: 1,
            max: 6,
            message: '长度在 1 到 6 个字符或汉字',
            trigger: 'blur'
          }
        ],
        router: [{ required: true, message: '请输入菜单地址', trigger: 'blur' }]
      },
      dialogVisible: false
    }
  },
  methods: {
    getTreeData () {
      return this.$api.menu.getResourceList
    },
    btnHandle (type, data) {
      if (type === 'upd') {
        this.dialogVisible = true
        this.form = {
          resName: data.label,
          id: data.id,
          router: data.router,
          mIcon: data.mIcon
          // status: data.status
        }
        this.curTreeNode = data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box {
	.filter-tree {
		margin-left: 10px;
		width: 40%;
		max-height: 680px;
		overflow: auto;
	}
}
.con-dialog {
	width: 90%;
}
</style>
