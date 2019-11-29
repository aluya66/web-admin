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
        noPage
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
        <point-add
          ref="childRef"
          :is-edit="dialogObj.isEdit"
          :init-data="dialogObj.initData"
          :businessList="businessList"
        ></point-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import PointAdd from './add'
import dictObj from '@/store/dictData'

const typeNameSelect = [{
  label: '永久',
  value: 1
}, {
  label: '有效天数',
  value: 2
}]

export default {
  name: 'memberConfigPoint',
  mixins: [mixinTable],
  components: {
    CDialog,
    PointAdd
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
              pointName, // 积分名称
              pointRatio, // 积分获取
              moneyRatio, // 积分汇率
              type, // 积分有效期1 永久   2 有效天数
              days, // type 为2是必填。有效天数
              appCode // 业务线
            } = row
            vm.showDialog({
              title: '编辑积分配置',
              initData: {
                id,
                pointName, // 积分名称
                pointRatio, // 积分获取
                moneyRatio, // 积分汇率
                type, // 积分有效期1 永久   2 有效天数
                days, // type 为2是必填。有效天数
                appCode // 业务线
              },
              isEdit: true
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '业务线',
          prop: 'appCode',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.appCode, 'lobList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.lobList
          }
        },
        {
          label: '积分名称',
          prop: 'pointName',
          search: {
            type: 'input'
          }
        },
        {
          label: '积分获取',
          prop: 'pointRatio'
        },
        {
          label: '积分汇率',
          prop: 'moneyRatio'
        },
        {
          label: '类型',
          prop: 'type',
          formatter(row) {
            return row.type === 1 ? '永久' : '有效天数'
          },
          search: {
            type: 'select',
            optionsList: typeNameSelect
          }
        },
        {
          label: '有效时间(天)',
          prop: 'days'
        },
        {
          label: '创建时间',
          prop: 'created',
          search: {
            type: 'dateTime',
            prop: 'dateTime'
          }
        }
      ],
      businessList: [] // 业务线
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.isLoading = true
      const { dateTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(dateTime)
      this.$api.member.getPointRule({
        ...searchDate,
        ...other
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          this.tableList = res.data || []
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
      this.$api.member.addPointRule(formModel).then(res => {
        this.responeHandle('修改成功')
      })
    },
    editHandle(childData) {
      this.$api.member.updatePointRule(childData).then(res => {
        this.responeHandle('修改成功')
      })
    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增积分配置',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    }
  }
}
</script>
