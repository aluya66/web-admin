
export default {
  data() {
    return {}
  },
  methods: {
    setTagsViewTitle() {
      const copyRoute = Object.assign({}, this.$route)
      const { meta, params } = this.$route
      const curTitle = this.$t(`route.${meta.title}`)
      const curRoute = Object.assign({}, copyRoute, { title: `${curTitle}-${params.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', curRoute)
    },
    goBack() {
      this.$router.go(-1)
    }
  },
  components: {}
}
