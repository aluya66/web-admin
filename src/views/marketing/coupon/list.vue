<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button type="primary" v-permission="$route.meta.roles" :size="size" icon="el-icon-plus" @click="showDialog">新增</el-button>
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
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
            <el-form-item label="券名称">
              <el-input
                v-model="searchObj.couponName"
                class="search-item"
                :size="size"
                placeholder="劵名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="类型名称">
              <el-input
                v-model="searchObj.couponRuleName"
                class="search-item"
                :size="size"
                placeholder="类型名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="类型">
              <el-select
                v-model="searchObj.couponRuleType"
                class="search-item"
                :size="size"
                clearable
              >
                <el-option
                  v-for="item in couponRuleSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核状态">
              <el-select
                v-model="searchObj.couponStatus"
                class="search-item"
                :size="size"
                clearable
              >
                <el-option
                  v-for="item in statusSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <add-coupon ref="childRef" :isVerify="couponVerify" :init-data="dialogObj.initData"></add-coupon>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'
import CDialog from 'components/dialog'
import AddCoupon from './add'

export default {
  name: 'couponList',
  mixins: [mixinTable],
  components: {
    CDialog,
    AddCoupon
  },
  data(vm) {
    return {
      couponVerify: false, // 判断是新增还是编辑
      dialogObj: {}, // 对话框数据
      searchObj: {
        couponName: '', // 劵名称
        couponRuleType: '', // 劵规则类型
        couponRuleName: '', // 劵规则类型名称
        couponStatus: '', // 劵审核状态
        dataTime: ''
      },
      pickerOptions: utils.pickerOptions,
      statusSelect: [
        {
          label: '草稿',
          value: 0
        },
        {
          label: '审核中',
          value: 1
        },
        {
          label: '不通过',
          value: 2
        },
        {
          label: '通过',
          value: 3
        }
      ],
      couponRuleSelect: [
        {
          label: '劵',
          value: 0
        },
        {
          label: '卡',
          value: 1
        },
        {
          label: '通用劵',
          value: 2
        },
        {
          label: '运费劵',
          value: 3
        }, {
          label: '售后代金劵',
          value: 4
        }
      ],
      tableInnerBtns: [
        {
          width: 180,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              couponId,
              couponName, // 劵名称
              couponNumber, // 生成数量
              limitActivateDayType, // 激活时间类型
              limitActivateTimeStart, // 激活开始时间
              limitActivateTimeEnd, // 激活结束时间
              limitActivateDays, // 激活时间_天数
              limitActivateMonths, // 激活时间_月份
              limitExpireDayType, // 过期时间类型
              limitExpireDay, // 有效期截止类型_天数
              limitExpireTimeStart, // 有效期开始时间
              limitExpireTimeEnd, // 有效期结束时间
              submitStatus, // 提交状态
              couponRuleId, // 劵规则ID
              couponRemark // 备注
            } = row
            vm.showDialog({
              title: '编辑劵',
              initData: {
                couponId,
                couponName, // 劵名称
                couponNumber, // 生成数量
                limitActivateDayType, // 激活时间类型
                limitActivateTimeStart, // 激活开始时间
                limitActivateTimeEnd, // 激活结束时间
                limitActivateDays, // 激活时间_天数
                limitActivateMonths,
                // 激活时间_月份
                limitExpireDayType, // 过期时间类型
                limitExpireDay, // 有效期截止类型_天数
                limitExpireTimeStart, // 有效期开始时间
                limitExpireTimeEnd, // 有效期结束时间
                submitStatus, // 提交状态
                couponRuleId, // 劵规则ID
                couponRemark // 备注
              },
              isEdit: true
            })
          }
        },
        {
          name: '审核',
          icon: 'el-icon-check',
          handle(row) {
            const { couponId } = row
            vm.confirmTip(
              `需注意,审核通过后将生成劵并建立库存,确认审核通过？`,
              {
                confirmHandle() {
                  vm.verifyData({ couponId, applyType: 2, msgTip: '审核通过' })
                },
                cancalHandle() {
                  vm.verifyData({
                    couponId,
                    applyType: 3,
                    msgTip: '审核不通过'
                  })
                },
                confirmButtonText: '审核通过',
                cancelButtonText: '审核不通过'
              }
            )
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { couponName, couponId } = row
            vm.confirmTip(`确认删除  ${couponName}  劵信息`, () => {
              vm.deleteData({ couponId })
            })
          }
        },
        {
          name: '查看券规则',
          icon: 'el-icon-view',
          handle(row) {
            vm.routerLink(`/marketing/coupon/ruleView/${row.couponRuleId}`)
          }
        }
      ],
      tableHeader: [
        {
          label: '券名称 ',
          prop: 'couponName',
          width: 130,
          fixed: true
        },
        {
          label: '类型名称',
          prop: 'couponRuleName',
          width: 100,
          fixed: true
        },
        {
          label: '类型',
          prop: 'couponRuleType',
          width: 100,
          formatter(row) {
            return row.couponRuleType !== '' ? vm.couponRuleSelect[row.couponRuleType].label : ''
          }
        },
        {
          label: '生成数量(张)',
          prop: 'couponNumber'
        },
        {
          label: ' 领取数量(张)',
          prop: 'receiveNumber'
        },
        {
          label: '剩余数量(张)',
          prop: 'remainNumber'
        },
        // {
        //   label: '激活时间(月)',
        //   prop: 'limitActivateMonth'
        // },
        // {
        //   label: '激活时间(天)',
        //   prop: 'limitActivateDay'
        // },
        {
          label: '激活时间类型(天)',
          prop: 'limitActivateDayType',
          width: 120,
          formatter(row) {
            return row.limitActivateDayType === 0
              ? '固定时间可领取'
              : '所有时间可领取'
          }
        },
        {
          label: '激活时间(月)',
          prop: 'limitActivateMonths',
          width: 120,
          formatter(row) {
            return row.limitActivateMonths.join('/')
          }
        },
        {
          label: '激活时间(天)',
          prop: 'limitActivateDays',
          width: 120,
          formatter(row) {
            return row.limitActivateDays.join('/')
          }
        },
        {
          label: '激活开始时间',
          prop: 'limitActivateTimeStart',
          width: 100
        },
        {
          label: '激活结束时间',
          prop: 'limitActivateTimeEnd',
          width: 100
        },
        {
          label: '有效期结束时间',
          prop: 'limitExpireTimeEnd',
          width: 100
        },
        {
          label: '有效期开始时间',
          prop: 'limitExpireTimeStart',
          width: 100
        },
        {
          label: '审核状态',
          prop: 'statusName',
          width: 100
        },
        {
          label: '申请审核时间',
          prop: 'applyCheckTime',
          width: 100
        },
        {
          label: '审核时间',
          prop: 'checkTime',
          width: 100
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     * 获取表格数据
     */
    fetchData() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime, 'dateTime')
      this.isLoading = true
      this.$api.marketing
        .getCoupon({
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
    },
    /**
     * 删除表格单条数据
     *
     * @param {*} curPromise
     * @param {string} [msgTip='删除成功']
     */
    deleteData(param, msgTip = '删除成功') {
      // 主要修改接口
      this.$api.marketing.deleteCoupon(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    },
    // 审核劵
    verifyData(params) {
      const { couponId, msgTip, applyType } = params
      let data = {
        couponId,
        applyType
      }
      this.$api.marketing.applyCoupon(data).then(() => {
        this.$msgTip(msgTip)
        this.fetchData()
      })
    },
    /**
     * 对话框确认按钮，集成了表单提交功能
     */
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
    showDialog(opts) {
      this.couponVerify = opts.isEdit
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增劵',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    /**
     * 确认新增操作
     */
    addHandle(childFormModel) {
      this.$api.marketing.addCoupon(childFormModel).then(res => {
        this.$msgTip('添加成功')
        this.fetchData()
        this.dialogObj.isShow = false
      })
    },
    /**
     * 确认修改操作
     */
    editHandle(formModel) {
      this.$api.marketing.addCoupon(formModel).then(res => {
        this.$msgTip('修改成功')
        this.fetchData()
        this.dialogObj.isShow = false
      })
    }
  }
}
</script>
