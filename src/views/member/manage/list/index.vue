<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button
          :size="size"
          type="primary"
          :loading="exportLoading"
          icon="el-icon-download"
          @click="exportFile"
        >导出</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :max-height="maxHeight"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        :no-btn="dialogObj.noBtn"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <review-member v-if="dialogObj.type === 1" ref="childRef" :init-data="dialogObj.initData"></review-member>
        <edit-member
          v-if="dialogObj.type === 2"
          ref="childRef"
          :init-data.sync="dialogObj.initData"
        ></edit-member>
        <edit-balance
          v-if="dialogObj.type === 3"
          ref="childRef"
          :init-data.sync="dialogObj.initData"
        ></edit-balance>
        <edit-point v-if="dialogObj.type === 4" ref="childRef" :init-data.sync="dialogObj.initData"></edit-point>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import ReviewMember from './reviewMember'
import EditMember from './editMember'
import EditBalance from './editBalance'
import EditPoint from './editPoint'
import dictObj from '@/store/dictData'
import utils from 'utils'

// 会员来源
const sourceSelect = [
  {
    label: '自主开通',
    value: 1
  },
  {
    label: '店员开通',
    value: 2
  },
  {
    label: '赠送',
    value: 3
  }
]
const isVipSelect = [{
  value: 1,
  label: '是'
}, {
  value: 0,
  label: '否'
}]

const genderSelect = [{
  label: '男',
  value: 1
}, {
  label: '女',
  value: 2
}]

