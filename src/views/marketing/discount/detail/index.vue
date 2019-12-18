<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <g-basic
      v-if="Object.keys(formModel).length"
      :is-view="isView"
      :is-disabled="isDisabled"
      :data-obj="formModel"
      @ChangeChannel="changeChannel"
      ref="basicRef"
      title="基础信息"
    ></g-basic>
    <g-rule
      v-if="Object.keys(formModel).length"
      :is-view="isView"
      :is-disabled="isDisabled"
      :data-obj="formModel"
      ref="ruleRef"
      title="规则设置(以下信息至少完善一项)"
      @show-dialog="showDialog"
    ></g-rule>
    <g-apply
      v-if="Object.keys(formModel).length"
      :is-view="isView"
      :is-disabled="isDisabled"
      :data-obj="formModel"
      ref="applyRef"
      title="申请信息"
    ></g-apply>
    <div class="btn-wrapper">
      <el-button :loading="btnLoading" type="primary" @click.native.prevent="submitHandle">保存</el-button>
    </div>

    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        width="80%"
        close-btn
        @before-close="closeDialog"
        @on-submit="dialogConfirm"
      >
        <customer-select
          v-if="dialogObj.type === 'customer'"
          ref="childRef"
          :initChecked="formModel.selectedCustomerList"
          :sourceList="customerList"
        />
        <goods-select
          v-if="dialogObj.type === 'goods'"
          ref="childRef"
          :paramsObj="goodsTableParamsObj"
          :initChecked="goodsList"
        />
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
import mixinTable from 'mixins/table'
import GBasic from './basic'
import GRule from './rule'
import GApply from './apply'
import customerSelect from '../../../common/customerSelect'
import goodsSelect from '../../../common/goodsSelect'
import CDialog from 'components/dialog'

