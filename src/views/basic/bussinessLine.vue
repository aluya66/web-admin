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
        hasBorder
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search">
            <el-form-item label="app名称">
              <el-input
                v-model="searchObj.appName"
                class="search-item"
                :size="size"
                placeholder="请输入app名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="app编码">
              <el-input
                v-model="searchObj.appCode"
                class="search-item"
                :size="size"
                placeholder="请输入app编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="appKey">
              <el-input
                v-model="searchObj.appKey"
                class="search-item"
                :size="size"
                placeholder="请输入appKey"
                clearable
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                v-model="searchObj.status"
                :size="size"
                class="search-item"
                placeholder="请选择状态"
                clearable
              >
                <el-option
                  v-for="item in bussinessLineSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="创建人">
              <el-input
                v-model="searchObj.createdby"
                class="search-item"
                :size="size"
                placeholder="请输入创建人"
                clearable
              />
            </el-form-item> -->
            <el-form-item>
              <el-button
                type="primary"
                class="search-btn"
                :size="size"
                icon="el-icon-search"
                @click="searchSubmit"
              >查询</el-button>
            </el-form-item>
          </el-form>
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
        <bussinessLine-add ref="childRef" :bussinessCode='isEditCode' :init-data="dialogObj.initData"></bussinessLine-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'
import CDialog from 'components/dialog'
import BussinessLineAdd from './bussinessLineAdd'

export default {
  mixins: [mixinTable],
  components: {
    CDialog,
    BussinessLineAdd
  },
  data(vm) {
    return {
      isEditCode: '',
      dialogObj: {}, // 对话框数据
      searchObj: {
        appName: '',
        appCode: '',
        appKey: '',
        status: ''
      },
      bussinessLineSelect: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '启用'
        },
        {
          value: '2',
          label: '禁用'
        }
      ],
      pickerOptions: utils.pickerOptions,
      tableList: [],
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
              createdby,
              id
            } = row
            vm.showDialog({
              title: '编辑业务线',
              initData: {
                appName,
                appCode,
                status: status === '1' ? '启用' : '禁用',
                description,
                createdby,
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
          width: 120,
          fixed: true
        },
        {
          label: 'app编码',
          prop: 'appCode',
          width: 150
        },
        {
          label: 'appKey',
          prop: 'appKey'
        },
        {
          label: '状态',
          prop: 'status',
          width: 120,
          formatter(row) {
            return row.status ? vm.bussinessLineSelect[row.status].label : ''
          }
        },
        // {
        //   label: '创建人',
        //   prop: 'createdby'
        // },
        {
          label: '描述',
          prop: 'description'
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100
        }
      ],

      statusType: '',
      contentModal: false,
      modalTitle: '',
      formLeft: {
        appName: '',
        appCode: '',
        description: '',
        status: '',
        id: ''
      }
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
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
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
      let data = {
        ...childFormModel
      }
      this.$api.basic.addBusiness(data).then(res => {
        this.$msgTip('添加成功')
        this.fetchData()
      })
      this.dialogObj.isShow = false
    },
    editHandle(formModel) {
      let status
      if (formModel.status === '启用' || formModel.status === '1') {
        status = 1
      } else if (formModel.status === '禁用' || formModel.status === '2') {
        status = 2
      }
      let data = {
        ...formModel,
        status
      }
      this.$api.basic.updateBusiness(data).then(res => {
        this.$msgTip('修改成功')
        this.fetchData()
      })
      this.dialogObj.isShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.main__box {
  .search {
    margin-bottom: 10px;
    width: 100%;
    .search-item {
      width: 250px;
    }
  }
}
.title{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
