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
            <el-form-item label="品牌国家">
              <el-input
                v-model="searchObj.country"
                class="search-item"
                :size="size"
                placeholder="请输入品牌国家"
                clearable
              />
            </el-form-item>
            <el-form-item label="品牌名称">
              <el-input
                v-model="searchObj.name"
                class="search-item"
                :size="size"
                placeholder="请输入品牌名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="品牌别名">
              <el-input
                v-model="searchObj.ename"
                class="search-item"
                :size="size"
                placeholder="请输入品牌别名"
                clearable
              />
            </el-form-item>
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
        <brand-add ref="childRef" :init-data="dialogObj.initData"></brand-add>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import BrandAdd from './brandAdd'
import utils from 'utils'

export default {
  mixins: [mixinTable],
  components: {
    CDialog,
    BrandAdd
  },
  data(vm) {
    return {
      dialogObj: {}, // 对话框数据
      searchObj: {
        country: '',
        name: '',
        ename: '',
        dataTime: ''
      },
      pickerOptions: utils.pickerOptions,
      tableList: [],
      tableInnerBtns: [
        {
          width: 130,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              country,
              name,
              ename,
              consumer,
              logo,
              intro,
              description,
              previewUrl,
              videoUrl,
              createdby,
              updatedby,
              status,
              sort,
              id
            } = row
            vm.showDialog({
              title: '编辑品牌',
              initData: {
                country,
                name,
                ename,
                consumer,
                logo,
                intro,
                description,
                previewUrl,
                videoUrl,
                createdby,
                updatedby,
                status: status === 1 ? '启用' : '禁用',
                sort,
                id: id
              },
              isEdit: true
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { country, id } = row
            vm.confirmTip(`确认删除${country}品牌信息`, () => {
              vm.deleteData({ id })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '品牌LOGO',
          prop: 'logo',
          fixed: true
        },
        {
          label: '品牌名称',
          prop: 'name'
        },
        {
          label: '品牌别名',
          prop: 'ename'
        },
        {
          label: '品牌描述',
          prop: 'description'
        },
        {
          label: '品牌介绍',
          prop: 'intro'
        },
        {
          label: '品牌国家',
          prop: 'country',
          width: 120
        },
        {
          label: '封面图',
          prop: 'previewUrl',
          width: 100,
          isImage: true
        },
        {
          label: '封面视频',
          prop: 'videoUrl',
          width: 100
        },
        {
          label: '状态',
          prop: 'statusCN',
          width: 100
        },
        {
          label: '消费人群',
          prop: 'consumer',
          width: 100
        },
        {
          label: '品牌排序',
          prop: 'sort',
          width: 100
        },
        {
          label: '创建人',
          prop: 'createdby',
          width: 100
        },
        {
          label: '更新人',
          prop: 'updatedby',
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
        .brandList({
          ...searchDate,
          ...other,
          ...page
        })
        .then(res => {
          this.isLoading = false
          if (res && res.totalCount) {
            const { data, totalCount } = res
            this.pageInfo.totalNum = totalCount
            this.tableList = data || []
          } else {
            this.tableList = res || []
          }
        })
    },
    deleteData(param, msgTip = '删除成功') {
      // 主要修改接口
      this.$api.basic.deleteBrand(param).then(() => {
        this.$msgTip(msgTip)
        if (this.tableList.length === 1) {
          const { pageNum } = this.pageInfo
          this.pageInfo.pageNum = pageNum > 1 ? pageNum - 1 : 1
        }
        this.fetchData()
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
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增品牌',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    addHandle(childFormModel) {
      this.$api.basic.addBrand(childFormModel).then(res => {
        this.$msgTip('添加成功')
        this.fetchData()
      })
      this.dialogObj.isShow = false
    },

    editHandle(formModel) {
      let status
      if (formModel.status === '启用') {
        status = 1
      } else {
        status = 2
      }
      let data = {
        ...formModel,
        status
      }
      this.$api.basic.updateBrand(data).then(res => {
        this.$msgTip('修改成功')
        this.fetchData()
      })
      this.dialogObj.isShow = false
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
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
