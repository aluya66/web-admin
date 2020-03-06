<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="120px"
      class="detail-form"
      label-position="right"
      status-icon
    >
      <el-form-item label="主渠道:">{{formModel.baseChannelName}}</el-form-item>
      <el-form-item label="子渠道:">{{formModel.channelName}}</el-form-item>
      <el-form-item label="销售定价:">
        <query-dict
          showType="checkbox"
          :dict-list="salePriceList"
          :value.sync="formModel.saleChecked"
          @ChangeQueryDict="addSalePriceList"
        ></query-dict>
        <span class="input-info">勾选后，将同步此类型价格到所关联的渠道端</span>
      </el-form-item>
      <el-form-item label="采购定价:">
        <query-dict
          :dict-list="purchasePriceList"
          showType="checkbox"
          :value.sync="formModel.purchaseChecked"
          @ChangeQueryDict="addPurchasePriceList"
        ></query-dict>
        <span class="input-info">勾选后，将同步此类型价格到所关联的渠道端</span>
      </el-form-item>
      <el-form-item label="查看平台价格:">
        <query-dict
          showType="checkbox"
          :dict-list="viewPriceList"
          :value.sync="formModel.viewChecked"
        ></query-dict>
        <span class="input-info">勾选后，此渠道可以查看平台价格</span>
      </el-form-item>
      <el-form-item label="设置价格折扣率:">
        <span class="input-info">折扣率按照当前价格类型最低价设置，渠道端销售或进货不得低于此价格</span>
        <c-table
          ref="cTable"
          hasBorder
          noPage
          :loading="false"
          :size="size"
          :table-header="tableHeader"
          :table-list="tableList"
          :table-inner-btns="tableInnerBtns"
        ></c-table>
      </el-form-item>
      <el-form-item>
        <el-button
          :size="size"
          :loading="btnLoading"
          type="primary"
          :disabled="!tableList.length"
          @click.native.prevent="submitHandle"
        >保存</el-button>
        <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
      </el-form-item>
    </el-form>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogHandle"
      >
        <price-add
          ref="childRef"
          :init-data="dialogObj.initData"
          :is-edit="dialogObj.isEdit"
          :price-list="viewPriceList"
          :member-price-list="memberPriceList"
          :member-total="memberList"
          :app-type="appType"
        ></price-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import MixinForm from 'mixins/form'
import CDialog from 'components/dialog'
import PriceAdd from './edit'

