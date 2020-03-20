<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{$route.meta.name || $t(`route.${$route.meta.title}`)}}
        <el-button type="primary" :size="size" icon="el-icon-plus" @click="showDialog">新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        hasBorder
        hasIndex
        :max-height="maxHeight"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
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
// import dictObj from '@/store/dictData'

export default {
  // name: 'warehouse',
  mixins: [mixinTable],
  components: {
  },
  data(vm) {
    return {
      // 对话框对象
      dialogObj: {},
      // 表格内操作按钮
      tableHeader: [
        // {
        //   label: '仓库名称',
        //   prop: 'whName',
        //   search: {
        //     type: 'input'
        //   },
        //   fixed: true
        // },
        {
          label: '库存编码',
          prop: 'stockCode'
        },
        {
          label: '操作流水号',
          prop: 'flowCode'
        },
        {
          label: '来源',
          prop: 'flowSource'
        },
        {
          label: '商品款号',
          prop: 'productAtrNumber',
          search: {
            type: 'input'
          }
        },
        {
          label: 'sku编码',
          props: 'skuCode'
        },
        {
          label: '变更时间',
          props: 'changeTime'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /*
     * 查询表格列表数据
     */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { dateTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.warehouse
        .queryPlateOccupiedStock({
          ...searchDate,
          ...other,
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
        })
    },
    /**
     * dialog对话框数据处理
     * @opts {*}
     */
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        isEdit: opts.isEdit || false,
        title: opts.title || '创建仓库',
        initData: opts.initData
      }
    }
  }
}
</script>
