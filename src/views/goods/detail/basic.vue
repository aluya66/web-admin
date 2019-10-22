<template>
  <c-card :name="title" class="form-card">
    <el-form-item label="商品类目:">
      <el-cascader
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        placeholder="搜索商品类目名称"
        v-model="formModel.categoryCode"
        :options="categoryList"
        filterable
      ></el-cascader>
      <span v-else>{{formModel.categoryName}}</span>
    </el-form-item>
    <el-form-item label="经营类型:" prop="goodsBusinessId">
      <el-select
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model="formModel.goodsBusinessId"
        placeholder="请选择经营类型"
      >
        <el-option
          v-for="item in businessArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span
        v-else
      >{{formModel.goodsBusinessId ? businessArr[formModel.goodsBusinessId - 1].label : ''}}</span>
    </el-form-item>
    <el-form-item label="商品类型:" prop="goodsTypeId">
      <el-select
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model="formModel.goodsTypeId"
        placeholder="请选择商品类型"
      >
        <el-option
          v-for="item in goodsTypeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span v-else>{{formModel.goodsTypeId ? goodsTypeArr[formModel.goodsTypeId - 1].label : ''}}</span>
    </el-form-item>
    <el-form-item label="商品名称:" prop="goodsName">
      <el-input
        v-if="!isView"
        class="select-item"
        v-model.trim="formModel.goodsName"
        :size="size"
        :disabled="isDisabled"
        placeholder="请输入商品名称"
        clearable
      />
      <span v-else>{{formModel.goodsName}}</span>
    </el-form-item>
    <el-form-item label="商品短名称:">
      <el-input
        v-if="!isView"
        class="select-item"
        v-model.trim="formModel.goodsShortName"
        :size="size"
        :disabled="isDisabled"
        placeholder="请输入商品短名称"
        clearable
      />
      <span v-else>{{formModel.goodsShortName}}</span>
    </el-form-item>
    <el-form-item label="封面图片:">
      <c-image
        class="coverImg"
        :url="formModel.coverImg"
        fit="contain"
        :preview-src-list="[formModel.coverImg]"
      ></c-image>
    </el-form-item>
    <el-form-item label="品牌:">
      <el-select
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model="formModel.brandId"
        filterable
        placeholder="请选择品牌"
      >
        <el-option
          v-for="item in brandList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span v-else>{{formModel.brandName}}</span>
    </el-form-item>
    <el-form-item label="商品来源:">
      <el-select
        v-if="!isView"
        :disabled="isDisabled"
        class="select-item"
        v-model="formModel.origin"
        filterable
        placeholder="请选择商品来源"
      >
        <el-option
          v-for="item in originList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span v-else>{{formModel.origin ? originList[formModel.origin -1].label : ''}}</span>
    </el-form-item>
    <el-form-item label="商品展示:">
      <c-upload
        ref="curUpload"
        class="pic"
        :fileList="formModel.fileList"
        is-auto
        :size="20"
        :limit="5"
        :disabled="isView || isDisabled"
        action-path="/auth/uploadFile"
        upload-style="picture-card"
        @upload-success="uploadSuccess"
        @upload-remove="uploadRemove"
        @upload-review="uploadReview"
      >
        <i class="el-icon-plus"></i>
        <div class="info">上传图片/视频应小于20M</div>
      </c-upload>
    </el-form-item>
    <el-form-item label="商品简介:">
      <el-input
        v-if="!isView"
        type="textarea"
        :disabled="isDisabled"
        :rows="4"
        v-model.trim="formModel.goodsBrief"
        :size="size"
        placeholder="请输入商品简介"
        clearable
      />
      <p v-else>{{formModel.goodsBrief}}</p>
    </el-form-item>
  </c-card>
</template>
<script>
import CCard from 'components/card'
import CUpload from 'components/upload'
import CImage from 'components/image'
import utils from 'utils'

export default {
  data() {
    return {
      businessArr: [{
        label: '自营',
        value: 1
      }],
      goodsTypeArr: [{
        label: '服装',
        value: 1
      }],
      originList: [{
        label: '门店挂板',
        value: 1
      }, {
        label: '代销商品',
        value: 2
      }, {
        label: '自营商品',
        value: 3
      }],
      categoryList: [],
      brandList: []
      // formModel: {
      //   goodsName: '',
      //   categoryCode: '',
      //   categoryName: '',
      //   goodsBusinessId: '',
      //   goodsShortName: '',
      //   goodsBn: '',
      //   coverImg: '',
      //   brandId: '',
      //   brandName: '',
      //   fileListL: [],
      //   goodsBrief: ''
      // }
    }
  },
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    isView: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formModel() {
      const { categoryCode, goodsBusinessId, goodsTypeId, brandName, brandId, goodsName, goodsShortName, goodsStaticFiles, goodsBrief, origin, coverImg, categoryName } = this.dataObj
      const fileList = goodsStaticFiles && goodsStaticFiles.length ? goodsStaticFiles.map(res => ({
        name: res.imageId,
        url: res.imageUrl,
        videoUrl: res.videoUrl,
        fileType: res.fileType
      })) : []

      console.log(fileList, this.dataObj)

      const curCategoryCode = []
      if (categoryCode) {
        const codeLen = categoryCode.split('')
        codeLen.forEach((res, index) => {
          if (index % 2 === 0 && index + 2 <= codeLen.length) {
            curCategoryCode.push(categoryCode.substr(0, index + 2))
          }
        })
      }
      console.log(curCategoryCode)
      // const categoryCode = [categoryCode.substr(0, 2), categoryCode.substr(2, 4)]
      return { fileList, categoryName, categoryCode: curCategoryCode, goodsBusinessId, brandName, brandId, goodsTypeId, goodsName, goodsShortName, goodsBrief, origin, coverImg }
    }
  },
  mounted() {
    this.getCategoryList()
    this.getbrandList()
  },
  methods: {
    getCategoryList() {
      this.$api.basic.queryCategoryAll().then(res => {
        this.categoryList = utils.formartLevelData(res)
      })
    },
    getbrandList() {
      this.$api.basic.brandList({
        pageNum: 1,
        numPerPage: 100
      }).then(res => {
        const { data, totalCount } = res
        if (totalCount) {
          this.brandList = data.map(val => ({
            label: val.name,
            value: val.id
          }))
        }
      })
    },
    uploadSuccess(response, file, fileList) {
      this.fileList = fileList
    },
    uploadRemove(file, fileList) {
      this.fileList = fileList
    },
    uploadReview(file) {
      this.$emit('show-image', file)
    }
  },
  components: {
    CCard,
    CUpload,
    CImage
  }
}
</script>
<style lang="less" scoped>
.form-card {
  .el-form-item {
    width: 98%;
    margin-bottom: 15px;
  }
  .select-item {
    width: 30%;
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
  .coverImg {
    width: 200px;
    height: 200px;
  }
}
</style>
