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
          <el-input
            v-model.trim="formModel.businessName"
            placeholder="请输入商户姓名"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="商户编码:" v-if="isEdit">{{formModel.businessCode}}</el-form-item>
        <el-form-item label="商户分类:">
          <query-dict
            :dict-list="businessCategoryList"
            class="select-item"
            placeholder="请选择商户分类"
            :value.sync="formModel.businessCategory"
          ></query-dict>
        </el-form-item>
        <el-form-item label="商户类型:" prop="businessType">
          <query-dict
            disabled
            :dict-list="businessTypeList"
            class="select-item"
            placeholder="请选择商户类型"
            :value.sync="formModel.businessType"
          ></query-dict>
          <span class="input-info">* 云尚型为自营商户，其他均为合作商户</span>
        </el-form-item>
      </c-card>
      <c-card name="负责人信息" class="form-card">
        <el-form-item label="姓名:" prop="responsibleName">
          <el-input
            v-model.trim="formModel.responsibleName"
            placeholder="请输入负责人姓名"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="responsiblePhone">
          <el-input
            v-model.trim="formModel.responsiblePhone"
            placeholder="请输入负责人手机号"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="responsibleEmail">
          <el-input
            v-model.trim="formModel.responsibleEmail"
            placeholder="请输入负责人邮箱"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
      </c-card>
      <c-card name="主体信息" class="form-card">
        <el-form-item label="企业名称:">
          <el-input
            v-model.trim="formModel.companyName"
            placeholder="请输入企业全称"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="企业税号:">
          <el-input
            v-model.trim="formModel.companyTfn"
            placeholder="请输入企业税号"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="营业执照:">
          <c-upload
            ref="curUpload"
            class="pic"
            auto-upload
            action="/api/upload/file"
            list-type="picture-card"
            :http-request="uploadHandle"
            :size="10"
            :limit="1"
            :fileList="formModel.fileList"
            @on-success="uploadSuccess"
            :on-remove="uploadRemove"
            :on-preview="uploadReview"
          >
            <i class="el-icon-plus"></i>
            <div class="info">只能上传png,jpg,jpeg,gif图片文件，且不能大于10M</div>
          </c-upload>
        </el-form-item>
        <el-form-item label="区域地址:" prop="companyAddressCode">
          <el-cascader
            clearable
            class="select-item"
            :options="areaOptions"
            :props="optionsProps"
            v-model="formModel.companyAddressCode"
            placeholder="请选择省市区"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址:" prop="companyAddress">
          <el-input
            v-model.trim="formModel.companyAddress"
            placeholder="请输入详细地址"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
      </c-card>
      <c-card name="银行账户信息" class="form-card">
        <el-form-item label="账户名称:">
          <el-input
            v-model.trim="formModel.bankAccountName"
            placeholder="请输入账户名称"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="银行卡号:">
          <el-input
            v-model.trim="formModel.bankCardNo"
            placeholder="请输入银行卡号"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="开户银行:">
          <el-input
            v-model.trim="formModel.bankOfDeposit"
            placeholder="请输入开户银行"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="开户行名称:">
          <el-input
            v-model.trim="formModel.bankBranchName"
            placeholder="请输入开户行名称"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="开户地区:">
          <el-input
            v-model.trim="formModel.bankBranchRegion"
            placeholder="请输入开户地区"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
      </c-card>
      <!--  TODO... -->
      <el-form-item class="form-btn">
        <el-button
          :size="size"
          :loading="btnLoading"
          type="primary"
          @click.native.prevent="submitHandle"
        >保存</el-button>
        <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
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
        <div class="preview">
          <img :src="dialogObj.imageUrl" alt="">
        </div>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
import CDialog from 'components/dialog'
import CUpload from 'components/upload'
import CCard from 'components/card'
import dictObj from '@/store/dictData'
import utils from 'utils'

