<template>
  <c-view>
    <template v-slot:headerTab>
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in tabTitle"
          :key="index"
          :label="item.label"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
      <div class="header-btn">
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="showDialog">新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <keep-alive>
        <component ref="childList" v-bind:is="activeName" @showDialog="showDialog" :tag-type="tagTypeList"></component>
      </keep-alive>
    </div>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <label-add
          ref="childRef"
          v-if="activeName === 'labelList'"
          :is-edit="dialogObj.isEdit"
          :init-data.sync="dialogObj.initData"
          :tag-type="tagTypeList"
        ></label-add>
        <type-add
          ref="childRef"
          v-if="activeName === 'typeList'"
          :is-edit="dialogObj.isEdit"
          :init-data.sync="dialogObj.initData"
        ></type-add>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import CDialog from 'components/dialog'
import LabelList from './labelList'
import LabelAdd from './labelAdd'
import TypeList from './typeList'
import TypeAdd from './typeAdd'

export default {
  name: 'settingsLabel',
  components: {
    CDialog,
    LabelList,
    LabelAdd,
    TypeList,
    TypeAdd
  },
  data(vm) {
    return {
      dialogObj: {}, // 对话框数据
      activeName: 'labelList',
      tagTypeList: [], // 标签类型数据
      tabTitle: [
        {
          value: 'labelList',
          label: '标签管理'
        },
        {
          value: 'typeList',
          label: '标签类型'
        }
      ]
    }
  },
  created() {
    this.getTagType()
  },
  methods: {
    // 获取标签类型数据
    getTagType() {
      this.$api.settings.getGoodsTabType().then(res => {
        if (res.data) {
          this.tagTypeList = res.data.map(res => ({ label: res.categoryName, value: res.id }))
        }
      })
    },
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          if (!this.dialogObj.isEdit) {
            this.addHandle(childRef)
          } else {
            this.editHandle(childRef)
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
        title: opts.title || (this.activeName === 'labelList' ? '新增标签' : '新增标签类型'),
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    addHandle(childRef) {
      const { formModel } = childRef
      if (this.activeName === 'labelList') {
        this.$api.settings.addTag(formModel).then(res => {
          this.responeHandle()
        })
      } else {
        this.$api.settings.addTagCate(formModel).then(res => {
          this.responeHandle()
        })
      }
    },
    editHandle(childRef) {
      if (this.activeName === 'labelList') {
        const { delArr, formModel } = childRef
        const { tagValues, ...other } = formModel
        this.$api.settings.updateTag({
          ...other,
          addAndUpdate: tagValues,
          del: delArr
        }).then(res => {
          this.responeHandle('更新成功')
        })
      } else {
        const { formModel } = childRef
        this.$api.settings.updateTagCate(formModel).then(res => {
          this.responeHandle('更新成功')
        })
      }
    },
    /**
     * 新增&编辑保存时,请求返回通用处理函数
     * @param {*} msg
     */
    responeHandle(msg = '新增成功') {
      this.dialogObj.isShow = false
      this.$msgTip(msg)
      this.$refs.childList.fetchData()
    }
  }
}
</script>
