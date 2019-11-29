<template>
  <c-view>
    <c-card v-for="(item,index) in equityList" :key="index" :name="item.activityName">
      <div class="card-container">
        <div class="card" v-for="(subItem, subIndex) in item.detailList" :key="subIndex">
          <el-card :body-style="{ padding: '0px' }">
            <div>
              <h2 class="title">{{subItem.memberType}}</h2>
              <p class="info" v-show="subItem.activityDetailName">{{subItem.activityDetailName}}</p>
              <div class="status">
                {{subItem.activityStatus}}
                <el-button
                  class="btn"
                  size="small"
                  v-if="item.activityId === 6 || item.activityId === 7"
                  @click="edit(item.activityId, subItem)"
                >编辑</el-button>
                <!-- item.activityId === 6 || item.activityId === 7" 积分、商品有编辑功能 -->
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </c-card>
    <!-- 积分弹窗开始 -->
    <div v-if="pointDialogObj.isShow">
      <c-dialog
        :is-show="pointDialogObj.isShow"
        title="积分倍数"
        close-btn
        @before-close="pointDialogObj.isShow = false"
        @on-submit="pointDialogConfirm('pointRef')"
      >
        <el-form
          ref="pointRef"
          :model="pointDialogObj"
          :rules="rules"
          label-width="150px"
          class="form"
          label-position="right"
          status-icon
        >
          <el-form-item prop="rate">
            <div>消费享:
              <el-input
                class="rate-inp"
                v-model="pointDialogObj.rate"
                :size="size"
                maxlength="5"
                placeholder="输入整数"
                clearable
              />倍积分
            </div>
          </el-form-item>
        </el-form>
      </c-dialog>
    </div>
    <!-- 积分弹窗结束 -->
    <!-- 商品弹窗开始 -->
    <div v-if="goodsDialogObj.isShow">
      <c-dialog
        :is-show="goodsDialogObj.isShow"
        title="导入商品"
        close-btn
        @before-close="goodsDialogObj.isShow = false"
        @on-submit="goodsDialogConfirm('goodsRef')"
      >
        <h3 class="tip">输入商品SPU，一行一个商品SPU</h3>
        <el-input type="textarea" v-model="goodsDialogObj.productCodes" rows="20"/>
      </c-dialog>
    </div>
    <!-- <div v-if="goodsDialogObj.isShow">
      <c-dialog
        :is-show="goodsDialogObj.isShow"
        width="80vw"
        title="导入商品"
        close-btn
        @before-close="goodsDialogObj.isShow = false"
        @on-submit="goodsDialogConfirm('goodsRef')"
      >
        <div class="main__box">
          <c-table
            ref="cTable"
            selection
            hasBorder
            :max-height="685"
            :size="size"
            :loading="isLoading"
            :table-header="tableHeader"
            :table-list="tableList"
            :page-info="pageInfo"
            @change-pagination="changePagination"
            @selection-handle="selectGoods"
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
                  <el-input
                    v-model="searchObj.categoryCode"
                    class="search-item"
                    :size="size"
                    placeholder="商品类目"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="品牌">
                  <el-input
                    v-model="searchObj.brandName"
                    class="search-item"
                    :size="size"
                    placeholder="品牌"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="商品库存">
                  <el-input
                    v-model.number="searchObj.minStock"
                    class="search-number"
                    :size="size"
                    placeholder="最小值"
                    clearable
                  />
                  至
                  <el-input
                    v-model.number="searchObj.maxStock"
                    class="search-number"
                    :size="size"
                    placeholder="最大值"
                    clearable
                  />
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
      </c-dialog>
    </div>-->

    <!-- 商品弹窗结束 -->
  </c-view>
</template>

