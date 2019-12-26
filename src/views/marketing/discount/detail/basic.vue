<template>
  <c-card :name="title" class="form-card" id="form-base">
    <el-form
      ref="basicFormRef"
      :model="formModel"
      label-width="120px"
      class="form"
      :rules="rules"
      label-position="right"
    >
      <el-form-item label="活动名称:" prop="activityName">
        <el-input
          class="form-item"
          v-model.trim="formModel.activityName"
          :size="size"
          placeholder="请输入活动名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="使用渠道:" prop="platformList">
        <query-dict
          :dict-list="lobList"
          class="select-item"
          placeholder="请选择使用渠道"
          :value.sync="formModel.platformList"
          @change="changeChannel"
        ></query-dict>
      </el-form-item>
      <el-form-item label="活动类型:" prop="activityType">
        <query-dict
          :dict-list="activityTypeList"
          class="select-item"
          placeholder="请选择活动类型"
          :value.sync="formModel.activityType"
          @ChangeQueryDict="changeActivityType"
        ></query-dict>
      </el-form-item>

      <!-- 活动类型：满件折扣活动 开始 -->
      <template v-if="formModel.activityType === 2">
        <el-form-item label="折扣条件:">
          <el-row class="rule-item" v-for="(item, index) in formModel.marketPreferentialRules" :key="index">
            <el-col :span="3">
              <el-form-item
                inline
                :prop="'marketPreferentialRules.' + index + '.preferentialLevel'"
                :rules="{
                  required: true, validator: checkNumber, trigger: 'blur'
                }"
              >
                <el-input
                  class="discount-item"
                  v-model.trim="item.preferentialLevel"
                  :size="size"
                  placeholder
                  clearable
                >
                  <template slot="prepend">满</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="discount-type" :span="0.5">-</el-col>
            <el-col :span="3">
              <el-form-item
                :prop="'marketPreferentialRules.' + index + '.preferentiaMaxlLevel'"
                :rules="{
                  required: true, validator: checkNumber, trigger: 'blur'
                }"
              >
                <el-input
                  class="discount-item"
                  v-model.trim="item.preferentiaMaxlLevel"
                  :size="size"
                  placeholder
                  clearable
                >
                  <template slot="append">件</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="discount-text-r" :span="1">享受</el-col>
            <el-col :span="3">
              <el-form-item
                inline
                :prop="'marketPreferentialRules.' + index + '.priceType'"
                :rules="{
                  required: true, trigger: 'blur', message: '请选择'
                }"
              >
                <query-dict
                  disabled
                  :dict-list="priceTypeList"
                  class="search-item"
                  placeholder="请选择"
                  :value.sync="item.priceType"
                ></query-dict>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item
                :prop="'marketPreferentialRules.' + index + '.preferentialValue'"
                :rules="{
                  required: true, validator: checkNumber, trigger: 'blur'
                }"
              >
                <el-input
                  class="discount-item"
                  v-model.trim="item.preferentialValue"
                  :size="size"
                  placeholder
                  clearable
                >
                  <template slot="append">折</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button @click="deleteRule(index)" v-if="index !== 0" size="medium">删除</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-button class="rule-btn" @click="addRules">添加</el-button>
          </el-row>
        </el-form-item>
      </template>
      <!-- 活动类型：满件折扣活动 结束 -->

      <!-- 活动类型：满额减 开始 -->
      <template v-if="formModel.activityType === 1">
        <el-form-item label="折扣条件:">
          <el-row class="rule-item" v-for="(item, index) in formModel.marketPreferentialRules" :key="index">
            <el-col :span="6">
              <el-form-item
                inline
                :prop="'marketPreferentialRules.' + index + '.preferentialLevel'"
                :rules="{
                  required: true, validator: checkNumber, trigger: 'blur'
                }"
              >
                <el-input
                  class="discount-item"
                  v-model.trim="item.preferentialLevel"
                  :size="size"
                  placeholder
                  clearable
                >
                  <template slot="prepend">满</template>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="discount-type" :span="2">减</el-col>
            <el-col :span="6">
              <el-form-item
                :prop="'marketPreferentialRules.' + index + '.preferentialValue'"
                :rules="{
                  required: true, validator: checkNumber, trigger: 'blur'
                }"
              >
                <el-input
                  class="discount-item"
                  v-model.trim="item.preferentialValue"
                  :size="size"
                  placeholder="优惠的金额"
                  clearable
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button @click="deleteRule(index)" size="medium" v-if="index !== 0">删除</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-button class="rule-btn" @click="addRules">添加</el-button>
          </el-row>
        </el-form-item>
      </template>
      <!-- 活动类型：满额减 结束 -->

      <!-- 活动类型：一口价 开始 -->
      <template v-if="formModel.activityType === 3">
        <el-form-item label="折扣条件:">
          <el-row class="rule-item" v-for="(item, index) in formModel.marketPreferentialRules" :key="index">
            <el-col :span="6">
              <el-form-item
                inline
                :prop="'marketPreferentialRules.' + index + '.preferentialValue'"
                :rules="{
                  required: true, validator: checkNumber, trigger: 'blur'
                }"
              >
                <el-input
                  class="discount-item"
                  v-model.trim="item.preferentialValue"
                  :size="size"
                  placeholder
                  clearable
                >
                  <template slot="prepend">一口价</template>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button @click="deleteRule(index)" v-if="index !== 0">删除</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-button class="rule-btn" @click="addRules">添加</el-button>
          </el-row>
        </el-form-item>
      </template>
      <!-- 活动类型：一口价 结束 -->
      <el-form-item label="活动时间类型:" prop="activateDayType">
        <query-dict
          :dict-list="activateDayTypeList"
          class="select-item"
          :size="size"
          placeholder="请选择活动时间类型"
          :value.sync="formModel.activateDayType"
          @ChangeQueryDict="changeActivateDayType"
        ></query-dict>
      </el-form-item>
      <el-form-item label="设置固定周期:" prop="activateDate" v-if="formModel.activateDayType === 1">
        <el-date-picker
          :size="size"
          v-model="formModel.activateDate"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="截止日期"
          :default-time="['00:00:00', '23:59:59']"
          align="right"
          @change="test"
          :disabled="!!formModel.activateMonths.length || !!formModel.activateDays.length"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="设置固定月份:" prop="activateMonths" v-if="formModel.activateDayType === 1">
        <el-checkbox-group v-model="formModel.activateMonths" :disabled="formModel.activateDate !== null">
          <el-checkbox
            class="checkbox-item"
            :label="item"
            v-for="(item, index) in 12"
            :key="index"
          >{{ item + '月' }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="设置固定日期:" prop="activateDays" v-if="formModel.activateDayType === 1">
        <el-checkbox-group v-model="formModel.activateDays" :disabled="formModel.activateDate !== null">
          <el-checkbox
            class="checkbox-item"
            :label="item"
            v-for="(item, index) in 31"
            :key="index"
          >{{ item + '号' }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </c-card>
</template>
<script>
import MixinForm from 'mixins/form'
import MixinFormCard from 'mixins/formCard'
import utils from 'utils'
import dictObj from '@/store/dictData'

export default {
  mixins: [MixinForm, MixinFormCard],
  data() {
    return {
      rules: {
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        activityType: [
          { required: true, message: '请选择活动类型', trigger: 'blur' }
        ],
        platformList: [
          { required: true, message: '请选择使用渠道', trigger: 'blur' }
        ],
        activateDayType: [
          { required: true, message: '请选择活动时间类型', trigger: 'blur' }
        ]
      },
      pickerOptions: utils.pickerOptions,
      activateDayTypeList: [{ // 活动时间类型
        label: '固定时间',
        value: 1
      }, {
        label: '所有时间',
        value: 2
      }],
      monthList: [ // 月份
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月'
      ],
      activityTypeList: dictObj.activityTypeList, // 活动类型
      lobList: dictObj.lobList, // 渠道
      priceTypeList: dictObj.priceTypeList // 价格类型
    }
  },
  methods: {
    test(val) {
      console.log(val, this.formModel.activateDate)
    },
    changeActivateDayType() {
      this.formModel.activateDate = null
      this.formModel.activateMonths = []
      this.formModel.activateDays = []
    },
    changeChannel(appCode) {
      this.$emit('ChangeChannel', appCode)
    },
    deleteRule(index) {
      this.formModel.marketPreferentialRules.splice(index, 1)
    },
    addRules() {
      let obj = {
        preferentialLevel: '',
        preferentiaMaxlLevel: '',
        preferentialType: '',
        preferentialValue: '',
        unit: ''
      }
      if (this.formModel.activityType === 2) Object.assign(obj, { priceType: 6 })
      this.formModel.marketPreferentialRules.push(obj)
    },
    changeActivityType({ value }) {
      this.formModel.activityType = value
      let obj = {
        preferentialLevel: '',
        preferentiaMaxlLevel: '',
        preferentialType: '',
        preferentialValue: '',
        unit: ''
      }
      if (this.formModel.activityType === 2) Object.assign(obj, { priceType: 6 })
      this.formModel.marketPreferentialRules = [obj]
    }
  }
}
</script>
<style lang="less" scoped>
.form {
  .form-item {
    width: 50%;
  }
  .select-item {
    width: 30%;
  }
  .discount-type {
    text-align: center;
    margin: 0 5px;
  }
  .discount-text-r {
    text-align: right;
    margin-right: 5px;
  }
  .discount-item{
    width: 100%;
  }
  .rule-btn {
    margin-top: 15px;
  }
  .rule-item {
    margin-bottom: 25px;
  }
}
</style>
