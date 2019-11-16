<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button :size="size" type="primary" icon="el-icon-download">导出</el-button>
      </div>
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
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
            <el-form-item label="手机号">
              <el-input
                v-model="searchObj.phoneNumber"
                class="search-item"
                :size="size"
                placeholder="手机号"
                clearable
              />
            </el-form-item>
            <el-form-item label="积分来源">
              <query-dict
                :dict-list="pointTypeList"
                class="search-item"
                :size="size"
                placeholder="请选择"
                :value.sync="searchObj.pointType"
              ></query-dict>
            </el-form-item>
            <el-form-item label="积分时间">
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
import dictObj from '@/store/dictData'
import utils from 'utils'
export default {
  name: 'memberManagePoint',
  mixins: [mixinTable],
  data() {
    return {
      pickerOptions: utils.pickerOptions,
      pointTypeList: dictObj.pointTypeList, // 积分来源下拉框选项
      searchObj: {},
      tableHeader: [
        {
          label: '用户',
          prop: 'nickName',
          width: 100
        },
        {
          label: '头像',
          prop: 'avatar',
          isImage: true,
          width: 100
        },
        {
          label: '性别',
          prop: 'genderName',
          width: 100
        },
        {
          label: '手机号',
          prop: 'phoneNumber',
          width: 110
        },
        {
          label: '积分额',
          prop: 'point',
          width: 110
        },
        {
          label: '积分来源',
          prop: 'pointTypeName',
          width: 130
        },
        {
          label: '积分时间',
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
      this.$api.member.getPoint({
        ...searchDate,
        ...other,
        ...page
      }).then(res => {
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
  },

  components: {
  }
}
</script>

<style lang='less' scoped>
</style>
