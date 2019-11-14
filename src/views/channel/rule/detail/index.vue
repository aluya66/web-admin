<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
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
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search">
            <!-- <el-form-item label="店铺名称">
              <el-input
                v-model="searchObj.shopName"
                class="search-item"
                size="medium"
                placeholder="店铺名称"
                clearable
              />
            </el-form-item>-->
            <!-- <el-form-item label="店铺类型">
              <el-select
                v-model="searchObj.shopType"
                size="medium"
                class="search-item"
                clearable
                placeholder="店铺类型"
              >
                <el-option
                  v-for="(item, index) in shopTypeSelect"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>-->
            <!-- <el-form-item label="店铺状态">
              <el-select
                v-model="searchObj.status"
                size="medium"
                class="search-item"
                clearable
                placeholder="店铺状态"
              >
                <el-option
                  v-for="(item, index) in shopStatusSelect"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>-->
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

export default {
  name: 'channelRuleDetail',
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {},
      dialogObj: {}, // 对话框数据
      tableList: [],
      tableInnerBtns: [],
      tableHeader: [
        {
          label: '规则名称',
          prop: 'ruleName'
        },
        {
          label: '规则code',
          prop: 'ruleCode'
        },
        {
          label: '主键ID',
          prop: 'ruleId'
        },
        {
          label: '是否删除',
          prop: 'isDelete',
          formatter(row) {
            return row.isDelete === 1 ? '删除' : '不删除'
          }
        },
        {
          label: '渠道状态',
          prop: 'status',
          formatter(row) {
            return row.status === 1 ? '开启' : '关闭'
          }
        },
        {
          label: '创建人',
          prop: 'createBy'
        },
        {
          label: '更新人',
          prop: 'updateBy'
        },
        {
          label: '创建时间',
          prop: 'created'
        },
        {
          label: '更新时间',
          prop: 'updated'
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
      this.isLoading = true
      this.$api.channel
        .getChannel({
          ...this.searchObj,
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
    }
  }
}
</script>

<style lang='less' scoped>

</style>
