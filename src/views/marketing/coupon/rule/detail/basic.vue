<template>
  <c-card :name="title" class="form-card">
    <el-form-item label="类型名称:" prop="couponRuleName">
      <el-input
        v-if="!isView"
        class="select-item"
        v-model.trim="formModel.couponRuleName"
        :size="size"
        :disabled="isDisabled"
        placeholder="请输入券名称"
        clearable
      />
      <span v-else>{{formModel.couponRuleName}}</span>
    </el-form-item>
    <el-form-item label="城市渠道:" prop="">
      <el-cascader
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        placeholder="检索城市渠道"
        v-model="formModel.categoryCode"
        :options="areaList"
        filterable
      ></el-cascader>
      <span v-else>{{formModel.categoryName}}</span>
    </el-form-item>
    <el-form-item label="应用渠道:" prop>
      <el-select
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model="formModel.goodsTypeId"
        placeholder="请选择商品类型"
      >
        <el-option
          v-for="item in channelList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span v-else>{{formModel.goodsTypeId ? channelList[formModel.goodsTypeId - 1].label : ''}}</span>
    </el-form-item>
    <el-form-item label="限制类型:">
      <el-radio-group v-model="formModel.limit">
        <el-radio
          v-for="item in limitList"
          :key="item.value"
          :disabled="isView || isDisabled"
          :label="item.value"
        >{{item.label}}</el-radio>
      </el-radio-group>
      <el-input
        v-if="!isView"
        class="select-item"
        v-model.trim="formModel.goodsName"
        :size="size"
        :disabled="isDisabled"
        placeholder="请输入时间"
        clearable
      />
    </el-form-item>
  </c-card>
</template>
<script>
import CCard from 'components/card'
import utils from 'utils'

export default {
  data() {
    return {
      areaList: [],
      channelList: [],
      limitList: []
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
    CCard
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
