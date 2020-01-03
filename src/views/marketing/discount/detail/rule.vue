<template>
  <c-card :name="title" class="form-card" id="form-apply">
    <el-form
      ref="ruleFormRef"
      :model="formModel"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <el-form-item label="门店:">
        <el-select
          :size="size"
          v-model="formModel.shopType"
          class="select-item"
          @change="changeShopType"
        >
          <el-option
            v-for="(item, index) in shopTypeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="formModel.storeCodes"
          class="select-item"
          :size="size"
          filterable
          multiple
          @change="getbrandList"
        >
          <el-option
            v-for="item in shopList"
            :key="item.shopId"
            :label="item.shopName"
            :value="item.shopId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品品牌:">
        <el-select
          v-model="formModel.marketUseProductRule.useBrandCodes"
          class="select-item"
          :size="size"
          multiple
        >
          <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品类目:">
        <el-cascader
          class="select-item"
          placeholder="搜索商品类目名称"
          :size="size"
          v-model="formModel.marketUseProductRule.useCategoryCodes"
          :options="categoryList"
          filterable
          :props="cascaderProp"
          collapse-tags
        ></el-cascader>
      </el-form-item>
      <el-form-item label="指定商品:">
        <el-button size="small" @click="showDialog('goods', '选择商品')">选择商品</el-button>
        <div class="selected-box" v-show="formModel.selectedGoodsList.length">
          <c-table
            noPage
            hasBorder
            :max-height="400"
            size="medium"
            :loading="isLoading"
            :table-header="tableHeader"
            :table-list="formModel.selectedGoodsList"
            :table-inner-btns="selectedTableInnerBtns"
            :rowStyle="{height:0}"
            :cellStyle="{padding:0}"
          ></c-table>
        </div>
      </el-form-item>
      <el-form-item label="选择用户类型">
        <el-radio-group v-model="formModel.customerType">
          <el-radio
            class="checkbox-item"
            :label="item.type"
            :checked="item.checked"
            v-for="(item, index) in customerTypeList"
            :key="index"
          >{{ item.label }}</el-radio>
        </el-radio-group>
        <el-form-item>
          <el-checkbox-group v-model="formModel.memberType" v-if="formModel.customerType === 4">
            <el-checkbox
              class="checkbox-item"
              :label="item.id"
              :checked="item.checked"
              v-for="(item, index) in memberTypeList"
              :key="index"
            >{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form-item>
      <el-form-item label="指定用户:" v-if="formModel.customerType === 16">
        <el-button size="small" @click="showDialog('customer', '选择用户')">选择用户</el-button>
        <div>
          <el-tag
            class="tag-item"
            v-for="(tag, index) in formModel.selectedCustomerList"
            :key="index"
            closable
            @close="cancelSelect(index)"
          >{{tag.nickname + '【' +tag.phoneNumber + '】'}}</el-tag>
        </div>
      </el-form-item>
    </el-form>
  </c-card>
</template>
<script>
import MixinForm from 'mixins/form'
import MixinFormCard from 'mixins/formCard'
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  mixins: [MixinForm, mixinTable, MixinFormCard],
  data(vm) {
    return {
      memberTypeList: [],
      skuTableHeader: [
        {
          label: '编号',
          prop: 'goodsSkuSn'
        },
        {
          label: '尺码',
          prop: 'attributeSpecValue'
        },
        {
          label: '颜色',
          prop: 'attributeColorValue'
        },
        {
          label: '图片',
          isImage: true,
          width: 100,
          prop: 'imageUrl'
        },
        {
          label: '零售价',
          prop: 'retailPrice'
        },
        {
          label: '会员价',
          prop: 'memberPrice'
        },
        {
          label: '散批价',
          prop: 'wholesalePrice'
        },
        {
          label: '大批价',
          prop: 'largeBatchPrice'
        }
      ],
      selectedSkuTableInnerBtns: [
        {
          width: 150,
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            vm.deleteSelectedItem(row, 'skus')
          }
        }
      ],
      tableHeader: [
        {
          label: '款号',
          prop: 'goodsBn'
        },
        {
          label: '商品名称',
          prop: 'goodsName'
        },
        {
          label: '店铺名称',
          prop: 'shopName'
        },
        {
          label: '规格',
          formatter(row) {
            if (row.isSelected) {
              return '全部'
            } else {
              let list = row.skuList
              let arr = []
              list.length && list.forEach((item) => {
                arr.push(item.attributeColorValue + ' ' + item.attributeSpecValue)
              })
              return arr.length ? arr.join(',') : ''
            }
          }
        },
        {
          label: '图片',
          prop: 'coverImg',
          width: 100,
          isImage: true
        }
      ],
      selectedTableInnerBtns: [
        {
          width: 150,
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            vm.deleteSelectedItem(row, 'goods')
          }
        }
      ],
      brands: [],
      cascaderProp: { multiple: true },
      shopTypeList: [{
        label: '全部',
        value: ''
      }, {
        label: '直营店',
        value: 1
      }, {
        label: '加盟店',
        value: 2
      }],
      customerTypeList: [ // 1 全部用户 2 全部会员 4 会员等级 8 非会员 16指定用户
        {
          label: '全部用户',
          type: 1
        },
        {
          label: '指定会员',
          type: 4
        },
        {
          label: '指定用户',
          type: 16
        },
        {
          label: '非会员',
          type: 8
        }
      ],
      categoryList: [],
      brandList: [],
      shopList: [],
      skuArr: []
    }
  },
  beforeMount() {
    // utils.Event.$on('updateGoodsList', (val) => {
    //   Object.assign(this.formModel, { selectedGoodsList: val })
    // })
    // utils.Event.$on('updateCustomerList', (val) => {
    //   Object.assign(this.formModel, { selectedCustomerList: val })
    // })

    if (this.formModel.platformList) {
      this.getShopList(this.formModel.platformList)
    }
    this.getCategoryList()
    this.getbrandList()
    this.getMemberType()
  },
  methods: {
    changeShopType(val) {
      this.getShopList(this.formModel.platformList)
      this.formModel.storeCodes = []
    },
    // 拼接会员等级到会员分类列表 类型有 1 全部用户 2 全部会员 4 会员等级 8 非会员 16指定用户
    // 类型4为接口请求获得， 16为指定用户选中后保存时候添加
    getMemberType() {
      this.$api.member.getMemberListType().then(res => {
        this.memberTypeList = res && res.map(val => ({ label: val.name, id: val.id, type: 4 }))
      })
    },
    // 删除已选择的列表数据
    deleteSelectedItem(row, type) {
      const goodsBn = row.goodsBn // 商品sku
      const list = this.formModel.selectedGoodsList
      const idx = list.findIndex((item) => item.goodsBn === goodsBn)
      if (type === 'goods') { // 删除商品
        if (idx !== -1) list.splice(idx, 1)
      } else { // 删除sku
        if (idx !== -1) {
          let arr = list[idx].skuList
          const skuIdx = arr.findIndex((item) => item.goodsSkuSn === row.goodsSkuSn)
          if (skuIdx !== -1) {
            arr.splice(skuIdx, 1)
            if (!arr.length) list.splice(idx, 1)
          }
        }
      }
    },
    getShopList(appCode) {
      this.$api.channel.getShopListByChannel({
        appCode,
        shopType: this.formModel.shopType,
        pageNo: 1,
        pageSize: 100
      }).then(res => {
        this.shopList = res || []
      })
    },
    cancelSelect(index) {
      this.formModel.selectedCustomerList.splice(index, 1)
    },
    showDialog(type, title) {
      this.$emit('show-dialog', type, title)
    },
    getCategoryList() {
      this.$api.basic.queryCategoryAll().then(res => {
        this.categoryList = utils.formartLevelData(res)
      })
    },
    getbrandList() {
      // 品牌关联门店
      this.$api.basic.brandList({
        pageNo: 1,
        pageSize: 100,
        shopIds: this.formModel.storeCodes, // 门店id列表
        status: 1
      }).then(res => {
        const { data, totalCount } = res
        if (totalCount) {
          this.brandList = data
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.form {
  .select-item {
    width: 30%;
  }
  .tag-item {
    margin: 5px;
  }
  .selected-box {
    width: 40vw;
  }
}
</style>
