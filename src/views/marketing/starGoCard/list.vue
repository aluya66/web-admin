<template>
  <c-view>
    <template v-slot:headerTab>
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in tabTitle"
          :key="index"
          :label="item.label"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
      <div class="header-btn">
        <el-button
          v-show="activeName === 'redeemCode'"
          type="primary"
          size="medium"
          icon="el-icon-plus"
          @click="dialogObj.isShow = true"
        >创建兑换码</el-button>
      </div>
    </template>
    <div class="main__box">
      <keep-alive>
        <component
          ref="childList"
          v-bind:is="activeName"
          @complete-redeemCode-export="activeName = 'exportRecord'"
        ></component>
      </keep-alive>
    </div>

    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <handle-redeem-code ref="childRef"></handle-redeem-code>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import CDialog from 'components/dialog'
import ExportRecord from './exportRecord'
import RedeemCode from './redeemCode'
import HandleRedeemCode from './handleRedeemCode'

export default {
  name: 'starGoCard',
  components: {
    CDialog,
    ExportRecord,
    RedeemCode,
    HandleRedeemCode
  },
  data(vm) {
    return {
      flag: true,
      dialogObj: {
        isShow: false,
        title: '创建兑换码'
      },
      activeName: 'redeemCode',
      tabTitle: [
        {
          value: 'redeemCode',
          label: '兑换码列表'
        },
        {
          value: 'exportRecord',
          label: '导出记录'
        }
      ]
    }
  },
  methods: {
    dialogConfirm() {
      if (this.flag) {
        this.flag = false
        const childRef = this.$refs.childRef
        childRef.$refs.formRef.validate(valid => {
          if (valid) {
            const childFormModel = childRef.formModel
            this.$api.marketing.addRedeemCode(childFormModel).then(res => {
              this.$msgTip('添加成功')
              this.$refs.childList.fetchData()
              this.dialogObj.isShow = false
            })
            setTimeout(() => {
              this.flag = true
            }, 1000) // 一秒内不能重复点击
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
}
</script>
