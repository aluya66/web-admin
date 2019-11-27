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
        ref="cTable"
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
          <c-search
            :form-model="searchObj"
            :form-items="searchItems"
            @submit-form="searchSubmit"
            @reset-form="searchReset"
          ></c-search>
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
          prop: 'phoneNumber',
          search: {
            type: 'input'
          }
        },
        {
          label: '积分额',
          prop: 'point'
        },
        {
          label: '积分来源',
          prop: 'pointTypeName',
          search: {
            type: 'dict',
            prop: 'pointType',
            optionsList: dictObj.pointTypeList
          }
        },
        {
          label: '积分时间',
          prop: 'created',
          search: {
            type: 'dateTime',
            prop: 'dateTime'
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
  }
}
</script>
