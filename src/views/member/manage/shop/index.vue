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
        hasBorder
        hasIndex
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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <warehouse-add
          ref="childRef"
          :init-data.sync="dialogObj.initData"
          :is-edit="dialogObj.isEdit"
        ></warehouse-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import dictObj from '@/store/dictData'
import WarehouseAdd from './add'

export default {
  name: 'warehouse',
  mixins: [mixinTable],
  components: {
    CDialog,
    WarehouseAdd
  },
  data(vm) {
    return {
      // 对话框对象
      dialogObj: {},
      // 表格内操作按钮
      tableInnerBtns: [
        {
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const { staffId } = row
            vm.getShopMemberDetail({ staffId })
          }
        }
      ],
      tableHeader: [
        {
          label: '名称',
          prop: 'name',
          search: {
            type: 'input'
          },
          fixed: true
        },
        {
          label: '电话号码',
          prop: 'phone',
          search: {
            type: 'input'
          },
          fixed: true
        },
        {
          label: '客户ID',
          prop: 'staffId',
        },
          {
          label: '所属店铺',
          prop: 'shopName',
          search:{
            type: 'select',
            optionsList: shopList
          }
        },
        {
          label: '角色名称',
          prop: 'role',
          formatter (row) {
            return row && row.roleName
          },
          search: {
            type: 'select',
            optionsList: dictObj.shopRole
          }
        },
        {
          label: '状态',
          prop: 'statusName',
          search: {
            type: 'input'
          }
        },
      ]
    }
  },
  created() {
    this.fetchData()
    this.getShopList()
  },
  methods: {
    getShopList(){
      this.$api.channel.getShopList({
        pageSize: 100,
        pageNo: 1,
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data } = res
          this.shopList = data || []
        } else {
          this.shopList = res || []
        }
      })
    },
    /*
     * 查询表格列表数据
     */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { ...other } = this.searchObj
      this.isLoading = true
      this.$api.member
        .getShopMemberList({
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
    /**
     * dialog对话框数据处理
     * @opts {*}
     */
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        isEdit: opts.isEdit || false,
        title: opts.title || '创建店铺用户',
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
          console.log('childRef.formModel',childRef.formModel)
          const params = {}
          const curAction = this.dialogObj.isEdit
            ? 'updateShopMember'
            : 'addShopMember'
          // this.$api.member[curAction]({
          //   ...params
          // }).then(() => {
          //   this.responeHandle(this.dialogObj.isEdit ? '更新成功' : '新增成功')
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取店铺用户详情
    getShopMemberDetail(params) {
      this.$api.member.getShopMemberDetail(params).then(res => {
        this.showDialog({
          title: '更新店铺用户',
          isEdit: true,
          initData: {
           ...res
          }
        })
      })
    }
  }
}
</script>
