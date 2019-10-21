<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button type="primary" :size="size" icon="el-icon-plus" @click="showDialog">新增</el-button>
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
            <el-form-item label="级别">
              <el-select
                v-model="searchObj.categoryLevel"
                :size="size"
                class="search-item"
                placeholder="请选择平台"
                clearable
              >
                <el-option
                  v-for="item in categorySelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类目名称">
              <el-input
                v-model="searchObj.categoryName"
                class="search-item"
                :size="size"
                placeholder="请输入类目"
                clearable
              />
            </el-form-item>
            <!-- <el-form-item label="显示">
              <el-select
                v-model="searchObj.showFlag"
                :size="size"
                class="search-item"
                placeholder="请选择平台"
                clearable
              >
                <el-option
                  v-for="item in showFlagSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="操作时间">
              <el-date-picker
                :size="size"
                v-model="searchObj.dataTime"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']"
              >align="right"></el-date-picker>
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

     <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <category-add ref="childRef" :isCategory='categoryEdit' :init-data="dialogObj.initData"></category-add>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import CategoryAdd from './categoryAdd'
import utils from 'utils'

export default {
  mixins: [mixinTable],
  components: {
    CDialog,
    CategoryAdd
  },
  data(vm) {
    return {
      categoryEdit: '',
      dialogObj: {}, // 对话框数据
      searchObj: {
        categoryLevel: '',
        categoryName: '',
        showFlag: '',
        dataTime: ''
      },
      pickerOptions: utils.pickerOptions,
      categorySelect: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '一级'
        },
        {
          value: '2',
          label: '二级'
        },
        {
          value: '3',
          label: '三级'
        }
      ],
      showFlagSelect: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '显示'
        },
        {
          value: '2',
          label: '不显示'
        }
      ],
      tableList: [],
      tableHeader: [
        {
          label: '图片',
          prop: 'imageUrl',
          width: 120,
          fixed: true,
          isImage: true
        },
        {
          label: '类别编码',
          prop: 'categoryCode',
          width: 120
        },
        {
          label: '级别',
          prop: 'categoryLevelText'
        },
        {
          label: '类目名称',
          prop: 'categoryName'
        },
        {
          label: '是否展示',
          prop: 'showFlagText'
        },
        {
          label: '类目状态',
          prop: 'deleteFlagText'
        },
        {
          label: '标准',
          prop: 'standard',
          width: 100
        },
        {
          label: '排序值',
          prop: 'sortNumber',
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
      tableInnerBtns: [
        {
          width: 130,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              categoryName,
              imageUrl,
              parentCode,
              safeLevel,
              standard,
              sortNumber,
              categoryId
            } = row
            vm.showDialog({
              title: '编辑类目',
              initData: {
                categoryName,
                imageUrl,
                parentCode,
                safeLevel: safeLevel === 1 ? '一级' : (safeLevel === 2 ? '二级' : '三级'),
                standard,
                sortNumber,
                categoryId: categoryId
              },
              isEdit: true
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { categoryName, categoryId } = row
            vm.confirmTip(`确认删除${categoryName}商品类目信息`, () => {
              vm.deleteData({ categoryId })
            })
          }
        }
      ]
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
      this.$api.basic
        .queryCategory({
          ...searchDate,
          ...other,
          ...page
        })
        .then(res => {
          this.isLoading = false
          if (res.totalCount) {
            const { data, totalCount } = res
            this.pageInfo.totalNum = totalCount
            this.tableList = data
          } else {
            this.tableList = res
          }
        })
    },
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          if (!this.dialogObj.isEdit) {
            this.addHandle(childFormModel)
          } else {
            this.editHandle(childFormModel)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showDialog(opts) {
      this.categoryEdit = opts.isEdit
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增类目',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    addHandle(childFormModel) {
      let data = {
        ...childFormModel
      }
      this.$api.basic.addCategory(data).then(res => {
        this.$msgTip('添加成功')
        this.fetchData()
        this.dialogObj.isShow = false
      })
      this.dialogObj.isShow = true
    },

    editHandle(formModel) {
      let data = {
        ...formModel
      }
      this.$api.basic.updateCategory(data).then(res => {
        this.$msgTip('修改成功')
        this.fetchData()
      })
      this.dialogObj.isShow = false
    },
    deleteData(param, msgTip = '删除成功') {
      // 主要修改接口
      this.$api.basic.deleteCategory(param).then(() => {
        this.$msgTip(msgTip)
        if (this.tableList.length === 1) {
          const { pageNum } = this.pageInfo
          this.pageInfo.pageNum = pageNum > 1 ? pageNum - 1 : 1
        }
        this.fetchData()
      })
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
    .search-item {
      width: 250px;
    }
  }
}
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
