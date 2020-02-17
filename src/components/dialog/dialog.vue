<template>
	<el-dialog
		:title="title"
		:width="width"
		:visible="isShow"
		:before-close="handleClose"
		:close-on-click-modal="closeModal"
		:show-close="closeBtn"
    v-bind="$attrs"
    v-on="$listeners"
	>
    <div slot="title" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="dialog-info" v-if="$slots.headerInfo">
      <slot name="headerInfo"></slot>
    </div>
		<div class="dialog-content">
			<slot />
		</div>
		<div v-if="!noBtn" slot="footer" class="dialog-footer">
			<el-button
				v-for="(btn, index) in btns"
				:key="index"
				:type="btn.type"
        :plain="btn.plain"
				:disabled="btn.disabled"
				:size="btn.size"
				:loading="btn.loading"
				@click.prevent="btnHandle(btn, index)"
			>
				{{ btn.label }}
			</el-button>
      <div class="dialog-info" v-if="$slots.info">
        <slot name="info"></slot>
      </div>
		</div>
	</el-dialog>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'CDialog',
  props: {
    title: {
      type: String,
      default: '提示'
    },
    isShow: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '50%'
    },
    noBtn: {
      type: Boolean,
      default: false
    },
    closeBtn: {
      type: Boolean,
      default: false
    },
    btns: {
      type: Array,
      default () {
        return [
          { label: '取 消', name: 'cancel' },
          { label: '确 认', name: 'submit', type: 'primary' }
        ]
      }
    },
    closeModal: {
      // 点击空白区域关闭对话框
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogFormVisible: false
    }
  },
  watch: {
    isShow (val) {
      this.dialogFormVisible = val
    }
  },
  methods: {
    btnHandle (btn) {
      if (btn.name === 'cancel') {
        this.onCancel()
      }
      if (btn.name === 'submit') {
        this.onSubmit(btn)
      }
      btn.handle && btn.handle()
    },
    onCancel () {
      this.$emit('on-cancel')
      this.handleClose()
    },
    onSubmit (btn) {
      this.$emit('on-submit', btn.label)
    },
    handleClose () {
      this.$emit('before-close')
    }
  }
}
</script>

<style lang="less" scoped>
.dialog-content {
	max-height: 500px;
	overflow: auto;
}
.dialog-info {
  color: @danger;
  margin-top: 10px;
  text-align: center;
}
</style>
