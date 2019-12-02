<template>
  <c-view>
    <template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
       <div class="header-btn">
         <div class="header-btn">
          <el-button
            :size="size"
            type="primary"
            icon="el-icon-plus"
            @click="addRule"
          >新增</el-button>
        </div>
      </div>
		</template>
    <div class="main__box">
      <c-table
        selection
        hasBorder
        :size="size"
        :max-height="730"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
      </c-table>
    </div>

    <!-- 渠道规则新增、编辑弹窗 -->
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="submitHandle"
      >
        <el-form
          ref="formRef"
          :model="formModel"
          label-width="120px"
          class="form"
          label-position="right"
        >
          <el-form-item
            label="规则名称:" prop="ruleName"
            :rules="[{ required: true, message: '规则名称不能为空'}]"
          >
            <el-input v-model.trim="formModel.ruleName" class="form-item" placeholder='请输入规则名称'/>
          </el-form-item>
          <el-form-item label="商品品牌:" props="brands" required>
            <el-select
              v-model="formModel.brands"
              class="select-item"
              filterable remote multiple value-key="id"
              :remote-method="searchBrand">
              <el-option
                v-for="item in brandList"
                :key="item.code"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-select>
            <c-table
              v-show="formModel.brands && formModel.brands.length"
              hasBorder
              :size="size"
              :max-height="730"
              :loading="isLoading"
              :noPage=true
              :table-header="brandTableHeader"
              :table-list="formModel.brands"
              :table-inner-btns="brandTableInnerBtns"
            >
            </c-table>
            <!-- <el-button class="add-brand-btn" @click="addBrand">添加</el-button> -->
          </el-form-item>
          <el-form-item label="价格设置:">
            <el-checkbox-group v-model="priceSettingList">
              <el-checkbox v-for="(item, index) in priceSettingList" :key="index" :label="item" disabled>{{ item }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="库存设置:" prop="store">
            <el-checkbox checked disabled>默认全部</el-checkbox>
          </el-form-item>
          <el-form-item label="支付方式:" prop="payment">
             <el-radio-group v-model="formModel.payment">
              <el-radio v-for="(item, index) in payTypeList" :key="index" :label="item.value" disabled>{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
export default {
  name: 'channelRule',
  mixins: [mixinTable],
  components: {
    CDialog
  },
  data(vm) {
    return {
      brandList: [], // 品牌列表
      formModel: {
        type: []
      },
      priceSettingList: ['成衣成本价', '成衣供货价', '成衣批发价', '成衣散批价', '成衣会员价', '零售价'], // 价格设置列表
      payTypeList: [{ // 支付类型
        name: '支付宝',
        value: 1
      }, {
        name: '微信',
        value: 2
      }],
      dialogObj: {
        isShow: false,
        title: '新增渠道规则'
      },
      tableInnerBtns: [{
        width: 150,
        prop: {
          name: 'status', // 为0或1
          toggle: [{
            icon: 'el-icon-close',
            title: '关闭'
          }, {
            icon: 'el-icon-open',
            title: '开启'
          }]
        },
        handle (row) {
          const { ruleId, ruleName, status } = row
          const handleStatus = status === 1 ? 0 : 1 // 0关闭、1开启
          vm.confirmTip(
            `是否${handleStatus === 0 ? '关闭' : '开启'} ${ruleName} 渠道规则`,
            () => {
              vm.handleRuleStatus({ id: ruleId, status: handleStatus })
            }
          )
        }
      }, {
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          const { ruleId } = row
          vm.getRuleDetails(ruleId)
        }
      }, {
        name: '删除',
        icon: 'el-icon-detail',
        handle (row) {
          const { ruleId, ruleName } = row
          vm.confirmTip(`是否删除 ${ruleName} 渠道规则`, () => {
            vm.deleteRule({ id: ruleId })
          })
        }
      }],
      brandTableInnerBtns: [{
        name: '删除',
        icon: 'el-icon-detail',
        handle ({ id }) {
          vm.deleteBrand(id)
        }
      }],
      brandTableHeader: [{
        label: '品牌ID',
        prop: 'id'
      }, {
        label: '品牌名称',
        prop: 'name'
      }],
      tableHeader: [{
        label: '规则名称',
        prop: 'ruleName'
      }, {
        label: '渠道状态',
        prop: 'status',
        formatter(row) {
          return row.status === 0 ? '关闭' : '开启'
        }
      }, {
        label: '创建人',
        prop: 'createBy'
      }, {
        label: '创建时间',
        prop: 'created'
      }, {
        label: '更新人',
        prop: 'updateBy'
      }, {
        label: '更新时间',
        prop: 'updated'
      }]
    }
  },
  created() {
    this.fetchData()
    this.searchBrand('')
  },
  methods: {
    getRuleDetails(id) {
      this.$api.channel.getRuleInfo({ id }).then((res) => {
        const { 
          ruleCode, 
          ruleName, 
          ruleBrandResps
        } = res
        let brands = ruleBrandResps.length ? 
          ruleBrandResps.map((item) => {
            return {
              name: item.brandName,
              code: item.brandCode,
              id: item.id
            }
          }) : []
        this.formModel = {
          ruleCode,
          ruleName,
          brands,
          payment: 2, // 支付方式：1-支付宝,2-微信,4-银行卡
          costPrice: 1, // 成衣成本价
          largeBatchPrice: 1, // 成衣大批价
          memberPrice: 1, // 会员价
          retailPrice: 1, // 零售价
          supplyPrice: 1, // 成衣供货价
          wholesalePrice: 1, // 成衣散批价
          store: 0 // 库存设置:0-默认全部，其他待定
        }
        this.dialogObj.isShow = true
      })
    },
    deleteBrand(id) {
      let idx = this.formModel.brands.findIndex((item) => item.id === id)
      if (idx !== -1) this.formModel.brands.splice(idx, 1)
    },
    // 品牌搜索
    searchBrand(query) {
      this.$api.channel.searchBrandAjax({ key: query, pageSize: 100 }).then(({ data }) => {
        this.brandList = data
      })
    },
    // 提交渠道规则
    submitHandle() {
      this.$refs.formRef.validate(valid => {
        console.log(this.formModel)
        if (valid) {
          if (!this.formModel.brands.length) return this.$message.info('请添加品牌')
          const requestType = this.formModel.ruleCode ? 'edit' : 'add' // 接口请求类型， add新增、edit编辑
          this.handleRule(requestType)
        }
      })
    },
    handleRule(requestType) {
      const requestObj = {
        add: this.$api.channel.addRule,
        edit: this.$api.channel.editRule
      }
      const request = requestObj[requestType]
      let params = JSON.parse(JSON.stringify(this.formModel))
      params.brands = params.brands.map((item) => {
        return {
          brandCode: item.code,
          brandName: item.name,
          ruleCode: this.formModel.ruleCode  
        }
      })
      console.log(params)
      request({ ...params }).then(() => {
        const msg = requestType === 'edit' ? '编辑成功' : '新增成功'
        this.$msgTip(msg)
        this.fetchData()
        this.channelDialogObj.isShow = false
      })
    },
    // 新增渠道规则
    addRule() {
      this.formModel = {
        brands: [],
        payment: 2, // 支付方式：1-支付宝,2-微信,4-银行卡
        costPrice: 1, // 成衣成本价
        largeBatchPrice: 1, // 成衣大批价
        memberPrice: 1, // 会员价
        retailPrice: 1, // 零售价
        supplyPrice: 1, // 成衣供货价
        wholesalePrice: 1, // 成衣散批价
        store: 0 // 库存设置:0-默认全部，其他待定
      }
      this.dialogObj.isShow = true
    },
    // 删除渠道
    deleteRule(params, msgTip = '删除成功') {
      this.$api.channel.deleteRule(params).then(() => {
        this.$msgTip(msgTip)
        this.fetchData()
      })
    },
    // 开启、关闭渠道规则
    handleRuleStatus({ id, status }) {
      this.$api.channel.handleRuleStatus({ id, status }).then(() => {
        const msg = status === 0 ? '已关闭' : '已开启'
        this.$msgTip(msg)
        this.fetchData()
      })
    },
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.channel
        .getChannelRule({
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
    }
  }
}
</script>

<style lang='less' scoped>
  .add-brand-btn {
    margin-left: 15px;
  }
</style>