<script>
import CCard from 'components/card'
import CDialog from 'components/dialog'
import mixinTable from 'mixins/table'
import utils from 'utils'
export default {
  name: 'memberManageEquity',
  mixins: [mixinTable],
  data(vm) {
    let checkInt = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('积分倍数不能为空'))
      } else if (!Number(value) || Number.isInteger(value) || Number(value) <= 0) {
        return callback(new Error('请输入整数'))
      }
      callback()
    }
    return {
      pickerOptions: utils.pickerOptions,
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
      searchObj: { // 商品筛选条件
        categoryCode: '', // 商品类目
        goodsBn: '', // 商品编码
        goodsName: '', // 商品名称
        brandName: '', // 品牌名称
        minStock: '', // 库存最小值
        maxStock: '' // 库存最大值
      },
      equityList: [], // 商品列表
      pointDialogObj: {}, // 积分倍数弹窗
      goodsDialogObj: {}, // 导入商品弹窗
      rules: {
        rate: [
          { required: true, validator: checkInt, trigger: 'blur' }
        ]
      },
      tableHeader: [
        {
          label: '商品编码',
          prop: 'goodsBn',
          width: 180,
          fixed: true
        },
        {
          label: '商品名称',
          prop: 'goodsName'
        },
        {
          label: '商品图片',
          prop: 'coverImg',
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
        // {
        //   label: '样衣成本价(元)',
        //   prop: 'sampleCostPrice',
        //   width: 115
        // },
        // {
        //   label: '成衣成本价(元)',
        //   prop: 'costPrice',
        //   width: 115
        // },
        // {
        //   label: '成衣供货价(元)',
        //   prop: 'supplyPrice',
        //   width: 115
        // },
        // {
        //   label: '成衣散批价(元)',
        //   prop: 'wholesalePrice',
        //   width: 115
        // },
        // {
        //   label: '成衣大批价(元)',
        //   prop: 'largeBatchPrice',
        //   width: 115
        // },
        // {
        //   label: '成衣会员价(元)',
        //   prop: 'memberPrice',
        //   width: 115
        // },
        // {
        //   label: '零售价(元)',
        //   prop: 'retailPrice',
        //   width: 90
        // },
        {
          label: '成衣库存(件)',
          prop: 'stock'
        }
      ]
    }
  },
  created() {
    this.fetchEquityData()
  },
  methods: {
    // 商品多选
    selectGoods(val) {
      this.goodsDialogObj.productCodes = val.map((item) => item.id)
    },
    // 商品列表获取
    fetchData() {
      const { dateTime, minStock, maxStock, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
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
          marketable: 1
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
    // 商品弹窗确认
    goodsDialogConfirm(goodsRef) {
      if (!this.goodsDialogObj.productCodes || this.goodsDialogObj.productCodes.length === 0) {
        return this.$msgTip('请选择商品导入')
      }
      let productCodes = this.goodsDialogObj.productCodes.split(/[\s\n]/) // 字符串分割换行符、空格
      // const { activityDetailId, userLevel, activityId, productCodes } = this.goodsDialogObj
      const { activityDetailId, userLevel, activityId } = this.goodsDialogObj
      this.$api.member.editMemberEquity({ activityDetailId, userLevel, activityId, productCodes }).then(() => {
        this.$msgTip('商品导入成功')
        this.goodsDialogObj.isShow = false
        this.fetchEquityData()
      })
    },
    // 积分弹窗确认
    pointDialogConfirm(pointRef) {
      this.$refs[pointRef].validate((valid) => {
        if (valid) {
          const { activityDetailId, userLevel, activityId, rate } = this.pointDialogObj
          this.$api.member.editMemberEquity({ activityDetailId, userLevel, activityId, rate: Number(rate) }).then(() => {
            this.$msgTip('编辑成功')
            this.pointDialogObj.isShow = false
            this.fetchEquityData()
          })
        }
      })
    },
    // 积分/商品编辑
    edit(activityId, item) {
      const { activityDetailId, memberTypeId } = item
      if (activityId === 6) { // 积分倍数编辑
        this.pointDialogObj = {
          isShow: true,
          activityDetailId,
          userLevel: memberTypeId,
          activityId
        }
      } else if (activityId === 7) {
        this.fetchData()
        this.pageInfo.pageNo = 1
        this.goodsDialogObj = {
          isShow: true,
          activityDetailId,
          userLevel: memberTypeId,
          activityId
        }
      }
    },
    // 会员权益列表
    fetchEquityData() {
      this.isLoading = true
      this.$api.member.getMemberEquityList().then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data } = res
          this.equityList = data || []
        } else {
          this.equityList = res || []
        }
      })
    }
  },
  components: {
    CCard,
    CDialog
  }
}
</script>

<style lang='less' scoped>
.card-container {
  display: flex;
  justify-content: center;
  .card {
    margin: 0 100px;
    width: 30vw;
    text-align: center;
    .title {
      font-weight: 700;
      padding: 30px;
    }
    .info {
      margin-bottom: 30px;
      font-size: @f18;
    }
    .status {
      height: 50px;
      line-height: 50px;
      background-color: @border-default;
      .btn {
        margin-left: 15px;
      }
    }
  }
}
.rate-inp {
  margin: 0 10px;
  width: 200px;
}
</style>
<style lang='less' scoped>
.tip {
  margin-bottom: 15px;
  font-weight: 700;
}
</style>
