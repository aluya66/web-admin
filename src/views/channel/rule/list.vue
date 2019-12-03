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
        ref="cTable"
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
    <!-- 渠道规则新增、编辑弹窗 -->
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="submitHandle"
      >
        <channel-add
          ref="childRef"
          :is-edit="dialogObj.isEdit"
          :init-data="dialogObj.initData"
        ></channel-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import ChannelAdd from './add'

export default {
  name: 'channelRule',
  mixins: [mixinTable],
  components: {
    CDialog,
    ChannelAdd
  },
  data(vm) {
    return {
      dialogObj: {},
      tableHeader: [{
        label: '规则名称',
        prop: 'ruleName',
        search: {
          type: 'input'
        }
      }, {
        label: '渠道状态',
        prop: 'status',
        formatter(row) {
          return row.status === 0 ? '关闭' : '开启'
        },
        search: {
          type: 'select',
          optionsList: [{
            value: 0,
            label: '关闭'
          }, {
            value: 1,
            label: '开启'
          }]
        }
      }, {
        label: '创建时间',
        prop: 'created',
        search: {
          type: 'dateTime',
          prop: 'dateTime'
        }
      }, {
        label: '更新时间',
        prop: 'updated'
      }],
      tableInnerBtns: [{
        prop: {
          name: 'status', // 为0或1
          toggle: [{
            icon: 'el-icon-open',
            title: '开启'
          }, {
            icon: 'el-icon-close',
            title: '关闭'
          } ]
        },
        handle(row) {
          const { ruleId, ruleName, status } = row
          const handleStatus = status === 1 ? 0 : 1 // 0关闭、1开启
          vm.confirmTip(
            `是否${handleStatus === 0 ? '关闭' : '开启'} ${ruleName} 渠道规则`,
            () => {
              vm.handleRuleStatus({ id: ruleId, status: handleStatus })
            }
          )
        }
      }, {
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          const { ruleId } = row
          vm.getRuleDetails(ruleId)
        }
      }, {
        name: '删除',
        icon: 'el-icon-detail',
        handle(row) {
          const { ruleId, ruleName } = row
          vm.confirmTip(`是否删除 ${ruleName} 渠道规则`, () => {
            vm.deleteRule({ id: ruleId })
          })
        }
      }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增渠道规则',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    getRuleDetails(id) {
      this.$api.channel.getRuleInfo({ id }).then((res) => {
        const {
          ruleCode,
          ruleName,
          ruleBrandResps
        } = res
        let brands = ruleBrandResps && ruleBrandResps.length ? ruleBrandResps.map(item => ({
          name: item.brandName,
          id: item.id,
          code: item.brandCode
        })) : ''
        this.showDialog({
          title: '编辑渠道规则',
          initData: {
            ruleCode,
            ruleName,
            brands,
            payment: 2, // 支付方式：1-支付宝, 2-微信, 4-银行卡
            costPrice: 1, // 成衣成本价
            largeBatchPrice: 1, // 成衣大批价
            memberPrice: 1, // 会员价
            retailPrice: 1, // 零售价
            supplyPrice: 1, // 成衣供货价
            wholesalePrice: 1, // 成衣散批价
            store: 0 // 库存设置:0-默认全部，其他待定
          },
          isEdit: true
        })
      })
    },
    // 提交渠道规则
    submitHandle() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        const childFormModel = childRef.formModel
        if (valid) {
          const requestType = this.dialogObj.isEdit ? 'edit' : 'add' // 接口请求类型， add新增、edit编辑
          this.handleRule(childFormModel, requestType)
        }
      })
    },
    handleRule(childFormModel, requestType) {
      const requestObj = {
        add: this.$api.channel.addRule,
        edit: this.$api.channel.editRule
      }
      const { brands, costPrice, largeBatchPrice, memberPrice, retailPrice, supplyPrice, wholesalePrice, store, ruleCode, ...other } = childFormModel
      const curBrands = childFormModel.brands.map(item => ({
        brandCode: item.code,
        brandName: item.name,
        ruleCode
      }))
      requestObj[requestType]({
        ruleCode,
        brands: curBrands,
        costPrice: Number(costPrice),
        largeBatchPrice: Number(largeBatchPrice),
        memberPrice: Number(memberPrice),
        retailPrice: Number(retailPrice),
        supplyPrice: Number(supplyPrice),
        wholesalePrice: Number(wholesalePrice),
        store: 0,
        ...other
      }).then(() => {
        const msg = requestType === 'edit' ? '编辑成功' : '新增成功'
        this.$msgTip(msg)
        this.fetchData()
        this.dialogObj.isShow = false
      })
    },
    // 删除渠道
    deleteRule(params, msgTip = '删除成功') {
      this.$api.channel.deleteRule(params).then(() => {
        this.$msgTip(msgTip)
        this.fetchData()
      })
    },
    // 开启、关闭渠道规则
    handleRuleStatus({ id, status }) {
      this.$api.channel.handleRuleStatus({ id, status }).then(() => {
        const msg = status === 0 ? '已关闭' : '已开启'
        this.$msgTip(msg)
        this.fetchData()
      })
    },
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { dateTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.channel.getChannelRule({
        ...searchDate,
        ...other,
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
    }
  }
}
</script>
