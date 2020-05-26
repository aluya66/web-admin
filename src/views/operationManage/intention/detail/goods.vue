<template>
<c-card :name="title" class="form-card" id="form-goods">
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="120px"
      :rules="rules"
      class="form"
      label-position="right"
    >
     <div class="goods-box">
      <table class="el-table goods-table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th style="width: 100px;">商品类型</th>
            <th style="width: 200px;">版型</th>
            <th style="width: 150px;">款式</th>
            <th style="width: 150px;">预订数量</th>
            <th style="width: 150px;">滤芯（搭配一片口罩）</th>
            <th style="width: 150px;">备注</th>
            <th style="width: 150px;">操作</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(item,index) in formModel.goodsList" :key="index">
                <td>
                    {{item.name}}
                </td>
                <td>
                    <el-select v-if="item.specs.type == '' || item.specs.type" class="select-item" v-model="item.specs.type" placeholder="请选择">
                        <el-option
                            v-for="item in stereotype"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </td>
                <td> 
                    <el-select v-model="item.style" placeholder="请选择" v-if='item.name != "包装袋" || item.id != "3"'>
                        <el-option
                            v-for="item in intentionStyle"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="item.style" placeholder="请选择" v-else>
                        <el-option
                            v-for="item in intentionBoxStyle"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </td>
                <td>
                    <el-input
                        type="text"
                        class="select-item"
                        v-model.number="item.qty"
                        placeholder="请输入1-100万的正整数"
                        @change="numsRule(item.qty,0)"
                        clearable
                    ></el-input>
                </td>
                <td>
                    <el-input v-if="item.specs.filter == '' || item.specs.filter"
                        type="text"
                        placeholder="请输入1-99的正整数"
                        @change="numsRule(item.specs.filter,1)"
                        v-model.number="item.specs.filter"
                    ></el-input>
                </td>
                <td>
                    <el-input
                        type="textarea"
                        placeholder="请输入备注"
                        class="select-item"
                    ></el-input>
                </td>
                <td>
                    <el-button type="text" icon="el-icon-delete" @click="deteldata(index)">删除</el-button>    
                </td>
            </tr>
            
        </tbody>
      </table>
    </div>
    </el-form>
</c-card>
</template>

<script>
import dictObj from '@/store/dictData'
import CCard from 'components/card'

export default {
  components: {
    CCard
  },
  computed: {
    formModel() {
      console.info(this.dataObj,"11111")
      return this.dataObj
    }
  },
  data(vm) {
   
    return {
      stereotype: dictObj.stereotype, // 类型列表
      intentionStyle: dictObj.intentionStyle, // 款式
      intentionBoxStyle: dictObj.intentionBoxStyle, //包装款式
      rules: {
      
       }  
    }
  },
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  created() {
      //todo...
  },
  methods: {
      numsRule(value,type){
        if(value === ''){
            this.formModel.goodFlag = true;
            return
        }
        if(type === 0){ //预订数量
            // 校验数字不能大于100w
            if (value > 1000000 || value < 1 || !/\d+/.test(value)) {
                this.formModel.goodFlag = false;
                this.$msgTip('预订数量不能小于1或者大于100W','error');   
                return
            }
        }
        if(type === 1){ //滤芯
            if(value >= 100 || value < 0 || !/\d+/.test(value)){
                this.formModel.goodFlag = false;
                this.$msgTip('滤芯数量不能小于0或者大于99','error');   
                return      
            }
        }
         this.formModel.goodFlag = true;
      },
      deteldata(index){
         this.formModel.goodsList.splice(index,1)
      }
  }

}
</script>

<style lang="less" scoped>
.form-card {
  .el-form-item {
    width: 98%;
    margin-bottom: 15px;
  }
  .select-item {
    width: 90%;
  }
  .pic {
    padding-bottom: 25px;
    span {
      display: inline-block;
      margin-bottom: 10px;
    }
    .info {
      line-height: 20px;
      height: 20px;
      margin-top: 5px;
      font-size: @f12;
    }
  }
  .goods-box{
      .goods-table{
           border: 1px solid @border-default;
            td,
            th {
            border-right: 1px solid @border-default;
            text-align: center;
            .el-input {
                width: 80%;
            }
            &:last-child {
                border-right: none;
            }
        }
      }   
  }
  .tempimg {
    width: 200px;
    height: 200px;
    display: inline-block;
    margin-right: 5px;
  }
}
</style>
