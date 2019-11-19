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
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
            <el-form-item label="属性名称">
              <el-input
                v-model="searchObj.tagName"
                class="search-item"
                :size="size"
                placeholder="属性名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="属性类型">
              <query-dict
                :dict-list="tagTypeList"
                class="search-item"
                :size="size"
                placeholder="请选择"
                :value.sync="searchObj.categoryId"
              ></query-dict>
            </el-form-item>
            <el-form-item label="属性值">
              <el-input
                v-model="searchObj.value"
                class="search-item"
                :size="size"
                placeholder="属性值"
                clearable
              />
            </el-form-item>
            <el-form-item label="业务线">
              <query-dict
                :dict-list="lobList"
                class="search-item"
                :size="size"
                placeholder="请选择"
                :value.sync="searchObj.categoryLob"
              ></query-dict>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker
                :size="size"
                v-model="searchObj.dataTime"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']"
              >align="right"></el-date-picker>
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
import utils from 'utils'
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
      lobList: dictObj.lobList, // 业务线集合
      disStatus: dictObj.disStatus, // 启用/禁用
      tagTypeList: [], // 属性集合
      dialogObj: {}, // 对话框数据
      searchObj: {
        tagName: '', // 属性名称
        categoryId: '', // 属性类型id
        value: '', // 属性值
        dataTime: '', // 操作时间
        tagStatus: '' // 是否禁用
      },
      pickerOptions: utils.pickerOptions,
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
          width: 150
        },
        {
          label: '属性类型',
          prop: 'categoryName'
        },
        {
          label: '属性值',
          prop: 'tagValues',
          width: 600,
          formatter(row) {
            return row.tagValues.map(item => item.value).filter(d => d).join('/')
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
            const lobObj = row.categoryLob && vm.lobList.find(res => row.categoryLob === res.value)
            return lobObj ? lobObj.label : ''
          }
        },
        {
          label: '属性状态',
          prop: 'tagStatus',
          formatter(row) {
            return row.tagStatus || row.tagStatus === 0 ? vm.disStatus[row.tagStatus].label : ''
          }
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100
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
        }
      })
    },
    fetchData() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
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
