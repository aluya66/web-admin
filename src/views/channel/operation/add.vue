<template>
  <c-view>
     <template v-slot:header>
        <el-page-header
         @back="goBack"
          :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
        ></el-page-header>
      </template>
    <div class="main__box">
      <el-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-width="120px"
        class="dialog-form"
        label-position="right"
        status-icon
      >
        <el-form-item label="机构编码:" prop="operationCode" v-if="formModel.operationCode">
         {{formModel.operationCode}}
        </el-form-item>

        <el-form-item label="机构名称:" prop="operationName">
          <el-input v-model.trim="formModel.operationName"  class="select-item" clearable></el-input>
        </el-form-item>
        <el-form-item label="机构状态:" prop="status">
          <query-dict
            show-type="radio"
            :dict-list="openStatus"
            :value.sync="formModel.status"
          ></query-dict>
        </el-form-item>
        <el-form-item label="所属商户:" prop="businessCode">
          <el-select
                v-model="formModel.businessCode"
                :size="size"
                class="search-item"
                placeholder="请选择商户"
                clearable
                filterable
              >
                <el-option
                  v-for="item in bussinessList"
                  :key="item.businessCode"
                  :label="item.businessName"
                  :value="item.businessCode"
                ></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="机构地址:" prop="addressCode">
          <el-cascader
            clearable
            class="select-item"
            :options="areaOptions"
            :props="optionsProps"
            placeholder="选择机构地址"
            filterable
            v-model="formModel.addressCode"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址:" prop="operationAddress">
          <el-input v-model.trim="formModel.operationAddress"  class="select-item" clearable></el-input>
        </el-form-item>
         <el-form-item label="联系人:" prop="responsibleName">
          <el-input v-model.trim="formModel.responsibleName"  class="select-item" clearable></el-input>
        </el-form-item>
         <el-form-item label="联系手机:" prop="responsiblePhone">
          <el-input v-model.trim="formModel.responsiblePhone"  class="select-item" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :size="size"
            :loading="btnLoading"
            type="primary"
            @click.native.prevent="submitHandle"
          >保存</el-button>
          <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </c-view>
</template>

<script>

import dictObj from '@/store/dictData'
import MixinForm from 'mixins/form'
import utils from 'utils'
import QueryDict from '@/views/common/queryDict'
export default {
  components: {
    QueryDict
  },
  mixins: [MixinForm],
  data() {
    return {
      rules: {
         operationName: [
          { required: true, message: '机构名称不能为空', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '机构状态不能为空', trigger: 'change' }
        ],
        businessCode: [
          { required: true, message: '所属商户不能为空', trigger: 'blur' }
        ],
        addressCode: [
          { required: true, message: '机构地址不能为空', trigger: 'blur' }
        ],
        operationAddress: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ],
        responsibleName: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        responsiblePhone: [
          { required: true, message: '联系手机不能为空', trigger: 'blur' },
          {validator: utils.validater.phoneNumber,message: '请输入正确的手机号码',trigger: 'blur'}
        ],
      },
      btnLoading: false,
      formModel: {},
      areaOptions: [],
      optionsProps: {
        value: 'code',
        label: 'name',
        leaf: 2
      },
      bussinessList: [],// 商户数据
       openStatus: dictObj.openStatus,
    }
  },

  // computed: {
  //   formModel: {
  //     get() {
  //       return this.initData
  //     },
  //     set(val) {
  //       this.$emit('update:init-data', val)
  //     }
  //   }
  // },
  created() {
    this.fetchData()
    this.fetchAreaData()
    this.getBusiness()
  },
  methods: {
    /**
     *  获取全部区域数据
    */
    fetchAreaData() {
      this.$api.basic.getAllArea().then(res => {
        if (res && res.length) {
          this.areaOptions = res
        }
      })
    },
    fetchData() {
      const { id } = this.$route.params
      if (id) {
        this.$api.operation.queryOperationDetail({ id }).then(res => {
          this.setTagsViewTitle()
          this.formModel = {
            ...res,
            addressCode: [res.operationProvince, res.operationCity, res.operationDistrict] // 区域code }
          }
        })
      }
    },
    submitHandle() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const { status,operationName, businessCode, addressCode, operationAddress, responsibleName, responsiblePhone } = this.formModel
          const requestMethods = {
            'add': this.$api.operation.addOperation,
            'update': this.$api.operation.updateOperation
          }
          let request = null
          let params = {
            // 机构名称
            operationName,
            // 机构状态
            status,
            // 所属商户
            businessCode ,
            // 机构地址
            operationProvince: addressCode[0],
            operationCity: addressCode[1],
            operationDistrict: addressCode[2],
            // 详情地址
            operationAddress,
            // 联系人
            responsibleName,
            // 联系手机
            responsiblePhone
          }
          const { id } = this.$route.params
          if (id) {
            request = requestMethods['update']
            params = { id, ...params }
          } else {
            request = requestMethods['add']
          }
          request(params).then((res) => {
            this.$msgTip(id ? '更新成功' : '新增成功').then(() => {
              this.closeCurrentTag()
              this.goBack()
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 商户列表数据
    getBusiness() {
      this.$api.channel.queryBusinessList({
        pageNo: 1,
        pageSize: 20
      }).then(res => {
        this.bussinessList = res.data
      })
    }
  }
}
</script>
