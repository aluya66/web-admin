<template>
  <c-view>
    <template v-slot:header>
      <el-row type="flex">
        <el-col class="title">
          {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        </el-col>
        <el-col :span="1" class="searchBtn">
          <el-button type="primary" size="small" icon="el-icon-circle-plus" @click="addNewRelease">
            新增</el-button>
        </el-col>
      </el-row>
    </template>
    <Card>
      <div class="select-bar">
        <el-form :inline="true" class="demo-form-inline">
          <el-row type="flex" class="selectBox">

            <el-form-item label="版本名称:" class="inputLabel">
              <el-input placeholder="请输入版本名称" v-model="versionName" size="small"></el-input>
            </el-form-item>



            <el-form-item label="平台:" class="inputLabel">
              <el-select placeholder="请选择平台" v-model="platform" size="small">
                <el-option label="全部" value=""></el-option>
                <el-option label="安卓" value="0"></el-option>
                <el-option label="IOS" value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-col :span="1" class="searchBtn">
              <el-button type="primary" size="small" icon="el-icon-search" @click="searchBtn">搜索
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <Table :loading="loading" border :columns="columns" :data="versionList" class="table"
        size="large">

        <template slot-scope="{ row }" slot="status">
            <a v-if="row.publish === 0 &&row.enablePublish===true" href="#" class="lowEdition">
                <Icon :size='16' type="md-close" />未发布</a>
            <a v-else-if="row.publish === 0" href="#" class="lowEdition">
              <Icon :size='16' type="md-close" />低版本</a>
            <a v-else href="#" class="lowEdition">
              <Icon :size='16' type="md-checkmark" />已发布</a>
        </template>

        <template slot-scope="{ row }" slot="action">
            <Poptip confirm title="确定发布吗?" @on-ok="okPublish({id: row.id})" @on-cancel="cancel"
              transfer v-if="row.publish === 0 &&row.enablePublish===true">
              <el-button type="primary" size="small" icon="el-icon-finished">发布</el-button>
            </Poptip>
            <el-button v-else type="info" disabled size="small">已发布</el-button>
            
        </template>
        <template slot-scope="{ row }" slot="url">
          <div class="urlBox">
            <p class="urlCenter">
              {{row.url}}
            </p>
            <Poptip trigger="hover" title="URL" :content="row.url" word-wrap width="200" transfer>
              <el-button size="mini" round>详情</el-button>
            </Poptip>
            <el-button size="mini" round  @click="copySpecialTopicUrl(row.url)">复制</el-button>
            <el-button size="mini" round @click="downPackage">下载</el-button>
          </div>
        </template>
        <template slot-scope="{ row }" slot="description">
          <div class="urlBox">
            <p class="urlCenter">
              {{row.description}}
            </p>
            <el-tooltip placement="top">
                <div slot="content" class="text-wrapper" >{{row.description}}</div>
                <el-button size="mini" round>详情</el-button>
            </el-tooltip>
          </div>
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
      <Modal v-model="contentModal" title="新增" width="800" footer-hide>
        <Form :model="formLeft" label-position="right" :label-width="70" class="fromStyle">
          <FormItem label="app版本">
            <Input v-model="formLeft.versionName" placeholder='请填写app版本' />
          </FormItem>
          <FormItem label="URL">
            <Input v-model="formLeft.url" placeholder='请填写URL' :maxlength="200" />
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
            <Input v-model="formLeft.description" placeholder='请填写描述' type="textarea"
              :autosize="{minRows: 2,maxRows: 5}" :maxlength="200" />
          </FormItem>
          <FormItem class="addBtn">
            <Button type="primary" @click="addReleaseBtn">确认</Button>
            <Button @click="closeBtn">取消</Button>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  </c-view>
</template>
<script>
  const columns = [{
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
      title:'状态',
      slot:'status',
      align:'center'
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
      cancel() {},
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
        // this.loading = !this.loading
        this.$api.basic.queryAllVersion(data).then(res => {
          // that.loading = !that.loading
          if(res){
            that.versionList = res.data
            that.listTotal = res.totalCount
          }else{
            that.versionList = []
            that.listTotal = 1
          }
          
        })
      },
      pageChange(page) {
        this.query.pageNum = page
        this.queryVersionList()
      },
      // 复制粘贴
      copySpecialTopicUrl(url){
        console.log(url);
        var oInput = document.createElement('input'); //创建一个隐藏input（重要！）
        oInput.value = url;    //赋值
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        this.$message.success('复制成功');
      },
      downPackage(){
        this.$message({
          message: '该功能尚未开放,敬请期待',
          type: 'warning'
        });
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .selectBox {
    flex-wrap: wrap;
  }

  .inputLabel {
    margin-right: 40px;
  }

  .select-bar,
  .table {
    margin-bottom: 10px
  }

  .urlCenter {
    width: 220px;
    margin: 0 auto 4px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .urlBox {
    margin: 10px 0;
  }

  .selectWidth {
    width: 200px;
  }

  .lowEdition {
    margin: 0;
    display: inline-block;
    text-decoration: none
  }

  .addBtn {
    text-align: right;
  }

  .cancelBtn {
    margin-left: 8px
  }

  .searchBtn {
    padding: 7px;
    margin-right: 20px;
  }

  .fromStyle {
    margin-right: 10px
  }
  .wrap_one{
    display: inline-block;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 18px;
    cursor: pointer;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
