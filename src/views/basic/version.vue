<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
          {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
          <el-button type="primary" v-permission="$route.meta.roles" :size="size" icon="el-icon-plus" @click="showDialog">新增</el-button>
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
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
            <el-form-item label="版本名称">
              <el-input
                v-model="searchObj.versionName"
                class="search-item"
                :size="size"
                placeholder="请输入版本名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="平台">
              <el-select
                v-model="searchObj.platform"
                :size="size"
                class="search-item"
                placeholder="请选择平台"
                clearable
              >
                <el-option
                  v-for="item in versionSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="强制更新">
              <el-select
                v-model="searchObj.isForce"
                :size="size"
                class="search-item"
                placeholder="请选择更新"
                clearable
              >
                <el-option
                  v-for="item in updateSelect"
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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <Version-add ref="childRef" :init-data="dialogObj.initData"></Version-add>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
// import utils from 'utils'
import CDialog from 'components/dialog'
import VersionAdd from './versionAdd'

export default {
  name: 'version',
  mixins: [mixinTable],
  components: {
    CDialog,
    VersionAdd
  },
  data(vm) {
    return {
      dialogObj: {}, // 对话框数据
      searchObj: {
        versionName: '',
        platform: '',
        isForce: '' // 是否强制更新
      },
      versionSelect: [
        {
          value: 0,
          label: '安卓'
        },
        {
          value: 1,
          label: 'IOS'
        }
      ],
      updateSelect: [{
        value: 0,
        label: '否'
      }, {
        value: 1,
        label: '是'
      }],
      tableList: [],
      tableInnerBtns: [
        {
          width: 130,
          name: '发布',
          icon: '',
          handle(row) {
            const { versionName, id } = row
            vm.confirmTip(`确认发布${versionName}版本？`, () => {
              vm.publishDate({ versionId: id })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: 'app版本',
          prop: 'versionName',
          width: 150,
          fixed: true
        },
        {
          label: '平台',
          prop: 'platform',
          width: 150,
          formatter(row) {
            return row.platform === 0 ? '安卓' : 'IOS'
          }
        },
        {
          label: 'url',
          prop: 'url',
          vHtml(row) {
            return `
              <el-popover
                placement="top-start"
                title="${row.url}"
                width="200"
                trigger="hover"
                content="${row.url}">
                  <div>${row.url}</div>
              </el-popover>
            `
          }
        },
        {
          label: '是否强制更新',
          prop: 'force',
          width: 150,
          formatter(row) {
            return row.force === 0 ? '否' : '是'
          }
        },
        {
          label: '描述',
          prop: 'description',
          vHtml(row) {
            return `
              <el-popover
                placement="top-start"
                title="${row.description}"
                width="200"
                trigger="hover"
                content="${row.description}">
                  <div>${row.description}</div>
              </el-popover>
            `
          }
        },
        {
          label: '状态',
          prop: 'status',
          width: 150,
          formatter(row) {
            return row.publish === 0 && row.enablePublish === true ? '未发布' : (row.publish === 0 ? '低版本' : '已发布')
          }
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
      const searchDate = this.getSearchDate(dataTime)
      this.isLoading = true
      this.$api.basic.queryAllVersion(
        {
          ...searchDate,
          ...other,
          ...page
        }
      ).then(res => {
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
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          if (!this.dialogObj.isEdit) {
            this.addHandle(childFormModel)
          } else {
            this.editHandle(childFormModel)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增版本',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    addHandle(childFormModel) {
      let data = {
        ...childFormModel
      }
      this.$api.basic.addRelease(data).then(res => {
        this.$msgTip('添加成功')
        this.fetchData()
        this.dialogObj.isShow = false
      })
    },
    publishDate(param, msgTip = '发布成功') {
      this.$api.basic.releaseRelease(param).then(() => {
        this.$msgTip(msgTip)
        this.fetchData()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.title{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
