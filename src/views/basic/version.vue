<template>
<c-view>
		<template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
		</template>
  <Card>
    <div class="select-bar">
      版本名称：
      <Input placeholder="请输入appcode" v-model="versionName" class="selectWidth" />
      平台：
      <Select v-model="platform" class="selectWidth">
        <Option value="">全部</Option>
        <Option value="0">安卓</Option>
        <Option value="1">IOS</Option>
      </Select>
      <Button type="primary" @click="searchBtn">搜索</Button>
      <Button type="primary" @click="addNewRelease">新增</Button>
    </div>
    <Table :loading="loading" border :columns="columns" :data="versionList" class="table" size="large">

      <template slot-scope="{ row }" slot="action">
        <span>
          <Poptip
            confirm
            title="确定发布吗?"
            @on-ok="okPublish({id: row.id})"
            @on-cancel="cancel"
            transfer
             v-if="row.publish === 0 &&row.enablePublish===true"
            >
            <Button type="primary">未发布</Button>
          </Poptip>
          <a v-else-if="row.publish === 0" href="#" class="lowEdition">低版本</a>
          <a v-else href="#" class="lowEdition">已发布</a>
        </span>
      </template>
      <template slot-scope="{ row }" slot="url">
        <span class="urlTop">
          <p class="urlCenter">
            {{row.url}}
          </p>
          <Poptip trigger="hover" title="URL" :content="row.url" word-wrap width="200" transfer>
            <Button>详情</Button>
          </Poptip>
        </span>
      </template>
      <template slot-scope="{ row }" slot="description">
        <span>
          <p class="urlCenter">
            {{row.description}}
          </p>
          <Poptip trigger="hover" title="描述" :content="row.description" word-wrap width="200" transfer>
            <Button>详情</Button>
          </Poptip>
        </span>
      </template>
      <template slot-scope="{ row }" slot="platform">
        <span v-if="row.platform===0">安卓</span>
        <span v-else>IOS</span>
      </template>
      <template slot-scope="{ row }" slot="force">
        <span v-if="row.force===0">不强制更新</span>
        <span v-else>强制更新</span>
      </template>
    </Table>
    <Page :total="listTotal" show-total @on-change="pageChange" />
    <!-- 新增 -->
    <Modal
      v-model="contentModal"
      title="新增"
      width="800"
      footer-hide
      >
      <Form :model="formLeft" label-position="right" :label-width="70" >
        <FormItem label="app版本">
          <Input v-model="formLeft.versionName" placeholder='请填写app版本'/>
        </FormItem>
        <FormItem label="URL">
          <Input v-model="formLeft.url" placeholder='请填写URL' :maxlength="200"/>
        </FormItem>
        <FormItem label="平台">
          <RadioGroup v-model="formLeft.platform">
            <Radio label="安卓" true-value='0'></Radio>
            <Radio label="IOS" true-value='1'></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="强制更新">
          <RadioGroup v-model="formLeft.force">
            <Radio label="不强制更新" true-value='0'></Radio>
            <Radio label="强制更新" true-value='1'></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="描述">
          <Input
            v-model="formLeft.description"
            placeholder='请填写描述'
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            :maxlength="200"
            />
        </FormItem>
        <FormItem>
          <Button type="primary" class="addBtn" @click="addReleaseBtn">确认</Button>
          <Button class="cancelBtn" @click="closeBtn">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</c-view>
</template>
<script>
const columns = [
  {
    title: 'app版本',
    key: 'versionName',
    align: 'center'
  },
  {
    title: '平台',
    slot: 'platform',
    align: 'center'
  },
  {
    title: 'url',
    slot: 'url',
    align: 'center',
    width: '300'
  },
  {
    title: '是否强制更新',
    slot: 'force',
    align: 'center'
  },
  {
    title: '描述',
    slot: 'description',
    align: 'center',
    width: '300'
  },
  {
    title: '操作',
    slot: 'action',
    align: 'center'
  }
]
export default {
  name: 'version',
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10
      },
      loading: false,
      listTotal: 0,
      versionList: [],
      columns,
      appCode: '',
      versionName: '',
      contentModal: false,
      formLeft: {
        // appCode: null,
        force: '', // 更新
        platform: '', // 0：安卓 1： ios
        // versionCode: '',      //版本号
        versionName: '', // 版本名称
        url: '', // 路径
        description: '' // 描述
      },
      platform: '',
      force: ''
    }
  },
  created() {
    this.queryVersionList()
  },
  methods: {
    okPublish(e) {
      let that = this
      let data = {
        versionId: e.id
      }
      this.$api.basic.releaseRelease(data).then(res => {
        that.$Message.info('发布成功')
        that.queryVersionList()
      })
    },
    cancel() {
    },
    closeBtn() {
      this.contentModal = false
    },
    searchBtn() {
      this.query.pageNum = 1
      this.queryVersionList()
    },
    addNewRelease() {
      this.contentModal = true
      this.formLeft = {}
    },
    addReleaseBtn() {
      let that = this
      if (!this.formLeft.versionName) {
        this.$Message.info('请填写app版本')
        return
      }
      if (!this.formLeft.url) {
        this.$Message.info('请填写路径')
        return
      }
      if (!this.formLeft.platform) {
        this.$Message.info('请选择平台')
        return
      }
      // if(!this.formLeft.force){
      //   this.$Message.info('请选择是否强制更新')
      //   return
      // }
      if (!this.formLeft.description) {
        this.$Message.info('请填写描述')
        return
      }
      if (this.formLeft.platform === '安卓') {
        this.platform = 0
      } else if (this.formLeft.platform === 'IOS') {
        this.platform = 1
      }
      if (this.formLeft.force === '不强制更新') {
        this.force = 0
      } else if (this.formLeft.force === '强制更新') {
        this.force = 1
      }
      let data = {
        ...this.formLeft,
        force: this.force,
        platform: this.platform
      }
      this.loading = !this.loading
      this.$api.basic.addRelease(data).then(res => {
        that.loading = !that.loading
        that.$Message.info('新增成功')
        that.platform = ''
        that.queryVersionList()
        that.contentModal = false
      })
    },
    queryVersionList() {
      let that = this
      let data = {
        ...this.query,
        versionName: this.versionName,
        platform: this.platform
      }
      this.loading = !this.loading
      this.$api.basic.queryAllVersion(data).then(res => {
        that.loading = !that.loading
        that.versionList = res.data
        that.listTotal = res.totalCount
      })
    },
    pageChange(page) {
      this.query.pageNum = page
      this.queryVersionList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.select-bar,
.title,.table{
  margin-bottom: 10px
}
.urlCenter{
    width: 220px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
.urlTop{
    margin: 10px 0;
  }
.selectWidth{
  width: 200px;
}
.lowEdition{
  margin:0;margin-bottom:6px;display:inline-block;text-decoration:none
}
.addBtn{
  margin-left: 40px
}
.cancelBtn{
  margin-left: 8px
}
</style>
