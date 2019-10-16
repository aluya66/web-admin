<template>
	<div class="app-content">
		<header v-if="$slots.header">
			<slot name="header"></slot>
		</header>
		<main class="main">
			<slot></slot>
		</main>
		<footer v-if="$slots.footer">
			<slot name="footer"></slot>
		</footer>
	</div>
</template>

<script>
export default {
  name: 'CView',
  props: {
    title: String
  }
}
</script>

<style lang="less">
.app-content {
	header {
    position: relative;
    background-color: @bg-main;
    margin-top: 2px;
    padding: 8px 15px;
    border-bottom: 1px solid @border-default;
    display: flex;
		.title {
			font-size: @f18;
      line-height: 30px;
    }
    .header-btn{
      position: absolute;
      right: 15px;
    }
	}
	.main {
    position: relative;
    overflow: hidden;
		&__box {
			overflow: hidden;
			padding: 10px 15px;
			background-color: @bg-main;
			min-height: calc(100vh - 133px);
		}
	}
}
</style>
