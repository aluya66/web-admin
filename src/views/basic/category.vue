<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button type="primary" icon="el-icon-plus" @click="addHandle(1)">新增</el-button>
      </div>
    </template>
    <div class="main__box" >
      <div class="category__box">
          <el-input
            class="category__box__input"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <div class="category__box__tree">
            <el-tree
              :data="dataItems"
              :props="defaultProps"
              ref="categoryTree"
              node-key="id"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button type="text" v-if="node.data.childrenList.length>0" @click="() => addHandle(2, data)">新增</el-button>
                    <el-button type="text" @click="() => editHandle(node, data)">编辑</el-button>
                    <el-button type="text" style="margin-left: 6px;" @click="deteleCategory(node, data)">删除</el-button>
                  </span>
                </span>
            </el-tree>
          </div>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogShop">
      <el-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-width="120px"
        class="form"
        label-position="right"
        status-icon
      >
        <el-form-item label="类目名称:" prop="categoryName" >
          <el-input
            v-model.trim="formModel.categoryName"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="安全级别:" prop="safeLevel">
          <el-select
            v-model="formModel.safeLevel"
            class="select-item"
            clearable
          >
            <el-option
              v-for="item in safeLevelSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sortNumber">
          <el-input-number
            v-model.trim="formModel.sortNumber"
            class="select-item"
            controls-position="right"
            :min="1"
            :max="10000"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="执行标准:">
          <el-input
            v-model.trim="formModel.standard"
            class="form-item"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShop = false">取 消</el-button>
        <el-button type="primary" @click="addModalBtn">确 定</el-button>
      </div>
    </el-dialog>

  </c-view>
</template>
<script>

export default {
  name: 'category',
  data() {
    return {
      popoverShow: false,
      dataItems: [],
      defaultProps: {
        children: 'childrenList',
        label: 'categoryName'
      },
      formModel: {
        categoryName: '', // 分类名称
        parentCode: '', // 父分类编码code，不填默认为父级分类
        safeLevel: '', // 安全级别
        sortNumber: 100, // 排序值
        standard: '' // 执行标准
      },
      rules: {
        categoryName: [
          { required: true, message: '请填写类目名称', trigger: 'blur' }
        ],
        safeLevel: [
          { required: true, message: '请选择安全级别', trigger: 'change' }
        ],
        sortNumber: [
          { required: true, message: '请填写排序值', trigger: 'blur' }
        ]
        // standard: [
        //   { required: true, message: '请填写执行标准', trigger: 'blur' }
        // ]
      },
      dialogTitle: '',
      dialogShop: false,
      isEdit: false,
      filterText: '',
      safeLevelSelect: [
        {
          value: 1,
          label: '一级'
        },
        {
          value: 2,
          label: '二级'
        },
        {
          value: 3,
          label: '三级'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    filterText(val) {
      this.$refs.categoryTree.filter(val)
    }
  },
  methods: {
    fetchData() {
      this.isLoading = true
      this.$api.basic
        .queryCategory()
        .then(res => {
          this.isLoading = false
          this.dataItems = res || []
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.categoryName.indexOf(value) !== -1
    },
    addHandle(type, node) {
      this.dialogShop = true
      this.isEdit = true
      this.dialogTitle = '新增类目'
      if (type === 1) {
        this.formModel = {
          categoryName: '',
          parentCode: '',
          safeLevel: '',
          sortNumber: 100,
          standard: ''
        }
      } else {
        this.formModel = {
          categoryName: '',
          parentCode: node.categoryCode,
          safeLevel: '',
          sortNumber: 100,
          standard: ''
        }
      }
    },
    editHandle(node, data) {
      this.dialogShop = true
      this.isEdit = false
      this.dialogTitle = '编辑类目'
      this.formModel = {
        ...this.formModel,
        categoryName: data.categoryName,
        categoryId: data.categoryId,
        parentCode: data.parentCode
      }
    },
    deteleCategory(node, data) {
      const { categoryName, categoryId } = data
      this.$confirm(`确认删除${categoryName}此商品类目`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.deleteData(categoryId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteData(categoryId) {
      this.$api.basic.deleteCategory({ categoryId }).then(() => {
        if (this.dataItems.length === 1) {
          const { pageNum } = this.pageInfo
          this.pageInfo.pageNum = pageNum > 1 ? pageNum - 1 : 1
        }
        this.fetchData()
      })
    },
    addModalBtn(formModel) {
      if (this.isEdit === true) {
        // 新增
        const { categoryName, parentCode, safeLevel, sortNumber, standard } = this.formModel
        this.$api.basic.addCategory({
          categoryName,
          parentCode,
          safeLevel,
          sortNumber,
          standard
        }).then(res => {
          this.$msgTip('添加成功')
          this.fetchData()
          this.dialogShop = false
        })
      } else {
        // 编辑
        const { categoryName, parentCode, categoryId, safeLevel, sortNumber, standard } = this.formModel
        this.$api.basic.updateCategory({
          categoryName,
          parentCode,
          safeLevel,
          sortNumber,
          standard,
          categoryId
        }).then(res => {
          this.$msgTip('修改成功')
          this.fetchData()
          this.dialogShop = false
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.category__box{
  height: 750px;
  .category__box__input{
    width: 40%;
  }
  .category__box__tree{
    width: 40%;
    height: 720px;
    overflow : auto;
    padding-top: 10px;
  }
}
.form{
  .form-item{
    width: 90%;
  }
  .select-item{
    width: 45%;
  }
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