export default {
  name: 'memberManageList',
  mixins: [mixinTable],
  components: {
    EditMember,
    EditBalance,
    EditPoint,
    ReviewMember,
    CDialog
  },
  data(vm) {
    return {
      areaOptions: [], // 地区列表
      areaProps: {
        expandTrigger: 'click',
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          vm.fetchAreaData(node, (data) => {
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(data)
          })
        }
      },
      dialogObj: {},
      exportLoading: false,
      // 会员类型
      memberTypeSelect: [],
      tableInnerBtns: [
        {
          width: 150,
          name: '查看',
          icon: 'el-icon-view',
          handle(row) {
            const {
              userId,
              appCode
            } = row
            vm.showDialog({
              title: '查看会员信息',
              type: 1,
              noBtn: true,
              initData: {
                userId,
                appCode
              }
            })
          }
        },
        {
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              appCode, // 业务线
              userId // 用户id
            } = row
            vm.showDialog({
              title: '编辑会员',
              type: 2,
              initData: {
                userId,
                appCode
              }
            })
          }
        },
        {
          name: '余额',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              userId,
              appCode
            } = row
            vm.showDialog({
              title: '编辑余额',
              type: 3,
              initData: {
                userId,
                appCode
              }
            })
          }
        },
        {
          name: '积分',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              userId,
              appCode
            } = row
            vm.showDialog({
              title: '编辑积分',
              type: 4,
              initData: {
                userId,
                appCode
              }
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '头像',
          prop: 'avatar',
          isImage: true
        },
        {
          label: '用户',
          prop: 'name',
          search: {
            type: 'input'
          }
        },
        {
          label: '昵称',
          prop: 'nickname'
        },
        {
          label: '性别',
          prop: 'gender',
          search: {
            type: 'select',
            optionsList: genderSelect
          }
        },
        {
          label: '手机号',
          prop: 'phoneNumber',
          width: 110,
          search: {
            type: 'input'
          }
        },
        {
          label: '会员类型',
          prop: 'memberType',
          width: 130,
          search: {
            prop: 'memberTypeId',
            type: 'dict',
            optionsList: []
          }
        },
        {
          label: '收益(元)',
          prop: 'earnings'
        },
        {
          label: '会员来源',
          prop: 'source',
          search: {
            type: 'select',
            optionsList: sourceSelect
          }
        },
        {
          label: '会员归属',
          prop: 'shopName',
          formatter(row) {
            return row && `${row.shopName || ''}${row.memberName ? '（' + row.memberName + '）' : ''}`
          },
          search: {
            label: '所属店铺',
            type: 'input'
          }
        },
        {
          label: '业务线',
          prop: 'appCode',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.appCode, 'lobList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.lobList
          }
        },
        {
          label: '是否会员',
          prop: 'isVip',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.isVip, isVipSelect)
          },
          search: {
            type: 'dict',
            optionsList: isVipSelect
          }
        },
        {
          label: '可用积分',
          prop: 'point',
          search: {
            type: 'input',
            label: '所属店员',
            prop: 'memberName'
          }
        },
        {
          label: '可用优惠券',
          prop: 'couponNum',
          search: {
            type: 'cascader',
            prop: 'areaCode',
            label: '所属地区',
            optionsProps: {},
            optionsList: []
          }
        },
        {
          label: '消费金额(元)',
          prop: 'expenseAmount',
          search: {
            label: '生日区间',
            type: 'dateTime',
            prop: 'birDateTime'
          }
        },
        {
          label: '首次加入时间',
          prop: 'firstJoinTime',
          width: 105,
          search: {
            prop: 'dateTime',
            type: 'dateTime'
          }
        }
      ]
    }
  },

  created() {
    this.getMemberType()
    this.fetchData()
    this.setSearchOptionsList('areaCode', this.areaProps, 'optionsProps')
  },

  methods: {
    fetchAreaData(node = {}, callBack) {
      const { level, value } = node
      this.$api.basic.queryAllRegion({
        parentCode: value || 0
      }).then(res => {
        const data = res.totalCount ? res.data : res
        let curData = []
        if (data && data.length) {
          curData = data.map(res => ({
            leaf: level ? level >= 2 : 0,
            value: res.code,
            label: res.name
          }))
        }
        if (value === 0) {
          this.areaOptions = curData
        } else {
          typeof callBack === 'function' && callBack(curData)
        }
      })
    },
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { areaCode, dateTime, birDateTime, ...other } = this.searchObj
      const curArea = { // 传省、市、区code给api
        provinceCode: areaCode[0] || '',
        cityCode: areaCode[1] || '',
        districtCode: areaCode[2] || ''
      }
      const searchDate = this.getSearchDate(dateTime, '', 'firstJoinStartTime', 'firstJoinEndTime')
      const birthdayDate = this.getSearchDate(birDateTime, '', 'birthdayStartTime', 'birthdayEndTime')
      this.isLoading = true
      this.$api.member.getMember({
        ...curArea,
        ...searchDate,
        ...birthdayDate,
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
    getMemberType() {
      this.$api.member.getMemberListType().then(res => {
        this.memberTypeSelect = res && res.map(val => ({ label: val.name, value: val.id }))
        this.setSearchOptionsList('memberTypeId', this.memberTypeSelect)
      })
    },
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          this.reviewAndEditHandle(childFormModel, this.dialogObj.type)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reviewAndEditHandle(childFormModel, type) {
      if (type === 2) {
        // 编辑会员
        const { appCode, birthday, isEnable, shareStatus, userId } = childFormModel
        this.$api.member.updateMember({ appCode, birthday, isEnable, shareStatus, userId }).then(res => {
          this.responeHandle('修改成功')
        })
      } else if (type === 3) {
        // 编辑余额
        const { appCode, userId, balance } = childFormModel
        this.$api.member.updateBalance({ appCode, userId, balance }).then(res => {
          this.responeHandle('修改余额成功')
        })
      } else if (type === 4) {
        // 编辑积分
        const { appCode, userId, point } = childFormModel
        this.$api.member.updatePoint({ appCode, userId, point }).then(res => {
          this.responeHandle('修改积分成功')
        })
      }
    },
    showDialog(opts) {
      this.dialogObj = {
        type: opts.type,
        isShow: true,
        title: opts.title,
        initData: opts.initData,
        noBtn: opts.noBtn || false
      }
    },
    exportFile() {
      const { dateTime, birDateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime, '', 'firstJoinStartTime', 'firstJoinEndTime')
      const birthdayDate = this.getSearchDate(birDateTime, '', 'birthdayStartTime', 'birthdayEndTime')
      this.exportLoading = true
      this.$api.member.exportMember({
        ...searchDate,
        ...birthdayDate,
        ...other,
        ...page,
        total: totalNum
      }).then(res => {
        this.exportLoading = false
        if (res) {
          const { data, filename } = res
          if (data && filename) {
            utils.createBlobFile(data, filename)
          } else {
            this.$msgTip('导出数据异常', 'warning')
          }
        } else {
          this.$msgTip('导出数据失败', 'warning')
        }
      })
    }
  }
}
</script>
