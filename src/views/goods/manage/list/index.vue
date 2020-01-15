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
        icon="el-icon-download"
        :loading="exportLoading"
        @click="handleGoods"
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
    <div v-if="dialogShow">
      <c-dialog :is-show="dialogShow" title="提示" close-btn noBtn @before-close="dialogShow = false">
        <p class="dialog-text">
          您导出的商品数据量较大，请等待5分钟后，在
          <em class="router-link" @click="toExportList">基础服务-导出列表</em> 查看下载！
        </p>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import noperfect from './noperfect'
import perfect from './perfect'
import utils from 'utils'
import CDialog from 'components/dialog'
export default {
  name: 'goodsManage',
  components: {
    noperfect,
    perfect,
    CDialog
  },
  mixins: [mixinTable],
  data(vm) {
    return {
      exportLoading: false,
      dialogShow: false,
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
    toExportList() {
      this.dialogShow = false
      this.routerLink('/basic/exportList')
    },
    handleGoods() {
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
        if (res) {
          this.dialogShow = true
        } else {
          this.$msgTip('导出数据失败', 'warning')
        }
        this.exportLoading = false
      })
    },
    updateCount(val) {
      this.noperfectCount = val
    }
  }
}
</script>

<style lang="less">
.dialog-text {
  padding-bottom: 10px;
  text-align: center;
  .router-link {
    color: @menuActive;
    cursor: pointer;
  }
}
</style>
