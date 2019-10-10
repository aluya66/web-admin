<template>
	<div class="table-box">
		<slot name="header" />
		<el-table
			ref="multipleTable"
			stripe
			size="small"
			:height="fixedHeight"
			v-loading="loading"
			:data="tableList"
			:highlight-current-row="single"
			:span-method="objectSpanMethod"
			tooltip-effect="dark"
			style="width: 100%"
			@selection-change="handleSelectionChange"
			@current-change="handleSingleChange"
		>
			<el-table-column v-if="selection" type="selection" width="55" />
			<el-table-column
				v-for="(item, index) in tableHeader"
				:key="index"
				:label="item.label"
				:prop="item.prop"
				:width="item.width"
				:show-overflow-tooltip="item.inline"
			>
				<template slot-scope="scope">
					<div v-if="item.vHtml" v-html="item.vHtml(scope.row)"></div>
					<template v-else>
						{{
							item.formatter ? item.formatter(scope.row) : scope.row[item.prop]
						}}
					</template>
				</template>
			</el-table-column>
			<el-table-column
				v-if="innerBtns.length"
				:width="innerBtns.length && innerBtns[0].width"
				label="操作"
			>
				<!-- <slot name="inline" /> -->
				<template slot-scope="scope">
					<el-button
						v-for="(btn, index) in curBtns(scope.row)"
						:key="index"
						type="text"
						size="small"
						@click="
							btn.handle && handleClick(btn.handle, scope.row, scope.$index)
						"
					>
						<span v-if="btn.name === 'more'">
							<el-dropdown trigger="click">
								<span class="el-dropdown-link">···</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item
										v-for="(item, curKey) in btn.moreBtns"
										:key="curKey"
										:disabled="item.disabled"
										:divided="item.divided"
									>
										<div
											@click="handleClick(item.handle, scope.row, scope.$index)"
										>
											{{ item.name }}
										</div>
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</span>
						<span v-else>
							{{
								btn.formatter
									? btn.formatter(scope.row, scope.$index)
									: btn.name
							}}
						</span>
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<slot name="footer" />
		<c-pagination
			v-show="!noPage && tableList.length > 0"
			:total="pageInfo.totalSize"
			:page.sync="pageInfo.currentPage"
			:limit.sync="pageInfo.pageSize"
			@pagination="changePagination"
		></c-pagination>
	</div>
</template>

<script>
import CPagination from '@/components/pagination'
export default {
  name: 'c-table',
  components: {
    CPagination
  },
  props: {
    tableHeader: {
      type: Array,
      default () {
        return []
      }
    },
    tableList: {
      type: Array,
      default () {
        return []
      }
    },
    noPage: {
      type: Boolean,
      default: false
    },
    innerBtns: {
      type: Array,
      default () {
        return []
      }
    },
    selection: {
      type: Boolean,
      default: false
    },
    single: {
      type: Boolean,
      default: false
    },
    pageInfo: {
      type: Object,
      default () {
        return {
          totalSize: 0,
          pageSize: 10,
          currentPage: 1
        }
      }
    },
    clearSelect: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    },
    fixedHeight: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      multipleSelection: []
    }
  },
  watch: {
    clearSelect (val, old) {
      if (val && val !== old) {
        this.toggleSelection()
      }
    }
  },
  methods: {
    curBtns (row) {
      return this.innerBtns.filter(res => {
        if (res.notBtn) {
          return !!row[res.notBtn]
        } else {
          return true
        }
      })
    },
    // 选中取消
    toggleSelection (rows) {
      if (rows) {
        // 选中元素
        if (this.single) {
          // 单选
          this.$refs.multipleTable.setCurrentRow(rows)
        } else {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        }
      } else {
        // 取消选中
        if (this.single) {
          // 单选
          this.$refs.multipleTable.setCurrentRow()
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      }
    },
    // 设置合并表格单元格
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      this.$emit('set-column-row', { row, column, rowIndex, columnIndex })
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.$emit('selection-handle', val)
    },
    // 表格行操作函数
    handleClick (handle, item, index) {
      if (typeof handle === 'string') {
        this.$emit('inner-handle', handle, item, index)
      } else {
        handle(item, index)
      }
    },
    // 单选
    handleSingleChange (val) {
      this.$emit('single-handle', val, this.$refs.multipleTable)
    },
    // 翻页和切换页码
    changePagination (pageInfo) {
      this.$emit('change-pagination', pageInfo)
    }
  }
}
</script>

<style lang="less">
.c-table {
	position: relative;
	min-height: calc(100vh - 150px);
}
</style>
