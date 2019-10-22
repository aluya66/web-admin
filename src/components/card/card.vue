<template>
  <el-card :class="bem()">
    <div slot="header" v-if="name" class="clearfix">
      <span>{{name}}</span>
      <el-button v-if="btn.name" :class="bem('btn')" type="text" @click="clickEvent">{{btn.name}}</el-button>
    </div>
    <slot></slot>
  </el-card>
</template>

<script>
import create from 'utils/create'

export default create({
  name: 'card',
  props: {
    name: {
      type: String,
      default: ''
    },
    btn: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  methods: {
    clickEvent() {
      this.$emit('do-emit')
    }
  },

  components: {

  }
})
</script>

<style lang='less'>
.c-card {
  margin-bottom: 10px;
  .el-card__header {
    padding: 15px 15px 10px 15px;
    font-weight: bold;
    font-size: @f16;
  }
  &__btn{

  }
}
</style>
