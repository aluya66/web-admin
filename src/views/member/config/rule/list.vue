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
              <query-dict
                :dict-list="businessList"
                class="search-item"
                :size="size"
                placeholder="请选择"
                :value.sync="searchObj.appCode"
              ></query-dict>
            </el-form-item>
            <el-form-item label="会员类型">
              <query-dict
                :dict-list="memberTypeList"
                class="search-item"
                :size="size"
                placeholder="请选择"
                :value.sync="searchObj.memberTypeId"
              ></query-dict>
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
        isEnable: '' // 状态
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
            switch (row.appCode) {
              case 'ysgo':
                return '星GO'
              case 'ysia':
                return '星助手'
              case 'yssp':
                return 'YOSHOP'
              case 'ysdp':
                return '星鲜APP'
            }
          }
        },
        {
          label: '会员类型',
          prop: 'memberTypeName'
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
            return row.isEnable === 1 ? '启用' : '禁用'
          }
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100
        }
      ],
      memberTypeList: [], // 会员类型
      businessList: [] // 业务线
    }
  },
  created() {
    this.fetchData()
    this.getMemberTypeList()
    this.getBaseBusinessList()
  },
  methods: {
    getBaseBusinessList() {
      this.$api.basic.businessList(
        {
          status: 1,
          pageSize: 100
        }
      ).then(res => {
        if (res && res.totalCount) {
          const { data } = res
          this.businessList = data.map((item) => { return { value: item.appCode, label: item.appName } }) || []
        } else {
          this.businessList = res.map((item) => { return { value: item.appCode, label: item.appName } }) || []
        }
      })
    },
    getMemberTypeList() {
      this.$api.member
        .getMemberType({
          isEnable: 1,
          pageSize: 100
        })
        .then(res => {
          if (res && res.totalCount) {
            const { data } = res
            this.memberTypeList = data.map((item) => { return { value: item.id, label: item.name } }) || []
          } else {
            this.memberTypeList = res.map((item) => { return { value: item.id, label: item.name } }) || []
          }
        })
    },
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
