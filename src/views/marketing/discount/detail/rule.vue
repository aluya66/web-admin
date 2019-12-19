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
        <el-select :size="size" v-model="formModel.shopType" class="select-item" disabled>
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
        <div class="selected-box">
          <c-table
            expand
            noPage
            hasBorder
            :max-height="400"
            size="medium"
            :loading="isLoading"
            :table-header="tableHeader"
            :table-list="formModel.selectedGoodsList"
            :table-inner-btns="selectedTableInnerBtns"
          >
            <template v-slot:expand="{props}">
              <c-table
                hasBorder
                noPage
                :max-height="400"
                size="medium"
                :loading="isLoading"
                :table-header="skuTableHeader"
                :table-list="props.skuList"
                :table-inner-btns="selectedSkuTableInnerBtns"
              ></c-table>
            </template>
          </c-table>
        </div>
      </el-form-item>
      <el-form-item label="选择用户类型">
        <el-checkbox-group v-model="formModel.memberType">
          <el-checkbox
            class="checkbox-item"
            :label="item.id"
            :checked="item.checked"
            v-for="(item, index) in memberTypeList"
            :key="index"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="指定用户:">
        <el-button size="medium" @click="showDialog('customer', '选择用户')">选择用户</el-button>
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
import CCard from 'components/card'
import utils from 'utils'
// import dictObj from '@/store/dictData'

export default {
  mixins: [MixinForm, mixinTable, MixinFormCard],
  data(vm) {
    return {
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
          label: '商品名称',
          prop: 'goodsName'
        },
        {
          label: '图片',
          prop: 'coverImg',
          width: 100,
          isImage: true
        },
        {
          label: '款号',
          prop: 'goodsBn'
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
        value: 1
      }, {
        label: '直营店',
        value: 2
      }, {
        label: '加盟店',
        value: 3
      }],
      memberTypeList: [ // 1 全部用户 2 全部会员 4 会员等级 8 非会员 16指定用户
        {
          label: '全部用户',
          type: 1,
          id: 'allCustomer'
        },
        {
          label: '全部会员',
          type: 2,
          id: 'allMember'
        },
        {
          label: '非会员',
          type: 8,
          id: 'notMember'
        }
      ],
      categoryList: [],
      brandList: [],
      shopList: [],
      skuArr: []
    }
  },
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    isView: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  beforeMount() {
    utils.Event.$on('updateGoodsList', (val) => {
      Object.assign(this.formModel, { selectedGoodsList: val })
    })
    utils.Event.$on('updateCustomerList', (val) => {
      Object.assign(this.formModel, { selectedCustomerList: val })
    })

    if (this.formModel.platformList) {
      this.getShopList(this.formModel.platformList)
    }
    this.getCategoryList()
    this.getbrandList()
    this.getMemberType()
  },
  methods: {
    // 拼接会员等级到会员分类列表 类型有 1 全部用户 2 全部会员 4 会员等级 8 非会员 16指定用户
    // 类型4为接口请求获得， 16为指定用户选中后保存时候添加
    getMemberType() {
      this.$api.member.getMemberListType().then(res => {
        const membertTypeArr = res && res.map(val => ({ label: val.name, id: val.id, type: 4 }))
        this.memberTypeList = this.memberTypeList.concat(membertTypeArr)
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
      this.$api.basic.brandList({
        pageNo: 1,
        pageSize: 100,
        status: 1
      }).then(res => {
        const { data, totalCount } = res
        if (totalCount) {
          this.brandList = data
        }
      })
    }
  },
  components: {
    CCard
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
}
</style>
