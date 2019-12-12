<template>
  <div class="customer-select">
    <div class="left-wrapper">
      <el-select v-model="checkedAttr" filterable value-key="code" multiple>
        <el-option
          v-for="(item, index) in sourceList"
          :key="index"
          :label="item.name"
          :value="item"
        ></el-option>
      </el-select>
    </div>
    <div class="right-wrapper">
      <el-tag class="tag-item" v-for="(tag, index) in checkedAttr" :key="index" closable @close="cancelSelect(index)">
				{{tag.name + '【' +tag.phone + '】'}}
			</el-tag>
    </div>
  </div>
</template>
<script>
export default {
  name: 'customerSelect',
  props: {
    disabled: Boolean,
    sourceList: {
      // 源数据集合
      type: Array,
      required: true
    },
    initChecked: {
      // 编辑初始化选中值
      type: Array,
      default() {
        return []
      }
    }
  },
  mounted() {
    this.checkedAttr = JSON.parse(JSON.stringify(this.initChecked))
  },
  data() {
    return {
      checkedAttr: [] // 选中的值
    }
  },
  methods: {
    cancelSelect(index) {
      this.checkedAttr.splice(index, 1)
    }
  }
}
</script>

<style lang='less' scoped>
.customer-select {
	display: flex;
	justify-content: space-between;
  border: 1px solid @border-default;
	border-radius: 4px;
	.left-wrapper, .right-wrapper {
		padding: 15px;
		width: 50%;
		height: 100%;
	}
	.left-wrapper {
		border-right: 1px solid @border-default;
	}
	.right-wrapper {
		.tag-item {
			margin: 5px;
		}
	}
}
</style>
