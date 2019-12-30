<template>
  <div class="customer-select">
    <div class="header">
      <div class="title title-left">用户列表</div>
      <div class="title title-right">已选用户:【 {{checkedAttr.length}} 】</div>
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
      // 编辑初始化goods选中值
      type: Array,
      default() {
        return []
      }
    }
  },
  mounted() {
    this.checkedAttr = this.initChecked
    this.fetchData()
  },
  data() {
    return {
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
    handleSelect(rows) {
      this.checkedAttr = rows
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
      })
        .then(res => {
          this.isLoading = false
          if (res && res.totalCount) {
            const { data, totalCount } = res
            this.pageInfo.totalNum = totalCount
            this.tableList = data || []
          } else {
            this.tableList = res || []
          }
          this.checkedAttr.length && this.checkedAttr.forEach((checkedItem) => {
            const idx = this.tableList.findIndex((item) => checkedItem.userId === item.userId)
            if (idx !== -1) {
              this.$nextTick(() => {
                this.$refs.customerTableRef.$refs.multipleTable.toggleRowSelection(this.tableList[idx])
              })
            }
          })
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
