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
      <el-form-item label="发券渠道:" prop="platformList">
        <query-dict
          disabled
          showType="radio"
          class="select-item"
          :dict-list="lobList"
          placeholder="请选择"
          :value.sync="formModel.platformList"
        ></query-dict>
      </el-form-item>
      <el-form-item label="领取方式:" prop="receiveType" v-if="formModel.platformList === 'yssp'">
        <el-radio-group v-model="formModel.receiveType" @change="changeReceiveType">
          <el-radio
            v-for="item in receiveTypeList"
            :key="item.value"
            :label="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="规则名称:" prop="couponName">
        <el-input
          class="form-item"
          v-model.trim="formModel.couponName"
          :size="size"
          placeholder="请输入规则名称"
          clearable
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="选择卡券:">
        <el-button size="small" @click="showDialog('coupon')">添加卡券</el-button>
        <el-form-item
          class="coupon-item"
          v-for="(item, index) in formModel.couponDetails"
          :key="index"
        >
          <div class="coupon-box">
            <div class="top-wrapper">
              <div class="left">{{ item.info }}</div>
              <div class="right">{{ item.couponRuleName }}</div>
            </div>
            <div class="bottom-wrapper">{{ item.created }}</div>
          </div>
          <el-form-item
            v-if="formModel.receiveType === 2 || formModel.platformList === 'ysgo'"
            label-width="80px"
            class="num-box"
            inline
            :label="formModel.platformList === 'ysgo' ? '导出数量' : ''"
            :prop="'couponDetails.' + index + '.couponNumber'"
            :rules="{
                validator: formModel.platformList === 'ysgo' ? checkInt : checkIntNoQuired, trigger: 'change'
              }"
          >
            <el-input
              type="number"
              v-model.trim="item.couponNumber"
              :size="size"
              placeholder="设置可领数量，留空则不限制"
              clearable
            ></el-input>
          </el-form-item>
        </el-form-item>
      </el-form-item>
      <el-form-item
        :label="formModel.receiveType === 1 ? '发券对象:' : '领券对象:'"
        prop="customerType"
        v-if="formModel.platformList === 'yssp'"
      >
        <el-radio-group v-model="formModel.customerType" v-if="formModel.receiveType === 1">
          <el-radio
            class="checkbox-item"
            :label="item.type"
            v-for="(item, index) in customerTypeList.slice(1,3)"
            :key="index"
          >{{ item.label }}</el-radio>
        </el-radio-group>
        <el-radio-group v-model="formModel.customerType" v-if="formModel.receiveType === 2">
          <el-radio
            class="checkbox-item"
            :label="item.type"
            v-for="(item, index) in customerTypeList"
            :key="index"
          >{{ item.label }}</el-radio>
        </el-radio-group>
        <el-form-item>
          <el-checkbox-group v-model="formModel.memberType" v-if="formModel.customerType === 4">
            <el-checkbox
              class="checkbox-item"
              :label="item.id"
              :checked="item.checked"
              v-for="(item, index) in memberTypeList"
              :key="index"
            >{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form-item>
      <el-form-item
        label="指定用户:"
        v-if="formModel.platformList === 'yssp' && formModel.customerType === 16"
      >
        <el-button size="small" @click="showDialog('customer')">选择用户</el-button>
        <div>
          <el-tag
            class="tag-item"
            v-for="(tag, index) in formModel.selectedCustomerList"
            :key="index"
            closable
            @close="cancelSelect(index)"
          >{{tag.nickname + '【' +tag.phoneNumber + '】'}}</el-tag>
        </div>
      </el-form-item>
      <!-- 系统领券 -->
      <el-form-item label="发券时间" prop="issueTimeType" v-if="formModel.receiveType === 1">
        <el-radio-group v-model="formModel.issueTimeType">
          <el-radio
            v-for="item in limitReceiveTimeTypeList"
            :key="item.value"
            :label="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
        <!-- 发券时间类型：指定日期 -->
        <el-form-item prop="issueTimeStart" v-if="formModel.issueTimeType === 32">
          <el-date-picker
            :size="size"
            v-model="formModel.issueTimeStart"
            type="datetime"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
          <!-- <el-date-picker
            :size="size"
            v-model="formModel.issueTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            format="yyyy-MM-dd HH:mm:ss"
            end-placeholder="截止日期"
            :default-time="['00:00:00', '23:59:59']"
            align="right"
          ></el-date-picker>-->
        </el-form-item>

        <!-- 发券时间类型：每月 -->
        <el-form-item
          prop="issueTimeValues"
          v-if="formModel.issueTimeType === 8 || formModel.issueTimeType === 16"
        >
          <el-checkbox-group
            v-model="formModel.issueTimeValues"
            v-if="formModel.issueTimeType === 16"
          >
            <el-checkbox
              class="checkbox-item"
              :label="item"
              v-for="(item, index) in 31"
              :key="index"
            >{{ item + '号' }}</el-checkbox>
          </el-checkbox-group>

          <el-checkbox-group
            v-model="formModel.issueTimeValues"
            v-if="formModel.issueTimeType === 8"
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
      <el-form-item
        label="每人可领:"
        prop="receiveTimeType"
        v-if="formModel.receiveType === 2 && formModel.platformList === 'yssp'"
      >
        <el-radio-group v-model="formModel.receiveTimeType">
          <el-radio
            v-for="item in receiveTimeTypeList"
            :key="item.value"
            :label="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
        <!-- 每人可领类型：次数 -->
        <el-form-item
          prop="limitReceive"
          :rules="{
              validator: checkInt, trigger: 'blur'
            }"
        >
          <el-input
            class="inp-item"
            v-model.trim="formModel.limitReceive"
            :size="size"
            placeholder="请输入数字"
            clearable
          ></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item class="form-btn">
        <el-button
          :size="size"
          :loading="btnLoading"
          type="primary"
          @click.native.prevent="submitHandle"
        >提交</el-button>
        <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
      </el-form-item>
    </el-form>

    <!-- 选择优惠券 -->
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        width="80%"
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <coupon-add
          ref="childRef"
          v-if="dialogObj.type === 'coupon'"
          :platformList="this.formModel.platformList"
          :initChecked="formModel.couponDetails"
        ></coupon-add>
        <customer-select
          ref="childRef"
          v-if="dialogObj.type === 'customer'"
          :sourceList="memberList"
          :initChecked="formModel.selectedCustomerList"
        ></customer-select>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import dictObj from '@/store/dictData'
