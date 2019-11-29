<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button
          type="primary"
          v-permission="$route.meta.roles"
          :size="size"
          icon="el-icon-plus"
          @click="routerLink('/basic/brandInfo')"
        >新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :size="size"
        :loading="isLoading"
        :max-height="maxHeight"
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

const statusSelect = [{
  value: 1,
  label: '启用'
}, {
  value: 2,
  label: '禁用'
}]

export default {
  name: 'brand',
  mixins: [mixinTable],
  data(vm) {
    return {
      tableInnerBtns: [
        // {
        //   width: 150,
        //   name: '编辑',
        //   icon: 'el-icon-edit',
        //   handle(row) {
        //     vm.routerLink(`/basic/brandInfo/${row.id}`)
        //   }
        // },
        {
          name: '添加标签',
          icon: 'el-icon-plus',
          handle(row) {
            vm.routerLink(`/basic/brandLabel/${row.id}`)
          }
        }
        // {
        //   name: '删除',
        //   icon: 'el-icon-delete',
        //   handle(row) {
        //     const { name, id } = row
        //     vm.confirmTip(`确认删除${name}品牌信息`, () => {
        //       vm.deleteData({ id })
        //     })
        //   }
        // }
      ],
      tableHeader: [
        {
          label: '品牌LOGO',
          prop: 'logo',
          width: 100,
          isImage: true
        },
        {
          label: '品牌名称',
          prop: 'name',
          search: {
            type: 'input'
          }
        },
        {
          label: '品牌别名',
          prop: 'ename',
          search: {
            type: 'input'
          }
        },
        {
          label: '品牌描述',
          prop: 'description'
        },
        {
          label: '品牌介绍',
          prop: 'intro'
        },
        {
          label: '品牌国家',
          prop: 'country',
          width: 120,
          search: {
            type: 'input'
          }
        },
        {
          label: '封面图',
          prop: 'previewUrl',
          width: 100,
          isImage: true
        },
        {
          label: '封面视频',
          prop: 'videoUrl',
          width: 100
        },
        {
          label: '品牌状态',
          prop: 'statusCN',
          width: 100,
          search: {
            type: 'dict',
            prop: 'status',
            optionsList: statusSelect
          }
        },
        {
          label: '消费人群',
          prop: 'consumer',
          width: 100
        },
        // {
        //   label: '创建人',
        //   prop: 'createdby',
        //   width: 100
        // },
        // {
        //   label: '更新人',
        //   prop: 'updatedby',
        //   width: 100
        // },
        {
          label: '创建时间',
          prop: 'created',
          width: 100,
          search: {
            type: 'dateTime',
            prop: 'dateTime'
          }
        },
        {
          label: '更新时间',
          prop: 'updated',
          width: 100
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
      this.$api.basic
        .brandList({
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
    deleteData(param, msgTip = '删除成功') {
      // 主要修改接口
      this.$api.basic.deleteBrand(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    }
  }
}
</script>
