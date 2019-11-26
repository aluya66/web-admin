<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button type="primary" :size="size" icon="el-icon-plus"  @click="routerLink('/marketing/ticket/ticketInfo')">新增</el-button>
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
            <el-form-item label="卡券ID">
              <el-input
                v-model="searchObj.couponId"
                class="search-item"
                :size="size"
                placeholder="卡券ID"
                clearable
              />
            </el-form-item>
            <el-form-item label="卡券名称">
              <el-input
                v-model="searchObj.couponName"
                class="search-item"
                :size="size"
                placeholder="卡劵名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="使用渠道">
              <el-select
                v-model="searchObj.platform"
                class="search-item"
                :size="size"
                clearable
              >
                <el-option
                  v-for="item in platformList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="卡券类型">
              <el-select
                v-model="searchObj.type"
                class="search-item"
                :size="size"
                clearable
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="卡券状态">
              <el-select
                v-model="searchObj.couponStatus"
                class="search-item"
                :size="size"
                clearable
              >
                <el-option
                  v-for="item in couponStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建人">
              <el-input
                v-model="searchObj.createBy"
                class="search-item"
                :size="size"
                placeholder="创建人"
                clearable
              />
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

      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
// import utils from 'utils'
import CDialog from 'components/dialog'

export default {
  name: 'couponList',
  mixins: [mixinTable],
  components: {
    CDialog
  },
  data(vm) {
    return {
      couponStatusList: [ // 卡劵状态 0草稿 1审核中 2审核不通过 3审核通过 4未发布 5进行中 6未开始 7已下架 8已结束(失效)
        {
          value: 0,
          label: '草稿'
        },
        {
          value: 1,
          label: '审核中'
        },
        {
          value: 2,
          label: '审核不通过'
        },
        {
          value: 3,
          label: '审核通过'
        },
        {
          value: 4,
          label: '未发布'
        },
        {
          value: 5,
          label: '进行中'
        },
        {
          value: 6,
          label: '未开始'
        },
        {
          value: 7,
          label: '已下架'
        },
        {
          value: 8,
          label: '已结束(失效)'
        }
      ],
      typeList: [ // 卡券类型
        {
          value: 1,
          label: '现金券'
        },
        {
          value: 2,
          label: '折扣券'
        },
        {
          value: 3,
          label: '兑换券'
        }
      ],
      platformList: [ // 渠道1 IPX, 2星购, 4YOSHOP, 8YSIA
        {
          value: 1,
          label: 'ipx'
        },
        {
          value: 2,
          label: '星GO'
        },
        {
          value: 4,
          label: 'YOSHOP'
        },
        {
          value: 8,
          label: 'YSIA'
        }
      ],
      dialogObj: {}, // 对话框数据
      searchObj: {
        couponName: '', // 劵名称
        couponRuleType: '', // 劵规则类型
        couponRuleName: '', // 劵规则类型名称
        couponStatus: '', // 劵审核状态
        dataTime: ''
      },
      tableInnerBtns: [
        {
          width: 180,
          name: '编辑',
          notBtn: 'status',
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
        { // 0草稿 1审核中 2审核不通过 3审核通过 4未发布 5进行中 6未开始 7已下架 8已结束(失效)
          prop: {
            name: 'status',
            toggle: [{
              title: '发布',
              icon: 'el-icon-check',
              value: [0, 4]
            }, {
              title: '上架',
              icon: 'el-icon-check',
              value: [6, 7]
            }, {
              title: '下架',
              icon: 'el-icon-check',
              value: [5, 6]
            }]
          },
          handle(row) {
            const { couponName, couponId } = row
            vm.confirmTip(`确认删除  ${couponName}  劵信息`, () => {
              vm.deleteData({ couponId })
            })
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
        }
      ],
      tableHeader: [
        {
          label: 'ID',
          prop: 'couponId',
          width: 100,
          fixed: true
        },
        {
          label: '使用渠道',
          prop: 'platforms',
          formatter(row) {
            let arr = []
            // 渠道1 IPX, 2星购, 4YOSHOP, 8YSIA
            row.platforms && row.platforms.length && row.platforms.forEach((item) => {
              switch (item) {
                case 1: arr.push('IPX'); break
                case 2: arr.push('星GO'); break
                case 4: arr.push('YOSHOP'); break
                case 8: arr.push('YSIA'); break
              }
            })
            return arr.join(',')
          }
        },
        {
          label: '卡券名称',
          prop: 'couponName'
        },
        {
          label: '卡券类型',
          prop: 'couponRuleType',
          formatter(row) {
            return row.couponRuleType === 1 ? '现金券' : row.couponRuleType === 2 ? '折扣券' : '兑换券'
          }
        },
        {
          label: '卡券内容',
          prop: 'couponRemark'
        },
        {
          label: '卡券有效期开始时间',
          prop: 'limitExpireTimeStart'
        },
        {
          label: '卡券有效期结束时间',
          prop: 'limitExpireTimeEnd'
        },
        {
          label: '状态', // 卡劵状态 0草稿 1审核中 2审核不通过 3审核通过 4未发布 5进行中 6未开始 7已下架 8已结束(失效)
          prop: 'status',
          formatter(row) {
            switch (row.status) {
              case 0: return '草稿'
              case 1: return '审核中'
              case 2: return '审核不通过'
              case 3: return '审核通过'
              case 4: return '未发布'
              case 5: return '进行中'
              case 6: return '未开始'
              case 7: return '已下架'
              case 8: return '已结束(失效)'
            }
          }
        },
        {
          label: '创建时间',
          prop: 'created'
        },
        {
          label: '创建人',
          prop: ''
        },
        {
          label: '已领取',
          prop: ''
        },
        {
          label: '已使用',
          prop: ''
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
