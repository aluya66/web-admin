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
        selection
        hasBorder
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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <settings-add
          ref="childRef"
          :init-data.sync="dialogObj.initData"
          :is-edit="dialogObj.isEdit"
        ></settings-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import SettingsAdd from './add'
import dictObj from '@/store/dictData'

export default {
  name: 'settingsPrice',
  mixins: [mixinTable],
  components: {
    CDialog,
    SettingsAdd
  },
  data(vm) {
    return {
      // 对话框对象
      dialogObj: {},
      tableHeader: [
        {
          label: '价格名称',
          prop: 'priceName',
          search: {
            type: 'input'
          }
        },
        {
          label: '价格类型',
          prop: 'priceType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.priceType, 'channelPriceType')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.channelPriceType
          }
        },
        {
          label: '应用类型',
          prop: 'appliedType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.appliedType, 'channelAppliedType')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.channelAppliedType
          }
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, 'openStatus')
          }
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
      this.$api.settings.queryChannelPriceList({
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
        title: opts.title || '新增价格',
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
          const curAction = this.dialogObj.isEdit ? '' : 'addChannelPrice'
          // TODO...
          this.$api.settings[curAction]({
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
    }
  }
}
</script>
