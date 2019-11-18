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
    >
      <g-basic
        is-tag
        :is-view="true"
        :is-disabled="isDisabled"
        :data-obj="formModel"
        ref="basicRef"
        title="基础信息"
      ></g-basic>
      <g-params
        :is-view="false"
        :is-disabled="isDisabled"
        :data-obj="curTags"
        ref="paramsRef"
        title="属性信息"
        @set-tag="setTagValue"
      ></g-params>
      <el-form-item class="form-btn">
        <el-button
          :loading="btnLoading"
          size="medium"
          type="primary"
          @click.native.prevent="submitHandle"
        >保存</el-button>
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
import GBasic from '../detail/basic'
import GParams from './params'
import MultiSelect from '@/views/common/multiSelect'
import MixinForm from 'mixins/form'
import CDialog from 'components/dialog'
import utils from 'utils'

export default {
  name: 'goodsLabelDetail',
  mixins: [MixinForm],
  components: {
    CDialog,
    GBasic,
    GParams,
    MultiSelect
  },
  data() {
    return {
      isDisabled: false,
      formModel: {},
      dialogObj: {},
      curTags: [], // 所有标签集合
      btnLoading: false,
      rules: {},
      tagIndex: '' // 标签下标
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    getCheckedTags() {
      const { goodsBn } = this.formModel
      this.$api.settings.getTagrelate({
        goodsBn
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
    fetchData() {
      const { id } = this.$route.params
      this.$api.goods.getDetail({ id }).then(res => {
        this.setTagsViewTitle()
        if (res) {
          this.formModel = res
          this.getAttrs()
          window.setTimeout(() => {
            this.getCheckedTags()
          }, 50)
        } else {
          this.$msgTip('接口数据异常，请稍后重新尝试', 'warning')
        }
      })
    },
    getAttrs() {
      this.$api.settings.getAllTab().then(data => {
        if (data && data.length) {
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
          const { goodsBn } = this.formModel
          const tags = []
          this.curTags.forEach(res => {
            if (utils.isArray(res.checkedTag)) {
              res.checkedTag.forEach(val => {
                tags.push({
                  tagId: res.id,
                  tagName: res.name,
                  tagValueId: val,
                  goodsBn
                })
              })
            } else if (res.checkedTag) {
              tags.push({
                tagId: res.id,
                tagName: res.name,
                tagValueId: res.checkedTag,
                goodsBn
              })
            }
          })
          this.$api.settings.addTagrelate({
            tags
          }).then(res => {
            this.$msgTip('保存成功')
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
  padding: 15px 15px;
  .form-btn {
    margin-left: 20px;
    margin-top: 20px;
  }
}
</style>