import mixinTable from 'mixins/table'
import MixinForm from 'mixins/form'
import CDialog from 'components/dialog'
import utils from 'utils'
import CustomerSelect from '../../../common/customerSelect'
import CouponAdd from './add'
export default {
  name: 'ruleInfo',
  mixins: [MixinForm, mixinTable],
  components: {
    CDialog,
    CouponAdd,
    CustomerSelect
  },
  data() {
    return {
      memberTypeList: [],
      size: 'defalut',
      memberList: [], // 用户列表
      customerTypeList: [ // 1 全部用户 2 全部会员 4 会员等级 8 非会员 16指定用户
        {
          label: '全部用户',
          type: 1
        },
        {
          label: '指定会员',
          type: 4
        },
        {
          label: '指定用户',
          type: 16
        },
        {
          label: '非会员',
          type: 8
        }
      ],
      dialogObj: {},
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
      pickerOptions: {
        ...utils.pickerOptions,
        selectableRange: `${utils.fomartDate(new Date(), '{h}:{i}:{s}')} - 23:59:59`,
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      limitReceiveTimeTypeList: [ // 发券时间类型
        {
          label: '立即发送',
          value: 1
        },
        {
          label: '每月',
          value: 16
        },
        {
          label: '每周',
          value: 3
        },
        {
          label: '指定日期',
          value: 32
        }
      ],
      receiveTimeTypeList: [ // 领取时间限制  32 总计 1 年 2 月 3 周 4 日 16 无限制
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
        issueTimeStart: '',
        receiveTimeType: 32, // 每人可领
        issueTimeType: 1, // 发券时间 类型
        selectedCustomerList: [], // 指定用户
        receiveType: 2,
        platformList: '',
        issueTimeValues: [],
        memberType: [], // 会员类型
        customerType: 1, // 用户类型
        couponDetails: [] // 已选择的优惠券
      },
      lobList: dictObj.lobList.slice(1, 3) // 业务线集合
    }
  },

  created() {
    const { id, type } = this.$route.params
    this.formModel.platformList = type
    id && this.fetchData(id)
    this.getMemberType()
  },
  methods: {
    changeReceiveType(val) {
      val === 1 ? this.formModel.customerType = 4 : this.formModel.customerType = 1
    },
    cancelSelect(index) {
      this.formModel.selectedCustomerList.splice(index, 1)
      this.$forceUpdate()
    },
    // 拼接会员等级到会员分类列表 类型有 1 全部用户 2 全部会员 4 会员等级 8 非会员 16指定用户
    // 类型4为接口请求获得， 16为指定用户选中后保存时候添加
    getMemberType() {
      this.$api.member.getMemberListType().then(res => {
        const membertTypeArr = res && res.map(val => ({ label: val.name, id: val.id, type: 4 }))
        this.memberTypeList = this.memberTypeList.concat(membertTypeArr)
      })
    },
    dialogConfirm() {
      if (this.dialogObj.type === 'coupon') {
        // 选择优惠券
        if (this.formModel.platformList === 'ysgo' && this.$refs.childRef.selectedCouponList.length !== 1) {
          return this.$msgTip('选择一张卡券', 'warning')
        }
        this.formModel.couponDetails = this.$refs.childRef.selectedCouponList
      } else {
        // 选择用户
        this.formModel.selectedCustomerList = this.$refs.childRef.checkedAttr
      }
      this.dialogObj.isShow = false
    },
    showDialog(type) {
      this.dialogObj = {
        type,
        isShow: true,
        title: type === 'coupon' ? '选择卡券' : '选择用户'
      }
    },
    fetchData(couponId) {
      this.$api.marketing.getCouponRuleDetail({ couponId }).then(res => {
        this.setTagsViewTitle()
        let {
          platformList,
          couponId,
          couponName,
          issueTimeType,
          issueTimeValues,
          limitReceive,
          receiveTimeType,
          receiveType,
          couponDetails,
          issueTimeStart,
          // issueTimeStart,
          // issueTimeEnd,
          marketLimitUser
        } = res
        couponDetails = couponDetails ? couponDetails.map((item) => {
          let info = ''
          if (item.marketPreferentialRules && item.marketPreferentialRules.length) {
            const target = item.marketPreferentialRules[0]
            // 5现金券、1折扣券
            switch (target.preferentialType) {
              case 5:
                info = `${target.preferentialLevel}元减${target.preferentialValue}元`
                break
              case 1:
                info = `${target.preferentialLevel}件享${target.preferentialValue}折`
                break
              default:
                break
            }
            return {
              ...item,
              ...target,
              info
            }
          }
          return {
            ...item,
            info
          }
        }) : []
        let customerType = '' // 指定用户类型
        let memberType = []
        if (marketLimitUser && marketLimitUser.userLimitTypes && marketLimitUser.userLimitTypes.length) {
          marketLimitUser.userLimitTypes.forEach((item) => {
            switch (item) {
              case 1:
              case 2:
              case 8:
              case 16:
                customerType = item
                break
              case 4:
                customerType = item
                memberType = marketLimitUser.userLeveIds ? marketLimitUser.userLeveIds : []
                break
            }
          })
        }
        let params = { // 基础字段
          platformList: platformList[0], // 渠道
          receiveType, // 领券方式
          couponId, // id
          couponName, // 券规则名称
          couponDetails, // 优惠券列表
          memberType, // 会员类型列表
          customerType // 用户类型
        }
        if (receiveType === 1) { // 系统发券
          // 发券时间 类型 1 立即  2 年  4 月 8 周 16 日 32 固定时间区间
          Object.assign(params, { issueTimeType })
          switch (issueTimeType) {
            case 4:
            case 16:
              Object.assign(params, { issueTimeValues })
              break
            case 32:
              // const issueTime = [issueTimeStart, issueTimeEnd]
              Object.assign(params, { issueTimeStart })
          }
        }
        if (receiveType === 2) { // 手动领券
          Object.assign(params, { receiveTimeType, limitReceive })
        }
        if (marketLimitUser && marketLimitUser.members && marketLimitUser.members.length) {
          Object.assign(params, { selectedCustomerList: marketLimitUser.members })
        }
        console.log(params, 'params')
        this.formModel = params
      })
    },
    submitHandle() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const requestMethods = {
            'add': this.$api.marketing.addCouponRule,
            'edit': this.$api.marketing.updateCouponRule,
            'addCouponAboutStarGo': this.$api.marketing.addCouponAboutStarGo
          }
          const {
            couponId, // 券规则id
            platformList, // 渠道
            receiveType, // 领取方式 1 系统发券 2 手动领券
            couponName, // 券规则名称
            couponDetails, // 优惠券列表
            memberType, // 会员类型
            customerType, // 用户类型
            selectedCustomerList, // 指定用户
            receiveTimeType, // 每人可领类型
            limitReceive, // 每人可领类型 次数
            issueTimeType, // 发券时间 类型 1 立即  2 年  4 月 8 周 16 日 32 固定时间区间
            issueTimeValues, // 发券时间类型为 16月 8周时， 天数、周列表数据
            issueTimeStart // 发券时间类型为 32 固定日期时间
          } = this.formModel
          // 处理优惠券列表数据
          let couponDetailsArr = couponDetails ? couponDetails.map((item) => {
            return {
              couponRuleId: item.couponRuleId,
              couponNumber: item.couponNumber ? item.couponNumber : ''
            }
          }) : []
          let userLeveIds = [] // 发券对象 指定会员等级 memberType中type===4
          let userLimitTypes = [customerType] // 发券对象
          customerType === 4 && memberType && memberType.forEach((item) => {
            // 有指定用户 添加指定用户类型  1 全部用户 2 全部会员 4 会员等级 8 非会员 16指定用户
            userLeveIds.push(item) // 指定会员
            userLimitTypes = [4]
          })
          // 发券对象, 会员等级type有重复，过滤
          // userLimitTypes = Array.from(new Set(userLimitTypes))
          let userIds = [] // 指定用户
          if (customerType === 16 && selectedCustomerList && selectedCustomerList.length) {
            userIds = selectedCustomerList.map((item) => item.id)
            // 有指定用户 添加指定用户类型  1 全部用户 2 全部会员 4 会员等级 8 非会员 16指定用户
            userLimitTypes = [16]
          }
          // 处理领券对象、指定用户数据
          let marketLimitUser = {
            userLimitTypes, // 可领券会员列表
            userLeveIds, // 指定领券对象 （会员）
            userIds // 指定用户
          }
          let params = { // 设置基础参数
            platformList: [platformList], // 单选 字符串转成数组
            receiveType,
            couponName,
            couponDetails: couponDetailsArr,
            marketLimitUser
          }
          // 手动领券
          if (receiveType === 2) Object.assign(params, { receiveTimeType, limitReceive })
          // 系统领券
          if (receiveType === 1) {
            Object.assign(params, { issueTimeType })
            switch (issueTimeType) {
              case 8:
              case 16:
                Object.assign(params, { issueTimeValues })
                break
              case 32:
                // const searchDate = this.getSearchDate(issueTime, 'dateTime', 'issueTimeStart', 'issueTimeEnd')
                // Object.assign(params, { ...searchDate })
                Object.assign(params, { issueTimeStart })
                break
            }
          }
          if (couponId) Object.assign(params, { couponId }) // 编辑操作 添加id字段
          console.log(params)
          if (platformList === 'ysgo') {
            const { couponDetails, couponName } = params
            params = { couponDetails, couponName }
          }
          const reqFun = platformList === 'ysgo'
            ? requestMethods['addCouponAboutStarGo'] : couponId
              ? requestMethods['edit'] : requestMethods['add']
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
  .select-item {
    width: 30%;
  }
  .form-item {
    width: 50%;
  }
  .inp-item {
    width: 150px;
  }
  .tag-item {
    margin: 5px;
  }
}
.coupon-item {
  margin: 30px 0;
  .coupon-box {
    display: inline-block;
    vertical-align: middle;
    width: 500px;
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
        overflow: hidden;
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
    display: inline-block;
    width: 27%;
  }
}
</style>
