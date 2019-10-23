<template>
  <c-view>
    <template v-slot:header>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="showAdd">新增用户</el-button>
    </template>
    <div class="box">
      <c-table
        class="c-table"
        selection
        :max-height="546"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
            <el-form-item label="用户名">
              <el-input
                v-model="searchObj.userName"
                class="search-item"
                size="medium"
                placeholder="搜索用户名"
                clearable
              />
            </el-form-item>
            <el-form-item label="用户状态">
              <el-select
                v-model="searchObj.status"
                size="medium"
                class="search-item"
                clearable
                placeholder="用户状态"
              >
                <el-option label="启用" :value="0"></el-option>
                <el-option label="禁用" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运营商">
              <el-select
                v-model="searchObj.operator"
                size="medium"
                class="search-item"
                clearable
                placeholder="运营商"
              >
                <el-option
                  v-for="(item, index) in supplyList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="search-btn" size="medium" @click="searchSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </c-table>
    </div>
    <div v-if="dialogVisible">
      <c-dialog
        :title="curTitle"
        :is-show="dialogVisible"
        close-btn
        :btns="dialogBtns"
        @before-close="dialogVisible = false"
      >
        <user-info ref="formAdd" :user-msg="curUser" v-if="dialogType === 1"></user-info>
        <user-pass ref="formPass" :user-info="curUser" v-if="dialogType === 2"></user-pass>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import CTable from 'components/table'
import CDialog from 'components/dialog'
import UserInfo from './info.vue'
import UserPass from './pass.vue'

import utils from 'utils'
import { mapGetters } from 'vuex'

export default {
  data (vm) {
    return {
      searchObj: {
        userName: '',
        status: '',
        operator: ''
      },
      supplyList: [],
      curUser: {},
      clearTimeDelay: null,
      dialogVisible: false,
      dialogType: null,
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        totalSize: 0
      },
      tableList: [],
      isLoading: false,
      tableInnerBtns: [
        {
          name: '修改密码',
          handle (row) {
            const { salt, userName, id } = row
            vm.curUser = {
              id,
              userName,
              salt
            }
            vm.dialogType = 2
            vm.dialogVisible = true
          }
        },
        {
          name: '编辑',
          handle (row) {
            const { userName, id, status, roles, operator } = row
            vm.curUser = {
              userName,
              id,
              status,
              roles,
              operator
            }
            vm.dialogType = 1
            vm.dialogVisible = true
          }
        },
        {
          name: '删除',
          handle (row) {
            const { id, userName } = row
            vm.$confirm(`是否确定删除 ${userName} 用户 ?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            })
              .then(() => {
                vm.$api.user.delAdmin({
                  updateBy: vm.userInfo.userName,
                  id
                }).then(() => {
                  vm.$msgTip('删除成功')
                  if (vm.tableList.length === 1) {
                    vm.pageInfo.currentPage = vm.pageInfo.currentPage > 1 ? vm.pageInfo.currentPage - 1 : 1
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
            if (vm.dialogType === 1) {
              const childRef = vm.$refs.formAdd
              childRef.$refs.formRef.validate(valid => {
                if (valid) {
                  if (vm.curUser.id) {
                    vm.updateUser()
                  } else {
                    vm.submitUser()
                  }
                } else {
                  console.log('error submit!!')
                  return false
                }
              })
            } else {
              const childRef = vm.$refs.formPass
              childRef.$refs.formRef.validate(valid => {
                if (valid) {
                  vm.changePassword(childRef.formModel.password)
                } else {
                  console.log('error submit!!')
                  return false
                }
              })
            }
          }
        }
      ],
      tableHeader: [
        {
          label: '用户名',
          width: 150,
          prop: 'userName'
        },
        {
          label: '用户状态',
          prop: 'status',
          width: 150,
          formatter (row) {
            return row && row.status === 0 ? '启用' : '禁用'
          }
        },
        {
          label: '用户角色',
          prop: 'roles',
          formatter (row) {
            return row && row.roles.map(val => val.roleName).join(',')
          }
        },
        {
          label: '可查看运营商',
          prop: 'operator',
          width: 150,
          formatter (row) {
            if (row && row.operator && row.operator.indexOf(',') !== -1) {
              return row.operator
                .split(',')
                .map(res => vm.operatorObj[res])
                .join(',')
            }
            return vm.operatorObj[row.operator]
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
  computed: {
    curTitle () {
      return this.dialogType === 2
        ? '修改密码'
        : this.curUser.id
          ? '编辑用户'
          : '新增用户'
    },
    ...mapGetters(['userInfo', 'operatorObj'])
  },
  created () {
    this.supplyList = Object.keys(this.operatorObj).map(res => ({
      label: this.operatorObj[res],
      value: res
    }))
    this.fetchData()
  },
  methods: {
    getFormData () {
      const {
        userName,
        password,
        roles,
        operator,
        status
      } = this.$refs.formAdd.formModel
      const formData = { userName, password, status }
      if (roles.length) {
        formData.roles = roles.map(res => ({ id: res }))
      }
      if (operator.length) {
        formData.operator = operator.join(',')
      }
      return formData
    },
    changePassword (password) {
      const id = this.curUser.id
      this.$api.user.changePwd({
        id,
        password
      }).then(() => {
        this.dialogVisible = false
        this.$msgTip('保存成功')
      })
    },
    submitUser () {
      const addForm = this.getFormData()
      const { userName } = this.userInfo
      this.$api.user.addAdmin({
        ...addForm,
        createBy: userName
      }).then(() => {
        this.dialogVisible = false
        this.$msgTip('保存成功')
        this.fetchData()
      })
    },
    updateUser () {
      const updateForm = this.getFormData()
      const { userName } = this.userInfo
      updateForm.id = this.curUser.id
      delete updateForm.password
      this.$api.user.updAdmin({
        ...updateForm,
        updateBy: userName
      }).then(() => {
        this.dialogVisible = false
        this.$msgTip('更新成功')
        this.fetchData()
      })
    },
    showAdd () {
      this.dialogVisible = true
      this.dialogType = 1
      this.curUser = {}
    },
    searchSubmit () {
      this.pageInfo.currentPage = 1
      this.fetchData()
    },
    fetchData () {
      this.isLoading = true
      this.$api.user.getAdminList(
        {
          ...this.searchObj
        },
        this.pageInfo.currentPage,
        this.pageInfo.pageSize
      ).then(res => {
        this.isLoading = false
        if (res.page) {
          const { data, page } = res
          const { currentPage, totalRow } = page
          this.pageInfo.currentPage = currentPage
          this.pageInfo.totalSize = totalRow
          this.tableList = data
        } else {
          this.tableList = res
          this.pageInfo.totalSize = res.length
        }
      })
    },
    changePagination (pageInfo) {
      this.pageInfo.currentPage = pageInfo.page
      this.pageInfo.pageSize = pageInfo.limit
      this.fetchData()
    }
  },
  components: {
    CTable,
    UserInfo,
    CDialog,
    UserPass
  }
}
</script>

<style lang="less" scoped>
.box {
  .search-form {
    margin-bottom: 10px;
    width: 100%;
    .search-item {
      width: 250px;
    }
  }
}
</style>
