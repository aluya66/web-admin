<template>
  <c-view>
    <template v-slot:headerTab>
      <el-tabs type="card" v-model="tabValue">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.label"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
      <!-- <div class="header-btn">
        <el-button
          type="primary"
          v-permission="$route.meta.roles"
          icon="el-icon-plus"
          size="medium"
          @click="showDialog"
        >新增</el-button>
      </div> -->
    </template>
    <div class="main__box">
      <component
        ref="childList"
        v-bind:is="activeName"
        @showDialog="showDialog"
        :member-id="tabValue"
      ></component>
    </div>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <equit-add ref="childRef" :is-edit="dialogObj.isEdit" :init-data.sync="dialogObj.initData"></equit-add>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import CDialog from 'components/dialog'
import EquityList from './list'
import EquityAdd from './add'

export default {
  name: 'memberManageEquity',
  components: {
    CDialog,
    EquityList,
    EquityAdd
  },
  data(vm) {
    return {
      dialogObj: {}, // 对话框数据
      activeName: 'equityList', // 动态组件名称
      tabValue: '', // 当前会员类型id
      tabList: [] // 会员类型集合
    }
  },
  created() {
    this.getMemberTypeList()
  },
  methods: {
    getMemberTypeList() {
      this.$api.member.getMemberType({
        pageNo: 1,
        pageSize: 20
      }).then(res => {
        if (res && res.totalCount) {
          const { data } = res
          this.tabList = data ? data.map(val => ({
            value: val.id + '',
            label: val.name
          })) : []
          this.tabValue = this.tabList.length ? this.tabList[0].value : ''
        }
      })
    },
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          // const params = childRef.formModel
          // const curAction = this.dialogObj.isEdit ? 'editAccountList' : 'addAccountList'
          // TODO...
          // this.$api.finance[curAction]({
          //   shopId: id,
          //   ...params
          // }).then(res => {
          //   this.responeHandle(this.dialogObj.isEdit ? '更新成功' : '新增成功')
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增权益',
        isEdit: opts.isEdit || false,
        initData: opts.initData
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
