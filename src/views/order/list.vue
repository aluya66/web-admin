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
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search">
            <el-form-item label="申请人">
              <el-input
                v-model="searchObj.applicants"
                class="search-item"
                :size="size"
                placeholder="请输入申请人"
                clearable
              />
            </el-form-item>
            <el-form-item label="申请部门">
              <el-input
                v-model="searchObj.applyingDepartment"
                class="search-item"
                :size="size"
                placeholder="请输入申请部门"
                clearable
              />
            </el-form-item>
            <el-form-item label="劵金额">
              <el-input
                v-model="searchObj.couponAmount"
                class="search-item"
                :size="size"
                placeholder="请输入劵金额"
                clearable
              />
            </el-form-item>
            <el-form-item label="门槛金额">
              <el-input
                v-model="searchObj.preferentialAmount"
                class="search-item"
                :size="size"
                placeholder="请输入门槛金额"
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

            <!-- <el-form-item label="状态">
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
            </el-form-item> -->
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
  name: 'shopList',
  mixins: [mixinTable],
  data (vm) {
    return {
      searchObj: {
        applicants: '', // 申请人
        applyingDepartment: '', // 申请部门
        couponAmount: '', // 劵金额
        preferentialAmount: '', // 门槛金额
        dataTime: '' // 时间
      },
      dialogObj: {}, // 对话框数据
      shopStatusSelect: [
        {
          value: '',
          label: ''
        },
        {
          value: '',
          label: ''
        }
      ],

      tableList: [],
      isLoading: false,
      tableInnerBtns: [],
      tableHeader: [
        {
          label: '卡劵类型id',
          prop: 'couponRuleId'
        },
        {
          label: '卡劵id',
          prop: 'couponId'
        },
        {
          label: '卡劵类型',
          prop: 'couponRuleType'
        },
        {
          label: '劵库存id',
          prop: 'couponStoreId'
        },
        {
          label: '用户券号',
          prop: 'couponStoreNo'
        },
        {
          label: '激活时间',
          prop: 'activateTime'
        },
        {
          label: '优惠金额',
          prop: 'activityAmount'
        },
        {
          label: '还可以使用金额',
          prop: 'canUseAmount'
        },
        {
          label: '可用状态',
          prop: 'canUsestatus',
          formModel(row) {
            return row.canUsestatus === 0 ? '不可使用' : '可使用'
          }
        },
        {
          label: ' 劵金额',
          prop: 'couponAmount'
        },
        // {
        //   label: '',
        //   prop: 'rechargeAmount'
        // },
        // {
        //   label: '',
        //   prop: 'rechargeCanUseAmount'
        // },
        // {
        //   label: '',
        //   prop: 'rechargeUseAmount'
        // },
        {
          label: '状态',
          prop: 'status'
        },
        {
          label: '使用金额',
          prop: 'useAmount'
        },
        {
          label: '使用截至时间',
          prop: 'useTimeEnd'
        },
        {
          label: '使用开始时间',
          prop: 'useTimeStart'
        },
        {
          label: '用户id',
          prop: 'userId'
        }
      ]
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.order.getOrder({
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
</style>
