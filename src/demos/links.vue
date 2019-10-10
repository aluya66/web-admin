<template>
	<div class="links">
		<div class="title">
			页面路由
		</div>
		<ul>
			<li v-for="(item, key) in items" :key="key">
				<router-link :to="`/${item}`">
					{{ item }}
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
import routes from '../routes/modules'

export default {
  name: 'Links',
  data () {
    return {
      items: []
    }
  },
  created () {
    this.items = Object.keys(routes)
  }
}
</script>

<style scoped>
.links {
	padding: 20px;
}
.title {
	font-size: 30px;
	color: red;
	padding: 20px 40px;
	width: 100%;
	text-align: center;
	margin-bottom: 40px;
}

ul {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

li {
	padding: 10px 20px;
	font-size: 24px;
	border: 1px solid red;
	text-align: center;
	line-height: 28px;
	margin: 10px;
	list-style: none;
}
</style>
