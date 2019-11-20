<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button
          :size="size"
          type="primary"
          v-permission="$route.meta.roles"
          icon="el-icon-plus"
        >新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        selection
        hasBorder
        :max-height="685"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
            <el-form-item label="二维码名称">
              <el-input
                v-model="searchObj.qrcodeName"
                class="search-item"
                :size="size"
                placeholder="二维码名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="二维码编码">
              <el-input
                v-model="searchObj.qrcodeCode"
                class="search-item"
                :size="size"
                placeholder="二维码编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="创建人">
              <el-input
                v-model="searchObj.opCreator"
                class="search-item"
                :size="size"
                placeholder="创建人"
                clearable
              />
            </el-form-item>
            <el-form-item label="更新人">
              <el-input
                v-model="searchObj.opEditor"
                class="search-item"
                :size="size"
                placeholder="更新人"
                clearable
              />
            </el-form-item>
            <el-form-item label="二维码生产者">
              <query-dict
                :dict-list="lobList"
                class="search-item"
                :size="size"
                placeholder="请选择"
                :value.sync="searchObj.producerCode"
              ></query-dict>
            </el-form-item>
            <el-form-item label="二维码使用者">
              <query-dict
                :multiple=true
                :dict-list="lobList"
                class="search-item"
                :size="size"
                placeholder="请选择"
                :value.sync="searchObj.userCode"
              ></query-dict>
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                v-model="searchObj.status"
                :size="size"
                class="search-item"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in statusList"
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
              >查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </c-table>
    </div>
  </c-view>
</template>

<script>
import mixinTable from "mixins/table";
import dictObj from '@/store/dictData'
export default {
  name: "settingsQrcode",
  mixins: [mixinTable],
  data(vm) {
    return {
      lobList: dictObj.lobList, // 业务线集合
      statusList: dictObj.disStatus, // 状态
      searchObj: {},
      tableInnerBtns: [
        {
          width: 150,
          name: "开关",
          icon: "el-icon-open",
          handle(row) {
            const { status, id, qrcodeName } = row;
            const updateStatus = status === 0 ? 1 : 0
            const updateMsg = status === 0 ? '启用' : '禁用'
            vm.confirmTip(`是否${updateMsg}【${qrcodeName}】二维码`, () => {
              vm.changeStatus({ id, status: updateStatus });
            });  
          }
        },
        {
          width: 150,
          name: "编辑",
          icon: "el-icon-edit",
          handle(row) {}
        },
        {
          name: "删除",
          icon: "el-icon-delete",
          handle(row) {
            const { qrcodeName, id } = row;
            vm.confirmTip(`是否删除【${qrcodeName}】二维码`, () => {
              vm.deleteQrcode(id);
            });
          }
        }
      ],
      tableHeader: [
        {
          label: "二维码ID",
          prop: "id",
          fixed: true
        },
        {
          label: "二维码名称",
          prop: "qrcodeName"
        },
        {
          label: "二维码编码",
          prop: "qrcodeCode"
        },
        {
          label: "二维码使用者",
          prop: "userCode"
        },
        {
          label: "状态",
          prop: "status",
          formatter(row) {
            return row.status === 0 ? '禁用' : '启用'
          }
        },
        {
          label: "更新人名字",
          prop: "opEditor"
        },
        {
          label: "更新时间",
          prop: "updated",
          width: 100
        }
      ]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    deleteQrcode(id) {
      this.$api.qrcode.deleteQrcode({ id }).then(() => {
        this.$msgTip('删除成功')
        this.fetchData()  
      })
    },
    changeStatus(params) {
      this.$api.qrcode.changeStatus(params).then(() => {
        this.$msgTip('更新成功')
        this.fetchData()
      })
    },
    fetchData() {
      const { pageSize, pageNo } = this.pageInfo;
      const userCode = this.searchObj.userCode ? this.searchObj.userCode.join(',') : '' // 使用者字段
      this.isLoading = true;
      this.$api.qrcode
        .getQrcodeList({
          ...this.searchObj,
          pageSize,
          pageNo,
          userCode
        })
        .then(res => {
          this.isLoading = false;
          if (res.totalCount) {
            const { data, totalCount } = res;
            this.pageInfo.totalNum = totalCount;
            this.tableList = data || [];
          } else {
            this.tableList = res || [];
          }
        });
    }
  }
};
</script>

<style lang='less' scoped>
</style>
