<template>
	<div class="app-content">
		<header v-if="$slots.header">
			<slot name="header"></slot>
		</header>
    <div class="header-tab" v-if="$slots.headerTab">
			<slot name="headerTab"></slot>
		</div>
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
  name: 'CView'
}
</script>

<style lang="less">
.app-content {
  .header-tab{
    position: relative;
    background-color: @white;
    display: flex;
    border-bottom: 1px solid @border-default;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px 0 15px;
    height: 52px;

    .el-tabs__header{
      margin-bottom: 0
    }
    .header-btn{
      margin-bottom: 8px;
    }
  }
	header {
    position: relative;
    background-color: @white;
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
			background-color: @white;
			min-height: calc(100vh - 133px);
		}
	}
}
</style>
