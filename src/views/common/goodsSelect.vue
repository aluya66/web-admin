<template>
  <div class="goods-select">
    <div class="header">
      <div class="title title-left">商品列表</div>
      <div class="title title-right">已选商品:【 {{checkedAttr.length}} 】</div>
    </div>
    <div class="content">
      <div class="source">
        <c-table
          ref="goodsTableRef"
          :selection="!disabled"
          :expand="expand"
          hasBorder
          :max-height="400"
          :size="size"
          :loading="isLoading"
          :table-header="tableHeader"
          :table-list="tableList"
          :page-info="pageInfo"
          :table-inner-btns="tableInnerBtns"
          :rowStyle="{height:0}"
          :cellStyle="{padding:0}"
          @change-pagination="changePagination"
          @handle-select="handleSelect"
        >
          <template v-slot:header>
            <c-search
              :form-model="searchObj"
              :form-items="searchItems"
              @submit-form="searchSubmit"
              @reset-form="searchReset"
            ></c-search>
          </template>
          <template v-slot:expand="{props}">
            <c-table
              class="sku-table"
              :ref="'skuRef' + props.goodsBn + props.shopId"
              hasBorder
              :selection="!disabled"
              noPage
              :max-height="400"
              :size="size"
              :loading="isLoading"
              :table-header="skuTableHeader"
              :table-list="props.skus"
              :rowStyle="{height:0}"
              :cellStyle="{padding:0}"
              :headerCellStyle="{height:0,padding:0}"
              @selection-handle="handleSkuList"
            ></c-table>
          </template>
        </c-table>
      </div>
      <div class="dist">
        <div class="selected-box">
          <c-table
            noPage
            hasBorder
            :max-height="600"
            :size="size"
            :loading="isSelectedLoading"
            :table-header="tableHeader"
            :table-list="checkedAttr"
            :table-inner-btns="selectedTableInnerBtns"
          >
            <!-- <template v-slot:expand="{props}">
              <c-table
                hasBorder
                noPage
                :max-height="400"
                :size="size"
                :loading="isLoading"
                :table-header="skuTableHeader"
                :table-list="props.skuList"
                :table-inner-btns="selectedSkuTableInnerBtns"
              ></c-table>
            </template>-->
          </c-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mixinTable from 'mixins/table'
