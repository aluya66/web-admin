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
      class="detail-form"
      label-position="right"
      status-icon
    >
      <el-form-item label="品牌名称:" prop="name">
        <el-input v-model.trim="formModel.name" class="select-item" maxlength="50"/>
      </el-form-item>
      <el-form-item label="品牌类型:" prop="type">
        <query-dict
          :dict-list="shopTypeList"
          class="select-item"
          placeholder="请选择品牌类型"
          :value.sync="formModel.type"
        ></query-dict>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <query-dict
          :dict-list="disStatus"
          class="select-item"
          placeholder="请选择品牌状态"
          :value.sync="formModel.status"
        ></query-dict>
      </el-form-item>
      <el-form-item label="品牌LOGO:" prop="fileList">
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
          <div class="info">建议尺寸120*120图片</div>
        </c-upload>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="priceChecked">设置品牌定价倍率</el-checkbox>
      </el-form-item>
      <el-form-item label="平台零售价:" prop="priceRate" v-if="priceChecked">
        <el-input v-model.trim="formModel.priceRate" placeholder="倍率设置，不能为0" class="select-item">
          <template slot="prepend">平台成本价 X</template>
        </el-input>
        <span class="input-info">* 零售价尾数向上取整原则，并且结尾尾数为：29、39、59、69、89、99</span>
      </el-form-item>
      <el-form-item>
        <el-button
          :size="size"
          :loading="btnLoading"
          type="primary"
          @click.native.prevent="submitHandle"
        >保存</el-button>
        <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </c-view>
</template>

<script>
import CUpload from 'components/upload'
import MixinForm from 'mixins/form'
import dictObj from '@/store/dictData'

export default {
  name: 'brandInfo',
  mixins: [MixinForm],
  components: {
    CUpload
  },
  data(vm) {
    const validatePriceRate = (rule, value, callback) => {
      if (vm.priceChecked) {
        if (!value || !Number(value) || Number(value) < 0) {
          callback(new Error('品牌定价倍率为非空数字'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      disStatus: dictObj.disStatus,
      shopTypeList: dictObj.shopTypeList,
      btnLoading: false,
      priceChecked: false,
      formModel: {
        name: '',
        type: '',
        priceRate: '',
        status: 1,
        fileList: [] // 上传图片
      },
      rules: {
        name: [
          { required: true, message: '请填写品牌名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请填选择品牌类型', trigger: 'change' }
        ],
        fileList: [
          { required: true, message: '品牌logo图片不能为空', trigger: 'change' }
        ],
        priceRate: [
          { required: true, validator: validatePriceRate, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    'formModel.fileList': {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.$nextTick(() => {
            this.$refs.formRef.validateField('fileList')
          })
        }
      },
      immediate: false
    }
  },
  methods: {
    fetchData() {
      const { id } = this.$route.params
      if (id) {
        this.$api.basic.getBrandById({ id }).then(res => {
          this.setTagsViewTitle()
          const { logo, priceRate, ...other } = res
          if (priceRate) {
            this.priceChecked = true
          }
          this.formModel = {
            fileList: [{ name: '图片', url: logo }],
            priceRate,
            ...other
          }
        })
      }
    },
    submitHandle() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const { name, priceRate, type, status, fileList } = this.formModel
          const requestMethods = {
            'add': this.$api.basic.addBrand,
            'edit': this.$api.basic.updateBrand
          }
          let request = null
          let params = {
            name,
            priceRate: this.priceChecked ? priceRate : '',
            type,
            status,
            logo: fileList[0].url
          }
          const { id } = this.$route.params
          if (id) {
            request = requestMethods['edit']
            params = { id, ...params }
          } else {
            request = requestMethods['add']
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
    },

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
    }
  }
}
</script>

<style lang="less" scoped>
.detail-form {
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
