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
      <el-cascader
        clearable
        class="select-item"
        :options="areaOptions"
        :props="optionsProps"
        placeholder="选择机构地址"
        filterable
      ></el-cascader>
        <!-- v-model="formModel.addressCode" -->
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
        <!-- <template v-slot:header>
          <c-search
            :form-model="searchObj"
            :form-items="searchItems"
            @submit-form="searchSubmit"
            @reset-form="searchReset"
          ></c-search>
        </template> -->
      </c-table>
    </div>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
				<operation-add ref="childRef" :init-data.sync="dialogObj.initData" :is-edit="dialogObj.isEdit"></operation-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
// import dictObj from '@/store/dictData'
import OperationAdd from './add'

export default {
  name: 'operation',
  mixins: [mixinTable],
  components: {
    CDialog,
    OperationAdd
  },
  data(vm) {
    return {
      // 对话框对象
      dialogObj: {},
      // 全部区域集合
      areaOptions: [],
      optionsProps: {
        value: 'code',
        label: 'name',
        leaf: 2
      },
      // 表格内操作按钮
      tableInnerBtns: [
        {
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            vm.routerLink(`/channel/operation/add/${row.id}`)
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { operationName, id } = row
            vm.confirmTip(`是否删除【${operationName}】`, () => {
              vm.deleteHandle({ id })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '机构编码',
          prop: 'operationCode'
        },
        {
          label: '机构名称',
          prop: 'operationName'
        },
        {
          label: '所属商户',
          prop: 'businessCode'
        },
        {
          label: '机构地址',
          prop: 'operationProvince'
        },
        {
          label: '详细地址',
          prop: 'operationAddress'
        },
        {
          label: '联系人',
          prop: 'responsibleName'
        },
        {
          label: '联系电话',
          prop: 'responsiblePhone'
        },
        {
          label: '状态',
          prop: 'status'
        }
      ]
    }
  },
  created() {
    this.fetchData()
    this.fetchAreaData()
  },
  methods: {
    /**
     *  获取全部区域数据
    */
    fetchAreaData() {
      this.$api.basic.getAllArea().then(res => {
        if (res && res.length) {
          this.areaOptions = res
        }
      })
    },
    /*
		 * 查询表格列表数据
		 */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { dateTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.operation.queryOperationList({
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
     * dialog对话框数据处理
     * @opts {*}
     */
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        isEdit: opts.isEdit || false,
        title: opts.title || '新增',
        initData: opts.initData
      }
    },
    /**
		 * dialog新增、编辑处理函数
		 */
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const params = childRef.formModel
          const curAction = this.dialogObj.isEdit ? 'editOperation' : 'addOperation'
          // TODO...
          this.$api.operation[curAction]({
            // TODO...
            ...params
          }).then(() => {
            this.responeHandle(this.dialogObj.isEdit ? '更新成功' : '新增成功')
          })
        } else {
          console.log('error submit!!')
          return false
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
