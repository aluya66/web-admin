import QueryDict from '../common/queryDict'

export default {
  data() {
    const checkInt = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('字段不能为空'))
      } else if (!Number(value) || !Number.isInteger(Number(value)) || Number(value) <= 0) {
        return callback(new Error('请输入整数'))
      }
      callback()
    }
    const checkNumber = (rule, value, callback) => {
      if (!value || !Number(value) || Number(value) < 0) return callback(new Error('请输入数字'))
      callback()
    }
    return {
      dictData: {} // 字典数据
    }
  },
  created() {
    if (this.dictOpts) { // 业务页面配置字典参数时触发
      const { codes, dictLob } = this.dictOpts
      if (codes && codes.length) {
        this.$store.dispatch('views/getDict', {
          codes,
          dictLob
        }).then(res => {
          this.dictData = res
        })
      }
    }
  },
  methods: {
    setTagsViewTitle() {
      const copyRoute = Object.assign({}, this.$route)
      const { meta, params } = this.$route
      const curTitle = this.$t(`route.${meta.title}`)
      const curRoute = Object.assign({}, copyRoute, { title: `${curTitle}-${params.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', curRoute)
    },
    /**
     * 返回
     */
    goBack() {
      this.$router.go(-1)
    },
    /**
     * 关闭当前页面
     */
    closeCurrentTag() {
      this.$store.dispatch('tagsView/delView', this.$route)
    }
  },
  components: {
    QueryDict
  }
}
