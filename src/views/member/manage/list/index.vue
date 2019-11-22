<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button :size="size" type="primary" icon="el-icon-download" @click="exportFile">导出</el-button>
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
            <el-form-item label="姓名">
              <el-input
                v-model="searchObj.name"
                class="search-item"
                :size="size"
                placeholder="姓名"
                clearable
              />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input
                v-model="searchObj.phoneNumber"
                class="search-item"
                :size="size"
                placeholder="手机号"
                clearable
              />
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="searchObj.gender" class="search-item" :size="size" clearable>
                <el-option
                  v-for="item in genderSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="会员类型">
              <el-select
                v-model="searchObj.memberTypeId"
                class="search-item"
                :size="size"
                clearable
              >
                <el-option
                  v-for="item in memberTypeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="会员来源">
              <el-select v-model="searchObj.type" class="search-item" :size="size" clearable>
                <el-option
                  v-for="item in sourceSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属店铺">
              <el-input
                v-model="searchObj.shopName"
                class="search-item"
                :size="size"
                placeholder="所属店铺"
                clearable
              />
            </el-form-item>
            <el-form-item label="所属店员">
              <el-input
                v-model="searchObj.memberName"
                class="search-item"
                :size="size"
                placeholder="所属店员"
                clearable
              />
            </el-form-item>
            <el-form-item label="所在地区">
              <cascader
                :value.sync="areaCode"
                :options="areaOptions"
                :props="areaProps"
                class="search-item"
              >
              </cascader>
            </el-form-item>
            <el-form-item label="首次加入时间">
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
            <el-form-item label="生日区间">
              <el-date-picker
                :size="size"
                v-model="searchObj.birDataTime"
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
import utils from 'utils'
import Cascader from 'components/cascader'

export default {
  name: 'memberManageList',
  mixins: [mixinTable],
  components: {
    EditMember,
    EditBalance,
    EditPoint,
    ReviewMember,
    CDialog,
    Cascader
  },
  data(vm) {
    return {
      areaCode: [], // 省市区code列表  [省，市，区]
      areaOptions: [], // 地区列表
      areaProps: {
        checkStrictly: true,
        lazy: true,
        lazyLoad (node, resolve) {
          vm.fetchAreaData(node, (data) => {
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(data)
          })
        }
      },
      pickerOptions: utils.pickerOptions,
      dialogObj: {},
      options: [], // 地区
      searchObj: {
        name: '', // 姓名
        gender: '', // 性别
        phoneNumber: '', // 手机号
        shopName: '', // 所属店铺
        memberName: '', // 所属店员
        type: '', // 会员来源
        memberTypeId: '', // 会员类型
        dataTime: '', // 首次加入时间区间
        birDataTime: '', // 生日区间
        provinceCode: '', // 省
        cityCode: '', // 市
        districtCode: '' // 区
      },
      // 会员来源
      sourceSelect: [
        {
          label: '自主开通',
          value: 0
        },
        {
          label: '店员开通',
          value: 1
        }
      ],
      genderSelect: [{
        label: '男',
        value: 1
      }, {
        label: '女',
        value: 2
      }],
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
          isImage: true,
          width: 100
        },
        {
          label: '用户',
          prop: 'name'
        },
        {
          label: '昵称',
          prop: 'nickname'
        },
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '手机号',
          prop: 'phoneNumber',
          width: 110
        },
        {
          label: '会员类型',
          prop: 'memberType',
          width: 130
        },
        {
          label: '会员来源',
          prop: 'source'
        },
        {
          label: '会员归属',
          prop: 'shopName',
          formatter(row) {
            return row && `${row.shopName || ''}${row.memberName ? '（' + row.memberName + '）' : ''}`
          }
        },
        {
          label: '可用积分',
          prop: 'point'
        },
        {
          label: '可用优惠券',
          prop: 'couponNum'
        },
        {
          label: '消费金额(元)',
          prop: 'expenseAmount'
        },
        {
          label: '首次加入时间',
          prop: 'firstJoinTime',
          width: 100
        }
      ]
    }
  },

  created() {
    this.getMemberType()
    this.fetchData()
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
      this.searchObj.provinceCode = this.areaCode[0] || ''
      this.searchObj.cityCode = this.areaCode[1] || ''
      this.searchObj.districtCode = this.areaCode[2] || ''
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime, 'dateTime', 'firstJoinStartTime', 'firstJoinEndTime')
      const birDateTime = this.getSearchDate(dataTime, '', 'birthdayStartTime', 'birthdayEndTime')
      this.isLoading = true
      this.$api.member.getMember({
        ...searchDate,
        ...birDateTime,
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
        this.memberTypeSelect = res.map(val => ({ label: val.name, value: val.id }))
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
        initData: opts.initData
      }
    },
    exportFile() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime, 'dateTime', 'firstJoinStartTime', 'firstJoinEndTime')
      const birDateTime = this.getSearchDate(dataTime, '', 'birthdayStartTime', 'birthdayEndTime')
      this.exportLoading = true
      this.$api.member.exportMember({
        ...searchDate,
        ...birDateTime,
        ...other,
        ...page
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
