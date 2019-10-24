<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
          {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
      </div>
    </template>

    <div class="main__box">
      <c-table
        selection
        hasBorder
        :size="size"
        :max-height="730"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
            <el-form-item label="版本名称">
              <el-input
                v-model="searchObj.versionName"
                class="search-item"
                :size="size"
                placeholder="请输入版本名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="平台">
              <el-select
                v-model="searchObj.platform"
                :size="size"
                class="search-item"
                placeholder="请选择平台"
                clearable
              >
                <el-option
                  v-for="item in versionSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                v-model="searchObj.isForce"
                :size="size"
                class="search-item"
                placeholder="请选择平台"
                clearable
              >
                <el-option
                  v-for="item in updateSelect"
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
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
// import utils from 'utils'

export default {
  name: 'version',
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {
        versionName: '',
        platform: '',
        isForce: '' // 是否强制更新
      },
      versionSelect: [
        {
          value: 0,
          label: '安卓'
        },
        {
          value: 1,
          label: 'IOS'
        }
      ],
      updateSelect: [{
        value: 1,
        label: '否'
      }, {
        value: 0,
        label: '是'
      }],
      tableList: [],
      tableInnerBtns: [],
      tableHeader: [
        {
          label: 'app版本',
          prop: 'versionName',
          width: 150,
          fixed: true
        },
        {
          label: '平台',
          prop: 'platform',
          width: 150,
          formatter(row) {
            return row.platform === 0 ? '安卓' : 'IOS'
          }
        },
        {
          label: 'url',
          prop: 'url',
          vHtml(row) {
            return `
              <el-popover
                placement="top-start"
                title="${row.url}"
                width="200"
                trigger="hover"
                content="${row.url}">
                  <div>${row.url}</div>
              </el-popover>
            `
          }
        },
        {
          label: '是否强制更新',
          prop: 'force',
          width: 150,
          formatter(row) {
            return row.force === 0 ? '是' : '否'
          }
        },
        {
          label: '描述',
          prop: 'description',
          vHtml(row) {
            return `
              <el-popover
                placement="top-start"
                title="${row.description}"
                width="200"
                trigger="hover"
                content="${row.description}">
                  <div>${row.description}</div>
              </el-popover>
            `
          }
        },
        {
          label: '状态',
          prop: 'status',
          width: 150,
          formatter(row) {
            return row.publish === 0 && row.enablePublish === true ? '未发布' : (row.publish === 0 ? '低版本' : '已发布')
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
      this.$api.basic.queryAllVersion(
        {
          ...searchDate,
          ...other,
          ...page
        }
      ).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data || []
        } else {
          this.tableList = res || []
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.title{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
