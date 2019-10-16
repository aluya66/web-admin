<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        <el-tabs v-model="activeName" type="card" @tab-click="changeTitle">
          <el-tab-pane label="商品标签" name="1"></el-tab-pane>
          <el-tab-pane label="用户标签" name="2"></el-tab-pane>
        </el-tabs>
        <el-button type="primary" style="height: 40px" :size="size" icon="el-icon-plus" @click="addModel">新增</el-button>
			</div>
    </template>
    <div class="main__box">
      <c-table
        hasBorder
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search">
            <el-form-item label="标签名称">
              <el-input
                v-model="searchObj.labelName"
                class="search-item"
                :size="size"
                placeholder="请输入名称"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="search-btn"
                :size="size"
                icon="el-icon-search"
                @click="searchSubmit"
              >查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </c-table>
    </div>

    <el-dialog
      :title="modalTitle"
      :visible.sync="contentModal"
      width="30%"
      >
      <el-form ref="form" :model="formLeft" label-width="80px" class="modelStyle">
        <el-form-item label="标签名称:">
          <el-input 
            v-model="formLeft.labelName"
            :size="size"
            placeholder='请输入标签名称'
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="标签拼音:">
          <el-input 
            v-model="formLeft.initial"
            :size="size"
            placeholder='请输入标签拼音'
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="标签状态:">
          <el-select
            v-model="formLeft.labelStatus"
            :size="size"
            class="search-item"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              v-for="item in marketableSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人:">
          <el-input
          v-model="formLeft.createdby"
          :size="size"
          placeholder='请输入创建人'
          clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="更新人:">
          <el-input
          v-model="formLeft.updatedby"
          :size="size"
          placeholder='请输入更新人'
          clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="标签分类:">
          <el-checkbox-group v-model="formLeft.labelParentIds">
            <el-checkbox
            :label="item.id" 
            v-for="(item, index) in addSoreList" 
            :key="index"
            name="type"
            >{{ item.categoryName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="描述:" v-if="statusType==1">
          <el-input
          type="textarea" 
          v-model="formLeft.labelDesc"
          :size="size"
          placeholder='请填写描述'
          clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="contentModal = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addModalBtn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <Modal
      v-model="contentModal"
      :title="modalTitle"
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
            <Checkbox  :label="item.id" :true-value='item.id'  v-for="(item, index) in addSoreList" :key="index">
              {{item.categoryName}}
            </Checkbox>
          </CheckboxGroup >
        </FormItem>
        <FormItem label="标签描述:" >
          <Input v-model="formDynamic.labelDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入标签描述" />
        </FormItem>
        <FormItem>
          <Button type="primary" class="addBtn" @click="addModalBtn">保存</Button>
          <Button class="cancelBtn" @click="()=>contentModal=false">取消</Button>
        </FormItem>
      </Form>
    </Modal> -->
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {
        labelName: ''
      },
      marketableSelect: [
        {
          value: '1',
          label: '有效'
        },
        {
          value: '2',
          label: '无效'
        }
      ],
      pickerOptions: utils.pickerOptions,
      tableList: [],
      tableInnerBtns: [
        {
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            // this.contentModal = true
            // statusType = 2
            console.log(row)
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            // const { id } = row
            vm.$confirm(`是否确定删除?`, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            })
              .then(() => {
                vm.$api.basic.deleteQuerypage({
                  id: row.id
                }).then(() => {
                  vm.$msgTip('删除成功')
                  if (vm.tableList.length === 1) {
                    vm.pageInfo.currentPage = vm.pageInfo.currentPage > 1 ? vm.pageInfo.currentPage - 1 : 1
                  }
                  vm.fetchData()
                })
              })
              .catch(() => {
                console.log('取消')
              })
            console.log(row)
          }
        }
      ],
      tableHeader: [
        {
          label: '标签名称',
          prop: 'labelName',
          width: 120,
          fixed: true
        },
        {
          label: '拼音大写',
          prop: 'initial',
          width: 200
        },
        {
          label: '标签编码',
          prop: 'labelCode'
        },
        {
          label: '标签类型',
          prop: 'labelTypeCN'
        },
        {
          label: '标签描述',
          prop: 'labelDesc'
        },
        {
          label: '标签状态',
          prop: 'labelStatusCN'
        },
        {
          label: '创建人',
          prop: 'createdby',
          width: 100
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100
        },
        {
          label: '更新时间',
          prop: 'updated',
          width: 100
        }
      ],

      activeName: '1',
      name: 1,
      addSoreList: [],
      labelType: 1,
      categoryType: 1,
      contentModal: false,
      modalTitle: '',
      formLeft: {
        initial: '',
        labelDesc: '', // 标签描述
        labelName: '', // 标签名称
        labelStatus: '', // 标签状态 1 有效 2 无效
        labelType: '', // 标签类型 1 商品 2 用户
        createdby: '', // 创建人
        updatedby: '', // 更新人
        labelParentIds: [] // 分类id
      },
      statusType: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
      this.isLoading = true
      this.$api.basic.getQuerypage(
        {
          ...searchDate,
          ...other,
          ...page,
          labelType: this.labelType,
          categoryType: this.categoryType
        }
      ).then(res => {
        this.isLoading = false
        if (res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data
        } else {
          this.tableList = res
        }
      })
      this.$api.basic.addSoreQuerypage(
        {
          categoryType: this.categoryType
        }
      ).then(res => {
        this.addSoreList = res.data
      })
    },
    changeTitle(tab, event) {
      if (tab.name === '1') {
        this.labelType = 1
        this.categoryType = 1
      } else if (tab.name === '2') {
        this.labelType = 2
        this.categoryType = 2
      }
      this.searchDate = ''
      this.fetchData()
    },
    addModel() {
      this.contentModal = true
      if (this.labelType === 1) {
        this.modalTitle = '新增商品标签'
      } else {
        this.modalTitle = '新增用户标签'
      }
      this.statusType = 1
      this.formLeft = {}
    },
    addModalBtn() {
      let that = this
      if (!this.formLeft.labelName) {
        this.$Message.info('请填写标签名称')
        return
      }
      if (!this.formLeft.initial) {
        this.$Message.info('请填写标签拼音')
        return
      }
      if (!this.formLeft.labelStatus) {
        this.$Message.info('请选择标签状态')
        return
      }
      if (!this.formLeft.labelParentIds) {
        this.$Message.info('请选择标签分类')
        return
      }
      if (!this.formLeft.labelDesc) {
        this.$Message.info('请填写标签描述')
        return
      }
      if (this.statusType === 1) {
        if (!this.formLeft.createdby) {
          this.$Message.info('请填写创建人')
          return
        }
        let data = {
          ...this.formLeft,
          // labelStatus: this.labelStatus,
          labelType: this.labelType,
          labelParentIds: this.formLeft.labelParentIds
        }
        this.$api.basic.addQuerypage(data).then(res => {
          that.contentModal = false
          that.$Message.info('新增成功')
          that.fetchData()
        })
      } else if (this.statusType === 2) {
        if (!this.formLeft.updatedby) {
          this.$Message.info('请填写更新人')
          return
        }
        let data = {
          id: this.formLeft.id,
          ...this.formLeft,
          labelStatus: this.labelStatus,
          labelType: this.labelType,
          labelParentIds: this.formLeft.labelParentIds
        }
        this.$api.basic.updateQuerypage(data).then(res => {
          that.contentModal = false
          that.$Message.info('修改成功')
          that.getQuerypageList()
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main__box {
  .search {
    margin-bottom: 10px;
    width: 100%;
    .search-item {
      width: 250px;
    }
  }
}
.title{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
