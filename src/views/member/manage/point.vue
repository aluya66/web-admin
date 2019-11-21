<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button :size="size" :loading="exportLoading" type="primary" icon="el-icon-download" @click="exportFile">导出</el-button>
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
      exportLoading: false,
      tableHeader: [
        {
          label: '头像',
          prop: 'avatar',
          isImage: true,
          width: 100
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '昵称',
          prop: 'nickName'
        },
        {
          label: '性别',
          prop: 'genderName'
        },
        {
          label: '手机号',
          prop: 'phoneNumber'
        },
        {
          label: '积分额',
          prop: 'point'
        },
        {
          label: '积分来源',
          prop: 'pointTypeName'
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
    },
    exportFile() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime, 'dateTime')
      this.exportLoading = true
      this.$api.member.exportPoint({
        ...searchDate,
        ...other,
        total: totalNum
      }).then(res => {
        this.exportLoading = false
        if (res) {
          utils.createBlobFile(res)
        } else {
          this.$msgTip('导出数据失败', 'warning')
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
