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
      <el-form-item label="使用渠道:" prop="platformList">
        <query-dict
          :disabled="ticketType === 5 || ticketType === 6 || ticketType === 7"
          multiple
          :dict-list="lobList"
          class="select-item"
          placeholder="请选择"
          :value.sync="formModel.platformList"
          @change="changeChannel"
        ></query-dict>
      </el-form-item>
      <el-form-item label="卡券名称:" prop="couponName">
        <el-input
          :disabled="ticketType === 5 || ticketType === 6 || ticketType === 7"
          class="form-item"
          v-model.trim="formModel.couponName"
          :size="size"
          placeholder="请输入卡券名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="卡券类型:" prop="preferentialType">
        <el-radio-group
          v-model="formModel.preferentialType"
          @change="changeTicketType"
          :disabled="ticketType === 5 || ticketType === 6 || ticketType === 7"
        >
          <el-radio
            v-for="item in ticketTypeArr"
            :key="item.value"
            :label="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 卡券类型：现金券 订单满减开始 -->
      <template v-if="formModel.preferentialType === 5">
        <el-form-item
          label="订单满减:"
          v-for="(item, index) in formModel.marketPreferentialRules"
          :key="index"
        >
          <el-col :span="7">
            <el-form-item
              inline
              :prop="'marketPreferentialRules.' + index + '.preferentialLevel'"
              :rules="{
                  required: true, validator: checkNumber, trigger: 'blur'
                }"
            >
              <el-input
                :disabled="ticketType === 5 || ticketType === 6 || ticketType === 7"
                class="form-coupon"
                v-model.trim="item.preferentialLevel"
                :size="size"
                placeholder="输入订单金额，0为不限制"
                clearable
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="discount-type" :span="1">减</el-col>
          <el-col :span="7">
            <el-form-item
              :prop="'marketPreferentialRules.' + index + '.preferentialValue'"
              :rules="{
                  required: true, validator: checkNumber, trigger: 'blur'
                }"
            >
              <el-input
                :disabled="ticketType === 5 || ticketType === 6 || ticketType === 7"
                class="form-coupon"
                v-model.trim="item.preferentialValue"
                :size="size"
                placeholder="优惠的金额"
                clearable
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </template>
      <!-- 订单满减结束 -->
      <!-- 卡券类型：折扣券 订单满折开始 -->
      <template v-if="formModel.preferentialType === 1">
        <el-form-item
          label="订单满折:"
          v-for="(item, index) in formModel.marketPreferentialRules"
          :key="index"
        >
          <el-col :span="7">
            <el-form-item
              inline
              :prop="'marketPreferentialRules.' + index + '.preferentialLevel'"
              :rules="{
                  required: true, validator: checkInt, trigger: 'blur'
                }"
            >
              <el-input
                :disabled="ticketType === 5 || ticketType === 6 || ticketType === 7"
                class="form-coupon"
                v-model.trim="item.preferentialLevel"
                :size="size"
                placeholder="订单商品满的件数"
                clearable
              >
                <template slot="append">件</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="discount-type" :span="1">享</el-col>
          <el-col :span="7">
            <el-form-item
              :prop="'marketPreferentialRules.' + index + '.preferentialValue'"
              :rules="{
                  required: true, validator: checkDiscount, trigger: 'blur'
                }"
            >
              <el-input
                :disabled="ticketType === 5 || ticketType === 6 || ticketType === 7"
                class="form-coupon"
                v-model.trim="item.preferentialValue"
                :size="size"
                placeholder="输入1-10的数字，如8.5"
                clearable
              >
                <template slot="append">折</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </template>
      <!-- 订单满折结束 -->
      <el-form-item label="卡券有效期:" prop="limitExpireDayType">
        <el-radio-group
          v-model="formModel.limitExpireDayType"
          :disabled="ticketType === 5 || ticketType === 6 || ticketType === 7"
          @change="changeExpireType"
        >
          <el-radio
            v-for="item in ticketValidTypeArr"
            :key="item.value"
            :label="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
        <!-- 卡券有效期类型：指定日期 -->
        <el-form-item prop="limitExpireTime" v-if="formModel.limitExpireDayType === 1">
          <el-date-picker
            :disabled="ticketType === 5 ||  ticketType === 6 || ticketType === 7"
            :size="size"
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
        <!-- 卡券有效期类型：自领券N日内有效 -->
        <el-form-item
          prop="limitExpireDay"
          v-if="formModel.limitExpireDayType === 2"
          :rules="{
              required: true, validator: checkInt, trigger: 'blur'
            }"
        >
          <el-input
            :disabled="ticketType === 5 || ticketType === 6 || ticketType === 7"
            class="select-item"
            v-model.trim="formModel.limitExpireDay"
            :size="size"
            placeholder="请输入优惠券有效的天数"
            clearable
          >
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
      </el-form-item>
      <!-- 订单满折结束 -->
      <el-form-item label="使用说明:">
        <el-input
          type="textarea"
          :rows="6"
          v-model.trim="formModel.couponRemark"
          :size="size"
          maxlength="300"
          show-word-limit
          placeholder="请输入使用说明"
          clearable
        />
      </el-form-item>
      <el-form-item label="适用商品:">
        <el-radio-group
          v-model="formModel.fitGoodsType"
          :disabled="(ticketType === 5 || ticketType === 6 || ticketType === 7) || !formModel.platformList.length"
        >
          <el-radio
            v-for="item in fitGoodsTypeArr"
            :key="item.value"
            :label="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
        <!-- 指定商品开始 -->
        <goodsSelect
          ref="goodsSelectRef"
          v-if="formModel.fitGoodsType === 1"
          :paramsObj="goodsParamsObj"
          :initChecked="formModel.selectedGoodsList"
        />
        <!-- 指定商品结束 -->
      </el-form-item>
      <el-form-item class="form-btn">
        <el-button
          :size="size"
          :loading="btnLoading"
          type="primary"
          @click.native.prevent="submitHandle"
        >保存</el-button>
        <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </c-view>
