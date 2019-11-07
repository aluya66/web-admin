<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button :size="size" type="primary" icon="el-icon-plus">导出</el-button>
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
            <el-form-item label="姓别">
              <el-input
                v-model="searchObj.gender"
                class="search-item"
                :size="size"
                placeholder="姓别"
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
            <el-form-item label="所属店铺">
              <el-input
                v-model="searchObj.shopId"
                class="search-item"
                :size="size"
                placeholder="所属店铺"
                clearable
              />
            </el-form-item>
            <el-form-item label="所属店员">
              <el-input
                v-model="searchObj.pid"
                class="search-item"
                :size="size"
                placeholder="所属店员"
                clearable
              />
            </el-form-item>
            <el-form-item label="会员来源">
              <el-select v-model="searchObj.source" class="search-item" :size="size" clearable>
                <el-option
                  v-for="item in sourceSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="会员类型">
              <el-select v-model="searchObj.memberType" class="search-item" :size="size" clearable>
                <el-option
                  v-for="item in memberTypeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地区">
              <el-cascader :options="options" :props="{ checkStrictly: true }" clearable></el-cascader>
            </el-form-item>
            <el-form-item label="加入时间">
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
            <!-- <el-form-item label="生日区间">
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
import utils from 'utils'

export default {
  name: 'memberManageList',
  mixins: [mixinTable],
  data(vm) {
    return {
      pickerOptions: utils.pickerOptions,
      tableList: [],
      dialogObj: {},
      options: [], // 地区
      searchObj: {
        name: '', // 姓名
        gender: '', // 性别
        phoneNumber: '', // 手机号
        shopId: '', // 所属店铺
        pid: '', // 所属店员
        source: '', // 会员来源
        memberType: '', // 会员类型
        cityCode: '', // 地区
        dataTime: ''
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
      // 会员类型
      memberTypeSelect: [
        {
          label: '白金会员',
          value: 0
        },
        {
          label: '砖石会员',
          value: 1
        }
      ],
      tableInnerBtns: [
        {
          width: 100,
          name: '查看详情',
          icon: 'el-icon-view',
          handle(row) {
            vm.routerLink(`/member/manage/detail/${row.id}`)
          }
        }
      ],
      tableHeader: [
        {
          label: '头像',
          prop: 'avatar',
          isImage: true,
          width: 100,
          fixed: true
        },
        {
          label: '用户',
          prop: 'name',
          formatter(row) {
            return `${row.name}[${row.nickname}]`
          }
        },
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '手机号',
          prop: 'phoneNumber'
        },
        {
          label: '会员来源',
          prop: 'source'
          // formatter(row){
          //   return row.source ? vm.sourceSelect[row.source].label : ''
          // }
        },
        {
          label: '会员类型',
          prop: 'memberType'
          // formatter(row){
          //   return row.memberType ? vm.memberTypeSelect[row.memberType].label : ''
          // }
        },
        {
          label: '会员归属',
          prop: 'shopName'
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
        }
      ]
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime, 'dateTime')
      this.isLoading = true
      this.$api.member
        .getMember({
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
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title,
        isEdit: opts.isEdit,
        initData: opts.initData
      }
    }
  }
}
</script>

<style lang='less' scoped>
</style>
