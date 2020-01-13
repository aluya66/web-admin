<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <div class="header-btn">
          <el-button :size="size" type="primary" icon="el-icon-plus" @click="showDialog">新增</el-button>
        </div>
      </div>
    </template>
    <div class="main__box">
      <c-table
        selection
        hasBorder
        :size="size"
        :max-height="730"
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
        @on-submit="submitHandle"
      >
        <!-- 渠道新增、编辑弹窗 -->
        <rule-handle
          ref="childRef"
          :init-data="dialogObj.initData"
          :is-edit="dialogObj.isEdit"
          :channel-type="channelType"
          v-if="dialogObj.dialogType === 'channelHandle'"
        ></rule-handle>
        <!-- 新增渠道类型选择 -->
        <div class="select-rule-type" v-if="dialogObj.dialogType === 'addChannel'">
          <el-radio-group v-model="channelType">
            <el-radio :label="item" v-for="(item, index) in channelTypeList" :key="index"></el-radio>
          </el-radio-group>
        </div>
        <!-- 渠道关联规则弹窗 -->
        <div class="transfer-wrapper" v-if="dialogObj.dialogType === 'transfer'">
          <el-transfer
            filterable
            filter-placeholder="请输入规则名称"
            :titles="['规则列表', '已关联规则']"
            v-model="selectedRuleList"
            @change="changeSelectedRuleList"
            :data="ruleList"
          ></el-transfer>
        </div>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import ruleHandle from './handle'
