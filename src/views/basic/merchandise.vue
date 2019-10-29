<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button type="primary" :size="size" icon="el-icon-plus" @click="showDialog">新增</el-button>
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
            <el-form-item label="类型名称">
              <el-input
                v-model="searchObj.name"
                class="search-item"
                :size="size"
                placeholder="请输入类型名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="参数分类">
              <el-select
                v-model="searchObj.type"
                :size="size"
                class="search-item"
                placeholder="请选择平台"
                clearable
              >
                <el-option
                  v-for="item in parameterSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="是否删除">
              <el-select
                v-model="searchObj.isDelete"
                :size="size"
                class="search-item"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in isDeleteSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="显示方式">
              <el-select
                v-model="searchObj.paramType"
                :size="size"
                class="search-item"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in paramTypeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
    </div>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <merchandise-add ref="childRef" :is-edit="dialogObj.isEdit" :init-data="dialogObj.initData"></merchandise-add>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import MerchandiseAdd from './merchandiseAdd'
import utils from 'utils'

export default {
  name: 'merchandise',
  mixins: [mixinTable],
  components: {
    CDialog,
    MerchandiseAdd
  },
  data(vm) {
    return {
      btnStatus: '',
      dialogObj: {}, // 对话框数据
      searchObj: {
        name: '',
        type: '',
        isDelete: '',
        dataTime: '',
        paramType: ''
      },
      parameterSelect: [
        {
          value: '0',
          label: '分类'
        },
        {
          value: 1,
          label: '参数'
        },
        {
          value: 2,
          label: '属性'
        }
      ],
      isDeleteSelect: [
        {
          value: '0',
          label: '否'
        },
        {
          value: '1',
          label: '是'
        }
      ],
      paramTypeSelect: [
        {
          value: 'checkbox',
          label: '复选框'
        },
        {
          value: 'radio',
          label: '单选框'
        },
        {
          value: 'select',
          label: '下拉选择'
        }
      ],
      pickerOptions: utils.pickerOptions,
      tableList: [],
      tableInnerBtns: [
        {
          width: 130,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              type,
              name,
              sort,
              bmsGoodsAttrVals,
              id,
              paramType
            } = row
            vm.showDialog({
              title: '编辑商品类型',
              initData: {
                type,
                name,
                sort,
                items: bmsGoodsAttrVals.map(({ value, id, description }) => ({ value, id, description })),
                paramType,
                id
              },
              isEdit: true
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { name, id } = row
            vm.confirmTip(`确认删除${name}商品类型`, () => {
              vm.deleteData({ id })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '类型名称',
          prop: 'name',
          fixed: true,
          width: 150
        },
        {
          label: '属性值',
          prop: 'value',
          formatter(row) {
            return row.bmsGoodsAttrVals.map(item => item.value).filter(d => d).join('/')
          }
        },
        {
          label: '参数分类',
          prop: 'type',
          width: 150,
          formatter(row) {
            return row.type ? vm.parameterSelect[row.type].label : '分类'
          }
        },
        {
          label: '显示方式',
          prop: 'paramType',
          width: 100,
          formatter(row, index) {
            return row.paramType === 'checkbox' ? '复选框' : row.paramType === 'radio' ? '单选框' : row.paramType === 'radio' ? '下拉框' : '无'
          }
        },
        {
          label: '排序',
          prop: 'sort',
          width: 100
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100
        },
        {
          label: '更新时间',
          prop: 'updated',
          width: 100
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
      this.$api.basic.getGoodsattrval({
        ...searchDate,
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
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          if (!this.dialogObj.isEdit) {
            this.addHandle(childFormModel)
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
        title: opts.title || '新增商品类型',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    addHandle(formModel) {
      let bmsGoodsAttrValAddReqs = []
      bmsGoodsAttrValAddReqs.push(formModel.items)
      let data = {
        ...formModel,
        bmsGoodsAttrValAddReqs: bmsGoodsAttrValAddReqs.flat()
      }
      this.$api.basic.addGoodsattrval(data).then(res => {
        this.$msgTip('新增成功')
        this.fetchData()
      })
      this.dialogObj.isShow = false
    },
    editHandle(childData) {
      const { delArr, formModel } = childData
      const { items, ...other } = formModel
      this.$api.basic.updateGoodsattrval({
        ...other,
        addAndUpdate: items,
        del: delArr
      }).then(res => {
        this.$msgTip('修改成功')
        this.dialogObj.isShow = false
        this.fetchData()
      })
      this.dialogObj.isShow = true
    },
    deleteData(param, msgTip = '删除成功') {
      this.$api.basic.deleteGoodsattrval(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
