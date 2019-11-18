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
     <el-form-item label="品牌名称" prop="name">
        <el-input v-model.trim="formModel.name" :disabled="isDisabled" class="select-item"/>
      </el-form-item>
      <el-form-item label="品牌别名">
        <el-input v-model.trim="formModel.ename" :disabled="isDisabled" class="select-item"/>
      </el-form-item>
      <el-form-item label="品牌国家">
        <el-input v-model.trim="formModel.country" :disabled="isDisabled" class="select-item"/>
      </el-form-item>
      <el-form-item label="消费人群" prop="consumer">
        <el-input v-model.trim="formModel.consumer" :disabled="isDisabled" class="select-item"/>
      </el-form-item>
      <el-form-item class="form-btn" v-if="!isDisabled">
        <el-button :loading="btnLoading" type="primary" @click.native.prevent="submitHandle">保存</el-button>
      </el-form-item>
    </el-form>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
export default {
  name: 'brandLabel',
  mixins: [MixinForm],
  data() {
    return {
      btnLoading: false,
      formModel: {
        country: '',
        name: '',
        ename: '',
        consumer: '',
        logo: '',
        intro: '',
        description: ''
      },
      isDisabled: false,
      rules: {
        country: [
          { required: true, message: '请填写品牌国家', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请填写品牌名称', trigger: 'blur' }
        ],
        ename: [
          { required: true, message: '请填写品牌别名', trigger: 'blur' }
        ],
        consumer: [
          { required: true, message: '请填写消费人群', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请填写品牌LOGO的URL地址', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请填写品牌介绍', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写品牌描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      const { id } = this.$route.params
      if (id) {
        this.isDisabled = true
        this.$api.basic.getBrandById({ id }).then(res => {
          this.setTagsViewTitle()
          this.formModel = {
            ...this.formModel,
            ...res
          }
        })
      }
    },
    submitHandle() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const formModel = this.formModel
          if (!this.dialogObj.isEdit) {
            this.addHandle(formModel)
          } else {
            this.editHandle(formModel)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addHandle(formModel) {
      this.$api.basic.addBrand(formModel).then(res => {
        this.dialogObj.isShow = false
        this.$msgTip('添加成功')
        this.fetchData()
      })
    },
    editHandle(formModel) {
      this.$api.basic.updateBrand(formModel).then(res => {
        this.dialogObj.isShow = false
        this.$msgTip('修改成功')
        this.fetchData()
      })
    }
  }
}
</script>
<style lang='less' scoped>
.form {
  background-color: @white;
  padding: 15px 20px;
  .select-item {
    width: 30%;
  }
  .form-btn {
    margin-left: 20px;
    margin-top: 20px;
  }
}
</style>
