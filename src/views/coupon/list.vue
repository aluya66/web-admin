<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button :size="size" type="primary" icon="el-icon-plus" @click="showDialog">新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        selection
        hasBorder
        :max-height="450"
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
            <el-form-item label="商品名称">
              <el-input
                v-model="searchObj.goodsName"
                class="search-item"
                :size="size"
                placeholder="请输入商品名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="商品编码">
              <el-input
                v-model="searchObj.goodsBn"
                class="search-item"
                :size="size"
                placeholder="请输入商品编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="商品类目">
              <el-input
                v-model="searchObj.categoryCode"
                class="search-item"
                :size="size"
                placeholder="请输入商品类目"
                clearable
              />
            </el-form-item>
            <!-- <el-form-item label="经营类型">
              <el-input
                v-model="searchObj.businessValue"
                class="search-item"
                :size="size"
                placeholder="请输入操作人"
                clearable
              />
            </el-form-item>-->
            <el-form-item label="品牌">
              <el-input
                v-model="searchObj.brandName"
                class="search-item"
                :size="size"
                placeholder="请输入品牌"
                clearable
              />
            </el-form-item>
            <el-form-item label="上下架">
              <el-select
                v-model="searchObj.marketable"
                :size="size"
                class="search-item"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in marketableSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作时间">
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
        <add-goods ref="childRef" :init-data="dialogObj.initData"></add-goods>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'
import CDialog from 'components/dialog'
import AddGoods from './addGoods'

export default {
  mixins: [mixinTable],
  components: {
    CDialog,
    AddGoods
  },
  data(vm) {
    return {
      dialogObj: {}, // 对话框数据
      searchObj: {
        // businessValue: '',
        categoryCode: '',
        goodsBn: '',
        goodsName: '',
        marketable: '',
        brandName: '',
        dataTime: ''
      },
      marketableSelect: [{
        value: '1',
        label: '上架'
      },
      {
        value: '2',
        label: '下架'
      }],
      pickerOptions: utils.pickerOptions,
      tableInnerBtns: [{
        width: 130,
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          vm.showDialog({
            title: '编辑商品',
            initData: row,
            isEdit: true
          })
        }
      }, {
        name: '删除',
        icon: 'el-icon-delete',
        handle(row) {
          const { goodsName, id } = row
          vm.confirmTip(`确认删除${goodsName}商品信息`, () => {
            vm.deleteData({ id })
          })
        }
      }],
      tableHeader: [
        {
          label: '商品ID',
          prop: 'id',
          width: 120,
          fixed: true
        },
        {
          label: '商品名称',
          prop: 'goodsName',
          width: 200
        },
        {
          label: '商品图片',
          prop: 'coverImg',
          width: 100,
          isImage: true
        },
        {
          label: '商品编码',
          prop: 'goodsBn'
        },
        {
          label: '商品类目',
          prop: 'categoryName'
        },
        {
          label: '品牌',
          prop: 'brandName'
        },
        {
          label: '库存',
          prop: 'retailPrice',
          width: 100
        },
        {
          label: '成本价',
          prop: 'marketable',
          width: 100
        },
        {
          label: '市场价',
          prop: 'memberPrice',
          width: 100
        },
        {
          label: '销售价',
          prop: 'mktPrice',
          width: 100
        },
        {
          label: '上架状态',
          prop: 'marketable',
          width: 100,
          formatter(row) {
            return row.marketable ? vm.marketableSelect[row.marketable - 1].label : ''
          }
        },
        {
          label: '上货人',
          prop: 'tagPrice',
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
    /**
     * 获取表格数据
    */
    fetchData() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
      this.isLoading = true
      this.$api.goods.getList(
        {
          ...searchDate,
          ...other,
          ...page
        }
      ).then(res => {
        this.isLoading = false
        if (res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data
        } else {
          this.tableList = res
        }
      })
    },
    /**
     * 删除表格单条数据
     *
     * @param {*} curPromise
     * @param {string} [msgTip='删除成功']
     */
    deleteData(param, msgTip = '删除成功') {
      console.log(param, msgTip)
      // 主要修改接口
      this.$api.basic.deleteBrand(param).then(() => {
        this.$msgTip(msgTip)
        if (this.tableList.length === 1) {
          const { pageNum } = this.pageInfo
          this.pageInfo.pageNum = pageNum > 1 ? pageNum - 1 : 1
        }
        this.fetchData()
      })
    },
    /**
     * 对话框确认按钮，集成了表单提交功能
     */
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const childFormModel = childRef.formModel
          if (!this.dialogObj.isEdit) {
            this.addHandle()
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
        title: opts.title || '新增商品',
        isEdit: opts.isEdit || false,
        initData: opts.initData
      }
    },
    /**
     * 确认新增操作
    */
    addHandle() {
      // codeing ajax
      // ajax成功方法里面加入 关闭对话框标识
      this.dialogObj.isShow = false
    },
    /**
     * 确认修改操作
    */
    editHandle(formModel) {
      // codeing ajax
      // ajax成功方法里面加入 关闭对话框标识
      this.dialogObj.isShow = false
    }
  }
}
</script>
