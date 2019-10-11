<template>
  <c-view>
		<template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
		</template>
    <Card>
      <div class="select-bar">
        品牌国家：
        <Input placeholder="请输入品牌国家" v-model="optionData.country" class="selectWidth" />
        品牌名称：
        <Input placeholder="请输入品牌名称" v-model="optionData.name" class="selectWidth" />
        品牌别名：
        <Input placeholder="请输入品牌别名" v-model="optionData.ename" class="selectWidth" />
        <Button class="btnStyle" type="primary" @click="searchBtn"><Icon :size='16' type="ios-search" />搜索</Button>
        <Button class="btnStyle" type="primary" @click="addModal(1)"><Icon :size='16' type="ios-add-circle-outline"/>新增</Button>
      </div>
      <Table :loading="loading" border :columns="columns" :data="brandList" class="table">
        <template slot-scope="{ row }" slot="status">
          <span v-if="row.status==1">启用</span>
          <span v-if="row.status==2">禁用</span>
          <span v-if="row.status==3">删除</span>
        </template>
        <template slot-scope="{ row }" slot="previewUrl">
            <img class="md-img" :src="row.previewUrl" alt=""/>
        </template>
        <template slot-scope="{ row }" slot="videoUrl">
          <a :href="row.videoUrl" target="_blank" >
           <Button>查看视频</Button>
          </a>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button size="small" type="success" class="deleteBtn" @click="addModal(2, index)"><Icon :size='14' type="md-create" />编辑</Button>
          <Button size="small" type="error" class="deleteBtn" @click="deleteModal(row, index)"><Icon :size='14' type="ios-trash-outline" />删除</Button>
        </template>
      </Table>
      <Page :total="listTotal" show-total @on-change="pageChange" />
      <Modal
        v-model="showModal"
        :title="modalTitle"
        width="800"
        footer-hide
        >
        <Form :model="curCategoryDetail" label-position="right" :label-width="85" >
          <FormItem label="品牌国家：">
            <Input  placeholder='请填写品牌国家' v-model="curCategoryDetail.country" />
          </FormItem>
          <FormItem label="品牌名称：">
            <Input  placeholder='请填写品牌名称' v-model="curCategoryDetail.name" />
          </FormItem>
          <FormItem label="品牌LOGO：">
            <Input  placeholder='请填写品牌LOGO' v-model="curCategoryDetail.logo" />
          </FormItem>
          <FormItem label="品牌介绍：">
            <Input  placeholder='请填写品牌介绍' v-model="curCategoryDetail.intro" />
          </FormItem>
          <FormItem label="品牌描述：">
            <Input
              v-model="curCategoryDetail.description"
              placeholder='请填写品牌描述'
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
            />
          </FormItem>
          <FormItem label="品牌别名：">
            <Input  placeholder='请填写品牌别名' v-model="curCategoryDetail.ename"/>
          </FormItem>
          <FormItem label="消费人群：">
            <Input  placeholder='请填写消费人群' v-model="curCategoryDetail.consumer"/>
          </FormItem>
          <FormItem label="封面图URL：">
            <Input  placeholder='请填写封面图URL' v-model="curCategoryDetail.previewUrl"/>

          </FormItem>
          <FormItem label="封面视频URL：">
            <Input  placeholder='请填写封面视频URL' v-model="curCategoryDetail.videoUrl"/>
          </FormItem>
          <FormItem label="创建人：">
            <Input  placeholder='请填写创建人' v-model="curCategoryDetail.createdby"/>
          </FormItem>
          <FormItem label="更新人：" v-if="brandType===2">
            <Input  placeholder='请填写更新人' v-model="curCategoryDetail.updatedby"/>
          </FormItem>
          <FormItem label="状态：" v-if="brandType===2">
            <RadioGroup v-model="curCategoryDetail.status">
              <Radio label="启用" true-value='1'></Radio>
              <Radio label="禁用" true-value='2'></Radio>
              <Radio label="删除" true-value='3'></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="品牌排序：">
            <InputNumber :max="10000" :min="0" v-model="curCategoryDetail.sort"></InputNumber>
          </FormItem>
          <FormItem>
            <Button type="primary" class="addBtn" @click="addNotarizeModal">确认</Button>
            <Button class="cancleBtn" @click="closBtn">取消</Button>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  </c-view>
