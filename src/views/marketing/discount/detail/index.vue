<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <div class="form">
      <g-basic
        :data-obj.sync="formModel"
        :is-view="isView"
        :is-disabled="isDisabled"
        @ChangeChannel="changeChannel"
        ref="basicRef"
        title="基础信息"
      ></g-basic>
      <g-rule
        :data-obj.sync="formModel"
        :is-view="isView"
        :is-disabled="isDisabled"
        ref="ruleRef"
        title="规则设置(以下信息至少完善一项)"
        @show-dialog="showDialog"
      ></g-rule>
      <g-apply
        :is-view="isView"
        :is-disabled="isDisabled"
        :data-obj.sync="formModel"
        ref="applyRef"
        title="申请信息"
      ></g-apply>
      <div class="btn-wrapper">
        <el-button
          :size="size"
          :loading="btnLoading"
          type="primary"
          @click.native.prevent="submitHandle"
        >保存</el-button>
        <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
      </div>
    </div>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        width="80%"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <customer-select
          ref="childRef"
          v-if="dialogObj.type === 'customer'"
          :paramsObj="goodsTableParamsObj"
          :initChecked="formModel.selectedCustomerList"
        ></customer-select>
        <goods-select
          v-if="dialogObj.type === 'goods'"
          ref="childRef"
          expand
          :paramsObj="goodsTableParamsObj"
          :initChecked="formModel.selectedGoodsList"
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
// import utils from 'utils'

