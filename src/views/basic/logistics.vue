<template>
<c-view>
		<template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addModal(1)">新增</el-button>
			</div>
		</template>
  <Card>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
      <el-form-item label="物流名称:">
        <el-input v-model="formInline.logiName" placeholder="请输入物流名称"></el-input>
      </el-form-item>
      <el-form-item label="物流编码:">
        <el-input v-model="formInline.logiCode" placeholder="请输入物流编码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchBtn" >搜索</el-button>
      </el-form-item>
    </el-form>

    <Table :loading="loading" border :columns="columns" :data="list" class="table">
      <template slot-scope="{ row, index }" slot="action">
        <el-button type="primary" size="small" icon="el-icon-edit" @click="addModal(2, index)" >编辑</el-button>
      </template>
    </Table>
    <Page :total="listTotal" show-total @on-change="pageChange" />

    <el-dialog
      :title="modalTitle"
      :visible.sync="contentModal"
      width="30%"
      >
      <el-form ref="form" :model="formLeft" label-width="80px" class="modelStyle">
        <el-form-item label="物流名称:">
          <el-input v-model="formLeft.logiName" placeholder='物流名称'></el-input>
          </el-form-item>
        <el-form-item label="物流编码:">
          <el-input v-model="formLeft.logiCode" placeholder='物流编码'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="contentModal = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addReleaseBtn">确 定</el-button>
      </span>
    </el-dialog>
  </Card>
</c-view>
</template>

<script>
const columns = [
  {
    title: '物流名称',
    key: 'logiName'
  },
  {
    title: '物流编码',
    key: 'logiCode'
  },
  {
    title: '操作',
    slot: 'action'
  }
]
export default {
  name: 'logistics',
  data() {
    return {
      formInline: {
        logiCode: '',
        logiName: ''
      },
      loading: false,
      columns,
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
    this.getLogisticsList()
  },
  methods: {
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
          that.getLogisticsList()
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

<style scoped>
.table,
.select-bar,
.update-item,.control-bar {
  margin-bottom: 10px
}
.title{
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
