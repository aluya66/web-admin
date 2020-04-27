<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
				<!-- $route.meta.name || $t(`route.${$route.meta.title}`) -->
      </div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        hasIndex
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
        <div v-if="dialogObj.isShow">
          <c-dialog
            :is-show="dialogObj.isShow"
            :title="dialogObj.title"
            close-btn
            no-btn
            @before-close="dialogObj.isShow = false"
          >
            <d-detail
              ref="childRef"
              :init-data.sync="dialogObj.initData"
              :is-edit="dialogObj.isEdit"
            ></d-detail>
          </c-dialog>
    </div>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import dictObj from '@/store/dictData'
import CDialog from 'components/dialog'
import DDetail from './detailDialog'

export default {
  name: 'operationManage',
  mixins: [mixinTable],
  components:{
    CDialog,
    DDetail
  },
  data(vm) {
    return {
      dialogObj:{}, //对话框对象
      tableInnerBtns: [
      {
        name: '详情',
        icon: '',
        handle(row) {
          // TODO...
            vm.showDialog({
              title: '意向单详情',
              initData: row
            })
        }
      },{
        name: '编辑',
        icon: '',
        handle(row) {
          // TODO...
          vm.routerLink(`/operation/manage/detail/${row.id}`)
        }
      }],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '单号',
          prop: 'intentionNo'
        },
        {
          label: '姓名',
          prop: 'username',
          search: {
            type: 'input'
          }
        },
        {
          label: '电话',
          prop: 'mobile',
          search: {
            type: 'input'
          }
        },
        {
          label: '版型',
          prop: 'type',
          search: {
            type: 'select',
            optionsList: dictObj.stereotype
          }
        },
        {
          label: '颜色',
          prop: 'color'
        },
        {
          label: '印花',
          prop: 'printing',
          search: {
            type: 'select',
            optionsList: dictObj.intentionStamp
          }
        },
        {
          label: '工艺',
          prop: 'features',
          search: {
            type: 'select',
            optionsList: dictObj.intentionCraft
          }
        },
        {
          label: '状态',
          prop: 'operatorStatus',
          search: {
            type: 'select',
            optionsList: dictObj.intentionStaus
          }
        },
        {
          label: '创建时间',
          prop: 'createdAt'
        },
        {
          label: '更新时间',
          prop: 'updatedAt'
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
      this.$api.operationManage.queryIntentionList({
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
    }
  }
}
</script>
