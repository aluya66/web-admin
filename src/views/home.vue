<template>
	<c-view>
		<template v-slot:header>
			<span class="title">
				首页
			</span>
		</template>
		<div class="box">
			欢迎登录使用{{ title }}！
			<!-- <cell-box title="模块一"></cell-box>
      <cell-box title="模块二"></cell-box> -->
		</div>
	</c-view>
</template>

<script>
// import CellBox from "../common/cellBox";

export default {
  name: 'Dashboard',
  data () {
    return {
      title: process.env.VUE_APP_COMPANY
    }
  },
  components: {
    // CellBox
  }
}
</script>

<style lang="less" scoped>
.title {
	font-size: @f18;
	margin-right: 10px;
}
</style>
