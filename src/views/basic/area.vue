<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <!-- <el-button type="primary" :size="size" icon="el-icon-plus" @click="append(3)">新增</el-button> -->
      </div>
    </template>
    <Card>

    <el-aside width="600px">
      <el-tree
        v-if="data.length"
        :props="props"
        :load="loadNode"
        lazy
        :expand-on-click-node="false"
        >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <!-- v-if="data.exitChildren==true" -->
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            新增
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            编辑
          </el-button>
          </span>
        </span>
      </el-tree>
    </el-aside>
    </Card>

    <Modal
        v-model="showModal"
        :title="modelTitle"
        width="400"
        footer-hide
        >
        <Form :model='formModel' label-position="right" :label-width="75" class="formStyle">
          <FormItem label="地区名称：">
            <Input  placeholder='请填写地区名称' v-model="formModel.name"/>
          </FormItem>
          <FormItem label="code:" >
            <Input  placeholder='请填写code' v-model="formModel.code"/>
          </FormItem>
          <FormItem>
            <Button type="primary" class="addBtn" @click="addModal">确认</Button>
            <Button class="cancelBtn" @click="showModal = false">取消</Button>
          </FormItem>
        </Form>
      </Modal>
  </c-view>
</template>
<script>

export default {
  data() {
    return {
      props: {
        label: 'name',
        children: []
      },

      formModel: {
        name: '',
        code: ''
      },

      showModal: false,
      modelTitle: '',
      parentCode: 0,
      data: [],
      dataChild: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$api.basic.queryAllRegion({
        parentCode: this.parentCode
      })
        .then(res => {
          this.data = res.data
        })
    },

    loadNode(node, resolve) {
      if (node.level === 0) {
        this.parentCode = node.data && node.data.code
        return resolve(this.data)
      }
      if (node.level > 0) {
        this.parentCode = node.data && node.data.code
        this.$api.basic.queryAllRegion({
          parentCode: this.parentCode
        })
          .then(res => {
            console.log(node)
            console.log(node.data)
            console.log(this.parentCode)
            this.dataChild = res.data || ''
            console.log(this.dataChild)
          })
        return resolve(this.dataChild)
      }
    },
    addModal() {
      console.log('确认')
    },
    remove(node, data) {
      this.showModal = true
      this.modelTitle = '编辑'
      console.log('编辑')
    },
    append(type, data) {
      this.showModal = true
      this.modelTitle = '新增'
      console.log('新增')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.addBtn {
  margin-left: 50px;
}
.cancelBtn {
  margin-left: 8px;
}
.formStyle {
  margin-right: 16px;
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
