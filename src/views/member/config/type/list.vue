<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button :size="size" type="primary" icon="el-icon-plus" @click="showDialog">新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :max-height="685"
        :size="size"
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
        <type-add ref="childRef" :is-edit="dialogObj.isEdit" :init-data="dialogObj.initData"></type-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import TypeAdd from './add'
import dictObj from '@/store/dictData'

export default {
  name: 'memberConfigRule',
  mixins: [mixinTable],
  components: {
    CDialog,
    TypeAdd
  },
  data(vm) {
    return {
      dialogObj: {},
      tableInnerBtns: [
        {
          width: 100,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              id,
              name,
              isEnable
            } = row
            vm.showDialog({
              title: '编辑类型配置',
              initData: {
                memberTypeId: id,
                name,
                isEnable
              },
              isEdit: true
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '名称',
          prop: 'name',
          search: {
            type: 'input'
          }
        },
        {
          label: '状态',
          prop: 'isEnable',
          formatter(row) {
            return row.isEnable === 1 ? '启用' : '禁用'
          },
          search: {
            type: 'dict',
            optionsList: dictObj.disStatus
          }
        },
        {
          label: '创建时间',
          prop: 'created',
          search: {
            prop: 'dateTime',
            type: 'dateTime'
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
      this.$api.member.getMemberType({
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
    addHandle(formModel) {
      this.$api.member.addMemberType(formModel).then(res => {
        this.$msgTip('添加成功')
        this.fetchData()
        this.dialogObj.isShow = false
      })
    },
    editHandle(childData) {
      this.$api.member.updateMemberType(childData).then(res => {
        this.$msgTip('修改成功')
        this.fetchData()
        this.dialogObj.isShow = false
      })
    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增类型配置',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    }
  }
}
</script>
