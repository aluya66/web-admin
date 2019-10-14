<template>
  <c-view>
    <template v-slot:header>
      <el-row type="flex" justify="space-between">
        <el-col class="title">
          {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" icon="el-icon-circle-plus" @click="addModal(1)">新增
          </el-button>
        </el-col>
      </el-row>
    </template>
    <Card>
      <div class="select-bar">
        <el-form :inline="true" class="demo-form-inline">
          <el-row type="flex">
            <el-form-item label="级别:" class="inputLabel">
              <el-select v-model="categoryLevel" size="small">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item, index) in categoryLevelList" :key="index" :label="item"
                  :value="index+1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类目名称:" class="inputLabel">
              <el-input placeholder="请输入类目" v-model="categoryName" size="small"></el-input>
            </el-form-item>
            <el-form-item label="显示:" class="inputLabel">
              <el-select v-model="showFlag" size="small">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item, index) in showFlagList" :key="index" :label="item"
                  :value="index+1"></el-option>
              </el-select>
            </el-form-item>
            <el-col :span="1" class="searchBtn">
              <el-button type="primary" size="small" icon="el-icon-search" @click="searchBtn()">搜索
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <Table :loading="loading" border :columns="columns" :data="categoryList" class="table">
        <template slot-scope="{ row, index }" slot="action">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="addModal(2, index)">编辑
              </el-button>
              <el-button type="danger" size="small" icon="el-icon-delete-solid" @click="deleteItem(row, index)">编辑
                </el-button>
          <!-- <Button type="success" size="small" class="deteleBtn" @click="addModal(2, index)">
            <Icon :size='14' type="md-create" />编辑</Button> -->
          <!-- <Button type="error" size="small" class="deteleBtn" @click="deleteItem(row, index)">
            <Icon :size='14' type="ios-trash-outline" />删除</Button> -->
        </template>
      </Table>
      <Page :total="listTotal" show-total @on-change="pageChange" />
      <Modal v-model="showModal" :title="modalTitle" width="800" footer-hide>
        <Form :model="curCategoryDetail" label-position="right" :label-width="85" class="fromStyle">
          <FormItem label="类目名称：">
            <Input placeholder='请填写类目名称' v-model="curCategoryDetail.categoryName" />
          </FormItem>
          <FormItem label="图片地址：">
            <Input placeholder='请填写图片地址' v-model="curCategoryDetail.imageUrl" />
          </FormItem>
          <FormItem label="父级分类编码：" v-if="categoryType===1">
            <Input placeholder='请填写父级分类编码' v-model="curCategoryDetail.parentCode " />
          </FormItem>
          <FormItem label="安全级别：">
            <Input placeholder='请填写安全级别' v-model="curCategoryDetail.safeLevel " />
          </FormItem>
          <!-- <FormItem label="创建人：">
          <Input  placeholder='请填写创建人' v-model="curCategoryDetail.createUser "/>
        </FormItem> -->
          <!-- <Input  placeholder='请选择' v-model="curCategoryDetail.showFlag "/> -->
          <!-- <FormItem label="是否显示：">
          <Select v-model="showFlag">
            <Option value="">全部</Option>
            <Option value="1">显示</Option>
            <Option value="2">不显示</Option>
          </Select>
        </FormItem> -->
          <FormItem label="排序值：" class="fromNumStyle">
            <InputNumber :max="10000" :min="0" v-model="curCategoryDetail.sortNumber"></InputNumber>
          </FormItem>
          <FormItem label="执行标准：">
            <Input placeholder='请填写执行标准' v-model="curCategoryDetail.standard" />
          </FormItem>
          <FormItem>
            <Button type="primary" class="addBtn" @click="addNotarizeModal">确认</Button>
            <Button class="cancelBtn" @click="closBtn">取消</Button>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  </c-view>
