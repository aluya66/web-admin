<template>
  <c-view>
    <el-row>
      <el-col :span="8">入库单号：{{formModel.orderCode}}</el-col>
      <el-col :span="8">来源：{{formModel.source}}</el-col>
      <el-col :span="8">业务类型：{{formModel.sourceType}}</el-col>
    </el-row>
     <el-row>
      <el-col :span="8">关联单号：{{formModel.refOrderCode}}</el-col>
      <el-col :span="8">状态：{{formModel.status}}</el-col>
      <el-col :span="8">创建时间：{{formModel.created}}</el-col>
    </el-row>
    <c-table
      ref="cTable"
      hasBorder
      noPage
      :size="size"
      :loading="isLoading"
      :table-header="tableHeader"
      :table-list="formModel.orderRecordProductList"
    />
  </c-view>
</template>

<script>
// import dictObj from '@/store/dictData'
import mixinTable from "mixins/table";

export default {
  mixins: [mixinTable],
  props: {
    initData: {
      type: Object,
      default() {
        return {};
      }
    }
    // isEdit: {
    //   type: Boolean,
    //   default: false
    // },
  },
  data() {
    return {
      // 表格内操作按钮
      tableHeader: [
        {
          label: "仓库id",
          prop: "whId"
        },
        {
          label: "仓库编码",
          prop: "whCode"
        },
        {
          label: "仓库名称",
          prop: "whName"
        },
        {
          label: "商品id",
          prop: "productId"
        },
        // {
        //   label: "供应商编码",
        //   prop: "venderCode"
        // },
        // {
        //   label: "供应商名称",
        //   prop: "venderName"
        // },
        // {
        //   label: "供应商款号",
        //   prop: "venderProductCode"
        // },
        {
          label: "商品sku",
          prop: "skuCode"
        },
        {
          label: "商品款号",
          prop: "productAtrNumber"
        },
        {
          label: "商品名称",
          prop: "productName"
        },
        {
          label: "品牌名称",
          prop: "brandName"
        },
          {
          label: "品牌编码",
          prop: "brandCode"
        },
          {
          label: "数量",
          prop: "qty"
        },  {
          label: "创建时间",
          prop: "created"
        },  {
          label: "创建人",
          prop: "createdName"
        },
      ]
    };
  },
  created() {
    console.log("createeeeeee?????", this.initData);
  },
  computed: {
    formModel: {
      get() {
        return this.initData;
      },
      set(val) {
        this.$emit("update:init-data", val);
      }
    }
  },
  methods: {}
};
</script>

<style lang='less' scoped>
</style>
