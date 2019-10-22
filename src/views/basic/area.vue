<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <!-- <el-button type="primary" :size="size" icon="el-icon-plus" @click="append(3)">新增</el-button> -->
      </div>
    </template>
    <el-aside width="600px">
      <el-tree
        v-if="data && data.length"
        :props="props"
        :load="loadNode"
        lazy
        :expand-on-click-node="false"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(data)">新增</el-button>
            <el-button type="text" size="mini" @click="() => editHandle(node, data)">编辑</el-button>
          </span>
        </span>
      </el-tree>
    </el-aside>
    <el-dialog :title="modelTitle" :visible.sync="showModal">
      <el-form :model="formModel" :rules="rules">
        <el-form-item label="地区名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model.trim="formModel.name" class="form-item"></el-input>
        </el-form-item>
        <el-form-item label="地区编码" prop="code" :label-width="formLabelWidth" v-if="isEdit ===1">
          <el-input v-model.trim="formModel.code" class="form-item"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">取 消</el-button>
        <el-button type="primary" @click="addModal">确 定</el-button>
      </div>
    </el-dialog>
  </c-view>
</template>
<script>
export default {
  data() {
    return {
      formLabelWidth: '120px',
      rules: {
        name: [{ required: true, message: '请填写地区名称', trigger: 'blur' }],
        code: [{ required: true, message: '请填写地区编码', trigger: 'blur' }]
      },
      isEdit: '',
      props: {
        label: 'name',
        children: '',
        isLeaf: false
      },
      formModel: {
        name: '',
        code: ''
      },
      showModal: false,
      modelTitle: '',
      parentCode: 0,
      data: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(callback) {
      this.$api.basic
        .queryAllRegion({
          parentCode: this.parentCode
        })
        .then(res => {
          const { data } = res
          let curData = []
          if (data && data.length) {
            curData = data.map(res => ({
              leaf: !res.exitChildren,
              name: res.name,
              code: res.code,
              parentCode: res.parentCode
            }))
          }
          if (this.parentCode === 0) {
            this.data = curData
          }
          callback && callback(curData)
        })
    },

    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.data)
      }
      if (node.level > 0 && !node.data.exitChildren) {
        this.parentCode = node.data && node.data.code
        this.fetchData((res) => {
          resolve(res)
        })
      }
    },

    addModal() {
      if (this.isEdit === 1) {
        // 新增
        const { name, code, parentCode } = this.formModel
        this.$api.basic.addRegionInsert({
          name, code, parentCode
        }).then(res => {
          this.$msgTip('添加成功')
          this.fetchData()
          this.showModal = false
        })
      } else {
        //  编辑
        const { name, code, id } = this.formModel
        this.$api.basic.updataRegionInsert({
          name, code, id
        }).then(res => {
          this.$msgTip('修改成功')
          this.fetchData()
          this.showModal = false
        })
      }
    },
    editHandle(node, data) {
      console.log(node)
      console.log(data)
      this.isEdit = 2
      this.showModal = true
      this.modelTitle = '编辑'
      this.formModel = {
        ...this.formModel,
        name: data.name,
        code: data.code,
        parentCode: data.parentCode
      }
      console.log('编辑')
    },
    append(node) {
      this.isEdit = 1
      this.showModal = true
      this.modelTitle = '新增'
      this.formModel.name = ''
      this.formModel.code = ''
      this.formModel.parentCode = node.code
      console.log('新增')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.main__box {
  .search {
    margin-bottom: 10px;
    width: 100%;
  }
}
.form-item {
  width: 90%;
}
.title {
  display: flex;
  justify-content: space-between;
  width: 100%;
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
