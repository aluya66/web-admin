<template>
  <c-view>
    <template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
       <div class="header-btn">
         <div class="header-btn">
          <el-button
            :size="size"
            type="primary"
            icon="el-icon-plus"
            @click="routerLink('/channel/rule/ruleInfo')"
          >新增</el-button>
        </div>
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
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search">

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
  name: 'channelRule',
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {

      },
      dialogObj: {}, // 对话框数据
      tableList: [],
      tableInnerBtns: [
        {
          width: 150,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            vm.routerLink(`/channel/rule/ruleInfo/${row.id}`)
          }
        }
      ],
      tableHeader: [{
        label: '',
        prop: ''
      }, {
        label: '',
        prop: ''
      }, {
        label: '',
        prop: ''
      }, {
        label: ' ',
        prop: ''
      }, {
        label: '',
        prop: ''
      },
      {
        label: '',
        prop: ''
      }, {
        label: ' ',
        prop: ''
      }, {
        label: '',
        prop: ''
      }, {
        label: '',
        prop: ''
      }, {
        label: '',
        prop: ''
      }, {
        label: '',
        prop: ''
      }, {
        label: '',
        prop: ''
      }, {
        label: '',
        prop: ''
      }, {
        label: '',
        prop: ''
      }, {
        label: '',
        prop: ''
      }, {
        label: '',
        prop: ''
      }]
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    fetchData () {}
  }
}
</script>

<style lang='less' scoped>
.main__box {
  .search {
    margin-bottom: 10px;
    width: 100%;
    .search-item {
      width: 250px;
    }
  }
}
</style>