const channelTypeSelect = [ // 渠道类型
  {
    label: '主渠道',
    value: 1
  },
  {
    label: '子渠道',
    value: 2
  }
]
const statusSelect = [{
  label: '关闭',
  value: 0
}, {
  label: '开启 ',
  value: 1
}]
export default {
  name: 'channelManage',
  mixins: [mixinTable],
  components: {
    CDialog,
    ruleHandle
  },
  data(vm) {
    return {
      channelType: '主渠道',
      channelTypeList: ['主渠道', '子渠道'],
      currentChannelCode: null, // 关联规则的渠道id
      ruleList: [], // 规则列表
      selectedRuleList: [], // 已选规则列表
      btnLoading: false,
      dialogObj: {},
      tableInnerBtns: [
        {
          width: 150,
          name: '编辑',
          icon: 'el-icon-edit',
          handle({ channelId, channelCode, channelName, channelType, parentChannelId }) {
            vm.channelType = parentChannelId ? '子渠道' : '主渠道'
            let initData = {
              channelId,
              channelCode,
              channelType,
              channelName
            }
            if (parentChannelId) Object.assign(initData, { parentChannelId })
            vm.showDialog({
              title: '编辑渠道',
              dialogType: 'channelHandle',
              initData,
              isEdit: true
            })
          }
        },
        {
          name: '关联规则',
          icon: 'el-icon-connection',
          notBtn: 'ruleInfos',
          handle(row) {
            vm.$api.channel.getChannelRule().then(res => {
              vm.isLoading = false
              let ruleList = res && res.totalCount ? res.data : res
              vm.ruleList = ruleList.map((item) => {
                return {
                  key: item.ruleCode,
                  label: item.ruleName
                }
              })
              vm.currentChannelCode = row.channelCode
              vm.selectedRuleList = row.ruleInfos.map((item) => item.ruleCode)
              vm.showDialog({
                title: '关联规则',
                dialogType: 'transfer'
              })
            })
          }
        }
        //   {
        //   prop: {
        //     name: 'status', // 为0或1
        //     toggle: [{
        //       icon: 'el-icon-open',
        //       title: '开启'
        //     }, {
        //       icon: 'el-icon-close',
        //       title: '关闭'
        //     }]
        //   },
        //   handle(row) {
        //     const { channelId, channelName, status } = row
        //     const handleStatus = status === 1 ? 0 : 1 // 0关闭、1开启
        //     vm.confirmTip(
        //       `是否${handleStatus === 0 ? '关闭' : '开启'} ${channelName} 渠道`,
        //       () => {
        //         vm.handleChannelStatus({ id: channelId, status: handleStatus })
        //       }
        //     )
        //   }
        // },
        // {
        //   name: '删除',
        //   icon: 'el-icon-detail',
        //   handle(row) {
        //     const { channelId, channelName } = row
        //     vm.confirmTip(
        //       `是否删除 ${channelName}渠道`,
        //       {
        //         confirmHandle() {
        //           vm.deleteData({ id: channelId })
        //         }
        //       }
        //     )
        //   }
        // }
      ],
      tableHeader: [
        {
          label: '渠道名称',
          prop: 'channelName',
          search: {
            type: 'input'
          }
        },
        {
          label: '渠道号码',
          prop: 'channelCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '所属渠道',
          prop: 'parentChannelName'
        },
        {
          label: '渠道类型',
          prop: 'channelType',
          search: {
            type: 'select',
            optionsList: channelTypeSelect
          },
          formatter(row) {
            return row.channelType === 1 ? '主渠道' : '子渠道'
          }
        },
        {
          label: '关联规则',
          prop: 'ruleInfos',
          formatter(row) {
            const list = row.ruleInfos && row.ruleInfos.length ? row.ruleInfos.map((item) => {
              return item.ruleName
            }) : []
            return list.join('，')
          }
        },
        {
          label: '联系人',
          prop: 'contact'
        },
        {
          label: '联系人电话 ',
          prop: 'contactTel'
        },
        {
          label: '渠道状态',
          prop: 'status',
          search: {
            type: 'select',
            optionsList: statusSelect
          },
          formatter(row) {
            return row.status === 0 ? '关闭' : '开启'
          }
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100
        },
        {
          label: '更新时间',
          width: 100,
          prop: 'updated'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增渠道',
        dialogType: opts.dialogType || 'addChannel',
        initData: opts.initData,
        isEdit: opts.isEdit || false
      }
    },
    // 已选中关联规则
    changeSelectedRuleList(value, direction, movedKeys) {
      this.selectedRuleList = value
    },
    // 更新关联规则
    relevanceRule() {
      if (!this.selectedRuleList.length) return this.$msgTip('已选规则不能为空')
      this.$api.channel.relevanceRuleAjax({
        channelCode: this.currentChannelCode,
        ruleCodes: this.selectedRuleList
      }).then(() => {
        this.fetchData()
        this.$msgTip('操作成功')
        this.dialogObj.isShow = false
      })
    },
    submitHandle() {
      // 关联规则
      if (this.dialogObj.dialogType === 'transfer') {
        this.relevanceRule()
      } else if (this.dialogObj.dialogType === 'addChannel') {
        this.showDialog({
          title: `新增${this.channelType}`,
          dialogType: 'channelHandle',
          initData: {
            channelType: this.channelType === '主渠道' ? 1 : 2, // 渠道类型 1:主渠道 2:子渠道
            channelName: ''
          }
        })
      } else {
        // 新增、编辑渠道
        const childRef = this.$refs.childRef
        childRef.$refs.formRef.validate(valid => {
          if (valid) {
            const childFormModel = childRef.formModel
            const requestType = childFormModel.channelCode ? 'edit' : 'add' // 接口请求类型， add新增、edit编辑
            this.handleChannel(requestType, childFormModel)
          }
        })
      }
    },
    handleChannel(requestType, childFormModel) {
      const requestObj = {
        add: this.$api.channel.addChannel,
        edit: this.$api.channel.editChannel
      }
      const request = requestObj[requestType]
      request(childFormModel).then(() => {
        const msg = requestType === 'edit' ? '编辑成功' : '新增成功'
        this.$msgTip(msg)
        this.fetchData()
        this.dialogObj.isShow = false
      })
    },
    // 开启、关闭渠道
    handleChannelStatus({ id, status }) {
      this.$api.channel.handleChannelStatus({ id, status }).then(() => {
        const msg = status === 0 ? '已关闭' : '已开启'
        this.$msgTip(msg)
        this.fetchData()
      })
    },
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.channel.getChannel({
        ...this.searchObj,
        ...page
      }).then(res => {
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
    // 删除渠道
    deleteData(params, msgTip = '删除成功') {
      this.$api.channel.deleteChannel(params).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    }
  }
}
</script>
<style lang="less">
.transfer-wrapper {
  display: flex;
  justify-content: center;
  .el-transfer {
    .el-transfer-panel {
      width: 300px;
    }
  }
}
</style>
<style lang="less" scoped>
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
  .select-item {
    width: 50%;
  }
}
</style>
