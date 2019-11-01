<template>
  <c-card :name="title" class="form-card">
    <el-form-item label="人均限量:" prop="limitReceive">
      <el-input-number
        v-model="formModel.limitReceive"
        controls-position="right"
        :size="size"
        :min="0"
        :max="100"
        :disabled="isView || isDisabled"
        placeholder="请输入限量数值"
      ></el-input-number>
      <span class="input-info">* 单位张，目前数量填写范围0～100</span>
    </el-form-item>
    <el-form-item label="品类规则:" prop="categoryType" v-if="false">
      <el-radio-group v-model="formModel.categoryType" :disabled="isView || isDisabled">
        <el-radio :label="0">全部类</el-radio>
        <el-radio :label="1">限品类</el-radio>
      </el-radio-group>
      <span class="input-info">* 选择全品类后不可更改为限品类;</span>
    </el-form-item>
    <el-form-item label="选取商品:" v-if="false">
      <div class="choose-table">
        <c-table
          noPage
          v-if="tableList.length"
          :loading="false"
          :table-header="tableHeader"
          :table-list="tableList"
          :table-inner-btns="tableInnerBtns"
        ></c-table>
        <el-button class="choose-goods" plain icon="el-icon-plus" @click="addGoods">添加商品</el-button>
      </div>
      <div class="choose-table">
        <c-table
          noPage
          v-if="tableList.length"
          :loading="false"
          :table-header="tableHeader"
          :table-list="mutexTableList"
          :table-inner-btns="tableInnerBtns"
        ></c-table>
        <el-button
          class="choose-goods"
          plain
          icon="el-icon-plus"
          @click="addGoods"
        >添加互斥商品(包含该商品则不可用券)</el-button>
      </div>
    </el-form-item>
    <el-form-item label="重复规则:">
      <el-checkbox v-model="formModel.repeatUse" :disabled="isView || isDisabled">本券可重复使用</el-checkbox>
      <span class="input-info">* 可重复使用代表券金额抵扣后若仍大于0，则可在下次订单结算时继续选中抵扣;
        <br>&nbsp;&nbsp;若不能重复使用，则即时抵扣金额小于券金额，使用一次券后券状态也会变更为“已使用”;
      </span>
    </el-form-item>
    <el-form-item label="用户门槛:">
      <el-checkbox v-model="formModel.pointLimit" :disabled="isView || isDisabled">积分门槛</el-checkbox>
      <span class="input-info">* 全不勾选则默认对除黑名单外所有用户可用</span>
      <div class="user-limit">
        <span class="text">超过</span>
        <el-input
          v-model.number="formModel.pointLimitValue"
          :size="size"
          :disabled="isView || isDisabled || !formModel.pointLimit"
          clearable
        />
        <span class="lang-text">积分可以使用</span>
      </div>
      <el-checkbox v-model="formModel.userLevel" :disabled="isView || isDisabled">等级门槛</el-checkbox>
      <div class="user-limit">
        <span class="text">超过</span>
        <el-input
          v-model.number="formModel.userLevelValue"
          :size="size"
          :disabled="isView || isDisabled || !formModel.userLevel"
          clearable
        />
        <span class="lang-text">级可以使用</span>
      </div>
    </el-form-item>
    <el-form-item label="优惠类型:" prop="preferentialType">
      <el-select
        v-if="!isView"
        class="select-item"
        :disabled="isView || isDisabled"
        v-model="formModel.preferentialType"
        placeholder="请选择优惠类型"
        clearable
      >
        <el-option
          v-for="item in preferentialTypeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <!-- <el-checkbox :disabled="isDisabled">无门槛</el-checkbox> -->
    <el-form-item prop="couponPreferentialRules">
      <div
        class="user-limit mag-top"
        v-for="(item, index) in formModel.couponPreferentialRules"
        :key="item.key"
      >
        <template v-if="formModel.preferentialType === 0">
          <span class="text">满</span>
          <el-input v-model="item.preferentialLevel" :size="size" :disabled="isDisabled" clearable/>
          <span class="text">元 减</span>
          <el-input v-model="item.preferentialValue" :size="size" :disabled="isDisabled" clearable/>
          <span class="text">元</span>
          <el-button type="text" v-if="!isView" @click.prevent="detelePreferential(item, index)">删除</el-button>
        </template>
        <template v-if="formModel.preferentialType === 1">
          <span class="text">满</span>
          <el-input v-model="item.preferentialLevel" :size="size" :disabled="isDisabled" clearable/>
          <span class="text">元 打</span>
          <el-input v-model="item.preferentialValue" :size="size" :disabled="isDisabled" clearable/>
          <span class="text">折</span>
          <el-button type="text" v-if="!isView" @click.prevent="detelePreferential(item, index)">删除</el-button>
        </template>
      </div>
      <div class="user-limit mag-top">
        <el-button type="text" v-if="!isView" :disabled="isDisabled" @click="addPreferential">添加门槛限制</el-button>
      </div>
    </el-form-item>
    <el-form-item label="返还规则:" prop="returnRule">
      <el-radio-group v-model="formModel.returnRule[0]">
        <el-radio
          v-for="item in returnRuleCancelArr"
          :key="item.value"
          :disabled="isView || isDisabled"
          :label="item.value"
        >{{item.label}}</el-radio>
      </el-radio-group>
      <el-radio-group class="mag-left" v-model="formModel.returnRule[1]">
        <el-radio
          v-for="item in returnRuleArr"
          :key="item.value"
          :disabled="isView || isDisabled"
          :label="item.value"
        >{{item.label}}</el-radio>
      </el-radio-group>
    </el-form-item>
  </c-card>
