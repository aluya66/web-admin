<template>
  <c-view>
		<template v-slot:header>
      <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <div class="title">
              {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
            </div>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" size="small" icon="el-icon-circle-plus" @click="addInsert(1)">新增</el-button>
          </el-col>
      </el-row>
			<!-- <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
      </div> -->

		</template>
    <Card>

      <div class="select-bar">
          <el-form :inline="true"  class="demo-form-inline">
            <el-row type="flex">
                <el-col :span="5">
                    <el-form-item label="app名称:" class="inputLabel">
                        <el-input  placeholder="请输入app名称" v-model="appName" size="small"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="appCode:">
                        <el-input  placeholder="请输入appcode" v-model="appCode" size="small"></el-input>
                    </el-form-item>
                </el-col>
               <el-col :span="5">
                  <el-form-item label="appKey:">
                      <el-input  placeholder="请输入appKey" v-model="appKey" size="small"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="状态:">
                        <el-select  placeholder="请选择状态" v-model="statusType" size="small">
                          <el-option label="全部" value=""></el-option>
                          <el-option label="启用" value="1"></el-option>
                          <el-option label="禁用" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4" class="searchBtn">
                    <el-button type="primary" size="small" icon="el-icon-search" @click="searchBtn()">搜索</el-button>
                </el-col>

            </el-row>
          </el-form>
        <!-- app名称：
        <Input placeholder="请输入app名称" v-model="appName" class="selectWidth" />
        appCode：
        <Input placeholder="请输入appcode" v-model="appCode" class="selectWidth" />
        appKey：
        <Input placeholder="请输入appKey" v-model="appKey" class="selectWidth" />
        状态：
        <Select v-model="statusType" class="selectWidth">
          <Option value="">全部</Option>
          <Option value="1">启用</Option>
          <Option value="2">禁用</Option>
        </Select>
        <Button class="btnStyle" type="primary" @click="searchBtn"><Icon :size='16' type="ios-search" />搜索</Button>
                  <Button class="btnStyle" type="primary" @click="addInsert(1)"><Icon :size='16' type="ios-add-circle-outline"/>新增</Button>
         -->
      </div>
      <Table :loading="loading" border :columns="columns" :data="list" class="table">
        <template slot-scope="{ row }" slot="status">
          <span v-if="row.status ===1">启用</span>
          <span v-else>禁用</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <!-- <Button type='success' size="small" @click="addInsert(2, index)"><Icon :size='14' type="md-create" />编辑</Button> -->
          <el-button type="primary" size="small" icon="el-icon-edit" @click="addInsert(2, index)">编辑</el-button>
        </template>
      </Table>
      <!-- 新增 -->
      <Modal
        v-model="contentModal"
        :title="basicTitle"
        width="800"
        footer-hide
        >
        <Form :model="formLeft" label-position="right" :label-width="70" >
          <FormItem label="app名称">
            <Input v-model="formLeft.appName" placeholder='请填写app名称'/>
          </FormItem>
          <FormItem label="appCode" v-if="typeStatus===1">
            <Input v-model="formLeft.appCode" placeholder='请填写appCode'/>
          </FormItem>
          <FormItem label="状态" v-if="typeStatus===2">
            <RadioGroup v-model="formLeft.input5">
              <Radio label="启用" true-value='1'></Radio>
              <Radio label="禁用" true-value='2'></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="描述">
            <Input
            v-model="formLeft.description"
            placeholder='请填写描述'
            type="textarea"
            :autosize="{minRows: 2,maxRows: 10}"
            />
          </FormItem>
          <FormItem>
            <Button type="primary" class="addBtn" @click="addContentModal">确认</Button>
            <Button class="cancelBtn" @click="cancel">取消</Button>
          </FormItem>
        </Form>
      </Modal>
      <Page :total="listTotal" show-total @on-change="pageChange" />
    </Card>
  </c-view>
</template>
<script>
export default {
  name: 'bussinessLine',
  data() {
    return {
      list: [], // 应用列表
      listTotal: 0,
      contentModal: false,
      curBussinessContent: {},
      query: {
        pageNum: 1,
        pageSize: 10
      },
      loading: false,
      columns: [
        {
          title: 'app名称',
          key: 'appName'
        },
        {
          title: 'appCode',
          key: 'appCode'
        },
        {
          title: 'appKey',
          key: 'appKey'
        },
        {
          title: '状态',
          slot: 'status'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '创建时间',
          key: 'created'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      basicTitle: '',
      modal1: false,
      appName: '',
      appCode: '',
      appKey: '',
      formLeft: {
        appName: '',
        appCode: '',
        // appKey: '',
        description: '',
        input5: '',
        id: ''
      },
      status: '',
      statusType: '',
      statusName: '',
      typeStatus: ''
    }
  },
  created() {
    this.queryBussinessList()
  },
  methods: {
    // 添加/修改业务
    addInsert(type, index) {
      if (type === 1) {
        this.contentModal = true
        this.basicTitle = '新增'
        this.typeStatus = 1
        this.formLeft = {}
      } else if (type === 2) {
        if (this.list[index].status === 1) {
          this.statusName = '启用'
        } else if (this.list[index].status === 2) {
          this.statusName = '禁用'
        }
        this.contentModal = true
        this.basicTitle = '修改'
        this.typeStatus = 2
        this.formLeft.appName = this.list[index].appName
        this.formLeft.appCode = this.list[index].appCode
        this.formLeft.appKey = this.list[index].appKey
        this.formLeft.description = this.list[index].description
        this.formLeft.input5 = this.statusName
        this.formLeft.id = this.list[index].id
      }
    },
    cancel () {
      this.contentModal = false
      this.contentModal = false
    },
    // 搜索
    searchBtn() {
      this.query.pageNum = 1
      this.queryBussinessList()
    },
    // 获取业务列表
    queryBussinessList() {
      let that = this
      let data = {
        ...this.query,
        appName: this.appName,
        appCode: this.appCode,
        appKey: this.appKey,
        status: this.statusType
      }
      this.loading = !this.loading
      this.$api.basic.businessList(data).then(res => {
        that.loading = !that.loading
        that.list = res.data
        that.listTotal = res.totalCount
      })
    },
    // 打开添加业务详情弹窗
    addContentModal() {
      console.log(this.typeStatus)
      let that = this
      if (!this.formLeft.appName) {
        this.$Message.info('请填写app名称')
        return
      }
      if (!this.formLeft.appCode) {
        this.$Message.info('请填写appCode')
        return
      }
      if (!this.formLeft.description) {
        this.$Message.info('请填写描述')
        return
      }
      if (this.formLeft.input5 === '启用') {
        this.status = 1
      } else if (this.formLeft.input5 === '禁用') {
        this.status = 2
      }
      this.loading = !this.loading
      if (this.typeStatus === 1) {
        let data = {
          status: this.status,
          ...this.formLeft
        }
        this.$api.basic.addBusiness(data).then(res => {
          that.loading = !that.loading
          that.$Message.info('添加成功')
          that.contentModal = false
          that.queryBussinessList()
        })
      } else if (this.typeStatus === 2) {
        let data = {
          status: Number(this.status),
          ...this.formLeft
        }
        this.$api.basic.updateBusiness(data).then(res => {
          that.loading = !that.loading
          that.$Message.info('修改成功')
          that.contentModal = false
          that.queryBussinessList()
        })
      }
    },
    // 分页器
    pageChange(page) {
      this.query.pageNum = page
      this.queryBussinessList()
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.select-bar,
.table{
  margin-bottom: 10px;
}
.selectWidth{
  width: 200px;
  margin-bottom:10px
}
.btnStyle{
  margin-bottom:10px
}
.addBtn{
  margin-left: 40px
}
.cancelBtn{
  margin-left: 8px
}
.el-form-item >>> label{
  font-weight: 400;
}
.searchBtn{
  padding:7px;
}
</style>
