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
      <el-form-item label="状态" prop="status">
        <el-select
          v-model.trim="formModel.status"
          class="select-item"
          placeholder="请选择状态"
          :disabled="isDisabled"
          clearable
        >
          <el-option
            v-for="item in brandStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model.trim="formModel.sort"
          controls-position="right"
          class="select-item"
          :disabled="isDisabled"
          :min="1"
          :max="10000"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="品牌LOGO" prop="logo">
        <el-input v-model.trim="formModel.logo" :disabled="isDisabled" class="select-item"/>
      </el-form-item>
      <el-form-item label="封面图地址" prop="previewUrl">
        <el-input v-model.trim="formModel.previewUrl" :disabled="isDisabled" class="select-item"/>
      </el-form-item>
      <el-form-item label="封面视频" prop="videoUrl">
        <el-input v-model.trim="formModel.videoUrl" :disabled="isDisabled" class="select-item"/>
      </el-form-item>
      <el-form-item label="品牌介绍" prop="intro">
        <el-input type="textarea" v-model.trim="formModel.intro" :disabled="isDisabled"/>
      </el-form-item>
      <el-form-item label="品牌描述">
        <el-input type="textarea" v-model.trim="formModel.description" :disabled="isDisabled"/>
      </el-form-item>
      <!-- <el-form-item label="封面图" prop="previewUrl">
      <el-upload
        class="upload-demo"
        action="//jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-form-item>

    <el-form-item label="封面视频" prop="videoUrl">
      <el-upload
        class="upload-demo"
        action="//jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileVideoList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传mp4文件，且不超过1M</div>
      </el-upload>
      </el-form-item>-->
      <el-form-item class="form-btn" v-if="!isDisabled">
        <el-button :loading="btnLoading" type="primary" @click.native.prevent="submitHandle">保存</el-button>
      </el-form-item>
    </el-form>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
export default {
  name: 'brandInfo',
  mixins: [MixinForm],
  data() {
    return {
      formModel: {
        country: '',
        name: '',
        ename: '',
        consumer: '',
        logo: '',
        intro: '',
        description: '',
        previewUrl: '',
        videoUrl: '',
        status: 1,
        sort: 100
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
        ],
        previewUrl: [
          { required: true, message: '请填写封面图URL', trigger: 'blur' }
        ],
        videoUrl: [
          { required: true, message: '请填写封面视频URL', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      },
      fileList: [],
      fileVideoList: [],
      brandStatus: [
        {
          value: 1,
          label: '启用'
        },
        {
          value: 2,
          label: '禁用'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      const { id } = this.$route.params
      this.isDisabled = true
      if (id) {
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
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增品牌',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
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
    },
    handleRemove(file, fileList) { // 删除文件
      console.log(file, fileList)
    },
    handlePreview(file) { // 已上传的文件时的钩子
      console.log(file)
    },
    handleExceed(files, fileList) { // 文件超出个数限制时的钩子
      this.$msgTip(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) { // 删除文件之前的钩子
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>
<style lang='less' scoped>
.form {
  min-height: calc(100vh - 128px);
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