<template>
  <c-view>
    <template v-slot:header>
     <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button type="primary" :size="size" icon="el-icon-plus" @click="addInsert">新增</el-button>
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
            <el-form-item label="app名称">
              <el-input
                v-model="searchObj.appName"
                class="search-item"
                :size="size"
                placeholder="请输入app名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="app编码">
              <el-input
                v-model="searchObj.appCode"
                class="search-item"
                :size="size"
                placeholder="请输入app编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="appKey">
              <el-input
                v-model="searchObj.appKey"
                class="search-item"
                :size="size"
                placeholder="请输入appKey"
                clearable
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                v-model="searchObj.status"
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
        <el-form-item label="app名称:">
          <el-input
            v-model="formLeft.appName"
            :size="size"
            placeholder='请填写app名称'
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="app编码:" v-if="statusType==1">
          <el-input
            v-model="formLeft.appCode"
            :size="size"
            placeholder='请填写app编码'
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="状态:" v-if="statusType==1">
          <el-select
            v-model="formLeft.status"
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
        <el-form-item label="描述:" v-if="statusType==1">
          <el-input
          type="textarea"
          v-model="formLeft.description"
          :size="size"
          placeholder='请填写描述'
          clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="contentModal = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addReleaseBtn">确 定</el-button>
      </span>
    </el-dialog>
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
        appName: '',
        appCode: '',
        appKey: '',
        status: ''
      },
      marketableSelect: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '启用'
        },
        {
          value: '2',
          label: '禁用'
        }
      ],
      pickerOptions: utils.pickerOptions,
      tableList: [],
      tableInnerBtns: [{
        width: 130,
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          console.log(row)
        }
      }],
      tableHeader: [
        {
          label: 'app名称',
          prop: 'appName',
          width: 120,
          fixed: true
        },
        {
          label: 'app编码',
          prop: 'appCode'
        },
        {
          label: 'appKey',
          prop: 'appKey'
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row.status ? vm.marketableSelect[row.status].label : ''
          }
        },
        {
          label: '描述',
          prop: 'description'
        },
        {
          label: '创建时间',
          prop: 'created'
        }
      ],

      statusType: '',
      contentModal: false,
      modalTitle: '',
      formLeft: {
        appName: '',
        appCode: '',
        description: '',
        status: '',
        id: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     * 获取表格数据
    */
    fetchData() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
      this.isLoading = true
      this.$api.basic.businessList(
        {
          ...searchDate,
          ...other,
          ...page,
          pageSize: 10
        }
      ).then(res => {
        console.log(res)
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
    addInsert() {
      this.modalTitle = '新增'
      this.contentModal = true
      this.statusType = 1
      this.formLeft = {}
    },
    addReleaseBtn() {
      let that = this
      if (!this.formLeft.appName) {
        this.$Message.info('请填写app名称')
        return
      }
      if (!this.formLeft.appCode) {
        this.$Message.info('请填写app编码')
        return
      }
      if (!this.formLeft.status) {
        this.$Message.info('请选择状态')
        return
      }
      if (!this.formLeft.description) {
        this.$Message.info('请填写描述')
        return
      }
      // if (this.formLeft.status === '启用') {
      //   this.status = 1
      // } else if (this.formLeft.status === '禁用') {
      //   this.status = 2
      // }
      this.loading = !this.loading
      if (this.statusType === 1) {
        let data = {
          ...this.formLeft
        }
        this.$api.basic.addBusiness(data).then(res => {
          that.loading = !that.loading
          that.$Message.info('添加成功')
          that.contentModal = false
          that.fetchData()
        })
      } else if (this.typeStatus === 2) {
        let data = {
          status: Number(this.status),
          ...this.formLeft
        }
        this.$api.basic.updateBusiness(data).then(res => {
          that.loading = !that.loading
          that.$Message.info('修改成功')
          that.contentModal = false
          that.queryBussinessList()
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
