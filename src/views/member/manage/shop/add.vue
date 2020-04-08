<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="form"
    label-position="right"
    status-icon
  >
		<el-form-item label="名称:" prop="name">
			<el-input v-model.trim="formModel.name" class="form-item" clearable></el-input>
		</el-form-item>
    <el-form-item label="电话号码:" prop="phone">
			<el-input :disabled="isEdit" v-model.trim="formModel.phone" class="form-item" clearable></el-input>
		</el-form-item>
		<el-form-item label="角色:" prop="role">
			<query-dict
				:dict-list="shopRole"
				class="select-item"
				placeholder="请选择"
				:value.sync="formModel.role"
			></query-dict>
		</el-form-item>
		<el-form-item label="店铺:" prop="shopId">
       <el-select
          v-model="formModel.shopId"
          class="select-type"
          clearable
          :disabled="isEdit"
        >
          <el-option
            v-for="item in shopList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="状态:" prop="status">
      <query-dict
          :dict-list="shopStatus"
          class="select-item"
          placeholder="请选择"
          :value.sync="formModel.status"
        ></query-dict>
    </el-form-item>
    <el-form-item label="添加个人分享二维码:" prop="fileList">
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
  </el-form>
</template>

<script>
import dictObj from '@/store/dictData'
import CUpload from 'components/upload'
import MixinForm from 'mixins/form'
import utils from 'utils'

export default {
  mixins: [MixinForm],
  components: {
    CUpload
  },
  props: {
    initData: {
      type: Object,
      default() {
        return {
          // TODO... 初始化数据，需加备注
        }
      }
    },
    shopList: {
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
      shopRole: dictObj.shopRole,
      shopStatus: dictObj.openStatus,
      rules: {
        name: [{ required: true, message: '请填写地区编码', trigger: 'blur' }],
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: utils.validater.phoneNumber, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        shopId: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
        status: [{ required: true, message: '请填写状态', trigger: 'blur' }]
      },
      imageUrl: '',
      formModel: {}
    }
  },
  created() {
    this.formModel = {
      fileList: [],
      // ...this.initData,
      name:this.initData.name,
      phone:this.initData.phone,
      role:this.initData.role,
      shopId:this.initData.shopId,
      status:this.initData.status,
      staffId:this.initData.staffId
    }
    if (this.initData.userQrcode) {
      this.formModel.fileList = [{ name: '图片', url: this.initData.userQrcode }]
    }
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
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
  .select-item {
	width: 50%;
  }
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