export default {
  name: 'discountDetail',
  mixins: [MixinForm, mixinTable],
  data() {
    return {
      memberList: [],
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
      formModel: {
        shopType: '', // 门店类型
        selectedGoodsList: [], // 指定商品
        selectedCustomerList: [], // 指定用户
        memberType: [],
        customerType: 1,
        platformList: '',
        marketPreferentialRules: [],
        activateMonths: [],
        activateDays: [],
        activateDate: '',
        marketUseProductRule: {
          useCategoryCodes: [],
          useBrandCodes: []
        },
        storeCodes: [],
        applicants: '',
        applyingDepartment: '',
        remark: ''
      },
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
    getMember(val = '') {
      this.$api.member.getMember({
        pageNo: 1,
        pageSize: 100,
        appCode: this.goodsTableParamsObj.appCode,
        name: val
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data } = res
          this.memberList = data || []
        } else {
          this.memberList = res || []
        }
      })
    },
    // 获取商品选择参数字段
    getGoodsParams() {
      const { platformList } = this.$refs.basicRef.formModel
      const {
        storeCodes, // 门店
        marketUseProductRule // 规则设置
      } = this.$refs.ruleRef.formModel
      const { useBrandCodes, useCategoryCodes } = marketUseProductRule // 品牌、分类
      let categoryCodes = []
      if (useCategoryCodes && useCategoryCodes.length) {
        categoryCodes = useCategoryCodes.map((item) => {
          return item[2] // 只传第三级
        })
      }
      this.goodsTableParamsObj = { appCode: platformList, storeCodes, brandCodes: useBrandCodes, categoryCodes }
    },
    // 更改渠道 同步店铺、商品list数据
    changeChannel(appCode) {
      this.$refs.ruleRef.getShopList(appCode)
      this.getGoodsParams()
      this.getMember()
    },
    // 获取详情
    fetchData() {
      const { params } = this.$route
      if (params.id) {
        this.$api.marketing.getGoodsActivityDetail({ activityId: params.id }).then(res => {
          this.setTagsViewTitle()
          if (res) {
            res.platformList = res.platformList[0] // 处理渠道单选 接口返回list后处理为字符串
            res.storeCodes = res.storeCodes && res.storeCodes.map((item) => Number(item))
            this.$refs.ruleRef.getShopList(res.platformList)
            if (res.activityTime && res.activityEndTime) {
              res.activateDate = [res.activityTime, res.activityEndTime]
            }
            if (!res.activateMonths && !res.activateDays) { // 初始化月份、天数
              res.activateMonths = []
              res.activateDays = []
            }
            // 处理分类code [["02", "0202", "020200"]]
            if (res.marketUseProductRule) {
              if (res.marketUseProductRule.useCategoryCodes && res.marketUseProductRule.useAllCategoryCodes) {
                res.marketUseProductRule.useCategoryCodes = res.marketUseProductRule.useAllCategoryCodes
              }
            } else {
              res.marketUseProductRule = {}
              res.marketUseProductRule.useBrandCodes = []
              res.marketUseProductRule.useCategoryCodes = []
            }
            let customerType = '' // 指定用户类型
            let memberType = [] // 会员类型
            if (res.marketLimitUser && res.marketLimitUser.userLimitTypes && res.marketLimitUser.userLimitTypes.length) {
              res.marketLimitUser.userLimitTypes.forEach((item) => {
                switch (item) {
                  case 1:
                  case 2:
                  case 8:
                  case 16:
                    customerType = item
                    break
                  case 4:
                    memberType = res.marketLimitUser.userLeveIds ? res.marketLimitUser.userLeveIds : []
                    break
                }
              })
            }
            if (res.marketLimitUser && res.marketLimitUser.members && res.marketLimitUser.members.length) {
              Object.assign(res, { selectedCustomerList: res.marketLimitUser.members })
            }
            let selectedGoodsList = [] // 指定商品
            if (res.marketUseProductRule && res.marketUseProductRule.goods) {
              selectedGoodsList.push(res.marketUseProductRule.goods.map((item) => ({ ...item, isSelected: true })))
            }
            if (res.marketUseProductRule && res.marketUseProductRule.goodSkuList) {
              selectedGoodsList.push(res.marketUseProductRule.goodSkuList.map((item) => ({ ...item, isSelected: false, skuList: item.skus })))
            }
            this.formModel = { ...res, memberType, customerType, selectedGoodsList: selectedGoodsList.flat(), shopType: 2 }
            console.log(this.formModel)
            this.goodsTableParamsObj = { appCode: this.formModel.platformList }
          } else {
            this.$msgTip('接口数据异常，请稍后重新尝试', 'warning')
          }
        })
      }
    },
    dialogConfirm() {
      const type = this.dialogObj.type
      const selectedArr = this.$refs.childRef.checkedAttr
      if (type === 'goods') { // 商品
        this.formModel.selectedGoodsList = selectedArr
        // this.formModel.selectedGoodsList = JSON.parse(JSON.stringify(selectedArr))
        // utils.Event.$emit('updateGoodsList', selectedArr)
      } else { // 用户
        // 选择用户
        this.formModel.selectedCustomerList = selectedArr
        // this.formModel.selectedCustomerList = JSON.parse(JSON.stringify(selectedArr))
        // utils.Event.$emit('updateCustomerList', selectedArr)
      }
      this.formModel = JSON.parse(JSON.stringify(this.formModel))
      this.dialogObj.isShow = false
    },
    showDialog(type, title) {
      if (type === 'goods') this.getGoodsParams()
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
            storeCodes, // 门店
            customerType, // 用户类型
            memberType, // 指定的会员
            selectedCustomerList, // 指定用户
            selectedGoodsList, // 选择的商品
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
          if (selectedGoodsList && selectedGoodsList.length) { // 是否有指定商品列表
            let goodsList = []; let skuList = []
            selectedGoodsList.forEach((item) => {
              if (item.isSelected) { // 商品
                goodsList.push(item.goodsBn)
              } else {
                skuList.push(item.skuList.map((item) => item.goodsSkuSn))
              }
            })
            marketUseProductRule.useProductCodes = goodsList
            marketUseProductRule.useProductSkuCodes = skuList.flat()
          }
          let userLeveIds = [] // 发券对象 指定会员等级 memberType中type===4
          let userLimitTypes = [customerType] // 发券对象， 单选的用户类型
          // const customerTypeList = this.$refs.ruleRef.customerTypeList // 用户类型
          memberType && memberType.forEach((item) => {
            userLeveIds.push(item) // 指定会员
            userLimitTypes.push(4)
            // 有指定用户 添加指定用户类型  1 全部用户 2 全部会员 4 会员等级 8 非会员 16指定用户
            // const target = customerTypeList.find((val) => val.id === item)
            // if (item === 'allCustomer' || item === 'allMember' || item === 'notMember') {
            //   userLimitTypes.push(target.type)
            // } else {
            //   userLeveIds.push(target.id)
            //   userLimitTypes.push(4)
            // }
          })
          // 发券对象, 会员等级type有重复，过滤
          userLimitTypes = Array.from(new Set(userLimitTypes))
          let userIds = [] // 指定用户
          if (selectedCustomerList && selectedCustomerList.length) {
            userIds = selectedCustomerList.map((item) => item.userId)
            // 有指定用户 添加指定用户类型  1 全部用户 2 全部会员 4 会员等级 8 非会员 16指定用户
            // userLimitTypes.push(16)
          }
          // 处理领券对象、指定用户数据
          let marketLimitUser = {
            userLimitTypes, // 可领券会员列表
            userLeveIds, // 指定领券对象 （会员）
            userIds // 指定用户
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
            marketUseProductRule, // 规则设置
            storeCodes, // 门店
            marketLimitUser // 用户类型
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
            this.closeCurrentTag()
            this.goBack()
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
}
.btn-wrapper {
  margin-left: 140px;
}
</style>
