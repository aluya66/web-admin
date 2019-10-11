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
      <Input placeholder="请输入商品名称" class="selectWidth" v-model="goodsName"/>
      商品Code：
      <Input placeholder="请输入商品Code" class="selectWidth" v-model="goodsBn"/>
      操作人:
      <Input placeholder="请输入操作人" class="selectWidth" v-model="operatorName"/>
      操作时间：
      <!-- <Date-picker
        type="date"
        placeholder="起始时间"
        class="selectWidth"
        format="yyyy-MM-dd"
        @on-change="changeDate"
        >
      </Date-picker> -->
      <DatePicker
        type="daterange"
        @on-change="chengeDate"
        placement="bottom-end"
        placeholder="Select date"
        class="selectWidth"
        >
      </DatePicker>
      <Button class="styleBtn" type="primary"  @click="searchBtn"><Icon :size='16' type="ios-search" />搜索</Button>
    </div>

    <Table :loading="loading" border :columns="columns" :data="list" class="table">

    </Table>
    <Page :total="listTotal" show-total @on-change="pageChange" />
  </Card>
</c-view>
</template>

<script>
const columns = [
  {
    title: '商品ID',
    key: 'id'
  },
  {
    title: '商品名称',
    key: 'goodsName'
  },
  {
    title: '商品编码',
    key: 'goodsBn'
  },
  {
    title: '操作人',
    key: 'operatorName'
  },
  {
    title: '操作说明',
    key: 'operatorLog'
  },
  {
    title: '操作时间',
    key: 'created'
  }
]
export default {
  name: 'shopCenterLog',
  data () {
    return {
      loading: false,
      columns,
      listTotal: 0,
      list: [],
      query: {
        pageNum: 1,
        pageSize: 10
      },
      goodsName: '',
      operatorName: '',
      goodsBn: '',
      created: '',
      beginDate: '',
      endDate: ''
    }
  },
  created() {
    this.getGoodsoperator()
  },
  methods: {
    getGoodsoperator() {
      let that = this
      let data = {
        ...this.query,
        goodsName: this.goodsName,
        operatorName: this.operatorName,
        goodsBn: this.goodsBn,
        created: this.created,
        beginDate: this.beginDate,
        endDate: this.endDate
      }
      this.loading = !this.loading
      this.$api.goods.getGoodsoperator(data).then(res => {
        that.loading = !that.loading
        that.list = res.data
        that.listTotal = res.totalCount
      })
    },
    searchBtn() {
      this.query.pageNum = 1
      this.getGoodsoperator()
    },
    changeDate(date) {
      this.created = date
    },
    pageChange(page) {
      this.query.pageNum = page
      this.getGoodsoperator()
    },
    chengeDate(e) {
      this.beginDate = e[0]
      this.endDate = e[1]
    }
  }
}
</script>

<style scoped>
.title,
.table,
.select-bar,
.update-item,.control-bar {
  margin-bottom: 10px
}
.selectWidth{
  width: 200px;
  margin-bottom: 10px
}
.styleBtn{
  /* margin-bottom: 10px */
}
</style>