</template>
<script>
  export default {
    name: 'category',
    data() {
      return {
        query: {
          pageNum: 1,
          pageSize: 10
        },
        loading: false,
        listTotal: 0,
        categoryList: [],
        showModal: false,
        curCategoryDetail: {
          categoryName: '',
          imageUrl: '',
          parentCode: '',
          safeLevel: '',
          sortNumber: 100,
          categoryId: '',
          showFlag: '',
          createUser: ''
        },
        columns: [{
            title: '类别编码',
            align: 'center',
            key: 'categoryCode'
          },
          {
            title: '级别',
            align: 'center',
            key: 'categoryLevelText'
          },
          {
            title: '类目名称',
            align: 'center',
            key: 'categoryName'
          },
          {
            title: '是否展示',
            align: 'center',
            key: 'showFlagText'
          },
          {
            title: '状态',
            align: 'center',
            key: 'deleteFlagText'
          },
          {
            title: '标准',
            align: 'center',
            key: 'standard'
          },
          // {
          //   title: '大小',
          //   key: 'sizeName'
          // },
          // {
          //   title: 'parentId',
          //   key: 'parentId'
          // },
          // {
          //   title: 'parentCode',
          //   key: 'parentCode'
          // },
          {
            title: '更新时间',
            align: 'center',
            key: 'updated'
          },
          {
            title: '修改',
            align: 'center',
            slot: 'action'
            // render: (h, params) => {
            //   const This = this
            //   return h('div', [
            //     h('a', {
            //       on: {
            //         click: () => {
            //           This.openEditModal(params.row.categoryCode)
            //         }
            //       }
            //     }, '修改'),
            //     h('Divider', { props: { type: 'vertical' } }),
            //     h('a', {
            //       on: {
            //         click: () => {
            //           This.deleteItem(params.row)
            //         }
            //       }
            //     }, '删除')
            //   ])

            // }
          }
        ],
        categoryLevelList: ['一级类目', '二级类目', '三级类目', '四级类目', '五级类目'],
        showFlagList: ['不显示', '显示'],
        categoryLevel: '',
        categoryName: '',
        showFlag: '',
        modalTitle: '',
        categoryType: ''
      }
    },
    created() {
      this.queryCategoryList()
      // this.queryParentType()
    },
    methods: {
      closBtn() {
        this.showModal = false
      },
      searchBtn() {
        this.query.pageNum = 1
        this.queryCategoryList()
      },
      // 获取品类列表
      queryCategoryList() {
        let that = this
        let params = {
          ...this.query,
          categoryLevel: this.categoryLevel,
          categoryName: this.categoryName,
          showFlag: this.showFlag
        }
        this.loading = !this.loading
        this.$api.basic.queryCategory(params).then(res => {
          that.loading = !that.loading
          that.categoryList = res.data
          that.listTotal = res.totalCount
        })
      },
      pageChange(page) {
        this.query.pageNum = page
        this.queryCategoryList()
      },
      // openEditModal(categoryCode) {
      //   this.showModal = true
      //   this.queryDetail(categoryCode)
      // },
      // 获取品类详情
      // queryDetail(categoryCode) {
      //   this.$api.basic.queryCategoryDetail({ categoryCode }).then(res => {
      //     console.log('详情', res)
      //     this.curCategoryDetail = res.data
      //   }).catch(err => {

      //   })
      // },
      // 查询父类品类
      // queryParentType(){
      //   let that = this
      //   this.$api.basic.queryParentCategory().then(res=>{
      //     if(res.code == 0){
      //       console.log('父类的返回',res)
      //       console.log(res.data)
      //     }else {

      //     }
      //   }).catch(err=>{

      //   })
      // },
      // 删除品类
      deleteItem(row) {
        const This = this
        const params = {
          categoryId: row.categoryId
        }
        this.$Modal.confirm({
          title: '提示',
          content: '是否确定删除该品类？',
          onOk: () => {
            This.$api.basic.deleteCategory(params).then(res => {
              This.$Message.success(res.message)
              // 更新列表数据
              This.queryCategoryList()
            })
          },
          onCancel: () => {}
        })
      },
      // 打开新增类目弹框
      addModal(type, index) {
        if (type === 1) {
          this.showModal = true
          this.modalTitle = '新增'
          this.categoryType = 1
          this.curCategoryDetail = {}
          this.curCategoryDetail.sortNumber = 100
        } else if (type === 2) {
          this.showModal = true
          this.modalTitle = '修改'
          this.categoryType = 2
          this.curCategoryDetail.categoryName = this.categoryList[index].categoryName
          this.curCategoryDetail.createUser = this.categoryList[index].createUser
          this.curCategoryDetail.imageUrl = this.categoryList[index].imageUrl
          this.curCategoryDetail.safeLevel = this.categoryList[index].safeLevel
          this.curCategoryDetail.sortNumber = this.categoryList[index].sortNumber
          this.curCategoryDetail.standard = this.categoryList[index].standard
          this.curCategoryDetail.categoryId = this.categoryList[index].categoryId
          this.curCategoryDetail.parentCode = this.categoryList[index].parentCode
        }
      },
      addNotarizeModal() {
        let that = this
        if (!this.curCategoryDetail.categoryName) {
          this.$Message.info('请填写类目名称')
          return
        }
        if (!this.curCategoryDetail.imageUrl) {
          this.$Message.info('请填写图片地址')
          return
        }
        if (!this.curCategoryDetail.parentCode) {
          this.$Message.info('请填写父级分类编码')
          return
        }
        if (!this.curCategoryDetail.safeLevel) {
          this.$Message.info('请填写安全级别')
          return
        }
        if (!this.curCategoryDetail.sortNumber) {
          this.$Message.info('请填写排序值')
          return
        }
        if (!this.curCategoryDetail.standard) {
          this.$Message.info('请填写执行标准')
          return
        }

        this.loading = !this.loading
        if (this.categoryType === 1) {
          let data = {
            categoryName: this.curCategoryDetail.categoryName,
            createUser: this.curCategoryDetail.createUser,
            imageUrl: this.curCategoryDetail.imageUrl,
            safeLevel: this.curCategoryDetail.safeLevel,
            sortNumber: this.curCategoryDetail.sortNumber,
            standard: this.curCategoryDetail.standard
          }
          this.$api.basic.addCategory(data).then(res => {
            that.loading = !that.loading
            that.$Message.info('添加成功')
            that.queryCategoryList()
            that.showModal = false
          })
        } else if (this.categoryType === 2) {
          let data = {
            ...this.curCategoryDetail
          }
          this.$api.basic.updateCategory(data).then(res => {
            that.loading = !that.loading
            that.$Message.info('修改成功')
            that.queryCategoryList()
            that.showModal = false
          })
        }
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .inputLabel {
    margin-right: 40px;
  }

  .table,
  .select-bar,
  .update-item,
  .control-bar {
    margin-bottom: 10px
  }

  .selectWidth {
    width: 200px;
  }

  .deteleBtn {
    margin-right: 5px
  }

  .addBtn {
    margin-left: 40px
  }

  .cancelBtn {
    margin-left: 8px
  }

  .fromStyle {
    text-align: right;
    margin-right: 10px
  }

  .fromNumStyle {
    text-align: left;
  }

  .searchBtn {
    padding: 7px;
  }

</style>
