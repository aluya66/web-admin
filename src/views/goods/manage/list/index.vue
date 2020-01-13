<template>
  <c-view>
    <template v-slot:headerTab>
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in tabTitle"
          :key="index"
          :label="index === 1 ? item.label + '(' + noperfectCount + ')' : item.label"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
      <el-button
        v-show="activeName === 'perfect'"
        :size="size"
        type="primary"
        :loading="exportLoading"
        icon="el-icon-download"
        @click="exportFile"
      >导出</el-button>
      <!-- <div class="header-btn">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-plus"
          @click="routerLink(`/marketing/rule/ruleInfo/${activeName}`)"
        >新增</el-button>
      </div>-->
    </template>
    <div class="main__box">
      <keep-alive>
        <component ref="childList" v-bind:is="activeName" @update-count="updateCount"></component>
      </keep-alive>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import noperfect from './noperfect'
import perfect from './perfect'
import utils from 'utils'

export default {
  name: 'goodsManage',
  components: {
    noperfect,
    perfect
  },
  mixins: [mixinTable],
  data(vm) {
    return {
      exportLoading: false,
      noperfectCount: 0, // 未完善商品数量
      activeName: 'perfect',
      tagTypeList: [], // 标签类型数据
      tabTitle: [
        {
          value: 'perfect',
          label: '已完善'
        },
        {
          value: 'noperfect',
          label: '未完善'
        }
      ]
    }
  },
  methods: {
    exportFile() {
      const { createDateTime, updateDateTime, categoryCode, stock, ...other } = this.$refs.childList.searchObj
      const createDate = this.getSearchDate(createDateTime, '', 'beginDate', 'endDate')
      const updateDate = this.getSearchDate(updateDateTime, '', 'updateBeginDate', 'updateEndDate')
      const categoryVal = {
        cateCodeFirst: categoryCode[0] || '',
        cateCodeSecond: categoryCode[1] || '',
        cateCodeThird: categoryCode[2] || ''
      }
      if (utils.isInteger(stock[0]) || utils.isInteger(stock[1])) {
        return this.$msgTip('商品库存请输入正整数', 'warning')
      }
      if (stock[0] > stock[1]) {
        return this.$msgTip('库存最小值不能大于最大值', 'warning')
      }

      this.exportLoading = true
      this.$api.goods.exportGoods({
        ...createDate,
        ...updateDate,
        ...categoryVal,
        ...other,
        minStock: stock[0] || '',
        maxStock: stock[1] || ''
      }).then(res => {
        this.exportLoading = false
        if (res) {
          const { data, filename } = res
          if (data && filename) {
            utils.createBlobFile(data, filename)
          } else {
            this.$msgTip('导出数据异常', 'warning')
          }
        } else {
          this.$msgTip('导出数据失败', 'warning')
        }
      })
    },
    updateCount(val) {
      this.noperfectCount = val
    }
  }
}
</script>
