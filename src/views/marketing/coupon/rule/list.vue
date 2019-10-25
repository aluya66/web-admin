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
            <el-form-item label="劵类型">
              <el-input
                v-model="searchObj.couponRuleType"
                class="search-item"
                :size="size"
                placeholder="劵类型"
                clearable
              />
            </el-form-item>
            <el-form-item label="劵状态">
              <el-input
                v-model="searchObj.couponStatus"
                class="search-item"
                :size="size"
                placeholder="劵状态"
                clearable
              />
            </el-form-item>
            <el-form-item label="劵规则状态">
              <el-input
                v-model="searchObj.couponRuleStatus"
                class="search-item"
                :size="size"
                placeholder="劵规则状态"
                clearable
              />
            </el-form-item>
            <el-form-item label="劵类型名称">
              <el-input
                v-model="searchObj.key"
                class="search-item"
                :size="size"
                placeholder="劵规则状态"
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
  name: 'couponRuleList',
  mixins: [mixinTable],
  data (vm) {
    return {
      searchObj: {
        couponRuleType: '', // 劵类型
        couponStatus: '', // 劵状态
        couponRuleStatus: '', // 劵规则状态
        key: '', // 关键词
        dataTime: '' // 时间
      },
      pickerOptions: utils.pickerOptions,
      dialogObj: {}, // 对话框数据
      couponSelect: [
        {
          value: 0,
          label: '启用'
        },
        {
          value: 1,
          label: '作废'
        }
      ],
      tableList: [{}],
      isLoading: false,
      tableInnerBtns: [{
        width: 100,
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          vm.showDialog({
            title: '编辑劵',
            initData: row,
            isEdit: true
          })
        }
      }],
      tableHeader: [
        {
          label: '申请人',
          prop: 'applicants',
          width: 100,
          fixed: true
        },
        {
          label: '申请部门',
          prop: 'applyingDepartment',
          width: 100,
          fixed: true
        },
        {
          label: '类型名称',
          prop: 'couponRuleName'
        },
        {
          label: '品类规则',
          prop: 'categoryType',
          formatter(row) {
            return row.categoryType === 0 ? '全部类' : '限品类'
          }
        },
        {
          label: '优惠门槛',
          prop: 'preferentialLevel',
          formatter(row) {
            return row.couponPreferentialRules.map(item => item.preferentialLevel).filter(d => d).join('')
          }
        },
        {
          label: '优惠类型',
          prop: 'preferentialType',
          formatter(row) {
            return row.couponPreferentialRules.map(item => item.preferentialType).join('') === 0 ? '代金' : '折扣'
          }
        },
        {
          label: '优惠值',
          prop: 'preferentialValue',
          formatter(row) {
            return row.couponPreferentialRules.map(item => item.preferentialType).join('') === 0 ? '分' : '百分比'
          }
        },
        {
          label: '卡劵类型名称',
          prop: 'couponRuleName'
        },
        {
          label: '商品限制分类',
          prop: 'categoryRuleType',
          formatter(row) {
            let categoryRuleType = row.couponUseProductRules.map(item => item.categoryRuleType).join('')
            return categoryRuleType === 0 ? '商品' : (categoryRuleType === 1 ? '品牌' : '分类')
          }
        },
        {
          label: '商品限制规则',
          prop: 'ruleType',
          formatter(row) {
            let ruleType = row.couponUseProductRules.map(item => item.ruleType).join('')
            return ruleType === 1 ? '不能使用' : '可以使用'
          }
        },
        {
          label: '是否需要密码',
          prop: 'hasCode'
        },
        {
          label: '积分门槛',
          prop: 'integeregralLevel',
          formatter(row) {
            return row.integeregralLevel === 0 ? '无门槛' : '有门槛'
          }
        },
        {
          label: '人均限领',
          prop: 'limitReceive'
        },
        {
          label: '是否优惠门槛',
          prop: 'preferentialLevel'
        },
        {
          label: '优惠值',
          prop: 'preferentialValue'
        },
        {
          label: '是否可重复使用',
          prop: 'repeatUse'
        },
        {
          label: '返还规则',
          prop: 'returnRules'
        },
        {
          label: '备注',
          prop: 'remark'
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
  created () {
    this.pageInfo.totalNum = 1
    this.fetchData()
  },
  methods: {
    fetchData () {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.marketing.getCoupon({
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
