<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        <!-- $route.meta.name || $t(`route.${$route.meta.title}`) -->
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
            console.log('row=======,', row)
            const { whCode, refGroupCode } = row
            vm.getWarehouseDetail({ whCode, refGroupCode })
          }
        }
      ],
      tableHeader: [
        {
          label: '仓库名称',
          prop: 'whName',
          search: {
            type: 'input'
          },
          fixed: true
        },
        {
          label: '编码',
          prop: 'whCode'
        },
        {
          label: '仓库属性',
          prop: 'whType',
          formatter(row) {
            return row.whType === 1 ? '可销售' : '不可售'
          },
          search: {
            type: 'select',
            optionsList: dictObj.warehouseSaleType
          }
        },
        {
          label: '仓库类型', // 仓库业务类型：10:仓库，20:店仓
          prop: 'whBusinessType',
          formatter(row) {
            return row.whBusinessType === 10 ? '云仓' : '店仓'
          },
          search: {
            type: 'select',
            optionsList: dictObj.warehouseType
          }
        },
        {
          label: '所属公司',
          prop: 'refGroupCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '仓库地址',
          prop: 'updated',
          formatter(row) {
            return (
              row.provinceName + row.cityName + row.districtName + row.address
            )
          }
        },
        {
          label: '状态',
          formatter(row) {
            return row.status === 10 ? '启用' : '未开启'
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
      this.$api.warehouse
        .queryWarehouseList({
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
    /**
     * dialog对话框数据处理
     * @opts {*}
     */
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        isEdit: opts.isEdit || false,
        title: opts.title || '创建仓库',
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
          const { companyAddressCode, ...other } = childRef.formModel
          const params = {
            ...other,
            provinceCode: companyAddressCode[0],
            cityCode: companyAddressCode[1],
            districtCode: companyAddressCode[2],
            refSource: 2, // 仓库数据来源 1:星助; 2:中台订单
            status: 10 // 仓库状态：10: 有效
          }
          console.log('params=======,,,', params)
          const curAction = this.dialogObj.isEdit
            ? 'editWarehouse'
            : 'addWarehouse'
          this.$api.warehouse[curAction]({
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
    // 获取仓库详情
    getWarehouseDetail(params) {
      this.$api.warehouse.queryWarehouseDetail(params).then(res => {
        const { provinceCode, cityCode, districtCode, ...other } = res
        this.showDialog({
          title: '编辑',
          isEdit: true,
          initData: {
            ...other,
            companyAddressCode: [provinceCode, cityCode, districtCode]
          }
        })
      })
    }
  }
}
</script>
