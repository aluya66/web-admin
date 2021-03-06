<template>
  <c-view>
    <template v-slot:headerTab>
      <el-tabs type="card" v-model="activeName" @tab-click="changeTitle">
        <el-tab-pane
          v-for="(item, index) in labelTitle"
          :key="index"
          :label="item.label"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
      <div class="header-btn">
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
        :max-height="730"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
            <el-form-item label="标签名称">
              <el-input
                v-model="searchObj.labelName"
                class="search-item"
                :size="size"
                placeholder="请输入名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="标签编码">
              <el-input
                v-model="searchObj.labelCode"
                class="search-item"
                :size="size"
                placeholder="请输入标签编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="标签状态">
              <el-select v-model="searchObj.labelStatus" class="select-item" :size="size" clearable>
                <el-option
                  v-for="item in marketableSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker
                :size="size"
                v-model="searchObj.dateTime"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']"
              >align="right"></el-date-picker>
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
        <label-add ref="childRef" :categoryType="value" :init-data="dialogObj.initData"></label-add>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import LabelAdd from './labelAdd'
import utils from 'utils'

export default {
  name: 'labelManage',
  mixins: [mixinTable],
  components: {
    CDialog,
    LabelAdd
  },
  data(vm) {
    return {
      value: '',
      dialogObj: {}, // 对话框数据
      searchObj: {
        labelName: '',
        labelCode: '',
        dateTime: '',
        labelStatus: ''
      },
      marketableSelect: [
        {
          value: 1,
          label: '有效'
        },
        {
          value: 2,
          label: '无效'
        }
      ],
      labelTitle: [
        {
          value: '1',
          label: '商品标签'
        },
        {
          value: '2',
          label: '用户标签'
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
              labelName,
              initial,
              labelStatus,
              createdby,
              updatedby,
              labelCategoryModels,
              labelDesc,
              id
            } = row
            vm.showDialog({
              title: '编辑标签',
              initData: {
                labelName,
                initial,
                labelStatus,
                createdby,
                updatedby,
                labelParentIds: labelCategoryModels.map(val => val.id),
                labelDesc,
                id: id
              },
              isEdit: true
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { labelName, id } = row
            vm.confirmTip(`确认删除${labelName}标签信息`, () => {
              vm.deleteData({ id })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '标签名称',
          prop: 'labelName',
          fixed: true
        },
        {
          label: '拼音大写',
          prop: 'initial'
        },
        {
          label: '标签编码',
          prop: 'labelCode'
        },
        {
          label: '标签风格',
          prop: 'categoryName',
          formatter(row) {
            return row.labelCategoryModels.map(item => item.categoryName).filter(d => d).join('/')
          }
        },
        {
          label: '标签状态',
          prop: 'labelStatusCN'
        },
        {
          label: '标签描述',
          prop: 'labelDesc'
        },
        // {
        //   label: '创建人',
        //   prop: 'createdby',
        //   width: 100
        // },
        // {
        //   label: '更新人',
        //   prop: 'updatedby',
        //   width: 100
        // },
        {
          label: '创建时间',
          prop: 'created'
        },
        {
          label: '更新时间',
          prop: 'updated'
        }
      ],
      activeName: '1',
      name: 1,
      addSoreList: [],
      labelType: 1,
      categoryType: 1,
      typeBtn: 2
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
      this.$api.basic
        .getQuerypage({
          ...searchDate,
          ...other,
          ...page,
          labelType: this.labelType,
          categoryType: this.categoryType
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
     * 删除表格单条数据
     *
     * @param {*} curPromise
     * @param {string} [msgTip='删除成功']
     */
    deleteData(param, msgTip = '删除成功') {
      // 主要修改接口
      this.$api.basic.deleteQuerypage(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    },
    /**
     * 对话框确认按钮，集成了表单提交功能
     */
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
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增标签',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    /**
     * 确认新增操作
     */
    addHandle(childFormModel) {
      let data = {
        ...childFormModel,
        labelType: this.labelType
      }
      this.$api.basic.addQuerypage(data).then(res => {
        this.dialogObj.isShow = false
        this.$msgTip('添加成功')
        this.fetchData()
      })
    },
    /**
     * 确认修改操作
     */
    editHandle(formModel) {
      // let status
      // if (formModel.labelStatus === '有效') {
      //   status = 1
      // } else {
      //   status = 2
      // }
      let data = {
        ...formModel,
        labelType: this.labelType
        // labelStatus: status
      }
      this.$api.basic.updateQuerypage(data).then(res => {
        this.dialogObj.isShow = false
        this.$msgTip('修改成功')
        this.fetchData()
      })
    },
    changeTitle(tab, event) {
      if (tab.name === '1') {
        this.labelType = 1
        this.categoryType = 1
        this.value = '1'
      } else if (tab.name === '2') {
        this.labelType = 2
        this.categoryType = 2
        this.value = '2'
      }
      this.searchObj = {}
      this.fetchData()
    }
  }
}
</script>
