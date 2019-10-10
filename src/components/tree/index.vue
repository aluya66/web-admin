<template>
	<div class="tree" v-loading="loading">
		<div class="header" v-if="$slots.default">
			<slot />
		</div>
		<el-tree
			ref="treeRef"
			:data="treeData"
			:show-checkbox="selection"
			:check-on-click-node="selection"
			node-key="id"
			:check-strictly="checkStrictly"
			:empty-text="loading ? '数据加载中...' : '暂无数据'"
			:accordion="accordion"
			:default-expand-all="!accordion"
			:default-checked-keys="defaultKeys"
			:expand-on-click-node="false"
			@node-click="handleNodeClick"
			@check-change="checkNodeChange"
			@check="changeCheckbox"
		>
			<span slot-scope="{ node, data }" class="custom-tree-node">
				<span class="name" :title="node.label">{{ node.label }}</span>
				<span>
					<el-button
						v-if="showBtn && node.level <= 3 && node.level >= 0"
						type="text"
						size="mini"
						icon="el-icon-plus"
						@click="() => append(data)"
					/>
					<el-button
						v-if="showBtn"
						type="text"
						size="mini"
						icon="el-icon-delete"
						@click="() => remove(node, data)"
					/>
					<el-button
						v-if="isEdit"
						type="text"
						size="mini"
						icon="el-icon-edit"
						@click="() => edit(data)"
					/>
				</span>
			</span>
		</el-tree>
	</div>
</template>

<script>
import utils from 'utils'

export default {
  name: 'c-tree',
  props: {
    showBtn: {
      type: Boolean,
      default: false
    },
    accordion: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Boolean,
      default: false
    },
    defaultKeys: {
      type: Array,
      default () {
        return []
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    subId: {
      type: Number,
      default: null
    },
    dataPromise: {
      type: Function,
      default () {
        return ''
      }
    },
    noId: {
      type: Boolean,
      default: false
    },
    addAll: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      treeData: [],
      loading: true
    }
  },
  created () {
    const curPromise = this.dataPromise()
    if (curPromise) {
      curPromise.then(res => {
        this.loading = false
        this.treeData = utils.formartTreeData(res, {
          hasAll: this.addAll,
          noId: this.noId
        })
      })
    } else {
      // const subId = this.subId;
      // getRegionTree({ subId: -1 }).then(res => {
      //   this.loading = false;
      //   if (subId) {
      //     this.treeData = formartTreeData(res, {
      //       hasAll: this.addAll,
      //       noId: this.noId
      //     }).filter(val => val.id === subId);
      //   } else {
      //     this.treeData = formartTreeData(res, {
      //       hasAll: this.addAll,
      //       noId: this.noId
      //     });
      //   }
      // });
    }
  },
  methods: {
    append (data) {
      this.$emit('btn-handle', 'add', data)
    },
    remove (node, data) {
      this.$emit('btn-handle', 'remove', data, node)
    },
    edit (data) {
      this.$emit('btn-handle', 'upd', data)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick (val) {
      this.$emit('choose-node', val)
    },
    checkNodeChange (val, isChecked) {
      this.$emit('node-change', val, isChecked, this.$refs.treeRef)
    },
    changeCheckbox (val, node) {
      let curCheckBox = node
      if (this.addAll && this.noId) {
        const treeRefs = this.$refs.treeRef
        const curNode = treeRefs.getNode(val.id)
        const curParent = curNode.parent
        if (curParent && curParent.childNodes) {
          curCheckBox = curParent.childNodes.map(res => ({
            id: res.key,
            label: res.label,
            level: res.level,
            checked: res.checked
          }))
        }
        if (val.label.indexOf('所有') !== -1) {
          curCheckBox.forEach(res => {
            treeRefs.setChecked(res.id, curNode.checked)
          })
          if (curNode.checked) {
            curCheckBox.shift()
          }
        } else {
          const allTree = curCheckBox.shift()
          const hasNoChecked = curCheckBox.some(res => {
            return !res.checked
          })
          if (!curNode.checked) {
            treeRefs.setChecked(allTree.id, curNode.checked)
          } else {
            if (!hasNoChecked) {
              treeRefs.setChecked(allTree.id, curNode.checked)
            }
          }
        }
        curCheckBox = treeRefs.getCheckedNodes().filter(res => res.id > 0)
      }
      this.$emit('checkbox-change', val, curCheckBox)
    }
  }
}
</script>

<style lang="less">
.tree {
	.header {
		margin-bottom: 10px;
	}
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
		padding-right: 20px;
		.name {
			width: 150px;
			.ellipsis();
		}
	}
}
</style>
