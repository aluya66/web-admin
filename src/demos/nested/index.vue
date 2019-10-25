<template>
	<div style="padding:30px;">
		<el-alert :closable="false" title="nested">
			<router-view />
		</el-alert>
	</div>
</template>