</template>

<script>
// 选取商品、品牌、分类暂时不做。
import MixinFormCard from 'mixins/formCard'
import CTable from 'components/table'

export default {
  mixins: [MixinFormCard],
  data(vm) {
    return {
      addGoodsType: null,
      preferentialTypeArr: [{
        label: '代金',
        value: 0
      }, {
        label: '折扣',
        value: 1
      }],
      returnRuleCancelArr: [{
        label: '订单取消返还',
        value: 0
      }, {
        label: '订单取消不返还',
        value: 1
      }],
      returnRuleArr: [{
        label: '订单退款返还',
        value: 2
      }, {
        label: '订单退款不返还',
        value: 4
      }],
      tableInnerBtns: [{
        name: '删除',
        icon: 'el-icon-delete',
        handle(row) {
          if (vm.addGoodsType === 1) {
          } else {
          }
        }
      }],
      tableList: [],
      mutexTableList: [],
      tableHeader: [{
        label: '商品名称 ',
        prop: 'goodsName'
      }]
    }
  },
  methods: {
    addGoods() {
      this.$emit('add-goods', this.addGoodsType, this.addGoodsType === 1 ? this.tableList : this.mutexTableList)
    },
    detelePreferential(item, index) {
      this.formModel.couponPreferentialRules.splice(index, 1)
      // if (item.id) {
      //   this.delArr.push({ id: item.id })
      // }
    },
    addPreferential() {
      this.formModel.couponPreferentialRules.push({
        preferentialLevel: '',
        preferentialValue: ''
      })
    }
  },

  components: {
    CTable
  }
}
</script>

<style lang='less' scoped>
.form-card {
  .select-item {
    width: 30%;
  }
  .input-select {
    width: 80px;
  }
  .choose-table {
    margin-top: 10px;
    border: 1px dashed @border-default;
    width: 60%;
    padding: 20px 20px;

    .el-table thead tr th {
      padding: 0;
    }

    .choose-goods {
      margin-top: 10px;
    }
  }
  .user-limit {
    color: @text-sub-color;
    display: flex;
    .el-input {
      width: 120px;
    }
    .text,
    .lang-text {
      display: inline-block;
      margin: 0 10px;
    }
    .lang-text {
      width: 150px;
    }
    .el-button {
      text-decoration: underline;
    }
  }
  .mag-top {
    margin-top: 10px;
  }
  .mag-left {
    margin-left: 20px;
  }
}
</style>
