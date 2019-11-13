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
        <component v-bind:is="activeName" @showDialog="showDialog"></component>
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
  methods: {
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          if (!this.dialogObj.isEdit) {
            this.addHandle(childFormModel)
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
    addHandle(formModel) {
      if (this.activeName === 'labelList') {
        let data = {
          ...formModel
        }
        this.$api.basic.addGoodsattrval(data).then(res => {
          this.dialogObj.isShow = false
          this.$msgTip('新增成功')
          this.fetchData()
        })
      } else {

      }
    },
    editHandle(childData) {
      if (this.activeName === 'labelList') {
        const { delArr, formModel } = childData
        const { items, ...other } = formModel
        this.$api.basic.updateGoodsattrval({
          ...other,
          addAndUpdate: items,
          del: delArr
        }).then(res => {
          this.dialogObj.isShow = true
          this.$msgTip('修改成功')
          this.dialogObj.isShow = false
          this.fetchData()
        })
      } else {

      }
    }
  }
}
</script>
