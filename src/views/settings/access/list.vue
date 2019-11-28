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
        selection
        hasBorder
        :max-height="685"
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
        <access-add ref="childRef" :init-data.sync="dialogObj.initData"></access-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import dictObj from '@/store/dictData'
import AccessAdd from './add'
export default {
  name: 'settingsQrcode',
  mixins: [mixinTable],
  components: {
    CDialog,
    AccessAdd
  },
  data(vm) {
    return {
      dialogObj: {}, // 弹窗数据
      tableInnerBtns: [
        {
          width: 150,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const { id, appKey, encryptStatus, signStatus, tokenStatus, status } = row
            vm.showDialog({
              title: '编辑',
              initData: {
                id,
                appKey,
                encryptStatus,
                signStatus,
                tokenStatus,
                status
              }
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { appKey, id } = row
            vm.confirmTip(`是否删除【${appKey}】接入方`, () => {
              vm.deleteItem(id)
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '开放平台APPKEY',
          prop: 'appKey',
          fixed: true,
          search: {
            label: 'APPKEY',
            type: 'input'
          }
        },
        {
          label: '开放平台密钥',
          prop: 'secret'
        },
        {
          label: '公钥',
          prop: 'publicKey',
          formatter(row) {
            return row.publicKey ? '已上传' : '未上传'
          }
        },
        {
          label: '私钥',
          prop: 'privateKey',
          formatter(row) {
            return row.privateKey ? '已上传' : '未上传'
          }
        },
        {
          label: '是否启用token验证',
          prop: 'tokenStatus',
          formatter(row) {
            return row.tokenStatus === 0 ? '禁用' : '启用'
          },
          search: {
            label: 'token验证',
            type: 'select',
            optionsList: dictObj.disStatus
          }
        },
        {
          label: '是否启用签名',
          prop: 'signStatus',
          formatter(row) {
            return row.signStatus === 0 ? '禁用' : '启用'
          },
          search: {
            label: '是否启用签名',
            type: 'select',
            optionsList: dictObj.disStatus
          }
        },
        {
          label: '是否启用加密',
          prop: 'encryptStatus',
          formatter(row) {
            return row.encryptStatus === 0 ? '禁用' : '启用'
          },
          search: {
            label: '是否启用加密',
            type: 'select',
            optionsList: dictObj.disStatus
          }
        },
        {
          label: '是否启用',
          prop: 'status',
          formatter(row) {
            return row.status === 0 ? '禁用' : '启用'
          },
          search: {
            label: '是否启用',
            type: 'select',
            optionsList: dictObj.disStatus
          }
        },
        {
          label: '创建人名字',
          prop: 'opCreator',
          search: {
            label: '创建人名字',
            type: 'input'
          }
        },
        {
          label: '修改人名字',
          prop: 'opEditor',
          search: {
            label: '修改人名字',
            type: 'input'
          }
        },
        {
          label: '最后更新时间',
          prop: 'updated',
          search: {
            prop: 'dataTime',
            type: 'dateTime'
          }
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 新增、编辑提交
    dialogConfirm() {
      const childRef = this.$refs.childRef
      const requestMethods = {
        'add': this.$api.settings.saveAccess,
        'edit': this.$api.settings.updateAccess
      }
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          const request = childFormModel.id ? requestMethods['edit'] : requestMethods['add']
          request({
            ...childFormModel
          }).then(() => {
            this.responeHandle('操作成功')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 弹窗
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增',
        initData: opts.initData
      }
    },
    // 删除
    deleteItem(id) {
      this.$api.settings.deleteAccess({ id }).then(() => {
        this.$msgTip('删除成功')
        this.fetchData()
      })
    },
    fetchData() {
      const { pageSize, pageNo } = this.pageInfo
      const { dataTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(dataTime, 'dateTime', 'startTime', 'endTime')
      this.isLoading = true
      this.$api.settings
        .getAccessList({
          ...searchDate,
          ...other,
          pageSize,
          pageNo
        })
        .then(res => {
          this.isLoading = false
          if (res.totalCount) {
            const { data, totalCount } = res
            this.pageInfo.totalNum = totalCount
            this.tableList = data || []
          } else {
            this.tableList = res || []
          }
        })
    }
  }
}
</script>

<style lang='less' scoped>
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.preview-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  > h3 {
    padding: 15px;
  }
}
</style>
