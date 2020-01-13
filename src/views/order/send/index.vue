<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :max-height="maxHeight"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <c-search
            :form-model="searchObj"
            :form-items="searchItems"
            @submit-form="searchSubmit"
            @reset-form="searchReset"
          ></c-search>
        </template>
      </c-table>
    </div>
    <div>dfdfdfdf</div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
export default {
  name: 'orderSend',
  mixins: [mixinTable],
  data() {
    return {
      // 表格内操作按钮
      tableHeader: [
        {
          label: '订单号',
          prop: 'orderCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '支付单号',
          prop: 'flowCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '客户手机号',
          prop: 'buyerMobile',
          search: {
            type: 'input'
          }
        },
        
      ]
    }
  }
}

</script>
<style>
</style>
