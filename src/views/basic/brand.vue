<template>
  <c-view>
		<template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addModal">新增</el-button>
			</div>
		</template>
    <Card>
      <el-form :inline="true" :model="optionData" class="demo-form-inline" size="small">
        <el-row type="flex" class="row-bg">
          <el-col :span="5">
            <el-form-item label="品牌国家:">
              <el-input v-model="optionData.country" placeholder="请输入品牌国家"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="品牌名称:">
              <el-input v-model="optionData.name" placeholder="请输入品牌名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="品牌别名:">
              <el-input v-model="optionData.ename" placeholder="请输入品牌别名"></el-input>
            </el-form-item>
          </el-col>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="searchBtn" >搜索</el-button>
          </el-form-item>
        </el-row>
      </el-form>

      <el-table
      :data="brandList"
      border
      style="width: 100%">
        <el-table-column
          label="品牌国家"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.country }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="品牌名称"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="品牌LOGO"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.logo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="品牌介绍"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.intro }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="品牌描述"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="品牌别名"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.ename }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="消费人群"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.consumer }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="封面图url"
          >
          <template slot-scope="scope">
            <img class="md-img" :src="scope.row.previewUrl" alt=""/>
          </template>
        </el-table-column>
        <el-table-column
          label="封面视频url"
          >
          <template slot-scope="scope">
            <a :href="scope.row.videoUrl" target="_blank" >
              <el-tag>
                查看视频
              </el-tag>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.statusCN }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="品牌排序"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建人"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.createdby }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="更新人"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.updatedby }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.created }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="modifModal(scope.$index, scope.row)">编辑</el-button>
            <el-popover
              placement="top"
              width="160"
              title="确定删除吗？"
              trigger="click"
              v-model="scope.row.visible">
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="danger" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteModal(scope.$index, scope.row, scope.row.visible = false)">确定</el-button>
              </div>
            <el-button
              slot="reference"
              size="mini"
              type="danger"
              class="el-icon-delete"
              >删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="black">
        <Page :total="listTotal" show-total @on-change="pageChange" />
      </div>

      <el-dialog
      :title="modalTitle"
      :visible.sync="showModal"
      width="50%"
      >
      <el-form ref="curCategoryDetail" :model="curCategoryDetail" label-width="90px" class="demo-ruleForm fromStyle">
        <el-row>
          <el-col :span="12">
             <el-form-item label="品牌国家:" >
              <el-input v-model="curCategoryDetail.country" placeholder="请填写品牌国家"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌名称:">
              <el-input v-model="curCategoryDetail.name" placeholder='请填写品牌名称'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
             <el-form-item label="品牌别名:" >
              <el-input v-model="curCategoryDetail.ename" placeholder="请填写品牌别名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消费人群:">
              <el-input v-model="curCategoryDetail.consumer" placeholder='请填写消费人群'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="品牌LOGO:" >
          <el-input v-model="curCategoryDetail.logo" placeholder="请填写品牌LOGO"/>
        </el-form-item>
        <el-form-item label="品牌介绍:">
          <el-input type="textarea" v-model="curCategoryDetail.intro" placeholder='请填写品牌介绍'></el-input>
        </el-form-item>
        <el-form-item label="品牌描述:">
          <el-input type="textarea" v-model="curCategoryDetail.description" placeholder='请填写品牌描述'></el-input>
        </el-form-item>
        <el-form-item label="封面图:">
          <!-- <el-input v-model="curCategoryDetail.previewUrl" placeholder='请填写封面图URL'></el-input> -->
          <el-upload
            class="upload-demo"
            action="//jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="封面视频:">
          <!-- <el-input v-model="curCategoryDetail.videoUrl" placeholder='请填写封面视频URL'></el-input> -->
           <el-upload
            class="upload-demo"
            action="//jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileVideoList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传mp4文件，且不超过1M</div>
          </el-upload>

        </el-form-item>
        <el-row v-if="brandType===1">
          <el-col>
            <el-form-item label="创建人:" >
              <el-input v-model="curCategoryDetail.createdby" placeholder='请填写创建人'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col>
            <el-form-item label="更新人:" >
              <el-input v-model="curCategoryDetail.updatedby" placeholder='请填写更新人'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态:" v-if="brandType===2">
          <el-radio-group v-model="curCategoryDetail.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
            <el-radio :label="3">删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input-number v-model="curCategoryDetail.sort" controls-position="right" @change="handleChange" :min="1" :max="10000"></el-input-number>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="contentModal = false">取 消</el-button>
          <el-button type="primary" @click="addModalBtn">确 定</el-button>
        </span>
      </el-dialog>
    </Card>
  </c-view>
