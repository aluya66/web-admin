<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button type="primary" :size="size" icon="el-icon-plus" @click="showDialog">新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :size="size"
        :max-height="730"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @selection-handle="mutiCheck"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <c-search
            :form-model="searchObj"
            :form-items="searchItems"
            @submit-form="searchSubmit"
            @reset-form="searchReset"
          ></c-search>
          <!-- <div class="check-list" v-if="tableCheckedList.length > 1">
            您已选中 {{ tableCheckedList.length }} 条数据
            <span @click="deleteData">批量删除</span>
          </div>-->
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
        <enum-add ref="childRef" :init-data.sync="dialogObj.initData" :is-edit="dialogObj.isEdit"></enum-add>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import EnumAdd from './add'
import dictObj from '@/store/dictData'

export default {
  name: 'dictList',
  mixins: [mixinTable],
  components: {
    CDialog,
    EnumAdd
  },
  data(vm) {
    return {
      // dictOpts: { // 字典参数, 路由页面需要配置
      //   codes: [], // ['disabled']
      //   dictLob: ''
      // },
      dialogObj: {}, // 对话框数据
      tableInnerBtns: [
        {
          width: 130,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            vm.showDialog({
              title: '编辑字典',
              initData: row,
              isEdit: true
            })
          }
        }
        // {
        //   name: '删除',
        //   icon: 'el-icon-delete',
        //   handle(row) {
        //     const { dictName, dictCode } = row
        //     vm.confirmTip(`确认删除 ${dictName} 字典?`, () => {
        //       vm.deleteData({ dictCode })
        //     })
        //   }
        // }
      ],
      tableHeader: [
        {
          label: '字典名称',
          prop: 'dictName',
          fixed: true,
          search: {
            type: 'input'
          }
        },
        {
          label: '字典编码',
          prop: 'dictCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '业务线',
          prop: 'dictLob',
          formatter(row) {
            const lobObj = row.dictLob && dictObj.lobListAll.find(res => row.dictLob === res.value)
            return lobObj ? lobObj.label : ''
          },
          search: {
            type: 'dict',
            optionsList: dictObj.lobListAll
          }
        },
        {
          label: '字典值',
          prop: 'values',
          width: 400,
          formatter(row) {
            return row.values.map(item => item.dictValue).join('/')
          },
          search: {
            type: 'input',
            prop: 'dictValue'
          }
        },
        {
          label: '字典描述',
          prop: 'remark'
        },
        {
          label: '状态',
          prop: 'status',
          width: 100,
          formatter(row) {
            const curVal = row.status && dictObj.disStatus.find(res => row.status === res.value)
            return curVal ? curVal.label : ''
          },
          search: {
            type: 'dict',
            optionsList: dictObj.disStatus
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
      this.$api.settings.getDictList({
        ...searchDate,
        ...other,
        ...page
      })
        .then(res => {
          this.isLoading = false
          if (res && res.totalCount) {
            const { data, totalCount } = res
            this.pageInfo.totalNum = totalCount
            this.tableList = data
          } else {
            this.tableList = res
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
            this.editHandle(childRef)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增字典',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    addHandle(formModel) {
      this.$api.settings.addDict(formModel).then(res => {
        this.$msgTip('新增成功')
        this.dialogObj.isShow = false
        this.fetchData()
      })
    },
    editHandle(childData) {
      const { delArr, formModel } = childData
      const { values, ...other } = formModel
      this.$api.settings.updateDict({
        ...other,
        update: values,
        del: delArr
      }).then(res => {
        this.$msgTip('修改成功')
        this.dialogObj.isShow = false
        this.fetchData()
      })
    },
    deleteData(param, msgTip = '删除成功') {
      let curPromise = this.$api.settings.deleteDictByCode
      if (!param) {
        if (this.tableCheckedList.length) {
          param = { dictCodes: this.tableCheckedList }
          curPromise = this.$api.settings.deleteDictbyCodes
        }
      }
      curPromise(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    },
    mutiCheck(val) {
      this.tableCheckedList = val.map(res => res.dictCode)
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
