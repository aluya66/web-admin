<template>
  <div class="goods-select">
    <div class="header">
      <div class="title title-left">商品列表</div>
    </div>
    <div class="content">
      <div class="source">
        <c-table
          ref="goodsTableRef"
          selection
          expand
          hasBorder
          :max-height="400"
          :size="size"
          :loading="isLoading"
          :table-header="tableHeader"
          :table-list="tableList"
          :page-info="pageInfo"
          :table-inner-btns="tableInnerBtns"
          @change-pagination="changePagination"
          @selection-handle="handleSelect"
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
              :ref="'skuRef' + props.goodsBn"
              hasBorder
              selection
              noPage
              :max-height="400"
              :size="size"
              :loading="isLoading"
              :table-header="skuTableHeader"
              :table-list="props.skus"
              @selection-handle="handleSkuList"
            ></c-table>
          </template>
        </c-table>
      </div>
      <div class="dist">
        <div class="title">已选商品:【 {{checkedAttr.length}} 】</div>
        <div class="selected-box">
          <c-table
            expand
            noPage
            hasBorder
            :max-height="400"
            :size="size"
            :loading="isLoading"
            :table-header="tableHeader"
            :table-list="checkedAttr"
            :table-inner-btns="selectedTableInnerBtns"
          >
            <template v-slot:expand="{props}">
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
            </template>
          </c-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mixinTable from 'mixins/table'
export default {
  name: 'goodsSelect',
  mixins: [mixinTable],
  props: {
    disabled: Boolean,
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
      dialogObj: {},
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
      tableHeader: [
        {
          label: '商品名称',
          prop: 'goodsName',
          search: {
            type: 'input'
          }
        },
        {
          label: '图片',
          prop: 'coverImg',
          width: 100,
          isImage: true
        },
        {
          label: '款号',
          prop: 'goodsBn',
          search: {
            type: 'input'
          }
        }
      ],
      brandList: [],
      searchObj: {},
      checkedAttr: [] // 选中的值
    }
  },
  watch: {
    'paramsObj.appCode'(nval, oval) {
      if (oval === nval) return
      this.fetchData()
    }
  },
  methods: {
    // 删除已选择的列表数据
    deleteSelectedItem(row, type) {
      const goodsBn = row.goodsBn // 商品goodsBn
      const idx = this.checkedAttr.findIndex((item) => item.goodsBn === goodsBn)
      const tableIdx = this.tableList.findIndex((item) => item.goodsBn === goodsBn)
      const targetRef = `skuRef${goodsBn}` // 子table
      if (type === 'goods') { // 删除商品
        tableIdx !== -1 && this.$refs.goodsTableRef.$refs.multipleTable.toggleRowSelection(this.tableList[tableIdx], false)
        idx !== -1 && this.checkedAttr.splice(idx, 1)
        this.$refs[targetRef] && this.$refs[targetRef].$refs.multipleTable.clearSelection() // 取消选中sku
      } else { // 删除sku
        if (idx !== -1) {
          let arr = this.checkedAttr[idx].skuList
          const skuIdx = arr.findIndex((item) => item.goodsSkuSn === row.goodsSkuSn)
          if (skuIdx !== -1) {
            const targetRef = `skuRef${goodsBn}`
            this.$refs[targetRef].$refs.multipleTable.toggleRowSelection(arr.skuList[skuIdx], false) // 取消选中sku
            arr.splice(skuIdx, 1)
            !arr.length && this.checkedAttr.splice(idx, 1)
          }
        }
      }
    },
    handleSelect(rows) {
      if (!rows.length) return
      this.checkedAttr = rows.map((item) => { // 设置商品被选中标识
        return {
          ...item,
          isSelected: true
        }
      })
      this.$emit('handle-select', rows)
    },
    handleSkuList(rows) {
      if (!rows.length) return
      // 选中的sku是否属于已选择的商品, 选择的sku属于同一商品所以只需要拿数组【0】去对比
      const idx = this.checkedAttr.findIndex((selectedGood) => selectedGood.goodsBn === rows[0].goodsBn)
      if (idx !== -1) { // 商品已选择， 在已选中商品列表中添加sku集合
        this.checkedAttr[idx].skuList = rows // 设置已选中的sku集合
        this.checkedAttr = JSON.parse(JSON.stringify(this.checkedAttr))
      } else { // 商品未被选择， 添加标识 商品未被选中，只选择sku isSelected:false
        const goodIndex = this.tableList.findIndex((good) => good.goodsBn === rows[0].goodsBn)
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

<style lang='less' scoped>
.goods-select {
  border: 1px solid @border-default;
  border-radius: 4px;
  .header {
    display: flex;
    border-bottom: 1px solid @border-default;
    .title {
      flex: 1;
      font-size: @f16;
      font-weight: bold;
      padding: 16px 0;
      text-align: center;
    }
    .title-left {
      flex: 50%;
      border-right: 1px solid @border-default;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    .source {
      flex-direction: row;
      padding: 15px;
      border-right: 1px solid @border-default;
      border-bottom: 1px solid @border-default;
      overflow-y: auto;
    }
    .dist {
      height: 200px;
      overflow-y: auto;
      .title {
        flex: 1;
        font-size: @f16;
        font-weight: bold;
        padding: 16px 0;
        text-align: center;
      }
    }
  }
}
</style>
