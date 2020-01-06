<template>
  <div class="customer-select">
    <div class="header">
      <div class="title title-left">用户列表</div>
      <div class="title title-right">
        已选用户:【 {{checkedAttr.length}} 】
        <el-button @click="deleteAll">删除所有</el-button>
      </div>
    </div>
    <div class="content">
      <div class="source">
        <c-table
          ref="customerTableRef"
          selection
          hasBorder
          :max-height="400"
          :size="size"
          :loading="isLoading"
          :table-header="tableHeader"
          :table-list="tableList"
          :page-info="pageInfo"
          :rowStyle="{height:0}"
          :cellStyle="{padding:0}"
          @change-pagination="changePagination"
          @handle-select="handleSelect"
          @handle-selectall="handleSelect"
        >
          <template v-slot:header>
            <c-search
              :form-model="searchObj"
              :form-items="searchItems"
              @submit-form="searchSubmit"
              @reset-form="searchReset"
            ></c-search>
          </template>
        </c-table>
      </div>
      <div class="dist">
        <el-tag
          class="tag-item"
          v-for="(tag, index) in checkedAttr"
          :key="index"
          closable
          @close="cancelSelect(index)"
        >{{tag.nickname + '【' +tag.phoneNumber + '】'}}</el-tag>
      </div>
    </div>
  </div>
</template>
<script>
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  name: 'customerSelect',
  mixins: [mixinTable],
  props: {
    disabled: Boolean,
    paramsObj: { // 额外参数集
      type: Object,
      default() {
        return {}
      }
    },
    initChecked: {
      // 编辑初始化用户选中值
      type: Array,
      default() {
        return []
      }
    }
  },
  mounted() {
    this.checkedAttr = this.initChecked
    utils.setStore('cacheSelectedUserList', this.initChecked)
    this.fetchData()
  },
  data() {
    return {
      finishChangePage: false, // 是否进行了翻页操作， 处理数据缓存合并
      isPageChange: false, // 是否翻页
      tableHeader: [
        {
          label: '头像',
          prop: 'avatar',
          width: 100,
          isImage: true
        },
        {
          label: '用户',
          prop: 'name',
          search: {
            type: 'input'
          }
        },
        {
          label: '昵称',
          prop: 'nickname',
          search: {
            type: 'input'
          }
        },
        {
          label: '电话',
          prop: 'phoneNumber',
          search: {
            type: 'input'
          }
        }
      ],
      checkedAttr: [] // 选中的值
    }
  },
  methods: {
    deleteAll() {
      this.checkedAttr = []
      utils.removeStore('cacheSelectedUserList')
      this.$refs.customerTableRef.$refs.multipleTable.clearSelection()
    },
    changePagination(pageInfo) {
      this.pageInfo.pageNo = pageInfo.page
      this.pageInfo.pageSize = pageInfo.limit
      this.fetchData()
      if (utils.getStore('cacheSelectedUserList')) {
        this.checkedAttr = utils.getStore('cacheSelectedUserList') // 翻页获取缓存已选择数据
      }
      this.finishChangePage = true
    },
    handleSelect(rows) {
      // 当前页选中行
      let selectRows = rows ? rows.map(item => ({ ...item, isSelected: true })) : [] // 设置被选中标识
      console.log(utils.getStore('cacheSelectedUserList'))
      const pageCheckedArr = utils.getStore('cacheSelectedUserList') ? utils.getStore('cacheSelectedUserList') : []
      if (this.finishChangePage || pageCheckedArr) {
        if (pageCheckedArr.length) { // 有选择行，过滤重复
          pageCheckedArr.forEach((item) => {
            let idx = selectRows.findIndex(checkedItem => item.userId === checkedItem.userId)
            idx !== -1 && selectRows.splice(idx, 1)
          })
        }
        this.checkedAttr = pageCheckedArr.concat(selectRows)
      } else { // 无翻页 当前页选中数据即是所有选中行
        this.checkedAttr = selectRows
      }
      // 缓存已选择数据 有翻页操作时进行缓存选中数据
      utils.setStore('cacheSelectedUserList', this.checkedAttr)
      this.$emit('handle-select', rows)
    },
    cancelSelect(index) {
      const tableIdx = this.tableList.findIndex((item) => item.userId === this.checkedAttr[index].userId)
      tableIdx !== -1 && this.$refs.customerTableRef.$refs.multipleTable.toggleRowSelection(this.tableList[tableIdx], false)
      this.checkedAttr.splice(index, 1)
    },
    fetchData() {
      if (this.paramsObj.appCode === '') {
        this.tableList = []
        return
      }
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.member.getMember({
        ...this.searchObj,
        ...this.paramsObj,
        ...page
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data || []
        } else {
          this.tableList = res || []
        }
      })
    }
  }
}
</script>
<style lang="less">
.el-table__expanded-cell {
  padding: 0 !important;
}
</style>
<style lang='less' scoped>
.sku-table {
  margin-top: 0;
  margin-left: 54px;
}
.customer-select {
  border: 1px solid @border-default;
  border-radius: 4px;
  .header {
    position: sticky;
    display: flex;
    border-bottom: 1px solid @border-default;
    .title {
      font-size: @f16;
      font-weight: bold;
      padding: 16px 0;
      text-align: center;
      &.title-left {
        width: 60%;
        border-right: 1px solid @border-default;
      }
      &.title-right {
        width: 40%;
      }
    }
  }
  .content {
    display: flex;
    .source {
      width: 60%;
      padding: 15px;
      border-right: 1px solid @border-default;
      border-bottom: 1px solid @border-default;
      overflow-y: auto;
    }
    .dist {
      width: 40%;
      overflow-y: auto;
      .tag-item {
        margin: 5px;
      }
    }
  }
}
</style>
