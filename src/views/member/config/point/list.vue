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
        noPage
        selection
        hasBorder
        :max-height="730"
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
            <el-form-item label="积分名称">
              <el-input
                v-model="searchObj.pointName"
                class="search-item"
                :size="size"
                placeholder="积分名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="searchObj.type" class="search-item" :size="size" clearable>
                <el-option
                  v-for="item in typeNameSelect"
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
  name: 'memberConfigPoint',
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
        pointName: '', // 积分名称
        type: '' // 类型
      },
      typeNameSelect: [{
        label: '永久',
        value: 1
      }, {
        label: '有效天数',
        value: 2
      }],
      tableInnerBtns: [
        {
          width: 100,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              id,
              pointName, // 积分名称
              pointRatio, // 积分获取
              moneyRatio, // 积分汇率
              type, // 积分有效期1 永久   2 有效天数
              days, // type 为2是必填。有效天数
              appCode // 业务线
            } = row
            vm.showDialog({
              title: '编辑积分配置',
              initData: {
                id,
                pointName, // 积分名称
                pointRatio, // 积分获取
                moneyRatio, // 积分汇率
                type, // 积分有效期1 永久   2 有效天数
                days, // type 为2是必填。有效天数
                appCode // 业务线
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
          label: '积分名称',
          prop: 'pointName'
        },
        {
          label: '积分获取',
          prop: 'pointRatio'
        },
        {
          label: '积分汇率',
          prop: 'moneyRatio'
        },
        {
          label: '类型',
          prop: 'type',
          formatter(row) {
            return row.type === 1 ? '永久' : '有效天数'
          }
        },
        {
          label: '有效时间(天)',
          prop: 'days'
        },
        {
          label: '创建时间',
          prop: 'created'
        }
      ],
      businessList: [] // 业务线
    }
  },
  created() {
    this.fetchData()
    this.getBaseBusinessList()
  },
  methods: {
    getBaseBusinessList() {
      this.$api.basic.businessList(
        {
          status: 1,
          pageNo: 1,
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
    fetchData() {
      this.isLoading = true
      this.$api.member.getPointRule({
        ...this.searchObj
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          this.tableList = res.data || []
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
      this.$api.member.addPointRule(formModel).then(res => {
        this.responeHandle('修改成功')
      })
    },
    editHandle(childData) {
      this.$api.member.updatePointRule(childData).then(res => {
        this.responeHandle('修改成功')
      })
    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增积分配置',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    }
  }
}
</script>
