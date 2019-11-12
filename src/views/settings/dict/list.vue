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
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
            <el-form-item label="字典编码">
              <el-input
                v-model="searchObj.dictName"
                class="search-item"
                :size="size"
                placeholder="字典编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="字典编码">
              <el-input
                v-model="searchObj.dictCode"
                class="search-item"
                :size="size"
                placeholder="字典编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="业务线编码">
              <el-input
                v-model="searchObj.dictLob"
                class="search-item"
                :size="size"
                placeholder="业务线编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="字典值">
              <el-input
                v-model="searchObj.dictValue"
                class="search-item"
                :size="size"
                placeholder="字典值"
                clearable
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                v-model="searchObj.status"
                :size="size"
                class="search-item"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <!-- <query-dict
                :dict-list="dictData[dictOpts.codes[0]]"
                class="search-item"
                :size="size"
                :value.sync="searchObj.status"
              ></query-dict> -->
            </el-form-item>
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
// import utils from 'utils'

export default {
  name: 'dictList',
  mixins: [mixinTable],
  components: {
    CDialog,
    EnumAdd
  },
  data(vm) {
    return {
      dictOpts: { // 字典参数, 路由页面需要配置
        codes: [], // ['disabled']
        dictLob: ''
      },
      dialogObj: {}, // 对话框数据
      searchObj: {
        dictCode: '', // 字典编码
        dictName: '', // 字典名称
        dictLob: '', // 字典业务线
        dictValue: '', // 字典值
        status: '' // 字典状态
      },
      statusList: [
        {
          value: 0,
          label: '禁用'
        },
        {
          value: 1,
          label: '启用'
        }
      ],
      tableList: [],
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
          fixed: true
        },
        {
          label: '字典编码',
          prop: 'dictCode'
        },
        {
          label: '业务线编码',
          prop: 'dictLob'
        },
        {
          label: '字典值',
          prop: 'values',
          width: 400,
          formatter(row) {
            return row.values.map(item => `[${item.id}] ${item.dictValue}`).join('; ')
          }
        },
        {
          label: '状态',
          prop: 'status',
          width: 100,
          formatter(row, index) {
            return vm.statusList[row.status].label
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
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
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
        updata: values,
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