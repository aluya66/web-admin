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
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <point-add
          ref="childRef"
          :is-edit="dialogObj.isEdit"
          :init-data="dialogObj.initData"
          :memberTypeList="memberTypeList"
          :businessList="businessList"
        ></point-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import PointAdd from './add'
import dictObj from '@/store/dictData'

export default {
  name: 'memberConfigRule',
  mixins: [mixinTable],
  components: {
    CDialog,
    PointAdd
  },
  data(vm) {
    return {
      dialogObj: {},
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
              pointRatio, // 积分兑换比率
              pointGift, // 会员开通送积分
              val, // 会员有效天数
              unit, // 有效期单位
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
                pointRatio, // 积分兑换比率
                pointGift, // 会员开通送积分
                val, // 会员有效天数
                unit, // 有效期单位
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
          fixed: true,
          formatter(row) {
            const curVal = row.appCode && dictObj.lobList.find(res => row.appCode === res.value)
            return curVal ? curVal.label : ''
          },
          search: {
            type: 'dict',
            optionsList: dictObj.lobList
          }
        },
        {
          label: '会员类型',
          prop: 'memberTypeName',
          search: {
            prop: 'memberTypeId',
            type: 'dict',
            optionsList: []
          }
        },
        {
          label: '标题信息',
          prop: 'title'
        },
        {
          label: '积分兑换比率',
          prop: 'pointRatio'
        },
        {
          label: '会员开通送积分(分)',
          prop: 'pointGift'
        },
        {
          label: '会员有效时间',
          prop: 'days',
          formatter(row) {
            return row && `${row.val} ${row.unit === 1 ? '年' : row.unit === 2 ? '月' : '天'}`
          }
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
          label: '会员说明',
          prop: 'description'
        },
        {
          label: '状态',
          prop: 'isEnable',
          formatter(row) {
            const curVal = row.isEnable && dictObj.disStatus.find(res => row.isEnable === res.value)
            return curVal ? curVal.label : ''
          },
          search: {
            type: 'dict',
            optionsList: dictObj.disStatus
          }
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100,
          search: {
            type: 'dateTime',
            prop: 'dateTime'
          }
        }
      ],
      memberTypeList: [], // 会员类型
      businessList: [] // 业务线
    }
  },
  created() {
    this.fetchData()
    this.getMemberTypeList()
  },
  methods: {
    getMemberTypeList() {
      this.$api.member.getMemberListType().then(res => {
        if (res) {
          this.memberTypeList = res.map((item) => { return { value: item.id, label: item.name } }) || []
        }
        this.setSearchOptionsList('memberTypeId', this.memberTypeList)
      })
    },
    fetchData() {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.member.getMemberRule({
        ...searchDate,
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
        this.dialogObj.isShow = false
      })
    },
    editHandle(childData) {
      this.$api.member.updateMemberRule(childData).then(res => {
        this.$msgTip('修改成功')
        this.fetchData()
        this.dialogObj.isShow = false
      })
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
