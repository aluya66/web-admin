<template>
	<div class="result">
		<div class="msg">
			<span
				>导入结果：共导入{{ totalNum }}个，{{ result.errorNum }}个未导入。</span
			>
			<el-button size="medium" @click="reUpload">重新导入</el-button>
		</div>
		<div class="errlist">
			<div class="title">地域异常信息记录</div>
			<ul>
				<li v-for="(errInfo, index) in result.errList" :key="index">
					{{ errInfo }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
  props: {
    result: {
      type: Object,
      default () {
        return {
          errorNum: 0,
          successNum: 0
        }
      }
    }
  },
  computed: {
    totalNum () {
      return this.result.errorNum + this.result.successNum
    }
  },

  methods: {
    reUpload () {
      this.$emit('re-upload')
    }
  }
}
</script>

<style lang="less">
.result {
	margin: 0px 20px;
	.msg {
		display: flex;
		line-height: 30px;
	}
	.errlist {
		margin-top: 20px;
		border-radius: 4px;
		.title {
			padding: 0px 20px;
			line-height: 40px;
			background-color: @bg;
			font-size: @f16;
		}
		ul {
			li {
				padding: 10px 20px;
				border-bottom: 1px solid #eeeeee;
			}
		}
	}
}
</style>
