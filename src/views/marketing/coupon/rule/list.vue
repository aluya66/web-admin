<template>
  <c-view>
    <template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
      <div class="header-btn">
        <el-button
          :size="size"
          type="primary"
          icon="el-icon-plus"
          @click="routerLink('/rule/info')"
        >新增</el-button>
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
              <el-select
                v-model="searchObj.couponStatus"
                :size="size"
                class="search-item"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in couponTypeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <add-rule ref="childRef" :init-data="dialogObj.initData"></add-rule>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'
import CDialog from 'components/dialog'
import AddRule from './addRule'

export default {
  name: 'couponRuleList',
  mixins: [mixinTable],
  components: {
    CDialog,
    AddRule
  },
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
      couponTypeSelect: [
        {
          value: 0,
          label: '启用'
        },
        {
          value: 1,
          label: '作废'
        }
      ],
      tableList: [],
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
      }, {
        name: '作废',
        icon: 'el-icon-delete',
        handle(row) {
          console.log(row)
          const { couponRuleName, id } = row
          vm.confirmTip(`确认删除${couponRuleName}此规则列表`, () => {
            vm.deleteData({ id })
          })
        }
      }
      ],
      tableHeader: [
        {
          label: '卡劵类型名称',
          prop: 'couponRuleName'
        },
        {
          label: '卡劵类型',
          prop: 'couponRuleType'
        },
        {
          label: '卡劵类型状态',
          prop: 'couponStatus'
        },
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
          label: '是否需要密码',
          prop: 'hasCode',
          formatter(row) {
            return row.hasCode === 0 ? '否' : '是'
          }
        },
        {
          label: '积分门槛',
          prop: 'integeregralLevel',
          formatter(row) {
            return row.integeregralLevel === 0 ? '无门槛' : '有门槛'
          }
        },
        {
          label: '等级门槛',
          prop: 'userLevel'
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
          label: '优惠类型',
          prop: 'preferentialType',
          formatter(row) {
            return row.preferentialType === 0 ? '代金' : '折扣'
          }
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
          label: '备注',
          prop: 'remark'
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
    },
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          if (!this.dialogObj.isEdit) {
            this.addHandle(childFormModel)
          } else {
            this.editHandle(childFormModel)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteData(parms, msgTip = '删除成功') {
      // 主要修改接口
      this.$api.coupon.unableCoupon(parms).then(() => {
        this.$msgTip(msgTip)
        // if (this.tableList.length === 1) {
        //   const { pageNum } = this.pageInfo
        //   this.pageInfo.pageNum = pageNum > 1 ? pageNum - 1 : 1
        // }
        this.fetchData()
      })
    },
    addHandle() {
      this.dialogObj.isShow = false
    },
    editHandle() {
      this.dialogObj.isShow = false
    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增商品',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
      //  width: 100,
      //   name: '详情',
      //   icon: 'el-icon-view',
      //   handle(row) {
      // opts.routerLink(`/goods/detail/${row.id}`)
      // }
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
