<template>
<c-view>
		<template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addModal">新增</el-button>
			</div>
		</template>
  <Card>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item label="标签名称:">
          <el-input v-model="formInline.labelName" placeholder="请输入名称"></el-input>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchBtn" >搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      border
      style="width: 100%">
      <el-table-column
        label="标签名称"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.labelName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="拼音大写"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.initial }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标签编码"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.labelCode }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标签类型"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.labelTypeCN }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标签描述"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.labelDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.labelStatusCN }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.createdby }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.created }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.updated }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="modifModal(scope.$index, scope.row)">编辑</el-button>
          <el-popover
            placement="top"
            width="160"
            title="确定删除吗？"
            trigger="click"
            v-model="scope.row.visible">
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteModal(scope.$index, scope.row, scope.row.visible = false)">确定</el-button>
            </div>
          <el-button
            slot="reference"
            size="mini"
            type="danger"
            class="el-icon-delete"
            >删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <Page :total="listTotal" show-total @on-change="pageChange" />
    </div>
    <Modal
      v-model="showModal"
      :title="modelTitle"
      width="400"
      footer-hide
      >
      <Form :model="formDynamic" label-position="right" :label-width="75" class="fromStyle">
        <FormItem label="标签名称:" >
          <Input  placeholder='请输入标签名称' v-model="formDynamic.labelName"/>
        </FormItem>
        <FormItem label="标签拼音:" >
          <Input  placeholder='请输入标签拼音' v-model="formDynamic.initial"/>
        </FormItem>
        <FormItem label="标签状态:" v-if="statusType===2">
          <RadioGroup v-model="formDynamic.labelStatus">
            <Radio label="有效" true-value='1'></Radio>
            <Radio label="无效" true-value='2'></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="创建人:" v-if="statusType===1">
          <Input  placeholder='请输入创建人' v-model="formDynamic.createdby"/>
        </FormItem>
        <FormItem label="更新人:" v-if="statusType===2">
          <Input  placeholder='请输入更新人' v-model="formDynamic.updatedby"/>
        </FormItem>
        <FormItem label="标签分类:" >
          <CheckboxGroup  v-model="formDynamic.labelParentIds">
            <Checkbox :label="item.id" :true-value='item.id'  v-for="item in addSoreList" :key="item.id">
              {{item.categoryName}}
            </Checkbox>
          </CheckboxGroup >
        </FormItem>
        <FormItem label="标签描述:" >
          <Input v-model="formDynamic.labelDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入标签描述" />
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
export default {
  name: 'shopLable',
  data() {
    return {
      visible: false,
      list: [],
      addSoreList: [],
      query: {
        numPerPage: 10,
        pageNum: 1
      },
      listTotal: 0,
      loading: false,
      formInline: {
        labelName: ''
      },
      statusType: '',
      showModal: false,
      modelTitle: '',
      formDynamic: {
        initial: '', // 标签拼音
        labelDesc: '', // 标签描述
        labelName: '', // 标签名称
        labelStatus: '', // 标签状态 1 有效 2 无效
        labelType: '', // 标签类型 1 商品 2 用户
        createdby: '', // 创建人
        updatedby: '', // 更新人
        labelParentIds: [], // 分类id
        categoryName: []
      },
      labelStatus: '',
      labelParentIds: []
    }
  },
  created() {
    this.getQuerypageList()
    this.getaddSoreQuerypage()
  },
  methods: {
    addModal() {
      this.showModal = true
      this.statusType = 1
      this.modelTitle = '新增'
      this.formDynamic = {}
    },
    modifModal(index, data) {
      this.showModal = true
      this.statusType = 2
      this.modelTitle = '编辑'
      this.formDynamic.initial = this.list[index].initial
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
      this.formDynamic.labelParentIds = []
      for (let i in checkData) {
        this.formDynamic.labelParentIds.push(checkData[i].id)
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
          labelType: 2,
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
          labelType: 2,
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
        categoryType: 2
      }
      this.$api.basic.addSoreQuerypage(data).then(res => {
        that.addSoreList = res.data
      })
    },
    closBtn() {

    },
    deleteModal(row, index) {
      const that = this
      const data = {
        id: index.id
      }
      this.$api.basic.deleteQuerypage(data).then(res => {
        that.$Message.success('删除成功')
        // 更新列表数据
        that.getQuerypageList()
      })
    },
    getQuerypageList() {
      let that = this
      let data = {
        ...this.query,
        labelName: this.formInline.labelName,
        labelType: 2
      }
      this.loading = !this.loading
      this.$api.basic.getQuerypage(data).then(res => {
        that.loading = !that.loading
        that.list = res.data || []
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
.title{
  display: flex;
  justify-content: space-between;
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
.fromStyle{
  margin-right: 10px
}
.block{
  margin-top: 10px
}
</style>
