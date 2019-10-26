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
        :max-height="450"
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

            <el-form-item label="卡劵类型">
              <el-input
                v-model="searchObj.couponRuleType"
                class="search-item"
                :size="size"
                placeholder="请输入卡劵类型"
                clearable
              />
            </el-form-item>
            <el-form-item label="卡劵类型名称">
              <el-input
                v-model="searchObj.couponRuleName"
                class="search-item"
                :size="size"
                placeholder="请输入卡劵类型名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-input
                v-model="searchObj.status"
                class="search-item"
                :size="size"
                placeholder="请选择状态"
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
        <add-coupon ref="childRef" :init-data="dialogObj.initData"></add-coupon>
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
      dialogObj: {}, // 对话框数据
      searchObj: {
        couponName: '', // 劵名称
        couponRuleType: '', // 卡劵类型
        couponRuleName: '', // 卡劵类型名称
        status: '', // 状态
        marketable: '',
        brandName: '',
        dataTime: ''
      },
      marketableSelect: [{
        value: '1',
        label: '上架'
      },
      {
        value: '2',
        label: '下架'
      }],
      pickerOptions: utils.pickerOptions,
      tableInnerBtns: [{
        width: 130,
        name: '详情',
        icon: 'el-icon-edit'
        // handle(row) {
        //   vm.showDialog({
        //     title: '编辑劵',
        //     initData: row,
        //     isEdit: true
        //   })
        // }
        // width: 100,
        // name: '详情',
        // icon: 'el-icon-view',
        // handle(row) {
        //   vm.routerLink(`/goods/detail/${row.id}`)
        // }
      }, {
        width: 130,
        name: '审核',
        icon: 'el-icon-edit',
        handle(row) {
          const { couponName, id } = row
          vm.confirmTip(`确认时候审核${couponName}劵信息`, () => {
            vm.verifyData({ id })
          })
        }
      }, {
        name: '删除',
        icon: 'el-icon-delete',
        handle(row) {
          const { couponName, id } = row
          vm.confirmTip(`确认删除${couponName}劵信息`, () => {
            vm.deleteData({ id })
          })
        }
      }],
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
      this.$api.marketing.userCoupon(
        {
          ...searchDate,
          ...other,
          ...page
        }
      ).then(res => {
        this.isLoading = false
        if (res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data
        } else {
          this.tableList = res
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
        if (this.tableList.length === 1) {
          const { pageNum } = this.pageInfo
          this.pageInfo.pageNum = pageNum > 1 ? pageNum - 1 : 1
        }
        this.fetchData()
      })
    },
    // 审核劵
    verifyData(param, msgTip = '审核通过') {
      this.$api.marketing.applyCoupon(param).then(() => {
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
            this.addHandle()
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
      // codeing ajax
      // ajax成功方法里面加入 关闭对话框标识
      // addCoupon
      this.$api.marketing.addCoupon(childFormModel).then(res => {
        this.$msgTip('添加成功')
        this.fetchData()
        this.dialogObj.isShow = false
      })
      this.dialogObj.isShow = false
    }
    /**
     * 确认修改操作
    */
    // editHandle(formModel) {
    //   // codeing ajax
    //   // ajax成功方法里面加入 关闭对话框标识
    //   this.dialogObj.isShow = false
    // }
  }
}
</script>
