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
          @click="showDialog"
        >新增</el-button>
      </div>
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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <bussinessLine-add
          ref="childRef"
          :bussinessCode="isEditCode"
          :init-data="dialogObj.initData"
        ></bussinessLine-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import BussinessLineAdd from './bussinessLineAdd'

const bussinessLineSelect = [
  {
    value: 1,
    label: '启用'
  },
  {
    value: 2,
    label: '禁用'
  }
]

export default {
  name: 'bussiness',
  mixins: [mixinTable],
  components: {
    CDialog,
    BussinessLineAdd
  },
  data(vm) {
    return {
      isEditCode: '',
      dialogObj: {}, // 对话框数据
      tableInnerBtns: [
        {
          width: 130,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              appName,
              appCode,
              status,
              description,
              id
            } = row
            vm.showDialog({
              title: '编辑业务线',
              initData: {
                appName,
                appCode,
                status,
                description,
                id: id
              },
              isEdit: true
            })
          }
        }
      ],
      tableHeader: [
        {
          label: 'app名称',
          prop: 'appName',
          search: {
            type: 'input'
          }
        },
        {
          label: 'app编码',
          prop: 'appCode',
          search: {
            type: 'input'
          }
        },
        {
          label: 'appKey',
          prop: 'appKey',
          width: 580
        },
        {
          label: '状态',
          prop: 'status',
          width: 120,
          formatter(row) {
            return row.status ? bussinessLineSelect[row.status - 1].label : ''
          },
          search: {
            type: 'dict',
            optionsList: bussinessLineSelect
          }
        },
        {
          label: '描述',
          prop: 'description',
          width: 300
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
    /**
     * 获取表格数据
    */
    fetchData() {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.basic.businessList(
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
          this.tableList = data || []
        } else {
          this.tableList = res || []
        }
      })
    },
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          if (!this.dialogObj.isEdit) {
            this.addHandle(childFormModel)
          } else {
            this.editHandle(childFormModel)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showDialog(opts) {
      this.isEditCode = opts.isEdit
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增业务线',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    addHandle(childFormModel) {
      this.$api.basic.addBusiness({ ...childFormModel }).then(res => {
        this.dialogObj.isShow = false
        this.$msgTip('添加成功')
        this.fetchData()
      })
    },
    editHandle(formModel) {
      this.$api.basic.updateBusiness({
        ...formModel
      }).then(res => {
        this.dialogObj.isShow = false
        this.$msgTip('修改成功')
        this.fetchData()
      })
    }
  }
}
</script>
