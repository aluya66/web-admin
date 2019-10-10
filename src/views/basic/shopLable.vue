<template>
<c-view>
		<template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
		</template>
  <Card>
    <div class="select-bar">
      标签名称：
      <Input placeholder="请输入名称" class="selectWidth" v-model="labelName"/>
      <Button type="primary" @click="searchBtn"><Icon class="iconSize" type="ios-add-circle-outline"/>搜索</Button>
      <Button type="primary" @click="addModel(1)"><Icon class="iconSize" type="ios-add-circle-outline"/>添加</Button>
    </div>
    <Table :loading="loading" border :columns="columns" :data="list" class="table">
      <template slot-scope="{ row, index }" slot="action">
        <a size="small" href="#" class="deteleBtn" @click="addModel(2,index)" >编辑</a>
        <a size="small" href="#" class="deteleBtn" @click="deleteModel(row,index)">删除</a>
      </template>
    </Table>
    <Page :total="listTotal" show-total @on-change="pageChange" />
    <Modal
      v-model="showModal"
      :title="modelTitle"
      width="400"
      footer-hide
      >
      <Form :model="formDynamic" label-position="right" :label-width="75" >
        <FormItem label="标签名称:" >
          <Input  placeholder='请输入标签名称' v-model="formDynamic.labelName"/>
        </FormItem>
        <FormItem label="标签状态:" v-if="statusType===2">
          <RadioGroup v-model="formDynamic.labelStatus">
            <Radio label="有效" true-value='1'></Radio>
            <Radio label="无效" true-value='2'></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="标签描述:" >
          <Input  placeholder='请输入标签描述' v-model="formDynamic.labelDesc"/>
        </FormItem>
        <FormItem label="创建人:" v-if="statusType===1">
          <Input  placeholder='请输入创建人' v-model="formDynamic.createdby"/>
        </FormItem>
        <FormItem label="更新人:" v-if="statusType===2">
          <Input  placeholder='请输入更新人' v-model="formDynamic.updatedby"/>
        </FormItem>
        <FormItem label="标签分类:" >
          <CheckboxGroup  v-model="formDynamic.labelParentIds">
            <Checkbox  :label="item.id" :true-value='item.id'  v-for="(item, index) in addSoreList" :key="index">
              {{item.categoryName}}
            </Checkbox>
          </CheckboxGroup >
        </FormItem>
        <FormItem>
          <Button type="primary" class="addBtn" @click="addModalBtn">保存</Button>
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
    title: '标签code',
    key: 'labelCode'
  },
  {
    title: '标签名称',
    key: 'labelName'
  },
  {
    title: '标签类型',
    key: 'labelTypeCN'
  },
  {
    title: '标签描述',
    key: 'labelDesc'
  },
  {
    title: '状态',
    key: 'labelStatusCN'
  },
  {
    title: '拼音大写',
    key: 'initial'
  },
  {
    title: '创建时间',
    key: 'created'
  },
  {
    title: '创建人',
    key: 'createdby'
  },
  {
    title: '更新时间',
    key: 'updated'
  },
  {
    title: '操作',
    slot: 'action'
  }
]
export default {
  name: 'userLable',
  data() {
    return {
      columns,
      list: [],
      addSoreList: [],
      query: {
        numPerPage: 10,
        pageNum: 1
      },
      listTotal: 0,
      loading: false,
      labelName: '',
      statusType: '',
      showModal: false,
      modelTitle: '',
      formDynamic: {
        labelDesc: '', // 标签描述
        labelName: '', // 标签名称
        labelStatus: '', // 标签状态 1 有效 2 无效
        labelType: '', // 标签类型 1 商品 2 用户
        createdby: '', // 创建人
        updatedby: '', // 更新人
        labelParentIds: [] // 分类id
        // labelCode: ''            // 标签code
      },
      labelStatus: ''
    }
  },
  created() {
    this.getQuerypageList()
    this.getaddSoreQuerypage()
  },
  methods: {
    addModel(type, index) {
      this.showModal = true
      if (type === 1) {
        this.statusType = 1
        this.modelTitle = '新增'
        this.formDynamic = {}
      } else if (type === 2) {
        this.statusType = 2
        this.modelTitle = '编辑'
        // this.formDynamic.target=this.list[index].target
        this.formDynamic.labelDesc = this.list[index].labelDesc
        this.formDynamic.labelName = this.list[index].labelName
        this.formDynamic.labelStatus = this.list[index].labelStatusCN
        this.formDynamic.labelType = this.list[index].labelTypeCN
        this.formDynamic.createdby = this.list[index].createdby
        this.formDynamic.updatedby = this.list[index].updatedby
        this.formDynamic.id = this.list[index].id
        let checkData = this.list[index].labelCategoryModels.map(({ id }) => {
          return {
            id
          }
        })
        for (let i in checkData) {
          this.formDynamic.labelParentIds.push(checkData[i].id)
        }
      }
    },
    addModalBtn() {
      let that = this
      if (!this.formDynamic.labelName) {
        this.$Message.info('请填写标签名称')
        return
      }
      if (!this.formDynamic.labelDesc) {
        this.$Message.info('请填写标签描述')
        return
      }
      if (!this.formDynamic.labelParentIds) {
        this.$Message.info('请选择标签分类')
        return
      }
      if (this.formDynamic.labelStatus === '有效') {
        this.labelStatus = 1
      } else if (this.formDynamic.labelStatus === '无效') {
        this.labelStatus = 2
      }
      if (this.statusType === 1) {
        if (!this.formDynamic.createdby) {
          this.$Message.info('请填写创建人')
          return
        }
        let data = {
          ...this.formDynamic,
          // labelStatus: this.labelStatus,
          labelType: 1,
          labelParentIds: this.formDynamic.labelParentIds
        }
        this.$api.basic.addQuerypage(data).then(res => {
          that.showModal = false
          that.$Message.info('新增成功')
          that.getQuerypageList()
        })
      } else if (this.statusType === 2) {
        if (!this.formDynamic.updatedby) {
          this.$Message.info('请填写更新人')
          return
        }
        let data = {
          id: this.formDynamic.id,
          ...this.formDynamic,
          labelStatus: this.labelStatus,
          labelType: 1,
          labelParentIds: this.formDynamic.labelParentIds
        }
        this.$api.basic.updateQuerypage(data).then(res => {
          that.showModal = false
          that.$Message.info('修改成功')
          that.getQuerypageList()
        })
      }
    },
    getaddSoreQuerypage() {
      let that = this
      let data = {
        categoryType: 1
      }
      this.$api.basic.addSoreQuerypage(data).then(res => {
        that.addSoreList = res.data
      })
    },
    closBtn() {
      this.showModal = false
    },
    deleteModel(row) {
      const that = this
      const params = {
        id: row.id
      }
      this.$Modal.confirm({
        title: '提示',
        content: '是否确定删除该品类？',
        onOk: () => {
          that.$api.basic.deleteQuerypage(params).then(res => {
            that.$Message.success(res.message)
            // 更新列表数据
            that.getQuerypageList()
          })
        },
        onCancel: () => {
        }
      })
    },
    getQuerypageList() {
      let that = this
      let data = {
        ...this.query,
        labelName: this.labelName,
        labelType: 1
      }
      this.loading = !this.loading
      this.$api.basic.getQuerypage(data).then(res => {
        that.loading = !that.loading
        that.list = res.data
        that.listTotal = res.totalCount
      })
    },
    searchBtn() {
      this.query.pageNum = 1
      this.getQuerypageList()
    },
    pageChange(page) {
      this.query.pageNum = page
      this.getQuerypageList()
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
