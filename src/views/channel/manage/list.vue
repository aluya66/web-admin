<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
         <div class="header-btn">
          <el-button
            :size="size"
            type="primary"
            icon="el-icon-plus"
            @click="addChannel"
          >新增</el-button>
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
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search">
            <el-form-item label="渠道名称">
              <el-input
                v-model="searchObj.channelName"
                class="search-item"
                size="medium"
                placeholder="渠道名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="渠道号码">
              <el-input
                v-model="searchObj.channelCode"
                class="search-item"
                size="medium"
                placeholder="渠道号码"
                clearable
              />
            </el-form-item>
            <el-form-item label="渠道类型">
              <el-select
                v-model="searchObj.channelType"
                size="medium"
                class="search-item"
                clearable
                placeholder="店铺类型"
              >
                <el-option
                  v-for="(item, index) in channelTypeSelect"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="渠道状态">
              <el-select
                v-model="searchObj.status"
                size="medium"
                class="search-item"
                clearable
                placeholder="渠道状态"
              >
                <el-option
                  v-for="(item, index) in statusSelect"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
    <!-- 渠道新增、编辑弹窗 -->
    <div v-if="channelDialogObj.isShow">
      <c-dialog
        :is-show="channelDialogObj.isShow"
        :title="channelDialogObj.title"
        close-btn
        @before-close="channelDialogObj.isShow = false"
        @on-submit="submitHandle"
      >
        <el-form
          ref="formRef"
          :model="formModel"
          label-width="120px"
          class="form"
          label-position="right"
        >
          <el-form-item label="所属层级:" prop="channelType">
            <el-select v-model="formModel.channelType" class="select-item" clearable>
              <el-option
                v-for="item in channelTypeSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="渠道名称:" prop="channelName"
            :rules="[{ required: true, message: '渠道名称不能为空'}]"
          >
            <el-input v-model.trim="formModel.channelName" class="form-item" placeholder='请输入渠道名称'/>
          </el-form-item>
        </el-form>
      </c-dialog>
    </div>

     <!-- 渠道关联规则弹窗 -->
    <div v-if="ruleDialogObj.isShow">
      <c-dialog
        :is-show="ruleDialogObj.isShow"
        :title="ruleDialogObj.title"
        close-btn
        @before-close="ruleDialogObj.isShow = false"
        @on-submit="relevanceRule"
      >
        <el-transfer
          filterable
          filter-placeholder="请输入规则名称"
          :titles="['规则列表', '已关联规则']"
          v-model="selectedRuleList"
          @change="changeSelectedRuleList"
          :data="ruleList">
        </el-transfer>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
