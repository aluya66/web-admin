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
        ref="cTable"
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
        :noBtn="dialogObj.type === 'previewQrcode'"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <qrcode-add ref="childRef" :init-data.sync="dialogObj.initData" v-if="dialogObj.type === 'handleQrcode'"></qrcode-add>
        <div class="preview-dialog" v-if="dialogObj.type === 'previewQrcode'">
          <el-image :src="dialogObj.initData.url"></el-image>
          <h3>二维码信息: {{dialogObj.initData.data}}</h3>
        </div>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import QrcodeAdd from './add'
import dictObj from '@/store/dictData'

export default {
  name: 'settingsQrcode',
  mixins: [mixinTable],
  components: {
    CDialog,
    QrcodeAdd
  },
  data(vm) {
    return {
      dialogObj: {}, // 弹窗数据
      tableInnerBtns: [
        {
          width: 150,
          prop: {
            name: 'status', // 为0或1
            toggle: [{
              icon: 'el-icon-check',
              title: '审核'
            }, {
              icon: 'el-icon-close',
              title: '驳回'
            }]
          },
          handle(row) {
            const { status, id, qrcodeName } = row
            const updateStatus = status === 0 ? 1 : 0
            const updateMsg = status === 0 ? '审核通过' : '审核不通过'
            vm.confirmTip(`确认${updateMsg}【${qrcodeName}】二维码`, () => {
              vm.changeStatus({ id, status: updateStatus })
            })
          }
        },
        {
          name: '预览',
          icon: 'el-icon-view',
          handle(row) {
            vm.previewQrcode(row.qrcodeCode)
          }
        },
        {
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const { id, contextKey, description, qrcodeCode, qrcodeName, producerCode, userCode } = row
            let contextKeyList = contextKey.split(',').map((item) => {
              return { value: item }
            })
            let userCodeList = userCode && userCode.split(',')
            vm.showDialog({
              title: '编辑二维码',
              initData: {
                id,
                contextKey: contextKeyList,
                qrcodeCode,
                qrcodeName,
                producerCode,
                userCode: userCodeList,
                description
              }
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { qrcodeName, id } = row
            vm.confirmTip(`是否删除【${qrcodeName}】二维码`, () => {
              vm.deleteQrcode(id)
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '二维码ID',
          prop: 'id',
          fixed: true
        },
        {
          label: '二维码名称',
          prop: 'qrcodeName',
          search: {
            type: 'input'
          }
        },
        {
          label: '二维码编码',
          prop: 'qrcodeCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '二维码使用者',
          prop: 'userCode',
          formatter(row) {
            let userCodeList = row.userCode ? row.userCode.split(',') : []
            let arr = []
            return userCodeList.length && userCodeList.reduce((total, item) => {
              let arrItem = dictObj.lobList.find(lobItem => lobItem.value === item)
              arr.push(arrItem ? arrItem.label : item)
              return arr.join(',')
            }, '')
          },
          search: {
            type: 'dict',
            multiple: true,
            optionsList: dictObj.lobList
          }
        },
        {
          label: '字段值',
          prop: 'contextKey',
          width: 200,
          search: {
            type: 'dict',
            label: '二维码生产者',
            prop: 'producerCode',
            optionsList: dictObj.lobList
          }
        },
        {
          label: '审核状态',
          prop: 'status',
          formatter(row) {
            return row.status === 0 ? '未审核' : '已审核'
          },
          search: {
            type: 'dict',
            optionsList: dictObj.auditStatus
          }
        },
        {
          label: '创建人',
          prop: 'opCreator'
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100,
          search: {
            type: 'dateTime',
            prop: 'dateTime'
          }
        },
        {
          label: '更新人',
          prop: 'opEditor'
        },
        {
          label: '更新时间',
          prop: 'updated',
          width: 100
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    previewQrcode(qrcodeCode) {
      this.$api.settings.previewQrcode({ qrcodeCode }).then((res) => {
        this.showDialog({
          title: '预览',
          dialogType: 'previewQrcode',
          initData: res
        })
      })
    },
    // 新增、编辑提交
    dialogConfirm() {
      const childRef = this.$refs.childRef
      const requestMethods = {
        'add': this.$api.settings.saveQrcode,
        'edit': this.$api.settings.updateQrcode
      }
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          const request = childFormModel.id ? requestMethods['edit'] : requestMethods['add']
          let { userCode, contextKey, qrcodeCode, ...other } = childFormModel
          let userCodeStr = userCode ? userCode.join(',') : '' // 使用者字段处理
          let contextKeyStr = contextKey.length && contextKey.map((item) => item.value).join(',') // 字段值处理
          request({
            ...other,
            qrcodeCode,
            userCode: userCodeStr,
            contextKey: contextKeyStr
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
        type: opts.dialogType || 'handleQrcode',
        title: opts.title || '新增二维码',
        initData: opts.initData
      }
    },
    // 删除二维码
    deleteQrcode(id) {
      this.$api.settings.deleteQrcode({ id }).then(() => {
        this.$msgTip('删除成功')
        this.fetchData()
      })
    },
    // 启用、禁用
    changeStatus(params) {
      this.$api.settings.changeStatus(params).then(() => {
        this.$msgTip('更新成功')
        this.fetchData()
      })
    },
    fetchData() {
      this.isLoading = true
      const { totalNum, ...page } = this.pageInfo
      const { dateTime, userCode, ...other } = this.searchObj
      const searchDate = this.getSearchDate(dateTime)
      this.$api.settings.getQrcodeList({
        userCode: userCode ? userCode.join(',') : '', // 使用者字段
        ...searchDate,
        ...other,
        ...page
      }).then(res => {
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
