<template>
<c-view>
		<template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button type="primary" :size="size" icon="el-icon-plus" @click="addModal(1)">新增</el-button>
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
            <el-form-item label="物流名称">
              <el-input
                v-model="searchObj.logiName"
                class="search-item"
                :size="size"
                placeholder="请输入物流名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="物流编码">
              <el-input
                v-model="searchObj.logiCode"
                class="search-item"
                :size="size"
                placeholder="请输入物流编码"
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
    <el-dialog
      :title="modalTitle"
      :visible.sync="contentModal"
      width="30%"
      >
      <el-form ref="form" :model="formLeft" label-width="80px" class="modelStyle">
        <el-form-item label="物流名称:">
          <el-input v-model="formLeft.logiName" placeholder='物流名称'></el-input>
          </el-form-item>
        <el-form-item label="物流编码:" v-if="statusType===1">
          <el-input v-model="formLeft.logiCode" placeholder='物流编码'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="contentModal = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addReleaseBtn">确 定</el-button>
      </span>
    </el-dialog>
</c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {
        logiName: '',
        logiCode: ''
      },
      marketableSelect: [],
      pickerOptions: utils.pickerOptions,
      tableList: [],
      tableInnerBtns: [{
        width: 130,
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          console.log(row)
        }
      }],
      tableHeader: [
        {
          label: '物流名称',
          prop: 'logiName',
          fixed: true
        },
        {
          label: '物流编码',
          prop: 'logiCode'
        }
      ],

      formInline: {
        logiCode: '',
        logiName: ''
      },
      loading: false,
      query: {
        pageNum: 1,
        pageSize: 10
      },
      listTotal: 0,
      list: [],
      contentModal: false,
      statusType: '',
      modalTitle: '',
      formLeft: {
        logiName: '',
        logiCode: '',
        sort: 100
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
      this.$api.basic.getLogistics(
        {
          ...searchDate,
          ...other,
          ...page,
          pageSize: 10
        }
      ).then(res => {
        console.log(res)
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

    getLogisticsList() {
      let that = this
      let params = {
        ...this.query,
        logiCode: this.formInline.logiCode,
        logiName: this.formInline.logiName
      }
      this.loading = !this.loading
      this.$api.basic.getLogistics(params).then(res => {
        that.loading = !that.loading
        that.list = res.data
        that.listTotal = res.totalCount
      })
    },
    addReleaseBtn() {
      if (!this.formLeft.logiName) {
        this.$Message.info('物流名称不能为空')
        return
      }
      if (!this.formLeft.logiCode) {
        this.$Message.info('code不能为空')
        return
      }
      let that = this
      if (this.statusType === 1) {
        let data = {
          logiName: this.formLeft.logiName,
          logiCode: this.formLeft.logiCode
        }
        this.$api.basic.addLogistics(data).then(res => {
          that.$Message.info('添加成功')
          that.contentModal = false
          that.fetchData()
        })
      } else if (this.statusType === 2) {
        let data = {
          logiName: this.formLeft.logiName,
          logiCode: this.formLeft.logiCode,
          id: this.formLeft.id,
          sort: this.formLeft.sort
        }
        this.$api.basic.updateLogistics(data).then(res => {
          that.$Message.info('修改成功')
          that.contentModal = false
          that.getLogisticsList()
        })
      }
    },
    addModal(type, index) {
      this.contentModal = true
      if (type === 1) {
        this.statusType = 1
        this.modalTitle = '新增'
        this.formLeft = {}
        this.formLeft.sort = 100
      } else if (type === 2) {
        this.statusType = 2
        this.modalTitle = '修改'
        this.formLeft.logiName = this.list[index].logiName
        this.formLeft.logiCode = this.list[index].logiCode
        this.formLeft.sort = this.list[index].sort
        this.formLeft.id = this.list[index].id
      }
    },
    pageChange(page) {
      this.query.pageNum = page
      this.getLogisticsList()
    },
    searchBtn() {
      this.query.pageNum = 1
      this.getLogisticsList()
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
  justify-content: space-between
}
.selectWidth{
  width: 200px;
}
.deteleBtn{
  margin-right: 5px
}
.addBtn{
  margin-left: 40px
}
.cancelBtn{
  margin-left: 8px
}
.modelStyle{
  margin: 0 20px;
}
</style>
