<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button :size="size" type="primary" icon="el-icon-plus" @click="showDialog">新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        selection
        hasBorder
        :max-height="550"
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
            <el-form-item label="劵名称">
              <el-input
                v-model="searchObj.couponName"
                class="search-item"
                :size="size"
                placeholder="请输入劵名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="卡劵类型">
              <el-input
                v-model="searchObj.couponRuleType"
                class="search-item"
                :size="size"
                placeholder="请输入卡劵类型"
                clearable
              />
            </el-form-item>
            <!-- <el-form-item label="卡劵类型名称">
              <el-input
                v-model="searchObj.couponRuleName"
                class="search-item"
                :size="size"
                placeholder="请输入卡劵类型名称"
                clearable
              />
            </el-form-item> -->
            <el-form-item label="状态">
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
        <add-coupon ref="childRef" :isVerify='couponVerify' :init-data="dialogObj.initData"></add-coupon>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'
import CDialog from 'components/dialog'
import AddCoupon from './addCoupon'

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
        couponRuleType: '', // 卡劵类型
        couponRuleName: '', // 卡劵类型名称
        couponStatus: '', // 卡劵状态
        marketable: '',
        brandName: '',
        dataTime: ''
      },
      pickerOptions: utils.pickerOptions,
      statusSelect: [{
        label: '草稿',
        value: 0
      }, {
        label: '审核中',
        value: 1
      }, {
        label: '审核不通过',
        value: 2
      }, {
        label: '审核通过',
        value: 3
      }],
      tableInnerBtns: [
        {
          width: 180,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
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
            vm.confirmTip(`需注意,审核通过后将生成劵并建立库存,确认审核通过？`, {
              confirmHandle() {
                vm.verifyData({ couponId, applyType: 2, msgTip: '审核通过' })
              },
              cancalHandle() {
                vm.verifyData({ couponId, applyType: 3, msgTip: '审核不通过' })
              },
              confirmButtonText: '审核通过',
              cancelButtonText: '审核不通过'
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { couponName, couponId } = row
            vm.confirmTip(`确认删除${couponName}劵信息`, () => {
              vm.deleteData({ couponId })
            })
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
          label: '卡劵类型id',
          prop: 'couponRuleId',
          fixed: true
        },
        {
          label: '卡劵类型',
          prop: 'couponRuleType',
          width: 100
        },
        {
          label: '卡劵类型名称',
          prop: 'couponRuleName'
        },
        {
          label: '生成数量',
          prop: 'couponNumber',
          formatter(row) {
            return `${row.couponNumber}张`
          }
        },
        {
          label: ' 领取数量',
          prop: 'receiveNumber',
          formatter(row) {
            return `${row.receiveNumber}张`
          }
        },
        {
          label: '剩余数量',
          prop: 'remainNumber',
          formatter(row) {
            return `${row.remainNumber}张`
          }
        },
        {
          label: '申请审核时间',
          prop: 'applyCheckTime'
        },
        {
          label: '审核时间',
          prop: 'checkTime'
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row.status ? vm.statusSelect[row.status].label : ''
          }
        },
        {
          label: '激活时间_月份',
          prop: 'limitActivateMonth'
        },
        {
          label: '激活时间_天数',
          prop: 'limitActivateDay'
        },
        {
          label: '有效期结束时间',
          prop: 'limitExpireTimeEnd'
        },
        {
          label: '有效期开始时间',
          prop: 'limitExpireTimeStart'
        },
        {
          label: '激活时间类型_天数',
          prop: 'limitActivateDayType'
        },
        {
          label: '激活时间_月份',
          prop: 'limitActivateMonths',
          formatter(row) {
            return row.limitActivateMonths.join(' / ')
          }
        },
        {
          label: '激活时间_天数',
          prop: 'limitActivateDays',
          formatter(row) {
            return row.limitActivateDays.join(' / ')
          }
        },
        {
          label: '激活开始时间',
          prop: 'limitActivateTimeStart'
        },
        {
          label: '激活结束时间',
          prop: 'limitActivateTimeEnd'
        },
        {
          label: '备注',
          prop: 'couponRemark'
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
      const searchDate = this.getSearchDate(dataTime)
      this.isLoading = true
      this.$api.marketing.getCoupon(
        {
          ...searchDate,
          ...other,
          ...page
        }
      ).then(res => {
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
      console.log(param, msgTip)
      // 主要修改接口
      this.$api.marketing.deleteCoupon(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    },
    // 审核劵
    verifyData(params) {
      console.log(params)
      const { couponId, msgTip, applyType } = params
      let data = {
        couponId,
        applyType
      }
      console.log(data)
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
    dialogDraft() {
      console.log('dialogDraft')
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
      this.dialogObj.isShow = true
    },
    /**
     * 确认修改操作
    */
    editHandle(formModel) {
      this.$api.marketing.addCoupon(formModel).then(res => {
        this.$msgTip('修改成功')
        this.fetchData()
      })
      this.dialogObj.isShow = false
    }
  }
}
</script>