export default {
  name: 'channelPrice',
  mixins: [mixinTable, MixinForm],
  data(vm) {
    return {
      btnLoading: false,
      dialogObj: {},
      appType: '', // 当前应用类型
      curType: '', // 定价类型
      tableIndex: '', // 列表编辑时下标
      salePriceList: [], // 销售定价
      purchasePriceList: [], // 采购定价
      viewPriceList: [], // 查看平台价格
      tableList: [], // 表格数据
      viewCheckList: [], // 查看平台价格选中项
      memberPriceList: [], // 条件等级需要排除会员类型
      memberList: [], // 条件等级
      formModel: {
        saleChecked: [], // 销售定价
        purchaseChecked: [], // 采购定价
        viewChecked: [], // 选中的查看平台
        channelName: '', // 子渠道名称
        baseChannelName: '' // 主渠道名称
      },
      tableInnerBtns: [{
        width: 220,
        name: '添加一组',
        icon: 'el-icon-plus',
        notBtn: row => row.priceId !== 7, // 会员价才能新增
        handle(row, index) {
          const { id, status, customLevel, discountRate, isDelete, ...other } = row
          vm.showDialog({
            initData: Object.assign({}, other, { customLevel: '', discountRate: '' }),
            index
          })
        }
      }, {
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row, index) {
          vm.tableIndex = index
          vm.showDialog({
            title: '编辑价格',
            type: 'editPrice',
            initData: Object.assign({}, row),
            isEdit: true
          })
        }
      }, {
        name: '删除',
        icon: 'el-icon-delete',
        handle(row, index) {
          vm.tableList.splice(index, 1)
          if (row.priceId === 7) {
            vm.memberPriceList = vm.memberPriceList.filter(val => val !== row.customLevel)
          }
          if (row.priceId === 4) { // 当为采购价时
            vm.formModel.purchaseChecked = []
          } else {
            if (row.priceId === 7) { // 当为会员价时
              const memberItem = vm.tableList.find(res => res.priceId === 7)
              if (!memberItem) { // 匹配不到会员价时去掉会员价按钮
                vm.formModel.saleChecked = vm.formModel.saleChecked.filter(val => val !== row.priceId)
              }
            } else {
              vm.formModel.saleChecked = vm.formModel.saleChecked.filter(val => val !== row.priceId)
            }
          }
        }
      }],
      tableHeader: [
        {
          label: '渠道价格名称',
          prop: 'priceName'
        },
        {
          label: '价格类型',
          prop: 'appliedType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.appliedType, 'channelAppliedType')
          }
        },
        {
          label: '取价基础',
          prop: 'basePriceId',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.basePriceId, vm.viewPriceList)
          }
        },
        {
          label: '折扣率',
          prop: 'discountRate',
          formatter(row) {
            return row && row.discountRate ? `${row.discountRate} %` : ''
          }
        },
        {
          label: '条件等级',
          prop: 'customLevel',
          formatter(row) {
            if(row && row.priceId === 7 && row.customLevel !== ''){
              if(row.customLevel==='ysgo_1'){
                return '星go会员'
              }else if(row.customLevel==='ysdp_1'){
                return 'IPX会员'
              }
              return vm.setTableColumnLabel(row.customLevel, vm.memberList)
            }else {
              return ''
            }
          }
        },
        {
          label: '是否同步渠道',
          prop: 'syncChannelStatus',
          formatter(row) {
            return row && row.syncChannelStatus === 1 ? '已同步' : '不同步'
          }
        }
      ]
    }
  },

  created() {
    this.getChannelPrice()
  },

  methods: {
    /**
     * 渠道可用于定价的格类型数据
     */
    getChannelPrice() {
      this.$api.settings.queryChannelPriceList({
        pageNo: 1,
        pageSize: 20,
        status: 1
      }).then(res => {
        this.getPriceDetail()
        const { data } = res
        if (data) {
          let salePriceList = []
          let purchasePriceList = []
          let viewPriceList = []
          data.forEach(res => {
            const curPrice = { label: res.priceName, value: res.priceId }
            if (res.priceType === 1) {
              res.appliedType === 2 && viewPriceList.push(curPrice)
            } else if (res.priceType === 2) {
              if (res.appliedType === 1) {
                purchasePriceList.push(curPrice)
              } else {
                salePriceList.push(curPrice)
              }
            }
            this.salePriceList = salePriceList
            this.purchasePriceList = purchasePriceList
            this.viewPriceList = viewPriceList
          })
        }
      })
    },
    /**
     * 查询初始化渠道已定价的数据
     */
    getPriceDetail() {
      const { id } = this.$route.params
      this.$api.channel.queryChannelPrice({
        channelId: id
      }).then(res => {
        this.setTagsViewTitle()
        const { platPrices, priceRelations, channelName, baseChannelName, appCode } = res

        this.appType = res.appCode
        this.getChannelMemberList(appCode)
        this.tableList = priceRelations || []
        this.viewCheckList = platPrices || []
        this.memberPriceList = []
        const purchaseChecked = []
        const saleChecked = []
        // 选中的查看平台价
        const viewChecked = platPrices ? platPrices.map(val => val.platPriceId) : []
        this.tableList = priceRelations ? priceRelations.map(val => {
          if (val.priceId === 7) { // 会员价时
            this.memberPriceList.push(val.appCode + '_' + val.customLevel)
          }
          if (val.priceType === 2) {
            if (val.appliedType === 1) {
              // 选中销售定价
              purchaseChecked.push(val.priceId)
            } else {
              // 选中采购定价
              saleChecked.push(val.priceId)
            }
          }
          const { customLevel, appCode, ...other } = val
          if (val.customLevel !== '' && val.priceId === 7) { // 会员价
            return { ...other, appCode, customLevel: appCode + '_' + customLevel }
          }
          return val
        }) : []
        this.formModel = {
          purchaseChecked,
          viewChecked,
          saleChecked,
          channelName,
          baseChannelName
        }
      })
    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增会员价格',
        type: opts.type || 'addPrice',
        initData: opts.initData,
        isEdit: opts.isEdit || false,
        curIndex: opts.index
      }
    },
    /**
     * 保存提交
     */
    submitHandle() {
      const { id } = this.$route.params
      let errFlag = false
      const channelPriceRelVos = this.tableList.map(res => {
        const { customLevel, ...other } = res
        if (res.priceId === 7) {
          if (res.customLevel === '') {
            errFlag = true
          } else {
            const splitArr = customLevel.split('_')
            return { ...other, appCode: splitArr[0], customLevel: splitArr[1] }
          }
        } else {
          return res
        }
      })
      if (errFlag) {
        return this.$msgTip('会员价的条件等级不能为空', 'warning')
      }
      const params = {
        channelId: id,
        channelPriceRelVos,
        platPriceIds: this.formModel.viewChecked
      }
      this.$api.channel.addChannelPrice(params).then(res => {
        this.$msgTip('保存成功')
        this.closeCurrentTag()
        this.goBack()
      })
    },
    dialogHandle() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        const childFormModel = childRef.formModel
        if (valid) {
          if (this.dialogObj.type === 'addPrice') {
            this.tableList.push(childFormModel)
          } else {
            this.tableList.splice(this.tableIndex, 1, childFormModel)
          }
          this.dialogObj.isShow = false
          // 保存后，将会员的条件进行重置
          if (childFormModel.priceId === 7) { // 会员价时
            const memberPriceList = this.tableList.filter(res => res.customLevel !== '')
            this.memberPriceList = memberPriceList.map(res => res.customLevel)
          }
        }
      })
    },
    /**
     * 点击销售定价和采购定价，生产价格折扣率表的逻辑
     */
    addPriceList(checkItems, status, checkIndex) {
      const { id } = this.$route.params
      let curItem = this.curType === 2 ? this.salePriceList[checkIndex] : this.purchasePriceList[checkIndex]
      if (status) {
        let initData = {
          channelId: id,
          priceId: curItem.value,
          priceName: curItem.label,
          priceType: 2,
          appliedType: this.curType,
          basePriceId: 3,
          basePriceName: '平台零售价',
          discountRate: '',
          customLevel: '',
          syncChannelStatus: 1
        }
        if (curItem.value === 4) {
          initData.appliedType = 1
        }
        this.tableList.push(initData)
      } else {
        let delIndex = 0
        if (curItem) {
          delIndex = this.tableList.findIndex(res => res.priceId === curItem.value)
          if (curItem.value === 7) { // 为会员时，清空排除会员类型
            this.memberPriceList = []
          }
        } else {
          if (this.tableList.length >= 1) { // 当销售定价和采购定价都只有第一个值时
            if (this.curType === 1) { // 采购定价
              delIndex = this.tableList.findIndex(res => this.purchasePriceList[0].value)
            } else {
              delIndex = this.tableList.findIndex(res => this.salePriceList[0].value)
            }
          }
        }
        this.tableList.splice(delIndex, 1)
      }
    },
    addSalePriceList(checkItems, status, checkIndex) {
      this.curType = 2 // 销售定价
      this.addPriceList(checkItems, status, checkIndex)
    },
    addPurchasePriceList(checkItems, status, checkIndex) {
      this.curType = 1 // 采购定价
      this.addPriceList(checkItems, status, checkIndex)
    },
    // 获取条件等级，渠道会员类型
    getChannelMemberList(appCode) {
      if (appCode === 'ysgo' || appCode === 'yssp') {
        const ysgoPromise = this.$api.member.getMemberRule({ pageSize: 20, pageNo: 1, appCode: 'ysgo' })
        const ysspPromise = this.$api.member.getMemberRule({ pageSize: 20, pageNo: 1, appCode: 'yssp' })
        Promise.all([ysgoPromise, ysspPromise]).then(res => {
          if (res && res.length) {
            let curMemberList = []
            res.forEach(val => {
              if (val.data) {
                curMemberList = curMemberList.concat(val.data.map(item => ({ label: item.memberTypeName, value: item.appCode + '_' + item.memberTypeId, appCode: item.appCode })))
              }
            })
            this.memberList = curMemberList
          }
        })
      } else {
        this.$api.member.getMemberRule({
          pageSize: 20,
          pageNo: 1,
          appCode
        }).then(res => {
          const { data } = res
          this.memberList = data ? data.map(val => ({ label: val.memberTypeName, value: val.appCode + '_' + val.memberTypeId, appCode: val.appCode })) : []
        })
      }
    }
  },

  components: {
    CDialog,
    PriceAdd
  }
}
</script>
