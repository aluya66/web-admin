<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button
          type="primary"
          v-permission="$route.meta.roles"
          :size="size"
          icon="el-icon-plus"
          @click="routerLink('/basic/brandInfo')"
        >新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        selection
        hasBorder
        :size="size"
        :loading="isLoading"
        :max-height="730"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
            <!-- <el-form-item label="品牌国家">
              <el-input
                v-model="searchObj.country"
                class="search-item"
                :size="size"
                placeholder="请输入品牌国家"
                clearable
              />
            </el-form-item>-->
            <el-form-item label="品牌名称">
              <el-input
                v-model="searchObj.name"
                class="search-item"
                :size="size"
                placeholder="请输入品牌名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="品牌状态">
              <el-select
                v-model="searchObj.status"
                :size="size"
                class="search-item"
                placeholder="请选择状态"
                clearable
              >
                <el-option
                  v-for="item in statusSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
            <el-form-item label="创建时间">
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
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  name: 'brand',
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {
        country: '',
        name: '',
        ename: '',
        dataTime: '',
        status: ''
      },
      statusSelect: [{
        value: 1,
        label: '启用'
      }, {
        value: 2,
        label: '禁用'
      }],
      pickerOptions: utils.pickerOptions,
      tableInnerBtns: [
        {
          width: 150,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            vm.routerLink(`/basic/brandInfo/${row.id}`)
          }
        },
        {
          name: '添加标签',
          icon: 'el-icon-plus',
          handle(row) {
            vm.routerLink(`/basic/brandLabel/${row.id}`)
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { name, id } = row
            vm.confirmTip(`确认删除${name}品牌信息`, () => {
              vm.deleteData({ id })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '品牌LOGO',
          prop: 'logo',
          isImage: true,
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
          label: '品牌状态',
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
        // {
        //   label: '创建人',
        //   prop: 'createdby',
        //   width: 100
        // },
        // {
        //   label: '更新人',
        //   prop: 'updatedby',
        //   width: 100
        // },
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
        this.delResetData()
      })
    }
  }
}
</script>
