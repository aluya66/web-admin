<template>
  <div>
    <Layout>
      <Sider hide-trigger :style="{background: '#fff'}">
        <Menu active-name="area" theme="light" width="auto" @on-select="changeMenu" :accordion="true">
          <template  v-for="(item,index) in menuList">
            <Submenu :name="item.path" v-if="item.children.length" :key="index">
              <template slot="title">
                {{item.title}}
              </template>
                <MenuItem :name="name.path" v-for="(name,index) in item.children" :key="index">
                  {{name.title}}
                </MenuItem>
            </Submenu>
            <MenuItem :name="item.path" v-else :key="index">
              <template>
                {{item.title}}
              </template>
            </MenuItem>
          </template>
        </Menu>
      </Sider>
      <Content style="padding:10px">
        <router-view></router-view>
      </Content>
    </Layout>
  </div>
</template>

<script>
export default {
  name: 'basic',
  data() {
    return {
      menuList: [
        // { key:'bussiness',text:'业务线'},
        // { key:'area',text:'区域管理'},
        // { key:'version',text:'版本管理'},
        // { key:'category',text:'商品类目管理'},
        // { key:'brand',text:'品牌管理'},
        // { key:'lable',
        //   text:'商品标签',
        //   children: [
        //     { key: 'shopLable', text: '商品标签管理' },
        //     { key: 'userLable', text: '用户标签管理' },
        //     ]
        // },
        // { key:'logistics',text:'物流管理' },
        // { key:'merchandise',text:'商品类型'},
        // { key:'shop',
        //   text:'商品中心',
        //   children:[
        //     { key: 'shopCenter', text:'商品中心' },
        //     { key: 'shopCenterLog', text:'商品日志' },
        //     { key:'snapshoot',text:'快照管理' },
        //   ]
        // },
      ]
    }
  },
  created() {
    this.initMenuKey()
    this.getMuenList()
  },
  methods: {
    initMenuKey() {
      console.log('init======', this.$router)
    },
    changeMenu(key) {
      console.log(key)
      this.$router.push(`/basic/${key}`)
    },
    getMuenList() {
      this.$api.ipx.getMuenList({ parentId: 5 }).then(res => {
        if (res.code === 0) {
          this.menuList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
