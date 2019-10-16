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
      <el-form-item label="类型名称:">
        <el-input v-model="formInline.name" placeholder="请输入类型名称"></el-input>
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
        label="类型名称"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="属性值"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="参数分类"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px" v-if="scope.row.type===0">分类</span>
          <span style="margin-left: 10px" v-else-if="scope.row.type===1">参数</span>
          <span style="margin-left: 10px" v-else>属性</span>
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.sort }}</span>
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
        label="更新人"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.updatedby }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.created }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
              <el-button size="mini" type="danger" @click="scope.row.visible = false">取消</el-button>
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
    <Page class="pageStyle" :total="listTotal" show-total @on-change="pageChange" />
    <el-dialog
      :title="modelTitle"
      :visible.sync="showModal"
      width="30%"
      >
      <el-form ref="formDynamic" :model="formDynamic" label-width="80px" class="demo-ruleForm fromStyle">
        <el-form-item label="参数分类:" v-if="this.typeStatus!==1">
          <el-input v-model="formDynamic.logiName" disabled />
        </el-form-item>
        <el-form-item label="参数分类:" v-else class="selectStyle">
          <el-select v-model="formDynamic.logiName" placeholder="请选择">
            <el-option label="参数" value="1"></el-option>
            <el-option label="属性" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称:">
          <el-input v-model="formDynamic.name" placeholder='请输入名称'></el-input>
          </el-form-item>
        <el-form-item label="排序:">
          <!-- <el-input v-model="formDynamic.sort" value="100" placeholder='排序'></el-input> -->
          <el-input-number v-model="formDynamic.sort" controls-position="right" :min="1" :max="10000"></el-input-number>
        </el-form-item>
        <el-form-item label="创建人:" v-if="this.typeStatus===1">
          <el-input v-model="formDynamic.createdby" placeholder='创建人'></el-input>
        </el-form-item>
        <el-form-item label="更新人:" v-if="this.typeStatus===2">
          <el-input v-model="formDynamic.updatedby" placeholder='更新人'></el-input>
        </el-form-item>

         <el-form-item
          v-for="(item, index) in formDynamic.items"
          :label="'属性值'"
          :key="item.key"
          :prop="'items.' + index + '.value'"

          :rules="{
            required: true, message: '属性值不能为空', trigger: 'blur'
          }"
        >
          <el-col :span="9">
            <el-input v-model="item.value" style="width: 100%;" placeholder="属性值"></el-input>
          </el-col>
          <el-col class="line" :span="1">&nbsp;&nbsp;</el-col>
          <el-col :span="9">
            <el-input v-model="item.description" style="width: 100%;" placeholder="备注"></el-input>
          </el-col>
          <el-col class="line" :span="1">&nbsp;&nbsp;</el-col>
          <el-col :span="4">
            <el-button @click.prevent="removeDomain(item, index)" v-if="index>0">删除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">新增</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="contentModal = false">取 消</el-button>
        <el-button type="primary" @click="addModalBtn">确 定</el-button>
      </span>
    </el-dialog>
    </Card>
  </c-view>
</template>
<script>
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
      showModal: false,
      modelTitle: '',
      typeStatus: '',
      index: 1,
      formInline: {
        name: ''
      },
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
    removeDomain(item, index) {
      // this.formDynamic.items[index].deleteFlag = 1;
      var indexItem = this.formDynamic.items.indexOf(item)
      if (indexItem !== -1) {
        this.formDynamic.items.splice(indexItem, 1)
      }
    },
    getGoodsattrvalList() {
      let that = this
      let params = {
        ...this.query,
        name: this.formInline.name
      }
      this.loading = !this.loading
      this.$api.basic.getGoodsattrval(params).then(res => {
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
    // 属性值新增
    addDomain () {
      this.formDynamic.items.push({
        value: '',
        index: this.index,
        status: 1,
        deleteFlag: 0
      })
    },
    // 新增
    addModal() {
      this.showModal = true
      this.formDynamic.items = []
      this.modelTitle = '添加属性'
      this.typeStatus = 1
      this.formDynamic.name = ''
      this.formDynamic.type = ''
      this.formDynamic.createdby = ''
      this.formDynamic.logiName = ''
      this.formDynamic.sort = 100
      let item = {
        value: '',
        description: '',
        index: 1,
        status: 1,
        deleteFlag: 0
      }
      this.formDynamic.items.push(item)
    },
    modifModal(index, data) {
      this.showModal = true
      this.modelTitle = '编辑属性'
      this.typeStatus = 2
      this.formDynamic.sort = this.list[index].sort
      if (this.list[index].type === 0) {
        this.formDynamic.logiName = '类型'
      } else if (this.list[index].type === 1) {
        this.formDynamic.logiName = '参数'
      } else if (this.list[index].type === 2) {
        this.formDynamic.logiName = '属性'
      }
      this.formDynamic.name = this.list[index].name
      this.formDynamic.id = this.list[index].id

      this.formDynamic.items = []
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
      }
    },
    addModalBtn() {
      let that = this
      if (!this.formDynamic.logiName) {
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
          type: this.formDynamic.logiName // 参数分类：0:一级类型，1:参数，2:属性
        }
        for (var i = 0; i < this.formDynamic.items.length; i++) {
          var obj = {
            description: this.formDynamic.items[i].description, // 值备注信息
            value: this.formDynamic.items[i].value // 参数类型值
          }
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
          console.log(this.formDynamic.items[i].deleteFlag)
          console.log(this.formDynamic.items[i].id)
          console.log('0000000000000000')
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
    deleteModal(row, index) {
      const that = this
      const params = {
        id: index.id
      }
      this.$api.basic.deleteGoodsattrval(params).then(res => {
        that.$Message.success('删除成功')
        // 更新列表数据
        that.getGoodsattrvalList()
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
.title{
  display: flex;
  justify-content: space-between
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
.fromStyle{
  margin: 0 10px
}
.pageStyle{
  margin-top: 10px;
}
.selectStyle{
  display: block
}
.el-select {
  display: block
}
</style>
