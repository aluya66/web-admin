<template>
  <div class="goods-select">
    <div class="header">
      <div class="title title-left">商品列表</div>
    </div>
    <div class="content">
      <div class="source">
        <c-table
          ref="table"
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
          @expand-change="handleSkuList"
        >
          <template v-slot:header>
            <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
              <el-form-item>
                <el-input
                  v-model="searchObj.couponName"
                  class="search-item"
                  size="medium"
                  placeholder="输入SPU/SKU"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="searchObj.couponStatus"
                  placeholder="请选择品牌"
                  class="search-item"
                  size="medium"
                  clearable
                >
                  <el-option
                    v-for="item in brandList"
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
                >筛选</el-button>
              </el-form-item>
            </el-form>
          </template>
          <template v-slot:expand="{props}">
            {{ props.id }}
            <c-table
              :ref="'skuRef' + props.id"
              hasBorder
              selection
              noPage
              :max-height="400"
              :size="size"
              :loading="isLoading"
              :table-header="skuTableHeader"
              :table-list="props.skus"
            ></c-table>
          </template>
        </c-table>
      </div>
      <!-- <div class="dist">
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
            @expand-change="handleSkuList"
          >
            <template v-slot:expand="{props}">
              <c-table
                hasBorder
                selection
                noPage
                :max-height="400"
                :size="size"
                :loading="isLoading"
                :table-header="skuTableHeader"
                :table-list="props.skus"
              ></c-table>
            </template>
          </c-table>
        </div>
      </div> -->
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
      // 编辑初始化选中值
      type: Array,
      default() {
        return []
      }
    }
  },
  data(vm) {
    return {
      skuTableHeader: [
        {
          label: '编号',
          prop: 'goodsSkuSn'
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
      selectedTableInnerBtns: [
        {
          width: 150,
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {

          }
        }
      ],
      tableInnerBtns: [
        {
          width: 150,
          name: '添加',
          icon: 'el-icon-add',
          handle(row) {
            vm.handleSelect(row)
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
      brandList: [],
      searchObj: {},
      checkedAttr: [] // 选中的值
    }
  },
  methods: {
    handleSelect(row) {
      // this.checkedAttr.push(row)
      const targetRef = `skuRef${row.id}`
      console.log(this.$refs[targetRef])
      this.$nextTick(() => {
        this.$refs[targetRef].selectAll()
      })
      // this.$refs[targetRef].toggleSelection(row.skus);
    },
    handleSkuList(row) {
      // const idx = this.checkedAttr.findIndex((item) => row.id === item.id)
      // if (idx !== -1) {
      //   row.skus.forEach(row => {
      //     this.$refs[targetRef].toggleSelection(row);
      //   })
      // }
    },
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.basic
        .getGoodsListByChannel({
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
    },
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
