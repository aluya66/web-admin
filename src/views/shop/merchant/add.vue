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
      status-icon
    >
      <c-card name="基本信息" class="form-card">
        <el-form-item label="商户名称:" prop="businessName">
          <el-input v-model.trim="formModel.businessName" placeholder="请输入商户姓名" class="form-item" clearable></el-input>
        </el-form-item>
        <el-form-item label="商户分类:">
          <query-dict
            :disabled="isEdit"
            :dict-list="businessCategoryList"
            class="select-item"
            placeholder="请选择商户分类"
            :value.sync="formModel.businessCategory"
          ></query-dict>
        </el-form-item>
        <el-form-item label="商户类型:" prop="businessType">
          <query-dict
            :disabled="isEdit"
            :dict-list="businessTypeList"
            class="select-item"
            placeholder="请选择商户类型"
            :value.sync="formModel.businessType"
          ></query-dict>
        </el-form-item>
      </c-card>
      <c-card name="负责人信息" class="form-card">
        <el-form-item label="姓名:" prop="responsibleName">
          <el-input v-model.trim="formModel.responsibleName" placeholder="请输入负责人姓名" class="form-item" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="responsiblePhone">
          <el-input v-model.trim="formModel.responsiblePhone" placeholder="请输入负责人手机号" class="form-item" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱:">
          <el-input v-model.trim="formModel.responsibleEmail" placeholder="请输入负责人邮箱" class="form-item" clearable></el-input>
        </el-form-item>
      </c-card>
      <c-card name="主体信息" class="form-card">
        <el-form-item label="企业名称:">
          <el-input v-model.trim="formModel.responsibleName" placeholder="请输入企业全称" class="form-item" clearable></el-input>
        </el-form-item>
        <el-form-item label="企业税号:">
          <el-input v-model.trim="formModel.responsiblePhone" placeholder="请输入企业税号"  class="form-item" clearable></el-input>
        </el-form-item>
        <el-form-item label="营业执照:">
          上传照片
        </el-form-item>
        <el-form-item label="地址:" prop="companyAddress">
          <el-cascader
            clearable
            class="search-item"
            :size="size"
            :props="optionsProps"
            :show-all-levels="false"
            v-model="formModel.companyAddress"
            placeholder="请选择企业区域地址"
            :options="companyAddressList"
            filterable
          ></el-cascader>
          <el-input v-model.trim="formModel.companyAddress" placeholder="请输入详细地址" class="form-item" clearable></el-input>
        </el-form-item>
      </c-card>
      <c-card name="银行账户信息" class="form-card">
        <el-form-item label="账户名称:">
          <el-input v-model.trim="formModel.bankAccountName" placeholder="请输入账户名称" class="form-item" clearable></el-input>
        </el-form-item>
        <el-form-item label="银行卡号:">
          <el-input v-model.trim="formModel.bankCardNo" placeholder="请输入银行卡号" class="form-item" clearable></el-input>
        </el-form-item>
        <el-form-item label="开户银行:">
          <el-input v-model.trim="formModel.bankOfDeposit" placeholder="请输入开户银行" class="form-item" clearable></el-input>
        </el-form-item>
        <el-form-item label="开户行名称:">
          <el-input v-model.trim="formModel.bankBranchName" placeholder="请输入开户行名称" class="form-item" clearable></el-input>
        </el-form-item>
        <el-form-item label="开户地区:">
          <el-input v-model.trim="formModel.bankBranchRegion" placeholder="请输入开户地区" class="form-item" clearable></el-input>
        </el-form-item>
      </c-card>
      <!--  TODO... -->
      <el-form-item class="form-btn">
        <el-button
          :loading="btnLoading"
          size="medium"
          type="primary"
          @click.native.prevent="submitHandle"
        >保存</el-button>
        <el-button size="medium" @click.native.prevent="goBack">返回</el-button>
      </el-form-item>
    </el-form>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <!-- TODO... 根据需求添加业务对话框处理 -->
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
import CDialog from 'components/dialog'
import CCard from 'components/card'

const businessCategoryList = [{
  label: '企业',
  value: 1
}, {
  label: '个人',
  value: 2
}]

const businessTypeList = [{
  label: '自营',
  value: 1
}, {
  label: '合作商户',
  value: 2
}]

export default {
  name: 'shopMerchantInfo',
  mixins: [MixinForm],
  components: {
    CDialog,
    CCard
  },
  data() {
    return {
      optionsProps: {},
      companyAddressList: [],
      businessCategoryList, // 商户分类集合
      businessTypeList, // 商户类型集合
      formModel: {
        businessName: '',
        businessType: '',
        responsibleName: '',
        responsiblePhone: '',
        companyAddress: ''
      },
      isEdit: false,
      dialogObj: {},
      btnLoading: false,
      rules: {}
    }
  },

  created() {
    const { id } = this.$route.params
    this.isEdit = !!id
    this.fetchData()
  },

  methods: {
    fetchData() {
      const { id } = this.$route.params
      this.$api.shop.queryShopDetail({ id }).then(res => {
        this.setTagsViewTitle()
        if (res) {
          this.formModel = res
        }
      })
    },
    dialogConfirm() {
      this.dialogObj.isShow = false
    },
    submitHandle() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const requestMethods = {
            'add': this.$api.shop.addShop,
            'edit': this.$api.shop.editShop
          }
          const { id } = this.$route.params
          const request = id ? requestMethods['edit'] : requestMethods['add']

          const params = {
            // TODO...
          }

          request(params).then(() => {
            this.$msgTip(id ? '更新成功' : '新增成功').then(() => {
              this.closeCurrentTag()
              this.goBack()
            })
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
  padding: 15px 15px;
  .form-item {
    width: 100%;
  }
  .select-item {
    width: 30%;
  }
  .form-btn {
    margin-left: 20px;
    margin-top: 20px;
  }
}
</style>
