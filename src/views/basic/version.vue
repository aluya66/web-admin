<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button
          type="primary"
          v-permission="$route.meta.roles"
          :size="size"
          icon="el-icon-plus"
          @click="showDialog"
        >新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
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
          <c-search
            :form-model="searchObj"
            :form-items="searchItems"
            @submit-form="searchSubmit"
            @reset-form="searchReset"
          ></c-search>
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
import CDialog from 'components/dialog'
import VersionAdd from './versionAdd'

const versionSelect = [
  {
    value: 0,
    label: '安卓'
  },
  {
    value: 1,
    label: 'IOS'
  }
]
const updateSelect = [{
  value: 0,
  label: '否'
}, {
  value: 1,
  label: '是'
}]

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
          fixed: true,
          search: {
            type: 'input'
          }
        },
        {
          label: '平台',
          prop: 'platform',
          width: 150,
          formatter(row) {
            return row.platform === 0 ? '安卓' : 'IOS'
          },
          search: {
            type: 'dict',
            optionsList: versionSelect
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
          },
          search: {
            type: 'dict',
            prop: 'isForce',
            optionsList: updateSelect
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
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
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
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