</template>
<script>
const columns = [
  // {
  //   title: 'code',
  //   key: 'code'
  // },
  {
    title: '品牌国家',
    key: 'country'
  },
  {
    title: '品牌名称',
    key: 'name'
  },
  {
    title: '品牌LOGO',
    key: 'logo'
  },
  {
    title: '品牌介绍',
    key: 'intro'
  },
  {
    title: '品牌描述',
    key: 'description'
  },
  {
    title: '品牌别名',
    key: 'ename'
  },
  {
    title: '消费人群',
    key: 'consumer'
  },
  {
    title: '封面图url',
    slot: 'previewUrl'
  },
  {
    title: '封面视频url',
    slot: 'videoUrl'
  },
  {
    title: '状态',
    slot: 'status'
  },
  {
    title: '品牌排序',
    key: 'sort'
  },
  {
    title: '创建人',
    key: 'createdby'
  },
  {
    title: '更新人',
    key: 'updatedby'
  },
  {
    title: '时间',
    key: 'created'
  },
  {
    title: '操作',
    slot: 'action'
  }
]
export default {
  name: 'brand',
  data() {
    return {
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],

      loading: false,
      columns,
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
    addModal(type, index) {
      this.showModal = true
      if (type === 1) {
        this.modalTitle = '新增'
        this.brandType = 1
        this.curCategoryDetail = {}
        this.curCategoryDetail.sort = 100
      } else if (type === 2) {
        this.modalTitle = '修改'
        this.brandType = 2
        // this.curCategoryDetail.target=this.brandList[index].target
        this.curCategoryDetail.id = this.brandList[index].id // 品牌id
        this.curCategoryDetail.status = this.brandList[index].status ? this.brandList[index].statusCN : '' // 状态 1:启用 2:禁用 3:删除
        this.curCategoryDetail.updatedby = this.brandList[index].updatedby ? this.brandList[index].updatedby : '' // 更新人
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
      }
    },
    addNotarizeModal() {
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
      if (!this.curCategoryDetail.previewUrl) {
        this.$Message.info('请输入封面图url')
        return
      }
      if (!this.curCategoryDetail.videoUrl) {
        this.$Message.info('请输入封面视频url')
        return
      }
      if (!this.curCategoryDetail.createdby) {
        this.$Message.info('请输入创建人')
        return
      }
      if (!this.curCategoryDetail.sort) {
        this.$Message.info('请输入排序')
        return
      }
      if (this.curCategoryDetail.status === '启用') {
        this.status = 1
      } else if (this.curCategoryDetail.status === '禁用') {
        this.status = 2
      } else {
        this.status = 3
      }
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
          previewUrl: this.curCategoryDetail.previewUrl, // 封面图url
          sort: this.curCategoryDetail.sort, // 品牌排序 越小越靠前
          videoUrl: this.curCategoryDetail.videoUrl // 封面视频urls
        }
        this.$api.basic.addBrandList(data).then(res => {
          that.loading = !that.loading
          that.$Message.info('添加成功')
          that.brandLista()
          this.showModal = false
        })
      } else if (this.brandType === 2) {
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
          status: this.status // 状态 1:启用 2:禁用 3:删除
        }
        this.$api.basic.updateBrandList(data).then(res => {
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
    deleteModal(row) {
      const that = this
      const data = {
        id: row.id
      }
      this.$Modal.confirm({
        title: '提示',
        content: '是否确定删除该品类？',
        onOk: () => {
          that.$api.basic.deleteBrandList(data).then(res => {
            that.$Message.success(res.message)
            // 更新列表数据
            that.brandLista()
          })
        },
        onCancel: () => {
        }
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
  /* width: 100px; */
  height: 60px;
  /* display: inline-block */
}
</style>
