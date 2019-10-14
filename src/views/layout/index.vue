<template>
	<div :class="classObj" class="app-wrapper clearfix">
		<div
			v-if="device === 'mobile' && sidebar.opened"
			class="drawer-bg"
			@click="handleClickOutside"
		/>
		<sidebar class="sidebar-container" />
		<div :class="{ hasTagsView: needTagsView }" class="main-container">
			<div :class="{ 'fixed-header': fixedHeader }">
				<navbar />
				<tags-view v-if="needTagsView" />
			</div>
			<app-main />
			<right-panel v-if="showSettings">
				<settings />
			</right-panel>
      <!-- <div class="footer">云尚星科技有限公司</div> -->
		</div>
	</div>
</template>

<script>
import RightPanel from 'components/rightPanel'
import { Navbar, Sidebar, AppMain, TagsView, Settings } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    RightPanel,
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    Settings
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="less" scoped>
.app-wrapper {
	position: relative;
	height: 100%;
	width: 100%;

}

.drawer-bg {
	background: #000;
	opacity: 0.3;
	width: 100%;
	top: 0;
	height: 100%;
	position: absolute;
	z-index: 999;
}

.fixed-header {
	position: fixed;
  right: 0;
  top: 0;
	z-index: 9;
	width: calc(100% - @sideBarWidth);
	transition: width 0.28s;
}

.footer{
  position: relative;
  bottom: 0;
  height: 40px;
  line-height: 40px;
	overflow: hidden;
  background: @white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  text-align: center;
}

.hideSidebar .fixed-header {
	width: calc(100% - 54px);
}
</style>
