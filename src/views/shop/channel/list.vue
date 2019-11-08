<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
         <div class="header-btn">
          <el-button
            :size="size"
            type="primary"
            icon="el-icon-plus"
            @click="routerLink('/shop/channel/channelInfo')"
          >新增</el-button>
        </div>
      </div>
    </template>
    <div class="main__box">
      <c-table
        selection
        hasBorder
        :size="size"
        :max-height="730"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search">
            <el-form-item label="渠道名称">
              <el-input
                v-model="searchObj.channelName"
                class="search-item"
                size="medium"
                placeholder="渠道名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="渠道号码">
              <el-input
                v-model="searchObj.channelCode"
                class="search-item"
                size="medium"
                placeholder="渠道号码"
                clearable
              />
            </el-form-item>
            <el-form-item label="渠道类型">
              <el-select
                v-model="searchObj.channelType"
                size="medium"
                class="search-item"
                clearable
                placeholder="店铺类型"
              >
                <el-option
                  v-for="(item, index) in channelTypeSelect"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="渠道状态">
              <el-select
                v-model="searchObj.status"
                size="medium"
                class="search-item"
                clearable
                placeholder="渠道状态"
              >
                <el-option
                  v-for="(item, index) in statusSelect"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="店铺状态">
              <el-select
                v-model="searchObj.status"
                size="medium"
                class="search-item"
                clearable
                placeholder="店铺状态"
              >
                <el-option
                  v-for="(item, index) in shopStatusSelect"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>-->
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
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'

export default {
  name: 'channel',
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {
        channelName: '', // 渠道名称
        channelCode: '', // 渠道号码
        channelType: '', // 渠道类型
        status: '' // 渠道状态
      },
      channelTypeSelect: [
        {
          label: '主渠道',
          value: 1
        },
        {
          label: '子渠道',
          value: 2
        }
      ],
      statusSelect: [{
        label: '关闭',
        value: 0
      }, {
        label: '开启 ',
        value: 1
      }],
      dialogObj: {}, // 对话框数据
      tableList: [],
      tableInnerBtns: [{
        width: 150,
        name: '编辑',
        icon: 'el-icon-edit',
        handle (row) {
          vm.routerLink(`/shop/channel/channelInfo/${row.id}`)
        }
      }, {
        name: '删除',
        icon: 'el-icon-detail',
        handle (row) {
          const { id, channelName } = row
          vm.confirmTip(
            `是否删除 ${channelName} 渠道`,
            {
              confirmHandle() {
                vm.deleteData({ id })
              }
            }
          )
        }
      }],
      tableHeader: [
        {
          label: '渠道名称',
          prop: 'channelName'
        },
        {
          label: '渠道号码',
          prop: 'channelCode'
        },
        {
          label: '渠道主图',
          prop: 'channelImage'
        },
        {
          label: '渠道LOGO ',
          prop: 'channelLogo'
        },
        {
          label: '渠道类型',
          prop: 'channelType',
          formatter(row) {
            return row.channelType
              ? vm.channelTypeSelect[row.channelType - 1].label
              : ''
          }
        },
        {
          label: '联系人',
          prop: 'contact'
        },
        {
          label: '联系人电话 ',
          prop: 'contactTel'
        },
        {
          label: '创建人',
          prop: 'createBy'
        },
        {
          label: '创建时间',
          prop: 'created'
        },
        {
          label: '是否删除',
          prop: 'isDelete',
          formatter(row) {
            return row.isDelete === 1 ? '删除' : '不删除'
          }
        },
        {
          label: '渠道状态',
          prop: 'status'
        },
        {
          label: '更新人',
          prop: 'updateBy'
        },
        {
          label: '更新时间',
          prop: 'updated'
        },
        {
          label: '视频截图',
          prop: 'videoCapture'
        },
        {
          label: '视频地址',
          prop: '视频截图'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.shop
        .getChannel({
          ...this.searchObj,
          ...other,
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
    deleteData(params, msgTip = '删除成功') {
      this.$api.shop.deleteChannel(params).then(() => {
        this.$msgTip(msgTip)
        this.fetchData()
      })
    }
  }
}
</script>

<style lang='less' scoped>
.main__box {
  .search {
    margin-bottom: 10px;
    width: 100%;
    .search-item {
      width: 250px;
    }
  }
}
</style>