export default {
  name: 'discountDetail',
  mixins: [MixinForm, mixinTable],
  data() {
    return {
      skuTableHeader: [
        {
          label: '编号',
          prop: 'goodsSkuSn'
        },
        {
          label: '图片',
          isImage: true,
          width: 100,
          prop: 'imageUrl'
        },
        {
          label: '零售价',
          prop: 'retailPrice'
        },
        {
          label: '会员价',
          prop: 'memberPrice'
        },
        {
          label: '散批价',
          prop: 'wholesalePrice'
        },
        {
          label: '大批价',
          prop: 'largeBatchPrice'
        }
      ],
      goodsList: [],
      isDisabled: false,
      isView: true,
      btnLoading: false,
      formModel: {},
      dialogObj: {},
      goodsTableParamsObj: {
        appCode: 'yssp'
      } // 弹窗 商品列表额外参数
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 更改渠道 同步店铺、商品list数据
    changeChannel(appCode) {
      this.$refs.ruleRef.getShopList(appCode)
      this.goodsTableParamsObj = { appCode }
    },
    // 获取详情
    fetchData() {
      const { params } = this.$route
      if (params.id) {
        this.$api.marketing.getGoodsActivityDetail({ activityId: params.id }).then(res => {
          this.setTagsViewTitle()
          if (res) {
            res.platformList = res.platformList[0] // 处理渠道单选 接口返回list后处理为字符串
            if (res.activityTime && res.activityEndTime) {
              res.activateDate = [res.activityTime, res.activityEndTime]
            }
            if (!res.activateMonths && !res.activateDays) { // 初始化月份、天数
              res.activateMonths = []
              res.activateDays = []
            }
            // 处理分类code [["02", "0202", "020200"]]
            if (res.marketUseProductRule.useCategoryCodes && res.marketUseProductRule.useAllCategoryCodes) {
              res.marketUseProductRule.useCategoryCodes = res.marketUseProductRule.useAllCategoryCodes
            }
            this.formModel = res
          } else {
            this.$msgTip('接口数据异常，请稍后重新尝试', 'warning')
          }
        })
      } else {
        this.formModel = {
          platformList: 'yssp',
          marketPreferentialRules: [],
          activateMonths: [],
          activateDays: [],
          activateDate: '',
          useBrandCodes: [],
          marketUseProductRule: {
            useCategoryCodes: [],
            useBrandCodes: []
          },
          marketUseStoreRuleLists: {
            storeCodes: []
          },
          selectedCustomerList: [],
          applicants: '',
          applyingDepartment: '',
          remark: ''
        }
      }
    },
    dialogConfirm() {
      const type = this.dialogObj.type
      if (type === 'goods') { // 商品
        this.dialogObj.isShow = false
      } else { // 用户
        const checkedTagsList = this.$refs.childRef.checkedAttr
        this.selectedCustomerList = checkedTagsList
        this.dialogObj.isShow = false
        this.$set(this.formModel, 'selectedCustomerList', JSON.parse(JSON.stringify(this.selectedCustomerList)))
      }
    },
    showDialog(type, title) {
      this.dialogObj = {
        type,
        isShow: true,
        title
      }
    },
    submitHandle() {
      const basicForm = this.$refs.basicRef.$refs.basicFormRef
      const ruleForm = this.$refs.ruleRef.$refs.ruleFormRef
      const applyForm = this.$refs.applyRef.$refs.applyFormRef
      Promise.all([basicForm, ruleForm, applyForm].map(this.getFormPromise)).then(res => {
        // 所有子表单是否校验通过
        const validateResult = res.every(item => !!item)
        if (validateResult) {
          let {
            activityName,
            activityType,
            platformList,
            activateDate, // 固定时间段
            activateMonths, // 月份
            activateDays, // 固定日期
            activateDayType, // 时间类型
            marketPreferentialRules // 折扣门槛列表
          } = this.$refs.basicRef.formModel
          let {
            marketUseProductRule // 规则设置
          } = this.$refs.ruleRef.formModel
          let {
            applicants, // 申请人
            applyingDepartment, // 部门
            remark // 备注
          } = this.$refs.applyRef.formModel
          // 设置折扣门槛 单位
          let ruleUnit
          switch (activityType) {
            case 1:
              ruleUnit = 1
              break
            case 2:
              ruleUnit = 4
              break
            case 3:
              ruleUnit = 2
              break
          }
          marketPreferentialRules = marketPreferentialRules.map((item) => {
            return {
              ...item,
              unit: ruleUnit
            }
          })
          if (marketUseProductRule.useCategoryCodes && marketUseProductRule.useCategoryCodes.length) {
            marketUseProductRule.useCategoryCodes = marketUseProductRule.useCategoryCodes.map((item) => {
              return item[2] // 只传第三级
            })
          }
          let params = { // 基础参数
            activityName, // 活动名称
            activateDayType, // 活动时间类型
            activityType, // 活动类型
            platformList: [platformList], // 渠道 目前单选、接口接收为list
            marketPreferentialRules, // 优惠门槛
            applicants, // 申请人
            applyingDepartment, // 部门
            remark, // 备注
            marketUseProductRule // 规则设置
          }
          if (activateDayType === 1) { // 指定时间
            if (activateDate) { // 固定日期
              const activityDateRange = this.getSearchDate(activateDate, 'dateTime', 'activityTime', 'activityEndTime')
              Object.assign(params, { ...activityDateRange })
            }
            if (activateMonths.length) Object.assign(params, { activateMonths }) // 月份
            if (activateDays.length) Object.assign(params, { activateDays }) // 日期
          }
          if (this.formModel.activityId) Object.assign(params, { activityId: this.formModel.activityId })
          const requestFun = {
            'add': this.$api.marketing.addGoodsActivity,
            'edit': this.$api.marketing.updateGoodsActivity
          }
          const requestMethod = this.formModel.activityId ? requestFun['edit'] : requestFun['add']
          requestMethod(params).then(() => {
            const msg = this.formModel.activityId ? '编辑成功' : '新增成功'
            this.$msgTip(msg)
            this.routerLink('/marketing/discount/list')
            this.closeCurrentTag()
          })
        } else {
          console.log('未校验通过')
        }
      })
    }
  },

  components: {
    GBasic,
    GRule,
    GApply,
    customerSelect,
    goodsSelect,
    CDialog
  }
}
</script>
<style lang='less' scoped>
.form {
  background-color: @white;
  padding: 15px 15px;
  .form-btn {
    margin-left: 20px;
    margin-top: 20px;
  }
}
.btn-wrapper {
  display: flex;
  justify-content: center;
}
</style>
