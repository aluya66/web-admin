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
        <el-form-item label="领取方式:" prop="issueType">
          <el-radio-group v-model="formModel.issueType" @change="changeTicketType">
            <el-radio
              v-for="item in issueTypeList"
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
          <el-button size="medium" @click="showDialog">添加卡券</el-button>
          <div class="coupon-wrapper">
            <div class="coupon-item" v-for="(item, index) in selectedCouponList" :key="index">
              <div class="top-wrapper">
                <div class="left">{{ item.couponName }}</div>
                <div class="right">{{ item.couponName }}</div>
              </div>
              <div class="bottom-wrapper">{{ item.created }}</div>
            </div>
          </div>
        </el-form-item>
        <!-- 系统领券 -->
        <el-form-item label="发券时间:" prop="limitReceiveTimeType" v-if="formModel.issueType === 1">
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
        <el-form-item label="每人可领:" prop="receiveType" v-if="formModel.issueType === 2">
          <el-radio-group v-model="formModel.receiveType">
            <el-radio
              v-for="item in receiveTypeList"
              :key="item.value"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>
          <!-- 发券时间类型：每月 -->
          <el-form-item prop="limitReceiveTimeValues">
            <el-input
              class="inp-item"
              v-model.trim="formModel.value"
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
        <coupon-add ref="childRef"></coupon-add>
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
import CouponAdd from './add'
export default {
  name: 'ruleInfo',
  mixins: [MixinForm, mixinTable],
  components: {
    CCard,
    GoodsSelect,
    CDialog,
    CouponAdd
  },
  data() {
    const checkDiscount = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入1-10的数字'))
      if (!Number(value) || Number(value) < 1 || Number(value) > 10) return callback(new Error('请输入1-10的数字'))
      callback()
    }
    return {
      dialogObj: {},
      checkDiscount, // 验证折扣
      ticketType: undefined, // 卡券状态 编辑使用
      issueTypeList: [ // 领券方式
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
      receiveTypeList: [
        {
          label: '总计可领',
          value: 0
        },
        {
          label: '每月可领',
          value: 1
        },
        {
          label: '每周可领',
          value: 2
        },
        {
          label: '每天可领',
          value: 3
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
        platformList: 'yssp',
        limitReceiveTimeValues: []
      },
      lobList: dictObj.lobList, // 业务线集合
      selectedCouponList: [] // 已选择的优惠券
    }
  },

  created() {
    const { params } = this.$route
    if (params.id) {
      this.fetchData(params.id)
    }
  },
  methods: {
    dialogConfirm() {
      this.selectedCouponList = this.$refs.childRef.selectedCouponList
      this.dialogObj.isShow = false
      console.log(this.selectedCouponList)
    },
    showDialog() {
      this.dialogObj = {
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
}
.coupon-wrapper {
  .coupon-item {
    margin: 30px; 
    width: 300px;
    .top-wrapper {
      display: flex;
      text-align: center;
      border-bottom: 1px solid white;
      .left, .right {
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
}
</style>
