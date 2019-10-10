<template>
	<c-view>
		<div class="box">
			<c-form :form-items="formItems" :form-btns="formBtns"></c-form>
		</div>
	</c-view>
</template>

<script>
import CForm from 'components/form'
import utils from 'utils'

export default {
  components: {
    CForm
  },
  data () {
    return {
      formItems: [
        {
          label: '工作类型',
          name: 'typeName',
          type: 'input'
        }
      ]
    }
  },
  created () {
    const { id } = this.$route.params
    if (id) {
      const { name } = utils.getStore('_WORKTYPEINFO')
      this.form.name = name
    } else {
      utils.setStore('_WORKTYPEINFO', '')
    }
  },
  methods: {
    onSubmit () {
      utils.setStore('_WORKTYPEINFO', '')
    },
    onCancel () {
      utils.setStore('_WORKTYPEINFO', '')
      this.$router.go(-1)
    }
  }
}
</script>
