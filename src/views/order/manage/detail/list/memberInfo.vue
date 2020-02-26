<template>
  <line-card title="买家信息">
    <c-table
      ref="cTable"
      hasBorder
      noPage
      :max-height="300"
      :size="size"
      :auto-scroll="false"
      :loading="isLoading"
      :table-header="tableHeader"
      :table-list="memberList"
    ></c-table>
  </line-card>
</template>

<script>
import mixinTable from 'mixins/table'
import LineCard from '@/views/common/lineCard'

export default {
  mixins: [mixinTable],
  props: {
    memberObj:Object,
  },
  components: {
    LineCard
  },
  created() {
    if(JSON.stringify(this.memberObj) !== '{}'){
      this.memberList=[this.memberObj]
    }
  },
  data(vm) {
    return {
      memberList:[],
      tableHeader: [
        {
          label: '会员名称',
          prop: 'name'
        },
        {
          label: '会员昵称',
          prop: 'nickname'
        },
        {
          label: '会员账号',
          // prop: 'xxx'
        },
        {
          label: '会员等级',
          prop: 'grade'
        },
        {
          label: '会员身份证',
          // prop: 'xx'
        },
        {
          label: '联系电话',
          prop: 'phoneNumber'
        }
      ]
    }
  }
}
</script>
