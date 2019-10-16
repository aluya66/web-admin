<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        <el-tabs v-model="activeName" type="card" @tab-click="changeTitle">
          <el-tab-pane label="商品标签" name="1"></el-tab-pane>
          <el-tab-pane label="用户标签" name="2"></el-tab-pane>
        </el-tabs>
        <div class="header-btn">
          <el-button type="primary" style="height: 40px" :size="size" icon="el-icon-plus" @click="addHandle">新增</el-button>
        </div>
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
            <el-form-item label="标签名称">
              <el-input
                v-model="searchObj.labelName"
                class="search-item"
                :size="size"
                placeholder="请输入名称"
                clearable
              />
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
        <add-goods ref="childRef" :init-data="dialogObj.initData"></add-goods>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import AddGoods from './shopLableAdd'
import utils from 'utils'

export default {
  mixins: [mixinTable],
  components: {
    CDialog,
    AddGoods
  },
  data(vm) {
    return {
      dialogObj: {}, // 对话框数据
      searchObj: {
        labelName: ''
      },
      marketableSelect: [
        {
          value: '1',
          label: '有效'
        },
        {
          value: '2',
          label: '无效'
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
            vm.editHandle(row)
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { labelName, id } = row
            vm.confirmTip(`确认删除${labelName}商品标签信息`, () => {
              vm.deleteData({ id })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '标签名称',
          prop: 'labelName',
          width: 120,
          fixed: true
        },
        {
          label: '拼音大写',
          prop: 'initial',
          width: 200
        },
        {
          label: '标签编码',
          prop: 'labelCode'
        },
        {
          label: '标签类型',
          prop: 'labelTypeCN'
        },
        {
          label: '标签描述',
          prop: 'labelDesc'
        },
        {
          label: '标签状态',
          prop: 'labelStatusCN'
        },
        {
          label: '创建人',
          prop: 'createdby',
          width: 100
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100
        },
        {
          label: '更新时间',
          prop: 'updated',
          width: 100
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
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
      this.isLoading = true
      this.$api.basic.getQuerypage(
        {
          ...searchDate,
          ...other,
          ...page,
          labelType: this.labelType,
          categoryType: this.categoryType
        }
      ).then(res => {
        this.isLoading = false
        if (res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data
        } else {
          this.tableList = res
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
      console.log(param, msgTip)
      // 主要修改接口
      this.$api.basic.deleteQuerypage(param).then(() => {
        this.$msgTip(msgTip)
        if (this.tableList.length === 1) {
          const { pageNum } = this.pageInfo
          this.pageInfo.pageNum = pageNum > 1 ? pageNum - 1 : 1
        }
        this.fetchData()
      })
    },
    /**
     * 对话框确认按钮，集成了表单提交功能
     */
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        console.log(this.typeBtn)
        console.log(valid)
        console.log('?????????????????????')
        if (valid) {
          const childFormModel = childRef.formModel
          console.log(childFormModel)
          // code...
          this.dialogObj.isShow = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 对话框新增提醒
    */
    addHandle() {
      this.typeBtn = 1
      this.dialogObj = {
        isShow: true,
        title: '新增商品标签',
        initData: {}
      }
    },
    /**
     * 对话框编辑提醒
    */
    editHandle(e) {
      this.typeBtn = 2
      let checkData = e.labelCategoryModels.map(({id})=>{
        return { id }
      })
      let checkList = []
      for (let i in checkData) {
        checkList.push(checkData[i].id)
      }
      this.dialogObj = {
        isShow: true,
        title: '编辑商品标签',
        initData: {
          labelName: e.labelName,
          initial: e.initial,
          labelStatus: e.labelStatusCN,
          createdby: e.createdby,
          updatedby: e.updatedby,
          labelParentIds: checkList,
          labelDesc: e.labelDesc
        }
      }
    },
    changeTitle(tab, event) {
      if (tab.name === '1') {
        this.labelType = 1
        this.categoryType = 1
      } else if (tab.name === '2') {
        this.labelType = 2
        this.categoryType = 2
      }
      this.searchObj = {}
      this.fetchData()
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
