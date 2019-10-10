<template>
<c-view>
		<template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
		</template>
  <Card>
    <div class="select-bar">
      物流名称：
      <Input placeholder="请输入物流名称" class="selectWidth" v-model="logiName"/>
      logiCode:
      <Input placeholder="请输入物流名称" class="selectWidth" v-model="logiCode"/>
      <Button type="primary"  @click="searchBtn"><Icon class="iconSize" type="ios-add-circle-outline"/>搜索</Button>
      <Button type="primary"  @click="addModal(1)"><Icon class="iconSize" type="ios-add-circle-outline"/>添加</Button>
    </div>
    <Table :loading="loading" border :columns="columns" :data="list" class="table">
      <template slot-scope="{ row, index }" slot="action">
        <a size="small" href="#" class="deteleBtn" @click="addModal(2, index)">编辑</a>
      </template>
    </Table>
    <Page :total="listTotal" show-total @on-change="pageChange" />
    <Modal
      v-model="contentModal"
      :title="modalTitle"
      width="350"
      footer-hide
      >
      <Form :model="formLeft" label-position="right" :label-width="70" >
        <FormItem label="物流名称">
          <Input  placeholder='物流名称' v-model="formLeft.logiName"/>
        </FormItem>
        <FormItem label="物流名称">
          <Input  placeholder='物流名称' v-model="formLeft.logiCode"/>
        </FormItem>
        <!-- <FormItem label="排序">
          <InputNumber :max="10000" :min="0" v-model="formLeft.sort"></InputNumber>
        </FormItem> -->

        <FormItem>
          <Button type="primary" class="addBtn" @click="addReleaseBtn">确认</Button>
          <Button class="cancel" @click="closeBtn">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</c-view>
</template>

<script>
const columns = [
  {
    title: '名称',
    key: 'logiName'
  },
  {
    title: 'logiCode',
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
      },
      logiCode: '',
      logiName: ''
    }
  },
  created() {
    this.getLogisticsList()
  },
  methods: {
    getLogisticsList() {
      let that = this
      let data = {
        ...this.query,
        logiCode: this.logiCode,
        logiName: this.logiName
      }
      this.loading = !this.loading
      this.$api.basic.getLogistics(data).then(res => {
        that.loading = !that.loading
        console.log(res.data)
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
          console.log(res.data)
          that.$Message.info('添加成功')
          that.contentModal = false
          this.getLogisticsList()
        })
      } else if (this.statusType === 2) {
        let data = {
          logiName: this.formLeft.logiName,
          logiCode: this.formLeft.logiCode,
          id: this.formLeft.id,
          sort: this.formLeft.sort
        }
        this.$api.basic.updateLogistics(data).then(res => {
          console.log(res.data)
          that.$Message.info('修改成功')
          that.contentModal = false
          this.getLogisticsList()
        })
      }
    },
    closeBtn() {
      this.contentModal = false
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
        // this.formLeft.target=this.list[index].target
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
    // deleteModal(row){
    //   const that = this
    //   const params = {
    //     id:row.id,
    //   }
    //   this.$Modal.confirm({
    //     title: '提示',
    //     content: '是否确定删除该品类？',
    //     onOk: () => {
    //       that.$api.basic.aaaaaaaaaaaaaaaaaa(params).then(res => {
    //         that.$Message.success(res.message);
    //         //更新列表数据
    //         that.getGoodsattrvalList()
    //       }).catch(err => {

    //       })
    //     },
    //     onCancel: () => {
    //     }
    //   });
    // }
  }
}
</script>

<style scoped>
.table,
.select-bar,
.update-item,.control-bar {
  margin-bottom: 10px
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
</style>
