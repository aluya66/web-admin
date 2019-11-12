import CCard from 'components/card'
import QueryDict from '../common/queryDict'

export default {
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    isView: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
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
  components: {
    CCard,
    QueryDict
  }
}
