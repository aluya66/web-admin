<template>
  <div class="c-table">
    <slot name="header" />
    <el-table
      ref="multipleTable"
      :stripe="stripe"
      :border="hasBorder"
      :size="size"
      :max-height="maxHeight"
      v-loading="loading"
      :data="tableList"
      :highlight-current-row="highlightCurrentRow"
      :span-method="objectSpanMethod"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @current-change="handleSingleChange"
      @expand-change="handleExpandChange"
      :row-style="rowStyle"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-table-column v-if="expand" :align="align" type="expand" width="55">
        <template slot-scope="scope">
          <slot name="expand" :props="scope.row" />
        </template>
      </el-table-column>
      <el-table-column v-if="selection" :align="align" type="selection" width="55" />
      <el-table-column v-if="hasIndex" label="序号" :fixed="true" align="center" width="60" type="index" :index="index => index + (pageInfo.pageNo - 1) * pageInfo.pageSize + 1" />
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="index"
        :align="align"
        :label="item.label"
        :prop="item.prop"
        :min-width="item.width || 120"
        :fixed="item.fixed"
        :show-overflow-tooltip="item.inline"
      >
        <template slot-scope="scope">
          <c-image
            v-if="item.isImage"
            :url="scope.row[item.prop]"
            fit="contain"
            :preview-src-list="[scope.row[item.prop]]"
          ></c-image>
          <el-popover trigger="hover" placement="top" v-else-if="item.isPopover">
            <p>{{scope.row[item.prop]}}</p>
            <div
              slot="reference"
              class="name-wrapper text-multi-ellipsis"
            >{{ scope.row[item.prop] }}</div>
          </el-popover>
          <div v-else-if="item.vHtml" v-html="item.vHtml(scope.row)"></div>
          <div v-else-if="item.handle" class="title-active" @click="item.handle(scope.row)">
            {{
            item.formatter ? item.formatter(scope.row, index) : scope.row[item.prop]
            }}
          </div>
          <span :class="[item.colClass, item.setColor && item.setColor(scope.row)]" v-else>
            {{
            item.formatter ? item.formatter(scope.row, index) : scope.row[item.prop]
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableInnerBtns.length && hasBtn"
        :width="tableInnerBtns.length && tableInnerBtns[0].width"
        :align="align"
        fixed="right"
        label="操作"
      >
        <!-- <slot name="inline" /> -->
        <template slot-scope="scope">
          <el-button
            v-for="(btn, index) in curBtns(scope.row)"
            :key="index"
            :type="setBtnAttribute(btn, scope.row, 'type') || 'text'"
            :icon="setBtnAttribute(btn, scope.row, 'icon')"
            :size="btn.size || 'mini'"
            @click="
							btn.handle && handleClick(btn.handle, scope.row, scope.$index)
						"
          >
            <template v-if="btn.name === 'more'">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">···</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, curKey) in btn.moreBtns"
                    :key="curKey"
                    :disabled="item.disabled"
                    :divided="item.divided"
                  >
                    <div @click="handleClick(item.handle, scope.row, scope.$index)">{{ item.name }}</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template v-else-if="btn.prop">{{setBtnAttribute(btn, scope.row, 'title')}}</template>
            <template v-else>
              {{
              btn.formatter
              ? btn.formatter(scope.row, scope.$index)
              : btn.name
              }}
            </template>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <slot name="footer" />
    <c-pagination
      v-show="!noPage && tableList.length > 0"
      :auto-scroll="autoScroll"
      :total="pageInfo.totalNum"
      :page.sync="pageInfo.pageNo"
      :limit.sync="pageInfo.pageSize"
      @pagination="changePagination"
    ></c-pagination>
  </div>
</template>

<script>
import CPagination from '../pagination'
import CImage from '../image'

export default {
  inheritAttrs: false,
  name: 'CTable',
  components: {
    CPagination,
    CImage
  },
  props: {
    tableHeader: {
      type: Array,
      default() {
        return []
      }
    },
    tableList: {
      type: Array,
      default() {
        return []
      }
    },
    align: {
      type: String,
      default: 'center'
    },
    noPage: {
      type: Boolean,
      default: false
    },
    tableInnerBtns: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否要扩展行
    expand: {
      type: Boolean,
      default: false
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
      default() {
        return {
          pageNo: 1,
          pageSize: 10,
          totalNum: 0
        }
      }
    },
    autoScroll: {
      type: Boolean,
      default: false
    },
    clearSelect: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'medium'
    },
    stripe: {
      type: Boolean,
      default: true
    },
    hasBorder: {
      type: Boolean,
      default: false
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true
    },
    hasIndex: {
      type: Boolean,
      default: false
    },
    maxHeight: Number,
    rowStyle: Object,
    cellStyle: Object,
    headerCellStyle: Object
  },
  data() {
    return {
      multipleSelection: [], // 当前多选选中记录
      scrollTop: null // table滚动位置
    }
  },
  computed: {
    hasBtn() {
      const { roles } = this.$route.meta
      // const curRoles = this.$store.getters.roleList
      // return curRoles.some(role => roles.includes(role))
      // console.log(this.$store.getters.roleList.includes('review'))
      return roles && roles.length && !roles.includes('review')
    }
  },
  watch: {
    clearSelect(val, old) {
      if (val && val !== old) {
        this.toggleSelection()
      }
    }
  },
  activated() {
    this.saveScroll()
  },
  mounted() {
    // 监听滚动条的位置
    this.$refs.multipleTable.bodyWrapper.addEventListener('scroll', res => {
      this.scrollTop = res.target.scrollTop
    }, false)
  },
  beforeDestroy() {
    this.$refs.multipleTable.bodyWrapper.removeEventListener('scroll', res => {
      this.scrollTop = res.target.scrollTop
    }, false)
  },
  methods: {
    selectAll() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    // 记录当前table滚动记录
    saveScroll() {
      this.$nextTick(() => {
        this.$el.querySelector('.el-table__body-wrapper').scrollTop = this.scrollTop
      })
    },
    // 设置button的type、icon、name
    setBtnAttribute(btn, row, type) {
      const { toggle, name } = btn.prop || {}
      if (name && toggle && type) {
        if (toggle.every((item) => item.value)) { // toggle是否都有value属性, typeof value === array value为状态支持显示的按钮
          let item = toggle.find(item => item.value.includes(row[name]))
          return item ? item[type] : ''
        }
        return toggle[row[name]][type]
      }
      return btn[type]
    },
    curBtns(row) {
      const tableInnerBtns = this.tableInnerBtns.filter(res => {
        if (res.prop && res.prop.toggle && res.prop.toggle.every((item) => item.value)) {
          return res.prop.toggle.some(val => val.value.includes(row[res.prop.name]))
        }
        if (res.notBtn) { // 渠道关联关联后，屏蔽关联按钮 !row[res.notBtn].length
          if (typeof res.notBtn === 'function') { // 多个条件状态，判断是否显示某一个按钮时
            return !res.notBtn(row)
          }
          return Array.isArray(row[res.notBtn]) ? !row[res.notBtn].length : !!row[res.notBtn]
        } else {
          return true
        }
      })
      return tableInnerBtns
    },
    toggleRowSelection(row, flag = true) {
      this.$refs.multipleTable.toggleRowSelection(row, flag)
    },
    // 选中取消
    toggleSelection(rows) {
      if (rows) {
        // 选中元素
        if (this.single) {
          // 单选
          this.$refs.multipleTable.setCurrentRow(rows)
        } else {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      this.$emit('set-column-row', { row, column, rowIndex, columnIndex })
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('selection-handle', val)
    },
    handleSelect(vals, val) {
      this.$emit('handle-select', vals, val)
    },
    handleSelectAll(val) {
      this.$emit('handle-selectall', val)
    },
    // 表格行操作函数
    handleClick(handle, item, index) {
      if (typeof handle === 'string') {
        this.$emit('inner-handle', handle, item, index)
      } else {
        handle(item, index)
      }
    },
    // 单选
    handleSingleChange(val) {
      this.$emit('single-handle', val, this.$refs.multipleTable)
    },
    // 翻页和切换页码
    changePagination(pageInfo) {
      this.$emit('change-pagination', pageInfo)
      this.resetScroll()
    },
    // 展开一行
    handleExpandChange(row) {
      this.$emit('expand-change', row)
      this.resetScroll()
    },
    // 重置滚动位置
    resetScroll() {
      this.scrollTop = 0
      this.saveScroll()
    }
  }
}
</script>

<style lang="less">
.c-table {
  position: relative;
  margin-top: 10px;
  .el-table thead {
    line-height: 0;
  }
  .search-form {
    .el-form-item {
      margin-bottom: 10px;
    }
    margin-bottom: 10px;
    width: 100%;
    .search-item {
      width: 250px;
    }
    .search-number {
      width: 114px;
    }
  }
  .check-list {
    display: inline-block;
    padding: 5px 10px;
    margin-bottom: 5px;
    border: 1px solid @border-default;
    font-size: @f12;
    line-height: @f14;
    border-radius: 3px;
    span {
      color: @active;
      font-weight: bold;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .text-multi-ellipsis {
    .multi-ellipsis(1);
  }
  .tabel-tr {
    background-color: @table-tr;
  }
  .title-active {
    color: @active;
    cursor: pointer;
  }
  // .el-table__fixed, .el-table__fixed-right{
  //   .cell {
  //     word-break: normal;
  //   }
  // }
}
.el-popover {
  max-width: 800px;
}
</style>
