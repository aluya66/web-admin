<template>
  <c-view>
    <template v-slot:header>
       <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
        <el-button
          type="primary"
          :size="size"
          icon="el-icon-plus"
          @click="routerLink('/channel/operation/add')"
        >新增</el-button>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
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
// import dictObj from '@/store/dictData'

const statusSelect = [{
  label: '关闭',
  value: 0
}, {
  label: '开启 ',
  value: 1
}, {
  label: '全部',
  value: ''
}]
export default {
  name: 'operation',
  mixins: [mixinTable],
  components: {
  },
  data(vm) {
    return {
      // 对话框对象
      dialogObj: {},
      // 全部区域集合
      areaOptions: [],
      areaProps: {
        expandTrigger: 'click',
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          vm.fetchAreaData(node, (data) => {
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(data)
          })
        }
      },
      // 表格内操作按钮
      tableInnerBtns: [
        {
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            vm.routerLink(`/channel/operation/add/${row.id}`)
          }
        }
        // {
        //   name: '删除',
        //   icon: 'el-icon-delete',
        //   handle(row) {
        //     const { operationName, id } = row
        //     vm.confirmTip(`是否删除【${operationName}】`, () => {
        //       vm.deleteHandle({ id })
        //     })
        //   }
        // }
      ],
      tableHeader: [
        {
          label: '机构编码',
          prop: 'operationCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '机构名称',
          prop: 'operationName',
          search: {
            type: 'input'
          }
        },
        {
          label: '所属商户',
          prop: 'businessName',
          search: {
            type: 'input'
          }
        },
        {
          label: '机构地址',
          formatter(row) {
            return row.areaName
          },
          search: {
            type: 'cascader',
            prop: 'areaCode',
            label: '所属地区',
            optionsProps: {},
            optionsList: []
          }
        },
        {
          label: '详细地址',
          prop: 'operationAddress'
        },
        {
          label: '联系人',
          prop: 'responsibleName',
          search: {
            type: 'input'
          }
        },
        {
          label: '联系电话',
          prop: 'responsiblePhone',
          search: {
            type: 'input'
          }
        },
        {
          label: '状态',
          prop: 'status',
          search: {
            type: 'select',
            optionsList: statusSelect
          },
          formatter(row) {
            return row.status === 0 ? '关闭' : '开启'
          }
        }
      ]
    }
  },
  created() {
    this.fetchData()
    this.setSearchOptionsList('areaCode', this.areaProps, 'optionsProps')
  },
  methods: {
    /**
     *  获取联级区域数据
    */
    fetchAreaData(node = {}, callBack) {
      const { level, value } = node
      this.$api.basic.queryAllRegion({
        parentCode: value || 0
      }).then(res => {
        const data = res.totalCount ? res.data : res
        let curData = []
        if (data && data.length) {
          curData = data.map(res => ({
            leaf: level ? level >= 2 : 0,
            value: res.code,
            label: res.name
          }))
        }
        if (value === 0) {
          this.areaOptions = curData
        } else {
          typeof callBack === 'function' && callBack(curData)
        }
      })
    },

    /*
		 * 查询表格列表数据
		 */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { areaCode, ...other } = this.searchObj
      this.isLoading = true
      this.$api.operation.queryOperationList({
        ...other,
        operationProvince: areaCode[0] || '',
        operationCity: areaCode[1] || '',
        operationDistrict: areaCode[2] || '',
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
      this.$api.operation.deleteOperation(params).then(() => {
        this.$msgTip('删除成功')
        this.delResetData()
      })
    }
  }
}
</script>
