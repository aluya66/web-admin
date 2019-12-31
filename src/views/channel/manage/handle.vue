<template>
  <el-form ref="formRef" :model="formModel" label-width="120px" class="form" label-position="right">
    <el-form-item label="所属渠道:" prop="parentChannelId" v-if="channelType === '子渠道'">
      <el-select
        v-model="formModel.parentChannelId"
        class="select-item"
        clearable
        :disabled="isEdit"
      >
        <el-option
          v-for="item in channelList"
          :key="item.channelId"
          :label="item.channelName"
          :value="item.channelId"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="渠道名称:" prop="channelName">
      <el-input v-model.trim="formModel.channelName" class="form-item" placeholder="请输入渠道名称"/>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    initData: {
      type: Object,
      default() {
        return {
          name: '', // 会员名称
          isEnable: 1 // 状态
        }
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    channelType: String
  },
  data() {
    return {
      channelList: [], // 主渠道列表 下拉框数据
      rules: {
        channelName: [{ required: true, message: '渠道名称不能为空', trigger: 'blur' }],
        channelType: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  created() {
    this.channelType !== '主渠道' && this.getChannelList()
  },
  computed: {
    formModel() {
      return this.initData
    }
  },
  methods: {
    getChannelList() {
      this.$api.channel.getChannel({
        pageNo: 1,
        pageNum: 100,
        channelType: 1 // 只获取主渠道
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data } = res
          this.channelList = data || []
        } else {
          this.channelList = res || []
        }
      })
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
}
.body .el-select {
  position: fixed !important;
}
.select-item {
  width: 50%;
}
</style>