</template>

<script>
import dictObj from '@/store/dictData'
import mixinTable from 'mixins/table'
import MixinForm from 'mixins/form'
import utils from 'utils'
import goodsSelect from '../../../common/goodsSelect'
export default {
  name: 'ticketInfo',
  mixins: [MixinForm, mixinTable],
  components: {
    goodsSelect
  },
  data() {
    const checkDiscount = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入1-10的数字'))
      if (!Number(value) || Number(value) < 1 || Number(value) > 10) return callback(new Error('请输入1-10的数字'))
      callback()
    }
    return {
      size: 'default',
      goodsParamsObj: {},
      ticketValidTypeArr: dictObj.ticketValidTypeArr,
      checkDiscount, // 验证折扣
      ticketType: undefined, // 卡券状态 编辑使用
      fitGoodsTypeArr: [
        {
          label: '所有商品',
          value: 0
        },
        {
          label: '指定商品',
          value: 1
        }
      ],
      pickerOptions: utils.pickerOptions,
      ticketTypeArr: dictObj.ticketTypeList,
      btnLoading: false,
      rules: {
        platformList: [{ required: true, message: '请选择渠道' }],
        couponName: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
        limitExpireTime: [
          { required: true, message: '请选择卡券有效期', trigger: 'blur' }
        ]
      },
      formModel: {
        fitGoodsType: 0, // 适用商品 默认全部
        couponRuleType: 0, // 卡券类型 0为券 目前写死
        platformList: [], // 使用渠道
        preferentialType: 5, // 卡券类型 默认现金券
        limitExpireDayType: 2, // 卡券有效期 默认当月有效 0 无时间限制 1 固定时间 2 领取时间 3领取时间当月
        marketPreferentialRules: [{
          preferentialLevel: '', // 优惠门槛
          preferentialType: 5, // 优惠类型
          preferentialValue: '' // 优惠值
        }]
      },
      lobList: dictObj.lobList // 业务线集合
    }
  },

  created() {
    const { params } = this.$route
    if (params.id) {
      this.fetchData(params.id)
    }
  },
  methods: {
    changeChannel(val) {
      this.goodsParamsObj = {
        appCode: val.join(',')
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
      this.formModel.marketPreferentialRules = []
      let obj = {
        preferentialLevel: '', // 优惠门槛
        preferentialType: val, // 优惠类型
        preferentialValue: '' // 优惠值
      }
      this.formModel.marketPreferentialRules.push(obj)
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
          marketPreferentialRules,
          limitExpireTimeStart,
          limitExpireTimeEnd,
          limitExpireDay,
          couponRemark,
          status,
          marketUseProductRule
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
        Object.assign(this.goodsParamsObj, { appCode: platformList.join(',') })
        if (preferentialType === 5 || preferentialType === 1) { // 卡券类型 【现金券、折扣券】
          const couponRules = marketPreferentialRules && marketPreferentialRules.map((item) => {
            const { cached, ...rules } = item
            return { ...rules }
          })
          Object.assign(params, { marketPreferentialRules: couponRules })
        }
        if (limitExpireDayType === 1) {
          const limitExpireTime = utils.handleDate(limitExpireTimeStart, limitExpireTimeEnd)
          Object.assign(params, { limitExpireTime })
        }
        limitExpireDayType === 2 && Object.assign(params, { limitExpireDay })
        let selectedGoodsList = [] // 指定商品
        if (marketUseProductRule && marketUseProductRule.goods) {
          selectedGoodsList.push(marketUseProductRule.goods.map((item) => ({ ...item, isSelected: true })))
        }
        if (marketUseProductRule && marketUseProductRule.goodSkuList) {
          selectedGoodsList.push(marketUseProductRule.goodSkuList.map((item) => ({ ...item, isSelected: false, skuList: item.skus })))
        }
        Object.assign(params, { fitGoodsType: selectedGoodsList.length ? 1 : 0 })
        this.formModel = { ...params, selectedGoodsList: selectedGoodsList.flat() }
        console.log(this.formModel)
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
            marketPreferentialRules, // 优惠列表
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
          if (preferentialType === 5 || preferentialType === 1) { // 优惠券类型为现金券或折扣券， 优惠列表处理
            let ruleList = marketPreferentialRules.map((item) => {
              return {
                ...item,
                preferentialLevel: Number(item.preferentialLevel),
                preferentialValue: Number(item.preferentialValue),
                unit: item.preferentialType === 5 ? 5 : 1 // 金额 5 折扣 1
              }
            })
            Object.assign(params, { marketPreferentialRules: ruleList })
          }
          const selectedGoodsList = this.$refs.goodsSelectRef.checkedAttr
          if (fitGoodsType === 1 && selectedGoodsList.length) { // 是否有指定商品列表, 类型为指定商品 0所有 1指定
            let goodsList = []; let skuList = []
            selectedGoodsList.forEach((item) => {
              if (item.isSelected) { // 商品
                goodsList.push(item.goodsBn)
              } else {
                skuList.push(item.skuList.map((item) => item.goodsSkuSn))
              }
            })
            Object.assign(params, {
              marketUseProductRule: {
                useProductCodes: goodsList,
                useProductSkuCodes: skuList.flat()
              }
            })
          }
          if (couponId) Object.assign(params, { couponId }) // 编辑操作 添加id字段
          const reqFun = couponId ? requestMethods['edit'] : requestMethods['add']
          reqFun(params).then(() => {
            this.$msgTip('操作成功')
            this.closeCurrentTag()
            this.goBack()
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
.form {
  background-color: @white;
  padding: 15px 60px 15px 15px;

  .form-item {
    width: 50%;
  }
  .select-item {
    width: 29%;
  }
  .discount-type {
    text-align: center;
  }
  .form-coupon {
    width: 100%;
  }
}
</style>
