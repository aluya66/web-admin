<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
      <div class="header-btn">
        <el-button
          type="primary"
          :size="size"
          icon="el-icon-plus"
          @click="routerLink('/channel/merchant/detail')"
        >新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :max-height="maxHeight"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :table-inner-btns="tableInnerBtns"
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
import dictObj from '@/store/dictData'

export default {
  name: 'shopMerchant',
  mixins: [mixinTable],
  data(vm) {
    return {
      tableInnerBtns: [{
        width: 150,
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          vm.routerLink(`/channel/merchant/detail/${row.id}`)
        }
      },
      {
        name: '删除',
        icon: 'el-icon-delete',
        notBtn: row => row.businessType === 1, // 合作商显示
        handle(row) {
          const { businessName, id } = row
          vm.confirmTip(`是否确定删除【${businessName}】商户`, () => {
            vm.deleteHandle({ id })
          })
        }
      }],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '商户编码',
          prop: 'businessCode'
        },
        {
          label: '商户名称',
          prop: 'businessName',
          search: {
            type: 'input'
          }
        },
        {
          label: '企业名称',
          prop: 'companyName',
          search: {
            type: 'input'
          }
        },
        {
          label: '商户类型',
          prop: 'businessType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.businessType, 'shopTypeList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.shopTypeList
          }
        },
        {
          label: '负责人',
          prop: 'responsibleName',
          search: {
            type: 'input'
          }
        },
        {
          label: '联系方式',
          prop: 'responsiblePhone',
          search: {
            type: 'input'
          }
        },
        {
          label: '更新人',
          prop: 'opEditor'
        },
        {
          label: '更新时间',
          prop: 'updated'
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
      this.$api.channel.queryBusinessList({
        ...searchDate,
        ...other,
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
    },
    /**
		 * 删除单条表格数据
		 * @id {Number}
		 */
    deleteHandle(params) {
      this.$api.channel.deleteBusiness(params).then(() => {
        this.$msgTip('删除成功')
        this.delResetData()
      })
    }
  }
}
</script>
