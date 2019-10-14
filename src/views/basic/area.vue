<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button type="primary" size="small" icon="el-icon-plus" @click="append(3)">新增</el-button>
      </div>
    </template>
    <Card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <!-- 地区管理： -->
        <el-select v-model="pname" @change="choseProvince" placeholder="省级地区" size="small">
          <el-option
            v-for="(item,index) in regionList"
            :key="index"
            :label="item.name"
            :value="index"
          ></el-option>
        </el-select>
        <el-select v-model="cname" @change="choseCity" placeholder="市级地区" v-if="changeCityItem==true" size="small">
          <el-option
            v-for="(item,index) in regionListItem"
            :key="index"
            :label="item.name"
            :value="index"
          ></el-option>
        </el-select>
        <el-select v-model="bname" @change="choseBlock" placeholder="区级地区" v-if="changeregionDistrict==true" size="small">
          <el-option
            v-for="(item,index) in regionDistrict"
            :key="index"
            :label="item.name"
            :value="index"
          ></el-option>
        </el-select>
        <el-select v-model="sname" @change="changeCityStreet" placeholder="街道办" v-if="changeStreet==true" size="small">
          <el-option
            v-for="(item,index) in regionStreet"
            :key="index"
            :label="item.name"
            :value="index"
          ></el-option>
        </el-select>
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchBtn">搜索</el-button>
      </el-form>
      <el-container v-loading="loading">
        <el-aside width="600px">
          <el-tree
            :data="areaList"
            :expand-on-click-node="false"
            >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  v-if="data.children.length>0"
                  type="text"
                  size="small"
                  @click="()=>append(1, data)">
                  新增
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="() => modification(node, data)">
                  编辑
                </el-button>
              </span>
            </span>
          </el-tree>
        </el-aside>
      </el-container>
      <Modal
        v-model="showModal"
        :title="modelTitle"
        width="400"
        footer-hide
        >
        <Form :model="curCategoryDetail" label-position="right" :label-width="75" class="formStyle">
          <FormItem label="地区名称：">
            <Input  placeholder='请填写地区名称' v-model="curCategoryDetail.name"/>
          </FormItem>
          <FormItem label="code:" v-if="typeStatus!==2">
            <Input  placeholder='请填写code' v-model="curCategoryDetail.code"/>
          </FormItem>
          <FormItem>
            <Button type="primary" class="addBtn" @click="addModal">确认</Button>
            <Button class="cancelBtn" @click="closBtn">取消</Button>
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
]
export default {
  name: 'area',
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
        pageSize: 10
      },
      regionLevel: '',
      parentCode: '',
      changeCityItem: false,
      changeregionDistrict: false,
      changeStreet: false,
      curCategoryDetail: {
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
      cityStreet: '',

      optionsMessage: '',
      ChineseDistricts: '',
      province: [],
      shi1: [],
      qu1: [],
      block: [],
      pname: '', // 省的名字
      cname: '', // 市的名字
      bname: '', // 区的名字
      sname: '', // 街道的名字
      areaList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getAreaAllList()
    this.queryAreaList()
    this.queryAllParentcodes()
  },
  methods: {
    modification(node, data) {
      this.showModal = true
      this.modelTitle = '编辑'
      this.typeStatus = 2
      this.curCategoryDetail.name = data.label
      this.curCategoryDetail.code = data.code
    },
    append(type, data) {
      this.showModal = true
      if (type === 1) {
        // console.log('节点新增')
        this.modelTitle = '新增'
        this.typeStatus = 1
        this.curCategoryDetail.name = ''
        this.curCategoryDetail.code = ''
        this.curCategoryDetail.parentCode = data.code
        console.log('code' + data.code)
      } else if (type === 3) {
        // console.log('全局新增')
        this.modelTitle = '新增'
        this.typeStatus = 3
        this.curCategoryDetail.name = ''
        this.curCategoryDetail.code = ''
      }
    },
    getAreaAllList() {
      let that = this
      let params = {}
      this.loading = !this.loading
      this.$api.basic.getAreaAll(params).then(data => {
        that.loading = !that.loading
        let dataList = JSON.stringify(data)
        that.areaList = JSON.parse(dataList.replace(/name/g, 'label'))
      })
    },
    searchBtn() {
      this.query.pageNum = 1
      this.queryAreaList()
    },
    queryAreaList() {
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
    queryAllParentcodes() {
      let that = this
      let params = {
        parentCode: this.parentCode
      }
      console.log(this.parentCode)
      this.$api.basic.queryAllParentcodes(params).then(data => {
        that.regionList = data
      })
    },
    // 省下拉
    choseProvince(index) {
      if (index !== this.cityItemFlag) {
        this.cityItem = ''
        this.changeCityItem = true
        this.cname = ''
        this.changeregionDistrict = false
        this.changeStreet = false
        this.parentCode = this.regionList[index].code
        this.regionListItem = ''
      } else {
        this.changeCityItem = false
        this.regionList = ''
      }
      this.cityItemFlag = index
      this.queryAllCity()
    },
    // 市
    queryAllCity() {
      let params = {
        parentCode: this.parentCode
      }
      this.$api.basic.queryAllParentcodes(params).then(data => {
        this.regionListItem = data
      })
    },
    // 市下拉
    choseCity(index) {
      if (index !== this.cityStreetFlag) {
        this.cityDistrict = ''
        this.changeregionDistrict = true
        this.bname = ''
        this.changeStreet = false
        this.parentCode = this.regionListItem[index].code || ''
        this.regionDistrict = ''
      } else {
        this.changeregionDistrict = false
        this.regionListItem = ''
      }
      this.cityStreetFlag = index
      this.queryAllDistrict()
    },

    // 区
    queryAllDistrict() {
      let params = {
        parentCode: this.parentCode
      }
      this.$api.basic.queryAllParentcodes(params).then(data => {
        this.regionDistrict = data
      })
    },
    // 区下拉
    choseBlock(index) {
      if (index !== this.cityRowFlag) {
        this.cityStreet = ''
        this.changeStreet = true
        this.sname = ''
        this.regionStreet = ''
        this.parentCode = this.regionDistrict[index].code
      } else {
        this.changeStreet = false
      }

      this.cityRowFlag = index
      this.queryAllStreet()
    },

    // 街道
    queryAllStreet() {
      let params = {
        parentCode: this.parentCode
      }
      this.$api.basic.queryAllParentcodes(params).then(data => {
        this.regionStreet = data
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
      console.log('请求')
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
.table {
  margin-bottom: 10px;
}
.title {
  display: flex;
  justify-content: space-between;
}
.selectWidth {
  width: 200px;
  margin-right: 20px;
}
.addBtn {
  margin-left: 50px;
}
.cancelBtn {
  margin-left: 8px;
}
.iconStyle {
  size: 20;
}
.formStyle {
  margin-right: 16px;
}
.backBtn {
  text-align: right;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