export default {
  name: 'shopMerchantInfo',
  mixins: [MixinForm],
  components: {
    CDialog,
    CCard,
    CUpload
  },
  data(vm) {
    return {
      areaOptions: [], // 地区列表
      optionsProps: {
        value: 'code',
        label: 'name',
        leaf: 2
      },
      businessCategoryList: dictObj.businessCategoryList, // 商户分类集合
      businessTypeList: dictObj.shopTypeList, // 商户类型集合
      formModel: {
        businessName: '', // 商户名称
        businessType: 2, // 商户类型
        responsibleName: '', // 负责人
        responsiblePhone: '', // 负责人手机
        companyAddress: '', // 详细地址
        companyAddressCode: [], // 区域code
        fileList: [] // 上传图片
      },
      isEdit: false,
      dialogObj: {
        title: '预览'
      },
      btnLoading: false,
      rules: {
        businessType: [
          { required: true, message: '请选择商户类型', trigger: 'change' }
        ],
        responsibleName: [
          { required: true, message: '负责人姓名不能为空', trigger: 'blur' }
        ],
        responsiblePhone: [
          { required: true, validator: utils.validater.phoneNumber, trigger: 'blur' }
        ],
        responsibleEmail: [
          { validator: utils.validater.validateEmail, trigger: 'blur' }
        ],
        companyAddressCode: [{
          required: true, message: '地址省市区不能为空', trigger: 'change'
        }],
        companyAddress: [{
          required: true, message: '详细地址不能为空', trigger: 'blur'
        }]
      }
    }
  },

  created() {
    const { id } = this.$route.params
    this.isEdit = !!id
    id && this.fetchData()
    this.fetchAreaData()
  },

  methods: {
    // getInitArea(companyProvince) {
    //   this.$api.basic.queryAllRegion({ code: companyProvince, betweenLevel: 3 }).then(res => {
    //     console.log(res)
    //   })
    // },
    uploadHandle(file) {
      this.$refs.curUpload.customUpload(file)
    },
    uploadSuccess(response, file, fileList) {
      this.formModel.fileList = [fileList[fileList.length - 1]] // 获取最后一张覆盖原图
    },
    // 删除图片
    uploadRemove(file, fileList) {
      this.formModel.fileList = fileList
    },
    // 预览图片
    uploadReview(file) {
      this.dialogObj = {
        ...this.dialogObj,
        imageUrl: file.url,
        isShow: true
      }
    },
    fetchAreaData() {
      this.$api.basic.getAllArea().then(res => {
        if (res.length) {
          this.areaOptions = res
        }
      })
    },
    fetchData() {
      const { id } = this.$route.params
      this.$api.channel.queryBusinessList({ id }).then(res => {
        this.setTagsViewTitle()
        if (res && res.data) {
          const {
            companyProvince,
            companyCity,
            companyDistrict,
            companyLicenseUrl,
            businessName,
            businessCode,
            businessCategory,
            businessType,
            responsibleName,
            responsiblePhone,
            responsibleEmail,
            companyName,
            companyTfn,
            companyAddress,
            bankAccountName,
            bankCardNo,
            bankOfDeposit,
            bankBranchRegion,
            bankBranchName
          } = res.data[0]
          this.formModel = {
            id,
            businessName,
            businessCode,
            businessCategory,
            businessType,
            responsibleName,
            responsiblePhone,
            responsibleEmail,
            companyName,
            companyTfn,
            companyAddress,
            bankAccountName,
            bankCardNo,
            bankOfDeposit,
            bankBranchRegion,
            bankBranchName,
            companyAddressCode: [companyProvince, companyCity, companyDistrict],
            fileList: companyLicenseUrl ? [{ name: '图片', url: companyLicenseUrl }] : []
          }
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
            'add': this.$api.channel.addBusiness,
            'edit': this.$api.channel.editBusiness
          }
          const { id } = this.$route.params
          const request = id ? requestMethods['edit'] : requestMethods['add']
          const { fileList, companyAddressCode, ...other } = this.formModel
          const params = {
            companyLicenseUrl: fileList.length ? fileList[0].url : '',
            companyProvince: companyAddressCode[0],
            companyCity: companyAddressCode[1],
            companyDistrict: companyAddressCode[2],
            ...other
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
    width: 50%;
  }
  .select-item {
    width: 30%;
  }
  .form-btn {
    margin-left: 20px;
    margin-top: 20px;
  }
  .pic {
    padding-bottom: 25px;
    span {
      display: inline-block;
      margin-bottom: 10px;
    }
    .info {
      line-height: 20px;
      height: 20px;
      margin-top: 5px;
      font-size: @f12;
    }
  }
}
.preview {
  box-sizing: border-box;
  text-align: center;

  img {
    object-fit: contain;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
</style>
