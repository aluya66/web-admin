<template>
<c-view>
		<template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
		</template>
  <Card>
    <div class="select-bar">
      商品名称：
      <Input placeholder="请输入名称" class="selectWidth" v-model="goodsName"/>
      操作人:
      <Input placeholder="请输入名称" class="selectWidth" v-model="goodsBn"/>
      快照时间：
      <DatePicker
        type="daterange"
        @on-change="chengeDate"
        placement="bottom-end"
        placeholder="Select date"
        class="selectWidth"
        >
      </DatePicker>
      <Button type="primary"  @click="searchBtn"><Icon :size='16' type="ios-search" />搜索</Button>
      <Button type="primary" @click="exprotFun"><Icon :size='16' type="md-arrow-down" />导出商品</Button>
    </div>
    <Table
      :loading="loading"
      border
      :columns="columns"
      :data="list"
      class="table"
      ref="myTable"
      >
      <template slot-scope="{ row, index }" slot="action">
        <Button size="small" type="info" @click="addModal(row,index)" ><Icon :size='16' type="ios-eye" />查看详情</Button>
      </template>
    </Table>
     <Page :total="listTotal" show-total @on-change="pageChange" />
  </Card>
</c-view>
</template>
<script>
const columns = [
  {
    title: '商品快照ID',
    key: 'id'
  },
  {
    title: '商品名称',
    key: 'goodsName'
  },
  {
    title: 'SPU码',
    key: 'goodsBn'
  },
  {
    title: '操作人',
    key: ''
  },
  {
    title: '快照时间',
    key: 'created'
  },
  {
    title: '操作',
    slot: 'action'
  }
]
export default {
  name: 'snapshoot',
  data() {
    return {
      loading: false,
      columns,
      list: [],
      goodsName: '',
      goodsBn: '',
      beginDate: '',
      endDate: '',
      query: {
        numPerPage: 10,
        pageNum: 1
      },
      listTotal: 0
    }
  },
  created() {
    this.getGoodssnapshot()
  },
  methods: {
    getGoodssnapshot() {
      let data = {
        ...this.query,
        goodsName: this.goodsName,
        goodsBn: this.goodsBn,
        beginDate: this.beginDate,
        endDate: this.endDate
      }
      this.$api.goods.getGoodssnapshot(data).then(res => {
        this.list = res.data
        this.listTotal = res.totalCount
      })
    },
    searchBtn() {
      this.query.pageNum = 1
      this.getGoodssnapshot()
    },
    pageChange(page) {
      this.query.pageNum = page
      this.getGoodssnapshot()
    },
    addModal(row, index) {
      this.$router.push({ path: '/goods/snapshootDel', query: { id: row.id } })
    },
    chengeDate(e) {
      this.beginDate = e[0]
      this.endDate = e[1]
    },
    exprotFun() {
      this.$refs.myTable.exportCsv({
        filename: '商品快照',
        original: false,
        columns: this.columns,
        data: this.list
      })
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
.md-img{
  height: 60px;
}
.subCol>ul>li{
  margin:0 -18px;
  list-style:none;
  text-Align: center;
  padding: 9px;
  border-bottom:1px solid #ccc;
  overflow-x: hidden;
}
.subCol>ul>li:last-child{
  border-bottom: none
}
.selectWidth{
  width: 200px;
  margin-bottom: 10px
}
</style>
