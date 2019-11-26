<template>
	<div class="navbar">
		<hamburger
			:is-active="sidebar.opened"
			class="hamburger-container"
			@toggleClick="toggleSideBar"
		/>

		<breadcrumb class="breadcrumb-container" />

		<div class="right-menu">
			<template>
				<!-- <search id="header-search" class="right-menu-item" /> -->

				<screenfull class="right-menu-item hover-effect" v-if="isExt" />

			</template>

			<el-dropdown class="avatar-container" trigger="click" v-if="isExt">
				<div class="avatar-wrapper">
					<span class="user-name">{{ userInfo.userName }}</span>
					<svg-icon icon-class="user-pic" class="user-avatar" />
					<i class="el-icon-caret-bottom" />
				</div>
				<el-dropdown-menu slot="dropdown" class="user-dropdown">
					<router-link class="inlineBlock" to="/">
						<el-dropdown-item>
							{{ $t("navbar.home") }}
						</el-dropdown-item>
					</router-link>
					<el-dropdown-item divided>
						<span style="display:block;" @click="logout"> {{ $t("navbar.logout") }}</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from './breadcrumb'
import Hamburger from './hamburger'
import Screenfull from './screenfull'
// import Search from "./HeaderSearch";
import utils from 'utils'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
    // Search
  },
  computed: {
    isExt() {
      const token = utils.getUrlParam('token')
      return !token
    },
    ...mapGetters(['sidebar', 'device', 'userInfo'])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
	height: 50px;
	overflow: hidden;
	position: relative;
	background: @white;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

	.hamburger-container {
		line-height: 46px;
		height: 100%;
		float: left;
		cursor: pointer;
		transition: background 0.3s;
		-webkit-tap-highlight-color: transparent;
		padding: 5px 10px;

		&:hover {
			background: rgba(0, 0, 0, 0.025);
		}
	}

	.breadcrumb-container {
		float: left;
	}

	.errLog-container {
		display: inline-block;
		vertical-align: top;
	}

	.right-menu {
		float: right;
		height: 100%;

		&:focus {
			outline: none;
		}

		.right-menu-item {
			line-height: 50px;
			display: inline-block;
			padding: 0 8px;
			font-size: 18px;
			color: #5a5e66;
			vertical-align: top;

			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				&:hover {
					background: rgba(0, 0, 0, 0.025);
				}
			}
		}

		.avatar-container {
			margin-right: 20px;
			vertical-align: top;
			.avatar-wrapper {
				margin-top: 5px;
				position: relative;
				.user-name {
					display: inline-block;
					margin-right: 5px;
					text-align: right;
					padding-top: 13px;
				}

				.user-avatar {
					cursor: pointer;
					width: 40px;
					height: 40px;
					border-radius: 10px;
					vertical-align: top;
				}

				.el-icon-caret-bottom {
					cursor: pointer;
					position: absolute;
					right: -5px;
					top: 30px;
					font-size: 12px;
				}
			}
		}
	}
}
</style>