import utils from 'utils'
export default {
  name: 'goodsSelect',
  mixins: [mixinTable],
  props: {
    disabled: Boolean,
    expand: { // 是否有展开行
      type: Boolean,
      default: false
    },
    paramsObj: { // 额外参数集
      type: Object,
      default() {
        return {}
      }
    },
    initChecked: {
      // 编辑初始化goods选中值
      type: Array,
      default() {
        return []
      }
    }
  },
  data(vm) {
    return {
      finishChangePage: false, // 是否进行了翻页操作， 处理数据缓存合并
      isPageChange: false, // 是否翻页
      isSelectedLoading: false,
      dialogObj: {},
      selectedTableInnerBtns: [
        {
          width: 80,
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            vm.deleteSelectedItem(row, 'goods')
          }
        }
      ],
      selectedSkuTableInnerBtns: [
        // {
        //   width: 150,
        //   name: '删除',
        //   icon: 'el-icon-delete',
        //   handle(row) {
        //     vm.deleteSelectedItem(row, 'skus')
        //   }
        // }
      ],
      tableInnerBtns: [
        // {
        //   width: 150,
        //   name: 'sku',
        //   icon: 'el-icon-add',
        //   handle(row) {
        //     vm.$emit('Handle-Sku', row)
        //   }
        // }
      ],
      skuTableHeader: [
        {
          label: 'sku编码',
          prop: 'goodsSkuSn'
        },
        {
          label: '规格',
          formatter(row) {
            return row.attributeColorValue + ' ' + row.attributeSpecValue
          }
        },
        {
          label: '零售价',
          prop: 'retailPrice'
        }
      ],
      tableHeader: [
        {
          label: '款号',
          prop: 'goodsBn',
          search: {
            type: 'input'
          }
        },
        {
          label: '商品名称',
          prop: 'goodsName',
          search: {
            type: 'input'
          }
        },
        {
          label: '店铺名称',
          prop: 'shopName'
        },
        {
          label: '图片',
          prop: 'coverImg',
          width: 100,
          isImage: true
        }
      ],
      brandList: [],
      searchObj: {},
      checkedAttr: [] // 选中的值
    }
  },
  watch: {
    paramsObj(nval, oval) {
      if (oval === nval) return
      this.fetchData()
    }
  },
  methods: {
    changePagination(pageInfo) {
      this.pageInfo.pageNo = pageInfo.page
      this.pageInfo.pageSize = pageInfo.limit
      this.fetchData()
      if (utils.getStore('cacheSelectedGoodsList')) {
        this.checkedAttr = utils.getStore('cacheSelectedGoodsList') // 翻页获取缓存已选择数据
      }
      this.finishChangePage = true
    },
    // 删除已选择的列表数据
    deleteSelectedItem(row, type) {
      if (this.disabled) return this.$msgTip('无法进行此操作', 'warning')
      const goodsBn = row.goodsBn // 商品goodsBn
      const shopId = row.shopId // 商品shopId
      const idx = this.checkedAttr.findIndex((item) => item.goodsBn === goodsBn && item.shopId === shopId)
      const tableIdx = this.tableList.findIndex((item) => item.goodsBn === goodsBn && item.shopId === shopId)
      const targetRef = `skuRef${goodsBn}${shopId}` // 子table
      if (type === 'goods') { // 删除商品
        tableIdx !== -1 && this.$refs.goodsTableRef.$refs.multipleTable.toggleRowSelection(this.tableList[tableIdx], false)
        idx !== -1 && this.checkedAttr.splice(idx, 1)
        this.$refs[targetRef] && this.$refs[targetRef].$refs.multipleTable.clearSelection() // 取消选中sku
      } else { // 删除sku
        if (idx !== -1) {
          let arr = this.checkedAttr[idx].skuList
          const skuIdx = arr.findIndex((item) => item.goodsSkuSn === row.goodsSkuSn)
          if (skuIdx !== -1) {
            // const targetRef = `skuRef${goodsBn}`
            this.$refs[targetRef].$refs.multipleTable.toggleRowSelection(arr.skuList[skuIdx], false) // 取消选中sku
            arr.splice(skuIdx, 1)
            !arr.length && this.checkedAttr.splice(idx, 1)
          }
        }
      }
    },
    handleSelect(rows) {
      // 当前页选中行
      let selectRows = rows ? rows.map((item) => { // 设置商品被选中标识
        return {
          ...item,
          isSelected: true
        }
      }) : []
      // 已操作了翻页，需要进行翻页数据拼接
      if (this.finishChangePage) {
        const pageCheckedArr = utils.getStore('cacheSelectedGoodsList')
        if (pageCheckedArr.length) { // 有选择行，过滤重复
          selectRows.forEach((item) => {
            let idx = pageCheckedArr.findIndex((checkedItem) => {
              console.log(item.goodsBn === checkedItem.goodsBn, item.shopId === checkedItem.shopId)
              if (item.goodsBn === checkedItem.goodsBn) {
                 if (item.shopId === checkedItem.shopId) {
                  return true
                }
              }
            })
            console.log(idx)
            if (idx !== -1) selectRows.splice(idx, 1)
          })
        }
        this.checkedAttr = pageCheckedArr.concat(selectRows)
      } else { // 无翻页 当前页选中数据即是所有选中行
        this.checkedAttr = selectRows
      }
      // 缓存已选择数据 有翻页操作时进行缓存选中数据
      utils.setStore('cacheSelectedGoodsList', this.checkedAttr)
      this.$emit('handle-select', rows)
    },
    handleSkuList(rows) {
      if (!rows.length) return
      // 选中的sku是否属于已选择的商品, 选择的sku属于同一商品所以只需要拿数组【0】去对比
      const idx = this.checkedAttr.findIndex((selectedGood) => selectedGood.goodsBn === rows[0].goodsBn && selectedGood.shopId === rows[0].shopId)
      if (idx !== -1) { // 商品已选择， 在已选中商品列表中添加sku集合
        this.checkedAttr[idx].skuList = rows // 设置已选中的sku集合
        this.checkedAttr = JSON.parse(JSON.stringify(this.checkedAttr))
      } else { // 商品未被选择， 添加标识 商品未被选中，只选择sku isSelected:false
        const goodIndex = this.tableList.findIndex((good) => good.goodsBn === rows[0].goodsBn && good.shopId === rows[0].shopId)
        if (goodIndex !== -1) {
          // this.tableList[goodIndex] = this.tableList[goodIndex].map((item) => ({ ...item, isSelected: false }))
          Object.assign(this.tableList[goodIndex], { skuList: rows, isSelected: false })
          this.checkedAttr.push(this.tableList[goodIndex])
        }
      }
    },
    fetchData() {
      if (this.paramsObj.appCode === '') {
        this.tableList = []
        return
      }
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.channel
        .getGoodsListByChannel({
          ...this.searchObj,
          ...this.paramsObj,
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
  },
  mounted() {
    this.fetchData()
    this.checkedAttr = this.initChecked
  }
}
</script>
<style lang="less">
.el-table__expanded-cell {
  padding: 0 !important;
}
</style>
<style lang='less' scoped>
.sku-table {
  margin-top: 0;
  margin-left: 54px;
}
.goods-select {
  border: 1px solid @border-default;
  border-radius: 4px;
  .header {
    display: flex;
    border-bottom: 1px solid @border-default;
    .title {
      font-size: @f16;
      font-weight: bold;
      padding: 16px 0;
      text-align: center;
      &.title-left {
        width: 60%;
        border-right: 1px solid @border-default;
      }
      &.title-right {
        width: 40%;
      }
    }
  }
  .content {
    display: flex;
    .source {
      width: 60%;
      padding: 15px;
      border-right: 1px solid @border-default;
      border-bottom: 1px solid @border-default;
      overflow-y: auto;
    }
    .dist {
      width: 40%;
      overflow-y: auto;
    }
  }
}
</style>
