<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="150px"
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

    <el-form-item label="条件等级：" v-if="formModel.priceId === 7&& formModel.appliedType === 2" prop="customLevel"></el-form-item>
    <!--星go && yoshop-->
    <div v-if="(appType=='ysgo'|| appType=='yssp')&&formModel.priceId === 7&& formModel.appliedType === 2">
      <el-form-item label="yoshop会员等级:">
        <query-dict :dict-list="memberList" showType="radio" :value.sync="formModel.customLevel"></query-dict>
      </el-form-item>
      <el-form-item label="星go会员等级:">
        <query-dict :dict-list="stargoMemberList" showType="radio" :value.sync="formModel.customLevel"></query-dict>
      </el-form-item>
    </div>

     <!--ipx-->
    <el-form-item label="IPX会员等级:" v-if="appType=='ysdp'&&formModel.priceId === 7 && formModel.appliedType === 2" prop="customLevel">
      <query-dict :dict-list="ipxMemberList" showType="radio" value.sync="1"></query-dict>
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
    },
    appType: {
      type: String,
      default: ''
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
      },
      stargoMemberList: [
        { label: '星go会员', value: 'ysgo_1', appCode: 'ysgo' }
      ],
      ipxMemberList: [
        [{ label: 'IPX会员', value: 'ysdp_1', appCode: 'ysdp' }]
      ]
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
          if (this.memberPriceList.includes('ysgo_1')) {
            this.formModel.customLevel = 'ysgo_1'
            this.stargoMemberList[0].disabled = true
          }
        }
      })

      if (this.isEdit) { // 编辑时把当前数据的条件等级拼接上
        const curCustomLevelIndex = curMemberList.findIndex(res => res.value === this.formModel.customLevel)
        if (curCustomLevelIndex !== -1) {
          curMemberList[curCustomLevelIndex].disabled = false
        } else {
          if (this.appType === 'ysdp') { // 如果是ipx的渠道，则给customLevel赋值为1
            this.formModel.customLevel = 'ysdp_1'
          }
        }
      }
      this.memberList = curMemberList
    }
  }
}
</script>
