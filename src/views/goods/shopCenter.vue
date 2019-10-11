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
      SPU码：
      <Input placeholder="请输入名称" class="selectWidth" v-model="goodsBn"/>
      基础分类：
      <Input placeholder="请输入名称" class="selectWidth" v-model="businessValue"/>
      经营类型：
      <Input placeholder="请输入名称" class="selectWidth" v-model="categoryName"/>
      <br>
      商品类型：
      <Input placeholder="请输入名称" class="selectWidth" v-model="categoryName"/>
      品牌：
      <Input placeholder="请输入名称" class="selectWidth" v-model="brandName"/>
      上货人：
      <Input placeholder="请输入名称" class="selectWidth" v-model="tagPrice"/>
      添加时间：
      <DatePicker
        type="daterange"
        @on-change="changeDate"
        placement="bottom-end"
        placeholder="Select date"
        class="selectWidth"
        >
      </DatePicker>
      <Button type="primary"  @click="searchBtn"><Icon :size='16' type="ios-search" />搜索</Button>
      <Button type="primary" @click="exprotFun"><Icon :size='16' type="md-arrow-down" />导出商品</Button>
    </div>
     <Table :loading="loading" ref="myTable" border :columns="columns" :data="list" class="table">
      <template slot-scope="{ row }" slot="coverImg">
          <img class="md-img" :src="row.coverImg" alt=""/>
      </template>
      <template slot-scope="{ row }" slot="action">
        <Button size="small" type="success" @click="routerLink(`/goods/shopCenterDel/${row.id}`)" ><Icon :size='14' type="md-create" />编辑</Button>
      </template>
    </Table>
    <Page :total="listTotal" show-total @on-change="pageChange" />
  </Card>
</c-view>
</template>

<script>
const columns = [
  {
    title: '商品ID',
    key: 'brandId'
  },
  {
    title: '图片',
    slot: 'coverImg'
  },
  {
    title: '名称',
    key: 'goodsName'
  },
  {
    title: '基础分类',
    key: 'businessValue'
  },
  {
    title: '商品类型',
    key: 'categoryName'
  },
  {
    title: 'SPU码',
    key: 'goodsBn'
  },
  {
    title: '品牌',
    key: 'brandName'
  },
  {
    title: '库存',
    key: 'retailPrice'
  },
  {
    title: '成本价',
    key: 'marketable'
  },
  {
    title: '市场价',
    key: 'memberPrice'
  },
  {
    title: '销售价',
    key: 'mktPrice'
  },
  {
    title: '上货人',
    key: 'tagPrice'
  },
  {
    title: '上架时间',
    key: 'uptime'
  },
  {
    title: '操作',
    slot: 'action'
  }
]
export default {
  name: 'shopCenter',
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10
      },
      listTotal: 0,
      loading: false,
      columns,
      list: [],
      categoryName: '',
      goodsBn: '',
      goodsName: '',
      businessValue: '',
      brandName: '',
      origin: '',
      tagPrice: '',
      uptime: '',
      beginDate: '',
      endDate: ''
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    getGoodsList() {
      let that = this
      let data = {
        ...this.query,
        categoryName: this.categoryName,
        goodsBn: this.goodsBn,
        businessValue: this.businessValue,
        goodsName: this.goodsName,
        brandName: this.brandName,
        origin: this.origin,
        tagPrice: this.tagPrice,
        uptime: this.uptime,
        beginDate: this.beginDate,
        endDate: this.endDate
      }
      this.loading = !this.loading
      this.$api.goods.getGoodsList(data).then(res => {
        that.loading = !this.loading
        that.list = res.data
        that.listTotal = res.totalCount
      })
    },
    addModal(row, index) {
      this.$router.push({ path: '/goods/shopCenterDel', query: { modelType: 2, id: row.id } })
    },
    closBtn() {
      this.showModal = false
    },
    pageChange(page) {
      this.query.pageNum = page
      this.getGoodsList()
    },
    searchBtn() {
      this.query.pageNum = 1
      this.getGoodsList()
    },
    changeDate(e) {
      this.beginDate = e[0]
      this.endDate = e[1]
    },
    exprotFun() {
      this.$refs.myTable.exportCsv({
        filename: '商品中心列表',
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
.selectWidth{
  width: 200px;
  margin-bottom: 10px
}
</style>
