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
      <c-card name="优惠券信息" class="form-card">
        <el-form-item label="使用渠道:" prop="platforms">
          <query-dict
            multiple
            :dict-list="lobList"
            class="search-item"
            placeholder="请选择"
            :value.sync="formModel.platforms"
          ></query-dict>
        </el-form-item>
        <el-form-item label="卡券名称:">
          <el-input
            class="select-item"
            v-model.trim="formModel.couponName"
            size="medium"
            placeholder="请输入卡券名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="卡券类型:" prop="preferentialType">
          <el-radio-group v-model="formModel.preferentialType">
            <el-radio
              v-for="item in ticketTypeArr"
              :key="item.value"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 卡券类型：现金券 订单满减开始 -->
        <el-form-item label="订单满减:" v-show="formModel.preferentialType === 0">
          <el-input
            class="discount-item"
            v-model.trim="formModel.couponName"
            size="medium"
            placeholder="输入订单金额，0为不限制"
            clearable
          >
            <template slot="append">元</template>
          </el-input>
          <span class="discount-minus">减</span>
          <el-input
            class="discount-item"
            v-model.trim="formModel.couponName"
            size="medium"
            placeholder="优惠的金额"
            clearable
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <!-- 订单满减结束 -->

        <!-- 卡券类型：折扣券 订单满折开始 -->
        <el-form-item label="订单满折:" v-show="formModel.preferentialType === 1">
          <el-input
            class="discount-item"
            v-model.trim="formModel.couponName"
            size="medium"
            placeholder="订单商品满的件数"
            clearable
          >
            <template slot="append">件</template>
          </el-input>
          <span class="discount-minus">享</span>
          <el-input
            class="discount-item"
            v-model.trim="formModel.couponName"
            size="medium"
            placeholder="输入1-10的数字，如8.5"
            clearable
          >
            <template slot="append">折</template>
          </el-input>
        </el-form-item>
        <!-- 订单满折结束 -->

        <el-form-item label="卡券有效期:" prop="limitExpireDayType">
          <el-radio-group v-model="formModel.limitExpireDayType">
            <el-radio
              v-for="item in ticketValidTypeArr"
              :key="item.value"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>
          <!-- 卡券有效期类型：指定日期 -->
          <el-form-item prop="limitExpireTime" v-show="formModel.limitExpireDayType === 0">
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

          <!-- 卡券有效期类型：自领券N日内有效 -->
          <el-form-item prop="limitExpireDay" v-show="formModel.limitExpireDayType === 1">
            <el-input
              class="discount-item"
              v-model.trim="formModel.limitExpireDay"
              size="medium"
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
            size="medium"
            maxlength="300"
            show-word-limit
            placeholder="请输入使用说明"
            clearable
          />
        </el-form-item>
        <el-form-item label="适用商品:">
          <el-radio-group v-model="formModel.fitGoodsType">
            <el-radio
              v-for="item in fitGoodsTypeArr"
              :key="item.value"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>

          <!-- 指定商品开始 -->
          <goodsSelect :sourceList="sourceList" v-show="formModel.fitGoodsType === 1"/>
          <!-- 指定商品结束 -->
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button :loading="btnLoading" type="primary" @click.native.prevent="submitHandle">提交</el-button>
        </el-form-item>
      </c-card>
    </el-form>
  </c-view>
</template>

<script>
import dictObj from '@/store/dictData'
import MixinForm from 'mixins/form'
import CCard from 'components/card'
import utils from 'utils'
import goodsSelect from '../../../common/goodsSelect'
export default {
  name: 'ticketInfo',
  mixins: [MixinForm],
  components: {
    CCard,
    goodsSelect
  },
  data() {
    return {
      sourceList: [
        {
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        },
        {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        },
        {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        },
        {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }
      ],
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
      ticketValidTypeArr: [
        {
          label: '指定日期',
          value: 0
        },
        {
          label: '自领券N日内有效',
          value: 1
        },
        {
          label: '自领券日当月有效',
          value: 2
        }
      ],
      ticketTypeArr: [
        {
          label: '现金券',
          value: 0
        },
        {
          label: '折扣券',
          value: 1
        },
        // {
        //   label: '积分',
        //   value: 2
        // },
        {
          label: '兑换券',
          value: 3
        }
      ],
      btnLoading: false,
      rules: {
        platforms: [{ required: true, message: '请选择渠道', trigger: 'blur' }],
        limitReceive: [
          { required: true, message: '人均限领不能为空', trigger: 'blur' }
        ],
        categoryType: [
          { required: true, message: '请选择品类', trigger: 'change' }
        ],
        repeatUse: [
          { required: true, message: '请选择重复规则', trigger: 'change' }
        ],
        preferentialType: [
          { required: true, message: '请选择优惠规则', trigger: 'change' }
        ]
      },
      formModel: {},
      lobList: dictObj.lobList // 业务线集合
    }
  },

  created() {
    // const { params, name } = this.$route
    // if (params.id) {
    //   this.fetchData(params.id)
    // }
  },
  methods: {
    fetchData(couponRuleId) {
      this.$api.marketing.getCouponRuleDetail({ couponRuleId }).then(res => {
        this.setTagsViewTitle()
        const {
          pointLimit,
          repeatUse,
          useCode,
          userLevel,
          returnRules,
          marketPreferentialRules,
          ...other
        } = res
        let returnRule = []
        if (returnRules && returnRules.length) {
          returnRule =
            returnRules.length > 1
              ? returnRules
              : returnRules[0] <= 2
                ? [returnRules[0]]
                : ['', returnRules[0]]
        }
        this.formModel = {
          ...this.formModel,
          pointLimit: Boolean(pointLimit),
          repeatUse: Boolean(repeatUse),
          useCode: Boolean(useCode),
          userLevel: Boolean(userLevel),
          returnRule,
          couponPreferentialRules:
            marketPreferentialRules && marketPreferentialRules.length
              ? marketPreferentialRules.map(res => ({
                preferentialLevel: res.preferentialLevel,
                preferentialValue: res.preferentialValue
              }))
              : [],
          ...other
        }
      })
    },
    submitHandle() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const {
            pointLimit,
            repeatUse,
            useCode,
            userLevel,
            ...other
          } = this.formModel
          const curForm = Object.assign(
            {},
            {
              pointLimit: Number(pointLimit),
              repeatUse: Number(repeatUse),
              useCode: Number(useCode),
              userLevel: Number(userLevel),
              ...other
            }
          )
          if (this.$route.params.id) {
            this.updateHandle(curForm)
          } else {
            this.addHandle(curForm)
          }
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
  .discount-item {
    width: 300px;
  }
  .discount-minus {
    padding: 0 15px;
  }
  .input-select {
    width: 80px;
  }
}
</style>
