<template>
  <c-view>
		<template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
		</template>
    <Card>
      <div class="select-bar">
        地区管理：
        <Select class="selectWidth" @on-change="changeCity">
          <Option v-for="(item, index) in regionList" :key="index" :value="index">{{ item.name }}</Option>
        </Select>
        <Select class="selectWidth" @on-change="changeCityTown" v-if="changeCityItem===1">
          <Option v-for="(item, index) in regionListItem" :key="index" :value="index">{{item.name}}</Option>
        </Select>
        <Select  class="selectWidth" @on-change="changeCityDistrict" v-if="changeregionDistrict===1">
          <Option v-for="(item, index) in regionDistrict" :key="index" :value="index">{{item.name}}</Option>
        </Select>
        <Select  class="selectWidth" @on-change="changeCityStreet" v-if="changeStreet===1">
          <Option v-for="(item, index) in regionStreet" :key="index" :value="index">{{item.name}}</Option>
        </Select>
        <Button type="primary" @click="searchBtn">搜索</Button>
        <Button type="primary" @click="addRegion(3)">添加</Button>
      </div>
      <Table :loading="loading" border :columns="columns" :data="list" class="table">
        <template slot-scope="{ row, index }" slot="name">
          <span><Icon v-if="row.exitChildren==true" type="ios-add-circle-outline" class="iconSize" @click="addDel(index)"/>{{ row.name }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="add">
          <Button type="primary" @click="addRegion(1, index)">新增</Button>
        </template>
        <template slot-scope="{ row, index }" slot="redact">
          <Button type="warning" @click="addRegion(2, index)">修改</Button>
        </template>
        <!-- <template slot-scope="{ row, index }" slot="delete">
          <Button type="error" @click="deleteRegion">删除</Button>
        </template> -->
      </Table>
      <!-- <Page :total="listTotal" show-total @on-change="pageChange" /> -->
      <Modal
        v-model="showModal"
        :title="modelTitle"
        width="400"
        footer-hide
        >
        <Form :model="curCategoryDetail" label-position="right" :label-width="75" >
          <FormItem label="地区名称：">
            <Input  placeholder='请填写地区名称' v-model="curCategoryDetail.name"/>
          </FormItem>
          <FormItem label="code:" v-if="typeStatus!==2">
            <Input  placeholder='请填写code' v-model="curCategoryDetail.code"/>
          </FormItem>
          <FormItem>
            <Button type="primary" class="addBtn" @click="addModal">确认</Button>
            <Button class="cancleBtn" @click="closBtn">取消</Button>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  </c-view>
</template>

<script>
const columns = [
  {
    title: '地区名称',
    slot: 'name',
    align: 'center'
  },
  {
    title: '添加子地区',
    slot: 'add',
    align: 'center'
  },
  {
    title: '编辑',
    slot: 'redact',
    align: 'center'
  }
  // {
  //   title: '删除',
  //   slot: 'delete',
  //   align: 'center'
  // }
]
export default {
  name: 'v-area',
  data() {
    return {
      list: [],
      regionList: [], // 省
      regionListItem: [], // 市
      regionDistrict: [], // 区
      regionStreet: [], // 街道
      loading: false,
      showModal: false,
      columns,
      listTotal: 0,
      query: {
        pageNum: 1,
        pageSize: 10000
      },
      regionLevel: '',
      parentCode: '',
      changeCityItem: '',
      changeregionDistrict: '',
      changeStreet: '',
      curCategoryDetail: {
        name: '',
        code: '',
        parentCode: ''
      },
      modelTitle: '',
      typeStatus: ''
    }
  },
  created() {
    this.queryAreaList()
    this.queryAllParentcodes()
  },
  methods: {
    // 删除
    // deleteRegion(){
    //   console.log('删除')
    // },
    // 添加
    addRegion(type, index) {
      this.showModal = true
      if (type === 1) {
        this.modelTitle = '新增'
        this.typeStatus = 1
        this.curCategoryDetail.name = ''
        this.curCategoryDetail.code = ''
        this.curCategoryDetail.parentCode = this.list[index].code
      } else if (type === 2) {
        this.modelTitle = '修改'
        this.typeStatus = 2
        this.curCategoryDetail.name = this.list[index].name
        this.curCategoryDetail.code = this.list[index].code
        this.curCategoryDetail.parentCode = this.list[index].parentCode
      } else if (type === 3) {
        this.modelTitle = '新增'
        this.typeStatus = 3
        this.curCategoryDetail.name = ''
        this.curCategoryDetail.code = ''
      }
    },
    // 地区名称添加
    addDel(index) {
      this.query.pageNum = 1
      this.parentCode = this.list[index].code
      this.queryAreaList()
    },
    searchBtn() {
      this.query.pageNum = 1
      this.queryAreaList()
    },
    queryAreaList() {
      let that = this
      let data = {
        parentCode: this.parentCode,
        ...this.query
      }
      this.loading = !this.loading
      this.$api.basic.queryAllRegion(data).then(res => {
        that.loading = !that.loading
        this.list = res.data
        this.listTotal = res.totalCount
      })
    },
    // 省
    queryAllParentcodes() {
      let data = {
        parentCode: this.parentCode
      }
      this.$api.basic.queryAllParentcodes(data).then(res => {
        this.regionList = res.data
      })
    },
    // 省下拉
    changeCity(index) {
      this.changeCityItem = 1
      this.parentCode = this.regionList[index].code
      this.queryAllCity()
    },

    // 市
    queryAllCity() {
      let data = {
        parentCode: this.parentCode
      }
      this.$api.basic.queryAllParentcodes(data).then(res => {
        if (res.code === 0) {
          this.regionListItem = res.data
        } else {
          this.$Message.warning(res.message)
        }
      })
    },
    // 市下拉
    changeCityTown(index) {
      this.changeregionDistrict = 1
      this.parentCode = this.regionListItem[index].code
      this.queryAllDistrict()
    },

    // 区
    queryAllDistrict() {
      let data = {
        parentCode: this.parentCode
      }
      this.$api.basic.queryAllParentcodes(data).then(res => {
        if (res.code === 0) {
          this.regionDistrict = res.data
        } else {
          this.$Message.warning(res.message)
        }
      })
    },
    // 区下拉
    changeCityDistrict(index) {
      this.changeStreet = 1
      this.parentCode = this.regionDistrict[index].code
      this.queryAllStreet()
    },

    // 街道
    queryAllStreet() {
      let data = {
        parentCode: this.parentCode
      }
      this.$api.basic.queryAllParentcodes(data).then(res => {
        this.regionStreet = res.data
      })
    },
    // // 街道下拉
    changeCityStreet(index) {
      this.parentCode = this.regionStreet[index].code
    },

    // 分页器
    pageChange(page) {
      this.query.pageNum = page
      this.queryAreaList()
    },
    addModal() {
      let that = this
      if (!this.curCategoryDetail.name) {
        this.$Message.warning('请填写地区名称')
        return
      }
      if (!this.curCategoryDetail.code) {
        this.$Message.warning('请填写code')
        return
      }
      this.loading = !this.loading
      if (this.typeStatus === 1) {
        let data = {
          code: this.curCategoryDetail.code,
          name: this.curCategoryDetail.name,
          parentCode: this.curCategoryDetail.parentCode
        }
        this.$api.basic.addRegionInsert(data).then(res => {
          that.loading = !that.loading
          that.$Message.info('添加成功')
          that.queryAreaList()
          that.showModal = false
        })
      } else if (this.typeStatus === 2) {
        let data = {
          code: this.curCategoryDetail.code,
          name: this.curCategoryDetail.name
        }
        this.$api.basic.updataRegionInsert(data).then(res => {
          that.loading = !that.loading
          that.$Message.info('修改成功')
          that.queryAreaList()
          that.showModal = false
        })
      } else if (this.typeStatus === 3) {
        let data = {
          code: this.curCategoryDetail.code,
          name: this.curCategoryDetail.name,
          parentCode: 0
        }
        this.$api.basic.addRegionInsert(data).then(res => {
          that.loading = !that.loading
          that.$Message.info('添加成功')
          that.queryAreaList()
          that.showModal = false
        })
      }
    },
    closBtn() {
      this.showModal = false
    },
    goBack() {
      this.$router.go()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.select-bar,
.table,
.title{
  margin-bottom: 10px
}
.selectWidth{
  width: 200px;
}
.addBtn{
  margin-left: 40px
}
.cancleBtn{
  margin-left: 8px
}
</style>
