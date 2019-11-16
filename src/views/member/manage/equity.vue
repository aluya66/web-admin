<template>
  <c-view>
    <c-card v-for="(item,index) in tableList" :key="index" :name="item.activityName">
      <div class="card-container">
        <div class="card" v-for="(subItem, subIndex) in item.detailList" :key="subIndex">
          <el-card :body-style="{ padding: '0px' }">
            <div>
              <h2 class="title">{{subItem.memberType}}</h2>
              <p class="info" v-show="subItem.activityDetailName">{{subItem.activityDetailName}}</p>
              <div class="status">
                {{subItem.activityStatus}}
                <el-button class="btn" size="small">编辑</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </c-card>
  </c-view>
</template>

<script>
import CCard from 'components/card'
import mixinTable from 'mixins/table'
export default {
  name: 'memberManageEquity',
  mixins: [mixinTable],
  data() {
    return {}
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.isLoading = true
      this.$api.member.getMemberEquityList().then(res => {
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

  components: {
    CCard
  }
}
</script>

<style lang='less' scoped>
  .el-card {

  }
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
        font-size: 18px;
      }
      .status {
        height: 50px;
        line-height: 50px;
        background-color: gray;
        .btn {
          margin-left: 15px;
        }
      }
    }
  }

</style>