</template>
<script>
export default {
  name: 'brand',
  data() {
    return {
      fileList: [{ name: 'a.jpg', url: 'http://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg' }], // 封面图list
      fileVideoList: [{ name: 'a.jpg', url: 'http://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg' }], // 视频
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],
      loading: false,
      brandList: [],
      listTotal: 0,
      query: {
        pageNum: 1,
        numPerPage: 10
      },
      optionData: {
        ename: '',
        name: '',
        country: ''
      },
      curCategoryDetail: {
        id: '', // 品牌id
        status: '', // 状态 1:启用 2:禁用 3:删除
        updatedby: '', // 更新人
        consumer: '', // 消费人群:小年轻,老头子,大妈,阿姨
        country: '', // 品牌国家
        createdby: '', // 创建人
        description: '', // 品牌描述
        ename: '', // 品牌别名
        intro: '', // 品牌介绍
        logo: '', // 品牌LOGO 图片ID
        name: '', // 品牌名称
        previewUrl: '', // 封面图url
        sort: 100, // 品牌排序 越小越靠前
        videoUrl: '' // 封面视频url
      },
      modalTitle: '',
      showModal: false,
      brandType: ''
    }
  },
  created() {
    this.brandLista()
  },
  methods: {
    handleRemove(file, fileList) { // 删除文件
      console.log(file, fileList)
    },
    handlePreview(file) { // 已上传的文件时的钩子
      console.log(file)
    },
    handleExceed(files, fileList) { // 文件超出个数限制时的钩子
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) { // 删除文件之前的钩子
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    addModal() {
      this.showModal = true
      this.modalTitle = '新增'
      this.brandType = 1
      this.curCategoryDetail = {}
      this.curCategoryDetail.sort = 100
    },
    modifModal(index, data) {
      this.showModal = true
      this.modalTitle = '修改'
      this.brandType = 2
      this.curCategoryDetail.id = this.brandList[index].id // 品牌id
      this.curCategoryDetail.status = this.brandList[index].status // 状态 1:启用 2:禁用 3:删除
      this.curCategoryDetail.updatedby = this.brandList[index].updatedby // 更新人
      console.log(this.brandList[index].updatedby)
      console.log('???????????????')
      this.curCategoryDetail.consumer = this.brandList[index].consumer // 消费人群:小年轻,老头子,大妈,阿姨
      this.curCategoryDetail.country = this.brandList[index].country // 品牌国家
      this.curCategoryDetail.createdby = this.brandList[index].createdby // 创建人
      this.curCategoryDetail.description = this.brandList[index].description // 品牌描述
      this.curCategoryDetail.ename = this.brandList[index].ename // 品牌别名
      this.curCategoryDetail.intro = this.brandList[index].intro // 品牌介绍
      this.curCategoryDetail.logo = this.brandList[index].logo // 品牌LOGO 图片ID
      this.curCategoryDetail.name = this.brandList[index].name // 品牌名称
      this.curCategoryDetail.previewUrl = this.brandList[index].previewUrl // 封面图url
      this.curCategoryDetail.sort = this.brandList[index].sort // 品牌排序 越小越靠前
      this.curCategoryDetail.videoUrl = this.brandList[index].videoUrl // 封面视频url
    },
    handleChange(val) {
      console.log(val)
    },
    addModalBtn() {
      let that = this
      if (!this.curCategoryDetail.country) {
        this.$Message.info('请输入品牌国家')
        return
      }
      if (!this.curCategoryDetail.name) {
        this.$Message.info('请输入品牌名称')
        return
      }
      if (!this.curCategoryDetail.logo) {
        this.$Message.info('请输入品牌LOGO')
        return
      }
      if (!this.curCategoryDetail.intro) {
        this.$Message.info('请输入品牌介绍')
        return
      }
      if (!this.curCategoryDetail.description) {
        this.$Message.info('请输入品牌描述')
        return
      }
      if (!this.curCategoryDetail.ename) {
        this.$Message.info('请输入品牌别名')
        return
      }
      if (!this.curCategoryDetail.consumer) {
        this.$Message.info('请输入消费人群')
        return
      }
      // if (!this.curCategoryDetail.previewUrl) {
      //   this.$Message.info('请输入封面图url')
      //   return
      // }
      // if (!this.curCategoryDetail.videoUrl) {
      //   this.$Message.info('请输入封面视频url')
      //   return
      // }
      if (!this.curCategoryDetail.createdby) {
        this.$Message.info('请输入创建人')
        return
      }
      if (!this.curCategoryDetail.sort) {
        this.$Message.info('请输入排序')
        return
      }
      // if (this.curCategoryDetail.status === '启用') {
      //   this.status = 1
      // } else if (this.curCategoryDetail.status === '禁用') {
      //   this.status = 2
      // } else {
      //   this.status = 3
      // }
      this.loading = !this.loading
      if (this.brandType === 1) {
        let data = {
          consumer: this.curCategoryDetail.consumer, // 消费人群:小年轻,老头子,大妈,阿姨
          country: this.curCategoryDetail.country, // 品牌国家
          createdby: this.curCategoryDetail.createdby, // 创建人
          description: this.curCategoryDetail.description, // 品牌描述
          ename: this.curCategoryDetail.ename, // 品牌别名
          intro: this.curCategoryDetail.intro, // 品牌介绍
          logo: this.curCategoryDetail.logo, // 品牌LOGO 图片ID
          name: this.curCategoryDetail.name, // 品牌名称
          // previewUrl: this.curCategoryDetail.previewUrl, // 封面图url
          previewUrl: 'http://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg',
          sort: this.curCategoryDetail.sort, // 品牌排序 越小越靠前
          // videoUrl: this.curCategoryDetail.videoUrl // 封面视频urls
          videoUrl: 'http://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg'
        }
        this.$api.basic.addBrand(data).then(res => {
          that.loading = !that.loading
          that.$Message.info('添加成功')
          that.brandLista()
          this.showModal = false
        })
      } else if (this.brandType === 2) {
        console.log('this.brandType:' + this.brandType)
        if (!this.curCategoryDetail.updatedby) {
          this.$Message.info('请输入更新人')
          return
        }
        if (!this.curCategoryDetail.status) {
          this.$Message.info('请选择状态')
          return
        }
        let data = {
          ...this.curCategoryDetail,
          status: this.curCategoryDetail.status // 状态 1:启用 2:禁用 3:删除
        }
        this.$api.basic.updateBrand(data).then(res => {
          that.loading = !that.loading
          that.$Message.info('修改成功')
          that.brandLista()
          this.showModal = false
        })
      }
    },
    closBtn() {
      this.showModal = false
    },
    brandLista() {
      let that = this
      let data = {
        ...this.query,
        ...this.optionData
      }
      this.loading = !this.loading
      this.$api.basic.brandList(data).then(res => {
        that.loading = !that.loading
        that.brandList = res.data
        that.listTotal = res.totalCount
      })
    },
    pageChange(page) {
      this.query.pageNum = page
      this.brandLista()
    },
    searchBtn() {
      this.pageNum = 1
      this.brandLista()
    },
    deleteModal(row, index) {
      const that = this
      const data = {
        id: index.id
      }
      that.$api.basic.deleteBrand(data).then(res => {
        that.$Message.success('删除成功')
        // 更新列表数据
        that.brandLista()
      })
    }
  }
}
</script>
<style scoped>
.table,
.select-bar,
.update-item,.control-bar {
  margin-bottom: 10px
}
.videoUrl{
  width: 150px;
  height: 100px;
  display: inline-block;
  text-align: center;
}
.videoItem{
  width: 100%;
}
.selectWidth{
  width: 200px;
  margin-bottom:10px
}
.deleteBtn{
  margin-right: 5px
}
.btnStyle{
  margin-bottom:10px
}
.addBtn{
  margin-left: 250px
}.cancleBtn{
  margin-left: 8px
}
.md-img{
  height: 60px;
}
.fromStyle{
  margin-right: 10px;
}
.fromNumStyle{
  text-align: left;
}
.title{
  display: flex;
  justify-content: space-between;
}
.imgStyle{
  width: 60px;
  height: 60px;
}
.black{
  margin-top: 10px;
}
</style>
