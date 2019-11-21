<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
    </template>
    <div class="main__box">
      <c-table
        selection
        hasBorder
        :max-height="685"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
            <el-form-item label="用户id">
              <el-input
                v-model="searchObj.userId"
                class="search-item"
                :size="size"
                placeholder="用户id"
                clearable
              />
            </el-form-item>
            <el-form-item label="来源">
              <query-dict
                :dict-list="lobList"
                class="search-item"
                :size="size"
                placeholder="请选择"
                :value.sync="searchObj.appCode"
              ></query-dict>
            </el-form-item>
            <el-form-item label="登录时间">
              <el-date-picker
                :size="size"
                v-model="searchObj.dataTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始时间"
                format="yyyy-MM-dd HH:mm:ss"
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
import dictObj from '@/store/dictData'

export default {
  name: 'memberUserList',
  mixins: [mixinTable],
  data(vm) {
    return {
      lobList: dictObj.lobList, // 业务线集合
      pickerOptions: utils.pickerOptions,
      searchObj: {
        userId: '', // 用户id
        appCode: '', // 来源
        dataTime: ''
      },
      tableInnerBtns: [],
      tableHeader: [
        {
          label: '用户id',
          prop: 'userId'
        },
        {
          label: '登录地点',
          prop: 'ip'
        },
        {
          label: '业务线',
          prop: 'channel'
        },
        {
          label: '业务编码',
          prop: 'appCode'
        },
        {
          label: '登录时间',
          prop: 'created'
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
      const searchDate = this.getSearchDate(dataTime, 'dateTime')
      this.isLoading = true
      this.$api.member
        .getMemberLoginlog({
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
    }
  }
}
</script>

<style lang='less' scoped>
</style>
