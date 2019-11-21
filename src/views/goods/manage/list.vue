<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button
          :size="size"
          type="primary"
          v-permission="$route.meta.roles"
          icon="el-icon-plus"
          @click="routerLink('/goods/add')"
        >新增</el-button>
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
            <el-form-item label="商品名称">
              <el-input
                v-model="searchObj.goodsName"
                class="search-item"
                :size="size"
                placeholder="商品名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="商品编码">
              <el-input
                v-model="searchObj.goodsBn"
                class="search-item"
                :size="size"
                placeholder="商品编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="商品类目">
              <el-cascader
                clearable
                class="search-item"
                :size="size"
                expandTrigger="hover"
                :show-all-levels="false"
                v-model="searchObj.categoryCode"
                placeholder="商品类目"
                :options="categoryList"
                filterable
              ></el-cascader>
            </el-form-item>
            <!-- <el-form-item label="经营类型">
              <el-input
                v-model="searchObj.businessValue"
                class="search-item"
                :size="size"
                placeholder="请输入操作人"
                clearable
              />
            </el-form-item>-->
            <el-form-item label="品牌">
              <query-dict
                allowCreate
                filterable
                :dict-list="brandList"
                class="search-item"
                :size="size"
                placeholder="请选择"
                :value.sync="searchObj.brandName"
              ></query-dict>
            </el-form-item>
            <el-form-item label="上下架">
              <el-select
                v-model="searchObj.marketable"
                :size="size"
                class="search-item"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in marketableSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品库存">
              <el-input
                v-model.number="searchObj.minStock"
                class="search-number"
                :size="size"
                placeholder="最小值"
                clearable
              />至
              <el-input
                v-model.number="searchObj.maxStock"
                class="search-number"
                :size="size"
                placeholder="最大值"
                clearable
              />
            </el-form-item>
            <el-form-item label="操作时间">
              <el-date-picker
                :size="size"
                v-model="searchObj.dataTime"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始时间"
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
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  name: 'goodsList',
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {
        // businessValue: '',
        categoryCode: '', // 商品类目
        goodsBn: '', // 商品编码
        goodsName: '', // 商品名称
        marketable: '', // 上下架
        brandName: '', // 品牌名称
        dataTime: '', // 操作时间
        minStock: '', // 库存最小值
        maxStock: '' // 库存最大值
      },
      brandList: [], // 品牌数据集合
      categoryList: [], // 商品类目集合
      marketableSelect: [{
        value: '1',
        label: '上架'
      },
      {
        value: '2',
        label: '下架'
      }],
      originList: [{
        label: '门店挂板',
        value: 1
      }, {
        label: '代销商品',
        value: 2
      }, {
        label: '自营商品',
        value: 3
      }],
      pickerOptions: utils.pickerOptions,
      tableInnerBtns: [{
        width: 150,
        name: '详情',
        icon: 'el-icon-view',
        handle(row) {
          vm.routerLink(`/goods/manage/detail/${row.id}`)
        }
      },
      {
        name: '关联属性',
        icon: 'el-icon-plus',
        handle(row) {
          vm.routerLink(`/goods/manage/label/${row.id}`)
        }
      }
        // {
        //   name: '删除',
        //   icon: 'el-icon-delete',
        //   handle(row) {
        //     const { goodsName, id } = row
        //     vm.confirmTip(`确认删除${goodsName}商品信息`, () => {
        //       vm.deleteData({ id })
        //     })
        //   }
        // }
      ],
      tableHeader: [
        {
          label: '商品ID',
          prop: 'id',
          fixed: true
        },
        {
          label: '商品编码',
          prop: 'goodsBn',
          width: 180
        },
        {
          label: '商品名称',
          prop: 'goodsName',
          width: 200
        },
        {
          label: '商品图片',
          prop: 'coverImg',
          width: 100,
          isImage: true
        },
        {
          label: '品牌',
          prop: 'brandName',
          width: 150
        },
        {
          label: '商品类目',
          prop: 'categoryName',
          width: 150
        },
        {
          label: '商品来源',
          prop: 'origin',
          width: 120,
          formatter(row) {
            return row.origin ? vm.originList[row.origin - 1].label : ''
          }
        },
        {
          label: '样衣成本价(元)',
          prop: 'sampleCostPrice',
          width: 115
        },
        {
          label: '成衣成本价(元)',
          prop: 'costPrice',
          width: 115
        },
        {
          label: '成衣供货价(元)',
          prop: 'supplyPrice',
          width: 115
        },
        {
          label: '成衣散批价(元)',
          prop: 'wholesalePrice',
          width: 115
        },
        {
          label: '成衣大批价(元)',
          prop: 'largeBatchPrice',
          width: 115
        },
        {
          label: '成衣会员价(元)',
          prop: 'memberPrice',
          width: 115
        },
        {
          label: '零售价(元)',
          prop: 'retailPrice',
          width: 90
        },
        {
          label: '成衣库存(件)',
          prop: 'stock',
          width: 100
        },
        {
          label: '上架状态',
          prop: 'marketable',
          width: 100,
          formatter(row) {
            return row.marketable ? vm.marketableSelect[row.marketable - 1].label : ''
          }
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100
        },
        {
          label: '更新时间',
          prop: 'updated',
          width: 100
        }
      ]
    }
  },
  created() {
    this.getCategoryList()
    this.getBrandList()
    this.fetchData()
  },
  methods: {
    /**
     * 获取表格数据
     */
    fetchData() {
      const { dataTime, minStock, maxStock, categoryCode, ...other } = this.searchObj
      const curCategoryCode = categoryCode && categoryCode[categoryCode.length - 1]
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
      if (utils.isInteger(minStock) || utils.isInteger(maxStock)) {
        return this.$msgTip('商品库存请输入正整数', 'warning')
      }
      if (minStock > maxStock) {
        return this.$msgTip('库存最小值不能大于最大值', 'warning')
      }
      this.isLoading = true
      this.$api.goods.getList(
        {
          ...searchDate,
          ...other,
          ...page,
          minStock,
          maxStock,
          categoryCode: curCategoryCode
        }
      ).then(res => {
        this.isLoading = false
        if (res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data
        } else {
          this.tableList = res
        }
      })
    },
    // 获取商品类目集合
    getCategoryList() {
      this.$api.basic.queryCategory().then(res => {
        this.categoryList = utils.formartLevelData(res || [])
      })
    },
    // 获取品牌列表
    getBrandList() {
      this.$api.basic.brandList({
        pageNo: 1,
        pageSize: 100,
        status: 1
      }).then(res => {
        if (res && res.totalCount) {
          this.brandList = res.data.map(res => ({ value: res.name, label: res.name })) || []
        }
      })
    },
    /**
     * 删除表格单条数据
     *
     * @param {*} curPromise
     * @param {string} [msgTip='删除成功']
     */
    deleteData(param, msgTip = '删除成功') {
      this.$api.basic.deleteBrand(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    }
  }
}
</script>
