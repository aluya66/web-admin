<template>
	<c-view>
		<template v-slot:header>
			<div class="title">
				{{ $route.params.id ? "更新角色" : "新增角色" }}
			</div>
		</template>
		<div class="box">
			<el-form
				ref="formRef"
				:model="formModel"
				:rules="rules"
				label-width="130px"
				class="form"
				label-position="right"
			>
				<el-form-item label="角色名称:" prop="roleName">
					<el-input
						v-model.trim="formModel.roleName"
						class="input-width"
						placeholder="请输入角色名，1-20个字符或汉字"
					/>
				</el-form-item>
				<el-form-item label="角色编码:" prop="code">
					<el-input
						v-model="formModel.code"
						class="input-width"
						placeholder="请输入角色名，大写全拼字母"
					/>
				</el-form-item>
				<el-form-item label="角色状态:" prop="status">
					<el-radio-group v-model="formModel.status">
						<el-radio :label="0">启用</el-radio>
						<el-radio :label="1">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="菜单权限:" prop="resourcesName">
					<div
						class="select-menu"
						:title="formModel.resourcesName"
						@click="dialogVisible = true"
					>
						<el-input
							v-model="formModel.resourcesName"
							readonly
							class="input-width"
							placeholder="请选择菜单名"
						/>
					</div>
				</el-form-item>
				<el-form-item label="备注:" prop="note">
					<el-input
						type="textarea"
						:rows="2"
						placeholder="请输入内容"
						v-model="formModel.note"
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">
						{{ $route.params.id ? "更新" : "保存" }}
					</el-button>
					<el-button @click="resetForm" v-if="!$route.params.id"
						>重置</el-button
					>
					<el-button @click="$router.go(-1)">
						返回
					</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div v-if="dialogVisible">
			<c-dialog
				:title="curTitle"
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
import CTree from 'components/tree'
import CDialog from 'components/dialog'
import utils from 'utils'

import { mapGetters } from 'vuex'

export default {
  components: {
    CDialog,
    CTree
  },
  computed: {
    curTitle () {
      return this.$route.params.id ? '修改菜单' : '选择菜单'
    },
    ...mapGetters(['userInfo'])
  },
  data (vm) {
    return {
      dialogVisible: false,
      formModel: {
        roleName: '',
        note: '',
        status: 0,
        code: '',
        resourcesName: ''
      },
      curDefaultKeys: [],
      curCheckTree: [],
      isChange: false,
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
            vm.formModel.resources = []
            if (vm.isChange) {
              vm.formModel.resourcesName = vm.curCheckTree
                .map(res => {
                  vm.formModel.resources.push({ id: res.id })
                  return res.label
                })
                .join(',')
            }
            vm.dialogVisible = false
          }
        }
      ],
      rules: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 20 个字符或汉字',
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, validator: utils.validater.roleCode, trigger: 'blur' }
        ],
        status: [
          { required: true, message: '角色状态不能为空', trigger: 'change' }
        ]
        // resourcesName: [
        //   { required: true, message: "请选择菜单项", trigger: "change" }
        // ]
      }
    }
  },
  created () {
    const { id } = this.$route.params
    if (id) {
      const { resources, roleName, note, code, status } = utils.getStore('_ROLEINFO')
      const curForm = { roleName, resources: [], note, code, status }
      curForm.resourcesName = resources
        .map(res => {
          this.curDefaultKeys.push(res.id)
          curForm.resources.push({ id: res.id })
          return res.resName
        })
        .join(',')
      this.formModel = curForm
    } else {
      utils.removeStore('_ROLEINFO')
    }
  },
  methods: {
    getTreeData () {
      return this.$api.menu.getResourceList
    },
    addHandle () {
      const addForm = this.formModel
      addForm.createBy = this.userInfo.userName
      delete addForm.resourcesName
      this.$api.role.addRole({
        ...addForm
      }).then(() => {
        this.dialogVisible = false
        this.$msgTip('保存成功')
      })
    },
    updateHandle () {
      const updateForm = this.formModel
      updateForm.updateBy = this.userInfo.userName
      updateForm.id = parseInt(this.$route.params.id)
      delete updateForm.resourcesName
      this.$api.role.updRole({
        ...updateForm
      }).then(() => {
        this.dialogVisible = false
        this.$msgTip('更新成功')
      })
    },
    changeTreeNode (val, isChecked, treeRefs) {
      this.isChange = true
      this.curCheckTree = treeRefs.getCheckedNodes().slice()
      this.curDefaultKeys = treeRefs.getCheckedKeys().slice()
    },
    onSubmit () {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          if (this.$route.params.id) {
            this.updateHandle()
          } else {
            this.addHandle()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.formRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.box {
	.form {
		width: 40%;
		.select-menu {
			:hover {
				cursor: pointer;
			}
		}
	}
}
</style>