export default {
  name: 'channelManage',
  mixins: [mixinTable],
  components: {
    CDialog
  },
  data(vm) {
    return {
      currentChannelCode: null, // 关联规则的渠道id
      ruleList: [], // 规则列表
      selectedRuleList: [], // 已选规则列表
      btnLoading: false,
      formModel: { // 渠道弹窗数据
        channelType: 1,
        channelName: ''
      },
      searchObj: {
        channelName: '', // 渠道名称
        channelCode: '', // 渠道号码
        channelType: '', // 渠道类型
        status: '' // 渠道状态
      },
      channelTypeSelect: [ // 渠道类型
        {
          label: '主渠道',
          value: 1
        },
        {
          label: '子渠道',
          value: 2
        }
      ],
      statusSelect: [{
        label: '关闭',
        value: 0
      }, {
        label: '开启 ',
        value: 1
      }],
      ruleDialogObj: { // 关联规则弹窗
        title: '关联规则',
        isShow: false
      },
      channelDialogObj: { // 渠道弹窗
        title: '新增渠道',
        isShow: false
      },
      tableInnerBtns: [{
        width: 150,
        prop: {
          name: 'status', // 为0或1
          toggle: [{
            icon: 'el-icon-close',
            title: '关闭'
          }, {
            icon: 'el-icon-open',
            title: '开启'
          }]
        },
        handle (row) {
          const { channelCode, channelName, status } = row
          const handleStatus = status === 1 ? 0 : 1 // 0关闭、1开启
          vm.confirmTip(
            `是否${handleStatus === 0 ? '关闭' : '开启'} ${channelName} 渠道`,
            () => {
              vm.handleChannelStatus({ id: channelCode, status: handleStatus })
            }
          )
        }
      }, {
        name: '关联规则',
        icon: 'el-icon-postcard',
        handle(row) {
          vm.$api.channel
            .getChannelRule()
            .then(res => {
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
              vm.ruleDialogObj.isShow = true
            })
        }
      }, {
        name: '编辑',
        icon: 'el-icon-edit',
        handle ({ channelCode, channelName, channelType }) {
          vm.formModel = {
            channelCode,
            channelName,
            channelType
          }
          vm.channelDialogObj.isShow = true
          vm.channelDialogObj.title = '编辑渠道'
        }
      }, {
        name: '删除',
        icon: 'el-icon-detail',
        handle (row) {
          const { channelCode, channelName } = row
          vm.confirmTip(
            `是否删除 ${channelName} 渠道`,
            {
              confirmHandle() {
                vm.deleteData({ id: channelCode })
              }
            }
          )
        }
      }],
      tableHeader: [
        {
          label: '渠道名称',
          prop: 'channelName'
        },
        {
          label: '渠道号码',
          prop: 'channelCode'
        },
        {
          label: '渠道主图',
          prop: 'channelImage',
          width: 100,
          isImage: true
        },
        {
          label: '渠道LOGO ',
          prop: 'channelLogo',
          width: 100,
          isImage: true
        },
        {
          label: '渠道类型',
          prop: 'channelType',
          formatter(row) {
            return row.channelType === 1 ? '主渠道' : '子渠道'
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
          label: '创建人',
          prop: 'createBy'
        },
        {
          label: '创建时间',
          prop: 'created'
        },
        {
          label: '渠道状态',
          prop: 'status',
          formatter(row) {
            return row.status === 0 ? '关闭' : '开启'
          }
        },
        {
          label: '更新人',
          prop: 'updateBy'
        },
        {
          label: '更新时间',
          prop: 'updated'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 已选中关联规则
    changeSelectedRuleList(value, direction, movedKeys) {
      console.log(value)
      this.selectedRuleList = value
    },
    relevanceRule() {
      if (!this.selectedRuleList.length) return this.$msgTip('已选规则不能为空')
      this.$api.channel.relevanceRuleAjax({
        channelCode: this.currentChannelCode,
        ruleCodes: this.selectedRuleList
      }).then(() => {
        this.fetchData()
        this.$msgTip('操作成功')
        this.ruleDialogObj.isShow = false
      })
    },
    submitHandle() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const requestType = this.formModel.channelCode ? 'edit' : 'add' // 接口请求类型， add新增、edit编辑
          this.handleChannel(requestType)
        }
      })
    },
    handleChannel(requestType) {
      const requestObj = {
        add: this.$api.channel.addChannel,
        edit: this.$api.channel.editChannel
      }
      const request = requestObj[requestType]
      request({ ...this.formModel }).then(() => {
        const msg = requestType === 'edit' ? '编辑成功' : '新增成功'
        this.$msgTip(msg)
        this.fetchData()
        this.channelDialogObj.isShow = false
      })
    },
    // 新增渠道
    addChannel() {
      this.formModel = {
        channelType: 1,
        channelName: ''
      }
      this.channelDialogObj.isShow = true
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
      this.$api.channel
        .getChannel({
          ...this.searchObj,
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
    // 删除渠道
    deleteData(params, msgTip = '删除成功') {
      this.$api.channel.deleteChannel(params).then(() => {
        this.$msgTip(msgTip)
        this.fetchData()
      })
    }
  }
}
</script>
