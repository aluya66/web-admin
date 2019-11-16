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
      label-width="110px"
      class="form"
      label-position="right"
    >
      <c-card name="用户信息">
        <el-form-item>
          <el-avatar :size="60" src="https://empty" @error="errorHandler">
            <img :src="formModel.avatar">
          </el-avatar>
        </el-form-item>
        <el-form-item label="姓名:">
          <span>{{formModel.name}}[{{formModel.nickname}}]</span>
        </el-form-item>
        <el-form-item label="手机号:">
          <span>{{formModel.phoneNumber}}</span>
        </el-form-item>
        <el-form-item label="性别:">
          <span>{{formModel.gender}}</span>
        </el-form-item>
        <el-form-item label="可用积分:">
          <span>{{formModel.point}}</span>
        </el-form-item>
        <el-form-item label="可用优惠券:">
          <span>{{formModel.couponNum}}</span>
        </el-form-item>
        <el-form-item label="钱包余额:">
          <span>{{formModel.balance}}</span>
        </el-form-item>
        <el-form-item label="星购卡余额:">
          <span>{{formModel.starGoCardAmout}}</span>
        </el-form-item>
      </c-card>
      <div class="form-card-container">
        <c-card name="基本属性" class="form-card">
          <el-form-item label="会员等级:">
            <span>{{formModel.memberName}}</span>
          </el-form-item>
          <!-- <el-form-item label="生日:">
          <span>{{formModel.name}}</span>
        </el-form-item>
        <el-form-item label="所在城市:">
          <span>{{formModel.nickname}}</span>
          </el-form-item>-->
          <el-form-item label="会员类型:">
            <span>{{formModel.memberType}}</span>
          </el-form-item>
          <el-form-item label="会员来源:">
            <span>{{formModel.source}}</span>
          </el-form-item>
          <el-form-item label="会员归属:">
            <span>{{formModel.shopName}}</span>
          </el-form-item>
        </c-card>
        <c-card name="消费属性" class="form-card">
          <el-form-item label="消费金额:">
            <span>{{formModel.expenseAmount}}</span>
          </el-form-item>
          <el-form-item label="消费次数:">
            <span>{{formModel.expenseNum}}</span>
          </el-form-item>
          <el-form-item label="客单价:">
            <span>{{formModel.customerPrice}}</span>
          </el-form-item>
          <el-form-item label="首次消费时间:">
            <span>{{formModel.firstJoinTime}}</span>
          </el-form-item>
        </c-card>
      </div>
    </el-form>
  </c-view>
</template>

<script>
import CCard from 'components/card'

export default {
  name: 'memberManageListDetail',
  components: {
    CCard
  },
  data() {
    return {
      formModel: {}
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      const { params } = this.$route
      this.isDisabled = true
      this.$api.member.getMemberDetail({ memberId: params.id }).then(res => {
        if (res) {
          this.formModel = res
        } else {
          this.$msgTip('接口数据异常，请稍后重新尝试')
        }
      })
    },
    errorHandler() {
      return true
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang='less' scoped>
.form {
  .form-card-container {
    display: flex;
    justify-content: space-between;
    .form-card {
      width: 49.6%;
    }
  }
  background-color: @white;
  padding: 15px 15px;
  .form-btn {
    margin-left: 20px;
    margin-top: 20px;
  }
}
</style>
