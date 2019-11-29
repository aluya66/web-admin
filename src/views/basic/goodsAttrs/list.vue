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
        :max-height="maxHeight"
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
      <div v-if="dialogObj.isShow">
        <c-dialog
          :is-show="dialogObj.isShow"
          :title="dialogObj.title"
          close-btn
          @before-close="dialogObj.isShow = false"
          @on-submit="dialogConfirm"
        >
          <attr-add
            ref="childRef"
            :is-edit="dialogObj.isEdit"
            :init-data.sync="dialogObj.initData"
            :tag-type="tagTypeList"
          ></attr-add>
        </c-dialog>
      </div>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import AttrAdd from '@/views/settings/label/labelAdd'
import dictObj from '@/store/dictData'

const pageItemType = ['文本', '复选', '单选'] // 页面显示类型

export default {
  name: 'labelList',
  mixins: [mixinTable],
  components: {
    CDialog,
    AttrAdd
  },
  data(vm) {
    return {
      tagTypeList: [], // 属性集合
      dialogObj: {}, // 对话框数据
      tableInnerBtns: [
        {
          width: 130,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              categoryId,
              tagName,
              tagValues,
              categoryLob,
              tagStatus,
              tagDesc,
              operateType,
              id
            } = row
            vm.showDialog({
              title: '编辑属性',
              initData: {
                categoryId,
                tagName,
                categoryLob,
                tagStatus,
                tagDesc,
                operateType,
                id,
                tagValues: tagValues.map(({ value, id, desc }) => ({ value, id, desc }))
              },
              isEdit: true
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { tagName, id } = row
            vm.confirmTip(`确认删除${tagName}属性`, () => {
              vm.deleteData({ id })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '属性名称',
          prop: 'tagName',
          fixed: true,
          width: 150,
          search: {
            type: 'input'
          }
        },
        {
          label: '属性类型',
          prop: 'categoryName',
          search: {
            type: 'dict',
            prop: 'categoryId',
            optionsList: []
          }
        },
        {
          label: '属性值',
          prop: 'tagValues',
          width: 600,
          formatter(row) {
            return row.tagValues.map(item => item.value).filter(d => d).join('/')
          },
          search: {
            type: 'input',
            prop: 'value'
          }
        },
        {
          label: '显示类型',
          prop: 'operateType',
          formatter(row, index) {
            return row.operateType ? pageItemType[row.operateType - 1] : '无'
          }
        },
        {
          label: '业务线',
          prop: 'categoryLob',
          formatter(row) {
            const lobObj = row.categoryLob && dictObj.lobList.find(res => row.categoryLob === res.value)
            return lobObj ? lobObj.label : ''
          },
          search: {
            type: 'dict',
            optionsList: dictObj.lobList
          }
        },
        {
          label: '属性状态',
          prop: 'tagStatus',
          formatter(row) {
            const curVal = row.tagStatus && dictObj.disStatus.find(res => row.tagStatus === res.value)
            return curVal ? curVal.label : ''
          },
          search: {
            type: 'dict',
            optionsList: dictObj.disStatus
          }
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100,
          search: {
            type: 'dateTime',
            prop: 'dateTime'
          }
        }
        // {
        //   label: '更新时间',
        //   prop: 'updated',
        //   width: 100
        // }
      ]
    }
  },
  created() {
    this.getTagType()
    this.fetchData()
  },
  methods: {
    // 获取类型数据
    getTagType() {
      this.$api.settings.getGoodsTabType({
        categoryType: 0 // 商品属性
      }).then(res => {
        if (res && res.length) {
          this.tagTypeList = res.map(res => ({ label: res.categoryName, value: res.id }))
          this.setSearchOptionsList('categoryId', this.tagTypeList)
        }
      })
    },
    fetchData() {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.settings.getTabList({
        categoryType: 0, // 商品属性
        ...searchDate,
        ...other,
        ...page
      }).then(res => {
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
    deleteData(param, msgTip = '删除成功') {
      this.$api.settings.deleteTag(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    },
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          if (!this.dialogObj.isEdit) {
            this.addHandle(childRef)
          } else {
            this.editHandle(childRef)
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
        title: opts.title || '新增属性',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    addHandle(childRef) {
      const { formModel } = childRef
      this.$api.settings.addTag(formModel).then(res => {
        this.responeHandle()
      })
    },
    editHandle(childRef) {
      const { delArr, formModel } = childRef
      const { tagValues, ...other } = formModel
      this.$api.settings.updateTag({
        ...other,
        addAndUpdate: tagValues,
        del: delArr
      }).then(res => {
        this.responeHandle('更新成功')
      })
    }
  }
}
</script>
