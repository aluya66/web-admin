import QueryDict from '../common/queryDict'

export default {
  data() {
    const checkIntNoQuired = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (value && Number(value) > 0 && Number.isInteger(Number(value))) {
        callback()
      } else {
        return callback(new Error('请输入整数'))
      }
    }
    const checkInt = (rule, value, callback) => {
      if (value && Number(value) > 0 && Number.isInteger(Number(value))) {
        callback()
      } else {
        return callback(new Error('请输入整数'))
      }
    }
    const checkNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('字段不能为空'))
      } else if (/^([1-9]{1}\d{0,6})(\.\d{0,2})?$/.test(value) || /^(0{1})(\.\d{0,2})?$/.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入最多两位小数的数字'))
      }
    }
    return {
      checkInt,
      checkIntNoQuired,
      checkNumber,
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
    // 多个form子表单处理
    getFormPromise(form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res)
        })
      })
    },
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
