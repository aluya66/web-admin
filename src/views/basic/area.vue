<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <!-- <el-button type="primary" :size="size" icon="el-icon-plus" @click="append(3)">新增</el-button> -->
      </div>
    </template>
    <div class="main__box">
      <div class="area__box__centen">
        <el-aside class="area__box__tree" width="400px">
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
                <el-button
                  type="text"
                  v-if="!node.data.leaf"
                  size="mini"
                  @click="() => append(data)"
                >新增</el-button>
                <el-button type="text" size="mini" @click="() => editHandle(node, data)">编辑</el-button>
              </span>
            </span>
          </el-tree>
        </el-aside>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="showModal">
      <el-form :model="formModel" :rules="rules" ref="formModel">
        <el-form-item label="地区名称" label-width="120px" prop="name">
          <el-input v-model.trim="formModel.name" class="form-item"></el-input>
        </el-form-item>
        <el-form-item label="地区编码" prop="code" label-width="120px" v-if="isEdit === true">
          <el-input v-model.trim="formModel.code" class="form-item"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">取 消</el-button>
        <el-button type="primary" @click="addModal('formModel')">确 定</el-button>
      </div>
    </el-dialog>
  </c-view>
</template>
<script>
export default {
  name: 'areaInfo',
  data() {
    let areaCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('地区编码不能为空'))
      } else if (/^[A-Za-z0-9-_]+$/.test(value)) {
        callback()
      } else {
        // eslint-disable-next-line standard/no-callback-literal
        callback('请输入字母、数字或下划线')
      }
    }
    return {
      rules: {
        name: [{ required: true, message: '请输入地区名称', trigger: 'blur' }],
        code: [{ required: true, validator: areaCode, trigger: 'blur' }]
      },
      isEdit: false,
      props: {
        label: 'name',
        children: '',
        isLeaf: 'leaf'
      },
      formModel: {
        name: '',
        code: ''
      },
      showModal: false,
      dialogTitle: '',
      parentCode: 0,
      data: [],
      ruleForm: {
        name: '',
        code: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(callback) {
      this.$api.basic.queryAllRegion({
        parentCode: this.parentCode
      }).then(res => {
        const { data } = res
        let curData = []
        if (data && data.length) {
          curData = data.map(res => ({
            leaf: !res.hasChildBoolean,
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
      if (node.level > 0 && !node.data.leaf) {
        this.parentCode = node.data && node.data.code
        this.fetchData(res => {
          resolve(res)
        })
      }
    },

    addModal(formModel) {
      this.$refs[formModel].validate((valid) => {
        if (valid) {
          if (this.isEdit === true) {
            // 新增
            const { name, code, parentCode } = this.formModel
            this.$api.basic.addRegionInsert({
              name,
              code,
              parentCode
            }).then(res => {
              this.$msgTip('添加成功')
              this.fetchData()
              this.showModal = false
            })
          } else {
            //  编辑
            const { name, code, id } = this.formModel
            this.$api.basic.updataRegionInsert({
              name,
              code,
              id
            }).then(res => {
              this.$msgTip('修改成功')
              this.fetchData()
              this.showModal = false
            })
          }
        } else {
          return false
        }
      })
    },
    editHandle(node, data) {
      this.isEdit = false
      this.showModal = true
      this.dialogTitle = '编辑'
      this.formModel = {
        ...this.formModel,
        name: data.name,
        code: data.code,
        parentCode: data.parentCode
      }
    },
    append(node) {
      this.isEdit = true
      this.showModal = true
      this.dialogTitle = '新增'
      this.formModel = {}
      this.formModel.parentCode = node.code
    }
  }
}
</script>

<style lang="less" scoped>
.main__box {
  .area__box__centen {
    padding: 10px 0;
    .area__box__tree {
      height: 740px;
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
    }
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
</style>
