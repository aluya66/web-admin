<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
      <div class="header-btn">
        <el-button type="primary" size="medium" icon="el-icon-plus" @click="showDialog">新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :max-height="maxHeight"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <c-search
            :form-model="searchObj"
            :form-items="searchItems"
            @submit-form="searchSubmit"
            @reset-form="searchReset"
          ></c-search>
        </template>
      </c-table>
    </div>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <c-details ref="childRef" :init-data.sync="dialogObj.initData"></c-details>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import CDetails from './details'
import dictObj from '@/store/dictData'
export default {
  name: 'afterSalesCostSettingsList',
  mixins: [mixinTable],
  components: {
    CDialog,
    CDetails
  },
  data(vm) {
    return {
      // 对话框对象
      dialogObj: {},
      // 表格内操作按钮
      tableInnerBtns: [
        {
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            vm.getDetail(row)
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { id, feeName } = row
            vm.confirmTip(
              `是否删除 【${feeName}】 设置`,
              {
                confirmHandle() {
                  vm.deleteData(id)
                }
              }
            )
          }
        }
      ],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '名称',
          prop: 'feeName'
        },
        {
          label: '金额',
          prop: 'fee'
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, dictObj.disStatus)
          }
        },
        {
          label: '操作人',
          prop: 'updateName'
        },
        {
          width: 150,
          label: '时间',
          prop: 'created'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 删除渠道
    deleteData(id, msgTip = '删除成功') { // 无删除接口，调用更新接口来设置isDelete
      this.$api.order.afterSalesCostSettingDelete({ id }).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    },
    dialogConfirm() {
      const childRef = this.$refs.childRef
      const requestMethods = {
        'add': this.$api.order.afterSalesCostSettingCreate,
        'edit': this.$api.order.afterSalesCostSettingUpdate
      }
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          const request = childFormModel.id ? requestMethods['edit'] : requestMethods['add']
          request(childFormModel).then(() => {
            this.responeHandle('操作成功')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getDetail(row) {
      const { id, feeName, fee, status } = row
      this.showDialog({
        title: '编辑',
        initData: {
          id, feeName, fee, status
        }
      })
    },
    /*
     * 查询表格列表数据
     */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.order
        .afterSalesCostSettingList({
          ...page
        })
        .then(res => {
          this.isLoading = false
          if (res && res.totalCount) {
            const { data, totalCount } = res
            this.pageInfo.totalNum = totalCount
            this.tableList = data || []
          } else {
            this.tableList = res || []
          }
        })
    },
    /**
     * dialog对话框数据处理
     * @opts {*}
     */
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增',
        initData: opts.initData
      }
    }
  }
}
</script>
<style>
</style>
