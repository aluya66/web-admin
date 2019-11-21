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
      label-width="120px"
      class="form"
      label-position="right"
      status-icon
    >
      <c-card name="基础信息" class="form-card">
        <el-form-item label="品牌名称:" prop="name">
          <span>{{formModel.name}}</span>
        </el-form-item>
        <el-form-item label="品牌code:" prop="code">
          <span>{{formModel.code}}</span>
        </el-form-item>
        <el-form-item label="品牌logo:">
          <c-image
            class="coverImg"
            :url="formModel.logo"
            fit="contain"
            :preview-src-list="[formModel.logo]"
          ></c-image>
        </el-form-item>
      </c-card>
      <brand-params
        :is-view="false"
        :is-disabled="isDisabled"
        :data-obj="curTags"
        ref="paramsRef"
        title="标签信息"
        @set-tag="setTagValue"
      ></brand-params>
      <el-form-item class="form-btn" v-if="!isDisabled">
        <el-button :loading="btnLoading" type="primary" @click.native.prevent="submitHandle">保存</el-button>
        <el-button @click.native.prevent="goBack">返回</el-button>
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
        <multi-select
          ref="childRef"
          :is-edit="dialogObj.isEdit"
          :source-list="dialogObj.initData"
          :init-checked="dialogObj.initChecked"
        ></multi-select>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
import BrandParams from '@/views/goods/manage/label/params'
import MultiSelect from '@/views/common/multiSelect'
import CImage from 'components/image'
import CCard from 'components/card'
import CDialog from 'components/dialog'
import utils from 'utils'

export default {
  name: 'brandLabel',
  mixins: [MixinForm],
  components: {
    MultiSelect,
    CImage,
    BrandParams,
    CCard,
    CDialog
  },
  data() {
    return {
      btnLoading: false,
      formModel: {
        name: '',
        logo: '',
        code: ''
      },
      isDisabled: false,
      dialogObj: {},
      curTags: [], // 所有标签集合
      tagIndex: '' // 标签下标
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      const { id } = this.$route.params
      if (id) {
        this.$api.basic.getBrandById({ id }).then(res => {
          this.setTagsViewTitle()
          if (res) {
            this.formModel = res
            this.getAttrs()
          } else {
            this.$msgTip('接口数据异常，请稍后重新尝试', 'warning')
          }
        })
      }
    },
    getCheckedTags() {
      const { code } = this.formModel
      this.$api.settings.getTagbrand({
        brandCode: code
      }).then(res => {
        if (res && res.length) {
          this.curTags.forEach((tag, index) => {
            let curCheckedTags = []
            tag.attrs.forEach(val => {
              res.some(item => {
                if (tag.id === item.tagId) {
                  if (val.value === item.tagValueId) {
                    if (tag.operateType === 2) {
                      curCheckedTags.push(item.tagValueId)
                    } else {
                      curCheckedTags = item.tagValueId
                    }
                  }
                }
              })
            })
            this.curTags[index].checkedTag = curCheckedTags
          })
        }
      })
    },
    getAttrs() {
      this.$api.settings.getAllTab({
        categoryType: 2, // 标签类
        categoryName: '品牌类'
      }).then(data => {
        if (data && data.length) {
          this.getCheckedTags() // 获取已选中的标签
          data.forEach((val, index) => {
            const attrs = val.tagValues.map(({ id, value }) => ({ value: id, label: value }))
            this.curTags.push({ attrs, operateType: val.operateType, id: val.id, label: `${val.tagName}:`, name: val.tagName, type: val.categoryName, checkedTag: [] })
          })
        }
      })
    },
    dialogConfirm() {
      const checkedTagsList = this.$refs.childRef.checkedAttr
      this.$set(this.curTags[this.tagIndex], 'checkedTag', checkedTagsList)
      this.dialogObj.isShow = false
    },
    submitHandle() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const { code } = this.formModel
          const tags = []
          this.curTags.forEach(res => {
            if (utils.isArray(res.checkedTag)) {
              res.checkedTag.forEach(val => {
                tags.push({
                  tagId: res.id,
                  tagName: res.name,
                  tagValueId: val,
                  brandCode: code
                })
              })
            } else if (res.checkedTag) {
              tags.push({
                tagId: res.id,
                tagName: res.name,
                tagValueId: res.checkedTag,
                brandCode: code
              })
            }
          })
          this.$api.settings.addTagbrand({
            tags
          }).then(res => {
            this.$msgTip('保存成功').then(() => {
              this.goBack()
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setTagValue(val, checkedList, index) {
      this.tagIndex = index
      this.dialogObj = {
        title: '请选择',
        isShow: true,
        initData: val,
        initChecked: checkedList,
        isEdit: true
      }
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
