<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="dialog-form"
    label-position="right"
    status-icon
  >
    <el-form-item label="渠道价格名称:">{{formModel.priceName}}</el-form-item>
    <el-form-item label="取价基础:" v-if="formModel.priceId === 4 && formModel.appliedType === 1">
      <query-dict
        :dict-list="priceList"
        class="select-item"
        placeholder="取价基础"
        :value.sync="formModel.basePriceId"
      ></query-dict>
    </el-form-item>
    <el-form-item label="折扣率:" prop="discountRate">
      <el-input v-model.trim="formModel.discountRate" type="number" class="select-item" min="1" max="100" clearable>
        <template slot="append">%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="条件等级:" v-if="formModel.priceId === 7 && formModel.appliedType === 2" prop="customLevel">
      <query-dict :dict-list="memberList" showType="radio" :value.sync="formModel.customLevel"></query-dict>
    </el-form-item>
    <el-form-item label="是否同步:">
      <query-dict
        :dict-list="syncStatusList"
        showType="radio"
        :value.sync="formModel.syncChannelStatus"
      ></query-dict>
    </el-form-item>
  </el-form>
</template>

<script>
import MixinForm from 'mixins/form'
import dictObj from '@/store/dictData'

export default {
  mixins: [MixinForm],
  props: {
    initData: {
      type: Object,
      default() {
        return {}
      }
    },
    memberPriceList: {
      type: Array,
      default() {
        return []
      }
    },
    memberTotal: {
      type: Array,
      default() {
        return []
      }
    },
    priceList: {
      type: Array,
      default() {
        return []
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      memberList: [],
      syncStatusList: dictObj.syncStatusList,
      rules: {
        customLevel: [
          { required: true, message: '请选择可使用的会员类型', trigger: 'change' }
        ],
        discountRate: [
          { required: true, message: '请输入折扣率', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    formModel: {
      get() {
        return this.initData
      },
      set(val) {
        this.$emit('update:init-data', val)
      }
    }
  },
  created() {
    if (this.formModel.priceId === 7 && this.formModel.appliedType === 2) {
      const curMemberList = this.memberTotal.slice(0)
      curMemberList.forEach((val, index) => {
        if (this.memberPriceList.includes(val.value)) {
          curMemberList[index] = { ...val, disabled: true } // 新增时 会员类型列表
        }
      })
      if (this.isEdit) { // 编辑时把当前数据的条件等级拼接上
        const curCustomLevelIndex = curMemberList.findIndex(res => res.value === this.formModel.customLevel)
        if (curCustomLevelIndex !== -1) {
          curMemberList[curCustomLevelIndex].disabled = false
        }
      }
      this.memberList = curMemberList
    }
  }
}
</script>
