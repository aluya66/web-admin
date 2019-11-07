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
            <el-form-item label="业务线">
              <el-input
                v-model="searchObj.appCode"
                class="search-item"
                :size="size"
                placeholder="业务线"
                clearable
              />
            </el-form-item>
            <el-form-item label="会员类型">
              <el-input
                v-model="searchObj.memberTypeId"
                class="search-item"
                :size="size"
                placeholder="会员类型"
                clearable
              />
            </el-form-item>

            <el-form-item label="状态">
              <el-select v-model="searchObj.isEnable" class="search-item" :size="size" clearable>
                <el-option
                  v-for="item in isEnableSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="操作时间">
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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <point-add ref="childRef" :is-edit="dialogObj.isEdit" :init-data="dialogObj.initData"></point-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import PointAdd from './add'
import utils from 'utils'

export default {
  name: 'memberConfigRule',
  mixins: [mixinTable],
  components: {
    CDialog,
    PointAdd
  },
  data(vm) {
    return {
      pickerOptions: utils.pickerOptions,
      dialogObj: {},
      tableList: [],
      searchObj: {
        appCode: '', // 业务线
        memberTypeId: '', // 会员类型
        isEnable: '', // 状态
        dataTime: ''
      },
      isEnableSelect: [{
        label: '禁用',
        value: 0
      }, {
        label: '启用',
        value: 1
      }],
      tableInnerBtns: [
        {
          width: 100,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              id,
              appCode, // 业务线
              memberTypeName, // 会员名称
              memberTypeId, // 会员类型
              isEnable, // 状态
              pointGift, // 会员开通送积分
              days, // 会员有效天数
              currentPrice, // 当前开通价
              formerPrice, // 原开通价
              title, // 标题
              sort, // 排序
              description, // 会员说明
              remark // 备注
            } = row
            vm.showDialog({
              title: '编辑规则配置',
              initData: {
                id,
                appCode, // 业务线
                memberTypeName, // 会员名称
                memberTypeId, // 会员类型
                isEnable, // 状态
                pointGift, // 会员开通送积分
                days, // 会员有效天数
                currentPrice, // 当前开通价
                formerPrice, // 原开通价
                title, // 标题
                sort, // 排序
                description, // 会员说明
                remark // 备注
              },
              isEdit: true
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '业务线',
          prop: 'appCode',
          fixed: true
        },
        {
          label: '会员类型',
          prop: 'memberTypeId'
        },
        {
          label: '会员类型名称',
          prop: 'memberTypeName'
        },
        {
          label: '状态',
          prop: 'isEnable'
        },
        {
          label: '标题信息',
          prop: 'title'
        },
        {
          label: '消费金额兑换积分比率',
          prop: 'pointRatio'
        },
        {
          label: '会员开通送积分(分)',
          prop: 'pointGift'
        },
        {
          label: '会员有效天数(天)',
          prop: 'days'
        },
        {
          label: '当前开通价(元)',
          prop: 'currentPrice'
        },
        {
          label: '原开通价(元)',
          prop: 'formerPrice'
        },
        {
          label: '排序',
          prop: 'sort'
        },
        {
          label: '会员说明',
          prop: 'description'
        },
        {
          label: '创建时间',
          prop: 'created'
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
        .getMemberRule({
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
    addHandle(formModel) {
      this.$api.member.addMemberRule(formModel).then(res => {
        this.$msgTip('添加成功')
        this.fetchData()
      })
      this.dialogObj.isShow = false
    },
    editHandle(childData) {
      this.$api.member.updateMemberRule(childData).then(res => {
        this.$msgTip('修改成功')
        this.fetchData()
      })
      this.dialogObj.isShow = false
    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增规则配置',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    }
  }
}
</script>

<style lang='less' scoped>
</style>
