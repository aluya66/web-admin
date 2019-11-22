<template>
  <div class="goods-select">
    <div class="header">
      <div class="title title-left">商品列表</div>
      <div class="title">已选商品:【 {{distList.length}} 】</div>
    </div>
    <div class="content">
      <div class="source">
        <c-table
          expand
          hasBorder
          :max-height="685"
          :size="size"
          :loading="isLoading"
          :table-header="tableHeader"
          :table-list="searchList"
          :page-info="pageInfo"
          :table-inner-btns="tableInnerBtns"
          @change-pagination="changePagination"
					@expand-change="getSkuList"
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
						{{props}}
            <!-- <el-table
              ref="multipleTable"
              :data="props"
              tooltip-effect="dark"
              style="width: 100%"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="日期" width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="120"></el-table-column>
              <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
            </el-table> -->
          </template>
        </c-table>
      </div>
      <div class="dist"></div>
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
    sourceList: {
      // 源数据集合
      type: Array,
      required: true
    },
    initChecked: {
      // 编辑初始化选中值
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tableInnerBtns: [
        {
          width: 150,
          name: '添加',
          icon: 'el-icon-add',
          handle(row) {}
        }
      ],
      tableHeader: [
        {
          label: '商品名称',
          prop: 'name'
        },
        {
          label: '图片',
          prop: 'image',
          width: 100,
          isImage: true
        },
        {
          label: '款号',
          prop: 'number'
        }
      ],
      brandList: [],
      searchObj: {},
      checkedAttr: [] // 选中的值
    }
  },
  methods: {
    getSkuList(row) {
      console.log(row)
    }
  },
  computed: {
    distList() {
      // 选中集合
      return this.checkedAttr.map(res =>
        this.sourceList.find(val => res === val.value)
      )
    },
    searchList() {
      // 搜索列表集合
      let curData = []
      if (this.searchValue) {
        this.sourceList.forEach(res => {
          if (res && res.label && res.label.indexOf(this.searchValue) !== -1) {
            curData.push(res)
          }
        })
      } else {
        curData = this.sourceList
      }
      return curData
    }
  },
  mounted() {
    this.checkedAttr = this.initChecked
  }
}
</script>

<style lang='less' scoped>
.goods-select {
  border: 1px solid @border-default;
  margin: 0 40px;
  border-radius: 4px;
  .header {
    display: flex;
    border-bottom: 1px solid @border-default;
    .title {
      flex: 1.2;
      font-size: @f16;
      font-weight: bold;
      padding: 16px 0;
      text-align: center;
    }
    .title-left {
      flex: 3;
      border-right: 1px solid @border-default;
    }
  }
  .content {
    display: flex;
    .source {
      flex: 3;
      flex-direction: row;
      padding: 15px;
      border-right: 1px solid @border-default;
      overflow-y: auto;
    }
    .dist {
      flex: 1.2;
      overflow-y: auto;
    }
  }
}
</style>
