<template>
	<div class="app-content">
		<header>
			<slot name="header"></slot>
		</header>
		<main>
			<slot></slot>
		</main>
		<footer>
			<slot name="footer"></slot>
		</footer>
	</div>
</template>

<script>
export default {
  name: 'c-view',
  props: {
    title: String
  }
}
</script>

<style lang="less">
.app-content {
	header {
		background-color: @bg-main;
    margin-bottom: 5px;
    padding: 8px 10px;
		.title {
			font-size: @f18;
      line-height: 32px;
		}
	}
	main {
    overflow: hidden;
    margin: 0 5px;
		.box {
			overflow: hidden;
			padding: 15px 20px;
			background-color: @bg-main;
			min-height: calc(100vh - 100px);
		}
	}
}
</style>
