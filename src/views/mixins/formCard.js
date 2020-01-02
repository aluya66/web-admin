import CCard from 'components/card'
import QueryDict from '../common/queryDict'

export default {
  props: {
    title: String,
    dataObj: {
      type: [Object, Array],
      required: true
    },
    isView: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formModel: {
      get() {
        return this.dataObj
      },
      set(val) {
        this.$emit('update:data-obj', val)
      }
    }
  },
  methods: {
    /**
    * 返回
    */
    goBack() {
      this.$router.go(-1)
    },
  },
  components: {
    CCard,
    QueryDict
  }
}
