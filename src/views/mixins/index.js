export default {
  methods: {
    /**
     * 国际化翻译
     * @param {*} name 需要处理的i18n 的key值
     * @param {*} model key对应的对象
     */
    setTitleLang(name, model) {
      const hasKey = model ? this.$te(`${model}.${name}`) : this.$te(name)

      if (hasKey) {
        const curVal = model ? this.$t(`${model}.${name}`) : this.$t(name)

        return curVal
      }
      return name
    },
    /**
     * 路由跳转，支持push、replace，location
     * @param {*} to
     * @param {*} replace
     * @param {*} url
     */
    routerLink(to, replace, url) {
      const {
        $router
      } = this
      if (to && $router) {
        $router[replace ? 'replace' : 'push'](to)
      } else if (url) {
        replace ? location.replace(url) : (location.href = url)
      }
    }
  }
}
