<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <!-- <div class="header-btn">
        <el-button
          :size="size"
          type="primary"
          icon="el-icon-plus"
          @click="routerLink('/goods/add')"
        >新增</el-button>
      </div>-->
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
                placeholder="请输入商品名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="商品编码">
              <el-input
                v-model="searchObj.goodsBn"
                class="search-item"
                :size="size"
                placeholder="请输入商品编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="商品类目">
              <el-input
                v-model="searchObj.categoryCode"
                class="search-item"
                :size="size"
                placeholder="请输入商品类目"
                clearable
              />
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
              <el-input
                v-model="searchObj.brandName"
                class="search-item"
                :size="size"
                placeholder="请输入品牌"
                clearable
              />
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
        categoryCode: '',
        goodsBn: '',
        goodsName: '',
        marketable: '',
        brandName: '',
        dataTime: ''
      },
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
        width: 100,
        name: '详情',
        icon: 'el-icon-view',
        handle(row) {
          vm.routerLink(`/goods/detail/${row.id}`)
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
          width: 120,
          fixed: true
        },
        {
          label: '商品编码',
          prop: 'goodsBn'
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
          prop: 'brandName'
        },
        {
          label: '商品类目',
          prop: 'categoryName'
        },
        {
          label: '商品来源',
          prop: 'origin',
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
    this.fetchData()
  },
  methods: {
    /**
     * 获取表格数据
    */
    fetchData() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
      this.isLoading = true
      this.$api.goods.getList(
        {
          ...searchDate,
          ...other,
          ...page
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
