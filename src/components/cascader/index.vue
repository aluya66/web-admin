<template>
	<div class="cascader">
		<div class="cur-tags">
			<el-tag
				:key="index"
				v-for="(tag, index) in curItems"
				size="medium"
				:closable="!disabled"
				:disabled-transitions="false"
				@close="handleClose(tag)"
			>
				{{ tag.label }}
			</el-tag>
		</div>
		<el-cascader
			ref="curCascader"
			class="cur-cascader"
			:options="options"
			:show-all-levels="false"
			@change="addOption"
			v-model="curSelectedOptions"
			change-on-select
			:disabled="disabled"
			@visible-change="showClose"
			:placeholder="curPlaceholder"
		></el-cascader>
	</div>
</template>
<script>
import utils from 'utils'
export default {
  name: 'c-cascader',
  props: {
    options: {
      type: Array,
      default () {
        return []
      }
    },
    selectedOptions: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择区域'
    },
    isSingle: {
      type: Boolean,
      default: false
    },
    resetSelect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      curArea: [], // 当前选中的级联数据
      curItems: [],
      curSelectedOptions: [],
      initInputHeight: null
    }
  },
  computed: {
    curPlaceholder () {
      console.log(this.curItems)
      return this.curItems.length ? '' : this.placeholder
    }
  },
  mounted () {
    this.curItems = this.selectedOptions
    this.initInputHeight = utils.getStyle(
      document.querySelector('.cascader input'),
      'height'
    )
  },
  updated () {
    this.setInputHeight()
  },
  methods: {
    setInputHeight () {
      let curTagHeight =
				parseInt(utils.getStyle(document.querySelector('.cur-tags'), 'height')) || 28
      if (curTagHeight) {
        const num = curTagHeight / 28
        document.querySelector('.cascader input').style.height = `${parseInt(
          this.initInputHeight
        ) * num}px`
      }
    },
    handleClose (tag) {
      this.curItems = this.curItems.filter(res => res.value !== tag.value)
      if (!this.curItems.length) {
        this.curArea = []
        this.$emit('update:selectedOptions', [])
        this.curSelectedOptions = []
      } else {
        this.$emit('update:selectedOptions', this.curItems)
      }
    },
    addOption (val) {
      this.curArea = val.map((res, index) => {
        return {
          label: this.$refs.curCascader.currentLabels[index],
          value: res
        }
      })
      document.querySelector('.cur-tags').style.visibility = 'hidden'
    },
    showClose (val) {
      if (!val && this.curArea.length) {
        let lastItem = []
        const lastPath = []
        this.curArea.forEach((res, index) => {
          lastPath.push(res.label)
          if (this.curArea[index].label.indexOf('不选择') !== -1) {
            lastPath.pop()
            lastItem = { ...this.curArea[index - 1], pathArr: lastPath }
          } else if (index === this.curArea.length - 1) {
            lastItem = { ...this.curArea[index], pathArr: lastPath }
          }
        })
        if (!this.isSingle) {
          if (!this.curItems.length) {
            this.curItems.push(lastItem)
          } else {
            let isTrue = this.curItems.some(
              res => res.value === lastItem.value
            )
            if (!isTrue) {
              let curFilterItem = this.curItems.filter(
                res =>
                  !res.pathArr.includes(
                    lastItem.pathArr[lastItem.pathArr.length - 1]
                  )
              )
              curFilterItem.push(lastItem)
              this.curItems = curFilterItem
            }
          }
        } else {
          this.curItems = [lastItem]
        }
        if (this.resetSelect) {
          this.curSelectedOptions = []
        }
        this.$emit('update:selectedOptions', this.curItems)
        document.querySelector('.cur-tags').style.visibility = 'visible'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.cur-cascader {
	width: 100%;
	position: relative;
}
.cur-tags {
	position: absolute;
	white-space: normal;
	z-index: 1;
	top: 50%;
	margin: 0 30px 0 5px;
	transform: translateY(-50%);
	display: -webkit-box;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	span {
		margin-left: 2px;
		margin-bottom: 2px;
	}
}
</style>
