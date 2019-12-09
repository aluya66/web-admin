<template>
  <div class="detail">
    <div class="common">
      <div class="user">
        <el-avatar :size="80" :src="formModel.avatar" fit="contain"></el-avatar>
        <div class="item">
          <div>
            <span class="label">姓名:</span>
            <span class="value">{{formModel.name}}</span>
          </div>
          <div>
            <span class="label">昵称:</span>
            <span class="value">{{formModel.nickname}}</span>
          </div>
          <div>
            <span class="label">手机号码:</span>
            <span class="value">{{formModel.phoneNumber}}</span>
          </div>
          <div>
            <span class="label">性别:</span>
            <span class="value">{{formModel.gender}}</span>
          </div>
        </div>
      </div>
      <div class="item">
        <div>
          <span class="label">可用积分:</span>
          <span class="value">{{formModel.point}}</span>
        </div>
        <div>
          <span class="label">可用优惠券:</span>
          <span class="value">{{formModel.couponNum}}</span>
        </div>
        <div>
          <span class="label">钱包可用余额(元):</span>
          <span class="value">{{formModel.balance}}</span>
        </div>
        <div>
          <span class="label">星购卡余额(元):</span>
          <span class="value">{{formModel.starGoCardAmout}}</span>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="item">
        <h3 class="title">基础信息</h3>
        <div>
          <span class="label">生   日:</span>
          <span class="value">{{formModel.birthday}}</span>
        </div>
        <div>
          <span class="label">所在城市:</span>
          <span class="value">{{formModel.provinceName}}-{{formModel.cityName}}-{{formModel.districtName}}</span>
        </div>
        <div>
          <span class="label">会员类型:</span>
          <span class="value">{{formModel.memberType}}</span>
        </div>
        <div>
          <span class="label">会员来源:</span>
          <span class="value">{{formModel.source}}</span>
        </div>
        <div>
          <span class="label">会员归属:</span>
          <span class="value">{{formModel.shopName}}[{{formModel.memberName}}]</span>
        </div>
      </div>
      <div class="item">
        <h3 class="title">消费信息</h3>
        <div>
          <span class="label">消费金额(元):</span>
          <span class="value">{{formModel.expenseAmount}}</span>
        </div>
        <div>
          <span class="label">消费次数:</span>
          <span class="value">{{formModel.expenseNum}}</span>
        </div>
        <div>
          <span class="label">客单价(元):</span>
          <span class="value">{{formModel.customerPrice}}</span>
        </div>
        <div>
          <span class="label">最后一次消费时间:</span>
          <span class="value">{{formModel.lastExpenseTime}}</span>
        </div>
      </div>
    </div>
  </div>
  <!--
  <el-col>
    <el-form-item label="姓名:">
      <c-image
        class="coverImg"
        :url="formModel.avatar"
        fit="contain"
        :preview-src-list="[formModel.avatar]"
      ></c-image>
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
  </el-col>
  <el-col>
    <el-form-item label="会员等级:">
      <span>{{formModel.memberName}}</span>
    </el-form-item>
    <el-form-item label="会员类型:">
      <span>{{formModel.memberType}}</span>
    </el-form-item>
    <el-form-item label="会员来源:">
      <span>{{formModel.source}}</span>
    </el-form-item>
    <el-form-item label="会员归属:">
      <span>{{formModel.shopName}}</span>
    </el-form-item>
  </el-col>
  <el-col>
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
  </el-col>-->
</template>

<script>

export default {
  data() {
    return {
      formModel: {
        avatar: '', // 头像
        name: '', // 名称
        nickname: '', // 昵称
        phoneNumber: '',
        gender: '',
        point: '',
        couponNum: '',
        balance: '',
        starGoCardAmout: '',
        memberName: '',
        memberType: '',
        source: '',
        shopName: '',
        expenseAmount: '',
        expenseNum: '',
        customerPrice: '',
        firstJoinTime: ''
      }
    }
  },
  props: {
    initData: {
      type: Object,
      required: true
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      const { userId, appCode } = this.initData
      this.$api.member.getMemberDetail({ userId, appCode }).then(res => {
        if (res) {
          this.formModel = {
            ...this.formModel,
            ...res
          }
        } else {
          this.$msgTip('接口数据异常，请稍后重新尝试')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  border-radius: 4px;
  border: 1px solid @border-default;

  .common {
    padding: 10px 40px;
    display: flex;
    border-bottom: 1px solid @border-default;
    justify-content: space-around;
    .user {
      width: 50%;
      display: flex;
      align-items: center;
      .item {
        width: 100%;
      }
    }
  }

  .info {
    display: flex;
    justify-content: space-between;
  }

  .item {
    font-size: @f14;
    width: 50%;
    padding: 20px 10px;

    &:first-child {
      border-right: 1px solid @border-default;
    }
    .title {
      font-size: @f16;
      font-weight: 700;
      text-align: center;
      margin: 10px 0;
    }
    span {
      display: inline-block;
      line-height: 30px;
      &.label {
        font-weight: 700;
        width: 120px;
        text-align: right;
      }
      &.value {
        font-weight: 400;
        margin-left: 10px;
      }
    }
  }
}
</style>
