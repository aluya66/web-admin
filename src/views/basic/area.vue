<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button type="primary" size="small" icon="el-icon-plus" @click="append(3)">新增</el-button>
      </div>
    </template>
    <Card>
      <el-container v-loading="loading">
        <el-aside width="600px">
          <el-tree
            :data="list"
            ref="tree"
            node-key="id"
            :expand-on-click-node="false"
            >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                <span class="icon">
                  <i class="el-icon-caret-right" v-if="data.exitChildren==true" @click="getCheckedKeys(node, data)"></i>
                </span>
                {{ node.label }}
              </span>
              <span>
                <el-button
                  v-if="data.exitChildren==true"
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
      listTotal: 0,
      query: {
        pageNum: 1,
        pageSize: 10000
      },
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
      cityItemFlag: '',
      cityStreetFlag: '',
      cityRowFlag: '',
      cityItem: '',
      cityDistrict: '',
      cityStreet: '',

      pname: '', // 省的名字
      cname: '', // 市的名字
      bname: '', // 区的名字
      sname: '', // 街道的名字
    }
  },
  created() {
    this.queryAreaList()
    // this.queryAllParentcodes()
  },
  methods: {
    getCheckedKeys(node, data){
      
      console.log(this.$refs.tree.getCheckedKeys())
      console.log(node)
      console.log(data)
      console.log('-----------------')
      this.parentCode = data.code
      this.queryAreaList()
    },
    modification(node, data) {
      this.showModal = true
      this.modelTitle = '编辑'
      this.typeStatus = 2
      this.curCategoryDetail.name = data.label
      this.curCategoryDetail.code = data.code
    },
    append(type, data) {
      this.showModal = true
      this.modelTitle = '新增'
      this.curCategoryDetail.name = ''
      this.curCategoryDetail.code = ''
      if (type === 1) {
        this.typeStatus = 1
        this.curCategoryDetail.parentCode = data.code
      } else if (type === 3) {
        this.typeStatus = 3
      }
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
        console.log('code:'+this.parentCode)
          let data = JSON.stringify(res.data)
        if(this.parentCode > 0){
          console.log('88888888888')
          let dataList = JSON.parse(data.replace(/name/g, 'label'))
          
          console.log(this.parentCode)
          let codeData = res.data.find(e=>e.parentCode === this.parentCode)
          console.log(codeData)
          codeData.children.push(dataList)
        } else {
          console.log('7777777777777')
          that.list = JSON.parse(data.replace(/name/g, 'label'))
        }
        // that.listTotal = res.totalCount
      })
    },
    // 省
    queryAllParentcodes() {
      let that = this
      let params = {
        parentCode: this.parentCode
      }
      this.$api.basic.queryAllParentcodes(params).then(data => {
        console.log('222222222')
        console.log(data)
        that.list = data
      })
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
  .icon{
    width: 10px;
    display: inline-block
  }
</style>
