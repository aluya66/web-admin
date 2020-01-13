<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :size="size"
        :max-height="685"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
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
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'

export default {
  name: 'goodsSnapshoot',
  mixins: [mixinTable],
  data(vm) {
    return {
      tableInnerBtns: [{
        name: '详情',
        icon: 'el-icon-view',
        handle(row) {
          vm.routerLink(`/goods/manage/snapshootDetail/${row.id}`)
        }
      }],
      tableHeader: [
        {
          label: '商品快照id',
          prop: 'id',
          search: {
            type: 'input'
          }
        },
        {
          label: '商品名称',
          prop: 'goodsName',
          search: {
            type: 'input'
          }
        },
        {
          label: '商品spu编码',
          prop: 'goodsBn',
          search: {
            type: 'input'
          }
        },
        {
          label: '商品sku编码',
          prop: 'goodsSkuSn',
          search: {
            type: 'input'
          }
        },
        {
          label: '创建时间',
          prop: 'created',
          search: {
            type: 'dateTime',
            prop: 'dateTime'
          }
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.goods.getSnapshot(
        {
          ...searchDate,
          ...other,
          ...page
        }
      ).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data
        } else {
          this.tableList = res
        }
      })
    }
  }
}
</script>
