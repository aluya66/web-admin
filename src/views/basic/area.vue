<template>
  <c-view>
    <template v-slot:header>
        <div class="title">
          {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
          <Button class="backBtn" type="primary" @click="goBack">返回</Button>
        </div>
      </template>
    <Card>
      <div class="select-bar">
        <!-- 地区管理： -->
        <Select class="selectWidth" @on-change="changeCity">
          <Option v-for="(item, index) in regionList" :key="index" :value="index">{{ item.name }}</Option>
        </Select>
        <Select class="selectWidth" @on-change="changeCityTown" v-if="changeCityItem==true">
          <Option v-for="(item, index) in regionListItem" :key="index" :value="index">{{item.name}}</Option>
        </Select>
        <Select  class="selectWidth" @on-change="changeCityDistrict" v-if="changeregionDistrict==true">
          <Option v-for="(item, index) in regionDistrict" :key="index" :value="index">{{item.name}}</Option>
        </Select>
        <Select  class="selectWidth" @on-change="changeCityStreet" v-if="changeStreet==true">
          <Option v-for="(item, index) in regionStreet" :key="index" :value="index">{{item.name}}</Option>
        </Select>

        <!-- <Cascader :data="regionList" :load-data="loadData" class="selectWidth"></Cascader> -->

        <Button type="primary" class="btnStyle" @click="searchBtn"><Icon :size='16' type="ios-search" />搜索</Button>
        <Button type="primary" class="btnStyle" @click="addRegion(3)"><Icon :size='16' type="ios-add-circle-outline" />新增</Button>
      </div>
      <Table :loading="loading" border :columns="columns" :data="list" class="table">
        <template slot-scope="{ row, index }" slot="name">
          <span><Icon v-if="row.exitChildren==true" type="ios-add-circle-outline" :size='16' @click="addDel(index)"/>{{ row.name }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="add">
          <Button type="primary" @click="addRegion(1, index)"><Icon :size='16' type="ios-add-circle-outline" />新增</Button>
        </template>
        <template slot-scope="{ row, index }" slot="redact">
          <Button type="success" @click="addRegion(2, index)"><Icon :size='14' type="md-create" />编辑</Button>
        </template>
        <!-- <template slot-scope="{ row, index }" slot="delete">
          <Button type="error" @click="deleteRegion">删除</Button>
        </template> -->
      </Table>
      <Page :total="listTotal" show-total @on-change="pageChange" />
      <Modal
        v-model="showModal" 
        :title="modelTitle"
        width="500"
        footer-hide
        >
        <Form :model="curCategoryDetail" label-position="right" :label-width="75" class="formStyle">
          <FormItem label="地区名称：">
            <Input  placeholder='请填写地区名称' v-model="curCategoryDetail.name"/>
          </FormItem>
          <FormItem label="code:" v-if="typeStatus!==2">
            <Input  placeholder='请填写code' v-model="curCategoryDetail.code"/>
          </FormItem>
          <FormItem class="addBtn">
            <Button type="primary"  @click="addModal">确认</Button>
            <Button @click="closBtn">取消</Button>
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
  },
  // {
  //   title: '删除',
  //   slot: 'delete',
  //   align: 'center'
  // }
]
export default {
  name: 'area',
  data() {
    return {
      list: [],
      regionList: [
      //   {
      //   value: 'beijing',
      //   label: '北京',
      //   children: [],
      //   loading: false
      // },
      // {
      //   value: 'hangzhou',
      //   label: '杭州',
      //   children: [],
      //   loading:false
      // }
      ],      // 省
      regionListItem: [],   // 市
      regionDistrict: [],  // 区
      regionStreet: [],    // 街道
      loading: false,
      showModal:false,
      columns,
      listTotal: 0,
      query: {
        pageNum: 1,
        pageSize: 10,
      },
      regionLevel: '',
      parentCode: '',
      changeCityItem: false,
      changeregionDistrict: false,
      changeStreet: false,
      curCategoryDetail:{
        name: '',
        code: '',
        parentCode: ''
      },
      modelTitle: '',
      typeStatus: '',
      cityFlag: '',
      cityItemFlag: '',
      cityStreetFlag: '',
      cityRowFlag: '',
      city: '',
      cityItem: '',
      cityDistrict: '',
      cityStreet: ''
    }
  },
  created() {
    this.queryAreaList()
    this.queryAllParentcodes()
  },
  methods: {
   loadData (item, callback) {
                item.loading = true;
                setTimeout(() => {
                    if (item.value === 'beijing') {
                        item.children = [
                            {
                                value: 'talkingdata',
                                label: 'TalkingData'
                            },
                            {
                                value: 'baidu',
                                label: '百度'
                            },
                            {
                                value: 'sina',
                                label: '新浪'
                            }
                        ];
                    } else if (item.value === 'hangzhou') {
                        item.children = [
                            {
                                value: 'ali',
                                label: '阿里巴巴'
                            },
                            {
                                value: '163',
                                label: '网易'
                            }
                        ];
                    }
                    item.loading = false;
                    callback();
                }, 1000);
            },
    // 删除
    // deleteRegion(){
    //   console.log('删除')
    // },
    // 添加
    addRegion(type, index){
      this.showModal = true
      if(type===1){
        this.modelTitle = '新增'
        this.typeStatus = 1
        this.curCategoryDetail.name = ''
        this.curCategoryDetail.code = ''
        this.curCategoryDetail.parentCode = this.list[index].code
      }else if(type ===2){
        this.modelTitle = '修改'
        this.typeStatus = 2
        this.curCategoryDetail.name = this.list[index].name
        this.curCategoryDetail.code = this.list[index].code
        this.curCategoryDetail.parentCode = this.list[index].parentCode
      }else if(type ===3){
        this.modelTitle = '新增'
        this.typeStatus = 3
        this.curCategoryDetail.name = ''
        this.curCategoryDetail.code = ''
      }
    },
    // 地区名称添加
    addDel(index){
      this.query.pageNum = 1
      this.parentCode = this.list[index].code
      this.queryAreaList()
    },
    searchBtn(){
      let that = this
      this.query.pageNum=1
      this.queryAreaList()
    },
    queryAreaList(){
      let that = this
      let params = {
        parentCode: this.parentCode,
        ...this.query
      }
      this.loading = !this.loading
      this.$api.basic.queryAllRegion(params).then(res => {
        that.loading = !that.loading
        that.list = res.data
        that.listTotal = res.totalCount
      })
    },
    // 省
    queryAllParentcodes(){
      let that = this
      let params = {
        parentCode: this.parentCode
      }
      this.$api.basic.queryAllParentcodes(params).then(data => {
          that.regionList = data
      })
    },
    // 省下拉
    changeCity(index){
      if(index !== this.cityItemFlag){
        this.cityItem=''
        this.changeCityItem = true
        this.changeregionDistrict = false
        this.changeStreet = false
        this.parentCode = this.regionList[index].code
        this.regionListItem=''
      }else{
        this.changeCityItem = false
        this.regionList=''
      }

      console.log('temp1:'+ this.cityItemFlag)
      console.log(index)
      this.cityItemFlag = index
      console.log('temp2:'+ this.cityItemFlag)
      console.log(index)
      this.queryAllCity()
    },

    // 市
    queryAllCity(){
      let params = {
        parentCode: this.parentCode
      }
      this.$api.basic.queryAllParentcodes(params).then(data => {
          this.regionListItem = data
      })
    },
    // 市下拉
    changeCityTown(index){
      if(index!==this.cityStreetFlag){
        this.cityDistrict=''
        this.changeregionDistrict = true
        this.changeStreet = false
        this.parentCode = this.regionListItem[index].code||''
        this.regionDistrict=''
      }else{
        this.changeregionDistrict = false
        this.regionListItem=''
      }
      this.cityStreetFlag=index
      this.queryAllDistrict()
    },

    // 区
    queryAllDistrict(){
      let params = {
        parentCode: this.parentCode
      }
      this.$api.basic.queryAllParentcodes(params).then(data => {
          this.regionDistrict = data
      })
    },
    // 区下拉
    changeCityDistrict(index){
      if(index!==this.cityRowFlag){
        console.log('进来了')
        this.cityStreet=''
        this.changeStreet = true
        this.parentCode = this.regionDistrict[index].code||''
        this.regionStreet=''
      }else{
        console.log('?????????')
        this.changeStreet = false
      }
      
      this.cityRowFlag=index
      this.queryAllStreet()
    },

    // 街道
    queryAllStreet(){
      let params = {
        parentCode: this.parentCode
      }
      this.$api.basic.queryAllParentcodes(params).then(data => {
          this.regionStreet = data
      })
    },
    // // 街道下拉
    changeCityStreet(index){
      this.parentCode = this.regionStreet[index].code||''
      console.log(this.regionStreet[index].code)
    },

     //分页器
    pageChange(page) {
      this.query.pageNum = page
      this.queryAreaList()
    },
    addModal(){
      let that = this
      if(!this.curCategoryDetail.name){
        this.$Message.warning('请填写地区名称')
        return
      }
      if(!this.curCategoryDetail.code){
        this.$Message.warning('请填写code')
        return
      }
      this.loading = !this.loading
      if(this.typeStatus===1){
        let data = {
          code: this.curCategoryDetail.code,
          name: this.curCategoryDetail.name,
          parentCode: this.curCategoryDetail.parentCode,
        }
        this.$api.basic.addRegionInsert(data).then(res => {
            that.loading = !that.loading
            that.$Message.info('添加成功')
            that.queryAreaList()
            that.showModal=false
        })
      }else if(this.typeStatus===2){
        let data = {
          code: this.curCategoryDetail.code,
          name: this.curCategoryDetail.name,
        }
        this.$api.basic.updataRegionInsert(data).then(res => {
            that.loading = !that.loading
            that.$Message.info('修改成功')
            that.queryAreaList()
            that.showModal=false
        })
      }else if(this.typeStatus===3){
        let data = {
          code: this.curCategoryDetail.code,
          name: this.curCategoryDetail.name,
          parentCode: 0
        }
        this.$api.basic.addRegionInsert(data).then(res => {
            that.loading = !that.loading
            that.$Message.info('添加成功')
            that.queryAreaList()
            that.showModal=false
        })
      }
    },
    closBtn(){
      this.showModal = false
    },
    goBack(){
      this.$router.go()
    },
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
.title{
  display: flex;
  justify-content: space-between;
}
.selectWidth{
  width: 200px;
}
.addBtn{
  /* margin-left: 80px; */
  text-align: right;
}
.btnStyle{
  /* margin-bottom:10px  */
}
.iconStyle{
  size: 20
}
.formStyle{
  margin-right: 10px;
}
.backBtn{
  text-align: right;
}
</style>
