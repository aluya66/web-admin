<template>
  <c-view>
      <template v-slot:header>
        <div class="title">
          {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        </div>
      </template>
    <Card>
      <div class="select-bar">
        名称：
        <Input placeholder="请输入名称" v-model="name" class="selectWidth" />
        <Button type="primary"  @click="searchBtn"><Icon class="iconSize" type="ios-add-circle-outline"/>搜索</Button>
        <Button type="primary"  @click="addModal(1)"><Icon class="iconSize" type="ios-add-circle-outline"/>添加</Button>
      </div>
      <Table :loading="loading" border :columns="columns" :data="list" class="table">
        <template slot="bmsGoodsAttrVals">
          <span v-for="(item, index) in valueList" :key="index">{{item.value}}</span>
        </template>
        <template slot-scope="{ row }" slot="type">
          <span v-if="row.type===1">参数</span>
          <span v-else-if="row.type===2">属性</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <a size="small" href="#" class="deteleBtn" @click="addModal(2, index)">编辑</a>
          <a size="small" href="#" class="deteleBtn" @click="deleteModal(row, index)">删除</a>
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
          <!-- <FormItem label="属性名称:">
            <Select v-model="formDynamic.name">
              <Option value="上衣">上衣</Option>
              <Option value="裤子">裤子</Option>
              <Option value="鞋子">鞋子</Option>
            </Select>
          </FormItem> -->
          <FormItem label="参数分类:" >
            <Select v-model="formDynamic.type" v-if="this.typeStatus===1">
              <!-- <Option value="0">类型</Option> -->
              <Option value="1">参数</Option>
              <Option value="2">属性</Option>
            </Select>
            <Input v-else v-model="formDynamic.type" disabled />
          </FormItem>
          <FormItem label="名称:" >
            <Input  placeholder='请输入名称' v-model="formDynamic.name"/>
          </FormItem>
          <FormItem label="排序:">
            <Input value="100" v-model="formDynamic.sort"/>
          </FormItem>
          <FormItem label="创建人：" v-if="this.typeStatus===1">
            <Input  placeholder='请输入创建人' v-model="formDynamic.createdby"/>
          </FormItem>
          <FormItem label="更新人：" v-if="this.typeStatus===2">
            <Input  placeholder='请输入更新人' v-model="formDynamic.updatedby"/>
          </FormItem>
          <!-- v-if="item.status" -->
          <FormItem
            v-for="(item, index) in formDynamic.items"
            :key="index"
            :label="'属性值:'"
            :prop="'items.' + index + '.value'"
            >
            <!-- :rules="{required: true, message: '属性值 ' + item.index +'不能为空', trigger: 'blur'}" -->
            <Row>
              <Col span="9">
                <Input type="text" v-model="item.value" placeholder="属性值" />
              </Col>
              <Col span="9">
                <Input type="text" v-model="item.description" placeholder="备注" />
              </Col>
              <Col span="4" offset="1" v-if="index>0">
                <Button @click="handleRemove(index)">删除</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
              <Col span="16"><Button type="dashed" long @click="handleAdd" >添加</Button></Col>
            </Row>
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
    title: '名称',
    key: 'name'
  },
  {
    title: '属性值',
    key: 'value'
  },
  {
    title: '时间',
    key: 'created'
  },
  {
    title: '创建人',
    key: 'createdby'
  },
  {
    title: '更新人',
    key: 'updatedby'
  },
  {
    title: '状态',
    key: 'deleteFlagCN'
  },
  {
    title: '参数分类',
    slot: 'type'
  },
  {
    title: '排序',
    key: 'sort'
  },
  {
    title: '操作',
    slot: 'action'
  }
]
export default {
  name: 'merchandise',
  data() {
    return {
      query: {
        pageNum: 1,
        numPerPage: 10
      },
      listTotal: 0,
      loading: false,
      list: [],
      valueList: {},
      columns,
      showModal: false,
      modelTitle: '',
      typeStatus: '',
      index: 1,
      name: '',
      type: '',
      formDynamic: {
        name: '',
        sort: 100,
        createdby: '',
        updatedby: '',
        type: '',
        id: '',
        items: []
      }
    }
  },
  created() {
    this.getGoodsattrvalList()
  },
  methods: {
    getGoodsattrvalList() {
      let that = this
      let data = {
        ...this.query,
        name: this.name
      }
      this.loading = !this.loading
      this.$api.basic.getGoodsattrval(data).then(res => {
        that.loading = !that.loading
        that.list = res.data
        res.data.map((item, index) => {
          let valueList = item.bmsGoodsAttrVals.map(valueList => {
            return valueList.value
          })
          item.value = valueList.filter(d => d).join(' / ')
        })
        that.listTotal = res.totalCount
      })
    },
    handleAdd () {
      this.index++
      this.formDynamic.items.push({
        value: '',
        index: this.index,
        status: 1,
        deleteFlag: 0
      })
    },
    handleRemove (index) {
      this.formDynamic.items[index].status = 0
      this.formDynamic.items[index].value = ''
      this.formDynamic.items[index].description = ''
      this.formDynamic.items[index].deleteFlag = 1
    },
    addModal(type, index) {
      this.showModal = true
      this.formDynamic.items = []
      if (type === 1) {
        this.modelTitle = '添加属性'
        this.typeStatus = 1
        this.formDynamic.sort = 100
        this.formDynamic.name = ''
        this.formDynamic.type = ''
        this.formDynamic.createdby = ''
        let item = {
          value: '',
          description: '',
          index: 1,
          status: 1,
          deleteFlag: 0
        }
        this.formDynamic.items.push(item)
      } else if (type === 2) {
        this.modelTitle = '编辑属性'
        this.typeStatus = 2
        this.formDynamic.sort = this.list[index].sort
        if (this.list[index].type === 0) {
          this.formDynamic.type = '类型'
        } else if (this.list[index].type === 1) {
          this.formDynamic.type = '参数'
        } else if (this.list[index].type === 2) {
          this.formDynamic.type = '属性'
        }
        this.formDynamic.name = this.list[index].name
        this.formDynamic.id = this.list[index].id

        for (var i = 0, len = this.list[index].bmsGoodsAttrVals.length; i < len; i++) {
          let target = this.list[index].bmsGoodsAttrVals[i]
          let item = {
            value: target.value,
            description: target.description || '',
            id: target.id,
            index: i + 1,
            status: 1
          }
          this.formDynamic.items.push(item)
          console.log(this.formDynamic.items)
        }
        console.log(this.list[index].bmsGoodsAttrVals.length)
      }
    },
    addModalBtn() {
      let that = this
      if (!this.formDynamic.type) {
        this.$Message.info('请选择参数分类')
        return
      }
      if (!this.formDynamic.name) {
        this.$Message.info('请填写名称')
        return
      }
      if (!this.formDynamic.sort) {
        this.$Message.info('请填写排序')
        return
      }
      if (this.typeStatus === 1) {
        if (!this.formDynamic.createdby) {
          this.$Message.info('请填写创建人')
          return
        }
        if (!this.formDynamic.items[0].value) {
          this.$Message.info('请填写属性值')
          return
        }
        let data = {
          bmsGoodsAttrValAddReqs: [],
          createdby: this.formDynamic.createdby, // 创建人
          name: this.formDynamic.name, // 类型名称
          // paramType: '1',       //参数分类为1时:text文本框，radio单选，checkbox复选框 (默认空)
          parentId: 0, // 父类类型id,默认：null
          sort: this.formDynamic.sort, // 商品类型属性排序 越小越靠前，默认100
          type: this.formDynamic.type // 参数分类：0:一级类型，1:参数，2:属性
        }
        for (var i = 0; i < this.formDynamic.items.length; i++) {
          var obj = {
            description: this.formDynamic.items[i].description, // 值备注信息
            value: this.formDynamic.items[i].value // 参数类型值
          }
          console.log(obj.value)
          if (obj.value !== '') {
            data.bmsGoodsAttrValAddReqs.push(obj)
          }
        }
        this.loading = !this.loading
        this.$api.basic.addGoodsattrval(data).then(res => {
          that.loading = !that.loading
          that.$Message.info('新增成功')
          that.showModal = false
          that.getGoodsattrvalList()
        })
      } else if (this.typeStatus === 2) {
        if (!this.formDynamic.updatedby) {
          this.$Message.info('请填写更新人')
          return
        }
        if (this.formDynamic.type === '类型') {
          this.type = 0
        } else if (this.formDynamic.type === '参数') {
          this.type = 1
        } else if (this.formDynamic.type === '属性') {
          this.type = 2
        }
        let data = {
          id: this.formDynamic.id,
          bmsGoodsAttrValUpdateReqs: [],
          name: this.formDynamic.name, // 类型名称
          // paramType: '1',                           //参数分类为1时:text文本框，radio单选，checkbox复选框 (默认空)
          parentId: 0, // 父类类型id,默认：null
          sort: this.formDynamic.sort, // 商品类型属性排序 越小越靠前，默认100
          type: this.type, // 参数分类：0:一级类型，1:参数，2:属性
          updatedby: this.formDynamic.updatedby // 更新人
        }
        for (let i = 0; i < this.formDynamic.items.length; i++) {
          let obj = {
            description: this.formDynamic.items[i].description, // 值备注信息
            value: this.formDynamic.items[i].value, // 参数类型值
            id: this.formDynamic.items[i].id,
            deleteFlag: this.formDynamic.items[i].deleteFlag
          }
          data.bmsGoodsAttrValUpdateReqs.push(obj)
        }
        this.loading = !this.loading
        this.$api.basic.updateGoodsattrval(data).then(res => {
          that.loading = !that.loading
          that.$Message.info('修改成功')
          that.showModal = false
          that.getGoodsattrvalList()
        })
      }
    },
    deleteModal(row) {
      const that = this
      const params = {
        id: row.id
      }
      this.$Modal.confirm({
        title: '提示',
        content: '是否确定删除该品类？',
        onOk: () => {
          that.$api.basic.deleteGoodsattrval(params).then(res => {
            that.$Message.success(res.message)
            // 更新列表数据
            that.getGoodsattrvalList()
          })
        },
        onCancel: () => {
        }
      })
    },
    closBtn() {
      this.showModal = false
    },
    pageChange(page) {
      this.query.pageNum = page
      this.getGoodsattrvalList()
    },
    searchBtn() {
      this.query.pageNum = 1
      this.getGoodsattrvalList()
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
.addBtn{
  margin-left: 40px
}
.cancelBtn{
  margin-left: 8px
}
.deteleBtn{
  margin-right: 5px
}
</style>
