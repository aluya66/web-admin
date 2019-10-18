<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button type="primary" :size="size" icon="el-icon-plus" @click="showDialog">新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        hasBorder
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search">
            <el-form-item label="物流名称">
              <el-input
                v-model="searchObj.logiName"
                class="search-item"
                :size="size"
                placeholder="请输入物流名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="物流编码">
              <el-input
                v-model="searchObj.logiCode"
                class="search-item"
                :size="size"
                placeholder="请输入物流编码"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="search-btn"
                :size="size"
                icon="el-icon-search"
                @click="searchSubmit"
              >查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </c-table>
    </div>
    <!-- <el-dialog
      :title="modalTitle"
      :visible.sync="contentModal"
      width="30%"
      >
      <el-form ref="form" :model="formLeft" label-width="80px" class="modelStyle">
        <el-form-item label="物流名称:">
          <el-input v-model="formLeft.logiName" placeholder='物流名称'></el-input>
          </el-form-item>
        <el-form-item label="物流编码:" v-if="statusType===1">
          <el-input v-model="formLeft.logiCode" placeholder='物流编码'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="contentModal = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addReleaseBtn">确 定</el-button>
      </span>

    </el-dialog>-->

    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <logistics-add ref="childRef" :init-data="dialogObj.initData"></logistics-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'
import CDialog from 'components/dialog'
import LogisticsAdd from './logisticsAdd'

export default {
  mixins: [mixinTable],
  components: {
    CDialog,
    LogisticsAdd
  },
  data(vm) {
    return {
      dialogObj: {}, // 对话框数据
      searchObj: {
        logiName: '',
        logiCode: ''
      },
      marketableSelect: [],
      pickerOptions: utils.pickerOptions,
      tableList: [],
      tableInnerBtns: [
        {
          width: 130,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              logiName,
              logiCode,
              id
            } = row
            vm.showDialog({
              title: '编辑物流',
              initData: {
                logiName,
                logiCode,
                id: id
              },
              isEdit: true
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '物流名称',
          prop: 'logiName',
          fixed: true
        },
        {
          label: '物流编码',
          prop: 'logiCode'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     * 获取表格数据
     */
    fetchData() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
      this.isLoading = true
      this.$api.basic
        .getLogistics({
          ...searchDate,
          ...other,
          ...page,
          pageSize: 10
        })
        .then(res => {
          this.isLoading = false
          if (res.totalCount) {
            const { data, totalCount } = res
            this.pageInfo.totalNum = totalCount
            this.tableList = data
          } else {
            this.tableList = res
          }
        })
    },
    /**
     * 对话框确认按钮，集成了表单提交功能
     */
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          if (!this.dialogObj.isEdit) {
            this.addHandle(childFormModel)
          } else {
            this.editHandle(childFormModel)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增物流',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    /**
     * 确认新增操作
     */
    addHandle(formModel) {
      this.$api.basic.addLogistics(formModel).then(res => {
        this.$Message.info('新增成功')
        this.fetchData()
      })
      this.dialogObj.isShow = false
    },
    /**
     * 确认修改操作
     */
    editHandle(formModel) {
      // codeing ajax
      // ajax成功方法里面加入 关闭对话框标识
      let data = {
        ...formModel
      }
      this.$api.basic.updateLogistics(data).then(res => {
        this.$Message.info('修改成功')
        this.fetchData()
      })
      this.dialogObj.isShow = false
    },

    // addReleaseBtn() {
      //   if (!this.formLeft.logiName) {
      //     this.$Message.info('物流名称不能为空')
      //     return
      //   }
      //   if (!this.formLeft.logiCode) {
      //     this.$Message.info('code不能为空')
      //     return
      //   }
      //   let that = this
      //   if (this.statusType === 1) {
      //     let data = {
      //       logiName: this.formLeft.logiName,
      //       logiCode: this.formLeft.logiCode
      //     }
      //     this.$api.basic.addLogistics(data).then(res => {
      //       that.$Message.info('添加成功')
      //       that.contentModal = false
      //       that.fetchData()
      //     })
      //   } else if (this.statusType === 2) {
      //     let data = {
      //       logiName: this.formLeft.logiName,
      //       logiCode: this.formLeft.logiCode,
      //       id: this.formLeft.id,
      //       sort: this.formLeft.sort
      //     }
      //     this.$api.basic.updateLogistics(data).then(res => {
      //       that.$Message.info('修改成功')
      //       that.contentModal = false
      //       that.getLogisticsList()
      //     })
      //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.main__box {
  .search {
    margin-bottom: 10px;
    width: 100%;
    .search-item {
      width: 250px;
    }
  }
}
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.selectWidth {
  width: 200px;
}
.deteleBtn {
  margin-right: 5px;
}
.addBtn {
  margin-left: 40px;
}
.cancelBtn {
  margin-left: 8px;
}
.modelStyle {
  margin: 0 20px;
}
</style>
