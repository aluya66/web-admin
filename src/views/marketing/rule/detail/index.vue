<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <c-card name="券规则信息" class="form-card">
        <el-form-item label="发券渠道:" prop="platformList">
          <query-dict
            disabled
            :dict-list="lobList"
            class="search-item"
            placeholder="请选择"
            :value.sync="formModel.platformList"
          ></query-dict>
        </el-form-item>
        <el-form-item label="领取方式:" prop="receiveType">
          <el-radio-group v-model="formModel.receiveType" @change="changeTicketType">
            <el-radio
              v-for="item in receiveTypeList"
              :key="item.value"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规则名称:" prop="couponName">
          <el-input
            class="select-item"
            v-model.trim="formModel.couponName"
            :size="size"
            placeholder="请输入规则名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="选择卡券:">
          <el-button size="medium" @click="showDialog('coupon')">添加卡券</el-button>
          <el-form-item
            class="coupon-item"
            v-for="(item, index) in formModel.couponDetails"
            :key="index"
          >
            <div class="coupon-box">
              <div class="top-wrapper">
                <div class="left">{{ item.info }}</div>
                <div class="right">{{ item.couponName }}</div>
              </div>
              <div class="bottom-wrapper">{{ item.created }}</div>
            </div>
            <el-form-item
              v-if="formModel.receiveType === 2"
              class="num-box"
              inline
              :prop="'couponDetails.' + index + '.couponNumber'"
              :rules="{
                required: true, validator: checkInt, trigger: 'blur'
              }"
            >
              <el-input
                v-model.trim="item.couponNumber"
                size="medium"
                placeholder="输入数字，留空则不限制"
                clearable
              ></el-input>
            </el-form-item>
          </el-form-item>
          <!-- <div class="coupon-wrapper">
            <div class="coupon-item" v-for="(item, index) in selectedCouponList" :key="index">
              <div class="coupon-box">
                <div class="top-wrapper">
                  <div class="left">{{ item.info }}</div>
                  <div class="right">{{ item.couponName }}</div>
                </div>
                <div class="bottom-wrapper">{{ item.created }}</div>
              </div>
              <div class="num-box">123</div>
            </div>
          </div>-->
        </el-form-item>
        <el-form-item :label="formModel.receiveType === 1 ? '发券对象:' : '领券对象:'" prop="memberType">
          <el-checkbox-group v-model="formModel.memberType">
            <el-checkbox
              class="checkbox-item"
              :label="item"
              v-for="(item, index) in memberTypeList"
              :key="index"
            >{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="指定用户:">
          <el-button size="medium" @click="showDialog('customer')">选择用户</el-button>
          <div>
            <el-tag
              class="tag-item"
              v-for="(tag, index) in selectedCustomerList"
              :key="index"
              closable
              @close="cancelSelect(index)"
            >{{tag.nickname + '【' +tag.phoneNumber + '】'}}</el-tag>
          </div>
        </el-form-item>
        <!-- 系统领券 -->
        <el-form-item label="发券时间" prop="limitReceiveTimeType" v-if="formModel.receiveType === 1">
          <el-radio-group v-model="formModel.limitReceiveTimeType">
            <el-radio
              v-for="item in limitReceiveTimeTypeList"
              :key="item.value"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>
          <!-- 发券时间类型：指定日期 -->
          <el-form-item prop="limitExpireTime" v-if="formModel.limitReceiveTimeType === 4">
            <el-date-picker
              size="medium"
              v-model="formModel.limitExpireTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              format="yyyy-MM-dd HH:mm:ss"
              end-placeholder="截止日期"
              :default-time="['00:00:00', '23:59:59']"
              align="right"
            ></el-date-picker>
          </el-form-item>

          <!-- 发券时间类型：每月 -->
          <el-form-item
            prop="limitReceiveTimeValues"
            v-if="formModel.limitReceiveTimeType === 2 || formModel.limitReceiveTimeType === 3"
          >
            <el-checkbox-group
              v-model="formModel.limitReceiveTimeValues"
              v-if="formModel.limitReceiveTimeType === 2"
            >
              <el-checkbox
                class="checkbox-item"
                :label="item"
                v-for="(item, index) in 31"
                :key="index"
              >{{ item + '号' }}</el-checkbox>
            </el-checkbox-group>

            <el-checkbox-group
              v-model="formModel.limitReceiveTimeValues"
              v-if="formModel.limitReceiveTimeType === 3"
            >
              <el-checkbox
                class="checkbox-item"
                :label="item"
                v-for="(item, index) in 7"
                :key="index"
              >{{ item !== 7 ? '周' + item : '周日' }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form-item>

        <!-- 手动领券 -->
        <el-form-item label="每人可领:" prop="receiveTimeType" v-if="formModel.receiveType === 2">
          <el-radio-group v-model="formModel.receiveTimeType">
            <el-radio
              v-for="item in receiveTimeTypeList"
              :key="item.value"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>
          <!-- 发券时间类型：每月 -->
          <el-form-item prop="limitReceive">
            <el-input
              class="inp-item"
              v-model.trim="formModel.limitReceive"
              size="medium"
              placeholder="请输入数字"
              clearable
            ></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button :loading="btnLoading" type="primary" @click.native.prevent="submitHandle">提交</el-button>
        </el-form-item>
      </c-card>
    </el-form>

    <!-- 选择优惠券 -->
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <coupon-add ref="childRef" v-if="dialogObj.type === 'coupon'"></coupon-add>
        <customer-select
          ref="childRef"
          v-if="dialogObj.type === 'customer'"
          :sourceList="memberList"
          :initChecked="selectedCustomerList"
        ></customer-select>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import dictObj from '@/store/dictData'
import mixinTable from 'mixins/table'
import MixinForm from 'mixins/form'
import CCard from 'components/card'
import CDialog from 'components/dialog'
import utils from 'utils'
import GoodsSelect from '../../../common/goodsSelect'
import CustomerSelect from '../../../common/customerSelect'
import CouponAdd from './add'
export default {
  name: 'ruleInfo',
  mixins: [MixinForm, mixinTable],
  components: {
    CCard,
    GoodsSelect,
    CDialog,
    CouponAdd,
    CustomerSelect
  },
  data() {
    const checkDiscount = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入1-10的数字'))
      if (!Number(value) || Number(value) < 1 || Number(value) > 10) return callback(new Error('请输入1-10的数字'))
      callback()
    }
    return {
      memberList: [], // 用户列表
      memberTypeList: [ // 1 全部用户 2 全部会员 3 会员等级 4 非会员
        {
          label: '全部用户',
          type: 1
        },
        {
          label: '全部会员',
          type: 2
        },
        {
          label: '非会员',
          type: 4
        }
      ],
      dialogObj: {},
      checkDiscount, // 验证折扣
      ticketType: undefined, // 卡券状态 编辑使用
      receiveTypeList: [ // 领券方式
        {
          label: '系统发券',
          value: 1
        },
        {
          label: '手动领券',
          value: 2
        }
      ],
      pickerOptions: utils.pickerOptions,
      limitReceiveTimeTypeList: [ // 发券时间类型
        {
          label: '立即发送',
          value: 1
        },
        {
          label: '每月',
          value: 2
        },
        {
          label: '每周',
          value: 3
        },
        {
          label: '指定日期',
          value: 4
        }
      ],
      receiveTimeTypeList: [
        {
          label: '总计可领',
          value: 32
        },
        {
          label: '每月可领',
          value: 2
        },
        {
          label: '每周可领',
          value: 3
        },
        {
          label: '每天可领',
          value: 4
        }
      ],
      btnLoading: false,
      rules: {
        platformList: [{ required: true, message: '请选择渠道' }],
        couponName: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
        limitExpireTime: [
          { required: true, message: '请选择卡券有效期', trigger: 'blur' }
        ]
      },
      formModel: {
        receiveType: 2,
        platformList: 'yssp',
        limitReceiveTimeValues: [],
        memberType: [],
        couponDetails: [] // 已选择的优惠券
      },
      lobList: dictObj.lobList, // 业务线集合
      selectedCustomerList: [], // 指定用户列表
    }
  },

  created() {
    const { params } = this.$route
    if (params.id) {
      this.fetchData(params.id)
    }
    this.getMemberType()
    this.getMember()
  },
  methods: {
    cancelSelect(index) {
      this.selectedCustomerList.splice(index, 1)
    },
    getMember() {
      // 发券渠道暂只能选择YOSHOP，其他平台后续业务再对接
      this.$api.member.getMember({
        pageNo: 1,
        pageSize: 100,
        appCode: 'yssp'
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
    getMemberType() {
      this.$api.member.getMemberListType().then(res => {
        const membertTypeArr = res && res.map(val => ({ label: val.name, value: val.id, type: 3 }))
        this.memberTypeList = this.memberTypeList.concat(membertTypeArr)
        console.log(this.memberTypeList)
      })
    },
    dialogConfirm() {
      if (this.dialogObj.type === 'coupon') {
        // 选择优惠券
        this.formModel.couponDetails = this.$refs.childRef.selectedCouponList
      } else {
        // 选择用户
        this.selectedCustomerList = this.$refs.childRef.checkedAttr
      }
      this.dialogObj.isShow = false
    },
    showDialog(type) {
      this.dialogObj = {
        type,
        isShow: true,
        title: '选择卡券'
      }
    },
    // 切换卡券有效期类型
    changeExpireType(val) {
      Reflect.deleteProperty(this.formModel, 'limitExpireTime')
      Reflect.deleteProperty(this.formModel, 'limitExpireDay')
    },
    // 切换卡券类型
    changeTicketType(val) {
      // 过滤兑换券类型
      if (val === 3) return
      this.formModel.couponPreferentialRules = []
      let obj = {
        preferentialLevel: undefined, // 优惠门槛
        preferentialType: val, // 优惠类型
        preferentialValue: undefined // 优惠值
      }
      this.formModel.couponPreferentialRules.push(obj)
    },
    fetchData(couponId) {
      this.$api.marketing.couponDetail({ couponId }).then(res => {
        this.setTagsViewTitle()
        const {
          platformList,
          couponRuleId,
          couponId,
          couponRuleType,
          couponName,
          limitExpireDayType,
          preferentialType,
          couponPreferentialRules,
          limitExpireTimeStart,
          limitExpireTimeEnd,
          limitExpireDay,
          couponRemark,
          status
        } = res
        this.ticketType = status // 编辑 缓存卡券状态
        let params = { // 基础字段
          platformList,
          couponRuleId,
          couponRuleType,
          couponId,
          couponName,
          limitExpireDayType,
          preferentialType,
          couponRemark,
          status
        }
        if (preferentialType === 0 || preferentialType === 1) { // 卡券类型 【现金券、折扣券】
          const couponRules = couponPreferentialRules.map((item) => {
            const { cached, ...rules } = item
            return { ...rules }
          })
          Object.assign(params, { couponPreferentialRules: couponRules })
        }
        if (limitExpireDayType === 1) {
          const limitExpireTime = utils.handleDate(limitExpireTimeStart, limitExpireTimeEnd)
          Object.assign(params, { limitExpireTime })
        }
        if (limitExpireDayType === 2) Object.assign(params, { limitExpireDay })
        this.formModel = params
      })
    },
    submitHandle() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const requestMethods = {
            'add': this.$api.marketing.addCoupon,
            'edit': this.$api.marketing.updateCoupon
          }
          const {
            fitGoodsType, // 商品类型 0全部 1指定商品
            couponId, // 优惠券id 编辑时存在
            couponPreferentialRules, // 优惠列表
            couponUseProductRule, // 指定商品列表
            limitExpireTime, // 有效期 固定时间
            preferentialType, // 优惠券类型
            limitExpireDayType, // 有效期类型
            ...other
          } = this.formModel
          const params = { // 基础参数
            limitExpireDayType,
            preferentialType,
            ...other
          }
          if (limitExpireDayType === 1) { // 固定时间处理
            const searchDate = this.getSearchDate(limitExpireTime, 'dateTime', 'limitExpireTimeStart', 'limitExpireTimeEnd')
            Object.assign(params, { ...searchDate })
          }
          if (preferentialType === 0 || preferentialType === 1) { // 优惠券类型为现金券或折扣券， 优惠列表处理
            let ruleList = couponPreferentialRules.map((item) => {
              return {
                ...item,
                preferentialLevel: Number(item.preferentialLevel),
                preferentialValue: Number(item.preferentialValue),
                unit: item.preferentialType === 0 ? 0 : 1 // 金额 0 折扣 1
              }
            })
            Object.assign(params, { couponPreferentialRules: ruleList })
          }
          if (couponId) Object.assign(params, { couponId }) // 编辑操作 添加id字段
          const reqFun = couponId ? requestMethods['edit'] : requestMethods['add']
          reqFun(params).then(() => {
            this.$msgTip('操作成功')
            this.routerLink('/marketing/ticket/list')
            this.closeCurrentTag()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.form-card {
  .select-item {
    width: 30%;
  }
  .inp-item {
    width: 150px;
  }
  .tag-item {
    margin: 5px;
  }
}
.coupon-item {
  display: flex;
  margin: 30px;
  .coupon-box {
    width: 300px;
    .top-wrapper {
      display: flex;
      text-align: center;
      border-bottom: 1px solid white;
      .left,
      .right {
        width: 50%;
        height: 30px;
        line-height: 30px;
        background-color: @light_gray;
      }
      .left {
        margin-right: 1px;
      }
    }
    .bottom-wrapper {
      height: 30px;
      text-align: center;
      line-height: 30px;
      background-color: @light_gray;
    }
  }
  .num-box {
  }
}
</style>
