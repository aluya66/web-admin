<template>
	<div class="tab-btns">
		<div class="label">{{ title }}：</div>
		<el-radio-group v-model="curValue" @change="handleClick">
			<el-radio-button
				v-for="(item, index) in tabsList"
				:key="index"
				:label="item.label"
				>{{ item.title }}</el-radio-button
			>
		</el-radio-group>
	</div>
</template>

<script>
export default {
  name: 'v-tabs',
  props: {
    title: String,
    tabsList: {
      type: Array,
      default () {
        return [
          // tabs筛选数据
          {
            label: '',
            title: '全部'
          },
          {
            label: 1,
            title: '区'
          },
          {
            label: 2,
            title: '街道'
          },
          {
            label: 3,
            title: '社区'
          }
        ]
      }
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      curValue: ''
    }
  },
  created () {
    this.curValue = this.value
  },
  watch: {
    value (value) {
      this.curValue = value
    }
  },
  methods: {
    handleClick (val) {
      this.$emit('update:value', val)
      this.$emit('click-tabs', val)
    }
  }
}
</script>

<style lang="less">
.tab-btns {
	display: flex;
	line-height: 40px;
	margin-right: 20px;
	.el-radio-group {
		line-height: 40px;
	}
}
</style>
